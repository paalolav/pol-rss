/**
 * XML and HTML Entity Decoder
 *
 * Handles decoding of various entity types found in RSS/Atom feeds:
 * - Standard XML entities (&lt;, &gt;, &amp;, &quot;, &apos;)
 * - Numeric entities (&#60;, &#x3C;)
 * - Common HTML entities (&nbsp;, &mdash;, etc.)
 * - Double-encoded entities (&amp;lt; → <)
 *
 * @module entityDecoder
 * @see REF-003-FEED-PARSER (ST-003-03)
 */

/**
 * Standard XML entities mapping
 */
const XML_ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
};

/**
 * Common HTML entities mapping
 * Only includes entities commonly found in RSS feeds to keep the bundle small
 */
const HTML_ENTITIES: Record<string, string> = {
  // Whitespace and special
  '&nbsp;': '\u00A0', // Non-breaking space
  '&ensp;': '\u2002', // En space
  '&emsp;': '\u2003', // Em space
  '&thinsp;': '\u2009', // Thin space

  // Punctuation and typography
  '&mdash;': '—', // Em dash
  '&ndash;': '–', // En dash
  '&minus;': '−', // Minus sign
  '&hellip;': '…', // Horizontal ellipsis
  '&bull;': '•', // Bullet
  '&middot;': '·', // Middle dot
  '&lsquo;': '\u2018', // Left single quote (')
  '&rsquo;': '\u2019', // Right single quote (')
  '&ldquo;': '\u201C', // Left double quote (")
  '&rdquo;': '\u201D', // Right double quote (")
  '&laquo;': '«', // Left-pointing double angle quote
  '&raquo;': '»', // Right-pointing double angle quote
  '&prime;': '′', // Prime
  '&Prime;': '″', // Double prime

  // Currency
  '&cent;': '¢',
  '&pound;': '£',
  '&euro;': '€',
  '&yen;': '¥',
  '&curren;': '¤',

  // Math and symbols
  '&times;': '×',
  '&divide;': '÷',
  '&plusmn;': '±',
  '&deg;': '°',
  '&sup1;': '¹',
  '&sup2;': '²',
  '&sup3;': '³',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&permil;': '‰',

  // Accented characters (common in Norwegian/European feeds)
  '&Aring;': 'Å',
  '&aring;': 'å',
  '&AElig;': 'Æ',
  '&aelig;': 'æ',
  '&Oslash;': 'Ø',
  '&oslash;': 'ø',
  '&Auml;': 'Ä',
  '&auml;': 'ä',
  '&Ouml;': 'Ö',
  '&ouml;': 'ö',
  '&Uuml;': 'Ü',
  '&uuml;': 'ü',
  '&szlig;': 'ß',
  '&ntilde;': 'ñ',
  '&Ntilde;': 'Ñ',
  '&ccedil;': 'ç',
  '&Ccedil;': 'Ç',
  '&Eacute;': 'É',
  '&eacute;': 'é',
  '&Egrave;': 'È',
  '&egrave;': 'è',
  '&Agrave;': 'À',
  '&agrave;': 'à',
  '&Aacute;': 'Á',
  '&aacute;': 'á',
  '&Oacute;': 'Ó',
  '&oacute;': 'ó',

  // Misc
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&sect;': '§',
  '&para;': '¶',
  '&dagger;': '†',
  '&Dagger;': '‡',
};

/**
 * Options for entity decoding
 */
export interface EntityDecoderOptions {
  /** Decode standard XML entities (default: true) */
  decodeXmlEntities?: boolean;
  /** Decode numeric entities like &#60; (default: true) */
  decodeNumericEntities?: boolean;
  /** Decode HTML entities like &nbsp; (default: true) */
  decodeHtmlEntities?: boolean;
  /** Detect and fix double-encoded entities (default: true) */
  fixDoubleEncoding?: boolean;
  /** Maximum iterations for double-encoding fix (default: 3) */
  maxDoubleEncodingIterations?: number;
}

const DEFAULT_OPTIONS: Required<EntityDecoderOptions> = {
  decodeXmlEntities: true,
  decodeNumericEntities: true,
  decodeHtmlEntities: true,
  fixDoubleEncoding: true,
  maxDoubleEncodingIterations: 3,
};

/**
 * Decode a numeric entity to its character equivalent
 *
 * @param entity - The numeric entity (e.g., "&#60;" or "&#x3C;")
 * @returns The decoded character, or the original entity if invalid
 */
