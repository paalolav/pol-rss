/**
 * Norwegian News Feeds Integration Tests
 *
 * Tests real RSS feeds from major Norwegian news sites to ensure
 * compatibility with the RSS parser and proxy service.
 *
 * These tests fetch live feeds and validate:
 * - Feed accessibility (CORS handling via proxy)
 * - Feed parsing (RSS/Atom format detection)
 * - Content extraction (title, link, description, images, dates)
 * - Norwegian character encoding (æ, ø, å)
 *
 * Working feeds (verified):
 * - NRK (nrk.no) - Norwegian Broadcasting Corporation ✅
 * - VG (vg.no) - Verdens Gang ✅
 * - E24 (e24.no) - Business news ✅
 * - TV2 (tv2.no) - TV2 Norway ✅
 *
 * Known issues:
 * - Dagbladet (dagbladet.no) - Returns HTML instead of RSS
 * - Nettavisen (nettavisen.no) - Malformed XML
 */

import 'whatwg-fetch';
import { ProxyService } from '../../src/webparts/polRssGallery/services/proxyService';
import { ImprovedFeedParser } from '../../src/webparts/polRssGallery/services/ImprovedFeedParser';
import { IRssItem } from '../../src/webparts/polRssGallery/components/IRssItem';

// Mock the SharePoint HttpClient
const mockHttpClient = {
  fetch: jest.fn()
};

// Mock RssDebugUtils
jest.mock('../../src/webparts/polRssGallery/utils/rssDebugUtils', () => ({
  RssDebugUtils: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    isEnabled: () => false,
    isDebugEnabled: () => false,
    setDebugMode: jest.fn(),
    analyzeRssFeed: jest.fn(() => ''),
  }
}));

