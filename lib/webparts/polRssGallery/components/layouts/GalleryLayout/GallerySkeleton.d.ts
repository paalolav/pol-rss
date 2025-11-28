/**
 * GallerySkeleton Component
 *
 * Skeleton loading state for the gallery layout.
 * Matches the gallery grid structure with animated placeholders.
 */
import * as React from 'react';
import { TitlePosition, GalleryAspectRatio } from './GalleryItem';
/**
 * Props for GallerySkeleton component
 */
export interface IGallerySkeletonProps {
    /**
     * Number of skeleton items to display
     * @default 8
     */
    count?: number;
    /**
     * Aspect ratio for skeleton items
     * @default '4:3'
     */
    aspectRatio?: GalleryAspectRatio;
    /**
     * Title display mode (affects whether title skeleton shows)
     * @default 'below'
     */
    showTitles?: TitlePosition;
    /**
     * Test ID for testing
     */
    testId?: string;
}
/**
 * GallerySkeleton component
 */
export declare const GallerySkeleton: React.FC<IGallerySkeletonProps>;
export default GallerySkeleton;
//# sourceMappingURL=GallerySkeleton.d.ts.map