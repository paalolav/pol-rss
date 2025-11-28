import * as React from 'react';
import styles from './RssFeed.module.scss';
/**
 * OfflineBanner Component
 *
 * Displays a banner when the user is offline, optionally showing
 * information about cached content being displayed.
 */
export const OfflineBanner = ({ isOffline, showingCached = false, lastFetched }) => {
    if (!isOffline) {
        return null;
    }
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
    return (React.createElement("div", { className: styles.offlineBanner, role: "status", "aria-live": "polite" },
        React.createElement("i", { className: "ms-Icon ms-Icon--WifiWarning", "aria-hidden": "true" }),
        React.createElement("span", null,
            "You are offline.",
            showingCached && lastFetched && (React.createElement(React.Fragment, null,
                " Showing cached content from ",
                getRelativeTime(lastFetched),
                ".")),
            showingCached && !lastFetched && (React.createElement(React.Fragment, null, " Showing cached content.")),
            !showingCached && (React.createElement(React.Fragment, null, " Content will refresh when you reconnect.")))));
};
export default OfflineBanner;
//# sourceMappingURL=OfflineBanner.js.map