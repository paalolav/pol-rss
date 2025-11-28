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
import { IRssItem } from '../../IRssItem';
import { TitlePosition, GalleryAspectRatio } from './GalleryItem';
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
 * GalleryLayout component
 */
export declare const GalleryLayout: React.FC<IGalleryLayoutProps>;
declare const _default: React.NamedExoticComponent<IGalleryLayoutProps>;
export default _default;
//# sourceMappingURL=GalleryLayout.d.ts.map