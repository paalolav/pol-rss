/**
 * GallerySkeleton Component
 *
 * Skeleton loading state for the gallery layout.
 * Matches the gallery grid structure with animated placeholders.
 */

import * as React from 'react';
import { TitlePosition, GalleryAspectRatio } from './GalleryItem';
import styles from './GalleryLayout.module.scss';

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
 * Aspect ratio CSS values
 */
const aspectRatioValues: Record<GalleryAspectRatio, string> = {
  '1:1': '1/1',
  '4:3': '4/3',
  '16:9': '16/9'
};

/**
 * GallerySkeleton component
 */
export const GallerySkeleton: React.FC<IGallerySkeletonProps> = ({
  count = 8,
  aspectRatio = '4:3',
  showTitles = 'below',
  testId = 'gallery-skeleton'
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const imageStyle: React.CSSProperties = {
    '--aspect-ratio': aspectRatioValues[aspectRatio]
  } as React.CSSProperties;

  return (
    <>
      {items.map((index) => (
        <div
          key={index}
          className={styles.skeletonItem}
          aria-hidden="true"
          data-testid={`${testId}-item-${index}`}
        >
          <div
            className={styles.skeletonImage}
            style={imageStyle}
          />
          {showTitles === 'below' && (
            <div className={styles.skeletonTitle} />
          )}
        </div>
      ))}
    </>
  );
};

export default GallerySkeleton;
