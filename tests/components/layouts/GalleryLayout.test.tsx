/**
 * Tests for GalleryLayout Component
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock styles
jest.mock('../../../src/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryLayout.module.scss', () => {
  const styles = {
    gallery: 'gallery',
    'columns-2': 'columns-2',
    'columns-3': 'columns-3',
    'columns-4': 'columns-4',
    galleryItem: 'galleryItem',
    imageWrapper: 'imageWrapper',
    image: 'image',
    noImage: 'noImage',
    noImageIcon: 'noImageIcon',
    hoverOverlay: 'hoverOverlay',
    title: 'title',
    date: 'date',
    titleBelow: 'titleBelow',
    'title-none': 'title-none',
    'title-hover': 'title-hover',
    'title-below': 'title-below',
    skeletonItem: 'skeletonItem',
    skeletonImage: 'skeletonImage',
    skeletonTitle: 'skeletonTitle',
  };
  return { default: styles, ...styles };
});

// Mock shared components
jest.mock('../../../src/webparts/polRssGallery/components/shared/EmptyState', () => ({
  NoItemsEmptyState: () => <div data-testid="empty-state">No items</div>,
}));

import { GalleryLayout, IGalleryLayoutProps } from '../../../src/webparts/polRssGallery/components/layouts/GalleryLayout';
import { IRssItem } from '../../../src/webparts/polRssGallery/components/IRssItem';

describe('GalleryLayout', () => {
  // Sample items with images
  const createSampleItems = (count: number = 6, withImages: boolean = true): IRssItem[] =>
    Array.from({ length: count }, (_, i) => ({
      title: `Item ${i + 1}`,
      link: `https://example.com/item-${i + 1}`,
      pubDate: new Date(2025, 0, 15 - i).toISOString(),
      description: `Description for item ${i + 1}`,
      imageUrl: withImages ? `https://example.com/image-${i + 1}.jpg` : undefined,
    }));

  const defaultProps: IGalleryLayoutProps = {
    items: createSampleItems(6),
    columns: 'auto',
    gap: 'md',
    showTitles: 'below',
    aspectRatio: '4:3',
    isLoading: false,
  };

  describe('Rendering', () => {
    it('renders gallery grid with items', () => {
      render(<GalleryLayout {...defaultProps} />);

      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^gallery-layout-item-\d+$/)).toHaveLength(6);
    });

    it('renders item images', () => {
      render(<GalleryLayout {...defaultProps} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(6);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image-1.jpg');
    });

    it('renders item titles', () => {
      render(<GalleryLayout {...defaultProps} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders empty state when no items', () => {
      render(<GalleryLayout {...defaultProps} items={[]} />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('filters out items without images by default', () => {
      const mixedItems: IRssItem[] = [
        { title: 'With Image', link: 'https://example.com/1', imageUrl: 'https://example.com/img.jpg' },
        { title: 'Without Image', link: 'https://example.com/2' },
        { title: 'With Image 2', link: 'https://example.com/3', imageUrl: 'https://example.com/img2.jpg' },
      ];

      render(<GalleryLayout {...defaultProps} items={mixedItems} />);

      expect(screen.getAllByTestId(/^gallery-layout-item-\d+$/)).toHaveLength(2);
      expect(screen.getByText('With Image')).toBeInTheDocument();
      expect(screen.getByText('With Image 2')).toBeInTheDocument();
      expect(screen.queryByText('Without Image')).not.toBeInTheDocument();
    });

    it('shows items without images when filterNoImages is false', () => {
      const mixedItems: IRssItem[] = [
        { title: 'With Image', link: 'https://example.com/1', imageUrl: 'https://example.com/img.jpg' },
        { title: 'Without Image', link: 'https://example.com/2' },
      ];

      render(<GalleryLayout {...defaultProps} items={mixedItems} filterNoImages={false} />);

      expect(screen.getAllByTestId(/^gallery-layout-item-\d+$/)).toHaveLength(2);
    });
  });

  describe('Fallback Images', () => {
    it('uses fallback image for items without images', () => {
      const itemsWithoutImages: IRssItem[] = [
        { title: 'No Image', link: 'https://example.com/1' },
      ];

      render(
        <GalleryLayout
          {...defaultProps}
          items={itemsWithoutImages}
          fallbackImageUrl="https://example.com/fallback.jpg"
          filterNoImages={false}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });

    it('forces fallback image when forceFallback is true', () => {
      render(
        <GalleryLayout
          {...defaultProps}
          fallbackImageUrl="https://example.com/fallback.jpg"
          forceFallback={true}
        />
      );

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', 'https://example.com/fallback.jpg');
      });
    });
  });

  describe('Title Display', () => {
    it('shows titles below when showTitles="below"', () => {
      render(<GalleryLayout {...defaultProps} showTitles="below" />);

      expect(screen.getByTestId('gallery-layout-item-0-title-below')).toBeInTheDocument();
    });

    it('shows titles on hover when showTitles="hover"', () => {
      render(<GalleryLayout {...defaultProps} showTitles="hover" />);

      expect(screen.getByTestId('gallery-layout-item-0-hover-overlay')).toBeInTheDocument();
    });

    it('hides titles when showTitles="none"', () => {
      render(<GalleryLayout {...defaultProps} showTitles="none" />);

      expect(screen.queryByTestId('gallery-layout-item-0-title-below')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gallery-layout-item-0-hover-overlay')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens link on item click', () => {
      const mockOpen = jest.fn();
      const originalOpen = window.open;
      window.open = mockOpen;

      render(<GalleryLayout {...defaultProps} />);

      fireEvent.click(screen.getByTestId('gallery-layout-item-0'));

      expect(mockOpen).toHaveBeenCalledWith(
        'https://example.com/item-1',
        '_blank',
        'noopener,noreferrer'
      );

      window.open = originalOpen;
    });

    it('calls onItemClick callback when provided', () => {
      const mockClick = jest.fn();

      render(<GalleryLayout {...defaultProps} onItemClick={mockClick} />);

      fireEvent.click(screen.getByTestId('gallery-layout-item-0'));

      expect(mockClick).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Item 1',
        link: 'https://example.com/item-1',
      }));
    });

    it('opens link on Enter key', () => {
      const mockOpen = jest.fn();
      const originalOpen = window.open;
      window.open = mockOpen;

      render(<GalleryLayout {...defaultProps} />);

      fireEvent.keyDown(screen.getByTestId('gallery-layout-item-0'), { key: 'Enter' });

      expect(mockOpen).toHaveBeenCalled();

      window.open = originalOpen;
    });

    it('opens link on Space key', () => {
      const mockOpen = jest.fn();
      const originalOpen = window.open;
      window.open = mockOpen;

      render(<GalleryLayout {...defaultProps} />);

      fireEvent.keyDown(screen.getByTestId('gallery-layout-item-0'), { key: ' ' });

      expect(mockOpen).toHaveBeenCalled();

      window.open = originalOpen;
    });
  });

  describe('Accessibility', () => {
    it('has role="link" on gallery items', () => {
      render(<GalleryLayout {...defaultProps} />);

      const items = screen.getAllByRole('link');
      expect(items.length).toBeGreaterThan(0);
    });

    it('has tabIndex for keyboard navigation', () => {
      render(<GalleryLayout {...defaultProps} />);

      const item = screen.getByTestId('gallery-layout-item-0');
      expect(item).toHaveAttribute('tabIndex', '0');
    });

    it('has aria-label with item title', () => {
      render(<GalleryLayout {...defaultProps} />);

      const item = screen.getByTestId('gallery-layout-item-0');
      expect(item).toHaveAttribute('aria-label', 'Item 1');
    });

    it('has alt text on images', () => {
      render(<GalleryLayout {...defaultProps} />);

      const img = screen.getAllByRole('img')[0];
      expect(img).toHaveAttribute('alt', 'Item 1');
    });
  });

  describe('Loading State', () => {
    it('shows skeleton when loading', () => {
      render(<GalleryLayout {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId('gallery-layout-skeleton-item-0')).toBeInTheDocument();
    });

    it('shows correct number of skeleton items', () => {
      render(<GalleryLayout {...defaultProps} isLoading={true} skeletonCount={8} />);

      expect(screen.getAllByTestId(/gallery-layout-skeleton-item-/)).toHaveLength(8);
    });
  });

  describe('Column Settings', () => {
    it('applies auto columns by default', () => {
      render(<GalleryLayout {...defaultProps} columns="auto" />);

      const gallery = screen.getByTestId('gallery-layout');
      expect(gallery).toHaveClass('gallery');
    });

    it('applies fixed 2 columns', () => {
      render(<GalleryLayout {...defaultProps} columns={2} />);

      const gallery = screen.getByTestId('gallery-layout');
      expect(gallery).toHaveClass('columns-2');
    });

    it('applies fixed 3 columns', () => {
      render(<GalleryLayout {...defaultProps} columns={3} />);

      const gallery = screen.getByTestId('gallery-layout');
      expect(gallery).toHaveClass('columns-3');
    });

    it('applies fixed 4 columns', () => {
      render(<GalleryLayout {...defaultProps} columns={4} />);

      const gallery = screen.getByTestId('gallery-layout');
      expect(gallery).toHaveClass('columns-4');
    });
  });

  describe('Aspect Ratios', () => {
    it('renders with 1:1 aspect ratio', () => {
      render(<GalleryLayout {...defaultProps} aspectRatio="1:1" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });

    it('renders with 4:3 aspect ratio', () => {
      render(<GalleryLayout {...defaultProps} aspectRatio="4:3" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });

    it('renders with 16:9 aspect ratio', () => {
      render(<GalleryLayout {...defaultProps} aspectRatio="16:9" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });
  });

  describe('Gap Settings', () => {
    it('renders with small gap', () => {
      render(<GalleryLayout {...defaultProps} gap="sm" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });

    it('renders with medium gap', () => {
      render(<GalleryLayout {...defaultProps} gap="md" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });

    it('renders with large gap', () => {
      render(<GalleryLayout {...defaultProps} gap="lg" />);
      expect(screen.getByTestId('gallery-layout')).toBeInTheDocument();
    });
  });

  describe('Props Integration', () => {
    it('passes className to container', () => {
      render(<GalleryLayout {...defaultProps} className="custom-class" />);

      const gallery = screen.getByTestId('gallery-layout');
      expect(gallery).toHaveClass('custom-class');
    });

    it('uses custom testId', () => {
      render(<GalleryLayout {...defaultProps} testId="my-gallery" />);

      expect(screen.getByTestId('my-gallery')).toBeInTheDocument();
    });
  });
});
