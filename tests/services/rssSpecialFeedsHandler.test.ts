/**
 * Tests for RssSpecialFeedsHandler
 *
 * Tests intelligent detection of API feeds and authenticated feeds
 * without hardcoded domain names.
 */
import { RssSpecialFeedsHandler } from '../../src/webparts/polRssGallery/services/rssSpecialFeedsHandler';

describe('RssSpecialFeedsHandler', () => {
  describe('isAuthenticatedFeed', () => {
    describe('detects feeds with API key parameters', () => {
      it('should detect apiKey parameter', () => {
        const url = 'https://example.com/feed?apiKey=abc123';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect api_key parameter (underscore variant)', () => {
        const url = 'https://example.com/feed?api_key=abc123';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect apikey parameter (lowercase)', () => {
        const url = 'https://example.com/feed?apikey=abc123';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });
    });

    describe('detects feeds with token parameters', () => {
      it('should detect token parameter', () => {
        const url = 'https://example.com/feed?token=xyz789';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect access_token parameter', () => {
        const url = 'https://example.com/feed?access_token=xyz789';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect auth_token parameter', () => {
        const url = 'https://example.com/feed?auth_token=xyz789';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });
    });

    describe('detects feeds with pattern-matched auth parameters', () => {
      it('should detect parameters containing "key"', () => {
        const url = 'https://example.com/feed?subscriptionKey=abc';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect parameters containing "auth"', () => {
        const url = 'https://example.com/feed?authCode=abc';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });

      it('should detect parameters containing "secret"', () => {
        const url = 'https://example.com/feed?clientSecret=abc';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(true);
      });
    });

    describe('does NOT detect standard RSS feeds', () => {
      it('should return false for simple RSS feed URL', () => {
        const url = 'https://www.nrk.no/toppsaker.rss';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(false);
      });

      it('should return false for feed with non-auth parameters', () => {
        const url = 'https://example.com/feed?format=rss&category=news';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(false);
      });

      it('should return false for Atom feed', () => {
        const url = 'https://example.com/atom.xml';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(false);
      });
    });

    describe('handles edge cases', () => {
      it('should return false for invalid URL', () => {
        const url = 'not-a-valid-url';
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed(url)).toBe(false);
      });

      it('should return false for empty string', () => {
        expect(RssSpecialFeedsHandler.isAuthenticatedFeed('')).toBe(false);
      });
    });
  });

  describe('isApiFeed', () => {
    describe('detects API-style URL paths', () => {
      it('should detect /api/ in path', () => {
        const url = 'https://example.com/api/v1/feed';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });

      it('should detect /v1/ in path', () => {
        const url = 'https://example.com/v1/rss';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });

      it('should detect /v2/ in path', () => {
        const url = 'https://example.com/v2/feed';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });

      it('should detect /newsletters/ in path', () => {
        const url = 'https://example.com/newsletters/12345/rss';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });
    });

    describe('detects API feeds via auth parameters', () => {
      it('should detect feed with apiKey as API feed', () => {
        const url = 'https://example.com/feed?apiKey=abc123';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });

      it('should detect feed with token as API feed', () => {
        const url = 'https://example.com/feed?token=xyz789';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });
    });

    describe('does NOT detect standard RSS feeds', () => {
      it('should return false for simple RSS feed', () => {
        const url = 'https://www.example.com/rss/feed';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(false);
      });

      it('should return false for .rss extension', () => {
        const url = 'https://www.example.com/toppsaker.rss';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(false);
      });

      it('should return false for /feed path without auth', () => {
        const url = 'https://www.example.com/feed';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(false);
      });

      it('should return false for atom.xml', () => {
        const url = 'https://www.example.com/atom.xml';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(false);
      });
    });

    describe('handles edge cases', () => {
      it('should return false for invalid URL', () => {
        expect(RssSpecialFeedsHandler.isApiFeed('not-valid')).toBe(false);
      });

      it('should be case-insensitive for path detection', () => {
        const url = 'https://example.com/API/feed';
        expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
      });
    });
  });

  describe('isMeltwaterFeed (deprecated)', () => {
    it('should delegate to isApiFeed', () => {
      // API-style URL should return true
      const apiUrl = 'https://example.com/api/newsletters/123?apiKey=abc';
      expect(RssSpecialFeedsHandler.isMeltwaterFeed(apiUrl)).toBe(true);
      expect(RssSpecialFeedsHandler.isMeltwaterFeed(apiUrl))
        .toBe(RssSpecialFeedsHandler.isApiFeed(apiUrl));

      // Standard RSS URL should return false
      const rssUrl = 'https://www.example.com/feed.rss';
      expect(RssSpecialFeedsHandler.isMeltwaterFeed(rssUrl)).toBe(false);
      expect(RssSpecialFeedsHandler.isMeltwaterFeed(rssUrl))
        .toBe(RssSpecialFeedsHandler.isApiFeed(rssUrl));
    });
  });

  describe('getPreProcessingHints', () => {
    it('should return all fixes enabled for any URL', () => {
      const hints = RssSpecialFeedsHandler.getPreProcessingHints('https://any-site.com/feed');

      expect(hints).toEqual({
        addMissingNamespaces: true,
        fixUnclosedTags: true,
        addMissingXmlDeclaration: true,
        fixCdataSequences: true
      });
    });

    it('should return same hints for all URLs (universal application)', () => {
      const urls = [
        'https://www.nrk.no/feed',
        'https://api.example.com/v1/rss?apiKey=abc',
        'https://random-site.org/atom.xml',
        'https://another-site.com/newsletters/123'
      ];

      const firstHints = RssSpecialFeedsHandler.getPreProcessingHints(urls[0]);

      urls.forEach(url => {
        expect(RssSpecialFeedsHandler.getPreProcessingHints(url)).toEqual(firstHints);
      });
    });
  });

  describe('hasKnownFormatIssues', () => {
    it('should always return true (universal handling)', () => {
      expect(RssSpecialFeedsHandler.hasKnownFormatIssues('https://any-url.com')).toBe(true);
      expect(RssSpecialFeedsHandler.hasKnownFormatIssues('https://another-url.org/feed')).toBe(true);
    });
  });

  describe('real-world URL patterns', () => {
    describe('should detect API-style feeds correctly', () => {
      const apiFeedUrls = [
        'https://api.example.com/public/newsletters/12345/newsletter/view?apiKey=abc&newsletterId=xyz',
        'https://feeds.example.com/v1/rss?token=secret123',
        'https://app.example.com/api/feeds/user/123?access_token=bearer_token',
      ];

      apiFeedUrls.forEach(url => {
        it(`should detect ${new URL(url).pathname} as API feed`, () => {
          expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(true);
        });
      });
    });

    describe('should NOT detect standard RSS feeds as API feeds', () => {
      const standardFeedUrls = [
        'https://www.nrk.no/toppsaker.rss',
        'https://www.vg.no/rss/feed/?format=rss',
        'https://e24.no/rss2',
        'https://www.tv2.no/rss/nyheter',
        'https://feeds.feedburner.com/example',
        'https://blog.example.com/feed/',
        'https://wordpress-site.com/feed/atom/',
      ];

      standardFeedUrls.forEach(url => {
        it(`should NOT detect ${url} as API feed`, () => {
          expect(RssSpecialFeedsHandler.isApiFeed(url)).toBe(false);
        });
      });
    });
  });
});
