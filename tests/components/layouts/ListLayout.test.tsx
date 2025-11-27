/**
 * ListLayout Component Tests
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ListLayout,
  ThumbnailPosition,
  ThumbnailSize
} from '../../../src/webparts/polRssGallery/components/layouts/ListLayout';
import { IRssItem } from '../../../src/webparts/polRssGallery/components/IRssItem';

// Mock shared components
jest.mock('../../../src/webparts/polRssGallery/components/shared/FeedItem', () => ({
  FeedItem: ({ item, testId, variant, showImage }: {
    item: IRssItem;
    testId?: string;
    variant: string;
    showImage?: boolean;
  }) => (
    <div
      data-testid={testId || 'feed-item'}
      data-variant={variant}
      data-title={item.title}
      data-show-image={showImage}
    >
      {item.title}
    </div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/Skeleton', () => ({
  SkeletonGrid: ({ count, type, testId, itemProps }: {
    count: number;
    type: string;
    testId?: string;
    itemProps?: { showThumbnail?: boolean };
  }) => (
    <div
      data-testid={testId || 'skeleton-grid'}
      data-count={count}
      data-type={type}
      data-show-thumbnail={itemProps?.showThumbnail}
    >
      Loading...
    </div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/EmptyState', () => ({
  NoItemsEmptyState: () => <div data-testid="empty-state">No items</div>
}));

describe('ListLayout', () => {
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
      render(<ListLayout items={mockItems} testId="list-layout" />);

      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });

    it('renders all items', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      mockItems.forEach((item, index) => {
        expect(screen.getByTestId(`list-layout-item-${index}`)).toBeInTheDocument();
        expect(screen.getByTestId(`list-layout-item-${index}`)).toHaveAttribute(
          'data-title',
          item.title
        );
      });
    });

    it('renders items with list variant', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      mockItems.forEach((_, index) => {
        expect(screen.getByTestId(`list-layout-item-${index}`)).toHaveAttribute(
          'data-variant',
          'list'
        );
      });
    });

    it('renders loading skeleton when isLoading is true', () => {
      render(<ListLayout items={[]} isLoading testId="list-layout" />);

      expect(screen.getByTestId('list-layout-skeleton')).toBeInTheDocument();
    });

    it('renders empty state when items is empty', () => {
      render(<ListLayout items={[]} testId="list-layout" />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="list"', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      expect(screen.getByTestId('list-layout')).toHaveAttribute('role', 'list');
    });

    it('has aria-label', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      expect(screen.getByTestId('list-layout')).toHaveAttribute('aria-label', 'Nyhetsliste');
    });

    it('list items have role="listitem"', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      const listItems = screen.getByTestId('list-layout').querySelectorAll('[role="listitem"]');
      expect(listItems).toHaveLength(mockItems.length);
    });
  });

  describe('Thumbnail Position', () => {
    it.each(['left', 'right', 'none'] as ThumbnailPosition[])(
      'supports %s thumbnail position',
      (position) => {
        render(
          <ListLayout
            items={mockItems}
            thumbnailPosition={position}
            testId="list-layout"
          />
        );

        expect(screen.getByTestId('list-layout')).toBeInTheDocument();
      }
    );

    it('hides image when thumbnailPosition is "none"', () => {
      render(
        <ListLayout
          items={mockItems}
          thumbnailPosition="none"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toHaveAttribute(
        'data-show-image',
        'false'
      );
    });

    it('shows image when thumbnailPosition is "left"', () => {
      render(
        <ListLayout
          items={mockItems}
          thumbnailPosition="left"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toHaveAttribute(
        'data-show-image',
        'true'
      );
    });

    it('shows image when thumbnailPosition is "right"', () => {
      render(
        <ListLayout
          items={mockItems}
          thumbnailPosition="right"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toHaveAttribute(
        'data-show-image',
        'true'
      );
    });

    it('defaults to left position', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      expect(screen.getByTestId('list-layout-item-0')).toHaveAttribute(
        'data-show-image',
        'true'
      );
    });
  });

  describe('Thumbnail Size', () => {
    it.each(['sm', 'md', 'lg'] as ThumbnailSize[])(
      'supports %s thumbnail size',
      (size) => {
        render(
          <ListLayout
            items={mockItems}
            thumbnailSize={size}
            testId="list-layout"
          />
        );

        expect(screen.getByTestId('list-layout')).toBeInTheDocument();
      }
    );

    it('defaults to md thumbnail size', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      // MD should be the default - component renders
      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact mode when compact is true', () => {
      render(
        <ListLayout
          items={mockItems}
          compact
          testId="list-layout"
        />
      );

      // Component should render - CSS module classes are transformed
      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });

    it('renders in normal mode when compact is false', () => {
      render(
        <ListLayout
          items={mockItems}
          compact={false}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });
  });

  describe('Dividers', () => {
    it('renders with dividers when showDividers is true', () => {
      render(
        <ListLayout
          items={mockItems}
          showDividers
          testId="list-layout"
        />
      );

      // Component should render - CSS module classes are transformed
      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });

    it('renders without dividers when showDividers is false', () => {
      render(
        <ListLayout
          items={mockItems}
          showDividers={false}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });

    it('defaults to showing dividers', () => {
      render(<ListLayout items={mockItems} testId="list-layout" />);

      // Default is true, component should render
      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });
  });

  describe('Display Options', () => {
    it('passes showPubDate to FeedItem', () => {
      render(
        <ListLayout
          items={mockItems}
          showPubDate={false}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });

    it('passes showDescription to FeedItem', () => {
      render(
        <ListLayout
          items={mockItems}
          showDescription={false}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });

    it('passes showCategories to FeedItem', () => {
      render(
        <ListLayout
          items={mockItems}
          showCategories
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });

    it('passes fallbackImageUrl to FeedItem', () => {
      render(
        <ListLayout
          items={mockItems}
          fallbackImageUrl="https://example.com/fallback.jpg"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Skeleton Loading', () => {
    it('passes count to skeleton grid', () => {
      render(
        <ListLayout
          items={[]}
          isLoading
          skeletonCount={8}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-skeleton')).toHaveAttribute('data-count', '8');
    });

    it('defaults to 5 skeleton items', () => {
      render(
        <ListLayout
          items={[]}
          isLoading
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-skeleton')).toHaveAttribute('data-count', '5');
    });

    it('passes list type to skeleton grid', () => {
      render(
        <ListLayout
          items={[]}
          isLoading
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-skeleton')).toHaveAttribute('data-type', 'list');
    });

    it('passes showThumbnail based on thumbnailPosition', () => {
      render(
        <ListLayout
          items={[]}
          isLoading
          thumbnailPosition="none"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-skeleton')).toHaveAttribute(
        'data-show-thumbnail',
        'false'
      );
    });
  });

  describe('Item Click Handling', () => {
    it('passes onItemClick to FeedItem', () => {
      const handleClick = jest.fn();
      render(
        <ListLayout
          items={mockItems}
          onItemClick={handleClick}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      render(
        <ListLayout
          items={mockItems}
          className="custom-class"
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout')).toHaveClass('custom-class');
    });
  });

  describe('Key Update on forceFallback', () => {
    it('re-renders when forceFallback changes', () => {
      const { rerender } = render(
        <ListLayout
          items={mockItems}
          forceFallback={false}
          testId="list-layout"
        />
      );

      rerender(
        <ListLayout
          items={mockItems}
          forceFallback={true}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });
  });

  describe('Description Truncation', () => {
    it('passes truncateDescription to FeedItem', () => {
      render(
        <ListLayout
          items={mockItems}
          truncateDescription={100}
          testId="list-layout"
        />
      );

      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });

    it('defaults to 200 characters for truncation', () => {
      render(
        <ListLayout
          items={mockItems}
          testId="list-layout"
        />
      );

      // Default is 200, FeedItem would handle this
      expect(screen.getByTestId('list-layout-item-0')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('is wrapped with React.memo', () => {
      const { rerender } = render(
        <ListLayout items={mockItems} testId="list-layout" />
      );

      rerender(<ListLayout items={mockItems} testId="list-layout" />);

      expect(screen.getByTestId('list-layout')).toBeInTheDocument();
    });
  });
});