export function decodeNumericEntity(entity: string): string {
  const match = entity.match(/^&#(x?)([0-9a-fA-F]+);$/);
  if (!match) {
    return entity;
  }

  const isHex = match[1] === 'x';
  const codePoint = parseInt(match[2], isHex ? 16 : 10);

  // Validate code point
  if (
    isNaN(codePoint) ||
    codePoint < 0 ||
    codePoint > 0x10ffff ||
    // Surrogate pairs are invalid in XML
    (codePoint >= 0xd800 && codePoint <= 0xdfff) ||
    // Control characters (except tab, newline, carriage return)
    (codePoint < 0x20 && codePoint !== 0x09 && codePoint !== 0x0a && codePoint !== 0x0d)
  ) {
    return entity; // Return original if invalid
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return entity;
  }
}

/**
 * Check if a string contains double-encoded entities
 *
 * @param text - Text to check
 * @returns True if double-encoded entities are detected
 */
export function hasDoubleEncodedEntities(text: string): boolean {
  // Check for patterns like &amp;lt; &amp;gt; &amp;amp; &amp;#60;
  return /&amp;(lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);/i.test(text);
}

/**
 * Decode all numeric entities in a string
 *
 * @param text - Text containing numeric entities
 * @returns Text with numeric entities decoded
 */
export function decodeNumericEntities(text: string): string {
  // Match both decimal (&#60;) and hex (&#x3C;) numeric entities
  return text.replace(/&#x?[0-9a-fA-F]+;/g, decodeNumericEntity);
}

/**
 * Decode XML entities in a string
 *
 * @param text - Text containing XML entities
 * @returns Text with XML entities decoded
 */
export function decodeXmlEntities(text: string): string {
  let result = text;
  for (const [entity, char] of Object.entries(XML_ENTITIES)) {
    result = result.split(entity).join(char);
  }
  return result;
}

/**
 * Decode HTML entities in a string
 *
 * @param text - Text containing HTML entities
 * @returns Text with HTML entities decoded
 */
export function decodeHtmlEntities(text: string): string {
  let result = text;
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    result = result.split(entity).join(char);
  }
  return result;
}

/**
 * Check if a string contains any encoded entities that need decoding
 *
 * @param text - Text to check
 * @returns True if entities are present
 */
function hasEncodedEntities(text: string): boolean {
  // Check for XML entities, numeric entities, or common HTML entities
  return /&(lt|gt|amp|quot|apos|nbsp|mdash|ndash|hellip|#\d+|#x[0-9a-fA-F]+);/i.test(text);
}

/**
 * Decode all entities in a string
 *
 * Handles XML, HTML, and numeric entities, including double-encoded content.
 * Uses iterative decoding to handle nested encoding levels.
 *
 * @param text - Text to decode
 * @param options - Decoding options
 * @returns Decoded text
 *
 * @example
 * ```typescript
 * // Standard entities
 * decodeEntities('&lt;p&gt;Hello&lt;/p&gt;')
 * // Returns: '<p>Hello</p>'
 *
 * // Numeric entities
 * decodeEntities('Price: &#36;100')
 * // Returns: 'Price: $100'
 *
 * // Double-encoded
 * decodeEntities('&amp;lt;p&amp;gt;Text&amp;lt;/p&amp;gt;')
 * // Returns: '<p>Text</p>'
 *
 * // HTML entities
 * decodeEntities('Hello&nbsp;World &mdash; News')
 * // Returns: 'Hello World — News'
 * ```
 */
export function decodeEntities(text: string, options: EntityDecoderOptions = {}): string {
  if (!text) {
    return text;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = text;
  let iterations = 0;

  // Iteratively decode until no more entities are found or max iterations reached
  do {
    const previousResult = result;

    // Decode in order: numeric first (can contain XML-like patterns),
    // then XML entities, then HTML entities
    if (opts.decodeNumericEntities) {
      result = decodeNumericEntities(result);
    }

    if (opts.decodeXmlEntities) {
      result = decodeXmlEntities(result);
    }

    if (opts.decodeHtmlEntities) {
      result = decodeHtmlEntities(result);
    }

    iterations++;

    // If nothing changed or we've hit max iterations, stop
    if (result === previousResult || iterations >= opts.maxDoubleEncodingIterations) {
      break;
    }

    // Continue if we're fixing double encoding and there are still entities
  } while (opts.fixDoubleEncoding && hasEncodedEntities(result));

  return result;
}

/**
 * Decode entities while preserving HTML structure
 *
 * This is useful for content that should remain as HTML but has
 * encoded entities in text nodes or attribute values.
 *
 * @param html - HTML string with entities
 * @returns HTML with entities decoded
 */
export function decodeEntitiesInHtml(html: string): string {
  if (!html) {
    return html;
  }

  // Use the standard decodeEntities with all options enabled
  // This handles double-encoded, XML, HTML, and numeric entities
  return decodeEntities(html, {
    decodeXmlEntities: true,
    decodeNumericEntities: true,
    decodeHtmlEntities: true,
    fixDoubleEncoding: true,
    maxDoubleEncodingIterations: 3,
  });
}

/**
 * Safely decode text content from XML elements
 *
 * This handles the common case where text extracted from XML
 * may contain various entity encodings.
 *
 * @param text - Text content from XML element
 * @returns Decoded text
 */
export function decodeXmlText(text: string): string {
  if (!text) {
    return text;
  }

  // Standard decode with all options enabled
  return decodeEntities(text, {
    decodeXmlEntities: true,
    decodeNumericEntities: true,
    decodeHtmlEntities: true,
    fixDoubleEncoding: true,
  });
}

export default {
  decodeEntities,
  decodeXmlText,
  decodeEntitiesInHtml,
  decodeNumericEntity,
  decodeNumericEntities,
  decodeXmlEntities,
  decodeHtmlEntities,
  hasDoubleEncodedEntities,
};
