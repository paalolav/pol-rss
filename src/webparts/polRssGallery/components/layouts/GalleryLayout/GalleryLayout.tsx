/**
 * GalleryLayout Component
 *
 * A masonry-style image grid layout for RSS feed items.
 * Images are the hero - titles shown on hover or below.
 *
 * Features:
 * - Responsive grid with configurable columns
 * - Container query-based responsiveness
 * - Hover effects with title overlay
 * - Lazy loading images
 * - Skeleton loading state
 * - Empty state for items without images
 */

import * as React from 'react';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { IRssItem } from '../../IRssItem';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import { GalleryItem, TitlePosition, GalleryAspectRatio } from './GalleryItem';
import { GallerySkeleton } from './GallerySkeleton';
import styles from './GalleryLayout.module.scss';

/**
 * Column count options
 */
export type GalleryColumns = 'auto' | 2 | 3 | 4;

/**
 * Gap size options
 */
export type GalleryGap = 'sm' | 'md' | 'lg';

/**
 * Props for GalleryLayout component
 */
export interface IGalleryLayoutProps {
  /**
   * RSS feed items to display
   */
  items: IRssItem[];
  /**
   * Number of columns (or 'auto' for responsive)
   * @default 'auto'
   */
  columns?: GalleryColumns;
  /**
   * Gap between items
   * @default 'md'
   */
  gap?: GalleryGap;
  /**
   * How to display titles
   * @default 'below'
   */
  showTitles?: TitlePosition;
  /**
   * Image aspect ratio
   * @default '4:3'
   */
  aspectRatio?: GalleryAspectRatio;
  /**
   * Fallback image URL for items without images
   */
  fallbackImageUrl?: string;
  /**
   * Whether to force fallback image for all items
   * @default false
   */
  forceFallback?: boolean;
  /**
   * Whether to filter out items without images
   * @default true
   */
  filterNoImages?: boolean;
  /**
   * Whether the component is loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Number of skeleton items to show when loading
   * @default 8
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
 * Gap size CSS values
 */
const gapValues: Record<GalleryGap, string> = {
  sm: '8px',
  md: '16px',
  lg: '24px'
};

/**
 * GalleryLayout component
 */
export const GalleryLayout: React.FC<IGalleryLayoutProps> = ({
  items,
  columns = 'auto',
  gap = 'md',
  showTitles = 'below',
  aspectRatio = '4:3',
  fallbackImageUrl,
  forceFallback = false,
  filterNoImages = true,
  isLoading = false,
  skeletonCount = 8,
  onItemClick,
  className = '',
  testId = 'gallery-layout'
}) => {
  // Key for forcing re-render when forceFallback changes
  const [layoutKey, setLayoutKey] = useState(0);
  useEffect(() => {
    setLayoutKey(prev => prev + 1);
  }, [forceFallback]);

  // Filter items - either filter out those without images, or include all
  const displayItems = useMemo(() => {
    if (!items) return [];

    // If force fallback is on or we have a fallback URL, show all items
    if (forceFallback || !filterNoImages) {
      return items;
    }

    // Otherwise filter to only items with images or fallback available
    return items.filter(item => item.imageUrl || fallbackImageUrl);
  }, [items, forceFallback, filterNoImages, fallbackImageUrl]);

  // Handle item click
  const handleItemClick = useCallback((item: IRssItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);

  // CSS custom properties for grid
  const gridStyle: React.CSSProperties = {
    '--gallery-columns': columns === 'auto' ? 'auto-fill' : columns,
    '--gallery-gap': gapValues[gap]
  } as React.CSSProperties;

  // Container classes
  const containerClasses = [
    styles.gallery,
    columns !== 'auto' ? styles[`columns-${columns}`] : '',
    className
  ].filter(Boolean).join(' ');

  // Loading state
  if (isLoading) {
    return (
      <div
        className={containerClasses}
        style={gridStyle}
        data-testid={testId}
      >
        <GallerySkeleton
          count={skeletonCount}
          aspectRatio={aspectRatio}
          showTitles={showTitles}
          testId={`${testId}-skeleton`}
        />
      </div>
    );
  }

  // Empty state
  if (!displayItems || displayItems.length === 0) {
    return (
      <div className={className} data-testid={testId}>
        <NoItemsEmptyState />
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={gridStyle}
      data-testid={testId}
      key={layoutKey}
    >
      {displayItems.map((item, index) => (
        <GalleryItem
          key={`${item.link}-${index}`}
          item={item}
          showTitle={showTitles}
          aspectRatio={aspectRatio}
          fallbackImageUrl={fallbackImageUrl}
          forceFallback={forceFallback}
          onClick={onItemClick ? handleItemClick : undefined}
          testId={`${testId}-item-${index}`}
        />
      ))}
    </div>
  );
};

export default React.memo(GalleryLayout);
