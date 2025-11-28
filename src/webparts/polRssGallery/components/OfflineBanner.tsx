import * as React from 'react';
import styles from './RssFeed.module.scss';

/**
 * Props for OfflineBanner component
 */
export interface IOfflineBannerProps {
  /** Whether to show the banner (true = offline) */
  isOffline: boolean;
  /** Whether showing cached content */
  showingCached?: boolean;
  /** Last successful fetch time */
  lastFetched?: Date | null;
}

/**
 * OfflineBanner Component
 *
 * Displays a banner when the user is offline, optionally showing
 * information about cached content being displayed.
 */
export const OfflineBanner: React.FC<IOfflineBannerProps> = ({
  isOffline,
  showingCached = false,
  lastFetched
}) => {
  if (!isOffline) {
    return null;
  }

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className={styles.offlineBanner} role="status" aria-live="polite">
      <i className="ms-Icon ms-Icon--WifiWarning" aria-hidden="true" />
      <span>
        You are offline.
        {showingCached && lastFetched && (
          <> Showing cached content from {getRelativeTime(lastFetched)}.</>
        )}
        {showingCached && !lastFetched && (
          <> Showing cached content.</>
        )}
        {!showingCached && (
          <> Content will refresh when you reconnect.</>
        )}
      </span>
    </div>
  );
};

export default OfflineBanner;
