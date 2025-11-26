/**
 * URL Validator Tests
 *
 * Tests for SSRF prevention and URL validation.
 * @see REF-012-SECURITY-HARDENING.md ST-012-03
 */
import { UrlValidator, urlValidator } from '../../src/webparts/polRssGallery/services/urlValidator';

// SSRF attack vectors
const ssrfVectors = [
  // Localhost variants
  'http://localhost/admin',
  'http://localhost:8080/internal',
  'http://127.0.0.1/etc/passwd',
  'http://127.0.0.1:22/ssh',
  'http://127.1/admin',
  'http://127.0.0.1:3000',

  // Private IP ranges (Class A)
  'http://10.0.0.1/internal',
  'http://10.255.255.255/private',

  // Private IP ranges (Class B)
  'http://172.16.0.1/private',
  'http://172.31.255.255/private',

  // Private IP ranges (Class C)
  'http://192.168.1.1/router',
  'http://192.168.0.1/admin',

  // Link-local
  'http://169.254.169.254/latest/meta-data/', // AWS metadata
  'http://169.254.1.1/internal',

  // Cloud metadata endpoints
  'http://metadata.google.internal/', // GCP
  'http://metadata/', // GCP shorthand

  // IPv6 localhost
  'http://[::1]/admin',
  'http://[0:0:0:0:0:0:0:1]/admin',

  // IPv6 private (ULA)
  'http://[fc00::1]/private',
  'http://[fd00::1]/private',

  // Null address
  'http://0.0.0.0/',
  'http://0.0.0.1/',
];

// Valid external URLs
const validUrls = [
  'https://example.com/feed.xml',
  'https://news.ycombinator.com/rss',
  'https://feeds.bbci.co.uk/news/rss.xml',
  'http://rss.cnn.com/rss/edition.rss',
  'https://www.reddit.com/r/programming/.rss',
  'https://medium.com/feed/@user',
  'https://8.8.8.8/dns', // Google DNS (public IP)
  'https://1.1.1.1/dns', // Cloudflare DNS (public IP)
];

