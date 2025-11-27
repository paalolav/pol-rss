/**
 * MinimalLayout Component
 *
 * A compact text-only layout for displaying RSS feed items.
 * No images, just headline, short description, and date.
 * Perfect for sidebar (1/3 column) views.
 *
 * Features:
 * - No images (text-only)
 * - Compact spacing
 * - Short description (100 chars max)
 * - Optimized for narrow columns
 */

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IRssItem } from '../../IRssItem';
import { FeedItem } from '../../shared/FeedItem';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './MinimalLayout.module.scss';

/**
 * Props for MinimalLayout component
 */
export interface IMinimalLayoutProps {
  /**
   * RSS feed items to display
   */
  items: IRssItem[];
  /**
   * Whether to show publication date
   * @default true
   */
  showPubDate?: boolean;
  /**
   * Whether to show description
   * @default true
   */
  showDescription?: boolean;
  /**
   * Maximum characters for description truncation
   * @default 100
   */
  truncateDescription?: number;
  /**
   * Whether the component is loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Number of skeleton items to show when loading
   * @default 5
   */
  skeletonCount?: number;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: IRssItem) => void;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
}

/**
 * MinimalLayout component
 */
export const MinimalLayout: React.FC<IMinimalLayoutProps> = ({
  items,
  showPubDate = true,
  showDescription = true,
  truncateDescription = 100,
  isLoading = false,
  skeletonCount = 5,
  onItemClick,
  className = '',
  testId = 'minimal-layout'
}) => {
  // Key for forcing re-render
  const [layoutKey, setLayoutKey] = useState(0);
  useEffect(() => {
    setLayoutKey(prev => prev + 1);
  }, []);

  // Handle item click
  const handleItemClick = useCallback((item: IRssItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  // Container classes
  const containerClasses = [
    styles.minimalLayout,
    className
  ].filter(Boolean).join(' ');

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses} data-testid={testId}>
        <SkeletonGrid
          count={skeletonCount}
          type="list"
          itemProps={{
            showThumbnail: false,
            showDescription
          }}
          testId={`${testId}-skeleton`}
        />
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={containerClasses} data-testid={testId}>
        <NoItemsEmptyState />
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      data-testid={testId}
      key={layoutKey}
      role="list"
      aria-label="Nyhetsliste (minimal visning)"
    >
      {items.map((item, index) => (
        <div
          key={`${item.link}-${index}`}
          className={styles.minimalItem}
          role="listitem"
        >
          <FeedItem
            item={item}
            variant="list"
            showImage={false}
            showDescription={showDescription}
            showDate={showPubDate}
            onItemClick={handleItemClick}
            descriptionTruncation={{
              maxChars: truncateDescription,
              maxLines: 2
            }}
            testId={`${testId}-item-${index}`}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(MinimalLayout);
