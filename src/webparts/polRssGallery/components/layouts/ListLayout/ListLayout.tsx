/**
 * ListLayout Component
 *
 * A vertical list layout for displaying RSS feed items.
 * Includes thumbnail positioning options and compact mode.
 *
 * Features:
 * - Thumbnail position (left, right, none)
 * - Thumbnail size options
 * - Compact mode
 * - Dividers between items
 * - Skeleton loading state
 */

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IRssItem } from '../../IRssItem';
import { FeedItem } from '../../shared/FeedItem';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import { AspectRatio } from '../../ResponsiveImage';
import styles from './ListLayout.module.scss';

/**
 * Thumbnail position option
 */
export type ThumbnailPosition = 'left' | 'right' | 'none';

/**
 * Thumbnail size option
 */
export type ThumbnailSize = 'sm' | 'md' | 'lg';

/**
 * Props for ListLayout component
 */
export interface IListLayoutProps {
  /**
   * RSS feed items to display
   */
  items: IRssItem[];
  /**
   * Thumbnail position
   * @default 'left'
   */
  thumbnailPosition?: ThumbnailPosition;
  /**
   * Thumbnail size
   * @default 'md'
   */
  thumbnailSize?: ThumbnailSize;
  /**
   * Whether to use compact spacing
   * @default false
   */
  compact?: boolean;
  /**
   * Whether to show dividers between items
   * @default true
   */
  showDividers?: boolean;
  /**
   * Fallback image URL
   */
  fallbackImageUrl?: string;
  /**
   * Whether to force fallback image
   * @default false
   */
  forceFallback?: boolean;
  /**
   * Whether to hide all images
   * @default false
   */
  hideImages?: boolean;
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
   * Whether to show source/publication name
   * @default false
   */
  showSource?: boolean;
  /**
   * Maximum characters for description truncation
   * @default 200
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
 * Thumbnail size to aspect ratio mapping
 */
const thumbnailSizeToAspectRatio: Record<ThumbnailSize, AspectRatio> = {
  sm: '1:1',
  md: '4:3',
  lg: '16:9'
};

/**
 * ListLayout component
 */
export const ListLayout: React.FC<IListLayoutProps> = ({
  items,
  thumbnailPosition = 'left',
  thumbnailSize = 'md',
  compact = false,
  showDividers = true,
  fallbackImageUrl,
  forceFallback = false,
  hideImages = false,
  showPubDate = true,
  showDescription = true,
  showSource = false,
  truncateDescription = 200,
  isLoading = false,
  skeletonCount = 5,
  onItemClick,
  className = '',
  testId = 'list-layout'
}) => {
  // Key for forcing re-render when forceFallback changes
  const [layoutKey, setLayoutKey] = useState(0);
  useEffect(() => {
    setLayoutKey(prev => prev + 1);
  }, [forceFallback]);

  // Handle item click
  const handleItemClick = useCallback((item: IRssItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  // Cast styles to allow dynamic access
  const stylesAny = styles as Record<string, string>;

  // Thumbnail position class mapping
  const thumbnailPositionClasses: Record<ThumbnailPosition, string> = {
    left: stylesAny.thumbnailLeft || '',
    right: stylesAny.thumbnailRight || '',
    none: ''
  };

  // Thumbnail size class mapping
  const thumbnailSizeClasses: Record<ThumbnailSize, string> = {
    sm: stylesAny.thumbnailSizeSm || '',
    md: stylesAny.thumbnailSizeMd || '',
    lg: stylesAny.thumbnailSizeLg || ''
  };

  // Container classes
  const containerClasses = [
    styles.listLayout,
    compact ? (stylesAny.compact || '') : '',
    showDividers ? styles.withDividers : '',
    thumbnailPositionClasses[thumbnailPosition],
    thumbnailSizeClasses[thumbnailSize],
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
            showThumbnail: thumbnailPosition !== 'none',
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
      aria-label="Nyhetsliste"
    >
      {items.map((item, index) => (
        <div
          key={`${item.link}-${index}`}
          className={styles.listItem}
          role="listitem"
        >
          <FeedItem
            item={item}
            variant="list"
            showImage={!hideImages && thumbnailPosition !== 'none'}
            showDescription={showDescription}
            showDate={showPubDate}
            showSource={showSource}
            imageAspectRatio={thumbnailSizeToAspectRatio[thumbnailSize]}
            fallbackImageUrl={fallbackImageUrl}
            forceFallback={forceFallback}
            onItemClick={handleItemClick}
            descriptionTruncation={{
              maxChars: truncateDescription,
              maxLines: compact ? 2 : 3
            }}
            testId={`${testId}-item-${index}`}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ListLayout);
