/**
 * Performance Tests for ImprovedFeedParser (ST-003-08)
 *
 * Tests parser performance with various feed sizes to ensure
 * it meets the performance targets:
 * - 10 items: < 10ms
 * - 50 items: < 50ms
 * - 100 items: < 100ms
 * - 500 items: < 300ms
 */

import { ImprovedFeedParser } from '../../src/webparts/polRssGallery/services/improvedFeedParser';
import { createLargeFeed } from '../utils/feedTestData';

const DEFAULT_OPTIONS = {
  fallbackImageUrl: 'https://example.com/fallback.jpg',
  enableRecovery: true,
};

/**
 * Measure parse time in milliseconds
 */
function measureParseTime(xmlString: string, options = DEFAULT_OPTIONS): { time: number; itemCount: number } {
  const start = performance.now();
  const result = ImprovedFeedParser.parse(xmlString, options);
  const end = performance.now();
  return {
    time: end - start,
    itemCount: result.length,
  };
}

/**
 * Run multiple iterations and return average time
 */
function benchmarkParse(
  xmlString: string,
  iterations: number = 5,
  options = DEFAULT_OPTIONS
): { avg: number; min: number; max: number; itemCount: number } {
  const times: number[] = [];
  let itemCount = 0;

  // Warm-up run (not counted)
  ImprovedFeedParser.parse(xmlString, options);

  for (let i = 0; i < iterations; i++) {
    const result = measureParseTime(xmlString, options);
    times.push(result.time);
    itemCount = result.itemCount;
  }

  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    itemCount,
  };
}

