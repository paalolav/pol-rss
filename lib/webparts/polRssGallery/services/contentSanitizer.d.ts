/**
 * Configuration options for the sanitizer
 */
export interface ISanitizerConfig {
    /** Custom list of allowed HTML tags (uses defaults if not specified) */
    allowedTags?: string[];
    /** Custom list of allowed attributes (uses defaults if not specified) */
    allowedAttributes?: string[];
    /** Allow inline styles (default: false for CSP compliance) */
    allowStyles?: boolean;
    /** Allow data: URIs for images (default: false for security) */
    allowDataUrls?: boolean;
}
/**
 * Content Sanitizer class
 *
 * Provides methods to sanitize HTML content from RSS feeds to prevent XSS attacks.
 * Uses DOMPurify under the hood with strict configuration.
 */
export declare class ContentSanitizer {
    private config;
    private static instance;
    /**
     * Creates a new ContentSanitizer instance
     * @param config Optional configuration to customize sanitization behavior
     */
    constructor(config?: ISanitizerConfig);
    /**
     * Gets a singleton instance of the sanitizer with default configuration
     */
    static getInstance(): ContentSanitizer;
    /**
     * Sanitizes HTML content from RSS feeds
     *
     * Removes dangerous elements, event handlers, and javascript: URLs.
     * Preserves safe formatting tags and links.
     *
     * @param html The HTML string to sanitize
     * @returns Sanitized HTML string safe for rendering
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * const safeHtml = sanitizer.sanitize('<p onclick="alert(1)">Hello</p>');
     * // Returns: '<p>Hello</p>'
     * ```
     */
    sanitize(html: string): string;
    /**
     * Sanitizes plain text by escaping HTML entities
     *
     * Use this for content that should never contain HTML,
     * such as titles or metadata.
     *
     * @param text The plain text to escape
     * @returns HTML-escaped string
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * const safe = sanitizer.sanitizeText('<script>alert(1)</script>');
     * // Returns: '&lt;script&gt;alert(1)&lt;/script&gt;'
     * ```
     */
    sanitizeText(text: string): string;
    /**
     * Validates and sanitizes a URL
     *
     * Ensures URLs use safe protocols (http/https) and don't contain
     * javascript: or data: schemes that could be used for XSS.
     *
     * @param url The URL to validate
     * @returns The sanitized URL or empty string if invalid
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * sanitizer.sanitizeUrl('javascript:alert(1)'); // Returns: ''
     * sanitizer.sanitizeUrl('https://example.com'); // Returns: 'https://example.com'
     * ```
     */
    sanitizeUrl(url: string): string;
    /**
     * Ensures all anchor tags have secure attributes
     * @param html The HTML to process
     * @returns HTML with secured links
     */
    private secureLinks;
    /**
     * Strips all HTML tags and returns plain text
     *
     * Use this when you need just the text content without any HTML.
     *
     * @param html The HTML to strip
     * @returns Plain text without any HTML tags
     */
    stripHtml(text: string): string;
}
export declare const sanitizer: ContentSanitizer;
//# sourceMappingURL=contentSanitizer.d.ts.map