/**
 * Feed Types Tests
 *
 * Tests for type guards and type utilities.
 */

import {
  hasCategories,
  hasAuthor,
  hasImage,
  hasEnclosures,
  RssFeedItem,
  FeedEnclosure,
} from '../../src/webparts/polRssGallery/services/feedTypes';

describe('Feed Type Guards', () => {
  const baseItem: RssFeedItem = {
    title: 'Test Item',
    link: 'https://example.com',
    description: 'Test description',
    pubDate: '2025-11-24T10:00:00Z',
  };

  describe('hasCategories()', () => {
    it('returns true for item with categories', () => {
      const item: RssFeedItem = {
        ...baseItem,
        categories: ['News', 'Technology'],
      };

      expect(hasCategories(item)).toBe(true);
    });

    it('returns false for item without categories', () => {
      expect(hasCategories(baseItem)).toBe(false);
    });

    it('returns false for item with empty categories array', () => {
      const item: RssFeedItem = {
        ...baseItem,
        categories: [],
      };

      expect(hasCategories(item)).toBe(false);
    });

    it('returns false for item with undefined categories', () => {
      const item: RssFeedItem = {
        ...baseItem,
        categories: undefined,
      };

      expect(hasCategories(item)).toBe(false);
    });
  });

  describe('hasAuthor()', () => {
    it('returns true for item with author', () => {
      const item: RssFeedItem = {
        ...baseItem,
        author: 'John Doe',
      };

      expect(hasAuthor(item)).toBe(true);
    });

    it('returns false for item without author', () => {
      expect(hasAuthor(baseItem)).toBe(false);
    });

    it('returns false for item with empty author string', () => {
      const item: RssFeedItem = {
        ...baseItem,
        author: '',
      };

      expect(hasAuthor(item)).toBe(false);
    });
  });

  describe('hasImage()', () => {
    it('returns true for item with image', () => {
      const item: RssFeedItem = {
        ...baseItem,
        imageUrl: 'https://example.com/image.jpg',
      };

      expect(hasImage(item)).toBe(true);
    });

    it('returns false for item without image', () => {
      expect(hasImage(baseItem)).toBe(false);
    });

    it('returns false for item with empty image URL', () => {
      const item: RssFeedItem = {
        ...baseItem,
        imageUrl: '',
      };

      expect(hasImage(item)).toBe(false);
    });
  });

  describe('hasEnclosures()', () => {
    it('returns true for item with enclosures', () => {
      const enclosure: FeedEnclosure = {
        url: 'https://example.com/audio.mp3',
        type: 'audio/mpeg',
        length: 12345678,
      };

      const item: RssFeedItem = {
        ...baseItem,
        enclosures: [enclosure],
      };

      expect(hasEnclosures(item)).toBe(true);
    });

    it('returns false for item without enclosures', () => {
      expect(hasEnclosures(baseItem)).toBe(false);
    });

    it('returns false for item with empty enclosures array', () => {
      const item: RssFeedItem = {
        ...baseItem,
        enclosures: [],
      };

      expect(hasEnclosures(item)).toBe(false);
    });
  });
});
