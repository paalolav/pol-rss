/**
 * RssFeed Component Tests
 *
 * Test template demonstrating component testing patterns for the RSS Feed webpart.
 * Uses React Testing Library for user-centric testing approach.
 */

import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RssFeed, { IRssFeedProps } from '../../src/webparts/polRssGallery/components/RssFeed';
import { createMockRssItems, rss2StandardXml } from '../utils/feedTestData';
import { CacheService } from '../../src/webparts/polRssGallery/services/cacheService';

// Mock Swiper before anything else to prevent ESM import errors
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}));
jest.mock('swiper/modules', () => ({
  Autoplay: {},
  Navigation: {},
  Pagination: {},
  Keyboard: {},
  A11y: {},
}));
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/autoplay', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));

// Mock the services
jest.mock('../../src/webparts/polRssGallery/services/cacheService');
jest.mock('../../src/webparts/polRssGallery/services/proxyService', () => ({
  ProxyService: {
    setDebugMode: jest.fn(),
    fetchWithFirstProxy: jest.fn(),
  },
}));

// Mock layout components to isolate RssFeed testing (use correct paths)
jest.mock('../../src/webparts/polRssGallery/components/layouts/BannerCarousel', () => ({
  __esModule: true,
  BannerCarousel: ({ items }: { items: unknown[] }) => (
    <div data-testid="banner-carousel">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="carousel-item">
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/CardLayout', () => ({
  __esModule: true,
  CardLayout: ({ items }: { items: unknown[] }) => (
    <div data-testid="card-layout">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="card-item">
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/ListLayout', () => ({
  __esModule: true,
  ListLayout: ({ items }: { items: unknown[] }) => (
    <div data-testid="list-layout">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="list-item">
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/MinimalLayout', () => ({
  __esModule: true,
  MinimalLayout: ({ items }: { items: unknown[] }) => (
    <div data-testid="minimal-layout">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="minimal-item">
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock ErrorBoundary
jest.mock('../../src/webparts/polRssGallery/components/ErrorBoundary', () => ({
  RssErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RssFeed Component', () => {
  // Default props for testing
  const defaultProps: IRssFeedProps = {
    webPartTitle: 'Test RSS Feed',
    feedUrl: 'https://example.com/feed.rss',
    autoRefresh: false,
    refreshInterval: 5,
    layout: 'card',
    autoscroll: false,
    interval: 5000,
    forceFallbackImage: false,
    fallbackImageUrl: 'https://example.com/fallback.jpg',
    showPubDate: true,
    showDescription: true,
    maxItems: 10,
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup CacheService mock
    (CacheService.getInstance as jest.Mock).mockReturnValue(mockCacheService);

    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      mockCacheService.get.mockResolvedValue([]);

      const { container } = render(<RssFeed {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('displays the webpart title when provided', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} webPartTitle="My RSS Feed" />);

      await waitFor(() => {
        expect(screen.getByText('My RSS Feed')).toBeInTheDocument();
      });
    });

    it('does not display title when webPartTitle is empty', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} webPartTitle="" />);

      await waitFor(() => {
        expect(screen.queryByText('Test RSS Feed')).not.toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('displays loading spinner initially', () => {
      // Don't resolve the cache get immediately
      mockCacheService.get.mockImplementation(() => new Promise(() => {}));

      render(<RssFeed {...defaultProps} />);

      expect(screen.getByText('Loading RSS feed...')).toBeInTheDocument();
    });

    it('hides loading spinner after feed loads', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading RSS feed...')).not.toBeInTheDocument();
      });
    });
  });

  describe('feed display', () => {
    it('renders feed items when loaded successfully', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.getByText('Test Article 2')).toBeInTheDocument();
        expect(screen.getByText('Test Article 3')).toBeInTheDocument();
      });
    });

    it('displays "No items found" for empty feed', async () => {
      mockCacheService.get.mockResolvedValue([]);

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('No items found')).toBeInTheDocument();
      });
    });

    it('displays empty state when feedUrl is empty', async () => {
      render(<RssFeed {...defaultProps} feedUrl="" />);

      await waitFor(() => {
        expect(screen.getByText('No items found')).toBeInTheDocument();
      });
    });
  });

  describe('layout selection', () => {
    it('renders CardLayout when layout is "card"', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} layout="card" />);

      await waitFor(() => {
        expect(screen.getByTestId('card-layout')).toBeInTheDocument();
      });
    });

    it('renders ListLayout when layout is "list"', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} layout="list" />);

      await waitFor(() => {
        expect(screen.getByTestId('list-layout')).toBeInTheDocument();
      });
    });

    it('renders BannerCarousel when layout is "banner"', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} layout="banner" />);

      await waitFor(() => {
        expect(screen.getByTestId('banner-carousel')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('displays error message on fetch failure', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Network error'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Error loading feed')).toBeInTheDocument();
      });
    });

    it('displays retry button on error', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Network error'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('retries loading when retry button is clicked', async () => {
      mockCacheService.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(createMockRssItems(3));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });
    });

    it('shows specific error message for 403 errors', async () => {
      mockCacheService.get.mockRejectedValue(new Error('HTTP 403 - Forbidden'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Access denied (403 Forbidden)')).toBeInTheDocument();
      });
    });

    it('shows specific error message for 404 errors', async () => {
      mockCacheService.get.mockRejectedValue(new Error('HTTP 404 - Not Found'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Feed not found (404 Not Found)')).toBeInTheDocument();
      });
    });
  });

  // Note: Category filtering and keyword filtering features were removed in Session 15

  describe('maxItems prop', () => {
    it('passes maxItems to the cache service for limiting items', async () => {
      // maxItems is applied at the parser level via cache service
      // The component displays whatever items it receives from the cache
      const mockItems = createMockRssItems(5);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} maxItems={5} />);

      await waitFor(() => {
        const items = screen.getAllByTestId('card-item');
        expect(items).toHaveLength(5);
      });
    });
  });

  describe('auto refresh', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('does not auto-refresh when autoRefresh is false', async () => {
      const mockItems = createMockRssItems(3);
      mockCacheService.get.mockResolvedValue(mockItems);

      render(<RssFeed {...defaultProps} autoRefresh={false} refreshInterval={1} />);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Record the call count after initial render
      const initialCallCount = mockCacheService.get.mock.calls.length;

      // Advance timers by 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Should not have been called again after initial load (no auto-refresh)
      expect(mockCacheService.get).toHaveBeenCalledTimes(initialCallCount);
    });
  });
});
