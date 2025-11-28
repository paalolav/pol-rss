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
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Lowercase protocol and hostname
    let normalized = `${parsed.protocol}//${parsed.hostname.toLowerCase()}`;

    // Add port only if non-default
    if (parsed.port && !isDefaultPort(parsed.protocol, parsed.port)) {
      normalized += `:${parsed.port}`;
    }

    // Add pathname, removing trailing slash unless it's the root
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    normalized += pathname;

    // Sort and add query parameters
    if (parsed.search) {
      const params = new URLSearchParams(parsed.search);
      const paramArray: Array<[string, string]> = [];
      params.forEach((value, key) => {
        paramArray.push([key, value]);
      });
      const sortedParams = paramArray
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      if (sortedParams) {
        normalized += `?${sortedParams}`;
      }
    }

    // Fragments are not included (they're client-side only)

    return normalized;
  } catch {
    // If URL parsing fails, return the original
    return url;
  }
}

/**
 * Check if a port is the default for a protocol
 */
function isDefaultPort(protocol: string, port: string): boolean {
  return (
    (protocol === 'http:' && port === '80') ||
    (protocol === 'https:' && port === '443')
  );
}

/**
 * Simple hash function for strings
 * Uses djb2 algorithm - fast and good distribution
 */
export function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32-bit integer and then to hex
  return (hash >>> 0).toString(16);
}

/**
 * Generate a deterministic cache key from parameters
 *
 * @param params - Parameters affecting the cache key
 * @returns A deterministic cache key string
 */
export function generateCacheKey(params: CacheKeyParams): string {
  const normalized = {
    url: normalizeUrl(params.feedUrl),
    max: params.maxItems ?? 'default',
    filter: params.filterKeywords?.toLowerCase().trim() || '',
    category: params.category?.toLowerCase().trim() || ''
  };

  // Create a stable string representation
  const keyString = JSON.stringify(normalized);

  // Generate hash for compact key
  const hash = hashString(keyString);

  // Return prefixed key for namespacing
  return `rss_${hash}`;
}

/**
 * Generate a human-readable key (for debugging)
 */
export function generateReadableKey(params: CacheKeyParams): string {
  const parts = [normalizeUrl(params.feedUrl)];

  if (params.maxItems) {
    parts.push(`max:${params.maxItems}`);
  }
  if (params.filterKeywords) {
    parts.push(`filter:${params.filterKeywords}`);
  }
  if (params.category) {
    parts.push(`cat:${params.category}`);
  }

  return parts.join('|');
}

/**
 * Validate a cache key format
 */
export function isValidCacheKey(key: string): boolean {
  return /^rss_[a-f0-9]+$/.test(key);
}

/**
 * Parse URL from cache parameters if available
 */
export function extractUrlFromKey(params: CacheKeyParams): string {
  return params.feedUrl;
}

/**
 * Cache key utilities for bulk operations
 */
export const CacheKeyUtils = {
  /**
   * Generate keys for multiple URLs
   */
  generateBulkKeys(urls: string[], commonParams?: Omit<CacheKeyParams, 'feedUrl'>): Map<string, string> {
    const keyMap = new Map<string, string>();
    for (const url of urls) {
      const key = generateCacheKey({ feedUrl: url, ...commonParams });
      keyMap.set(url, key);
    }
    return keyMap;
  },

  /**
   * Create a key pattern for invalidation (prefix matching)
   */
  createPattern(prefix: string): RegExp {
    return new RegExp(`^${prefix}`);
  },

  /**
   * Normalize multiple URLs
   */
  normalizeUrls(urls: string[]): string[] {
    return urls.map(normalizeUrl);
  }
};
