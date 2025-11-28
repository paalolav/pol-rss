/**
 * CSP (Content Security Policy) Compliance Utilities
 *
 * Ensures all content rendering is compatible with SharePoint's Content Security Policy.
 * Validates content for dangerous patterns and provides safe URL/content validation.
 *
 * @see REF-012-SECURITY-HARDENING.md ST-012-02
 */
/**
 * Patterns that could violate CSP or indicate dangerous content
 */
const DANGEROUS_PATTERNS = [
    // JavaScript protocol
    /javascript:/i,
    // VBScript protocol (legacy IE)
    /vbscript:/i,
    // Data URI with HTML/script content
    /data:text\/html/i,
    /data:application\/x-javascript/i,
    /data:application\/javascript/i,
    // Event handlers
    /on\w+\s*=/i,
    // Script tags
    /<script/i,
    // CSS expression (IE)
    /expression\s*\(/i,
    // CSS behavior (IE)
    /behavior\s*:/i,
    // CSS url() with javascript
    /url\s*\(\s*['"]?\s*javascript:/i,
    // CSS import
    /@import/i,
    // Base64 encoded scripts
    /data:\s*[^,]*base64[^,]*,.*<script/i,
];
/**
 * Allowed URL protocols for safe navigation
 */
const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
/**
 * Allowed protocols for image sources
 */
const SAFE_IMAGE_PROTOCOLS = ['http:', 'https:', 'data:image/'];
/**
 * CSP Compliance validation utilities
 */
export const CspCompliance = {
    /**
     * Checks if a string contains potentially dangerous patterns
     * that could violate CSP or pose security risks.
     *
     * @param content The content to check
     * @returns True if dangerous patterns are found
     *
     * @example
     * ```typescript
     * CspCompliance.hasDangerousContent('<script>alert(1)</script>'); // true
     * CspCompliance.hasDangerousContent('<p>Safe content</p>'); // false
     * ```
     */
    hasDangerousContent(content) {
        if (!content || typeof content !== 'string') {
            return false;
        }
        return DANGEROUS_PATTERNS.some((pattern) => pattern.test(content));
    },
    /**
     * Validates if a URL is safe for navigation (links, etc.)
     *
     * @param url The URL to validate
     * @returns True if the URL uses a safe protocol
     *
     * @example
     * ```typescript
     * CspCompliance.isSafeUrl('https://example.com'); // true
     * CspCompliance.isSafeUrl('javascript:alert(1)'); // false
     * ```
     */
    isSafeUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        const trimmed = url.trim().toLowerCase();
        // Empty URLs are not safe
        if (!trimmed) {
            return false;
        }
        // Relative URLs are considered safe
        if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
            return true;
        }
        // Protocol-relative URLs (//example.com)
        if (trimmed.startsWith('//')) {
            return true;
        }
        // Check for safe protocols
        try {
            const parsed = new URL(url, 'https://placeholder.local');
            return SAFE_PROTOCOLS.includes(parsed.protocol);
        }
        catch (_a) {
            // URLs without protocol that don't look dangerous
            if (!trimmed.includes(':')) {
                return true;
            }
            return false;
        }
    },
    /**
     * Validates if a URL is safe for use as an image source
     *
     * @param url The image URL to validate
     * @returns True if the URL is safe for images
     *
     * @example
     * ```typescript
     * CspCompliance.isSafeImageUrl('https://example.com/img.jpg'); // true
     * CspCompliance.isSafeImageUrl('data:image/png;base64,...'); // true
     * CspCompliance.isSafeImageUrl('data:text/html,...'); // false
     * ```
     */
    isSafeImageUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        const trimmed = url.trim().toLowerCase();
        // Check for safe image protocols
        for (const protocol of SAFE_IMAGE_PROTOCOLS) {
            if (trimmed.startsWith(protocol)) {
                return true;
            }
        }
        // Relative URLs are safe
        if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
            return true;
        }
        // Protocol-relative URLs
        if (trimmed.startsWith('//')) {
            return true;
        }
        // Reject data: URIs that aren't images
        if (trimmed.startsWith('data:') && !trimmed.startsWith('data:image/')) {
            return false;
        }
        // Check for dangerous patterns in data URIs
        if (trimmed.startsWith('data:image/') && this.hasDangerousContent(url)) {
            return false;
        }
        // URLs without protocol
        if (!trimmed.includes(':')) {
            return true;
        }
        return false;
    },
    /**
     * Validates CSS class names to prevent injection
     *
     * @param className The CSS class name to validate
     * @returns True if the class name is valid
     *
     * @example
     * ```typescript
     * CspCompliance.isValidClassName('myClass'); // true
     * CspCompliance.isValidClassName('my-class_123'); // true
     * CspCompliance.isValidClassName('<script>'); // false
     * ```
     */
    isValidClassName(className) {
        if (!className || typeof className !== 'string') {
            return false;
        }
        // CSS class names: letters, numbers, hyphens, underscores
        // Must start with letter, underscore, or hyphen
        const validPattern = /^[a-zA-Z_-][a-zA-Z0-9_-]*$/;
        return validPattern.test(className.trim());
    },
    /**
     * Sanitizes a list of CSS class names
     *
     * @param classNames Space-separated class names
     * @returns Sanitized class names string
     */
    sanitizeClassNames(classNames) {
        if (!classNames || typeof classNames !== 'string') {
            return '';
        }
        return classNames
            .split(/\s+/)
            .filter((cls) => this.isValidClassName(cls))
            .join(' ');
    },
    /**
     * Validates inline style values (if they must be used)
     * Prefer CSS classes when possible.
     *
     * @param styleValue The style value to check
     * @returns True if the style value is safe
     */
    isSafeStyleValue(styleValue) {
        if (!styleValue || typeof styleValue !== 'string') {
            return false;
        }
        const dangerous = [
            /javascript:/i,
            /expression\s*\(/i,
            /behavior\s*:/i,
            /url\s*\(/i, // URLs in styles can be dangerous
            /@import/i,
            /\\[0-9a-f]/i, // Escaped characters
        ];
        return !dangerous.some((pattern) => pattern.test(styleValue));
    },
    /**
     * Creates a safe style object for React components
     * Only allows whitelisted CSS properties.
     *
     * @param styles Object with style properties
     * @returns Safe style object
     */
    createSafeStyles(styles) {
        const allowedProperties = new Set([
            'color',
            'backgroundColor',
            'fontSize',
            'fontWeight',
            'fontStyle',
            'textAlign',
            'textDecoration',
            'lineHeight',
            'letterSpacing',
            'margin',
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
            'padding',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'width',
            'height',
            'maxWidth',
            'maxHeight',
            'minWidth',
            'minHeight',
            'display',
            'flexDirection',
            'justifyContent',
            'alignItems',
            'gap',
            'borderRadius',
            'opacity',
        ]);
        const safeStyles = {};
        for (const [key, value] of Object.entries(styles)) {
            if (allowedProperties.has(key)) {
                const stringValue = String(value);
                if (this.isSafeStyleValue(stringValue)) {
                    safeStyles[key] = value;
                }
            }
        }
        return safeStyles;
    },
};
export default CspCompliance;
//# sourceMappingURL=cspCompliance.js.map