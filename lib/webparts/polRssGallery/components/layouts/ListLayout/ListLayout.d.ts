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
import { IRssItem } from '../../IRssItem';
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
 * ListLayout component
 */
export declare const ListLayout: React.FC<IListLayoutProps>;
declare const _default: React.NamedExoticComponent<IListLayoutProps>;
export default _default;
//# sourceMappingURL=ListLayout.d.ts.map