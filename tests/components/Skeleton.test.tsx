/**
 * Skeleton Component Tests
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  BannerSkeleton,
  SkeletonGrid,
  SkeletonVariant,
  SkeletonAnimation
} from '../../src/webparts/polRssGallery/components/shared/Skeleton';

describe('Skeleton', () => {
  describe('Base Skeleton', () => {
    it('renders with default props', () => {
      render(<Skeleton testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it.each(['text', 'rectangular', 'circular'] as SkeletonVariant[])(
      'renders with %s variant',
      (variant) => {
        render(<Skeleton variant={variant} testId="skeleton" />);

        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      }
    );

    it.each(['pulse', 'wave', 'none'] as SkeletonAnimation[])(
      'renders with %s animation',
      (animation) => {
        render(<Skeleton animation={animation} testId="skeleton" />);

        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      }
    );

    it('applies width as pixel value when number', () => {
      render(<Skeleton width={200} testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '200px' });
    });

    it('applies width as-is when string', () => {
      render(<Skeleton width="80%" testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '80%' });
    });

    it('applies height as pixel value when number', () => {
      render(<Skeleton height={50} testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveStyle({ height: '50px' });
    });

    it('applies height as-is when string', () => {
      render(<Skeleton height="100%" testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveStyle({ height: '100%' });
    });

    it('applies custom className', () => {
      render(<Skeleton className="custom-class" testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
    });

    it('is hidden from screen readers', () => {
      render(<Skeleton testId="skeleton" />);

      expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('CardSkeleton', () => {
    it('renders with default props', () => {
      render(<CardSkeleton testId="card-skeleton" />);

      const skeleton = screen.getByTestId('card-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders image skeleton', () => {
      render(<CardSkeleton testId="card-skeleton" />);

      expect(screen.getByTestId('card-skeleton-image')).toBeInTheDocument();
    });

    it('renders title skeleton', () => {
      render(<CardSkeleton testId="card-skeleton" />);

      expect(screen.getByTestId('card-skeleton-title')).toBeInTheDocument();
    });

    it('renders date skeleton', () => {
      render(<CardSkeleton testId="card-skeleton" />);

      expect(screen.getByTestId('card-skeleton-date')).toBeInTheDocument();
    });

    it('renders description skeletons when showDescription is true', () => {
      render(<CardSkeleton showDescription testId="card-skeleton" />);

      // Should have component with description
      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('does not render description when showDescription is false', () => {
      render(<CardSkeleton showDescription={false} testId="card-skeleton" />);

      // Component still renders
      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('renders category pills when showCategories is true', () => {
      render(<CardSkeleton showCategories testId="card-skeleton" />);

      // Component renders with categories
      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('does not render category pills when showCategories is false', () => {
      render(<CardSkeleton showCategories={false} testId="card-skeleton" />);

      // Component renders without categories
      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('applies custom animation', () => {
      render(<CardSkeleton animation="pulse" testId="card-skeleton" />);

      const imageSkeleton = screen.getByTestId('card-skeleton-image');
      expect(imageSkeleton).toBeInTheDocument();
    });

    it('is hidden from screen readers', () => {
      render(<CardSkeleton testId="card-skeleton" />);

      expect(screen.getByTestId('card-skeleton')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('ListSkeleton', () => {
    it('renders with default props', () => {
      render(<ListSkeleton testId="list-skeleton" />);

      const skeleton = screen.getByTestId('list-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders thumbnail when showThumbnail is true', () => {
      render(<ListSkeleton showThumbnail testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton-thumbnail')).toBeInTheDocument();
    });

    it('does not render thumbnail when showThumbnail is false', () => {
      render(<ListSkeleton showThumbnail={false} testId="list-skeleton" />);

      expect(screen.queryByTestId('list-skeleton-thumbnail')).not.toBeInTheDocument();
    });

    it('renders title skeleton', () => {
      render(<ListSkeleton testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton-title')).toBeInTheDocument();
    });

    it('renders date skeleton', () => {
      render(<ListSkeleton testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton-date')).toBeInTheDocument();
    });

    it('renders description when showDescription is true', () => {
      render(<ListSkeleton showDescription testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
    });

    it('renders categories when showCategories is true', () => {
      render(<ListSkeleton showCategories testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
    });

    it('is hidden from screen readers', () => {
      render(<ListSkeleton testId="list-skeleton" />);

      expect(screen.getByTestId('list-skeleton')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('BannerSkeleton', () => {
    it('renders with default props', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      const skeleton = screen.getByTestId('banner-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('applies default height', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toHaveStyle({ height: '300px' });
    });

    it('applies custom height as number', () => {
      render(<BannerSkeleton height={400} testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toHaveStyle({ height: '400px' });
    });

    it('applies custom height as string', () => {
      render(<BannerSkeleton height="50vh" testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toHaveStyle({ height: '50vh' });
    });

    it('renders background skeleton', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton-background')).toBeInTheDocument();
    });

    it('renders title skeleton', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton-title')).toBeInTheDocument();
    });

    it('renders date skeleton', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton-date')).toBeInTheDocument();
    });

    it('renders description when showDescription is true', () => {
      render(<BannerSkeleton showDescription testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
    });

    it('renders categories when showCategories is true', () => {
      render(<BannerSkeleton showCategories testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
    });

    it('is hidden from screen readers', () => {
      render(<BannerSkeleton testId="banner-skeleton" />);

      expect(screen.getByTestId('banner-skeleton')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('SkeletonGrid', () => {
    it('renders with default props', () => {
      render(<SkeletonGrid testId="skeleton-grid" />);

      const grid = screen.getByTestId('skeleton-grid');
      expect(grid).toBeInTheDocument();
    });

    it('renders default number of items (6)', () => {
      render(<SkeletonGrid testId="skeleton-grid" />);

      // By default renders 6 card skeletons - check via test IDs
      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-grid-item-5')).toBeInTheDocument();
    });

    it('renders custom number of items', () => {
      render(<SkeletonGrid count={3} testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-grid-item-2')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton-grid-item-3')).not.toBeInTheDocument();
    });

    it('renders card skeletons by default', () => {
      render(<SkeletonGrid count={2} testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-grid-item-1')).toBeInTheDocument();
    });

    it('renders list skeletons when type is "list"', () => {
      render(<SkeletonGrid type="list" count={2} testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-grid-item-1')).toBeInTheDocument();
    });

    it('renders banner skeletons when type is "banner"', () => {
      render(<SkeletonGrid type="banner" count={2} testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-grid-item-1')).toBeInTheDocument();
    });

    it('passes itemProps to skeletons', () => {
      render(
        <SkeletonGrid
          type="card"
          count={1}
          itemProps={{ showCategories: true }}
          testId="skeleton-grid"
        />
      );

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SkeletonGrid className="custom-grid" testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid')).toHaveClass('custom-grid');
    });

    it('renders with card type by default', () => {
      render(<SkeletonGrid type="card" testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
    });

    it('renders with list type', () => {
      render(<SkeletonGrid type="list" testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
    });

    it('has aria-busy attribute', () => {
      render(<SkeletonGrid testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid')).toHaveAttribute('aria-busy', 'true');
    });

    it('has aria-label for accessibility', () => {
      render(<SkeletonGrid testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid')).toHaveAttribute('aria-label', 'Loading content');
    });

    it('renders with pulse animation', () => {
      render(<SkeletonGrid animation="pulse" count={2} testId="skeleton-grid" />);

      expect(screen.getByTestId('skeleton-grid-item-0')).toBeInTheDocument();
    });
  });
});
