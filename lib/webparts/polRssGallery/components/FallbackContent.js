import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
/**
 * FallbackContent Component
 *
 * Displays meaningful content when the primary feed cannot be loaded.
 * Shows cached content if available, skeleton loaders while loading,
 * or helpful empty states with configuration guidance.
 *
 * Priority:
 * 1. Cached content with "last updated X ago" notice
 * 2. Skeleton loader with error message
 * 3. Empty state with configuration help
 */
export const FallbackContent = ({ error, cachedItems, lastFetched, isLoading = false, onRetry, onOpenSettings, hasUrl = true }) => {
    const getRelativeTime = (date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMins < 1)
            return 'just now';
        if (diffMins < 60)
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24)
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };
    // Show loading state
    if (isLoading) {
        return (React.createElement("div", { className: styles.loading, role: "status", "aria-live": "polite" },
            React.createElement("i", { className: "ms-Icon ms-Icon--Sync", "aria-hidden": "true" }),
            React.createElement("span", null, strings.LoadingMessage)));
    }
    // Show cached content with staleness notice
    if (cachedItems && cachedItems.length > 0 && error) {
        return (React.createElement("div", { className: styles.fallbackContainer },
            React.createElement("div", { className: styles.stalenessNotice, role: "alert" },
                React.createElement("i", { className: "ms-Icon ms-Icon--Warning", "aria-hidden": "true" }),
                React.createElement("span", null,
                    "Showing cached content from ",
                    lastFetched ? getRelativeTime(lastFetched) : 'earlier',
                    ".",
                    error.userMessage && ` ${error.userMessage}`),
                onRetry && (React.createElement("button", { className: styles.retryButton, onClick: onRetry }, strings.RetryButtonText)))));
    }
    // Show empty state - no URL configured
    if (!hasUrl) {
        return (React.createElement("div", { className: styles.noItems, role: "status" },
            React.createElement("i", { className: "ms-Icon ms-Icon--Settings", "aria-hidden": "true" }),
            React.createElement("h3", null, "Configure RSS Feed"),
            React.createElement("p", null, "Enter a feed URL in the web part settings to display content."),
            onOpenSettings && (React.createElement("button", { className: styles.actionButton, onClick: onOpenSettings }, "Open Settings"))));
    }
    // Show empty state - no items
    if (!cachedItems || cachedItems.length === 0) {
        return (React.createElement("div", { className: styles.noItems, role: "status" },
            React.createElement("i", { className: "ms-Icon ms-Icon--FeedbackResponseSolid", "aria-hidden": "true" }),
            React.createElement("h3", null, strings.NoItemsMessage),
            error ? (React.createElement(React.Fragment, null,
                React.createElement("p", null, error.userMessage),
                onRetry && (React.createElement("button", { className: styles.retryButton, onClick: onRetry }, strings.RetryButtonText)))) : (React.createElement("p", null, "The feed has no items to display."))));
    }
    // Default - should not reach here
    return null;
};
/**
 * Skeleton loader for feed items
 */
export const FeedSkeleton = ({ count = 3 }) => {
    return (React.createElement("div", { className: styles.skeletonContainer, "aria-hidden": "true" }, Array.from({ length: count }).map((_, index) => (React.createElement("div", { key: index, className: styles.skeletonItem },
        React.createElement("div", { className: styles.skeletonImage }),
        React.createElement("div", { className: styles.skeletonContent },
            React.createElement("div", { className: styles.skeletonTitle }),
            React.createElement("div", { className: styles.skeletonText }),
            React.createElement("div", { className: styles.skeletonText, style: { width: '60%' } })))))));
};
export default FallbackContent;
//# sourceMappingURL=FallbackContent.js.map