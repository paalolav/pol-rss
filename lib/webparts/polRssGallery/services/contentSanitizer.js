/**
 * Content Sanitizer Service
 *
 * Provides XSS protection for RSS feed content using DOMPurify.
 * All HTML content from external RSS feeds MUST be sanitized before rendering.
 *
 * @see REF-012-SECURITY-HARDENING.md for security requirements
 */
import DOMPurify from 'dompurify';
/**
 * Default allowed HTML tags - safe for RSS content display
 */
const DEFAULT_ALLOWED_TAGS = [
    // Text formatting
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Block elements
    'blockquote', 'pre', 'code', 'div',
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
];
/**
 * Default allowed attributes - safe for RSS content
 */
const DEFAULT_ALLOWED_ATTR = [
    'href', 'src', 'alt', 'title', 'width', 'height',
    'target', 'rel', 'class',
];
/**
 * Explicitly forbidden tags - never allow these even if configured
 */
const FORBIDDEN_TAGS = [
    'script', 'style', 'iframe', 'object', 'embed', 'form',
    'input', 'button', 'textarea', 'select', 'option',
    'meta', 'link', 'base', 'noscript', 'template',
];
/**
 * Explicitly forbidden attributes - event handlers and dangerous patterns
 */
const FORBIDDEN_ATTR = [
    // Event handlers
    'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout',
    'onmouseenter', 'onmouseleave', 'onfocus', 'onblur', 'onsubmit',
    'onchange', 'oninput', 'onkeydown', 'onkeyup', 'onkeypress',
    'ondblclick', 'oncontextmenu', 'onwheel', 'ondrag', 'ondrop',
    'onanimationstart', 'onanimationend', 'ontransitionend',
    // Dangerous attributes
    'formaction', 'action', 'method', 'srcdoc', 'xlink:href',
];
/**
 * Content Sanitizer class
 *
 * Provides methods to sanitize HTML content from RSS feeds to prevent XSS attacks.
 * Uses DOMPurify under the hood with strict configuration.
 */
export class ContentSanitizer {
    /**
     * Creates a new ContentSanitizer instance
     * @param config Optional configuration to customize sanitization behavior
     */
    constructor(config) {
        this.config = config || {};
    }
    /**
     * Gets a singleton instance of the sanitizer with default configuration
     */
    static getInstance() {
        if (!ContentSanitizer.instance) {
            ContentSanitizer.instance = new ContentSanitizer();
        }
        return ContentSanitizer.instance;
    }
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
    sanitize(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }
        const allowedTags = this.config.allowedTags || DEFAULT_ALLOWED_TAGS;
        const allowedAttr = this.config.allowedAttributes || DEFAULT_ALLOWED_ATTR;
        // Build URI safe list - only http and https by default
        const allowedUriSchemes = ['http', 'https', 'mailto'];
        if (this.config.allowDataUrls) {
            allowedUriSchemes.push('data');
        }
        // Configure DOMPurify
        const purifyConfig = {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: allowedAttr,
            ALLOW_DATA_ATTR: false,
            FORBID_TAGS: FORBIDDEN_TAGS,
            FORBID_ATTR: FORBIDDEN_ATTR,
            // Add target="_blank" and rel="noopener noreferrer" to links for security
            ADD_ATTR: ['target', 'rel'],
            // Only allow safe URI schemes
            ALLOWED_URI_REGEXP: new RegExp(`^(?:(?:${allowedUriSchemes.join('|')}):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))`, 'i'),
        };
        // Disable styles unless explicitly allowed (for CSP compliance)
        if (!this.config.allowStyles) {
            purifyConfig.FORBID_ATTR = [...FORBIDDEN_ATTR, 'style'];
        }
        // Sanitize the HTML
        let sanitized = DOMPurify.sanitize(html, purifyConfig);
        // Post-process: ensure all links open in new tab with noopener
        sanitized = this.secureLinks(sanitized);
        return sanitized;
    }
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
    sanitizeText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        // Escape HTML entities
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
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
    sanitizeUrl(url) {
        if (!url || typeof url !== 'string') {
            return '';
        }
        const trimmed = url.trim().toLowerCase();
        // Block dangerous protocols
        const dangerousProtocols = [
            'javascript:',
            'vbscript:',
            'data:text/html',
            'data:application/x-javascript',
        ];
        for (const protocol of dangerousProtocols) {
            if (trimmed.startsWith(protocol)) {
                return '';
            }
        }
        // Allow http, https, and relative URLs
        try {
            // Check if it's a valid URL
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
                const parsed = new URL(url, 'https://placeholder.com');
                if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                    return url;
                }
            }
            else if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
                // Relative URLs are allowed
                return url;
            }
            else if (!url.includes(':')) {
                // No protocol specified - treat as relative
                return url;
            }
        }
        catch (_a) {
            // Invalid URL
            return '';
        }
        return '';
    }
    /**
     * Ensures all anchor tags have secure attributes
     * @param html The HTML to process
     * @returns HTML with secured links
     */
    secureLinks(html) {
        if (!html)
            return '';
        // Add target="_blank" and rel="noopener noreferrer" to external links
        // This is done via regex for performance (DOMPurify already parsed)
        return html.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
            // Check if href exists and is external
            const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
            if (!hrefMatch)
                return match;
            const href = hrefMatch[1];
            const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
            if (!isExternal)
                return match;
            // Add target="_blank" if not present
            let newAttrs = attrs;
            if (!/target\s*=/i.test(attrs)) {
                newAttrs += ' target="_blank"';
            }
            // Add rel="noopener noreferrer" if not present
            if (!/rel\s*=/i.test(attrs)) {
                newAttrs += ' rel="noopener noreferrer"';
            }
            else {
                // Ensure noopener and noreferrer are in the rel attribute
                newAttrs = newAttrs.replace(/rel\s*=\s*["']([^"']*)["']/i, (_relMatch, relValue) => {
                    let newRel = relValue;
                    if (!relValue.includes('noopener')) {
                        newRel += ' noopener';
                    }
                    if (!relValue.includes('noreferrer')) {
                        newRel += ' noreferrer';
                    }
                    return `rel="${newRel.trim()}"`;
                });
            }
            return `<a ${newAttrs.trim()}>`;
        });
    }
    /**
     * Strips all HTML tags and returns plain text
     *
     * Use this when you need just the text content without any HTML.
     *
     * @param html The HTML to strip
     * @returns Plain text without any HTML tags
     */
    stripHtml(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        // First sanitize to remove dangerous content, then strip tags
        const sanitized = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
        // Decode HTML entities
        const textArea = document.createElement('textarea');
        textArea.innerHTML = sanitized;
        return textArea.value;
    }
}
ContentSanitizer.instance = null;
// Export a default instance for convenience
export const sanitizer = ContentSanitizer.getInstance();
//# sourceMappingURL=contentSanitizer.js.map