/**
 * URL Validator Service
 *
 * Provides URL validation and SSRF (Server-Side Request Forgery) prevention.
 * All URLs must be validated before being sent to the proxy or fetched directly.
 *
 * @see REF-012-SECURITY-HARDENING.md ST-012-03
 */
/**
 * Result of URL validation
 */
export interface IUrlValidationResult {
    /** Whether the URL passed validation */
    isValid: boolean;
    /** Error message if validation failed */
    error?: string;
    /** The sanitized/normalized URL if valid */
    sanitizedUrl?: string;
    /** Warning messages (non-blocking issues) */
    warnings?: string[];
}
/**
 * URL Validator class
 *
 * Validates URLs to prevent SSRF attacks and ensure only safe URLs are fetched.
 */
export declare class UrlValidator {
    private allowedDomains;
    /**
     * Creates a new URL validator
     * @param allowedDomains Optional list of allowed domains (if set, only these domains are allowed)
     */
    constructor(allowedDomains?: string[]);
    /**
     * Validates a URL for general safety
     *
     * @param url The URL to validate
     * @returns Validation result with sanitized URL if valid
     *
     * @example
     * ```typescript
     * const validator = new UrlValidator();
     * validator.validate('https://example.com/feed.xml');
     * // { isValid: true, sanitizedUrl: 'https://example.com/feed.xml' }
     *
     * validator.validate('http://localhost/admin');
     * // { isValid: false, error: 'Internal addresses not allowed' }
     * ```
     */
    validate(url: string): IUrlValidationResult;
    /**
     * Validates a URL specifically for RSS feed fetching
     *
     * @param url The feed URL to validate
     * @returns Validation result
     */
    validateFeedUrl(url: string): IUrlValidationResult;
    /**
     * Checks if a hostname is a numeric IP address
     */
    private isNumericIp;
    /**
     * Validates an IP address for SSRF protection
     */
    private validateIpAddress;
    /**
     * Checks if a domain is in the allowlist
     */
    private isDomainInAllowlist;
    /**
     * Checks for suspicious patterns in URLs
     */
    private checkSuspiciousPatterns;
    /**
     * Static method to quickly validate a URL
     */
    static isValidUrl(url: string): boolean;
    /**
     * Static method to validate a feed URL
     */
    static isValidFeedUrl(url: string): boolean;
}
export declare const urlValidator: UrlValidator;
//# sourceMappingURL=urlValidator.d.ts.map