describe('ImprovedFeedParser Performance (ST-003-08)', () => {
  describe('Performance Targets', () => {
    it('should parse 10 items in < 10ms', () => {
      const feed = createLargeFeed(10);
      const result = benchmarkParse(feed);

      console.log(`10 items: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);

      expect(result.itemCount).toBe(10);
      expect(result.avg).toBeLessThan(10);
    });

    it('should parse 50 items in < 50ms', () => {
      const feed = createLargeFeed(50);
      const result = benchmarkParse(feed);

      console.log(`50 items: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);

      expect(result.itemCount).toBe(50);
      expect(result.avg).toBeLessThan(50);
    });

    it('should parse 100 items in < 100ms', () => {
      const feed = createLargeFeed(100);
      const result = benchmarkParse(feed);

      console.log(`100 items: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);

      expect(result.itemCount).toBe(100);
      expect(result.avg).toBeLessThan(100);
    });

    it('should parse 500 items in < 300ms', () => {
      const feed = createLargeFeed(500);
      const result = benchmarkParse(feed);

      console.log(`500 items: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);

      expect(result.itemCount).toBe(500);
      expect(result.avg).toBeLessThan(300);
    });
  });

  describe('Early Termination with maxItems', () => {
    it('should stop early when maxItems is set', () => {
      const feed = createLargeFeed(500);

      // Parse full feed
      const fullResult = benchmarkParse(feed, 3);

      // Parse with maxItems limit
      const limitedResult = benchmarkParse(feed, 3, {
        ...DEFAULT_OPTIONS,
        maxItems: 10,
      });

      console.log(`Full 500 items: avg=${fullResult.avg.toFixed(2)}ms`);
      console.log(`Limited to 10: avg=${limitedResult.avg.toFixed(2)}ms`);

      expect(limitedResult.itemCount).toBe(10);
      // Limited parsing should be faster than full parsing
      expect(limitedResult.avg).toBeLessThan(fullResult.avg);
    });

    it('should be faster with maxItems=50 than parsing all 500', () => {
      const feed = createLargeFeed(500);

      const fullResult = benchmarkParse(feed, 3);
      const limitedResult = benchmarkParse(feed, 3, {
        ...DEFAULT_OPTIONS,
        maxItems: 50,
      });

      console.log(`Full 500 items: avg=${fullResult.avg.toFixed(2)}ms`);
      console.log(`Limited to 50: avg=${limitedResult.avg.toFixed(2)}ms`);

      expect(limitedResult.itemCount).toBe(50);
      // Should be noticeably faster
      expect(limitedResult.avg).toBeLessThan(fullResult.avg * 0.8);
    });
  });

  describe('Memory Stability', () => {
    it('should handle repeated parsing without memory issues', () => {
      const feed = createLargeFeed(100);

      // Parse many times to check for memory leaks
      const iterations = 50;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const result = measureParseTime(feed);
        times.push(result.time);
      }

      const firstHalf = times.slice(0, iterations / 2);
      const secondHalf = times.slice(iterations / 2);

      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      console.log(`First 25 iterations avg: ${avgFirst.toFixed(2)}ms`);
      console.log(`Last 25 iterations avg: ${avgSecond.toFixed(2)}ms`);

      // Second half should not be significantly slower (would indicate memory issues)
      expect(avgSecond).toBeLessThan(avgFirst * 1.5);
    });
  });

  describe('Large Content Handling', () => {
    it('should handle items with very long descriptions efficiently', () => {
      // Create feed with long descriptions (10KB each)
      const longDescription = 'Lorem ipsum dolor sit amet. '.repeat(400);
      const items = Array.from({ length: 50 }, (_, i) => `
        <item>
          <title>Item ${i + 1}</title>
          <link>https://example.com/item-${i + 1}</link>
          <description><![CDATA[${longDescription}]]></description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>`).join('');

      const feed = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Long Content Feed</title>
            <link>https://example.com</link>
            ${items}
          </channel>
        </rss>`;

      const result = benchmarkParse(feed, 3);

      console.log(`50 items with 10KB descriptions each: avg=${result.avg.toFixed(2)}ms`);

      expect(result.itemCount).toBe(50);
      // Should still be reasonably fast despite large content
      expect(result.avg).toBeLessThan(200);
    });
  });

  describe('Recovery Mode Performance', () => {
    it('should not add significant overhead when recovery is not needed', () => {
      const feed = createLargeFeed(100);

      const withRecovery = benchmarkParse(feed, 5, {
        ...DEFAULT_OPTIONS,
        enableRecovery: true,
      });

      const withoutRecovery = benchmarkParse(feed, 5, {
        ...DEFAULT_OPTIONS,
        enableRecovery: false,
      });

      console.log(`With recovery: avg=${withRecovery.avg.toFixed(2)}ms`);
      console.log(`Without recovery: avg=${withoutRecovery.avg.toFixed(2)}ms`);

      // Recovery mode should add less than 20% overhead for clean feeds
      expect(withRecovery.avg).toBeLessThan(withoutRecovery.avg * 1.2);
    });
  });

  describe('Feed Format Performance Comparison', () => {
    it('should parse RSS and Atom at similar speeds', () => {
      // Create equivalent RSS feed
      const rssItems = Array.from({ length: 100 }, (_, i) => `
        <item>
          <title>Item ${i + 1}</title>
          <link>https://example.com/item-${i + 1}</link>
          <description>Description for item ${i + 1}</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>`).join('');

      const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>RSS Feed</title>
            <link>https://example.com</link>
            ${rssItems}
          </channel>
        </rss>`;

      // Create equivalent Atom feed
      const atomEntries = Array.from({ length: 100 }, (_, i) => `
        <entry>
          <title>Item ${i + 1}</title>
          <link href="https://example.com/item-${i + 1}" />
          <id>urn:uuid:item-${i + 1}</id>
          <updated>${new Date().toISOString()}</updated>
          <summary>Description for item ${i + 1}</summary>
        </entry>`).join('');

      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Atom Feed</title>
          <link href="https://example.com" />
          <id>urn:uuid:feed</id>
          <updated>${new Date().toISOString()}</updated>
          ${atomEntries}
        </feed>`;

      const rssResult = benchmarkParse(rssFeed, 5);
      const atomResult = benchmarkParse(atomFeed, 5);

      console.log(`RSS 100 items: avg=${rssResult.avg.toFixed(2)}ms`);
      console.log(`Atom 100 items: avg=${atomResult.avg.toFixed(2)}ms`);

      expect(rssResult.itemCount).toBe(100);
      expect(atomResult.itemCount).toBe(100);
      // Both should be within 50% of each other
      expect(Math.abs(rssResult.avg - atomResult.avg) / Math.max(rssResult.avg, atomResult.avg)).toBeLessThan(0.5);
    });
  });
});
