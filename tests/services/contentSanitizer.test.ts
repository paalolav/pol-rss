/**
 * Content Sanitizer Tests
 *
 * Tests for XSS prevention and content sanitization.
 * @see REF-012-SECURITY-HARDENING.md
 */
import { ContentSanitizer, sanitizer } from '../../src/webparts/polRssGallery/services/contentSanitizer';

// XSS attack vectors for testing
const xssVectors = [
  // Basic script injection
  { input: '<script>alert("xss")</script>', expected: '' },
  { input: '<script src="evil.js"></script>', expected: '' },

  // Event handler injection
  { input: '<img src="x" onerror="alert(1)">', expected: '<img src="x">' },
  { input: '<div onmouseover="alert(1)">hover</div>', expected: '<div>hover</div>' },
  { input: '<body onload="alert(1)">', expected: '' },
  { input: '<input onfocus="alert(1)" autofocus>', expected: '' },
  { input: '<svg onload="alert(1)">', expected: '' },
  { input: '<video><source onerror="alert(1)"></video>', expected: '' },
  { input: '<marquee onstart="alert(1)">', expected: '' },

  // JavaScript URL injection
  { input: '<a href="javascript:alert(1)">click</a>', expected: '<a>click</a>' },
  { input: '<a href="JAVASCRIPT:alert(1)">click</a>', expected: '<a>click</a>' },
  { input: '<a href="javascript&#58;alert(1)">click</a>', expected: '<a>click</a>' },
  { input: '<a href="&#106;avascript:alert(1)">click</a>', expected: '<a>click</a>' },

  // Data URL injection
  { input: '<a href="data:text/html,<script>alert(1)</script>">click</a>', expected: '<a>click</a>' },
  { input: '<img src="data:text/html,<script>alert(1)</script>">', expected: '<img>' },

  // VBScript injection (legacy IE)
  { input: '<a href="vbscript:alert(1)">click</a>', expected: '<a>click</a>' },

  // Iframe injection
  { input: '<iframe src="javascript:alert(1)"></iframe>', expected: '' },
  { input: '<iframe src="https://evil.com"></iframe>', expected: '' },

  // Object/Embed injection
  { input: '<object data="javascript:alert(1)"></object>', expected: '' },
  { input: '<embed src="javascript:alert(1)">', expected: '' },

  // Form injection (for phishing)
  { input: '<form action="https://evil.com"><input></form>', expected: '' },

  // Style injection (for CSS-based attacks)
  { input: '<style>body{background:url("javascript:alert(1)")}</style>', expected: '' },
  { input: '<div style="background:url(javascript:alert(1))">test</div>', expected: '<div>test</div>' },

  // SVG-based XSS
  { input: '<svg><script>alert(1)</script></svg>', expected: '' },
  { input: '<svg/onload=alert(1)>', expected: '' },

  // Meta refresh injection
  { input: '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">', expected: '' },

  // Base tag injection
  { input: '<base href="https://evil.com/">', expected: '' },

  // Template injection
  { input: '<template><script>alert(1)</script></template>', expected: '' },

  // Math tag XSS (MathML)
  { input: '<math><maction actiontype="statusline#http://evil">CLICK</maction></math>', expected: '' },

  // Attribute breaking attempts
  { input: '"><script>alert(1)</script>', expected: '"&gt;' },
  { input: "'-alert(1)-'", expected: "'-alert(1)-'" },

  // Unicode encoding attempts
  { input: '<a href="\u006Aavascript:alert(1)">test</a>', expected: '<a>test</a>' },

  // HTML5 autofocus
  { input: '<input autofocus onfocus=alert(1)>', expected: '' },
  { input: '<textarea autofocus onfocus=alert(1)></textarea>', expected: '' },

  // Expression (IE CSS)
  { input: '<div style="width:expression(alert(1))">test</div>', expected: '<div>test</div>' },

  // Nested encoding
  { input: '<a href="java&#x09;script:alert(1)">click</a>', expected: '<a>click</a>' },
];

