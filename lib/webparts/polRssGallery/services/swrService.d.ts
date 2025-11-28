/**
 * Stale-While-Revalidate (SWR) Service
 *
 * Provides intelligent feed fetching with:
 * - Instant return of cached data (stale or fresh)
 * - Background revalidation for stale data
 * - Force refresh for expired data
 * - Callbacks for data updates
 *
 * Flow:
 * 1. Request comes in for a feed URL
 * 2. Check cache state:
 *    - FRESH: Return cached data, no network request
 *    - STALE: Return cached data immediately, trigger background refresh
 *    - EXPIRED/MISSING: Wait for network request, return fresh data
 * 3. On revalidation success, notify via callback
 */
import { ParsedFeed } from './feedTypes';
import { CacheResult, CacheState } from './unifiedCacheService';
import { CacheKeyParams } from './cacheKeyService';
/**
 * SWR configuration options
 */
export interface SWRConfig {
    /** Time in ms before data is considered stale (default: 5 min) */
    freshTime: number;
    /** Time in ms for stale data that triggers background refresh (default: 30 min) */
    staleTime: number;
    /** Maximum age in ms before force refresh (default: 24 hours) */
    maxAge: number;
    /** Maximum concurrent background refreshes (default: 3) */
    maxConcurrentRefreshes: number;
    /** Dedupe interval - requests within this window use same promise (default: 2s) */
    dedupeInterval: number;
}
/**
 * Result returned by SWR fetch operations
 */
export interface SWRResult {
    /** The feed data */
    data: ParsedFeed | null;
    /** Whether the data is from cache */
    isFromCache: boolean;
    /** Whether a background refresh is in progress */
    isRevalidating: boolean;
    /** Cache state */
    cacheState: CacheState;
    /** Data age in milliseconds */
    age: number;
    /** Any error that occurred */
    error?: Error;
}
/**
 * Callback types for SWR events
 */
export type SWRRevalidateCallback = (key: string, newData: ParsedFeed) => void;
export type SWRErrorCallback = (key: string, error: Error) => void;
/**
 * Options for individual fetch operations
 */
export interface FetchOptions {
    /** Force a network request even if cache is fresh */
    forceRefresh?: boolean;
    /** Callback when revalidation completes */
    onRevalidate?: SWRRevalidateCallback;
    /** Callback when revalidation fails */
    onError?: SWRErrorCallback;
    /** Custom cache key params */
    keyParams?: Partial<CacheKeyParams>;
}
/**
 * Stale-While-Revalidate Service
 *
 * Provides intelligent caching with automatic background refresh.
 */
export declare class SWRService {
    private cache;
    private config;
    private inFlightRequests;
    private backgroundRefreshes;
    private initPromise;
    constructor(config?: Partial<SWRConfig>);
    /**
     * Initialize the SWR service
     */
    init(): Promise<void>;
    private _doInit;
    /**
     * Fetch a feed with SWR semantics
     *
     * @param feedUrl - The feed URL to fetch
     * @param fetcher - Function that fetches the feed from network
     * @param options - Optional configuration
     */
    fetch(feedUrl: string, fetcher: () => Promise<ParsedFeed>, options?: FetchOptions): Promise<SWRResult>;
    /**
     * Prefetch a feed into cache without returning the result
     */
    prefetch(feedUrl: string, fetcher: () => Promise<ParsedFeed>, keyParams?: Partial<CacheKeyParams>): Promise<void>;
    /**
     * Invalidate a cached feed, forcing next fetch to get fresh data
     */
    invalidate(feedUrl: string, keyParams?: Partial<CacheKeyParams>): Promise<void>;
    /**
     * Invalidate all cached feeds
     */
    invalidateAll(): Promise<void>;
    /**
     * Check if a feed is cached and get its state
     */
    getCacheState(feedUrl: string, keyParams?: Partial<CacheKeyParams>): Promise<CacheResult | null>;
    /**
     * Get the number of active background refreshes
     */
    getActiveRefreshCount(): number;
    /**
     * Check if a specific feed is currently being refreshed
     */
    isRefreshing(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean;
    /**
     * Update configuration
     */
    setConfig(config: Partial<SWRConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): SWRConfig;
    /**
     * Clean up resources
     */
    dispose(): void;
    private ensureInitialized;
    private getCacheKey;
    private getDeduplicatedRequest;
    private executeWithDeduplication;
    private doFreshFetch;
    private triggerBackgroundRefresh;
    private createErrorResult;
}
/**
 * Get the singleton SWR service instance
 */
export declare function getSWRService(): SWRService;
/**
 * Initialize and return the SWR service
 */
export declare function initSWRService(config?: Partial<SWRConfig>): Promise<SWRService>;
/**
 * Reset the singleton instance (mainly for testing)
 */
export declare function resetSWRService(): void;
//# sourceMappingURL=swrService.d.ts.map