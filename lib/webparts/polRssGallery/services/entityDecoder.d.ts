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
/**
 * Decode a numeric entity to its character equivalent
 *
 * @param entity - The numeric entity (e.g., "&#60;" or "&#x3C;")
 * @returns The decoded character, or the original entity if invalid
 */
export declare function decodeNumericEntity(entity: string): string;
/**
 * Check if a string contains double-encoded entities
 *
 * @param text - Text to check
 * @returns True if double-encoded entities are detected
 */
export declare function hasDoubleEncodedEntities(text: string): boolean;
/**
 * Decode all numeric entities in a string
 *
 * @param text - Text containing numeric entities
 * @returns Text with numeric entities decoded
 */
export declare function decodeNumericEntities(text: string): string;
/**
 * Decode XML entities in a string
 *
 * @param text - Text containing XML entities
 * @returns Text with XML entities decoded
 */
export declare function decodeXmlEntities(text: string): string;
/**
 * Decode HTML entities in a string
 *
 * @param text - Text containing HTML entities
 * @returns Text with HTML entities decoded
 */
export declare function decodeHtmlEntities(text: string): string;
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
export declare function decodeEntities(text: string, options?: EntityDecoderOptions): string;
/**
 * Decode entities while preserving HTML structure
 *
 * This is useful for content that should remain as HTML but has
 * encoded entities in text nodes or attribute values.
 *
 * @param html - HTML string with entities
 * @returns HTML with entities decoded
 */
export declare function decodeEntitiesInHtml(html: string): string;
/**
 * Safely decode text content from XML elements
 *
 * This handles the common case where text extracted from XML
 * may contain various entity encodings.
 *
 * @param text - Text content from XML element
 * @returns Decoded text
 */
export declare function decodeXmlText(text: string): string;
declare const _default: {
    decodeEntities: typeof decodeEntities;
    decodeXmlText: typeof decodeXmlText;
    decodeEntitiesInHtml: typeof decodeEntitiesInHtml;
    decodeNumericEntity: typeof decodeNumericEntity;
    decodeNumericEntities: typeof decodeNumericEntities;
    decodeXmlEntities: typeof decodeXmlEntities;
    decodeHtmlEntities: typeof decodeHtmlEntities;
    hasDoubleEncodedEntities: typeof hasDoubleEncodedEntities;
};
export default _default;
//# sourceMappingURL=entityDecoder.d.ts.map