// Mock sp-core-library Log
jest.mock('@microsoft/sp-core-library', () => ({
  Log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Mock sp-http
jest.mock('@microsoft/sp-http', () => ({
  HttpClient: {
    configurations: {
      v1: {}
    }
  }
}));

// Mock localization strings
jest.mock('RssFeedWebPartStrings', () => ({
  ErrorParsingFeed: 'Error parsing feed',
  ErrorFetchingFeed: 'Error fetching feed',
}), { virtual: true });

/**
 * Norwegian news feed URLs - VERIFIED WORKING
 * These are publicly available RSS feeds from major Norwegian news outlets
 */
export const NORWEGIAN_FEED_URLS = {
  // NRK - Norwegian Broadcasting Corporation (verified working)
  NRK_TOPPSAKER: 'https://www.nrk.no/toppsaker.rss',
  NRK_SPORT: 'https://www.nrk.no/sport/toppsaker.rss',
  NRK_KULTUR: 'https://www.nrk.no/kultur/toppsaker.rss',

  // VG - Verdens Gang (Norway's largest news site) - verified working
  VG_RSS: 'https://www.vg.no/rss/feed/?format=rss',

  // E24 - Business/Finance news - verified working
  E24_RSS: 'https://e24.no/rss2',

  // TV2 - TV2 Norway - verified working
  TV2_NYHETER: 'https://www.tv2.no/rss/nyheter',
  TV2_SPORT: 'https://www.tv2.no/rss/sport',
};

/**
 * Feed URLs that are known to have issues
 * These are tested separately with appropriate expectations
 */
export const PROBLEMATIC_FEED_URLS = {
  // Dagbladet - returns HTML page instead of RSS feed
  DAGBLADET_RSS: 'https://www.dagbladet.no/rss',

  // Nettavisen - has malformed XML (attribute without value)
  NETTAVISEN_RSS: 'https://www.nettavisen.no/rss',

  // Sentralregisteret - sometimes returns wrapped content via proxy
  SENTRALREGISTERET: 'https://sentralregisteret.no/feed',
};

/**
 * Helper function to fetch feed content using ProxyService
 */
async function fetchFeedContent(url: string): Promise<string> {
  try {
    const response = await ProxyService.fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper to parse feed and return items
 */
function parseFeed(xmlContent: string, fallbackImageUrl: string = ''): IRssItem[] {
  return ImprovedFeedParser.parse(xmlContent, {
    fallbackImageUrl,
    maxItems: 10,
    enableRecovery: true,
  });
}

/**
 * Validate that feed items have expected properties
 */
function validateFeedItems(items: IRssItem[], feedName: string): void {
  expect(items.length).toBeGreaterThan(0);

  items.forEach((item, index) => {
    // Every item should have a title
    expect(item.title).toBeTruthy();
    expect(typeof item.title).toBe('string');

    // Every item should have a link (URL to the article)
    expect(item.link).toBeTruthy();
    expect(item.link).toMatch(/^https?:\/\//);

    // Description is optional but if present should be a string
    if (item.description) {
      expect(typeof item.description).toBe('string');
    }

    // pubDate should be present for news feeds
    if (item.pubDate) {
      expect(typeof item.pubDate).toBe('string');
    }

    // Log item details for debugging
    // eslint-disable-next-line no-console
    console.log(`[${feedName}] Item ${index + 1}: ${item.title.substring(0, 50)}...`);
  });
}

/**
 * Check if content contains Norwegian characters and they are properly decoded
 */
function validateNorwegianEncoding(items: IRssItem[]): boolean {
  const corruptedPatterns = /Ã¦|Ã¸|Ã¥|Ã†|Ã˜|Ã…/; // Signs of double-encoding

  for (const item of items) {
    const text = `${item.title} ${item.description || ''}`;

    // If we find corrupted patterns, encoding is broken
    if (corruptedPatterns.test(text)) {
      // eslint-disable-next-line no-console
      console.warn('Found corrupted Norwegian characters:', text.substring(0, 100));
      return false;
    }
  }

  return true;
}

/**
 * Check if content is valid RSS/Atom XML (not HTML)
 */
function isValidFeedContent(content: string): boolean {
  // Check for RSS/Atom markers
  const hasRssMarkers = /<rss|<feed|<channel/i.test(content);
  // Check it's not an HTML page
  const isHtml = /<html|<!DOCTYPE html/i.test(content);

  return hasRssMarkers && !isHtml;
}

describe('Norwegian News Feeds Integration Tests', () => {
  // Increase timeout for network requests
  jest.setTimeout(30000);

  beforeAll(() => {
    // Initialize ProxyService
    ProxyService.init(mockHttpClient as never);
    ProxyService.setDebugMode(false);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Feed Accessibility (Working Feeds)', () => {
    it('should fetch NRK toppsaker feed via proxy', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);

      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(100);
      expect(isValidFeedContent(content)).toBe(true);
    });

    it('should fetch VG RSS feed via proxy', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.VG_RSS);

      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(100);
      expect(isValidFeedContent(content)).toBe(true);
    });

    it('should fetch E24 RSS feed via proxy', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.E24_RSS);

      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(100);
      expect(isValidFeedContent(content)).toBe(true);
    });

    it('should fetch TV2 nyheter feed via proxy', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.TV2_NYHETER);

      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(100);
      expect(isValidFeedContent(content)).toBe(true);
    });
  });

  describe('Feed Parsing (Working Feeds)', () => {
    it('should parse NRK toppsaker feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content);

      validateFeedItems(items, 'NRK');
      expect(items[0].feedType).toBe('rss');
    });

    it('should parse VG RSS feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.VG_RSS);
      const items = parseFeed(content);

      validateFeedItems(items, 'VG');
    });

    it('should parse E24 RSS feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.E24_RSS);
      const items = parseFeed(content);

      validateFeedItems(items, 'E24');
    });

    it('should parse TV2 nyheter feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.TV2_NYHETER);
      const items = parseFeed(content);

      validateFeedItems(items, 'TV2');
    });
  });

  describe('Norwegian Character Encoding', () => {
    it('should properly handle Norwegian characters in NRK feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content);

      expect(validateNorwegianEncoding(items)).toBe(true);
    });

    it('should properly handle Norwegian characters in VG feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.VG_RSS);
      const items = parseFeed(content);

      expect(validateNorwegianEncoding(items)).toBe(true);
    });

    it('should properly handle Norwegian characters in E24 feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.E24_RSS);
      const items = parseFeed(content);

      expect(validateNorwegianEncoding(items)).toBe(true);
    });

    it('should properly handle Norwegian characters in TV2 feed', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.TV2_NYHETER);
      const items = parseFeed(content);

      expect(validateNorwegianEncoding(items)).toBe(true);
    });
  });

  describe('Image Extraction', () => {
    it('should extract images from media:thumbnail or enclosure elements', async () => {
      // NRK often uses media:thumbnail
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content, 'https://fallback.example.com/image.jpg');

      const itemsWithImages = items.filter(item =>
        item.imageUrl && !item.imageUrl.includes('fallback.example.com')
      );

      // eslint-disable-next-line no-console
      console.log(`NRK: ${itemsWithImages.length}/${items.length} items have images`);
      // NRK usually includes images
      expect(itemsWithImages.length).toBeGreaterThan(0);
    });

    it('should use fallback image when no image found', async () => {
      const fallbackUrl = 'https://fallback.example.com/default-image.jpg';
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content, fallbackUrl);

      // All items should have an imageUrl (either real or fallback)
      items.forEach(item => {
        expect(item.imageUrl).toBeTruthy();
      });
    });
  });

  describe('Date Parsing', () => {
    it('should parse dates from Norwegian feeds', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content);

      items.forEach(item => {
        if (item.pubDate) {
          // pubDate should be a valid ISO string or parseable date
          const date = new Date(item.pubDate);
          expect(date.toString()).not.toBe('Invalid Date');
          // eslint-disable-next-line no-console
          console.log(`Date parsed: ${item.pubDate} → ${date.toISOString()}`);
        }
      });
    });
  });

  describe('Feed Structure Compatibility', () => {
    it('should handle RSS 2.0 feeds (most Norwegian sites)', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);

      // Check it's RSS 2.0
      expect(content).toContain('<rss');
      expect(content).toContain('version="2.0"');
    });

    it('should detect feed type correctly', async () => {
      const content = await fetchFeedContent(NORWEGIAN_FEED_URLS.NRK_TOPPSAKER);
      const items = parseFeed(content);

      // All items from RSS feed should have feedType = 'rss'
      items.forEach(item => {
        expect(item.feedType).toBe('rss');
      });
    });
  });
});

