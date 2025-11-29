/**
 * Sentralregisteret.no Feed Tests
 *
 * This feed is protected by Cloudflare and cannot be accessed via public
 * CORS proxies. We use a saved fixture file for testing.
 *
 * Feed URL: https://www.sentralregisteret.no/feed
 *
 * Feed characteristics:
 * - WordPress-generated RSS feed
 * - Contains wp-block-image figures with images
 * - Uses CDATA sections for description and content:encoded
 * - Norwegian characters (æ, ø, å)
 */

import * as fs from 'fs';
import * as path from 'path';
import { ImprovedFeedParser } from '../../src/webparts/polRssGallery/services/ImprovedFeedParser';
import { IRssItem } from '../../src/webparts/polRssGallery/components/IRssItem';

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

// Mock localization strings
jest.mock('RssFeedWebPartStrings', () => ({
  ErrorParsingFeed: 'Error parsing feed',
  ErrorFetchingFeed: 'Error fetching feed',
}), { virtual: true });

const FIXTURE_PATH = path.join(__dirname, '../fixtures/sentralregisteret-feed.xml');

/**
 * Helper to parse feed with recovery mode
 */
function parseFeedWithRecovery(xmlContent: string, fallbackImageUrl: string = ''): {
  items: IRssItem[];
  recoveryUsed: boolean;
  warnings: string[];
} {
  return ImprovedFeedParser.parseWithRecovery(xmlContent, {
    fallbackImageUrl,
    maxItems: 20,
    enableRecovery: true,
    enableDebug: false,
  });
}

describe('Sentralregisteret.no Feed Tests (Fixture)', () => {
  let feedContent: string;

  beforeAll(() => {
    // Load the feed from fixture file
    try {
      feedContent = fs.readFileSync(FIXTURE_PATH, 'utf8');
      console.log(`Loaded fixture: ${feedContent.length} bytes`);
    } catch (error) {
      console.log('Failed to load fixture file:', error);
      feedContent = '';
    }
  });

  test('fixture file contains valid RSS feed', () => {
    expect(feedContent).toBeTruthy();
    expect(feedContent.length).toBeGreaterThan(1000);

    // Check it's valid RSS
    expect(feedContent).toContain('<rss');
    expect(feedContent).toContain('<channel>');
    expect(feedContent).toContain('<item>');

    // Count items in raw XML
    const itemMatches = feedContent.match(/<item>/g);
    const itemCount = itemMatches ? itemMatches.length : 0;
    console.log(`Fixture contains ${itemCount} <item> tags`);

    expect(itemCount).toBe(10);
  });

  test('native DOMParser should parse all items', () => {
    // First verify the native DOMParser works
    const parser = new DOMParser();
    const doc = parser.parseFromString(feedContent, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.log('Native DOMParser error:', parseError.textContent?.substring(0, 200));
    }

    const items = doc.querySelectorAll('item');
    console.log(`Native DOMParser found ${items.length} items`);
    expect(items.length).toBe(10);
  });

  test('should parse ALL 10 items from sentralregisteret feed', () => {
    const result = parseFeedWithRecovery(feedContent);

    console.log(`Parsed ${result.items.length} items`);
    console.log(`Recovery used: ${result.recoveryUsed}`);

    // Should parse all 10 items
    expect(result.items.length).toBe(10);

    // Log all items
    result.items.forEach((item, i) => {
      console.log(`Item ${i + 1}: "${item.title.substring(0, 50)}..." - ${item.imageUrl ? 'has image' : 'NO IMAGE'}`);
    });
  });

  test('should extract images from wp-block-image figures', () => {
    const result = parseFeedWithRecovery(feedContent, 'https://fallback.example.com/image.jpg');

    // Check which items have images (not using fallback)
    const itemsWithImages = result.items.filter(item =>
      item.imageUrl && !item.imageUrl.includes('fallback.example.com')
    );

    console.log(`Items with extracted images: ${itemsWithImages.length}/${result.items.length}`);

    // Log images found
    result.items.slice(0, 5).forEach((item, i) => {
      console.log(`Item ${i + 1} image: ${item.imageUrl || 'none'}`);
    });

    // Most items should have images extracted from wp-block-image
    expect(itemsWithImages.length).toBeGreaterThanOrEqual(5);
  });

  test('should handle Norwegian characters correctly', () => {
    const result = parseFeedWithRecovery(feedContent);

    // Check for Norwegian characters in parsed content
    const allText = result.items.map(i => `${i.title} ${i.description}`).join(' ');

    // The feed has "Drøbak" which contains ø
    const hasNorwegianChars = /[æøåÆØÅ]/.test(allText);
    console.log(`Norwegian characters found: ${hasNorwegianChars}`);

    // Check for encoding issues (garbled characters)
    const hasCorruptedChars = /Ã¦|Ã¸|Ã¥/.test(allText);
    expect(hasCorruptedChars).toBe(false);

    // Specifically check for "Drøbak" being correctly preserved
    const hasDrobak = allText.includes('Drøbak');
    console.log(`"Drøbak" found correctly: ${hasDrobak}`);
    expect(hasDrobak).toBe(true);
  });

  test('should parse dates correctly', () => {
    const result = parseFeedWithRecovery(feedContent);

    let validDates = 0;
    result.items.forEach((item, i) => {
      if (item.pubDate) {
        const date = new Date(item.pubDate);
        const isValid = date.toString() !== 'Invalid Date';
        if (isValid) validDates++;
        if (i < 3) {
          console.log(`Item ${i + 1} date: "${item.pubDate}" -> ${isValid ? date.toISOString() : 'INVALID'}`);
        }
      }
    });

    expect(validDates).toBe(result.items.length);
  });

  test('should extract links correctly', () => {
    const result = parseFeedWithRecovery(feedContent);

    const itemsWithLinks = result.items.filter(item =>
      item.link && item.link.startsWith('https://sentralregisteret.no/')
    );

    console.log(`Items with valid links: ${itemsWithLinks.length}/${result.items.length}`);

    // All items should have valid links
    expect(itemsWithLinks.length).toBe(result.items.length);

    // Check first item link
    expect(result.items[0].link).toContain('sentralregisteret.no');
  });

  test('feed structure analysis', () => {
    console.log('\n=== Feed Structure Analysis ===');
    console.log(`Content length: ${feedContent.length} bytes`);
    console.log(`Contains <rss>: ${feedContent.includes('<rss')}`);
    console.log(`Contains xmlns:content: ${feedContent.includes('xmlns:content')}`);
    console.log(`Contains content:encoded: ${feedContent.includes('content:encoded')}`);
    console.log(`Contains wp-block-image: ${feedContent.includes('wp-block-image')}`);
    console.log(`Contains CDATA: ${feedContent.includes('CDATA')}`);

    // Count elements
    const itemCount = (feedContent.match(/<item>/g) || []).length;
    const contentEncodedCount = (feedContent.match(/<content:encoded>/g) || []).length;
    const figureCount = (feedContent.match(/<figure/g) || []).length;
    const cdataCount = (feedContent.match(/<!\[CDATA\[/g) || []).length;

    console.log(`\n<item> count: ${itemCount}`);
    console.log(`<content:encoded> count: ${contentEncodedCount}`);
    console.log(`<figure> count: ${figureCount}`);
    console.log(`CDATA sections: ${cdataCount}`);

    expect(itemCount).toBe(10);
    expect(contentEncodedCount).toBe(10);
  });
});
