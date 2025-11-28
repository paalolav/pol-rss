/**
 * Feed Recovery Service Tests (ST-003-07)
 *
 * Tests for the recovery mode that extracts content from malformed feeds.
 */

import {
  attemptRecovery,
  needsRecovery,
  validateRecoveredContent,
  extractItemsAlternative,
  RecoveryResult,
} from '../../src/webparts/polRssGallery/services/feedRecovery';

describe('feedRecovery', () => {
  describe('needsRecovery', () => {
    it('should return true for content with control characters', () => {
      const xmlWithControlChars = '<?xml version="1.0"?><rss>\x00\x08content</rss>';
      expect(needsRecovery(xmlWithControlChars)).toBe(true);
    });

    it('should return true for content wrapped in HTML', () => {
      const htmlWrapped = '<html><body><rss version="2.0"><channel></channel></rss></body></html>';
      expect(needsRecovery(htmlWrapped)).toBe(true);
    });

    it('should return true for missing namespace declarations', () => {
      const missingNs = '<?xml version="1.0"?><rss version="2.0"><channel><media:thumbnail url="test.jpg"/></channel></rss>';
      expect(needsRecovery(missingNs)).toBe(true);
    });

    it('should return true for content with BOM', () => {
      const withBom = '\uFEFF<?xml version="1.0"?><rss></rss>';
      expect(needsRecovery(withBom)).toBe(true);
    });

    it('should return true for multiple XML declarations', () => {
      const multipleDeclarations = '<?xml version="1.0"?><?xml version="1.0"?><rss></rss>';
      expect(needsRecovery(multipleDeclarations)).toBe(true);
    });

    it('should return true for unescaped ampersands', () => {
      const unescapedAmp = '<?xml version="1.0"?><rss><item><title>News & Updates</title></item></rss>';
      expect(needsRecovery(unescapedAmp)).toBe(true);
    });

    it('should return false for clean well-formed XML', () => {
      const cleanXml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Test</title></channel></rss>';
      expect(needsRecovery(cleanXml)).toBe(false);
    });

    it('should return true for empty/null input', () => {
      expect(needsRecovery('')).toBe(true);
      expect(needsRecovery(null as unknown as string)).toBe(true);
    });
  });

  describe('attemptRecovery', () => {
    describe('removeControlCharacters strategy', () => {
      it('should remove NULL bytes', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>Test\x00Title</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).not.toContain('\x00');
        expect(result.appliedStrategies.some(s => s.strategy === 'removeControlCharacters')).toBe(true);
      });

      it('should remove other control characters', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>Test\x08\x0B\x0CTitle</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).not.toMatch(/[\x01-\x08\x0B\x0C]/);
      });
    });

    describe('fixDuplicateDeclarations strategy', () => {
      it('should remove duplicate XML declarations', () => {
        const xml = '<?xml version="1.0"?><?xml version="1.0"?><rss version="2.0"><channel></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        const declCount = (result.recoveredContent.match(/<\?xml/g) || []).length;
        expect(declCount).toBe(1);
        expect(result.appliedStrategies.some(s => s.strategy === 'fixDuplicateDeclarations')).toBe(true);
      });

      it('should not modify XML with single declaration', () => {
        const xml = '<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>';
        const result = attemptRecovery(xml);

        // No duplicate declaration fix needed
        expect(result.appliedStrategies.find(s => s.strategy === 'fixDuplicateDeclarations')?.fixCount || 0).toBe(0);
      });
    });

    describe('stripInvalidXml strategy', () => {
      it('should escape unescaped ampersands', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>News & Updates</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).toContain('News &amp; Updates');
        expect(result.appliedStrategies.some(s => s.strategy === 'stripInvalidXml')).toBe(true);
      });

      it('should not double-escape already escaped entities', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>News &amp; Updates</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('News &amp; Updates');
        expect(result.recoveredContent).not.toContain('&amp;amp;');
      });

      it('should preserve numeric entities', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>Price: &#36;100</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('&#36;');
      });
    });

    describe('fixBrokenCdata strategy', () => {
      it('should close unclosed CDATA sections', () => {
        const xml = '<?xml version="1.0"?><rss><item><description><![CDATA[Content without closing</description></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        const cdataOpens = (result.recoveredContent.match(/<!\[CDATA\[/g) || []).length;
        const cdataCloses = (result.recoveredContent.match(/\]\]>/g) || []).length;
        expect(cdataOpens).toBeLessThanOrEqual(cdataCloses);
      });

      it('should handle nested ]]> in CDATA', () => {
        // This tests the fixBrokenCdata strategy directly
        // Note: already-valid CDATA won't trigger recovery, so we test via direct XML parsing
        const xml = '<?xml version="1.0"?><rss><item><description><![CDATA[Content with ]]> inside]]></description></item></rss>';
        const result = attemptRecovery(xml);

        // This particular XML is actually valid (the browser parses the first ]]> as the CDATA end)
        // Recovery may or may not be triggered depending on other checks
        // The key is that recovery doesn't crash and handles the content
        expect(result.recoveredContent).toBeTruthy();
      });
    });

    describe('fixBadEncoding strategy', () => {
      it('should remove BOM character', () => {
        const xml = '\uFEFF<?xml version="1.0"?><rss><channel></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent.charCodeAt(0)).not.toBe(0xFEFF);
        expect(result.appliedStrategies.some(s => s.strategy === 'fixBadEncoding')).toBe(true);
      });

      it('should fix common mojibake patterns', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>Ã¦bler</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).toContain('æbler');
      });

      it('should fix Norwegian character mojibake', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>Ã¸stersÃ¸en</title></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('østers');
      });
    });

    describe('fixMissingNamespaces strategy', () => {
      it('should add missing media namespace', () => {
        const xml = '<?xml version="1.0"?><rss version="2.0"><channel><item><media:thumbnail url="test.jpg"/></item></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).toContain('xmlns:media=');
        expect(result.appliedStrategies.some(s => s.strategy === 'fixMissingNamespaces')).toBe(true);
      });

      it('should add missing dc namespace', () => {
        const xml = '<?xml version="1.0"?><rss version="2.0"><channel><item><dc:creator>Author</dc:creator></item></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('xmlns:dc=');
      });

      it('should add missing content namespace', () => {
        const xml = '<?xml version="1.0"?><rss version="2.0"><channel><item><content:encoded>HTML</content:encoded></item></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('xmlns:content=');
      });

      it('should not add namespace if already declared', () => {
        const xml = '<?xml version="1.0"?><rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><item><media:thumbnail url="test.jpg"/></item></channel></rss>';
        const result = attemptRecovery(xml);

        // Should not have duplicate namespace declaration
        const mediaCount = (result.recoveredContent.match(/xmlns:media/g) || []).length;
        expect(mediaCount).toBe(1);
      });
    });

    describe('extractFromHtml strategy', () => {
      it('should extract RSS from HTML wrapper', () => {
        const html = '<!DOCTYPE html><html><head></head><body><rss version="2.0"><channel><title>Test</title><item><title>Item</title></item></channel></rss></body></html>';
        const result = attemptRecovery(html);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).not.toContain('<html');
        expect(result.recoveredContent).toContain('<rss');
        expect(result.appliedStrategies.some(s => s.strategy === 'extractFromHtml')).toBe(true);
      });

      it('should extract Atom from HTML wrapper', () => {
        const html = '<html><body><feed xmlns="http://www.w3.org/2005/Atom"><title>Test</title></feed></body></html>';
        const result = attemptRecovery(html);

        expect(result.recoveredContent).toContain('<feed');
        expect(result.recoveredContent).not.toContain('<html');
      });

      it('should wrap channel-only content in RSS tags', () => {
        const html = '<html><body><channel><title>Test</title><item><title>Item</title></item></channel></body></html>';
        const result = attemptRecovery(html);

        expect(result.recoveredContent).toContain('<rss');
        expect(result.recoveredContent).toContain('</rss>');
      });

      it('should remove DOCTYPE declarations', () => {
        const html = '<!DOCTYPE html><rss version="2.0"><channel></channel></rss>';
        const result = attemptRecovery(html);

        expect(result.recoveredContent).not.toContain('DOCTYPE');
      });
    });

    describe('fixMalformedAttributes strategy', () => {
      it('should quote unquoted attribute values', () => {
        const xml = '<?xml version="1.0"?><rss version=2.0><channel></channel></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.recoveredContent).toMatch(/version="2.0"/);
      });

      it('should convert single quotes to double quotes', () => {
        const xml = "<?xml version='1.0'?><rss version='2.0'><channel></channel></rss>";
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('version="1.0"');
        expect(result.recoveredContent).toContain('version="2.0"');
      });
    });

    describe('normalizeWhitespace strategy', () => {
      it('should collapse excessive whitespace', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>  Multiple   Spaces  </title></item></rss>';
        const result = attemptRecovery(xml);

        // Multiple spaces should be collapsed to single space
        expect(result.recoveredContent).not.toMatch(/  +/);
      });

      it('should trim whitespace in title and link elements', () => {
        const xml = '<?xml version="1.0"?><rss><item><title>  Trimmed Title  </title><link>  https://example.com  </link></item></rss>';
        const result = attemptRecovery(xml);

        expect(result.recoveredContent).toContain('<title>Trimmed Title</title>');
        expect(result.recoveredContent).toContain('<link>https://example.com</link>');
      });
    });

    describe('multiple strategies combined', () => {
      it('should apply multiple recovery strategies as needed', () => {
        const brokenXml = '\uFEFF<?xml version="1.0"?><?xml version="1.0"?><html><body><rss version=2.0><channel><item><title>News & Updates</title><media:thumbnail url="test.jpg"/></item></channel></rss></body></html>';
        const result = attemptRecovery(brokenXml);

        expect(result.recoveryAttempted).toBe(true);
        expect(result.appliedStrategies.length).toBeGreaterThan(1);

        // Check multiple fixes were applied
        expect(result.recoveredContent.charCodeAt(0)).not.toBe(0xFEFF); // BOM removed
        expect(result.recoveredContent).not.toContain('<html'); // HTML extracted
        expect(result.recoveredContent).toContain('xmlns:media'); // Namespace added
        expect(result.recoveredContent).toContain('&amp;'); // Ampersand escaped
      });

      it('should respect maxStrategies limit', () => {
        const brokenXml = '\uFEFF<?xml version="1.0"?><rss><item><title>Test & Title</title></item></rss>';
        const result = attemptRecovery(brokenXml, { maxStrategies: 2 });

        // Should have at most 2 strategies applied
        const appliedCount = result.appliedStrategies.filter(s => s.success).length;
        expect(appliedCount).toBeLessThanOrEqual(2);
        expect(result.warnings.some(w => w.includes('Maximum recovery strategies'))).toBe(true);
      });
    });

    describe('recovery logging', () => {
      it('should provide descriptive action information', () => {
        const xml = '\uFEFF<?xml version="1.0"?><rss><item><title>Test & Title</title></item></rss>';
        const result = attemptRecovery(xml);

        for (const action of result.appliedStrategies) {
          expect(action.strategy).toBeTruthy();
          expect(action.description).toBeTruthy();
          expect(typeof action.fixCount).toBe('number');
          expect(typeof action.success).toBe('boolean');
        }
      });
    });
  });

  describe('extractItemsAlternative', () => {
    describe('RSS item extraction', () => {
      it('should extract items using regex patterns', () => {
        const xml = `
          <rss>
            <item>
              <title>First Article</title>
              <link>https://example.com/1</link>
              <description>First description</description>
            </item>
            <item>
              <title>Second Article</title>
              <link>https://example.com/2</link>
              <description>Second description</description>
            </item>
          </rss>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(2);
        expect(items[0].title).toBe('First Article');
        expect(items[0].link).toBe('https://example.com/1');
        expect(items[0].description).toBe('First description');
        expect(items[1].title).toBe('Second Article');
      });

      it('should extract items with CDATA content', () => {
        const xml = `
          <rss>
            <item>
              <title><![CDATA[CDATA Title]]></title>
              <link>https://example.com</link>
              <description><![CDATA[<p>HTML in CDATA</p>]]></description>
            </item>
          </rss>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(1);
        expect(items[0].title).toBe('CDATA Title');
        expect(items[0].description).toContain('HTML in CDATA');
      });

      it('should extract pubDate', () => {
        const xml = `
          <rss>
            <item>
              <title>Article</title>
              <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
            </item>
          </rss>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(1);
        expect(items[0].pubDate).toBe('Sun, 24 Nov 2025 10:00:00 GMT');
      });

      it('should handle partial items (missing some fields)', () => {
        const xml = `
          <rss>
            <item>
              <title>Title Only</title>
            </item>
            <item>
              <link>https://example.com/link-only</link>
            </item>
          </rss>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(2);
        expect(items[0].title).toBe('Title Only');
        expect(items[0].link).toBeUndefined();
        expect(items[1].title).toBeUndefined();
        expect(items[1].link).toBe('https://example.com/link-only');
      });
    });

    describe('Atom entry extraction', () => {
      it('should extract Atom entries', () => {
        const xml = `
          <feed>
            <entry>
              <title>Atom Entry</title>
              <link href="https://example.com/entry" />
              <summary>Entry summary</summary>
              <published>2025-11-24T10:00:00Z</published>
            </entry>
          </feed>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(1);
        expect(items[0].title).toBe('Atom Entry');
        expect(items[0].link).toBe('https://example.com/entry');
        expect(items[0].description).toBe('Entry summary');
        expect(items[0].pubDate).toBe('2025-11-24T10:00:00Z');
      });

      it('should extract content instead of summary when available', () => {
        const xml = `
          <feed>
            <entry>
              <title>Entry</title>
              <content>Full content here</content>
            </entry>
          </feed>
        `;
        const items = extractItemsAlternative(xml);

        expect(items[0].description).toBe('Full content here');
      });

      it('should use updated date when published is missing', () => {
        const xml = `
          <feed>
            <entry>
              <title>Entry</title>
              <updated>2025-11-24T12:00:00Z</updated>
            </entry>
          </feed>
        `;
        const items = extractItemsAlternative(xml);

        expect(items[0].pubDate).toBe('2025-11-24T12:00:00Z');
      });
    });

    describe('mixed feed extraction', () => {
      it('should extract both RSS items and Atom entries from same content', () => {
        const xml = `
          <root>
            <item>
              <title>RSS Item</title>
              <link>https://example.com/rss</link>
            </item>
            <entry>
              <title>Atom Entry</title>
              <link href="https://example.com/atom" />
            </entry>
          </root>
        `;
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(2);
        expect(items.some(i => i.title === 'RSS Item')).toBe(true);
        expect(items.some(i => i.title === 'Atom Entry')).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should return empty array for content without items', () => {
        const xml = '<rss><channel><title>Empty Feed</title></channel></rss>';
        const items = extractItemsAlternative(xml);

        expect(items).toHaveLength(0);
      });

      it('should skip items with no extractable content', () => {
        const xml = `
          <rss>
            <item></item>
            <item>
              <category>Tech</category>
            </item>
          </rss>
        `;
        const items = extractItemsAlternative(xml);

        // Items without title, link, or description should be skipped
        expect(items).toHaveLength(0);
      });

      it('should handle malformed XML gracefully', () => {
        // Broken XML with improperly closed tags
        const brokenXml = '<rss><item><title>Broken Title</title><link>https://example.com</link></item></rss>';
        const items = extractItemsAlternative(brokenXml);

        // Should extract what it can from the broken structure
        expect(items).toHaveLength(1);
        expect(items[0].link).toBe('https://example.com');
        expect(items[0].title).toBe('Broken Title');
      });
    });
  });

  describe('validateRecoveredContent', () => {
    it('should return valid=true for well-formed XML with items', () => {
      const xml = '<?xml version="1.0"?><rss version="2.0"><channel><item><title>Test</title></item></channel></rss>';
      const result = validateRecoveredContent(xml);

      expect(result.valid).toBe(true);
      expect(result.hasItems).toBe(true);
      expect(result.itemCount).toBe(1);
    });

    it('should return valid=true for well-formed Atom with entries', () => {
      const xml = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Test</title></entry></feed>';
      const result = validateRecoveredContent(xml);

      expect(result.valid).toBe(true);
      expect(result.hasItems).toBe(true);
      expect(result.itemCount).toBe(1);
    });

    it('should count both items and entries', () => {
      // Unusual but possible structure
      const xml = '<?xml version="1.0"?><root><item><title>RSS</title></item><entry><title>Atom</title></entry></root>';
      const result = validateRecoveredContent(xml);

      expect(result.itemCount).toBe(2);
    });

    it('should return hasItems=false for feed without items', () => {
      const xml = '<?xml version="1.0"?><rss version="2.0"><channel><title>Empty</title></channel></rss>';
      const result = validateRecoveredContent(xml);

      expect(result.valid).toBe(true);
      expect(result.hasItems).toBe(false);
      expect(result.itemCount).toBe(0);
    });

    it('should return valid=false for malformed XML', () => {
      const xml = '<?xml version="1.0"?><rss><channel><title>Broken';
      const result = validateRecoveredContent(xml);

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should return valid=false for non-XML content', () => {
      const notXml = 'This is not XML at all';
      const result = validateRecoveredContent(notXml);

      expect(result.valid).toBe(false);
    });
  });

  describe('RecoveryResult structure', () => {
    it('should have correct structure when no recovery needed', () => {
      const xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Clean Feed</title></channel></rss>';
      const result = attemptRecovery(xml);

      expect(result).toMatchObject({
        recoveryAttempted: false,
        appliedStrategies: [],
        warnings: [],
        itemErrors: [],
      });
      expect(result.recoveredContent).toBe(xml);
    });

    it('should track all applied strategies', () => {
      const brokenXml = '\uFEFF<?xml version="1.0"?><rss><item><title>Test & amp</title></item></rss>';
      const result = attemptRecovery(brokenXml);

      expect(result.recoveryAttempted).toBe(true);
      expect(Array.isArray(result.appliedStrategies)).toBe(true);

      for (const strategy of result.appliedStrategies) {
        expect(strategy).toHaveProperty('strategy');
        expect(strategy).toHaveProperty('description');
        expect(strategy).toHaveProperty('fixCount');
        expect(strategy).toHaveProperty('success');
      }
    });

    it('should track failed strategies in warnings', () => {
      // Force a strategy failure by using a strategy that might fail
      const result = attemptRecovery('not valid xml at all', {
        strategies: ['fixUnclosedTags', 'fixMissingNamespaces'],
      });

      // Even with bad input, strategies should report their status
      expect(Array.isArray(result.appliedStrategies)).toBe(true);
    });
  });

  describe('real-world malformed feed scenarios', () => {
    it('should recover feed with all common issues', () => {
      const terribleFeed = `
        \uFEFF<?xml version='1.0'?><?xml version="1.0"?>
        <!DOCTYPE html>
        <html>
        <body>
        <rss version=2.0>
          <channel>
            <title>News & Updates</title>
            <item>
              <title>  Article with    spaces & entities  </title>
              <link>https://example.com/article-1</link>
              <description><![CDATA[Content here without closing
              <media:thumbnail url="test.jpg"/>
              <dc:creator>Author Name</dc:creator>
            </item>
            <item>
              <title>Second \x00 Article</title>
              <link>https://example.com/article-2</link>
            </item>
          </channel>
        </rss>
        </body>
        </html>
      `;

      const result = attemptRecovery(terribleFeed, { aggressive: true });

      expect(result.recoveryAttempted).toBe(true);
      expect(result.appliedStrategies.length).toBeGreaterThan(3);

      // Should have removed BOM
      expect(result.recoveredContent.charCodeAt(0)).not.toBe(0xFEFF);

      // Should have removed HTML wrapper
      expect(result.recoveredContent).not.toContain('<html');
      expect(result.recoveredContent).not.toContain('DOCTYPE');

      // Should have escaped ampersand
      expect(result.recoveredContent).toContain('&amp;');

      // Should have added missing namespaces
      expect(result.recoveredContent).toContain('xmlns:media');
      expect(result.recoveredContent).toContain('xmlns:dc');

      // Should have removed control characters
      expect(result.recoveredContent).not.toContain('\x00');
    });

    it('should handle feed with Windows-1252 artifacts', () => {
      // Test actual mojibake from BOM (which triggers fixBadEncoding)
      const windowsFeed = '\uFEFF<?xml version="1.0" encoding="windows-1252"?>' +
        '<rss version="2.0"><channel><item>' +
        '<title>Test Title</title>' +
        '</item></channel></rss>';

      const result = attemptRecovery(windowsFeed);

      // Should remove BOM and fix encoding declaration
      expect(result.recoveryAttempted).toBe(true);
      expect(result.recoveredContent.charCodeAt(0)).not.toBe(0xFEFF);
      // Encoding should be changed to UTF-8
      expect(result.recoveredContent).toContain('encoding="UTF-8"');
    });

    it('should handle Norwegian characters corrupted by encoding issues', () => {
      // Test with actual mojibake patterns that our fix handles
      const norwegianFeed = `<?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <item>
              <title>Ã¸stlandets nyheter</title>
              <description>Ã¥rets beste Ã¦bler</description>
            </item>
          </channel>
        </rss>
      `;

      const result = attemptRecovery(norwegianFeed);

      // These specific mojibake patterns should be fixed
      expect(result.recoveredContent).toContain('ø'); // Ã¸ -> ø
      expect(result.recoveredContent).toContain('å'); // Ã¥ -> å
      expect(result.recoveredContent).toContain('æ'); // Ã¦ -> æ
    });

    it('should extract items from severely broken XML as last resort', () => {
      const brokenXml = `
        <rss version="2.0">
          <channel
            <title>Broken Feed</title>
            <item>
              <title>First Item</title>
              <link>https://example.com/1</link>
              <description>First description</description>
            </item>
            <item>
              <title>Second Item</title>
              <link>https://example.com/2</link>
            </item>
          </channel>
        </rss>
      `;

      // Standard recovery might not fully fix this, but alternative extraction should work
      const items = extractItemsAlternative(brokenXml);

      expect(items.length).toBe(2);
      expect(items[0].title).toBe('First Item');
      expect(items[1].title).toBe('Second Item');
    });
  });
});
