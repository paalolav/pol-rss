import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
import { RssErrorCode, RssErrorSeverity, isRetryable, getMaxRetries } from '../errors/errorTypes';
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
export const ErrorDisplay = ({ error, retryCount = 0, isRetrying = false, nextRetryIn = null, onAction, showDetails = true, compact = false }) => {
    var _a;
    const icon = SEVERITY_ICONS[error.severity];
    const maxRetries = getMaxRetries(error);
    const canRetry = isRetryable(error) && retryCount < maxRetries;
    const getIconClassName = () => {
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
    const getErrorTitle = () => {
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
    const handleAction = (action) => {
        if (onAction) {
            onAction(action);
        }
    };
    if (compact) {
        return (React.createElement("div", { className: styles.error, role: "alert" },
            React.createElement("i", { className: `ms-Icon ms-Icon--${icon}`, "aria-hidden": "true" }),
            React.createElement("span", null, error.userMessage),
            error.suggestedActions && error.suggestedActions.length > 0 && (React.createElement("button", { className: styles.retryButton, onClick: () => handleAction(error.suggestedActions[0]), disabled: isRetrying }, error.suggestedActions[0].label))));
    }
    return (React.createElement("div", { className: styles.errorContainer, role: "alert", "aria-live": "polite" },
        React.createElement("div", { className: styles.errorContent },
            React.createElement("i", { className: `ms-Icon ms-Icon--${icon} ${getIconClassName()}`, "aria-hidden": "true" }),
            React.createElement("h3", { className: styles.errorTitle }, getErrorTitle()),
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
            error.suggestedActions && error.suggestedActions.length > 0 && (React.createElement("div", { className: styles.errorActions }, error.suggestedActions.map((action) => (React.createElement("button", { key: action.id, className: `${styles.actionButton} ${action.primary ? styles.primary : ''}`, onClick: () => handleAction(action), disabled: isRetrying || (action.id === 'retry' && !canRetry) },
                action.icon && (React.createElement("i", { className: `ms-Icon ms-Icon--${action.icon}`, "aria-hidden": "true" })),
                action.label))))),
            retryCount > 0 && maxRetries > 0 && (React.createElement("div", { className: styles.errorCode },
                retryCount,
                "/",
                maxRetries,
                " ",
                strings.AutoRetryInProgress)),
            showDetails && ((_a = error.details) === null || _a === void 0 ? void 0 : _a.stack) && (React.createElement("details", { className: styles.errorDetails },
                React.createElement("summary", null, strings.ErrorParsingFeed),
                React.createElement("pre", null, error.message),
                error.details.feedUrl && React.createElement("pre", null,
                    "URL: ",
                    error.details.feedUrl))),
            React.createElement("div", { className: styles.errorCode },
                "Error Code: ",
                error.code))));
};
export default ErrorDisplay;
//# sourceMappingURL=ErrorDisplay.js.map