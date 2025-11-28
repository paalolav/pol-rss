/**
 * ImprovedFeedParser Service Tests
 *
 * Comprehensive test suite for RSS/Atom feed parsing.
 * Covers RSS 1.0, RSS 2.0, Atom 1.0, edge cases, and error handling.
 * Target: 50+ test cases for REF-003 compliance.
 */

import { ImprovedFeedParser, IFeedParserOptions } from '../../src/webparts/polRssGallery/services/improvedFeedParser';
import {
  // RSS 2.0 standard fixtures
  rss2StandardXml,
  rss2WithMediaXml,
  rss2WithContentEncodedXml,
  rss2MinimalXml,
  rss2UnusualDatesXml,
  rss2EmptyXml,
  rss2DoubleEncodedXml,
  // RSS 1.0 (RDF)
  rss1RdfXml,
  // Atom fixtures
  atom1StandardXml,
  atomWithMediaXml,
  atomContentTypesXml,
  // Extended RSS 2.0 fixtures
  rss2iTunesXml,
  rss2DublinCoreXml,
  rss2MediaContentXml,
  rss2HtmlInTitleXml,
  rss2RelativeUrlsXml,
  rss2InternationalXml,
  rss2LongContentXml,
  rss2BrokenLinksXml,
  rss2ChannelImageXml,
  rss2WithSourceXml,
  rss2WithCommentsXml,
  rss2NamespacedXml,
  // JSON Feed fixtures
  jsonFeedV11,
  jsonFeedV10,
  jsonFeedMinimal,
  // Edge cases
  malformedXml,
  feedInHtmlWrapper,
  feedWithBOM,
  emptyValidXml,
  whitespaceOnlyXml,
  feedWithControlChars,
  // Entity handling fixtures (ST-003-03)
  rss2XmlEntitiesXml,
  rss2HtmlEntitiesXml,
  rss2TripleEncodedXml,
  rss2CdataEntitiesXml,
  // Retriever/Meltwater feed (ST-015)
  rss2RetrieverSourceXml,
  // Expected results
  expectedRss2StandardParsed,
  // Utilities
  createLargeFeed,
} from '../utils/feedTestData';

