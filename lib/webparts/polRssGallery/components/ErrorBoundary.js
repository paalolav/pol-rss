import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
import { RssErrorCode, RssErrorSeverity, createRssErrorFromError, isRssError, isRetryable, getRetryDelay, getMaxRetries } from '../errors/errorTypes';
/**
 * Icon mapping for error severity
 */
const SEVERITY_ICONS = {
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
export class RssErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.retryTimer = null;
        this.countdownTimer = null;
        this.state = {
            hasError: false,
            error: null,
            retryCount: 0,
            lastRetry: null,
            isRetrying: false,
            nextRetryIn: null
        };
        this.handleRetry = () => {
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
        this._handleReset = () => {
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
        this.handleAction = (action) => {
            const { error } = this.state;
            const { onAction } = this.props;
            if (!error)
                return;
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
    }
    static getDerivedStateFromError(error) {
        // Convert native error to RssError
        const rssError = isRssError(error) ? error : createRssErrorFromError(error);
        return {
            hasError: true,
            error: rssError
        };
    }
    componentDidCatch(error, errorInfo) {
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
    componentWillUnmount() {
        this.clearTimers();
    }
    clearTimers() {
        if (this.retryTimer) {
            window.clearTimeout(this.retryTimer);
            this.retryTimer = null;
        }
        if (this.countdownTimer) {
            window.clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }
    scheduleAutoRetry(error) {
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
                var _a;
                const newValue = ((_a = prevState.nextRetryIn) !== null && _a !== void 0 ? _a : 0) - 1;
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
    getIconClassName(severity) {
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
    renderDefaultFallback() {
        var _a, _b;
        const { error, retryCount, isRetrying, nextRetryIn } = this.state;
        if (!error) {
            return null;
        }
        const icon = SEVERITY_ICONS[error.severity];
        const maxRetries = getMaxRetries(error);
        const canRetry = isRetryable(error) && retryCount < maxRetries;
        return (React.createElement("div", { className: styles.errorContainer, role: "alert", "aria-live": "polite" },
            React.createElement("div", { className: styles.errorContent },
                React.createElement("i", { className: `ms-Icon ms-Icon--${icon} ${this.getIconClassName(error.severity)}`, "aria-hidden": "true" }),
                React.createElement("h3", { className: styles.errorTitle }, this.getErrorTitle(error)),
                React.createElement("p", { className: styles.errorMessage }, error.userMessage),
                nextRetryIn !== null && (React.createElement("div", { className: styles.retryStatus },
                    React.createElement("span", { className: styles.retrySpinner }),
                    React.createElement("span", null,
                        strings.AutoRetryScheduled,
                        " (",
                        nextRetryIn,
                        "s)"))),
                isRetrying && (React.createElement("div", { className: styles.retryStatus },
                    React.createElement("span", { className: styles.retrySpinner }),
                    React.createElement("span", null, strings.AutoRetryAttempting))),
                React.createElement("div", { className: styles.errorActions }, (_a = error.suggestedActions) === null || _a === void 0 ? void 0 : _a.map((action) => (React.createElement("button", { key: action.id, className: `${styles.actionButton} ${action.primary ? styles.primary : ''}`, onClick: () => this.handleAction(action), disabled: isRetrying || (action.id === 'retry' && !canRetry) },
                    action.icon && (React.createElement("i", { className: `ms-Icon ms-Icon--${action.icon}`, "aria-hidden": "true" })),
                    action.label)))),
                retryCount > 0 && (React.createElement("div", { className: styles.errorCode },
                    retryCount,
                    "/",
                    maxRetries,
                    " ",
                    strings.AutoRetryInProgress)),
                ((_b = error.details) === null || _b === void 0 ? void 0 : _b.stack) && (React.createElement("details", { className: styles.errorDetails },
                    React.createElement("summary", null, strings.ErrorParsingFeed),
                    React.createElement("pre", null, error.message),
                    error.details.feedUrl && React.createElement("pre", null,
                        "URL: ",
                        error.details.feedUrl))),
                React.createElement("div", { className: styles.errorCode },
                    "Error Code: ",
                    error.code))));
    }
    getErrorTitle(error) {
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
    render() {
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
//# sourceMappingURL=ErrorBoundary.js.map