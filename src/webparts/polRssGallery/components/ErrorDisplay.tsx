import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
import {
  RssError,
  RssErrorCode,
  RssErrorSeverity,
  RssErrorAction,
  isRetryable,
  getMaxRetries
} from '../errors/errorTypes';

/**
 * Props for ErrorDisplay component
 */
export interface IErrorDisplayProps {
  /** The error to display */
  error: RssError;
  /** Retry count (for showing retry progress) */
  retryCount?: number;
  /** Whether currently retrying */
  isRetrying?: boolean;
  /** Seconds until next auto-retry */
  nextRetryIn?: number | null;
  /** Callback when action button is clicked */
  onAction?: (action: RssErrorAction) => void;
  /** Whether to show technical details */
  showDetails?: boolean;
  /** Compact mode for inline display */
  compact?: boolean;
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
 * ErrorDisplay Component
 *
 * A reusable component for displaying errors with user-friendly messages,
 * appropriate icons based on severity, and action buttons for recovery.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={myError}
 *   onAction={(action) => handleAction(action)}
 * />
 * ```
 */
export const ErrorDisplay: React.FC<IErrorDisplayProps> = ({
  error,
  retryCount = 0,
  isRetrying = false,
  nextRetryIn = null,
  onAction,
  showDetails = true,
  compact = false
}) => {
  const icon = SEVERITY_ICONS[error.severity];
  const maxRetries = getMaxRetries(error);
  const canRetry = isRetryable(error) && retryCount < maxRetries;

  const getIconClassName = (): string => {
    const baseClass = styles.errorIcon;
    switch (error.severity) {
      case RssErrorSeverity.WARNING:
        return `${baseClass} ${styles.warning}`;
      case RssErrorSeverity.CRITICAL:
        return `${baseClass} ${styles.critical}`;
      default:
        return baseClass;
    }
  };

  const getErrorTitle = (): string => {
    switch (error.code) {
      case RssErrorCode.NETWORK_CORS_BLOCKED:
      case RssErrorCode.NETWORK_PROXY_FAILED:
      case RssErrorCode.NETWORK_TIMEOUT:
      case RssErrorCode.NETWORK_HTTP_ERROR:
      case RssErrorCode.NETWORK_CONNECTION_REFUSED:
      case RssErrorCode.NETWORK_DNS_FAILED:
      case RssErrorCode.NETWORK_SSL_ERROR:
      case RssErrorCode.NETWORK_UNKNOWN:
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
  };

  const handleAction = (action: RssErrorAction): void => {
    if (onAction) {
      onAction(action);
    }
  };

  if (compact) {
    return (
      <div className={styles.error} role="alert">
        <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
        <span>{error.userMessage}</span>
        {error.suggestedActions && error.suggestedActions.length > 0 && (
          <button
            className={styles.retryButton}
            onClick={() => handleAction(error.suggestedActions![0])}
            disabled={isRetrying}
          >
            {error.suggestedActions[0].label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.errorContainer} role="alert" aria-live="polite">
      <div className={styles.errorContent}>
        <i
          className={`ms-Icon ms-Icon--${icon} ${getIconClassName()}`}
          aria-hidden="true"
        />
        <h3 className={styles.errorTitle}>{getErrorTitle()}</h3>
        <p className={styles.errorMessage}>{error.userMessage}</p>

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
        {error.suggestedActions && error.suggestedActions.length > 0 && (
          <div className={styles.errorActions}>
            {error.suggestedActions.map((action) => (
              <button
                key={action.id}
                className={`${styles.actionButton} ${action.primary ? styles.primary : ''}`}
                onClick={() => handleAction(action)}
                disabled={isRetrying || (action.id === 'retry' && !canRetry)}
              >
                {action.icon && (
                  <i className={`ms-Icon ms-Icon--${action.icon}`} aria-hidden="true" />
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Retry count info */}
        {retryCount > 0 && maxRetries > 0 && (
          <div className={styles.errorCode}>
            {retryCount}/{maxRetries} {strings.AutoRetryInProgress}
          </div>
        )}

        {/* Technical details (collapsible) */}
        {showDetails && error.details?.stack && (
          <details className={styles.errorDetails}>
            <summary>{strings.ErrorParsingFeed}</summary>
            <pre>{error.message}</pre>
            {error.details.feedUrl && <pre>URL: {error.details.feedUrl}</pre>}
          </details>
        )}

        {/* Error code for support */}
        <div className={styles.errorCode}>Error Code: {error.code}</div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
