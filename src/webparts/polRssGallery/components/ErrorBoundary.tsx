import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
import {
  RssError,
  RssErrorCode,
  RssErrorSeverity,
  RssErrorAction,
  createRssErrorFromError,
  isRssError,
  isRetryable,
  getRetryDelay,
  getMaxRetries
} from '../errors/errorTypes';

/**
 * Error boundary state interface
 */
interface IErrorBoundaryState {
  hasError: boolean;
  error: RssError | null;
  retryCount: number;
  lastRetry: Date | null;
  isRetrying: boolean;
  nextRetryIn: number | null;
}

/**
 * Error boundary props interface
 */
interface IErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback renderer */
  customFallback?: (error: RssError, retry: () => void) => React.ReactNode;
  /** Callback when error occurs */
  onError?: (error: RssError) => void;
  /** Callback when action button is clicked */
  onAction?: (actionId: string, error: RssError) => void;
  /** Whether to enable auto-retry for retryable errors */
  enableAutoRetry?: boolean;
  /** Feed URL for error context */
  feedUrl?: string;
}

/**
 * Icon mapping for error severity
 */
const SEVERITY_ICONS: Record<RssErrorSeverity, string> = {
  [RssErrorSeverity.INFO]: 'Info',
  [RssErrorSeverity.WARNING]: 'Warning',
  [RssErrorSeverity.ERROR]: 'ErrorBadge',
  [RssErrorSeverity.CRITICAL]: 'StatusErrorFull'
};

/**
 * Enhanced Error Boundary with structured error handling
 *
 * Features:
 * - Categorizes errors using RssError types
 * - Shows appropriate icons based on severity
 * - Supports retry with exponential backoff
 * - Provides action buttons for recovery
 * - Logs errors with context
 */