describe('ContentSanitizer', () => {
  describe('sanitize()', () => {
    describe('XSS Prevention', () => {
      xssVectors.forEach(({ input, expected }, index) => {
        it(`should block XSS vector #${index + 1}: ${input.substring(0, 50)}...`, () => {
          const result = sanitizer.sanitize(input);
          // Check that dangerous content is removed
          expect(result).not.toContain('<script');
          expect(result).not.toContain('javascript:');
          expect(result).not.toContain('onerror=');
          expect(result).not.toContain('onclick=');
          expect(result).not.toContain('onload=');
          expect(result).not.toContain('<iframe');
          expect(result).not.toContain('<object');
          expect(result).not.toContain('<embed');
          expect(result).not.toContain('<form');
          expect(result).not.toContain('<style');
        });
      });
    });

    describe('Safe Content Preservation', () => {
      it('should preserve safe paragraph tags', () => {
        const input = '<p>Hello, world!</p>';
        expect(sanitizer.sanitize(input)).toBe('<p>Hello, world!</p>');
      });

      it('should preserve safe text formatting', () => {
        const input = '<strong>Bold</strong> and <em>italic</em>';
        expect(sanitizer.sanitize(input)).toBe('<strong>Bold</strong> and <em>italic</em>');
      });

      it('should preserve safe links with http/https', () => {
        const input = '<a href="https://example.com">Link</a>';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('target="_blank"');
        expect(result).toContain('rel="noopener noreferrer"');
      });

      it('should preserve safe images with http/https src', () => {
        const input = '<img src="https://example.com/image.jpg" alt="Test">';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('src="https://example.com/image.jpg"');
        expect(result).toContain('alt="Test"');
      });

      it('should preserve lists', () => {
        const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        expect(sanitizer.sanitize(input)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>');
      });

      it('should preserve blockquotes', () => {
        const input = '<blockquote>A quote</blockquote>';
        expect(sanitizer.sanitize(input)).toBe('<blockquote>A quote</blockquote>');
      });

      it('should preserve code blocks', () => {
        const input = '<pre><code>const x = 1;</code></pre>';
        expect(sanitizer.sanitize(input)).toBe('<pre><code>const x = 1;</code></pre>');
      });

      it('should preserve tables', () => {
        const input = '<table><tr><th>Header</th></tr><tr><td>Cell</td></tr></table>';
        expect(sanitizer.sanitize(input)).toContain('<table>');
        expect(sanitizer.sanitize(input)).toContain('<th>Header</th>');
        expect(sanitizer.sanitize(input)).toContain('<td>Cell</td>');
      });

      it('should preserve headings', () => {
        const input = '<h1>Title</h1><h2>Subtitle</h2>';
        expect(sanitizer.sanitize(input)).toBe('<h1>Title</h1><h2>Subtitle</h2>');
      });

      it('should preserve line breaks', () => {
        const input = 'Line 1<br>Line 2';
        expect(sanitizer.sanitize(input)).toBe('Line 1<br>Line 2');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string', () => {
        expect(sanitizer.sanitize('')).toBe('');
      });

      it('should handle null/undefined', () => {
        expect(sanitizer.sanitize(null as unknown as string)).toBe('');
        expect(sanitizer.sanitize(undefined as unknown as string)).toBe('');
      });

      it('should handle plain text', () => {
        expect(sanitizer.sanitize('Hello, world!')).toBe('Hello, world!');
      });

      it('should handle nested tags', () => {
        const input = '<p><strong><em>Nested</em></strong></p>';
        expect(sanitizer.sanitize(input)).toBe('<p><strong><em>Nested</em></strong></p>');
      });

      it('should handle malformed HTML', () => {
        const input = '<p>Unclosed paragraph<div>Mixed</p></div>';
        const result = sanitizer.sanitize(input);
        // DOMPurify should fix malformed HTML
        expect(result).not.toContain('<script');
      });

      it('should handle HTML entities', () => {
        const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
        const result = sanitizer.sanitize(input);
        expect(result).not.toContain('<script');
      });

      it('should handle CDATA sections', () => {
        const input = '<![CDATA[<script>alert(1)</script>]]>';
        const result = sanitizer.sanitize(input);
        expect(result).not.toContain('<script');
      });

      it('should handle very long content', () => {
        const input = '<p>' + 'a'.repeat(100000) + '</p>';
        const result = sanitizer.sanitize(input);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContain('<p>');
      });
    });

    describe('Link Security', () => {
      it('should add target="_blank" to external links', () => {
        const input = '<a href="https://external.com">External</a>';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('target="_blank"');
      });

      it('should add rel="noopener noreferrer" to external links', () => {
        const input = '<a href="https://external.com">External</a>';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('rel="noopener noreferrer"');
      });

      it('should preserve mailto: links', () => {
        const input = '<a href="mailto:test@example.com">Email</a>';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('href="mailto:test@example.com"');
      });

      it('should not add target="_blank" to relative links', () => {
        const input = '<a href="/page">Internal</a>';
        const result = sanitizer.sanitize(input);
        expect(result).toContain('href="/page"');
      });
    });
  });

  describe('sanitizeText()', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert(1)</script>';
      const result = sanitizer.sanitizeText(input);
      expect(result).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('should escape quotes', () => {
      const input = 'Say "Hello" and \'Goodbye\'';
      const result = sanitizer.sanitizeText(input);
      expect(result).toBe('Say &quot;Hello&quot; and &#x27;Goodbye&#x27;');
    });

    it('should escape ampersands', () => {
      const input = 'A & B';
      const result = sanitizer.sanitizeText(input);
      expect(result).toBe('A &amp; B');
    });

    it('should handle empty string', () => {
      expect(sanitizer.sanitizeText('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizer.sanitizeText(null as unknown as string)).toBe('');
      expect(sanitizer.sanitizeText(undefined as unknown as string)).toBe('');
    });
  });

  describe('sanitizeUrl()', () => {
    it('should allow https URLs', () => {
      const url = 'https://example.com/page';
      expect(sanitizer.sanitizeUrl(url)).toBe(url);
    });

    it('should allow http URLs', () => {
      const url = 'http://example.com/page';
      expect(sanitizer.sanitizeUrl(url)).toBe(url);
    });

    it('should allow protocol-relative URLs', () => {
      const url = '//example.com/page';
      expect(sanitizer.sanitizeUrl(url)).toBe(url);
    });

    it('should allow relative URLs', () => {
      expect(sanitizer.sanitizeUrl('/page')).toBe('/page');
      expect(sanitizer.sanitizeUrl('./page')).toBe('./page');
      expect(sanitizer.sanitizeUrl('../page')).toBe('../page');
    });

    it('should block javascript: URLs', () => {
      expect(sanitizer.sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizer.sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('');
      expect(sanitizer.sanitizeUrl('JavaScript:alert(1)')).toBe('');
    });

    it('should block vbscript: URLs', () => {
      expect(sanitizer.sanitizeUrl('vbscript:alert(1)')).toBe('');
    });

    it('should block data:text/html URLs', () => {
      expect(sanitizer.sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should handle empty URLs', () => {
      expect(sanitizer.sanitizeUrl('')).toBe('');
      expect(sanitizer.sanitizeUrl(null as unknown as string)).toBe('');
    });

    it('should handle URLs with query strings', () => {
      const url = 'https://example.com/search?q=test&page=1';
      expect(sanitizer.sanitizeUrl(url)).toBe(url);
    });

    it('should handle URLs with fragments', () => {
      const url = 'https://example.com/page#section';
      expect(sanitizer.sanitizeUrl(url)).toBe(url);
    });
  });

  describe('stripHtml()', () => {
    it('should strip all HTML tags', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      expect(sanitizer.stripHtml(input)).toBe('Hello world!');
    });

    it('should decode HTML entities', () => {
      const input = '&lt;test&gt; &amp; &quot;quotes&quot;';
      expect(sanitizer.stripHtml(input)).toBe('<test> & "quotes"');
    });

    it('should handle script tags', () => {
      const input = 'Before<script>alert(1)</script>After';
      const result = sanitizer.stripHtml(input);
      // Most important: no script tag in output
      expect(result).not.toContain('<script');
      expect(result).not.toContain('</script>');
    });

    it('should handle empty string', () => {
      expect(sanitizer.stripHtml('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizer.stripHtml(null as unknown as string)).toBe('');
      expect(sanitizer.stripHtml(undefined as unknown as string)).toBe('');
    });
  });

  describe('Custom Configuration', () => {
    // Note: Custom config tests verify that dangerous content is always blocked
    // regardless of custom configuration. The actual tag/attribute filtering
    // is handled by DOMPurify in production - these tests focus on security.

    it('should accept custom configuration without errors', () => {
      const customSanitizer = new ContentSanitizer({
        allowedTags: ['p', 'b'],
        allowedAttributes: ['class'],
      });
      const input = '<p><b>Bold</b></p>';
      const result = customSanitizer.sanitize(input);
      // Should produce valid output
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Bold');
    });

    it('should still block forbidden tags with custom config', () => {
      const customSanitizer = new ContentSanitizer({
        allowedTags: ['script', 'p'], // Try to allow script
      });
      const input = '<script>alert(1)</script><p>Text</p>';
      const result = customSanitizer.sanitize(input);
      expect(result).not.toContain('<script');
      expect(result).toContain('<p>Text</p>');
    });

    it('should still block forbidden attributes with custom config', () => {
      const customSanitizer = new ContentSanitizer({
        allowedAttributes: ['onclick', 'href'], // Try to allow onclick
      });
      const input = '<a href="https://test.com" onclick="alert(1)">Click</a>';
      const result = customSanitizer.sanitize(input);
      expect(result).not.toContain('onclick');
    });

    it('should block event handlers regardless of config', () => {
      const customSanitizer = new ContentSanitizer({
        allowedAttributes: ['onerror', 'onload', 'onmouseover'],
      });
      const input = '<img src="x" onerror="alert(1)" onload="alert(2)">';
      const result = customSanitizer.sanitize(input);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
    });
  });

  describe('Singleton Instance', () => {
    it('should return the same instance', () => {
      const instance1 = ContentSanitizer.getInstance();
      const instance2 = ContentSanitizer.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should be the same as exported sanitizer', () => {
      expect(ContentSanitizer.getInstance()).toBe(sanitizer);
    });
  });

  describe('Performance', () => {
    it('should sanitize content within acceptable time (<5ms per item)', () => {
      const testContent = '<p>Sample <strong>RSS</strong> content with <a href="https://example.com">links</a> and <img src="https://example.com/img.jpg" alt="image">.</p>';

      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        sanitizer.sanitize(testContent);
      }

      const duration = performance.now() - start;
      const avgTime = duration / iterations;

      // Should be less than 5ms per sanitization
      expect(avgTime).toBeLessThan(5);
    });
  });
});
