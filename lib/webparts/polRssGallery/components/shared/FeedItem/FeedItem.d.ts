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
import { IRssItem } from '../../IRssItem';
import { AspectRatio } from '../../ResponsiveImage';
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
     * Whether to show the author
     * @default false
     */
    showAuthor?: boolean;
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
 * FeedItem component for rendering RSS feed items
 */
export declare const FeedItem: React.FC<IFeedItemProps>;
declare const _default: React.NamedExoticComponent<IFeedItemProps>;
export default _default;
//# sourceMappingURL=FeedItem.d.ts.map