describe('UrlValidator', () => {
  describe('validate()', () => {
    describe('SSRF Prevention', () => {
      ssrfVectors.forEach((url) => {
        it(`should block SSRF vector: ${url}`, () => {
          const result = urlValidator.validate(url);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        });
      });
    });

    describe('Valid URLs', () => {
      validUrls.forEach((url) => {
        it(`should allow valid URL: ${url}`, () => {
          const result = urlValidator.validate(url);
          expect(result.isValid).toBe(true);
          expect(result.sanitizedUrl).toBeDefined();
        });
      });
    });

    describe('Protocol Validation', () => {
      it('should allow HTTPS URLs', () => {
        const result = urlValidator.validate('https://example.com');
        expect(result.isValid).toBe(true);
      });

      it('should allow HTTP URLs with warning', () => {
        const result = urlValidator.validate('http://example.com');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('HTTP URLs are less secure than HTTPS');
      });

      it('should block file:// URLs', () => {
        const result = urlValidator.validate('file:///etc/passwd');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Only HTTP(S) URLs allowed');
      });

      it('should block javascript: URLs', () => {
        const result = urlValidator.validate('javascript:alert(1)');
        expect(result.isValid).toBe(false);
      });

      it('should block ftp:// URLs', () => {
        const result = urlValidator.validate('ftp://example.com/file');
        expect(result.isValid).toBe(false);
      });

      it('should block data: URLs', () => {
        const result = urlValidator.validate('data:text/html,<script>alert(1)</script>');
        expect(result.isValid).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string', () => {
        const result = urlValidator.validate('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should handle null/undefined', () => {
        expect(urlValidator.validate(null as unknown as string).isValid).toBe(false);
        expect(urlValidator.validate(undefined as unknown as string).isValid).toBe(false);
      });

      it('should handle whitespace-only string', () => {
        const result = urlValidator.validate('   ');
        expect(result.isValid).toBe(false);
      });

      it('should handle invalid URL format', () => {
        const result = urlValidator.validate('not-a-valid-url');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid URL format');
      });

      it('should handle URL with port numbers', () => {
        const result = urlValidator.validate('https://example.com:8443/feed');
        expect(result.isValid).toBe(true);
      });

      it('should handle URL with query parameters', () => {
        const result = urlValidator.validate('https://example.com/feed?format=rss&limit=10');
        expect(result.isValid).toBe(true);
      });

      it('should handle URL with fragment', () => {
        const result = urlValidator.validate('https://example.com/feed#section');
        expect(result.isValid).toBe(true);
      });

      it('should handle URL with authentication (warn)', () => {
        const result = urlValidator.validate('https://user:pass@example.com/feed');
        expect(result.isValid).toBe(true);
        // URL with credentials should still work but may have warnings
      });

      it('should handle URL with encoded characters', () => {
        const result = urlValidator.validate('https://example.com/feed%20path');
        expect(result.isValid).toBe(true);
      });

      it('should warn about suspicious encoded characters', () => {
        const result = urlValidator.validate('https://example.com/path%00null');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('URL contains suspicious encoded characters');
      });

      it('should warn about very long URLs', () => {
        const longUrl = 'https://example.com/' + 'a'.repeat(3000);
        const result = urlValidator.validate(longUrl);
        expect(result.warnings).toContain('URL is unusually long');
      });
    });

    describe('Sanitization', () => {
      it('should trim whitespace from URL', () => {
        const result = urlValidator.validate('  https://example.com/feed  ');
        expect(result.isValid).toBe(true);
        expect(result.sanitizedUrl).toBe('https://example.com/feed');
      });

      it('should normalize URL path', () => {
        const result = urlValidator.validate('https://example.com/path/../feed');
        expect(result.isValid).toBe(true);
        expect(result.sanitizedUrl).toBe('https://example.com/feed');
      });
    });
  });

  describe('validateFeedUrl()', () => {
    it('should accept standard feed URLs', () => {
      const feedUrls = [
        'https://example.com/feed.xml',
        'https://example.com/rss',
        'https://example.com/atom.xml',
        'https://example.com/feed/rss',
      ];

      feedUrls.forEach((url) => {
        const result = urlValidator.validateFeedUrl(url);
        expect(result.isValid).toBe(true);
      });
    });

    it('should warn about non-standard feed paths', () => {
      const result = urlValidator.validateFeedUrl('https://example.com/random-path');
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('URL does not appear to be a standard feed path');
    });

    it('should still block SSRF vectors', () => {
      const result = urlValidator.validateFeedUrl('http://localhost/feed.xml');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Allowed Domains', () => {
    it('should allow only specified domains', () => {
      const validator = new UrlValidator(['example.com', 'trusted.org']);

      expect(validator.validate('https://example.com/feed').isValid).toBe(true);
      expect(validator.validate('https://trusted.org/feed').isValid).toBe(true);
      expect(validator.validate('https://untrusted.com/feed').isValid).toBe(false);
    });

    it('should support wildcard domains', () => {
      const validator = new UrlValidator(['*.example.com']);

      expect(validator.validate('https://feeds.example.com/rss').isValid).toBe(true);
      expect(validator.validate('https://news.example.com/feed').isValid).toBe(true);
      expect(validator.validate('https://example.com/feed').isValid).toBe(true); // Base domain
      expect(validator.validate('https://other.com/feed').isValid).toBe(false);
    });

    it('should allow subdomains of allowed domains', () => {
      const validator = new UrlValidator(['example.com']);

      expect(validator.validate('https://subdomain.example.com/feed').isValid).toBe(true);
      expect(validator.validate('https://deep.sub.example.com/feed').isValid).toBe(true);
    });
  });

  describe('Static Methods', () => {
    it('isValidUrl should return boolean', () => {
      expect(UrlValidator.isValidUrl('https://example.com')).toBe(true);
      expect(UrlValidator.isValidUrl('http://localhost')).toBe(false);
    });

    it('isValidFeedUrl should return boolean', () => {
      expect(UrlValidator.isValidFeedUrl('https://example.com/feed.xml')).toBe(true);
      expect(UrlValidator.isValidFeedUrl('http://127.0.0.1/feed')).toBe(false);
    });
  });

  describe('IPv4 Address Validation', () => {
    it('should block private Class A IPs (10.x.x.x)', () => {
      expect(urlValidator.validate('http://10.0.0.1/').isValid).toBe(false);
      expect(urlValidator.validate('http://10.255.255.255/').isValid).toBe(false);
    });

    it('should block private Class B IPs (172.16-31.x.x)', () => {
      expect(urlValidator.validate('http://172.16.0.1/').isValid).toBe(false);
      expect(urlValidator.validate('http://172.31.255.255/').isValid).toBe(false);
      // 172.15 and 172.32 should be allowed (not private)
      expect(urlValidator.validate('http://172.15.0.1/').isValid).toBe(true);
      expect(urlValidator.validate('http://172.32.0.1/').isValid).toBe(true);
    });

    it('should block private Class C IPs (192.168.x.x)', () => {
      expect(urlValidator.validate('http://192.168.0.1/').isValid).toBe(false);
      expect(urlValidator.validate('http://192.168.255.255/').isValid).toBe(false);
      // 192.167 should be allowed (not private)
      expect(urlValidator.validate('http://192.167.0.1/').isValid).toBe(true);
    });

    it('should block loopback IPs (127.x.x.x)', () => {
      expect(urlValidator.validate('http://127.0.0.1/').isValid).toBe(false);
      expect(urlValidator.validate('http://127.255.255.255/').isValid).toBe(false);
    });

    it('should allow public IPs', () => {
      expect(urlValidator.validate('http://8.8.8.8/').isValid).toBe(true);
      expect(urlValidator.validate('http://1.1.1.1/').isValid).toBe(true);
      expect(urlValidator.validate('http://93.184.216.34/').isValid).toBe(true);
    });
  });
});
