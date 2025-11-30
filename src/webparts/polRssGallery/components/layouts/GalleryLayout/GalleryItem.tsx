/**
 * GalleryItem Component
 *
 * Individual gallery item with image, hover effects, and title display options.
 * Designed for image-first display with minimal text.
 *
 * Features:
 * - Configurable title display (hover, below, none)
 * - Smooth hover animations
 * - Keyboard accessible
 * - Touch-friendly
 */

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { IRssItem } from '../../IRssItem';
import { sanitizer } from '../../../services/contentSanitizer';
import styles from './GalleryLayout.module.scss';

/**
 * Title display mode
 */
export type TitlePosition = 'hover' | 'below' | 'none';

/**
 * Gallery aspect ratio options
 */
export type GalleryAspectRatio = '1:1' | '4:3' | '16:9';

/**
 * Props for GalleryItem component
 */
export interface IGalleryItemProps {
  /**
   * RSS item data
   */
  item: IRssItem;
  /**
   * How to display the title
   * @default 'below'
   */
  showTitle: TitlePosition;
  /**
   * Image aspect ratio
   * @default '4:3'
   */
  aspectRatio: GalleryAspectRatio;
  /**
   * Fallback image URL when item has no image
   */
  fallbackImageUrl?: string;
  /**
   * Force using fallback image even if item has image
   * @default false
   */
  forceFallback?: boolean;
  /**
   * Whether to show the publication date
   * @default true
   */
  showDate?: boolean;
  /**
   * Whether to show the description
   * @default false
   */
  showDescription?: boolean;
  /**
   * Whether to show the source/publication name
   * @default false
   */
  showSource?: boolean;
  /**
   * Callback when item is clicked
   */
  onClick?: (item: IRssItem) => void;
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
  /**
   * Whether the theme is inverted (strong background)
   * @default false
   */
  isInverted?: boolean;
}

/**
 * Aspect ratio CSS values
 */
const aspectRatioValues: Record<GalleryAspectRatio, string> = {
  '1:1': '1/1',
  '4:3': '4/3',
  '16:9': '16/9'
};

/**
 * Title position CSS class mapping
 */
const titlePositionClasses: Record<TitlePosition, string> = {
  hover: 'title-hover',
  below: 'title-below',
  none: 'title-none'
};

/**
 * Format date for display
 */
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return '';
  }
};

/**
 * GalleryItem component
 */
/**
 * Truncate text to a maximum length
 */
const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Strip HTML tags from text
 */
const stripHtml = (html: string): string => {
  // Use sanitizer to clean HTML first, then strip tags
  const cleaned = sanitizer.sanitize(html);
  const temp = document.createElement('div');
  temp.innerHTML = cleaned;
  return temp.textContent || temp.innerText || '';
};

/**
 * GalleryItem component
 */
export const GalleryItem: React.FC<IGalleryItemProps> = ({
  item,
  showTitle,
  aspectRatio,
  fallbackImageUrl,
  forceFallback = false,
  showDate = true,
  showDescription = false,
  showSource = false,
  onClick,
  className = '',
  testId = 'gallery-item',
  isInverted = false
}) => {
  // Get image URL with fallback - if forceFallback is true, use fallbackImageUrl
  const imageUrl = forceFallback && fallbackImageUrl
    ? fallbackImageUrl
    : (item.imageUrl || fallbackImageUrl);

  // Handle click
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    } else if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [item, onClick]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Process description - strip HTML tags and truncate
  const processedDescription = useMemo(() => {
    if (!item.description) return '';
    return stripHtml(item.description);
  }, [item.description]);

  // Build class names - use type assertion to satisfy TypeScript
  const titleClass = titlePositionClasses[showTitle];
  const itemClasses = [
    styles.galleryItem,
    (styles as Record<string, string>)[titleClass],
    isInverted ? styles.inverted : '',
    className
  ].filter(Boolean).join(' ');

  // CSS custom properties for aspect ratio
  const imageWrapperStyle: React.CSSProperties = {
    '--aspect-ratio': aspectRatioValues[aspectRatio]
  } as React.CSSProperties;

  return (
    <article
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={item.title}
      data-testid={testId}
    >
      <div
        className={styles.imageWrapper}
        style={imageWrapperStyle}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            loading="lazy"
            className={styles.image}
            data-testid={`${testId}-image`}
          />
        ) : (
          <div
            className={styles.noImage}
            aria-hidden="true"
            data-testid={`${testId}-no-image`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className={styles.noImageIcon}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Hover overlay for title */}
        {showTitle === 'hover' && (
          <div className={styles.hoverOverlay} data-testid={`${testId}-hover-overlay`}>
            <h3 className={styles.title}>{item.title}</h3>
            {showDate && item.pubDate && (
              <time className={styles.date} dateTime={item.pubDate}>
                {formatDate(item.pubDate)}
              </time>
            )}
            {showSource && item.author && (
              <span className={styles.source}>{item.author}</span>
            )}
            {showDescription && processedDescription && (
              <p className={styles.description}>{truncateText(processedDescription, 100)}</p>
            )}
          </div>
        )}
      </div>

      {/* Title below image */}
      {showTitle === 'below' && (
        <div className={styles.titleBelow} data-testid={`${testId}-title-below`}>
          <h3 className={styles.title}>{item.title}</h3>
          {(showDate || showSource) && (
            <div className={styles.meta}>
              {showDate && item.pubDate && (
                <time className={styles.date} dateTime={item.pubDate}>
                  {formatDate(item.pubDate)}
                </time>
              )}
              {showDate && item.pubDate && showSource && item.author && (
                <span className={styles.separator}>•</span>
              )}
              {showSource && item.author && (
                <span className={styles.source}>{item.author}</span>
              )}
            </div>
          )}
          {showDescription && processedDescription && (
            <p className={styles.description}>{truncateText(processedDescription, 80)}</p>
          )}
        </div>
      )}
    </article>
  );
};

export default GalleryItem;
