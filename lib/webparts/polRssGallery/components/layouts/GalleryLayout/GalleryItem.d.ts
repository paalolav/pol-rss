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
import { IRssItem } from '../../IRssItem';
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
}
/**
 * GalleryItem component
 */
export declare const GalleryItem: React.FC<IGalleryItemProps>;
export default GalleryItem;
//# sourceMappingURL=GalleryItem.d.ts.map