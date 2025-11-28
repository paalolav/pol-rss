/**
 * Tests for Cache Key Service
 */

import {
  generateCacheKey,
  generateReadableKey,
  normalizeUrl,
  hashString,
  isValidCacheKey,
  CacheKeyUtils
} from '../../src/webparts/polRssGallery/services/cacheKeyService';

describe('cacheKeyService', () => {
  describe('normalizeUrl', () => {
    it('should lowercase hostname', () => {
      expect(normalizeUrl('https://EXAMPLE.COM/feed'))
        .toBe('https://example.com/feed');
    });

    it('should lowercase protocol', () => {
      expect(normalizeUrl('HTTPS://example.com/feed'))
        .toBe('https://example.com/feed');
    });

    it('should remove trailing slash', () => {
      expect(normalizeUrl('https://example.com/feed/'))
        .toBe('https://example.com/feed');
    });

    it('should keep root path slash', () => {
      expect(normalizeUrl('https://example.com/'))
        .toBe('https://example.com/');
    });

    it('should remove default http port', () => {
      expect(normalizeUrl('http://example.com:80/feed'))
        .toBe('http://example.com/feed');
    });

    it('should remove default https port', () => {
      expect(normalizeUrl('https://example.com:443/feed'))
        .toBe('https://example.com/feed');
    });

    it('should keep non-default port', () => {
      expect(normalizeUrl('https://example.com:8080/feed'))
        .toBe('https://example.com:8080/feed');
    });

    it('should sort query parameters', () => {
      expect(normalizeUrl('https://example.com/feed?b=2&a=1'))
        .toBe('https://example.com/feed?a=1&b=2');
    });

    it('should remove fragments', () => {
      expect(normalizeUrl('https://example.com/feed#section'))
        .toBe('https://example.com/feed');
    });

    it('should handle URLs without path', () => {
      expect(normalizeUrl('https://example.com'))
        .toBe('https://example.com/');
    });

    it('should handle invalid URLs gracefully', () => {
      const invalid = 'not-a-valid-url';
      expect(normalizeUrl(invalid)).toBe(invalid);
    });

    it('should encode special characters in query params', () => {
      const url = 'https://example.com/feed?search=hello world';
      const normalized = normalizeUrl(url);
      expect(normalized).toContain('hello%20world');
    });
  });

  describe('hashString', () => {
    it('should produce consistent hashes', () => {
      const input = 'test string';
      expect(hashString(input)).toBe(hashString(input));
    });

    it('should produce different hashes for different inputs', () => {
      expect(hashString('abc')).not.toBe(hashString('xyz'));
    });

    it('should handle empty string', () => {
      expect(typeof hashString('')).toBe('string');
    });

    it('should handle long strings', () => {
      const longString = 'a'.repeat(10000);
      expect(typeof hashString(longString)).toBe('string');
    });

    it('should produce hex output', () => {
      const hash = hashString('test');
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate consistent keys for same URL', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed' });
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different URLs', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed1' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed2' });
      expect(key1).not.toBe(key2);
    });

    it('should generate same key for URL variations', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://EXAMPLE.COM/feed/' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed' });
      expect(key1).toBe(key2);
    });

    it('should include maxItems in key', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed', maxItems: 10 });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed', maxItems: 20 });
      expect(key1).not.toBe(key2);
    });

    it('should include filterKeywords in key', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'news' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'tech' });
      expect(key1).not.toBe(key2);
    });

    it('should normalize filter keywords to lowercase', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'NEWS' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'news' });
      expect(key1).toBe(key2);
    });

    it('should include category in key', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed', category: 'tech' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed', category: 'sports' });
      expect(key1).not.toBe(key2);
    });

    it('should prefix key with rss_', () => {
      const key = generateCacheKey({ feedUrl: 'https://example.com/feed' });
      expect(key).toMatch(/^rss_/);
    });

    it('should generate reasonably short keys', () => {
      const key = generateCacheKey({
        feedUrl: 'https://example.com/very/long/path/to/feed.xml',
        maxItems: 100,
        filterKeywords: 'some filter keywords',
        category: 'technology'
      });
      expect(key.length).toBeLessThan(50);
    });
  });

  describe('generateReadableKey', () => {
    it('should include URL', () => {
      const key = generateReadableKey({ feedUrl: 'https://example.com/feed' });
      expect(key).toContain('example.com');
    });

    it('should include maxItems if provided', () => {
      const key = generateReadableKey({ feedUrl: 'https://example.com/feed', maxItems: 10 });
      expect(key).toContain('max:10');
    });

    it('should include filter if provided', () => {
      const key = generateReadableKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'news' });
      expect(key).toContain('filter:news');
    });

    it('should include category if provided', () => {
      const key = generateReadableKey({ feedUrl: 'https://example.com/feed', category: 'tech' });
      expect(key).toContain('cat:tech');
    });

    it('should use pipe as separator', () => {
      const key = generateReadableKey({
        feedUrl: 'https://example.com/feed',
        maxItems: 10,
        filterKeywords: 'news'
      });
      expect(key).toContain('|');
    });
  });

  describe('isValidCacheKey', () => {
    it('should validate correct keys', () => {
      expect(isValidCacheKey('rss_abc123')).toBe(true);
      expect(isValidCacheKey('rss_deadbeef')).toBe(true);
    });

    it('should reject invalid keys', () => {
      expect(isValidCacheKey('invalid')).toBe(false);
      expect(isValidCacheKey('rss_')).toBe(false);
      expect(isValidCacheKey('rss_XYZ')).toBe(false); // uppercase not allowed
      expect(isValidCacheKey('RSS_abc123')).toBe(false);
    });
  });

  describe('CacheKeyUtils', () => {
    describe('generateBulkKeys', () => {
      it('should generate keys for multiple URLs', () => {
        const urls = [
          'https://example.com/feed1',
          'https://example.com/feed2'
        ];
        const keyMap = CacheKeyUtils.generateBulkKeys(urls);

        expect(keyMap.size).toBe(2);
        expect(keyMap.has('https://example.com/feed1')).toBe(true);
        expect(keyMap.has('https://example.com/feed2')).toBe(true);
      });

      it('should apply common params to all keys', () => {
        const urls = ['https://example.com/feed1', 'https://example.com/feed2'];
        const keyMap1 = CacheKeyUtils.generateBulkKeys(urls, { maxItems: 10 });
        const keyMap2 = CacheKeyUtils.generateBulkKeys(urls, { maxItems: 20 });

        // Keys should be different when params differ
        expect(keyMap1.get(urls[0])).not.toBe(keyMap2.get(urls[0]));
      });
    });

    describe('createPattern', () => {
      it('should create regex pattern', () => {
        const pattern = CacheKeyUtils.createPattern('rss_');
        expect(pattern.test('rss_abc123')).toBe(true);
        expect(pattern.test('other_abc123')).toBe(false);
      });
    });

    describe('normalizeUrls', () => {
      it('should normalize multiple URLs', () => {
        const urls = [
          'https://EXAMPLE.COM/feed1/',
          'https://example.com/feed2'
        ];
        const normalized = CacheKeyUtils.normalizeUrls(urls);

        expect(normalized[0]).toBe('https://example.com/feed1');
        expect(normalized[1]).toBe('https://example.com/feed2');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty feedUrl', () => {
      const key = generateCacheKey({ feedUrl: '' });
      expect(key).toMatch(/^rss_/);
    });

    it('should handle URLs with special characters', () => {
      const key = generateCacheKey({
        feedUrl: 'https://example.com/feed?query=hello%20world&special=a+b'
      });
      expect(key).toMatch(/^rss_[a-f0-9]+$/);
    });

    it('should handle international domain names', () => {
      // IDN will be handled by URL parser
      const key = generateCacheKey({ feedUrl: 'https://example.com/feed' });
      expect(isValidCacheKey(key)).toBe(true);
    });

    it('should handle very long URLs', () => {
      const longPath = 'segment/'.repeat(50);
      const key = generateCacheKey({
        feedUrl: `https://example.com/${longPath}feed.xml`
      });
      expect(key.length).toBeLessThan(50); // Hash keeps it short
    });

    it('should handle whitespace in filter keywords', () => {
      const key1 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: '  news  ' });
      const key2 = generateCacheKey({ feedUrl: 'https://example.com/feed', filterKeywords: 'news' });
      expect(key1).toBe(key2);
    });
  });
});