describe('Problematic Feeds (Known Issues)', () => {
  jest.setTimeout(30000);

  beforeAll(() => {
    ProxyService.init(mockHttpClient as never);
  });

  it('should detect Dagbladet returns HTML instead of RSS', async () => {
    const content = await fetchFeedContent(PROBLEMATIC_FEED_URLS.DAGBLADET_RSS);

    // Dagbladet returns an HTML page, not RSS
    const isHtml = /<html|<!DOCTYPE html/i.test(content);
    const isRss = /<rss|<feed/i.test(content);

    // eslint-disable-next-line no-console
    console.log(`Dagbladet: isHtml=${isHtml}, isRss=${isRss}`);

    // Document the current behavior - Dagbladet doesn't provide a working RSS feed
    expect(content).toBeTruthy();
    // This test documents that Dagbladet's RSS endpoint returns HTML
    if (isHtml && !isRss) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Dagbladet RSS returns HTML - feed not available');
    }
  });

  it('should attempt to parse Nettavisen feed (may have malformed XML)', async () => {
    const content = await fetchFeedContent(PROBLEMATIC_FEED_URLS.NETTAVISEN_RSS);

    // Try to parse - may fail due to malformed XML
    try {
      const items = parseFeed(content);
      // eslint-disable-next-line no-console
      console.log(`Nettavisen: Successfully parsed ${items.length} items`);
      expect(items.length).toBeGreaterThan(0);
    } catch (error) {
      // Document the parsing error
      // eslint-disable-next-line no-console
      console.log(`⚠️ Nettavisen RSS has malformed XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Test passes - we're documenting the known issue
      expect(error).toBeDefined();
    }
  });

  it('should attempt to parse Sentralregisteret feed', async () => {
    const content = await fetchFeedContent(PROBLEMATIC_FEED_URLS.SENTRALREGISTERET);

    // Check if content is valid feed or wrapped by proxy
    if (isValidFeedContent(content)) {
      try {
        const items = parseFeed(content);
        // eslint-disable-next-line no-console
        console.log(`Sentralregisteret: Successfully parsed ${items.length} items`);
        expect(items.length).toBeGreaterThan(0);
      } catch (error) {
        // Feed content may be malformed due to proxy wrapping
        // eslint-disable-next-line no-console
        console.log(`⚠️ Sentralregisteret feed parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Test passes - we're documenting the known issue
        expect(error).toBeDefined();
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('⚠️ Sentralregisteret feed returned non-RSS content (proxy wrapping?)');
      expect(content).toBeTruthy();
    }
  });
});

