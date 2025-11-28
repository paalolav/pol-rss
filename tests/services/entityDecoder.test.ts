/**
 * Entity Decoder Tests
 *
 * Tests for XML/HTML entity decoding functionality.
 * Covers ST-003-03: XML entity handling
 *
 * Test categories:
 * - Standard XML entities (&lt;, &gt;, &amp;, &quot;, &apos;)
 * - Numeric entities (decimal and hexadecimal)
 * - HTML named entities
 * - Double-encoded entities
 * - Edge cases and error handling
 */

import {
  decodeEntities,
  decodeXmlText,
  decodeEntitiesInHtml,
  decodeNumericEntity,
  decodeNumericEntities,
  decodeXmlEntities,
  decodeHtmlEntities,
  hasDoubleEncodedEntities,
} from '../../src/webparts/polRssGallery/services/entityDecoder';

describe('entityDecoder', () => {
  // ==========================================================================
  // Standard XML Entities
  // ==========================================================================
  describe('XML entities', () => {
    it('decodes &lt; to <', () => {
      expect(decodeXmlEntities('&lt;')).toBe('<');
    });

    it('decodes &gt; to >', () => {
      expect(decodeXmlEntities('&gt;')).toBe('>');
    });

    it('decodes &amp; to &', () => {
      expect(decodeXmlEntities('&amp;')).toBe('&');
    });

    it('decodes &quot; to "', () => {
      expect(decodeXmlEntities('&quot;')).toBe('"');
    });

    it('decodes &apos; to \'', () => {
      expect(decodeXmlEntities('&apos;')).toBe("'");
    });

    it('decodes multiple XML entities in a string', () => {
      expect(decodeXmlEntities('&lt;p&gt;Hello &amp; goodbye&lt;/p&gt;')).toBe(
        '<p>Hello & goodbye</p>'
      );
    });

    it('preserves text without entities', () => {
      expect(decodeXmlEntities('Hello World')).toBe('Hello World');
    });

    it('handles empty string', () => {
      expect(decodeXmlEntities('')).toBe('');
    });
  });

  // ==========================================================================
  // Numeric Entities (Decimal)
  // ==========================================================================
  describe('decimal numeric entities', () => {
    it('decodes &#60; to <', () => {
      expect(decodeNumericEntity('&#60;')).toBe('<');
    });

    it('decodes &#62; to >', () => {
      expect(decodeNumericEntity('&#62;')).toBe('>');
    });

    it('decodes &#38; to &', () => {
      expect(decodeNumericEntity('&#38;')).toBe('&');
    });

    it('decodes &#36; to $', () => {
      expect(decodeNumericEntity('&#36;')).toBe('$');
    });

    it('decodes &#169; to ©', () => {
      expect(decodeNumericEntity('&#169;')).toBe('©');
    });

    it('decodes Unicode code points like &#8212; (em dash)', () => {
      expect(decodeNumericEntity('&#8212;')).toBe('—');
    });

    it('decodes high Unicode code points (emoji)', () => {
      expect(decodeNumericEntity('&#128512;')).toBe('😀');
    });

    it('returns original for invalid decimal entities', () => {
      expect(decodeNumericEntity('&#abc;')).toBe('&#abc;');
    });

    it('returns original for out-of-range code points', () => {
      expect(decodeNumericEntity('&#999999999;')).toBe('&#999999999;');
    });
  });

  // ==========================================================================
  // Numeric Entities (Hexadecimal)
  // ==========================================================================
  describe('hexadecimal numeric entities', () => {
    it('decodes &#x3C; to <', () => {
      expect(decodeNumericEntity('&#x3C;')).toBe('<');
    });

    it('decodes &#x3E; to >', () => {
      expect(decodeNumericEntity('&#x3E;')).toBe('>');
    });

    it('decodes &#x26; to &', () => {
      expect(decodeNumericEntity('&#x26;')).toBe('&');
    });

    it('decodes &#x24; to $', () => {
      expect(decodeNumericEntity('&#x24;')).toBe('$');
    });

    it('handles uppercase hex (&#xA9;)', () => {
      expect(decodeNumericEntity('&#xA9;')).toBe('©');
    });

    it('handles lowercase hex (&#xa9;)', () => {
      expect(decodeNumericEntity('&#xa9;')).toBe('©');
    });

    it('handles mixed case hex (&#xaB;)', () => {
      expect(decodeNumericEntity('&#xaB;')).toBe('«');
    });

    it('decodes emoji via hex (&#x1F600;)', () => {
      expect(decodeNumericEntity('&#x1F600;')).toBe('😀');
    });

    it('returns original for invalid hex entities', () => {
      expect(decodeNumericEntity('&#xGHI;')).toBe('&#xGHI;');
    });
  });

  // ==========================================================================
  // Numeric Entities in Strings
  // ==========================================================================
  describe('decodeNumericEntities (full string)', () => {
    it('decodes multiple numeric entities in a string', () => {
      expect(decodeNumericEntities('Price: &#36;100 &#8212; Save &#36;20')).toBe(
        'Price: $100 — Save $20'
      );
    });

    it('decodes mixed decimal and hex entities', () => {
      expect(decodeNumericEntities('&#60;p&#x3E;Hello&#60;/p&#x3E;')).toBe('<p>Hello</p>');
    });

    it('preserves text without numeric entities', () => {
      expect(decodeNumericEntities('Hello World')).toBe('Hello World');
    });

    it('handles string with only numeric entities', () => {
      expect(decodeNumericEntities('&#72;&#101;&#108;&#108;&#111;')).toBe('Hello');
    });
  });

  // ==========================================================================
  // HTML Named Entities
  // ==========================================================================
  describe('HTML entities', () => {
    it('decodes &nbsp; to non-breaking space', () => {
      expect(decodeHtmlEntities('Hello&nbsp;World')).toBe('Hello\u00A0World');
    });

    it('decodes &mdash; to em dash', () => {
      expect(decodeHtmlEntities('&mdash;')).toBe('—');
    });

    it('decodes &ndash; to en dash', () => {
      expect(decodeHtmlEntities('&ndash;')).toBe('–');
    });

    it('decodes &hellip; to ellipsis', () => {
      expect(decodeHtmlEntities('&hellip;')).toBe('…');
    });

    it('decodes &copy; to ©', () => {
      expect(decodeHtmlEntities('&copy;')).toBe('©');
    });

    it('decodes &reg; to ®', () => {
      expect(decodeHtmlEntities('&reg;')).toBe('®');
    });

    it('decodes &trade; to ™', () => {
      expect(decodeHtmlEntities('&trade;')).toBe('™');
    });

    it('decodes &euro; to €', () => {
      expect(decodeHtmlEntities('&euro;')).toBe('€');
    });

    it('decodes &pound; to £', () => {
      expect(decodeHtmlEntities('&pound;')).toBe('£');
    });

    it('decodes quotation marks (smart quotes)', () => {
      expect(decodeHtmlEntities('&ldquo;Hello&rdquo;')).toBe('\u201CHello\u201D');
      expect(decodeHtmlEntities('&lsquo;Hello&rsquo;')).toBe('\u2018Hello\u2019');
    });

    it('decodes Norwegian characters', () => {
      expect(decodeHtmlEntities('&Aring;&aring;&AElig;&aelig;&Oslash;&oslash;')).toBe(
        'ÅåÆæØø'
      );
    });

    it('decodes German characters', () => {
      expect(decodeHtmlEntities('&Auml;&auml;&Ouml;&ouml;&Uuml;&uuml;&szlig;')).toBe(
        'ÄäÖöÜüß'
      );
    });

    it('decodes fractions', () => {
      expect(decodeHtmlEntities('&frac14; &frac12; &frac34;')).toBe('¼ ½ ¾');
    });

    it('decodes math symbols', () => {
      expect(decodeHtmlEntities('2 &times; 3 &divide; 2 &plusmn; 1')).toBe(
        '2 × 3 ÷ 2 ± 1'
      );
    });
  });

  // ==========================================================================
  // Double-Encoded Entities
  // ==========================================================================
  describe('double-encoded entities', () => {
    it('detects double-encoded entities', () => {
      expect(hasDoubleEncodedEntities('&amp;lt;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;gt;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;amp;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;quot;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;apos;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;#60;')).toBe(true);
      expect(hasDoubleEncodedEntities('&amp;#x3C;')).toBe(true);
    });

    it('returns false for non-double-encoded entities', () => {
      expect(hasDoubleEncodedEntities('&lt;')).toBe(false);
      expect(hasDoubleEncodedEntities('Hello World')).toBe(false);
      expect(hasDoubleEncodedEntities('&amp; alone')).toBe(false);
    });

    it('decodes &amp;lt; to <', () => {
      expect(decodeEntities('&amp;lt;')).toBe('<');
    });

    it('decodes &amp;gt; to >', () => {
      expect(decodeEntities('&amp;gt;')).toBe('>');
    });

    it('decodes &amp;amp; to &', () => {
      expect(decodeEntities('&amp;amp;')).toBe('&');
    });

    it('decodes double-encoded HTML content', () => {
      expect(decodeEntities('&amp;lt;p&amp;gt;Hello&amp;lt;/p&amp;gt;')).toBe(
        '<p>Hello</p>'
      );
    });

    it('decodes double-encoded numeric entities', () => {
      expect(decodeEntities('&amp;#60;')).toBe('<');
      expect(decodeEntities('&amp;#x3C;')).toBe('<');
    });

    it('handles triple-encoded entities', () => {
      // &amp;amp;lt; -> &amp;lt; -> &lt; -> <
      expect(decodeEntities('&amp;amp;lt;')).toBe('<');
    });

    it('respects maxDoubleEncodingIterations option', () => {
      // Only do 1 iteration, so &amp;amp;lt; -> &amp;lt; (stops after first pass)
      const result = decodeEntities('&amp;amp;lt;', { maxDoubleEncodingIterations: 1 });
      expect(result).toBe('&amp;lt;');
    });

    it('handles mixed encoding levels', () => {
      expect(decodeEntities('Hello &amp;amp; World')).toBe('Hello & World');
    });
  });

  // ==========================================================================
  // Combined Decoding (decodeEntities)
  // ==========================================================================
  describe('decodeEntities (combined)', () => {
    it('decodes mixed entity types', () => {
      expect(decodeEntities('&lt;p&gt;Price: &#36;100 &mdash; Save!&lt;/p&gt;')).toBe(
        '<p>Price: $100 — Save!</p>'
      );
    });

    it('handles complex real-world content', () => {
      const input = 'Article by John &amp; Jane &mdash; &copy; 2025';
      expect(decodeEntities(input)).toBe('Article by John & Jane — © 2025');
    });

    it('handles Norwegian text with entities', () => {
      const input = '&Aring;rets beste artikkel &ndash; fra V&aring;rt Land';
      expect(decodeEntities(input)).toBe('Årets beste artikkel – fra Vårt Land');
    });

    it('handles empty and null-ish values', () => {
      expect(decodeEntities('')).toBe('');
      expect(decodeEntities(null as unknown as string)).toBe(null);
      expect(decodeEntities(undefined as unknown as string)).toBe(undefined);
    });

    it('can disable XML entity decoding', () => {
      const result = decodeEntities('&lt;p&gt;', { decodeXmlEntities: false });
      expect(result).toBe('&lt;p&gt;');
    });

    it('can disable numeric entity decoding', () => {
      const result = decodeEntities('&#60;', { decodeNumericEntities: false });
      expect(result).toBe('&#60;');
    });

    it('can disable HTML entity decoding', () => {
      const result = decodeEntities('&nbsp;', { decodeHtmlEntities: false });
      expect(result).toBe('&nbsp;');
    });

    it('can disable double-encoding fix', () => {
      const result = decodeEntities('&amp;lt;', { fixDoubleEncoding: false });
      expect(result).toBe('&lt;');
    });
  });

  // ==========================================================================
  // decodeXmlText (primary text decoder)
  // ==========================================================================
  describe('decodeXmlText', () => {
    it('decodes all entity types for plain text', () => {
      expect(decodeXmlText('Hello &amp; World')).toBe('Hello & World');
    });

    it('decodes double-encoded content', () => {
      expect(decodeXmlText('Title: &amp;quot;News&amp;quot;')).toBe('Title: "News"');
    });

    it('handles Norwegian RSS feed titles', () => {
      expect(decodeXmlText('V&aring;rt Land &ndash; Nyheter')).toBe('Vårt Land – Nyheter');
    });

    it('handles empty input', () => {
      expect(decodeXmlText('')).toBe('');
    });
  });

  // ==========================================================================
  // decodeEntitiesInHtml (HTML content decoder)
  // ==========================================================================
  describe('decodeEntitiesInHtml', () => {
    it('decodes entities in HTML content', () => {
      const html = '<p>Hello&nbsp;World &amp; Everyone</p>';
      expect(decodeEntitiesInHtml(html)).toBe('<p>Hello\u00A0World & Everyone</p>');
    });

    it('fixes double-encoded HTML', () => {
      const html = '&amp;lt;p&amp;gt;Text&amp;lt;/p&amp;gt;';
      expect(decodeEntitiesInHtml(html)).toBe('<p>Text</p>');
    });

    it('preserves HTML structure while decoding entities', () => {
      const html = '<a href="link">Click &amp; Go</a>';
      expect(decodeEntitiesInHtml(html)).toBe('<a href="link">Click & Go</a>');
    });

    it('handles complex HTML with multiple entity types', () => {
      const html = '<p>&ldquo;Hello&rdquo; &mdash; Price: &#36;100</p>';
      // Note: &ldquo;/&rdquo; decode to Unicode curly quotes, not ASCII quotes
      expect(decodeEntitiesInHtml(html)).toBe('<p>\u201CHello\u201D — Price: $100</p>');
    });

    it('handles empty input', () => {
      expect(decodeEntitiesInHtml('')).toBe('');
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================
  describe('edge cases', () => {
    it('handles malformed entities (missing semicolon)', () => {
      // Should not decode incomplete entities
      expect(decodeEntities('&lt')).toBe('&lt');
    });

    it('handles unknown named entities', () => {
      // Unknown entities should be preserved
      expect(decodeEntities('&unknown;')).toBe('&unknown;');
    });

    it('handles partial numeric entities', () => {
      expect(decodeEntities('&#')).toBe('&#');
      expect(decodeEntities('&#;')).toBe('&#;');
    });

    it('handles very long strings', () => {
      const longString = '&lt;p&gt;'.repeat(1000);
      const expected = '<p>'.repeat(1000);
      expect(decodeEntities(longString)).toBe(expected);
    });

    it('handles strings with only entities', () => {
      expect(decodeEntities('&lt;&gt;&amp;&quot;&apos;')).toBe('<>&"\'');
    });

    it('handles consecutive entities without separators', () => {
      expect(decodeEntities('&lt;&lt;&lt;')).toBe('<<<');
    });

    it('preserves valid ampersands followed by space', () => {
      expect(decodeEntities('Tom & Jerry')).toBe('Tom & Jerry');
    });

    it('handles control character entities (should be filtered)', () => {
      // Control characters (except tab, newline, CR) should be returned as-is
      expect(decodeNumericEntity('&#0;')).toBe('&#0;');
      expect(decodeNumericEntity('&#1;')).toBe('&#1;');
      // Tab, newline, CR should decode
      expect(decodeNumericEntity('&#9;')).toBe('\t');
      expect(decodeNumericEntity('&#10;')).toBe('\n');
      expect(decodeNumericEntity('&#13;')).toBe('\r');
    });

    it('handles surrogate pair entities (should be rejected)', () => {
      // Surrogate pairs are invalid in XML
      expect(decodeNumericEntity('&#55296;')).toBe('&#55296;'); // 0xD800
      expect(decodeNumericEntity('&#57343;')).toBe('&#57343;'); // 0xDFFF
    });
  });

  // ==========================================================================
  // Real-World Feed Content Examples
  // ==========================================================================
  describe('real-world feed content', () => {
    it('handles NRK-style titles', () => {
      const title = 'Slik &oslash;nsker de &aring; l&oslash;se krisen';
      expect(decodeXmlText(title)).toBe('Slik ønsker de å løse krisen');
    });

    it('handles BBC-style descriptions', () => {
      const desc = 'The Prime Minister says &ldquo;we must act now&rdquo; &ndash; but opposition leaders disagree.';
      // Note: &ldquo;/&rdquo; decode to Unicode curly quotes
      expect(decodeXmlText(desc)).toBe('The Prime Minister says \u201Cwe must act now\u201D – but opposition leaders disagree.');
    });

    it('handles typical RSS CDATA content entities', () => {
      const content = '&lt;img src=&quot;image.jpg&quot;&gt; Article text here &amp; more content.';
      expect(decodeEntities(content)).toBe('<img src="image.jpg"> Article text here & more content.');
    });

    it('handles double-encoded feed content (common proxy issue)', () => {
      const doubleEncoded = 'Breaking: Storm &amp;quot;Maria&amp;quot; hits coast &amp;mdash; 5 injured';
      expect(decodeEntities(doubleEncoded)).toBe('Breaking: Storm "Maria" hits coast — 5 injured');
    });

    it('handles price formatting with currency entities', () => {
      const price = 'Sale: Was &#163;100, now &#163;79.99 &ndash; save &#163;20!';
      expect(decodeEntities(price)).toBe('Sale: Was £100, now £79.99 – save £20!');
    });
  });
});
