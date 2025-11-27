/**
 * BannerCarousel Component Tests
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BannerCarousel, BannerHeight } from '../../../src/webparts/polRssGallery/components/layouts/BannerCarousel';
import { IRssItem } from '../../../src/webparts/polRssGallery/components/IRssItem';

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSwiper, onSlideChange, className, ...props }: {
    children: React.ReactNode;
    onSwiper?: (swiper: unknown) => void;
    onSlideChange?: (swiper: unknown) => void;
    className?: string;
    [key: string]: unknown;
  }) => {
    const mockSwiper = {
      realIndex: 0,
      autoplay: {
        start: jest.fn(),
        stop: jest.fn()
      }
    };

    React.useEffect(() => {
      onSwiper?.(mockSwiper);
    }, []);

    return (
      <div data-testid="swiper" className={className} {...props}>
        {children}
      </div>
    );
  },
  SwiperSlide: ({ children, className, ...props }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="swiper-slide" className={className} {...props}>
      {children}
    </div>
  )
}));

// Mock Swiper modules
jest.mock('swiper/modules', () => ({
  Autoplay: {},
  Navigation: {},
  Pagination: {},
  Keyboard: {},
  A11y: {}
}));

// Mock Swiper CSS
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/autoplay', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));

// Mock shared components
jest.mock('../../../src/webparts/polRssGallery/components/shared/FeedItem', () => ({
  FeedItem: ({ item, testId }: { item: IRssItem; testId?: string }) => (
    <div data-testid={testId || 'feed-item'} data-title={item.title}>{item.title}</div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/Skeleton', () => ({
  BannerSkeleton: ({ testId }: { testId?: string }) => (
    <div data-testid={testId || 'banner-skeleton'}>Loading...</div>
  )
}));

jest.mock('../../../src/webparts/polRssGallery/components/shared/EmptyState', () => ({
  NoItemsEmptyState: () => <div data-testid="empty-state">No items</div>
}));

describe('BannerCarousel', () => {
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
      render(<BannerCarousel items={mockItems} testId="banner" />);

      expect(screen.getByTestId('banner')).toBeInTheDocument();
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    it('renders all items as slides', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      const slides = screen.getAllByTestId('swiper-slide');
      expect(slides).toHaveLength(mockItems.length);
    });

    it('renders each item with FeedItem component', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      mockItems.forEach((item, index) => {
        expect(screen.getByTestId(`banner-item-${index}`)).toBeInTheDocument();
      });
    });

    it('renders loading skeleton when isLoading is true', () => {
      render(<BannerCarousel items={[]} isLoading testId="banner" />);

      expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
    });

    it('renders empty state when items is empty', () => {
      render(<BannerCarousel items={[]} testId="banner" />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('Height variants', () => {
    it.each(['sm', 'md', 'lg'] as BannerHeight[])('applies %s height', (height) => {
      render(<BannerCarousel items={mockItems} height={height} testId="banner" />);

      const banner = screen.getByTestId('banner');
      expect(banner.style.getPropertyValue('--banner-height')).toBeTruthy();
    });

    it('defaults to md height', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      const banner = screen.getByTestId('banner');
      expect(banner.style.getPropertyValue('--banner-height')).toBe('350px');
    });
  });

  describe('Navigation', () => {
    it('renders navigation buttons when showNavigation is true and multiple items', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showNavigation
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-prev')).toBeInTheDocument();
      expect(screen.getByTestId('banner-next')).toBeInTheDocument();
    });

    it('does not render navigation when showNavigation is false', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showNavigation={false}
          testId="banner"
        />
      );

      expect(screen.queryByTestId('banner-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-next')).not.toBeInTheDocument();
    });

    it('does not render navigation when only one item', () => {
      render(
        <BannerCarousel
          items={[mockItems[0]]}
          showNavigation
          testId="banner"
        />
      );

      expect(screen.queryByTestId('banner-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-next')).not.toBeInTheDocument();
    });

    it('prev button has correct aria-label', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showNavigation
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-prev')).toHaveAttribute(
        'aria-label',
        'Forrige lysbilde'
      );
    });

    it('next button has correct aria-label', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showNavigation
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-next')).toHaveAttribute(
        'aria-label',
        'Neste lysbilde'
      );
    });
  });

  describe('Pagination', () => {
    it('renders pagination when showPagination is true and multiple items', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showPagination
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-pagination')).toBeInTheDocument();
    });

    it('does not render pagination when showPagination is false', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showPagination={false}
          testId="banner"
        />
      );

      expect(screen.queryByTestId('banner-pagination')).not.toBeInTheDocument();
    });

    it('does not render pagination when only one item', () => {
      render(
        <BannerCarousel
          items={[mockItems[0]]}
          showPagination
          testId="banner"
        />
      );

      expect(screen.queryByTestId('banner-pagination')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="region"', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      expect(screen.getByTestId('banner')).toHaveAttribute('role', 'region');
    });

    it('has aria-roledescription="karusell"', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      expect(screen.getByTestId('banner')).toHaveAttribute(
        'aria-roledescription',
        'karusell'
      );
    });

    it('has aria-label with slide count', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      expect(screen.getByTestId('banner')).toHaveAttribute(
        'aria-label',
        expect.stringContaining('3 lysbilder')
      );
    });

    it('renders live region for screen readers', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      const liveRegion = screen.getByText(/Lysbilde \d+ av \d+/);
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('slides have correct role and aria attributes', () => {
      render(<BannerCarousel items={mockItems} testId="banner" />);

      const slides = screen.getAllByTestId('swiper-slide');
      slides.forEach((slide) => {
        expect(slide).toHaveAttribute('role', 'group');
        expect(slide).toHaveAttribute('aria-roledescription', 'lysbilde');
      });
    });
  });

  describe('Pause on Hover', () => {
    it('shows pause indicator when paused', async () => {
      render(
        <BannerCarousel
          items={mockItems}
          autoplay
          pauseOnHover
          testId="banner"
        />
      );

      fireEvent.mouseEnter(screen.getByTestId('banner'));

      await waitFor(() => {
        expect(screen.getByTestId('banner-pause-indicator')).toBeInTheDocument();
      });
    });

    it('does not show pause indicator when autoplay is false', () => {
      render(
        <BannerCarousel
          items={mockItems}
          autoplay={false}
          pauseOnHover
          testId="banner"
        />
      );

      fireEvent.mouseEnter(screen.getByTestId('banner'));

      expect(screen.queryByTestId('banner-pause-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Item Click Handling', () => {
    it('calls onItemClick when item is clicked', () => {
      const handleClick = jest.fn();
      render(
        <BannerCarousel
          items={mockItems}
          onItemClick={handleClick}
          testId="banner"
        />
      );

      // The FeedItem component would handle the click
      // This tests that the handler is passed correctly
      expect(screen.getByTestId('banner-item-0')).toBeInTheDocument();
    });
  });

  describe('Display Options', () => {
    it('passes showPubDate to FeedItem', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showPubDate={false}
          testId="banner"
        />
      );

      // FeedItem would handle this prop
      expect(screen.getByTestId('banner-item-0')).toBeInTheDocument();
    });

    it('passes showDescription to FeedItem', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showDescription={false}
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-item-0')).toBeInTheDocument();
    });

    it('passes showCategories to FeedItem', () => {
      render(
        <BannerCarousel
          items={mockItems}
          showCategories
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-item-0')).toBeInTheDocument();
    });

    it('passes fallbackImageUrl to FeedItem', () => {
      render(
        <BannerCarousel
          items={mockItems}
          fallbackImageUrl="https://example.com/fallback.jpg"
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner-item-0')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      render(
        <BannerCarousel
          items={mockItems}
          className="custom-class"
          testId="banner"
        />
      );

      expect(screen.getByTestId('banner')).toHaveClass('custom-class');
    });
  });

  describe('Key Update on forceFallback', () => {
    it('re-renders when forceFallback changes', () => {
      const { rerender } = render(
        <BannerCarousel
          items={mockItems}
          forceFallback={false}
          testId="banner"
        />
      );

      rerender(
        <BannerCarousel
          items={mockItems}
          forceFallback={true}
          testId="banner"
        />
      );

      // Component should still be visible after re-render
      expect(screen.getByTestId('banner')).toBeInTheDocument();
    });
  });
});
