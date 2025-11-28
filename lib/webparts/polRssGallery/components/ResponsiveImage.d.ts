/**
 * ResponsiveImage Component
 *
 * A responsive image component with:
 * - Native lazy loading
 * - Aspect ratio preservation
 * - Loading skeleton
 * - Error fallback
 * - Alt text requirements
 */
import * as React from 'react';
/**
 * Aspect ratio presets
 */
export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:2' | '21:9' | 'auto';
/**
 * Loading strategy
 */
export type LoadingStrategy = 'lazy' | 'eager';
/**
 * Image fit mode
 */
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
/**
 * Props for the ResponsiveImage component
 */
export interface IResponsiveImageProps {
    /**
     * Image source URL
     */
    src: string;
    /**
     * Alt text (required for accessibility)
     */
    alt: string;
    /**
     * Aspect ratio for the image container
     * @default '16:9'
     */
    aspectRatio?: AspectRatio;
    /**
     * Loading strategy
     * @default 'lazy'
     */
    loading?: LoadingStrategy;
    /**
     * Fallback image URL when main image fails to load
     */
    fallbackSrc?: string;
    /**
     * Object fit mode
     * @default 'cover'
     */
    objectFit?: ObjectFit;
    /**
     * Additional CSS class names
     */
    className?: string;
    /**
     * Width of the image (for srcset generation)
     */
    width?: number;
    /**
     * Height of the image (for srcset generation)
     */
    height?: number;
    /**
     * Callback when image loads successfully
     */
    onLoad?: () => void;
    /**
     * Callback when image fails to load
     */
    onError?: (error: Error) => void;
    /**
     * Test ID for testing
     */
    testId?: string;
    /**
     * Whether to show skeleton during loading
     * @default true
     */
    showSkeleton?: boolean;
    /**
     * Whether to fade in the image after loading
     * @default true
     */
    fadeIn?: boolean;
}
/**
 * ResponsiveImage component with lazy loading and fallbacks
 */
export declare const ResponsiveImage: React.FC<IResponsiveImageProps>;
/**
 * Placeholder image component for use when no image is available
 */
export interface IImagePlaceholderProps {
    /**
     * Alt text describing what the placeholder represents
     */
    alt: string;
    /**
     * Aspect ratio
     * @default '16:9'
     */
    aspectRatio?: AspectRatio;
    /**
     * Icon or text to display
     */
    icon?: React.ReactNode;
    /**
     * Additional CSS class names
     */
    className?: string;
    /**
     * Test ID for testing
     */
    testId?: string;
}
/**
 * Placeholder component for missing images
 */
export declare const ImagePlaceholder: React.FC<IImagePlaceholderProps>;
export default ResponsiveImage;
//# sourceMappingURL=ResponsiveImage.d.ts.map