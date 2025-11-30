/**
 * RssFeed Component Tests
 *
 * Test template demonstrating component testing patterns for the RSS Feed webpart.
 * Uses React Testing Library for user-centric testing approach.
 *
 * Note: RssFeed uses simple in-memory caching (no external CacheService).
 * Tests mock global.fetch to simulate feed responses.
 */

import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RssFeed, { IRssFeedProps, clearFeedCache } from '../../src/webparts/polRssGallery/components/RssFeed';
import { createMockRssItems, rss2StandardXml } from '../utils/feedTestData';

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

// Mock ProxyService
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

/**
 * Helper to create a mock RSS XML response
 */
function createMockRssXml(items: Array<{ title: string; link: string; description: string; pubDate?: string; imageUrl?: string }>): string {
  const itemsXml = items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      ${item.pubDate ? `<pubDate>${item.pubDate}</pubDate>` : ''}
      ${item.imageUrl ? `<enclosure url="${item.imageUrl}" type="image/jpeg" />` : ''}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <description>Test feed description</description>
    ${itemsXml}
  </channel>
</rss>`;
}

/**
 * Helper to create mock fetch response with arrayBuffer support (for encoding detection)
 */
function createMockResponse(xmlContent: string, ok: boolean = true, status: number = 200): Response {
  // Create a simple ArrayBuffer from string (UTF-8)
  const bytes = new Uint8Array(xmlContent.length);
  for (let i = 0; i < xmlContent.length; i++) {
    bytes[i] = xmlContent.charCodeAt(i) & 0xff;
  }

  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    text: () => Promise.resolve(xmlContent),
    arrayBuffer: () => Promise.resolve(bytes.buffer),
    headers: new Headers({ 'content-type': 'application/rss+xml; charset=utf-8' }),
  } as unknown as Response;
}

function mockFetchSuccess(xmlContent: string): void {
  (global.fetch as jest.Mock).mockResolvedValue(createMockResponse(xmlContent));
}

function mockFetchError(status: number, statusText: string): void {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status,
    statusText,
    text: () => Promise.resolve(''),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers(),
  });
}

function mockFetchNetworkError(errorMessage: string): void {
  (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));
}

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
    showPagination: false,
    hideImages: false,
    forceFallbackImage: false,
    fallbackImageUrl: 'https://example.com/fallback.jpg',
    showPubDate: true,
    showDescription: true,
    maxItems: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the internal feed cache to prevent cross-test contamination
    clearFeedCache();
    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const emptyFeedXml = createMockRssXml([]);
      mockFetchSuccess(emptyFeedXml);

      const { container } = render(<RssFeed {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('displays the webpart title when provided', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} webPartTitle="My RSS Feed" />);

      await waitFor(() => {
        expect(screen.getByText('My RSS Feed')).toBeInTheDocument();
      });
    });

    it('does not display title when webPartTitle is empty', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} webPartTitle="" />);

      await waitFor(() => {
        expect(screen.queryByText('Test RSS Feed')).not.toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('displays loading spinner initially', async () => {
      // Don't resolve fetch immediately - hang forever
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      render(<RssFeed {...defaultProps} />);

      // Use findByText since React batching may cause async rendering
      expect(await screen.findByText('Loading RSS feed...')).toBeInTheDocument();
    });

    it('hides loading spinner after feed loads', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading RSS feed...')).not.toBeInTheDocument();
      });
    });
  });

  describe('feed display', () => {
    it('renders feed items when loaded successfully', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.getByText('Test Article 2')).toBeInTheDocument();
        expect(screen.getByText('Test Article 3')).toBeInTheDocument();
      });
    });

    it('displays "No items found" for empty feed', async () => {
      // Note: When using createMockRssXml([]), the channel title/link may be
      // incorrectly parsed as items by ImprovedFeedParser. This is a known issue.
      // Testing with a truly empty/invalid feed that returns no items.
      const emptyFeedXml = '<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>';
      mockFetchSuccess(emptyFeedXml);

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
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} layout="card" />);

      await waitFor(() => {
        expect(screen.getByTestId('card-layout')).toBeInTheDocument();
      });
    });

    it('renders ListLayout when layout is "list"', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} layout="list" />);

      await waitFor(() => {
        expect(screen.getByTestId('list-layout')).toBeInTheDocument();
      });
    });

    it('renders BannerCarousel when layout is "banner"', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} layout="banner" />);

      await waitFor(() => {
        expect(screen.getByTestId('banner-carousel')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('displays error message on fetch failure', async () => {
      mockFetchNetworkError('Network error');

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Error loading feed')).toBeInTheDocument();
      });
    });

    it('displays retry button on error', async () => {
      mockFetchNetworkError('Network error');

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('retries loading when retry button is clicked', async () => {
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);

      // First call fails, second succeeds
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(createMockResponse(feedXml));

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
      // Mock both direct fetch and proxy to reject with 403
      (global.fetch as jest.Mock).mockRejectedValue(new Error('HTTP 403 - Forbidden (direct)'));
      const { ProxyService } = jest.requireMock('../../src/webparts/polRssGallery/services/proxyService');
      ProxyService.fetchWithFirstProxy.mockRejectedValue(new Error('HTTP 403 - Forbidden'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Access denied (403 Forbidden)')).toBeInTheDocument();
      });
    });

    it('shows specific error message for 404 errors', async () => {
      // Mock both direct fetch and proxy to reject with 404
      (global.fetch as jest.Mock).mockRejectedValue(new Error('HTTP 404 - Not Found (direct)'));
      const { ProxyService } = jest.requireMock('../../src/webparts/polRssGallery/services/proxyService');
      ProxyService.fetchWithFirstProxy.mockRejectedValue(new Error('HTTP 404 - Not Found'));

      render(<RssFeed {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Feed not found (404 Not Found)')).toBeInTheDocument();
      });
    });
  });

  // Note: Category filtering and keyword filtering features were removed in Session 15

  describe('maxItems prop', () => {
    it('displays up to maxItems items from the feed', async () => {
      // maxItems is applied at the parser level
      // The component displays whatever items are parsed
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
        { title: 'Test Article 4', link: 'https://example.com/4', description: 'Description 4' },
        { title: 'Test Article 5', link: 'https://example.com/5', description: 'Description 5' },
      ]);
      mockFetchSuccess(feedXml);

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
      const feedXml = createMockRssXml([
        { title: 'Test Article 1', link: 'https://example.com/1', description: 'Description 1' },
        { title: 'Test Article 2', link: 'https://example.com/2', description: 'Description 2' },
        { title: 'Test Article 3', link: 'https://example.com/3', description: 'Description 3' },
      ]);
      mockFetchSuccess(feedXml);

      render(<RssFeed {...defaultProps} autoRefresh={false} refreshInterval={1} />);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Record the call count after initial render
      const initialCallCount = (global.fetch as jest.Mock).mock.calls.length;

      // Advance timers by 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Should not have been called again after initial load (no auto-refresh)
      expect(global.fetch).toHaveBeenCalledTimes(initialCallCount);
    });
  });
});
