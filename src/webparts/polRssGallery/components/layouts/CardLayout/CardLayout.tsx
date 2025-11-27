/**
 * CardLayout Component
 *
 * A responsive grid layout for displaying RSS feed items as cards.
 * Uses ResponsiveGrid for container-based responsive behavior.
 *
 * Features:
 * - Responsive grid layout
 * - Configurable columns and gap
 * - Card hover effects
 * - Lazy loading images
 * - Skeleton loading state
 */

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { IRssItem } from '../../IRssItem';
import { ResponsiveGrid, GapSize } from '../../ResponsiveGrid';
import { FeedItem } from '../../shared/FeedItem';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import { AspectRatio } from '../../ResponsiveImage';
import styles from './CardLayout.module.scss';

/**
 * Card size preset
 */
export type CardSize = 'sm' | 'md' | 'lg';

/**
 * Props for CardLayout component
 */
export interface ICardLayoutProps {
  /**
   * RSS feed items to display
   */
  items: IRssItem[];
  /**
   * Number of columns (or 'auto' for responsive)
   * @default 'auto'
   */
  columns?: 2 | 3 | 4 | 'auto';
  /**
   * Card size preset
   * @default 'md'
   */
  cardSize?: CardSize;
  /**
   * Gap between cards
   * @default 'md'
   */
  gap?: GapSize;
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
   * Maximum characters for description truncation
   * @default 150
   */
  truncateDescription?: number;
  /**
   * Image aspect ratio
   * @default '16:9'
   */
  imageAspectRatio?: AspectRatio;
  /**
   * Whether the component is loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Number of skeleton items to show when loading
   * @default 6
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
 * Card size to minimum width mapping
 */
const cardSizeToMinWidth: Record<CardSize, number> = {
  sm: 220,
  md: 280,
  lg: 340
};

/**
 * CardLayout component
 */
export const CardLayout: React.FC<ICardLayoutProps> = ({
  items,
  columns = 'auto',
  cardSize = 'md',
  gap = 'md',
  fallbackImageUrl,
  forceFallback = false,
  hideImages = false,
  showPubDate = true,
  showDescription = true,
  truncateDescription = 150,
  imageAspectRatio = '16:9',
  isLoading = false,
  skeletonCount = 6,
  onItemClick,
  className = '',
  testId = 'card-layout'
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

  // Calculate max columns
  const maxColumns = useMemo(() => {
    if (columns === 'auto') {
      return 4;
    }
    return columns;
  }, [columns]);

  // Get min item width
  const minItemWidth = useMemo(() => {
    return cardSizeToMinWidth[cardSize];
  }, [cardSize]);

  // Container classes
  const containerClasses = [
    styles.cardLayout,
    className
  ].filter(Boolean).join(' ');

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses} data-testid={testId}>
        <SkeletonGrid
          count={skeletonCount}
          type="card"
          itemProps={{
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
    <div className={containerClasses} data-testid={testId} key={layoutKey}>
      <ResponsiveGrid
        minItemWidth={minItemWidth}
        maxColumns={maxColumns}
        gap={gap}
        testId={`${testId}-grid`}
      >
        {items.map((item, index) => (
          <FeedItem
            key={`${item.link}-${index}`}
            item={item}
            variant="card"
            showImage={!hideImages}
            showDescription={showDescription}
            showDate={showPubDate}
            imageAspectRatio={imageAspectRatio}
            fallbackImageUrl={fallbackImageUrl}
            forceFallback={forceFallback}
            onItemClick={handleItemClick}
            descriptionTruncation={{
              maxChars: truncateDescription,
              maxLines: 3
            }}
            className={styles.card}
            testId={`${testId}-item-${index}`}
          />
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export default React.memo(CardLayout);
