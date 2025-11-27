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
import styles from './Skeleton.module.scss';

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
export const Skeleton: React.FC<ISkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'wave',
  className = '',
  testId = 'skeleton'
}) => {
  const style: React.CSSProperties = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  const classes = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={style}
      aria-hidden="true"
      data-testid={testId}
    />
  );
};

// ============================================================
// Layout-Specific Skeletons
// ============================================================

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
export const CardSkeleton: React.FC<ICardSkeletonProps> = ({
  showDescription = true,
  showCategories = false,
  animation = 'wave',
  className = '',
  testId = 'card-skeleton'
}) => {
  return (
    <div
      className={`${styles.cardSkeleton} ${className}`}
      data-testid={testId}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <Skeleton
        variant="rectangular"
        height={180}
        animation={animation}
        testId={`${testId}-image`}
      />

      {/* Content */}
      <div className={styles.cardContent}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="90%"
          height={20}
          animation={animation}
          testId={`${testId}-title`}
        />

        {/* Date */}
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          animation={animation}
          testId={`${testId}-date`}
        />

        {/* Description */}
        {showDescription && (
          <div className={styles.descriptionLines}>
            <Skeleton
              variant="text"
              width="100%"
              height={14}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width="85%"
              height={14}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width="70%"
              height={14}
              animation={animation}
            />
          </div>
        )}

        {/* Categories */}
        {showCategories && (
          <div className={styles.categoriesRow}>
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              animation={animation}
              className={styles.categoryPill}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              animation={animation}
              className={styles.categoryPill}
            />
          </div>
        )}
      </div>
    </div>
  );
};

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
export const ListSkeleton: React.FC<IListSkeletonProps> = ({
  showThumbnail = true,
  showDescription = true,
  showCategories = false,
  animation = 'wave',
  className = '',
  testId = 'list-skeleton'
}) => {
  return (
    <div
      className={`${styles.listSkeleton} ${className}`}
      data-testid={testId}
      aria-hidden="true"
    >
      {/* Thumbnail */}
      {showThumbnail && (
        <Skeleton
          variant="rectangular"
          width={120}
          height={80}
          animation={animation}
          className={styles.thumbnail}
          testId={`${testId}-thumbnail`}
        />
      )}

      {/* Content */}
      <div className={styles.listContent}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="70%"
          height={18}
          animation={animation}
          testId={`${testId}-title`}
        />

        {/* Date */}
        <Skeleton
          variant="text"
          width="25%"
          height={14}
          animation={animation}
          testId={`${testId}-date`}
        />

        {/* Description */}
        {showDescription && (
          <div className={styles.descriptionLines}>
            <Skeleton
              variant="text"
              width="100%"
              height={14}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width="90%"
              height={14}
              animation={animation}
            />
          </div>
        )}

        {/* Categories */}
        {showCategories && (
          <div className={styles.categoriesRow}>
            <Skeleton
              variant="rectangular"
              width={50}
              height={20}
              animation={animation}
              className={styles.categoryPill}
            />
            <Skeleton
              variant="rectangular"
              width={70}
              height={20}
              animation={animation}
              className={styles.categoryPill}
            />
          </div>
        )}
      </div>
    </div>
  );
};

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
export const BannerSkeleton: React.FC<IBannerSkeletonProps> = ({
  showDescription = true,
  showCategories = false,
  animation = 'wave',
  height = 300,
  className = '',
  testId = 'banner-skeleton'
}) => {
  return (
    <div
      className={`${styles.bannerSkeleton} ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      data-testid={testId}
      aria-hidden="true"
    >
      {/* Background overlay */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation={animation}
        className={styles.bannerBackground}
        testId={`${testId}-background`}
      />

      {/* Content overlay */}
      <div className={styles.bannerContent}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="60%"
          height={28}
          animation={animation}
          className={styles.bannerTitle}
          testId={`${testId}-title`}
        />

        {/* Date */}
        <Skeleton
          variant="text"
          width="20%"
          height={16}
          animation={animation}
          testId={`${testId}-date`}
        />

        {/* Description */}
        {showDescription && (
          <div className={styles.descriptionLines}>
            <Skeleton
              variant="text"
              width="80%"
              height={16}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={16}
              animation={animation}
            />
          </div>
        )}

        {/* Categories */}
        {showCategories && (
          <div className={styles.categoriesRow}>
            <Skeleton
              variant="rectangular"
              width={70}
              height={24}
              animation={animation}
              className={styles.categoryPill}
            />
            <Skeleton
              variant="rectangular"
              width={90}
              height={24}
              animation={animation}
              className={styles.categoryPill}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Skeleton Grid Helpers
// ============================================================

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
export const SkeletonGrid: React.FC<ISkeletonGridProps> = ({
  count = 6,
  type = 'card',
  animation = 'wave',
  itemProps = {},
  className = '',
  testId = 'skeleton-grid'
}) => {
  const items = Array.from({ length: count }, (_, index) => index);

  const renderSkeleton = (index: number) => {
    const key = `skeleton-${index}`;
    const itemTestId = `${testId}-item-${index}`;

    switch (type) {
      case 'list':
        return (
          <ListSkeleton
            key={key}
            animation={animation}
            testId={itemTestId}
            {...(itemProps as IListSkeletonProps)}
          />
        );
      case 'banner':
        return (
          <BannerSkeleton
            key={key}
            animation={animation}
            testId={itemTestId}
            {...(itemProps as IBannerSkeletonProps)}
          />
        );
      case 'card':
      default:
        return (
          <CardSkeleton
            key={key}
            animation={animation}
            testId={itemTestId}
            {...(itemProps as ICardSkeletonProps)}
          />
        );
    }
  };

  const gridClass = type === 'list' ? styles.listGrid : styles.cardGrid;

  return (
    <div
      className={`${gridClass} ${className}`}
      data-testid={testId}
      aria-busy="true"
      aria-label="Loading content"
    >
      {items.map(renderSkeleton)}
    </div>
  );
};

export default Skeleton;
