import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
import { RssError } from '../errors/errorTypes';
import { IRssItem } from './IRssItem';

/**
 * Props for FallbackContent component
 */
export interface IFallbackContentProps {
  /** Current error (if any) */
  error?: RssError | null;
  /** Cached items to display */
  cachedItems?: IRssItem[];
  /** When the cached content was last fetched */
  lastFetched?: Date | null;
  /** Whether currently loading */
  isLoading?: boolean;
  /** Callback to retry loading */
  onRetry?: () => void;
  /** Callback to open settings */
  onOpenSettings?: () => void;
  /** Whether the feed URL is configured */
  hasUrl?: boolean;
}

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
export const FallbackContent: React.FC<IFallbackContentProps> = ({
  error,
  cachedItems,
  lastFetched,
  isLoading = false,
  onRetry,
  onOpenSettings,
  hasUrl = true
}) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <i className="ms-Icon ms-Icon--Sync" aria-hidden="true" />
        <span>{strings.LoadingMessage}</span>
      </div>
    );
  }

  // Show cached content with staleness notice
  if (cachedItems && cachedItems.length > 0 && error) {
    return (
      <div className={styles.fallbackContainer}>
        <div className={styles.stalenessNotice} role="alert">
          <i className="ms-Icon ms-Icon--Warning" aria-hidden="true" />
          <span>
            Showing cached content from {lastFetched ? getRelativeTime(lastFetched) : 'earlier'}.
            {error.userMessage && ` ${error.userMessage}`}
          </span>
          {onRetry && (
            <button className={styles.retryButton} onClick={onRetry}>
              {strings.RetryButtonText}
            </button>
          )}
        </div>
        {/* The parent component should render the cached items in the appropriate layout */}
      </div>
    );
  }

  // Show empty state - no URL configured
  if (!hasUrl) {
    return (
      <div className={styles.noItems} role="status">
        <i className="ms-Icon ms-Icon--Settings" aria-hidden="true" />
        <h3>Configure RSS Feed</h3>
        <p>Enter a feed URL in the web part settings to display content.</p>
        {onOpenSettings && (
          <button className={styles.actionButton} onClick={onOpenSettings}>
            Open Settings
          </button>
        )}
      </div>
    );
  }

  // Show empty state - no items
  if (!cachedItems || cachedItems.length === 0) {
    return (
      <div className={styles.noItems} role="status">
        <i className="ms-Icon ms-Icon--FeedbackResponseSolid" aria-hidden="true" />
        <h3>{strings.NoItemsMessage}</h3>
        {error ? (
          <>
            <p>{error.userMessage}</p>
            {onRetry && (
              <button className={styles.retryButton} onClick={onRetry}>
                {strings.RetryButtonText}
              </button>
            )}
          </>
        ) : (
          <p>The feed has no items to display.</p>
        )}
      </div>
    );
  }

  // Default - should not reach here
  return null;
};

/**
 * Skeleton loader for feed items
 */
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className={styles.skeletonContainer} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonItem}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FallbackContent;