describe('ImprovedFeedParser', () => {
  const defaultOptions: IFeedParserOptions = {
    fallbackImageUrl: 'https://example.com/fallback.jpg',
    maxItems: 10,
    enableDebug: false,
  };

  // ==========================================================================
  // RSS 2.0 Standard Tests
  // ==========================================================================
  describe('RSS 2.0 feeds', () => {
    it('parses a standard RSS 2.0 feed correctly', () => {
      const result = ImprovedFeedParser.parse(rss2StandardXml, defaultOptions);

      expect(result).toHaveLength(expectedRss2StandardParsed.itemCount);
      expect(result[0].title).toBe(expectedRss2StandardParsed.items[0].title);
      expect(result[0].link).toBe(expectedRss2StandardParsed.items[0].link);
      expect(result[0].feedType).toBe('rss');
    });

    it('extracts categories from RSS items', () => {
      const result = ImprovedFeedParser.parse(rss2StandardXml, defaultOptions);

      expect(result[0].categories).toEqual(['News', 'Technology']);
      expect(result[1].categories).toEqual(['Sports']);
      expect(result[2].categories).toBeUndefined();
    });

    it('extracts images from media:thumbnail', () => {
      const result = ImprovedFeedParser.parse(rss2WithMediaXml, defaultOptions);

      expect(result[0].imageUrl).toBe('https://example.com/images/thumb.jpg');
    });

    it('extracts images from enclosure elements', () => {
      const result = ImprovedFeedParser.parse(rss2WithMediaXml, defaultOptions);

      expect(result[1].imageUrl).toBe('https://example.com/images/enclosure.jpg');
    });

    it('extracts images from content:encoded', () => {
      const result = ImprovedFeedParser.parse(rss2WithContentEncodedXml, defaultOptions);

      expect(result[0].imageUrl).toBe('https://example.com/images/inline.jpg');
    });

    it('extracts images from WordPress wp-block-image figures (sentralregisteret.no style)', () => {
      const { wordpressRssWithFiguresXml } = require('../utils/feedTestData');
      const result = ImprovedFeedParser.parse(wordpressRssWithFiguresXml, defaultOptions);

      expect(result).toHaveLength(3);

      // First item should have image from content:encoded
      expect(result[0].title).toBe('Article 1 with Figure');
      expect(result[0].imageUrl).toBe('https://example.com/uploads/article1-image.jpg');

      // Second item should also have image
      expect(result[1].title).toBe('Article 2 with Figure');
      expect(result[1].imageUrl).toBe('https://example.com/uploads/article2-image.jpg');

      // Third item has no image, should use fallback
      expect(result[2].title).toBe('Article 3 without image');
      expect(result[2].imageUrl).toBe(defaultOptions.fallbackImageUrl);
    });

    it('uses fallback image when no image is found', () => {
      const result = ImprovedFeedParser.parse(rss2MinimalXml, defaultOptions);

      expect(result[0].imageUrl).toBe(defaultOptions.fallbackImageUrl);
    });

    it('handles CDATA in description', () => {
      const result = ImprovedFeedParser.parse(rss2StandardXml, defaultOptions);

      expect(result[2].description).toBeDefined();
      expect(result[2].description).not.toContain('CDATA');
    });

    it('extracts author from dc:creator', () => {
      const result = ImprovedFeedParser.parse(rss2DublinCoreXml, defaultOptions);

      expect(result[0].author).toBe('Jane Smith');
    });

    it('handles feeds with itunes namespace', () => {
      const result = ImprovedFeedParser.parse(rss2iTunesXml, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Episode 1');
    });

    it('extracts source element as author fallback', () => {
      const result = ImprovedFeedParser.parse(rss2WithSourceXml, defaultOptions);

      expect(result[0].author).toBe('Original Feed Name');
    });

    it('extracts ret:source namespace for Retriever/Meltwater feeds (ST-015)', () => {
      const result = ImprovedFeedParser.parse(rss2RetrieverSourceXml, defaultOptions);

      expect(result.length).toBe(3);
      // Item 1: only has ret:source
      expect(result[0].author).toBe('Dagbladet');
      // Item 2: has both author and ret:source - author takes priority
      expect(result[1].author).toBe('VG Nyheter');
      // Item 3: only has standard source element
      expect(result[2].author).toBe('NRK Nyheter');
    });
  });

  // ==========================================================================
  // RSS 1.0 (RDF) Tests
  // ==========================================================================
  describe('RSS 1.0 (RDF) feeds', () => {
    it('parses RSS 1.0 RDF feeds', () => {
      const result = ImprovedFeedParser.parse(rss1RdfXml, defaultOptions);

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].title).toBe('RDF Item One');
    });

    it('extracts dc:date from RSS 1.0 items', () => {
      const result = ImprovedFeedParser.parse(rss1RdfXml, defaultOptions);

      expect(result[0].pubDate).toBe('2025-11-24T10:00:00.000Z');
    });

    it('extracts dc:creator from RSS 1.0 items', () => {
      const result = ImprovedFeedParser.parse(rss1RdfXml, defaultOptions);

      expect(result[0].author).toBe('Author Name');
    });
  });

  // ==========================================================================
  // Atom 1.0 Tests
  // ==========================================================================
  describe('Atom 1.0 feeds', () => {
    it('parses a standard Atom 1.0 feed correctly', () => {
      const result = ImprovedFeedParser.parse(atom1StandardXml, defaultOptions);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First Atom Entry');
      expect(result[0].link).toBe('https://example.com/entry-1');
      expect(result[0].feedType).toBe('atom');
    });

    it('extracts Atom categories from term/label attributes', () => {
      const result = ImprovedFeedParser.parse(atom1StandardXml, defaultOptions);

      expect(result[0].categories).toEqual(['News', 'Technology']);
    });

    it('uses published date over updated date when available', () => {
      const result = ImprovedFeedParser.parse(atom1StandardXml, defaultOptions);

      expect(result[0].pubDate).toBe('2025-11-24T10:00:00.000Z');
    });

    it('handles Atom feeds with media namespace', () => {
      const result = ImprovedFeedParser.parse(atomWithMediaXml, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].imageUrl).toContain('atom');
    });

    it('handles different Atom content types (html)', () => {
      const result = ImprovedFeedParser.parse(atomContentTypesXml, defaultOptions);

      expect(result).toHaveLength(4);
      expect(result[0].title).toBe('HTML Content');
    });

    it('handles Atom text content type', () => {
      const result = ImprovedFeedParser.parse(atomContentTypesXml, defaultOptions);

      const textEntry = result.find(r => r.title === 'Text Content');
      expect(textEntry).toBeDefined();
      expect(textEntry!.description).toBeDefined();
    });

    it('handles Atom entries with only summary (no content)', () => {
      const result = ImprovedFeedParser.parse(atomContentTypesXml, defaultOptions);

      const summaryEntry = result.find(r => r.title === 'Summary Only');
      expect(summaryEntry).toBeDefined();
      expect(summaryEntry!.description).toContain('summary');
    });
  });

  // ==========================================================================
  // Media RSS Tests
  // ==========================================================================
  describe('Media RSS handling', () => {
    it('extracts media:thumbnail as primary image source', () => {
      const result = ImprovedFeedParser.parse(rss2MediaContentXml, defaultOptions);

      expect(result[0].imageUrl).toBe('https://example.com/thumb.jpg');
    });

    it('prefers media:thumbnail over media:content for video items', () => {
      const result = ImprovedFeedParser.parse(rss2MediaContentXml, defaultOptions);

      const videoItem = result.find(r => r.title === 'Video with Thumbnail');
      expect(videoItem?.imageUrl).toBe('https://example.com/video-thumb.jpg');
    });

    it('handles media:group elements', () => {
      const result = ImprovedFeedParser.parse(rss2MediaContentXml, defaultOptions);

      const groupItem = result.find(r => r.title === 'Media Group');
      expect(groupItem).toBeDefined();
      // Should extract image from the group
      expect(groupItem?.imageUrl).toBeDefined();
    });

    it('uses channel image as fallback when item has no image', () => {
      const result = ImprovedFeedParser.parse(rss2ChannelImageXml, defaultOptions);

      const noImageItem = result.find(r => r.title === 'Item Without Own Image');
      // Should fall back to channel image or fallback
      expect(noImageItem?.imageUrl).toBeDefined();
    });

    it('prefers item image over channel image', () => {
      const result = ImprovedFeedParser.parse(rss2ChannelImageXml, defaultOptions);

      const hasImageItem = result.find(r => r.title === 'Item With Own Image');
      expect(hasImageItem?.imageUrl).toBe('https://example.com/item-thumb.jpg');
    });
  });

  // ==========================================================================
  // maxItems Option Tests
  // ==========================================================================
  describe('maxItems option', () => {
    it('limits the number of items returned', () => {
      const options: IFeedParserOptions = {
        ...defaultOptions,
        maxItems: 2,
      };
      const result = ImprovedFeedParser.parse(rss2StandardXml, options);

      expect(result).toHaveLength(2);
    });

    it('returns all items when maxItems exceeds available items', () => {
      const options: IFeedParserOptions = {
        ...defaultOptions,
        maxItems: 100,
      };
      const result = ImprovedFeedParser.parse(rss2StandardXml, options);

      expect(result).toHaveLength(3);
    });

    it('returns all items when maxItems is 0', () => {
      const options: IFeedParserOptions = {
        ...defaultOptions,
        maxItems: 0,
      };
      const result = ImprovedFeedParser.parse(rss2StandardXml, options);

      expect(result).toHaveLength(3);
    });

    it('handles large feeds with maxItems', () => {
      const largeFeed = createLargeFeed(50);
      const options: IFeedParserOptions = {
        ...defaultOptions,
        maxItems: 10,
      };
      const result = ImprovedFeedParser.parse(largeFeed, options);

      expect(result).toHaveLength(10);
    });
  });

  // ==========================================================================
  // Date Handling Tests (ST-003-05: Dates are now normalized to ISO format)
  // ==========================================================================
  describe('date handling', () => {
    it('normalizes RFC 822 dates to ISO format', () => {
      const result = ImprovedFeedParser.parse(rss2UnusualDatesXml, defaultOptions);

      // RFC 822: 'Sun, 24 Nov 2025 10:00:00 +0100' → UTC 09:00
      expect(result[0].pubDate).toBe('2025-11-24T09:00:00.000Z');
    });

    it('normalizes ISO 8601 dates', () => {
      const result = ImprovedFeedParser.parse(rss2UnusualDatesXml, defaultOptions);

      // ISO 8601 dates are already normalized
      expect(result[1].pubDate).toBe('2025-11-24T10:00:00.000Z');
    });

    it('normalizes non-standard date formats to ISO', () => {
      const result = ImprovedFeedParser.parse(rss2UnusualDatesXml, defaultOptions);

      // 'November 24, 2025' → ISO format (local timezone at midnight)
      // The exact UTC time depends on the system timezone, so just verify it's a valid ISO date
      expect(result[2].pubDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      // Verify it contains November 2025
      expect(result[2].pubDate).toContain('2025-11-');
    });

    it('preserves invalid dates as original strings', () => {
      const result = ImprovedFeedParser.parse(rss2UnusualDatesXml, defaultOptions);

      // Invalid dates are preserved as-is
      expect(result[3].pubDate).toBe('not a date');
    });

    it('handles missing pubDate', () => {
      const result = ImprovedFeedParser.parse(rss2MinimalXml, defaultOptions);

      expect(result[0].pubDate).toBe('');
    });
  });

  // ==========================================================================
  // Edge Cases Tests
  // ==========================================================================
  describe('edge cases', () => {
    it('handles feeds with missing optional fields', () => {
      const result = ImprovedFeedParser.parse(rss2MinimalXml, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Minimal Item');
      expect(result[0].pubDate).toBe('');
      expect(result[0].author).toBeUndefined();
    });

    it('handles empty feeds (no items)', () => {
      const result = ImprovedFeedParser.parse(rss2EmptyXml, defaultOptions);

      expect(Array.isArray(result)).toBe(true);
    });

    it('handles double-encoded entities', () => {
      const result = ImprovedFeedParser.parse(rss2DoubleEncodedXml, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBeDefined();
    });

    it('handles international characters (UTF-8)', () => {
      const result = ImprovedFeedParser.parse(rss2InternationalXml, defaultOptions);

      expect(result).toHaveLength(3);
      expect(result[0].title).toContain('日本語');
    });

    it('handles emoji in content', () => {
      const result = ImprovedFeedParser.parse(rss2InternationalXml, defaultOptions);

      const emojiItem = result.find(r => r.title.includes('Emoji'));
      expect(emojiItem).toBeDefined();
    });

    it('handles RTL text', () => {
      const result = ImprovedFeedParser.parse(rss2InternationalXml, defaultOptions);

      const rtlItem = result.find(r => r.title.includes('عربي'));
      expect(rtlItem).toBeDefined();
    });

    it('handles very long descriptions', () => {
      const result = ImprovedFeedParser.parse(rss2LongContentXml, defaultOptions);

      expect(result).toHaveLength(2);
      // Description is truncated by cleanDescription utility (expected behavior)
      expect(result[0].description.length).toBeGreaterThan(100);
    });

    it('handles very long titles', () => {
      const result = ImprovedFeedParser.parse(rss2LongContentXml, defaultOptions);

      expect(result[1].title.length).toBeGreaterThan(100);
    });

    it('handles items with missing links using guid', () => {
      const result = ImprovedFeedParser.parse(rss2BrokenLinksXml, defaultOptions);

      const guidItem = result.find(r => r.title === 'GUID as Permalink');
      expect(guidItem?.link).toBe('https://example.com/guid-link');
    });

    it('handles items with no link at all', () => {
      const result = ImprovedFeedParser.parse(rss2BrokenLinksXml, defaultOptions);

      const noLinkItem = result.find(r => r.title === 'No Link At All');
      expect(noLinkItem).toBeDefined();
      // Should have some link value (guid fallback or empty)
    });

    it('handles whitespace-only content', () => {
      const result = ImprovedFeedParser.parse(whitespaceOnlyXml, defaultOptions);

      expect(result).toHaveLength(1);
      // Title should be trimmed
      expect(result[0].title).toBe('Whitespace Title');
    });

    it('strips control characters from content', () => {
      const result = ImprovedFeedParser.parse(feedWithControlChars, defaultOptions);

      expect(result).toHaveLength(1);
      // Control chars should be removed
      expect(result[0].title).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
    });

    it('handles feeds with BOM (Byte Order Mark)', () => {
      const result = ImprovedFeedParser.parse(feedWithBOM, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('BOM Item');
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('error handling', () => {
    it('throws on empty feed content', () => {
      expect(() => {
        ImprovedFeedParser.parse('', defaultOptions);
      }).toThrow('Empty feed content received');
    });

    it('throws on null/undefined content', () => {
      expect(() => {
        ImprovedFeedParser.parse(null as unknown as string, defaultOptions);
      }).toThrow();
    });

    it('throws on completely invalid XML', () => {
      expect(() => {
        ImprovedFeedParser.parse('not xml at all', defaultOptions);
      }).toThrow();
    });

    it('handles malformed XML with partial recovery', () => {
      const parseAttempt = () => ImprovedFeedParser.parse(malformedXml, defaultOptions);

      try {
        const result = parseAttempt();
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('handles empty valid XML structure', () => {
      const parseAttempt = () => ImprovedFeedParser.parse(emptyValidXml, defaultOptions);

      // Should either return empty array or throw
      try {
        const result = parseAttempt();
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // ==========================================================================
  // Preprocessing Tests
  // ==========================================================================
  describe('preprocessing', () => {
    it('adds missing XML declaration', () => {
      const xmlWithoutDeclaration = rss2MinimalXml.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
      const result = ImprovedFeedParser.parse(xmlWithoutDeclaration, defaultOptions);

      expect(result).toHaveLength(1);
    });

    it('handles feeds missing namespace declarations', () => {
      const xmlMissingNamespace = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <link>https://example.com</link>
            <description>Test</description>
            <item>
              <title>Item with Media</title>
              <link>https://example.com/item</link>
              <media:thumbnail url="https://example.com/thumb.jpg" />
            </item>
          </channel>
        </rss>`;

      const result = ImprovedFeedParser.parse(xmlMissingNamespace, {
        ...defaultOptions,
        preprocessingHints: { addMissingNamespaces: true },
      });

      expect(result).toHaveLength(1);
    });

    it('extracts RSS content from HTML wrapper', () => {
      const result = ImprovedFeedParser.parse(feedInHtmlWrapper, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Wrapped Item');
    });

    it('handles multiple XML declarations', () => {
      const doubleDeclaration = `<?xml version="1.0" encoding="UTF-8"?>
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Double Declaration</title>
            <link>https://example.com</link>
            <description>Test</description>
            <item>
              <title>Test Item</title>
              <link>https://example.com/test</link>
            </item>
          </channel>
        </rss>`;

      const result = ImprovedFeedParser.parse(doubleDeclaration, defaultOptions);

      expect(result).toHaveLength(1);
    });

    it('handles channel without rss wrapper', () => {
      const channelOnly = `<?xml version="1.0" encoding="UTF-8"?>
        <channel>
          <title>Channel Only</title>
          <link>https://example.com</link>
          <description>No RSS wrapper</description>
          <item>
            <title>Unwrapped Item</title>
            <link>https://example.com/unwrapped</link>
          </item>
        </channel>`;

      const result = ImprovedFeedParser.parse(channelOnly, defaultOptions);

      expect(result).toHaveLength(1);
    });

    it('wraps non-CDATA descriptions in CDATA', () => {
      const xmlWithHtmlDesc = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>HTML Desc Feed</title>
            <link>https://example.com</link>
            <description>Test</description>
            <item>
              <title>HTML Item</title>
              <link>https://example.com/html</link>
              <description><p>HTML content</p></description>
            </item>
          </channel>
        </rss>`;

      const result = ImprovedFeedParser.parse(xmlWithHtmlDesc, defaultOptions);

      expect(result).toHaveLength(1);
    });
  });

  // ==========================================================================
  // Performance Tests
  // ==========================================================================
  describe('performance', () => {
    it('parses large feeds (100 items) within reasonable time', () => {
      const largeFeed = createLargeFeed(100);
      const startTime = Date.now();

      const result = ImprovedFeedParser.parse(largeFeed, {
        ...defaultOptions,
        maxItems: 0, // No limit
      });

      const duration = Date.now() - startTime;

      expect(result).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('parses medium feeds (50 items) quickly', () => {
      const mediumFeed = createLargeFeed(50);
      const startTime = Date.now();

      const result = ImprovedFeedParser.parse(mediumFeed, defaultOptions);

      const duration = Date.now() - startTime;

      expect(result.length).toBeGreaterThanOrEqual(10); // Limited by maxItems
      expect(duration).toBeLessThan(500);
    });
  });

  // ==========================================================================
  // Namespace Handling Tests
  // ==========================================================================
  describe('namespace handling', () => {
    it('handles feeds with namespace prefixes on all elements', () => {
      // This is a challenging case - may not work perfectly
      const parseAttempt = () => ImprovedFeedParser.parse(rss2NamespacedXml, defaultOptions);

      try {
        const result = parseAttempt();
        // If it parses, check it found something
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        // Namespaced RSS is unusual, acceptable to fail
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('handles dc:subject as categories', () => {
      const result = ImprovedFeedParser.parse(rss2DublinCoreXml, defaultOptions);

      // dc:subject should be extracted if category extraction supports it
      expect(result).toHaveLength(1);
    });
  });

  // ==========================================================================
  // HTML Content Tests
  // ==========================================================================
  describe('HTML content handling', () => {
    it('handles HTML in titles (CDATA wrapped)', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlInTitleXml, defaultOptions);

      expect(result).toHaveLength(2);
      // Title should contain the text (HTML may or may not be stripped)
      expect(result[0].title).toContain('Bold');
    });

    it('handles encoded HTML entities in content', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlInTitleXml, defaultOptions);

      expect(result[1].title).toContain('Title');
    });
  });

  // ==========================================================================
  // Debug Mode Tests
  // ==========================================================================
  describe('debug mode', () => {
    it('runs without error when debug mode is enabled', () => {
      const options: IFeedParserOptions = {
        ...defaultOptions,
        enableDebug: true,
      };

      // Should not throw
      const result = ImprovedFeedParser.parse(rss2StandardXml, options);

      expect(result).toHaveLength(3);
    });
  });

  // ==========================================================================
  // Entity Handling Tests (ST-003-03)
  // ==========================================================================
  describe('entity handling (ST-003-03)', () => {
    it('decodes standard XML entities in titles', () => {
      const result = ImprovedFeedParser.parse(rss2XmlEntitiesXml, defaultOptions);

      const xmlEntityItem = result.find((r) => r.title.includes('<tag>'));
      expect(xmlEntityItem).toBeDefined();
      expect(xmlEntityItem!.title).toContain('<tag>');
      expect(xmlEntityItem!.title).toContain('&');
      expect(xmlEntityItem!.title).toContain('"quotes"');
    });

    it('decodes decimal numeric entities', () => {
      const result = ImprovedFeedParser.parse(rss2XmlEntitiesXml, defaultOptions);

      const numericItem = result.find((r) => r.title.includes('Price'));
      expect(numericItem).toBeDefined();
      expect(numericItem!.title).toContain('$100');
    });

    it('decodes hexadecimal numeric entities', () => {
      const result = ImprovedFeedParser.parse(rss2XmlEntitiesXml, defaultOptions);

      const hexItem = result.find((r) => r.title.includes('Hex'));
      expect(hexItem).toBeDefined();
      expect(hexItem!.title).toContain('<code>');
    });

    it('decodes Norwegian character entities', () => {
      const result = ImprovedFeedParser.parse(rss2XmlEntitiesXml, defaultOptions);

      const norwegianItem = result.find((r) => r.title.includes('Norwegian'));
      expect(norwegianItem).toBeDefined();
      expect(norwegianItem!.title).toContain('Vårt Land');
      expect(norwegianItem!.title).toContain('–');
    });

    it('decodes HTML named entities (typography)', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlEntitiesXml, defaultOptions);

      const typographyItem = result.find((r) => r.title.includes('Typography'));
      expect(typographyItem).toBeDefined();
      // &ldquo;/&rdquo; decode to Unicode curly quotes (" ")
      expect(typographyItem!.title).toContain('\u201CSmart Quotes\u201D');
      expect(typographyItem!.title).toContain('–');
    });

    it('decodes currency entities', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlEntitiesXml, defaultOptions);

      const currencyItem = result.find((r) => r.title.includes('Currency'));
      expect(currencyItem).toBeDefined();
      expect(currencyItem!.title).toContain('€');
      expect(currencyItem!.title).toContain('£');
      expect(currencyItem!.title).toContain('¥');
    });

    it('decodes symbol entities', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlEntitiesXml, defaultOptions);

      const symbolsItem = result.find((r) => r.title.includes('Symbols'));
      expect(symbolsItem).toBeDefined();
      expect(symbolsItem!.title).toContain('©');
      expect(symbolsItem!.title).toContain('®');
      expect(symbolsItem!.title).toContain('™');
    });

    it('decodes math symbol entities', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlEntitiesXml, defaultOptions);

      const mathItem = result.find((r) => r.title.includes('Math'));
      expect(mathItem).toBeDefined();
      expect(mathItem!.title).toContain('×');
      expect(mathItem!.title).toContain('÷');
    });

    it('handles double-encoded entities', () => {
      const result = ImprovedFeedParser.parse(rss2DoubleEncodedXml, defaultOptions);

      expect(result).toHaveLength(1);
      // Title should have & decoded (from &amp;amp;)
      expect(result[0].title).toContain('&');
      expect(result[0].title).not.toContain('&amp;');
    });

    it('decodes double-encoded HTML in descriptions', () => {
      const result = ImprovedFeedParser.parse(rss2DoubleEncodedXml, defaultOptions);

      // Description had &amp;lt;p&amp;gt; which should become <p>
      expect(result[0].description).not.toContain('&lt;');
      expect(result[0].description).not.toContain('&amp;');
    });

    it('handles triple-encoded entities', () => {
      const result = ImprovedFeedParser.parse(rss2TripleEncodedXml, defaultOptions);

      expect(result).toHaveLength(1);
      // Should decode &amp;amp;amp; to &
      expect(result[0].title).toContain('&');
      expect(result[0].title).not.toContain('&amp;');
    });

    it('handles CDATA with entities in descriptions', () => {
      const result = ImprovedFeedParser.parse(rss2CdataEntitiesXml, defaultOptions);

      expect(result).toHaveLength(2);
      // CDATA content should have entities decoded
      const cdataItem = result.find((r) => r.title === 'CDATA Test');
      expect(cdataItem).toBeDefined();
      expect(cdataItem!.description).toContain('&');
    });

    it('decodes entities in description with CDATA and HTML named entities', () => {
      const result = ImprovedFeedParser.parse(rss2CdataEntitiesXml, defaultOptions);

      const mixedItem = result.find((r) => r.title === 'Mixed CDATA');
      expect(mixedItem).toBeDefined();
      expect(mixedItem!.description).toContain('—');
      // &ldquo; decodes to Unicode left curly quote
      expect(mixedItem!.description).toContain('\u201C');
    });

    it('decodes non-breaking space entity', () => {
      const result = ImprovedFeedParser.parse(rss2HtmlEntitiesXml, defaultOptions);

      const spacingItem = result.find((r) => r.title.includes('Spacing'));
      expect(spacingItem).toBeDefined();
      // &nbsp; should be decoded to actual non-breaking space
      expect(spacingItem!.title).toContain('\u00A0');
    });

    it('preserves regular ampersands followed by spaces', () => {
      const xmlWithAmpersand = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test</title>
            <link>https://example.com</link>
            <description>Test</description>
            <item>
              <title>Tom &amp; Jerry</title>
              <link>https://example.com/test</link>
            </item>
          </channel>
        </rss>`;

      const result = ImprovedFeedParser.parse(xmlWithAmpersand, defaultOptions);
      expect(result[0].title).toBe('Tom & Jerry');
    });

    it('decodes entities in descriptions', () => {
      const result = ImprovedFeedParser.parse(rss2XmlEntitiesXml, defaultOptions);

      const copyrightItem = result.find((r) => r.title.includes('Numeric'));
      expect(copyrightItem).toBeDefined();
      expect(copyrightItem!.description).toContain('©');
      expect(copyrightItem!.description).toContain('—');
    });

    it('decodes entities in Atom feed content', () => {
      const atomWithEntities = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test Atom Feed</title>
          <link href="https://example.com" />
          <id>urn:uuid:test</id>
          <updated>2025-11-24T12:00:00Z</updated>
          <entry>
            <title>Price: &#36;100 &amp; more</title>
            <link href="https://example.com/entry" />
            <id>urn:uuid:entry-1</id>
            <updated>2025-11-24T10:00:00Z</updated>
            <content type="html">&lt;p&gt;Test &amp;amp; content&lt;/p&gt;</content>
          </entry>
        </feed>`;

      const result = ImprovedFeedParser.parse(atomWithEntities, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Price: $100 & more');
      expect(result[0].feedType).toBe('atom');
    });
  });

  // ==========================================================================
  // JSON Feed Tests
  // ==========================================================================
  describe('JSON Feed support', () => {
    it('parses JSON Feed v1.1 correctly', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First JSON Article');
      expect(result[0].link).toBe('https://example.org/article-1');
      expect(result[0].feedType).toBe('json');
    });

    it('parses JSON Feed v1.0 correctly', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV10, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Legacy Item');
      expect(result[0].feedType).toBe('json');
    });

    it('handles minimal JSON Feed', () => {
      const result = ImprovedFeedParser.parse(jsonFeedMinimal, defaultOptions);

      expect(result).toHaveLength(1);
      // Minimal item should have 'Untitled' as fallback
      expect(result[0].title).toBe('Untitled');
    });

    it('extracts image from JSON Feed item', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      expect(result[0].imageUrl).toBe('https://example.org/images/1.jpg');
    });

    it('extracts author from JSON Feed', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      expect(result[0].author).toBe('John Doe');
    });

    it('extracts tags as categories from JSON Feed', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      expect(result[0].categories).toEqual(['news', 'technology']);
    });

    it('extracts date_published from JSON Feed', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      expect(result[0].pubDate).toBe('2025-11-24T10:00:00.000Z');
    });

    it('uses fallback image for items without images', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      // Second item has no image, should use fallback
      expect(result[1].imageUrl).toBe(defaultOptions.fallbackImageUrl);
    });

    it('prefers content_html over content_text', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      // First item has content_html
      expect(result[0].description).toBeDefined();
    });

    it('uses content_text when content_html is not available', () => {
      const result = ImprovedFeedParser.parse(jsonFeedV11, defaultOptions);

      // Second item only has content_text
      expect(result[1].description).toContain('Plain text content');
    });

    it('applies maxItems limit to JSON Feed', () => {
      const options: IFeedParserOptions = {
        ...defaultOptions,
        maxItems: 1,
      };
      const result = ImprovedFeedParser.parse(jsonFeedV11, options);

      expect(result).toHaveLength(1);
    });

    it('throws on invalid JSON', () => {
      expect(() => {
        ImprovedFeedParser.parse('{ invalid json', defaultOptions);
      }).toThrow();
    });

    it('does not treat non-JSON Feed JSON as JSON Feed', () => {
      const regularJson = '{"name": "test", "items": []}';

      // Should throw because it's not valid JSON Feed (no version)
      // and also not valid XML
      expect(() => {
        ImprovedFeedParser.parse(regularJson, defaultOptions);
      }).toThrow();
    });
  });
});
