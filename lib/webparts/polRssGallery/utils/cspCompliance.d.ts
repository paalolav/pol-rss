/**
 * CSP (Content Security Policy) Compliance Utilities
 *
 * Ensures all content rendering is compatible with SharePoint's Content Security Policy.
 * Validates content for dangerous patterns and provides safe URL/content validation.
 *
 * @see REF-012-SECURITY-HARDENING.md ST-012-02
 */
/**
 * CSP Compliance validation utilities
 */
export declare const CspCompliance: {
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
    hasDangerousContent(content: string): boolean;
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
    isSafeUrl(url: string): boolean;
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
    isSafeImageUrl(url: string): boolean;
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
    isValidClassName(className: string): boolean;
    /**
     * Sanitizes a list of CSS class names
     *
     * @param classNames Space-separated class names
     * @returns Sanitized class names string
     */
    sanitizeClassNames(classNames: string): string;
    /**
     * Validates inline style values (if they must be used)
     * Prefer CSS classes when possible.
     *
     * @param styleValue The style value to check
     * @returns True if the style value is safe
     */
    isSafeStyleValue(styleValue: string): boolean;
    /**
     * Creates a safe style object for React components
     * Only allows whitelisted CSS properties.
     *
     * @param styles Object with style properties
     * @returns Safe style object
     */
    createSafeStyles(styles: Record<string, string | number>): React.CSSProperties;
};
export default CspCompliance;
//# sourceMappingURL=cspCompliance.d.ts.map