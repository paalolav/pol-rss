/**
 * Skeleton Loading Components
 *
 * A set of skeleton loading components for displaying loading states.
 * Includes base Skeleton component and layout-specific variants.
 *
 * Features:
 * - Multiple animation styles (pulse, wave, none)
 * - Multiple shape variants (text, rectangular, circular)
 * - Layout-specific skeletons (card, list, banner)
 * - Reduced motion support
 * - Accessible (hidden from screen readers)
 */
import * as React from 'react';
/**
 * Skeleton shape variant
 */
export type SkeletonVariant = 'text' | 'rectangular' | 'circular';
/**
 * Animation style
 */
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';
/**
 * Props for the base Skeleton component
 */
export interface ISkeletonProps {
    /**
     * Shape variant
     * @default 'text'
     */
    variant?: SkeletonVariant;
    /**
     * Width of the skeleton
     */
    width?: number | string;
    /**
     * Height of the skeleton
     */
    height?: number | string;
    /**
     * Animation style
     * @default 'wave'
     */
    animation?: SkeletonAnimation;
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
 * Base Skeleton component
 */
export declare const Skeleton: React.FC<ISkeletonProps>;
/**
 * Props for CardSkeleton
 */
export interface ICardSkeletonProps {
    /**
     * Whether to show description skeleton
     * @default true
     */
    showDescription?: boolean;
    /**
     * Whether to show categories skeleton
     * @default false
     */
    showCategories?: boolean;
    /**
     * Animation style
     * @default 'wave'
     */
    animation?: SkeletonAnimation;
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
 * Skeleton for card layout items
 */
export declare const CardSkeleton: React.FC<ICardSkeletonProps>;
/**
 * Props for ListSkeleton
 */
export interface IListSkeletonProps {
    /**
     * Whether to show thumbnail
     * @default true
     */
    showThumbnail?: boolean;
    /**
     * Whether to show description skeleton
     * @default true
     */
    showDescription?: boolean;
    /**
     * Whether to show categories skeleton
     * @default false
     */
    showCategories?: boolean;
    /**
     * Animation style
     * @default 'wave'
     */
    animation?: SkeletonAnimation;
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
 * Skeleton for list layout items
 */
export declare const ListSkeleton: React.FC<IListSkeletonProps>;
/**
 * Props for BannerSkeleton
 */
export interface IBannerSkeletonProps {
    /**
     * Whether to show description skeleton
     * @default true
     */
    showDescription?: boolean;
    /**
     * Whether to show categories skeleton
     * @default false
     */
    showCategories?: boolean;
    /**
     * Animation style
     * @default 'wave'
     */
    animation?: SkeletonAnimation;
    /**
     * Height of the banner
     * @default 300
     */
    height?: number | string;
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
 * Skeleton for banner/carousel layout
 */
export declare const BannerSkeleton: React.FC<IBannerSkeletonProps>;
/**
 * Props for SkeletonGrid
 */
export interface ISkeletonGridProps {
    /**
     * Number of skeleton items to show
     * @default 6
     */
    count?: number;
    /**
     * Type of skeleton to render
     * @default 'card'
     */
    type?: 'card' | 'list' | 'banner';
    /**
     * Animation style
     * @default 'wave'
     */
    animation?: SkeletonAnimation;
    /**
     * Additional props for the skeleton items
     */
    itemProps?: Partial<ICardSkeletonProps | IListSkeletonProps | IBannerSkeletonProps>;
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
 * Grid of skeleton items for loading states
 */
export declare const SkeletonGrid: React.FC<ISkeletonGridProps>;
export default Skeleton;
//# sourceMappingURL=Skeleton.d.ts.map