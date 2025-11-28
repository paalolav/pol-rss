/**
 * MinimalLayout Component
 *
 * Ultra-compact text-only layout for displaying RSS feed items.
 * Perfect for sidebar (1/3 column) views and narrow spaces.
 *
 * Features:
 * - No images (text-only)
 * - Minimal spacing and padding
 * - Efficient use of vertical space
 * - Clean, professional design
 * - Optimized for narrow columns
 */

import * as React from 'react';
import { useCallback } from 'react';
import { IRssItem } from '../../IRssItem';
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
   * @default false - minimal layout typically hides description for compactness
   */
  showDescription?: boolean;
  /**
   * Whether to show source/publication name
   * @default false
   */
  showSource?: boolean;
  /**
   * Maximum characters for description truncation
   * @default 80
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
 * Format date for Norwegian locale
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Relative time for recent items
    if (diffHours < 1) return 'Akkurat nå';
    if (diffHours < 24) return `${diffHours} t siden`;
    if (diffDays < 7) return `${diffDays} d siden`;

    // Short date format
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return '';
  }
};

/**
 * Truncate text to a maximum length
 */
const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
};

/**
 * MinimalLayout component
 */
export const MinimalLayout: React.FC<IMinimalLayoutProps> = ({
  items,
  showPubDate = true,
  showDescription = false,
  showSource = false,
  truncateDescription = 80,
  isLoading = false,
  skeletonCount = 5,
  onItemClick,
  className = '',
  testId = 'minimal-layout'
}) => {
  // Handle item click
  const handleItemClick = useCallback((item: IRssItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((item: IRssItem, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onItemClick) {
        onItemClick(item);
      } else {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      }
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
            showDescription: false
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
    <nav
      className={containerClasses}
      data-testid={testId}
      role="navigation"
      aria-label="Nyhetsliste"
    >
      {items.map((item, index) => (
        <article
          key={`${item.link}-${index}`}
          className={styles.minimalItem}
          data-testid={`${testId}-item-${index}`}
        >
          <a
            href={item.link}
            className={styles.itemLink}
            onClick={(e) => handleItemClick(item, e)}
            onKeyDown={(e) => handleKeyDown(item, e)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.title}
          >
            <h3 className={styles.itemTitle}>
              {item.title}
            </h3>
            {showDescription && item.description && (
              <p className={styles.itemDescription}>
                {truncateText(item.description.replace(/<[^>]*>/g, ''), truncateDescription)}
              </p>
            )}
            {(showPubDate || showSource) && (
              <div className={styles.itemMeta}>
                {showPubDate && item.pubDate && (
                  <time className={styles.itemDate} dateTime={item.pubDate}>
                    {formatDate(item.pubDate)}
                  </time>
                )}
                {showSource && item.author && (
                  <span className={styles.itemSource}>{item.author}</span>
                )}
              </div>
            )}
          </a>
        </article>
      ))}
    </nav>
  );
};

export default React.memo(MinimalLayout);
