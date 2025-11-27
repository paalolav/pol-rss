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
import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './ResponsiveImage.module.scss';

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
 * Aspect ratio to padding-bottom percentage mapping
 */
const aspectRatioToPadding: Record<Exclude<AspectRatio, 'auto'>, string> = {
  '16:9': '56.25%',
  '4:3': '75%',
  '1:1': '100%',
  '3:2': '66.67%',
  '21:9': '42.86%'
};

/**
 * Image loading state
 */
type ImageState = 'loading' | 'loaded' | 'error';

/**
 * ResponsiveImage component with lazy loading and fallbacks
 */
export const ResponsiveImage: React.FC<IResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = '16:9',
  loading = 'lazy',
  fallbackSrc,
  objectFit = 'cover',
  className = '',
  width,
  height,
  onLoad,
  onError,
  testId = 'responsive-image',
  showSkeleton = true,
  fadeIn = true
}) => {
  const [state, setState] = useState<ImageState>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setState('loading');
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = useCallback(() => {
    setState('loaded');
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setState('loading');
    } else {
      setState('error');
      onError?.(new Error(`Failed to load image: ${src}`));
    }
  }, [fallbackSrc, currentSrc, src, onError]);

  // Check if image is already cached
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      handleLoad();
    }
  }, [handleLoad]);

  const containerStyle: React.CSSProperties = aspectRatio !== 'auto' ? {
    paddingBottom: aspectRatioToPadding[aspectRatio]
  } : {};

  const imageStyle: React.CSSProperties = {
    objectFit
  };

  const containerClasses = [
    styles.imageContainer,
    aspectRatio !== 'auto' ? styles.hasAspectRatio : '',
    className
  ].filter(Boolean).join(' ');

  const imageClasses = [
    styles.image,
    state === 'loaded' && fadeIn ? styles.fadeIn : '',
    state === 'loaded' ? styles.loaded : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      data-testid={testId}
      data-state={state}
      data-aspect={aspectRatio}
    >
      {/* Skeleton loader */}
      {showSkeleton && state === 'loading' && (
        <div
          className={styles.skeleton}
          data-testid={`${testId}-skeleton`}
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {state === 'error' && (
        <div
          className={styles.error}
          data-testid={`${testId}-error`}
          role="img"
          aria-label={alt}
        >
          <span className={styles.errorIcon} aria-hidden="true">
            📷
          </span>
          <span className={styles.errorText}>
            Image unavailable
          </span>
        </div>
      )}

      {/* Image */}
      {state !== 'error' && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={loading}
          width={width}
          height={height}
          style={imageStyle}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          data-testid={`${testId}-img`}
        />
      )}
    </div>
  );
};

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
export const ImagePlaceholder: React.FC<IImagePlaceholderProps> = ({
  alt,
  aspectRatio = '16:9',
  icon = '📰',
  className = '',
  testId = 'image-placeholder'
}) => {
  const containerStyle: React.CSSProperties = aspectRatio !== 'auto' ? {
    paddingBottom: aspectRatioToPadding[aspectRatio]
  } : {};

  return (
    <div
      className={`${styles.imageContainer} ${styles.placeholder} ${className}`}
      style={containerStyle}
      data-testid={testId}
      role="img"
      aria-label={alt}
    >
      <div className={styles.placeholderContent}>
        <span className={styles.placeholderIcon} aria-hidden="true">
          {icon}
        </span>
      </div>
    </div>
  );
};

export default ResponsiveImage;
