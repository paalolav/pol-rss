/**
 * FeedItem Component
 *
 * A shared component used by all layout types (card, list, banner).
 * Provides consistent rendering of RSS feed items with configurable display options.
 *
 * Features:
 * - Multiple variant styles (card, list, banner)
 * - Configurable visibility for each element
 * - Accessible markup with proper semantics
 * - Hover/focus states
 * - Integration with ResponsiveImage for lazy loading
 */

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { IRssItem } from '../../IRssItem';
import { ResponsiveImage, ImagePlaceholder, AspectRatio } from '../../ResponsiveImage';
import { sanitizer } from '../../../services/contentSanitizer';
import styles from './FeedItem.module.scss';

/**
 * Feed item display variant
 */
export type FeedItemVariant = 'card' | 'list' | 'banner';

/**
 * Truncation configuration
 */
export interface TruncationConfig {
  /**
   * Maximum number of characters
   */
  maxChars?: number;
  /**
   * Maximum number of lines (CSS line-clamp)
   */
  maxLines?: number;
}

/**
 * Props for the FeedItem component
 */
export interface IFeedItemProps {
  /**
   * The RSS item to render
   */
  item: IRssItem;
  /**
   * Display variant
   */
  variant: FeedItemVariant;
  /**
   * Whether to show the image
   * @default true
   */
  showImage?: boolean;
  /**
   * Whether to show the description
   * @default true
   */
  showDescription?: boolean;
  /**
   * Whether to show the publication date
   * @default true
   */
  showDate?: boolean;
  /**
   * Whether to show categories
   * @default false
   */
  showCategories?: boolean;
  /**
   * Whether to show the source/publication name
   * @default false
   */
  showSource?: boolean;
  /**
   * Image aspect ratio
   * @default '16:9'
   */
  imageAspectRatio?: AspectRatio;
  /**
   * Fallback image URL when item has no image
   */
  fallbackImageUrl?: string;
  /**
   * Force using fallback image for all items
   * @default false
   */
  forceFallback?: boolean;
  /**
   * Callback when item is clicked
   */
  onItemClick?: (item: IRssItem, event: React.MouseEvent) => void;
  /**
   * Description truncation settings
   */
  descriptionTruncation?: TruncationConfig;
  /**
   * Title truncation settings
   */
  titleTruncation?: TruncationConfig;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
  /**
   * Locale for date formatting
   * @default 'nb-NO'
   */
  locale?: string;
  /**
   * Whether the image should be rendered as a link
   * @default true
   */
  imageAsLink?: boolean;
}

/**
 * Format a date string to a localized format
 */
const formatDate = (dateString: string, locale: string = 'nb-NO'): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Truncate text to a maximum number of characters
 */
const truncateText = (text: string, maxChars?: number): string => {
  if (!maxChars || text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars).trim() + '…';
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
 * FeedItem component for rendering RSS feed items
 */
export const FeedItem: React.FC<IFeedItemProps> = ({
  item,
  variant,
  showImage = true,
  showDescription = true,
  showDate = true,
  showCategories = false,
  showSource = false,
  imageAspectRatio = '16:9',
  fallbackImageUrl,
  forceFallback = false,
  onItemClick,
  descriptionTruncation,
  titleTruncation,
  className = '',
  testId = 'feed-item',
  locale = 'nb-NO',
  imageAsLink = true
}) => {
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (onItemClick) {
      onItemClick(item, event);
    }
  }, [item, onItemClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onItemClick) {
        onItemClick(item, event as unknown as React.MouseEvent);
      } else {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      }
    }
  }, [item, onItemClick]);

  // Process description
  const processedDescription = useMemo(() => {
    if (!item.description) return '';
    const plainText = stripHtml(item.description);
    return truncateText(plainText, descriptionTruncation?.maxChars);
  }, [item.description, descriptionTruncation?.maxChars]);

  // Process title
  const processedTitle = useMemo(() => {
    return truncateText(item.title, titleTruncation?.maxChars);
  }, [item.title, titleTruncation?.maxChars]);

  // Format date
  const formattedDate = useMemo(() => {
    return item.pubDate ? formatDate(item.pubDate, locale) : '';
  }, [item.pubDate, locale]);

  // Generate unique key for categories
  const getCategoryKey = useCallback((category: string, index: number) => {
    return `${item.link}-category-${index}`;
  }, [item.link]);

  // Container classes
  const containerClasses = [
    styles.feedItem,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  // Description style for line clamping
  const descriptionStyle: React.CSSProperties = descriptionTruncation?.maxLines ? {
    WebkitLineClamp: descriptionTruncation.maxLines,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  } as React.CSSProperties : {};

  // Title style for line clamping
  const titleStyle: React.CSSProperties = titleTruncation?.maxLines ? {
    WebkitLineClamp: titleTruncation.maxLines,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  } as React.CSSProperties : {};

  // Render image section
  const renderImage = () => {
    if (!showImage) return null;

    // Determine which image to use
    const useForced = forceFallback && fallbackImageUrl;
    const imageSrc = useForced ? fallbackImageUrl : item.imageUrl;

    const imageContent = imageSrc ? (
      <ResponsiveImage
        src={imageSrc}
        alt={item.title}
        aspectRatio={imageAspectRatio}
        fallbackSrc={fallbackImageUrl}
        className={styles.image}
        testId={`${testId}-image`}
      />
    ) : fallbackImageUrl ? (
      <ResponsiveImage
        src={fallbackImageUrl}
        alt={item.title}
        aspectRatio={imageAspectRatio}
        className={styles.image}
        testId={`${testId}-image`}
      />
    ) : (
      <ImagePlaceholder
        alt={item.title}
        aspectRatio={imageAspectRatio}
        icon={<span className="ms-Icon ms-Icon--Photo2" aria-hidden="true" />}
        testId={`${testId}-placeholder`}
      />
    );

    if (imageAsLink) {
      return (
        <a
          href={item.link}
          className={styles.imageLink}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          {imageContent}
        </a>
      );
    }

    return (
      <div className={styles.imageWrapper}>
        {imageContent}
      </div>
    );
  };

  return (
    <article
      className={containerClasses}
      data-testid={testId}
      data-variant={variant}
      onClick={onItemClick ? handleClick : undefined}
      onKeyDown={onItemClick ? handleKeyDown : undefined}
      tabIndex={onItemClick ? 0 : undefined}
      role={onItemClick ? 'button' : undefined}
    >
      {/* Image Section */}
      {renderImage()}

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <h3 className={styles.title} style={titleStyle}>
          <a
            href={item.link}
            className={styles.titleLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {processedTitle}
          </a>
        </h3>

        {/* Meta Information */}
        {(showDate || showSource) && (
          <div className={styles.meta}>
            {showDate && formattedDate && (
              <time
                className={styles.date}
                dateTime={item.pubDate}
              >
                {formattedDate}
              </time>
            )}
            {showSource && item.author && (
              <span className={styles.source}>
                {item.author}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {showDescription && processedDescription && (
          <p
            className={styles.description}
            style={descriptionStyle}
          >
            {processedDescription}
          </p>
        )}

        {/* Categories */}
        {showCategories && item.categories && item.categories.length > 0 && (
          <div className={styles.categories}>
            {item.categories.map((category, index) => (
              <span
                key={getCategoryKey(category, index)}
                className={styles.category}
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default React.memo(FeedItem);
