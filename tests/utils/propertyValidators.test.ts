/**
 * Property Validators Tests
 *
 * Tests for property pane input validation.
 * @see REF-012-SECURITY-HARDENING.md ST-012-05
 */
import { PropertyValidators } from '../../src/webparts/polRssGallery/utils/propertyValidators';

describe('PropertyValidators', () => {
  describe('feedUrl()', () => {
    it('should accept valid RSS feed URLs', () => {
      expect(PropertyValidators.feedUrl('https://example.com/feed.xml')).toBeUndefined();
      expect(PropertyValidators.feedUrl('https://news.ycombinator.com/rss')).toBeUndefined();
      expect(PropertyValidators.feedUrl('http://rss.cnn.com/rss/edition.rss')).toBeUndefined();
    });

    it('should reject empty URL', () => {
      expect(PropertyValidators.feedUrl('')).toBe('Feed URL is required');
      expect(PropertyValidators.feedUrl('   ')).toBe('Feed URL is required');
    });

    it('should reject invalid URLs', () => {
      expect(PropertyValidators.feedUrl('not-a-url')).toBeDefined();
      expect(PropertyValidators.feedUrl('ftp://example.com/feed')).toBeDefined();
    });

    it('should reject internal addresses (SSRF)', () => {
      expect(PropertyValidators.feedUrl('http://localhost/feed')).toBeDefined();
      expect(PropertyValidators.feedUrl('http://127.0.0.1/feed')).toBeDefined();
      expect(PropertyValidators.feedUrl('http://192.168.1.1/feed')).toBeDefined();
    });

    it('should reject very long URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(3000);
      expect(PropertyValidators.feedUrl(longUrl)).toContain('2048 characters');
    });
  });

  describe('fallbackImageUrl()', () => {
    it('should accept valid image URLs', () => {
      expect(PropertyValidators.fallbackImageUrl('https://example.com/image.jpg')).toBeUndefined();
      expect(PropertyValidators.fallbackImageUrl('https://cdn.example.com/logo.png')).toBeUndefined();
    });

    it('should accept empty URL (optional field)', () => {
      expect(PropertyValidators.fallbackImageUrl('')).toBeUndefined();
      expect(PropertyValidators.fallbackImageUrl(undefined as unknown as string)).toBeUndefined();
    });

    it('should reject invalid URLs', () => {
      expect(PropertyValidators.fallbackImageUrl('javascript:alert(1)')).toBeDefined();
      expect(PropertyValidators.fallbackImageUrl('http://localhost/image.jpg')).toBeDefined();
    });
  });

  describe('webPartTitle()', () => {
    it('should accept valid titles', () => {
      expect(PropertyValidators.webPartTitle('My RSS Feed')).toBeUndefined();
      expect(PropertyValidators.webPartTitle('News & Updates')).toBeUndefined();
      expect(PropertyValidators.webPartTitle('Latest Articles (2024)')).toBeUndefined();
    });

    it('should accept empty title (optional field)', () => {
      expect(PropertyValidators.webPartTitle('')).toBeUndefined();
      expect(PropertyValidators.webPartTitle(undefined as unknown as string)).toBeUndefined();
    });

    it('should reject HTML tags in title', () => {
      expect(PropertyValidators.webPartTitle('<script>alert(1)</script>')).toBe('Title cannot contain HTML tags');
      expect(PropertyValidators.webPartTitle('Test <b>bold</b>')).toBe('Title cannot contain HTML tags');
    });

    it('should reject script patterns', () => {
      expect(PropertyValidators.webPartTitle('javascript:alert(1)')).toBe('Title contains invalid characters');
      expect(PropertyValidators.webPartTitle('onclick=alert(1)')).toBe('Title contains invalid characters');
    });

    it('should reject very long titles', () => {
      const longTitle = 'A'.repeat(101);
      expect(PropertyValidators.webPartTitle(longTitle)).toContain('100 characters');
    });
  });

  describe('filterKeywords()', () => {
    it('should accept valid keywords', () => {
      expect(PropertyValidators.filterKeywords('news, tech, updates')).toBeUndefined();
      expect(PropertyValidators.filterKeywords('breaking')).toBeUndefined();
    });

    it('should accept empty keywords (optional field)', () => {
      expect(PropertyValidators.filterKeywords('')).toBeUndefined();
      expect(PropertyValidators.filterKeywords(undefined as unknown as string)).toBeUndefined();
    });

    it('should reject HTML tags', () => {
      expect(PropertyValidators.filterKeywords('<script>, news')).toBe('Keywords cannot contain HTML tags');
    });

    it('should reject script patterns', () => {
      expect(PropertyValidators.filterKeywords('javascript:, news')).toBe('Keywords contain invalid characters');
    });

    it('should reject very long keywords', () => {
      const longKeywords = 'keyword,'.repeat(100);
      expect(PropertyValidators.filterKeywords(longKeywords)).toContain('500 characters');
    });
  });

  describe('itemCount()', () => {
    it('should accept valid item counts', () => {
      expect(PropertyValidators.itemCount(1)).toBeUndefined();
      expect(PropertyValidators.itemCount(10)).toBeUndefined();
      expect(PropertyValidators.itemCount(100)).toBeUndefined();
    });

    it('should reject non-numbers', () => {
      expect(PropertyValidators.itemCount('10' as unknown as number)).toBe('Must be a number');
      expect(PropertyValidators.itemCount(NaN)).toBe('Must be a number');
    });

    it('should reject non-integers', () => {
      expect(PropertyValidators.itemCount(10.5)).toBe('Must be a whole number');
    });

    it('should reject out of range values', () => {
      expect(PropertyValidators.itemCount(0)).toBe('Must be between 1 and 100');
      expect(PropertyValidators.itemCount(101)).toBe('Must be between 1 and 100');
      expect(PropertyValidators.itemCount(-1)).toBe('Must be between 1 and 100');
    });
  });

  describe('refreshInterval()', () => {
    it('should accept valid intervals', () => {
      expect(PropertyValidators.refreshInterval(1)).toBeUndefined();
      expect(PropertyValidators.refreshInterval(60)).toBeUndefined();
      expect(PropertyValidators.refreshInterval(1440)).toBeUndefined();
    });

    it('should reject non-numbers', () => {
      expect(PropertyValidators.refreshInterval('60' as unknown as number)).toBe('Must be a number');
    });

    it('should reject out of range values', () => {
      expect(PropertyValidators.refreshInterval(0)).toBe('Must be between 1 and 1440 minutes');
      expect(PropertyValidators.refreshInterval(1441)).toBe('Must be between 1 and 1440 minutes');
    });
  });

  describe('carouselInterval()', () => {
    it('should accept valid intervals', () => {
      expect(PropertyValidators.carouselInterval(1)).toBeUndefined();
      expect(PropertyValidators.carouselInterval(30)).toBeUndefined();
      expect(PropertyValidators.carouselInterval(60)).toBeUndefined();
    });

    it('should reject out of range values', () => {
      expect(PropertyValidators.carouselInterval(0)).toBe('Must be between 1 and 60 seconds');
      expect(PropertyValidators.carouselInterval(61)).toBe('Must be between 1 and 60 seconds');
    });
  });

  describe('sanitizeText()', () => {
    it('should escape HTML entities', () => {
      expect(PropertyValidators.sanitizeText('<script>')).toBe('&lt;script&gt;');
      expect(PropertyValidators.sanitizeText('"quotes"')).toBe('&quot;quotes&quot;');
      expect(PropertyValidators.sanitizeText("'apostrophe'")).toBe("&#x27;apostrophe&#x27;");
    });

    it('should handle empty values', () => {
      expect(PropertyValidators.sanitizeText('')).toBe('');
      expect(PropertyValidators.sanitizeText(null as unknown as string)).toBe('');
    });

    it('should preserve safe text', () => {
      expect(PropertyValidators.sanitizeText('Hello World')).toBe('Hello World');
      expect(PropertyValidators.sanitizeText('News & Updates')).toBe('News &amp; Updates');
    });
  });

  describe('validateAll()', () => {
    it('should validate all properties at once', () => {
      const errors = PropertyValidators.validateAll({
        feedUrl: 'https://example.com/feed.xml',
        webPartTitle: 'My Feed',
        fallbackImageUrl: '',
        maxItems: 10,
      });

      expect(errors.feedUrl).toBeUndefined();
      expect(errors.webPartTitle).toBeUndefined();
      expect(errors.fallbackImageUrl).toBeUndefined();
      expect(errors.maxItems).toBeUndefined();
    });

    it('should return all errors', () => {
      const errors = PropertyValidators.validateAll({
        feedUrl: 'invalid-url',
        webPartTitle: '<script>',
        maxItems: 0,
      });

      expect(errors.feedUrl).toBeDefined();
      expect(errors.webPartTitle).toBeDefined();
      expect(errors.maxItems).toBeDefined();
    });
  });

  describe('isAllValid()', () => {
    it('should return true for valid properties', () => {
      expect(
        PropertyValidators.isAllValid({
          feedUrl: 'https://example.com/feed.xml',
          webPartTitle: 'My Feed',
          maxItems: 10,
        })
      ).toBe(true);
    });

    it('should return false if any property is invalid', () => {
      expect(
        PropertyValidators.isAllValid({
          feedUrl: 'invalid-url',
          webPartTitle: 'My Feed',
        })
      ).toBe(false);
    });
  });
});
