/**
 * Cache Key Service
 *
 * Generates consistent, deterministic cache keys for RSS feeds.
 * Keys are normalized to handle URL variations and include relevant parameters.
 */
/**
 * Parameters that affect the cache key
 */
export interface CacheKeyParams {
    /** The feed URL (required) */
    feedUrl: string;
    /** Maximum number of items to fetch */
    maxItems?: number;
    /** Filter keywords */
    filterKeywords?: string;
    /** Category filter */
    category?: string;
}
/**
 * Normalize a URL for consistent cache key generation
 *
 * - Lowercase protocol and hostname
 * - Sort query parameters
 * - Remove trailing slashes
 * - Remove default ports
 * - Remove fragments
 */
export declare function normalizeUrl(url: string): string;
/**
 * Simple hash function for strings
 * Uses djb2 algorithm - fast and good distribution
 */
export declare function hashString(str: string): string;
/**
 * Generate a deterministic cache key from parameters
 *
 * @param params - Parameters affecting the cache key
 * @returns A deterministic cache key string
 */
export declare function generateCacheKey(params: CacheKeyParams): string;
/**
 * Generate a human-readable key (for debugging)
 */
export declare function generateReadableKey(params: CacheKeyParams): string;
/**
 * Validate a cache key format
 */
export declare function isValidCacheKey(key: string): boolean;
/**
 * Parse URL from cache parameters if available
 */
export declare function extractUrlFromKey(params: CacheKeyParams): string;
/**
 * Cache key utilities for bulk operations
 */
export declare const CacheKeyUtils: {
    /**
     * Generate keys for multiple URLs
     */
    generateBulkKeys(urls: string[], commonParams?: Omit<CacheKeyParams, 'feedUrl'>): Map<string, string>;
    /**
     * Create a key pattern for invalidation (prefix matching)
     */
    createPattern(prefix: string): RegExp;
    /**
     * Normalize multiple URLs
     */
    normalizeUrls(urls: string[]): string[];
};
//# sourceMappingURL=cacheKeyService.d.ts.map