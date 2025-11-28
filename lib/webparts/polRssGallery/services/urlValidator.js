/**
 * URL Validator Service
 *
 * Provides URL validation and SSRF (Server-Side Request Forgery) prevention.
 * All URLs must be validated before being sent to the proxy or fetched directly.
 *
 * @see REF-012-SECURITY-HARDENING.md ST-012-03
 */
/**
 * Blocked hostname patterns for SSRF prevention
 */
const BLOCKED_HOSTNAME_PATTERNS = [
    // Localhost variants
    /^localhost$/i,
    /^localhost\./i,
    // IPv4 loopback
    /^127\./,
    // IPv4 private networks
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    // IPv4 link-local
    /^169\.254\./,
    // IPv4 null/broadcast
    /^0\./,
    /^255\.255\.255\.255$/,
    // IPv6 loopback
    /^\[?::1\]?$/,
    /^\[?0:0:0:0:0:0:0:1\]?$/,
    // IPv6 private (fc00::/7)
    /^\[?fc/i,
    /^\[?fd/i,
    // IPv6 link-local (fe80::/10)
    /^\[?fe[89ab]/i,
    // Cloud metadata endpoints
    /^metadata\.google\.internal$/i,
    /^metadata\.google$/i,
];
/**
 * Specific blocked hostnames
 */
const BLOCKED_HOSTNAMES = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    '169.254.169.254', // AWS/Azure metadata
    'metadata.google.internal', // GCP metadata
    'metadata', // GCP shorthand
]);
/**
 * URL Validator class
 *
 * Validates URLs to prevent SSRF attacks and ensure only safe URLs are fetched.
 */
export class UrlValidator {
    /**
     * Creates a new URL validator
     * @param allowedDomains Optional list of allowed domains (if set, only these domains are allowed)
     */
    constructor(allowedDomains) {
        this.allowedDomains = null;
        if (allowedDomains && allowedDomains.length > 0) {
            this.allowedDomains = new Set(allowedDomains.map((d) => d.toLowerCase()));
        }
    }
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
    validate(url) {
        const warnings = [];
        // Check for empty/null
        if (!url || typeof url !== 'string') {
            return { isValid: false, error: 'URL is required' };
        }
        const trimmedUrl = url.trim();
        // Check for empty after trim
        if (!trimmedUrl) {
            return { isValid: false, error: 'URL cannot be empty' };
        }
        // Parse URL
        let parsed;
        try {
            parsed = new URL(trimmedUrl);
        }
        catch (_a) {
            return { isValid: false, error: 'Invalid URL format' };
        }
        // Check protocol
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return {
                isValid: false,
                error: `Only HTTP(S) URLs allowed. Found: ${parsed.protocol}`,
            };
        }
        // Warn about HTTP (not HTTPS)
        if (parsed.protocol === 'http:') {
            warnings.push('HTTP URLs are less secure than HTTPS');
        }
        // Check hostname
        const hostname = parsed.hostname.toLowerCase();
        // Check against blocked hostnames
        if (BLOCKED_HOSTNAMES.has(hostname)) {
            return { isValid: false, error: 'Internal addresses not allowed' };
        }
        // Check against blocked patterns
        for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
            if (pattern.test(hostname)) {
                return { isValid: false, error: 'Internal addresses not allowed' };
            }
        }
        // Check for numeric IP addresses (additional scrutiny)
        if (this.isNumericIp(hostname)) {
            const ipCheck = this.validateIpAddress(hostname);
            if (!ipCheck.isValid) {
                return ipCheck;
            }
            warnings.push('Using IP address instead of hostname');
        }
        // Check allowed domains if configured
        if (this.allowedDomains) {
            const isDomainAllowed = this.isDomainInAllowlist(hostname);
            if (!isDomainAllowed) {
                return {
                    isValid: false,
                    error: 'Domain not in allowed list',
                };
            }
        }
        // Check for suspicious patterns in the URL
        const suspiciousCheck = this.checkSuspiciousPatterns(trimmedUrl);
        if (suspiciousCheck.warnings) {
            warnings.push(...suspiciousCheck.warnings);
        }
        return {
            isValid: true,
            sanitizedUrl: parsed.href,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    /**
     * Validates a URL specifically for RSS feed fetching
     *
     * @param url The feed URL to validate
     * @returns Validation result
     */
    validateFeedUrl(url) {
        const result = this.validate(url);
        if (!result.isValid) {
            return result;
        }
        const warnings = result.warnings || [];
        // Additional feed-specific checks
        try {
            const parsed = new URL(url);
            // Common feed paths/extensions
            const feedIndicators = [
                '/feed',
                '/rss',
                '/atom',
                '.xml',
                '.rss',
                '.atom',
                '/syndication',
            ];
            const hasIndicator = feedIndicators.some((indicator) => parsed.pathname.toLowerCase().includes(indicator) ||
                parsed.search.toLowerCase().includes(indicator));
            if (!hasIndicator) {
                warnings.push('URL does not appear to be a standard feed path');
            }
        }
        catch (_a) {
            // URL parsing already validated above
        }
        return {
            isValid: true,
            sanitizedUrl: result.sanitizedUrl,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    /**
     * Checks if a hostname is a numeric IP address
     */
    isNumericIp(hostname) {
        // IPv4
        if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            return true;
        }
        // IPv6 (with brackets)
        if (/^\[[\da-f:]+\]$/i.test(hostname)) {
            return true;
        }
        return false;
    }
    /**
     * Validates an IP address for SSRF protection
     */
    validateIpAddress(ip) {
        // Parse IPv4
        const ipv4Match = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
        if (ipv4Match) {
            const [, a, b, c, d] = ipv4Match.map(Number);
            // Validate each octet
            if ([a, b, c, d].some((n) => n > 255)) {
                return { isValid: false, error: 'Invalid IP address' };
            }
            // Check for private/reserved ranges
            if (a === 0 || // 0.0.0.0/8
                a === 10 || // 10.0.0.0/8
                a === 127 || // 127.0.0.0/8
                (a === 169 && b === 254) || // 169.254.0.0/16
                (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
                (a === 192 && b === 168) || // 192.168.0.0/16
                (a === 255 && b === 255 && c === 255 && d === 255) // Broadcast
            ) {
                return { isValid: false, error: 'Private/reserved IP addresses not allowed' };
            }
        }
        // IPv6 validation would go here if needed
        // For now, block all IPv6 for simplicity
        if (ip.includes(':')) {
            return { isValid: false, error: 'IPv6 addresses not allowed' };
        }
        return { isValid: true };
    }
    /**
     * Checks if a domain is in the allowlist
     */
    isDomainInAllowlist(hostname) {
        if (!this.allowedDomains) {
            return true;
        }
        // Check exact match
        if (this.allowedDomains.has(hostname)) {
            return true;
        }
        // Check if it's a subdomain of an allowed domain
        for (const allowed of this.allowedDomains) {
            if (allowed.startsWith('*.')) {
                // Wildcard domain
                const baseDomain = allowed.slice(2);
                if (hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)) {
                    return true;
                }
            }
            else if (hostname.endsWith(`.${allowed}`)) {
                // Subdomain of allowed domain
                return true;
            }
        }
        return false;
    }
    /**
     * Checks for suspicious patterns in URLs
     */
    checkSuspiciousPatterns(url) {
        const warnings = [];
        // URL encoding that might hide dangerous content
        if (/%00|%0[ad]/i.test(url)) {
            warnings.push('URL contains suspicious encoded characters');
        }
        // Multiple @ signs (possible auth confusion)
        if ((url.match(/@/g) || []).length > 1) {
            warnings.push('URL contains multiple @ characters');
        }
        // Backslashes (possible path confusion)
        if (url.includes('\\')) {
            warnings.push('URL contains backslashes');
        }
        // Very long URLs
        if (url.length > 2048) {
            warnings.push('URL is unusually long');
        }
        return { warnings };
    }
    /**
     * Static method to quickly validate a URL
     */
    static isValidUrl(url) {
        const validator = new UrlValidator();
        return validator.validate(url).isValid;
    }
    /**
     * Static method to validate a feed URL
     */
    static isValidFeedUrl(url) {
        const validator = new UrlValidator();
        return validator.validateFeedUrl(url).isValid;
    }
}
// Export a default instance for convenience
export const urlValidator = new UrlValidator();
//# sourceMappingURL=urlValidator.js.map