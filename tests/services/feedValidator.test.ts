/**
 * Feed Validator Service Tests
 *
 * Tests for feed format detection and validation.
 */

import { validateFeed, detectFeedFormat, FeedFormat } from '../../src/webparts/polRssGallery/services/feedValidator';
import {
  rss2StandardXml,
  rss2MinimalXml,
  rss2EmptyXml,
  rss1RdfXml,
  atom1StandardXml,
  jsonFeedV11,
  jsonFeedV10,
  jsonFeedMinimal,
  malformedXml,
} from '../utils/feedTestData';

describe('FeedValidator', () => {
  // ==========================================================================
  // Format Detection Tests
  // ==========================================================================
  describe('detectFeedFormat()', () => {
    it('detects RSS 2.0 format', () => {
      expect(detectFeedFormat(rss2StandardXml)).toBe('rss2');
    });

    it('detects RSS 1.0 (RDF) format', () => {
      expect(detectFeedFormat(rss1RdfXml)).toBe('rss1');
    });

    it('detects Atom format', () => {
      expect(detectFeedFormat(atom1StandardXml)).toBe('atom');
    });

    it('detects JSON Feed format', () => {
      expect(detectFeedFormat(jsonFeedV11)).toBe('json');
    });

    it('returns unknown for empty content', () => {
      expect(detectFeedFormat('')).toBe('unknown');
    });

    it('returns unknown for invalid content', () => {
      expect(detectFeedFormat('not a feed')).toBe('unknown');
    });

    it('returns unknown for regular JSON (not JSON Feed)', () => {
      expect(detectFeedFormat('{"name": "test"}')).toBe('unknown');
    });
  });

  // ==========================================================================
  // RSS 2.0 Validation Tests
  // ==========================================================================
  describe('validateFeed() - RSS 2.0', () => {
    it('validates valid RSS 2.0 feed', () => {
      const result = validateFeed(rss2StandardXml);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('rss2');
      expect(result.errors).toHaveLength(0);
      expect(result.metadata?.title).toBe('Test RSS Feed');
      expect(result.metadata?.itemCount).toBe(3);
    });

    it('validates minimal RSS 2.0 feed', () => {
      const result = validateFeed(rss2MinimalXml);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('rss2');
      expect(result.metadata?.itemCount).toBe(1);
    });

    it('validates empty RSS 2.0 feed (no items)', () => {
      const result = validateFeed(rss2EmptyXml);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('rss2');
      expect(result.metadata?.itemCount).toBe(0);
    });

    it('reports warnings for missing channel elements', () => {
      const feedWithoutTitle = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <link>https://example.com</link>
            <description>Test</description>
            <item><title>Item</title></item>
          </channel>
        </rss>`;

      const result = validateFeed(feedWithoutTitle);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.code === 'MISSING_TITLE')).toBe(true);
    });
  });

  // ==========================================================================
  // RSS 1.0 (RDF) Validation Tests
  // ==========================================================================
  describe('validateFeed() - RSS 1.0', () => {
    it('validates valid RSS 1.0 (RDF) feed', () => {
      const result = validateFeed(rss1RdfXml);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('rss1');
      expect(result.formatVersion).toBe('1.0');
      expect(result.metadata?.title).toBe('Test RDF Feed');
    });
  });

  // ==========================================================================
  // Atom Validation Tests
  // ==========================================================================
  describe('validateFeed() - Atom', () => {
    it('validates valid Atom feed', () => {
      const result = validateFeed(atom1StandardXml);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('atom');
      expect(result.formatVersion).toBe('1.0');
      expect(result.metadata?.title).toBe('Test Atom Feed');
      expect(result.metadata?.itemCount).toBe(2);
    });

    it('reports warnings for missing required Atom elements', () => {
      const atomWithoutId = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test Feed</title>
          <updated>2025-11-24T12:00:00Z</updated>
          <entry>
            <title>Entry</title>
            <updated>2025-11-24T12:00:00Z</updated>
          </entry>
        </feed>`;

      const result = validateFeed(atomWithoutId);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.code === 'MISSING_ID')).toBe(true);
    });
  });

  // ==========================================================================
  // JSON Feed Validation Tests
  // ==========================================================================
  describe('validateFeed() - JSON Feed', () => {
    it('validates valid JSON Feed v1.1', () => {
      const result = validateFeed(jsonFeedV11);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('json');
      expect(result.formatVersion).toBe('1.1');
      expect(result.metadata?.title).toBe('My JSON Feed');
      expect(result.metadata?.itemCount).toBe(2);
    });

    it('validates valid JSON Feed v1.0', () => {
      const result = validateFeed(jsonFeedV10);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('json');
      expect(result.formatVersion).toBe('1.0');
    });

    it('validates minimal JSON Feed', () => {
      const result = validateFeed(jsonFeedMinimal);

      expect(result.isValid).toBe(true);
      expect(result.format).toBe('json');
      expect(result.metadata?.itemCount).toBe(1);
    });

    it('reports error for invalid JSON', () => {
      const result = validateFeed('{ invalid json }');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_JSON')).toBe(true);
    });

    it('reports error for JSON without version', () => {
      const result = validateFeed('{"title": "Test", "items": []}');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_VERSION')).toBe(true);
    });

    it('reports error for non-JSON Feed version', () => {
      const result = validateFeed('{"version": "1.0", "items": []}');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_VERSION')).toBe(true);
    });

    it('reports error for JSON Feed without items', () => {
      const result = validateFeed('{"version": "https://jsonfeed.org/version/1.1", "title": "Test"}');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_ITEMS')).toBe(true);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('validateFeed() - Error Handling', () => {
    it('handles empty content', () => {
      const result = validateFeed('');

      expect(result.isValid).toBe(false);
      expect(result.format).toBe('unknown');
      expect(result.errors.some(e => e.code === 'EMPTY_CONTENT')).toBe(true);
    });

    it('handles null content', () => {
      const result = validateFeed(null as unknown as string);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'EMPTY_CONTENT')).toBe(true);
    });

    it('handles whitespace-only content', () => {
      const result = validateFeed('   \n\t  ');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'EMPTY_CONTENT')).toBe(true);
    });

    it('handles malformed XML with partial recovery', () => {
      const result = validateFeed(malformedXml);

      // May have warnings about parse errors but could still detect format
      expect(result.format === 'rss2' || result.format === 'unknown').toBe(true);
    });

    it('handles completely invalid content', () => {
      const result = validateFeed('This is not a feed at all');

      expect(result.isValid).toBe(false);
      expect(result.format).toBe('unknown');
    });
  });

  // ==========================================================================
  // Metadata Extraction Tests
  // ==========================================================================
  describe('validateFeed() - Metadata', () => {
    it('extracts RSS 2.0 metadata correctly', () => {
      const result = validateFeed(rss2StandardXml);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.title).toBe('Test RSS Feed');
      expect(result.metadata?.description).toBe('A test RSS feed for unit testing');
      expect(result.metadata?.link).toBe('https://example.com');
      expect(result.metadata?.itemCount).toBe(3);
    });

    it('extracts Atom metadata correctly', () => {
      const result = validateFeed(atom1StandardXml);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.title).toBe('Test Atom Feed');
      expect(result.metadata?.itemCount).toBe(2);
    });

    it('extracts JSON Feed metadata correctly', () => {
      const result = validateFeed(jsonFeedV11);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.title).toBe('My JSON Feed');
      expect(result.metadata?.description).toBe('A sample JSON Feed');
      expect(result.metadata?.link).toBe('https://example.org/');
      expect(result.metadata?.itemCount).toBe(2);
    });
  });
});
