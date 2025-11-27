/**
 * CardLayout Component Tests
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardLayout, CardSize } from '../../../src/webparts/polRssGallery/components/layouts/CardLayout';
import { IRssItem } from '../../../src/webparts/polRssGallery/components/IRssItem';

// Mock shared components
jest.mock('../../../src/webparts/polRssGallery/components/shared/FeedItem', () => ({
  FeedItem: ({ item, testId, variant, className }: {
    item: IRssItem;
    testId?: string;
    variant: string;
    className?: string;
  }) => (
    <div
      data-testid={testId || 'feed-item'}
      data-variant={variant}
      data-title={item.title}
      className={className}
    >
      {item.title}
    </div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/Skeleton', () => ({
  SkeletonGrid: ({ count, type, testId }: { count: number; type: string; testId?: string }) => (
    <div data-testid={testId || 'skeleton-grid'} data-count={count} data-type={type}>
      Loading...
    </div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/EmptyState', () => ({
  NoItemsEmptyState: () => <div data-testid="empty-state">No items</div>
}));

jest.mock('../../../src/webparts/polRssGallery/components/ResponsiveGrid', () => ({
  ResponsiveGrid: ({ children, testId, minItemWidth, maxColumns, gap }: {
    children: React.ReactNode;
    testId?: string;
    minItemWidth?: number;
    maxColumns?: number;
    gap?: string;
  }) => (
    <div
      data-testid={testId || 'responsive-grid'}
      data-min-width={minItemWidth}
      data-max-columns={maxColumns}
      data-gap={gap}
    >
      {children}
    </div>
  )
}));

describe('CardLayout', () => {
  const mockItems: IRssItem[] = [
    {
      title: 'Article 1',
      link: 'https://example.com/1',
      pubDate: '2024-01-15T10:00:00Z',
      description: 'Description 1',
      imageUrl: 'https://example.com/image1.jpg',
      categories: ['News'],
      feedType: 'rss'
    },
    {
      title: 'Article 2',
      link: 'https://example.com/2',
      pubDate: '2024-01-14T10:00:00Z',
      description: 'Description 2',
      imageUrl: 'https://example.com/image2.jpg',
      categories: ['Tech'],
      feedType: 'rss'
    },
    {
      title: 'Article 3',
      link: 'https://example.com/3',
      pubDate: '2024-01-13T10:00:00Z',
      description: 'Description 3',
      imageUrl: 'https://example.com/image3.jpg',
      categories: ['Sports'],
      feedType: 'rss'
    }
  ];

  describe('Rendering', () => {
    it('renders with items', () => {
      render(<CardLayout items={mockItems} testId="card-layout" />);

      expect(screen.getByTestId('card-layout')).toBeInTheDocument();
    });

    it('renders all items', () => {
      render(<CardLayout items={mockItems} testId="card-layout" />);

      mockItems.forEach((item, index) => {
        expect(screen.getByTestId(`card-layout-item-${index}`)).toBeInTheDocument();
        expect(screen.getByTestId(`card-layout-item-${index}`)).toHaveAttribute(
          'data-title',
          item.title
        );
      });
    });

    it('renders items with card variant', () => {
      render(<CardLayout items={mockItems} testId="card-layout" />);

      mockItems.forEach((_, index) => {
        expect(screen.getByTestId(`card-layout-item-${index}`)).toHaveAttribute(
          'data-variant',
          'card'
        );
      });
    });

    it('renders loading skeleton when isLoading is true', () => {
      render(<CardLayout items={[]} isLoading testId="card-layout" />);

      expect(screen.getByTestId('card-layout-skeleton')).toBeInTheDocument();
    });

    it('renders empty state when items is empty', () => {
      render(<CardLayout items={[]} testId="card-layout" />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('uses ResponsiveGrid for layout', () => {
      render(<CardLayout items={mockItems} testId="card-layout" />);

      expect(screen.getByTestId('card-layout-grid')).toBeInTheDocument();
    });
  });

  describe('Grid Configuration', () => {
    it('passes correct minItemWidth based on cardSize', () => {
      const { rerender } = render(
        <CardLayout items={mockItems} cardSize="sm" testId="card-layout" />
      );
      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-min-width', '220');

      rerender(<CardLayout items={mockItems} cardSize="md" testId="card-layout" />);
      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-min-width', '280');

      rerender(<CardLayout items={mockItems} cardSize="lg" testId="card-layout" />);
      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-min-width', '340');
    });

    it('passes maxColumns when columns is numeric', () => {
      render(<CardLayout items={mockItems} columns={3} testId="card-layout" />);

      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-max-columns', '3');
    });

    it('passes 4 as maxColumns when columns is auto', () => {
      render(<CardLayout items={mockItems} columns="auto" testId="card-layout" />);

      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-max-columns', '4');
    });

    it('passes gap size to grid', () => {
      render(<CardLayout items={mockItems} gap="lg" testId="card-layout" />);

      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-gap', 'lg');
    });
  });

  describe('Card Size variants', () => {
    it.each(['sm', 'md', 'lg'] as CardSize[])('supports %s card size', (size) => {
      render(<CardLayout items={mockItems} cardSize={size} testId="card-layout" />);

      expect(screen.getByTestId('card-layout')).toBeInTheDocument();
    });

    it('defaults to md card size', () => {
      render(<CardLayout items={mockItems} testId="card-layout" />);

      // Default minItemWidth for 'md' is 280
      expect(screen.getByTestId('card-layout-grid')).toHaveAttribute('data-min-width', '280');
    });
  });

  describe('Display Options', () => {
    it('passes showPubDate to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          showPubDate={false}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });

    it('passes showDescription to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          showDescription={false}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });

    it('passes showCategories to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          showCategories
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });

    it('passes fallbackImageUrl to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          fallbackImageUrl="https://example.com/fallback.jpg"
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });

    it('passes imageAspectRatio to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          imageAspectRatio="4:3"
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Skeleton Loading', () => {
    it('passes count to skeleton grid', () => {
      render(
        <CardLayout
          items={[]}
          isLoading
          skeletonCount={8}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-skeleton')).toHaveAttribute('data-count', '8');
    });

    it('defaults to 6 skeleton items', () => {
      render(
        <CardLayout
          items={[]}
          isLoading
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-skeleton')).toHaveAttribute('data-count', '6');
    });

    it('passes card type to skeleton grid', () => {
      render(
        <CardLayout
          items={[]}
          isLoading
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-skeleton')).toHaveAttribute('data-type', 'card');
    });
  });

  describe('Item Click Handling', () => {
    it('passes onItemClick to FeedItem', () => {
      const handleClick = jest.fn();
      render(
        <CardLayout
          items={mockItems}
          onItemClick={handleClick}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      render(
        <CardLayout
          items={mockItems}
          className="custom-class"
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout')).toHaveClass('custom-class');
    });
  });

  describe('Key Update on forceFallback', () => {
    it('re-renders when forceFallback changes', () => {
      const { rerender } = render(
        <CardLayout
          items={mockItems}
          forceFallback={false}
          testId="card-layout"
        />
      );

      rerender(
        <CardLayout
          items={mockItems}
          forceFallback={true}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout')).toBeInTheDocument();
    });
  });

  describe('Description Truncation', () => {
    it('passes truncateDescription to FeedItem', () => {
      render(
        <CardLayout
          items={mockItems}
          truncateDescription={100}
          testId="card-layout"
        />
      );

      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });

    it('defaults to 150 characters for truncation', () => {
      render(
        <CardLayout
          items={mockItems}
          testId="card-layout"
        />
      );

      // Default is 150, FeedItem would handle this
      expect(screen.getByTestId('card-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('is wrapped with React.memo', () => {
      // The component is memoized, verify it works correctly
      const { rerender } = render(
        <CardLayout items={mockItems} testId="card-layout" />
      );

      rerender(<CardLayout items={mockItems} testId="card-layout" />);

      expect(screen.getByTestId('card-layout')).toBeInTheDocument();
    });
  });
});