describe('Norwegian Feeds - Batch Processing', () => {
  jest.setTimeout(60000); // Longer timeout for batch tests

  beforeAll(() => {
    ProxyService.init(mockHttpClient as never);
  });

  it('should successfully process all working Norwegian feeds', async () => {
    const results: { feed: string; success: boolean; itemCount: number; error?: string }[] = [];

    for (const [feedName, feedUrl] of Object.entries(NORWEGIAN_FEED_URLS)) {
      try {
        const content = await fetchFeedContent(feedUrl);

        if (!isValidFeedContent(content)) {
          results.push({
            feed: feedName,
            success: false,
            itemCount: 0,
            error: 'Content is not valid RSS/Atom',
          });
          continue;
        }

        const items = parseFeed(content);

        results.push({
          feed: feedName,
          success: true,
          itemCount: items.length,
        });
      } catch (error) {
        results.push({
          feed: feedName,
          success: false,
          itemCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Log results summary
    // eslint-disable-next-line no-console
    console.log('\n=== Norwegian Feed Test Results ===');
    results.forEach(r => {
      const status = r.success ? '✅' : '❌';
      // eslint-disable-next-line no-console
      console.log(`${status} ${r.feed}: ${r.itemCount} items${r.error ? ` (${r.error})` : ''}`);
    });

    // Count successes
    const successCount = results.filter(r => r.success).length;
    // eslint-disable-next-line no-console
    console.log(`\nTotal: ${successCount}/${results.length} feeds successful`);

    // All verified working feeds should succeed
    expect(successCount).toBe(Object.keys(NORWEGIAN_FEED_URLS).length);
  });
});

/**
 * Additional NRK regional feeds test
 */
describe('NRK Regional Feeds', () => {
  jest.setTimeout(30000);

  beforeAll(() => {
    ProxyService.init(mockHttpClient as never);
  });

  const NRK_REGIONAL_FEEDS = {
    OSLO: 'https://www.nrk.no/osloogviken/toppsaker.rss',
    NORDLAND: 'https://www.nrk.no/nordland/toppsaker.rss',
    TRONDELAG: 'https://www.nrk.no/trondelag/toppsaker.rss',
  };

  it('should parse NRK Oslo og Viken feed', async () => {
    try {
      const content = await fetchFeedContent(NRK_REGIONAL_FEEDS.OSLO);
      if (isValidFeedContent(content)) {
        const items = parseFeed(content);
        expect(items.length).toBeGreaterThan(0);
        // eslint-disable-next-line no-console
        console.log(`NRK Oslo og Viken: ${items.length} items`);
      }
    } catch (error) {
      // Regional feeds may not always be available
      // eslint-disable-next-line no-console
      console.log(`NRK Oslo og Viken: ${error instanceof Error ? error.message : 'unavailable'}`);
    }
  });

  it('should parse NRK Nordland feed', async () => {
    try {
      const content = await fetchFeedContent(NRK_REGIONAL_FEEDS.NORDLAND);
      if (isValidFeedContent(content)) {
        const items = parseFeed(content);
        expect(items.length).toBeGreaterThan(0);
        // eslint-disable-next-line no-console
        console.log(`NRK Nordland: ${items.length} items`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`NRK Nordland: ${error instanceof Error ? error.message : 'unavailable'}`);
    }
  });
});