export class RssErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  private retryTimer: number | null = null;
  private countdownTimer: number | null = null;

  public state: IErrorBoundaryState = {
    hasError: false,
    error: null,
    retryCount: 0,
    lastRetry: null,
    isRetrying: false,
    nextRetryIn: null
  };

  public static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    // Convert native error to RssError
    const rssError = isRssError(error) ? error : createRssErrorFromError(error);

    return {
      hasError: true,
      error: rssError
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const rssError = isRssError(error) ? error : createRssErrorFromError(error, this.props.feedUrl);

    // Log the error
    console.error('RSS Gallery Error:', {
      error: rssError,
      errorInfo,
      timestamp: new Date().toISOString(),
      component: 'RssErrorBoundary',
      feedUrl: this.props.feedUrl
    });

    // Notify parent
    if (this.props.onError) {
      this.props.onError(rssError);
    }

    // Schedule auto-retry if enabled and error is retryable
    if (this.props.enableAutoRetry && isRetryable(rssError)) {
      this.scheduleAutoRetry(rssError);
    }
  }

  public componentWillUnmount(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.retryTimer) {
      window.clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.countdownTimer) {
      window.clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private scheduleAutoRetry(error: RssError): void {
    const maxRetries = getMaxRetries(error);
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    const delay = getRetryDelay(error, retryCount);

    // Set countdown
    this.setState({ nextRetryIn: Math.ceil(delay / 1000) });

    // Start countdown timer
    this.countdownTimer = window.setInterval(() => {
      this.setState(prevState => {
        const newValue = (prevState.nextRetryIn ?? 0) - 1;
        if (newValue <= 0) {
          if (this.countdownTimer) {
            window.clearInterval(this.countdownTimer);
            this.countdownTimer = null;
          }
          return { nextRetryIn: null };
        }
        return { nextRetryIn: newValue };
      });
    }, 1000);

    // Schedule retry
    this.retryTimer = window.setTimeout(() => {
      this.handleRetry();
    }, delay);
  }

  private handleRetry = (): void => {
    this.clearTimers();

    this.setState(prevState => ({
      hasError: false,
      error: null,
      isRetrying: true,
      retryCount: prevState.retryCount + 1,
      lastRetry: new Date(),
      nextRetryIn: null
    }));

    // Short delay to show the retrying state before re-rendering children
    setTimeout(() => {
      this.setState({ isRetrying: false });
    }, 100);
  };

  // @ts-expect-error Reserved for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _handleReset = (): void => {
    this.clearTimers();

    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      lastRetry: null,
      isRetrying: false,
      nextRetryIn: null
    });
  };

  private handleAction = (action: RssErrorAction): void => {
    const { error } = this.state;
    const { onAction } = this.props;

    if (!error) return;

    // Handle built-in actions
    switch (action.id) {
      case 'retry':
      case 'reset':
        this.handleRetry();
        break;
      case 'retry-recovery':
        // Let parent handle recovery mode
        if (onAction) {
          onAction(action.id, error);
        }
        this.handleRetry();
        break;
      default:
        // Pass other actions to parent
        if (onAction) {
          onAction(action.id, error);
        }
    }
  };

  private getIconClassName(severity: RssErrorSeverity): string {
    const baseClass = styles.errorIcon;
    switch (severity) {
      case RssErrorSeverity.WARNING:
        return `${baseClass} ${styles.warning}`;
      case RssErrorSeverity.CRITICAL:
        return `${baseClass} ${styles.critical}`;
      default:
        return baseClass;
    }
  }

  private renderDefaultFallback(): React.ReactNode {
    const { error, retryCount, isRetrying, nextRetryIn } = this.state;

    if (!error) {
      return null;
    }

    const icon = SEVERITY_ICONS[error.severity];
    const maxRetries = getMaxRetries(error);
    const canRetry = isRetryable(error) && retryCount < maxRetries;

    return (
      <div className={styles.errorContainer} role="alert" aria-live="polite">
        <div className={styles.errorContent}>
          <i
            className={`ms-Icon ms-Icon--${icon} ${this.getIconClassName(error.severity)}`}
            aria-hidden="true"
          />
          <h3 className={styles.errorTitle}>
            {this.getErrorTitle(error)}
          </h3>
          <p className={styles.errorMessage}>
            {error.userMessage}
          </p>

          {/* Retry status */}
          {nextRetryIn !== null && (
            <div className={styles.retryStatus}>
              <span className={styles.retrySpinner} />
              <span>{strings.AutoRetryScheduled} ({nextRetryIn}s)</span>
            </div>
          )}

          {isRetrying && (
            <div className={styles.retryStatus}>
              <span className={styles.retrySpinner} />
              <span>{strings.AutoRetryAttempting}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.errorActions}>
            {error.suggestedActions?.map((action) => (
              <button
                key={action.id}
                className={`${styles.actionButton} ${action.primary ? styles.primary : ''}`}
                onClick={() => this.handleAction(action)}
                disabled={isRetrying || (action.id === 'retry' && !canRetry)}
              >
                {action.icon && (
                  <i className={`ms-Icon ms-Icon--${action.icon}`} aria-hidden="true" />
                )}
                {action.label}
              </button>
            ))}
          </div>

          {/* Retry count info */}
          {retryCount > 0 && (
            <div className={styles.errorCode}>
              {retryCount}/{maxRetries} {strings.AutoRetryInProgress}
            </div>
          )}

          {/* Technical details (collapsible) */}
          {error.details?.stack && (
            <details className={styles.errorDetails}>
              <summary>{strings.ErrorParsingFeed}</summary>
              <pre>{error.message}</pre>
              {error.details.feedUrl && <pre>URL: {error.details.feedUrl}</pre>}
            </details>
          )}

          {/* Error code for support */}
          <div className={styles.errorCode}>
            Error Code: {error.code}
          </div>
        </div>
      </div>
    );
  }

  private getErrorTitle(error: RssError): string {
    // Map error codes to localized titles
    switch (error.code) {
      case RssErrorCode.NETWORK_CORS_BLOCKED:
      case RssErrorCode.NETWORK_PROXY_FAILED:
      case RssErrorCode.NETWORK_TIMEOUT:
      case RssErrorCode.NETWORK_HTTP_ERROR:
      case RssErrorCode.NETWORK_CONNECTION_REFUSED:
      case RssErrorCode.NETWORK_DNS_FAILED:
      case RssErrorCode.NETWORK_SSL_ERROR:
      case RssErrorCode.NETWORK_UNKNOWN:
        return strings.ErrorLoadingFeed;
      case RssErrorCode.NETWORK_OFFLINE:
        return strings.ErrorLoadingFeed;
      case RssErrorCode.PARSE_INVALID_XML:
      case RssErrorCode.PARSE_UNKNOWN_FORMAT:
      case RssErrorCode.PARSE_ENCODING_ERROR:
      case RssErrorCode.PARSE_VALIDATION_FAILED:
      case RssErrorCode.PARSE_RECOVERY_FAILED:
        return strings.ErrorParsingFeed;
      case RssErrorCode.PARSE_EMPTY_FEED:
      case RssErrorCode.PARSE_MISSING_ITEMS:
        return strings.NoItemsMessage;
      default:
        return strings.ErrorLoadingFeed;
    }
  }

  public render(): React.ReactNode {
    const { hasError, error, isRetrying } = this.state;
    const { customFallback, children } = this.props;

    if (hasError && error && !isRetrying) {
      return customFallback
        ? customFallback(error, this.handleRetry)
        : this.renderDefaultFallback();
    }

    return children;
  }
}

export default RssErrorBoundary;
