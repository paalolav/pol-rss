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
import {
  UnifiedCacheService,
  CacheResult,
  CacheState,
  initUnifiedCache,
  resetUnifiedCache
} from './unifiedCacheService';
import { generateCacheKey, CacheKeyParams } from './cacheKeyService';

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
 * Internal state for tracking in-flight requests
 */
interface InFlightRequest {
  promise: Promise<ParsedFeed>;
  timestamp: number;
}

const DEFAULT_CONFIG: SWRConfig = {
  freshTime: 5 * 60 * 1000,      // 5 minutes
  staleTime: 30 * 60 * 1000,     // 30 minutes
  maxAge: 24 * 60 * 60 * 1000,   // 24 hours
  maxConcurrentRefreshes: 3,
  dedupeInterval: 2000           // 2 seconds
};

/**
 * Stale-While-Revalidate Service
 *
 * Provides intelligent caching with automatic background refresh.
 */
export class SWRService {
  private cache: UnifiedCacheService | null = null;
  private config: SWRConfig;
  private inFlightRequests: Map<string, InFlightRequest> = new Map();
  private backgroundRefreshes: Set<string> = new Set();
  private initPromise: Promise<void> | null = null;

  constructor(config: Partial<SWRConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the SWR service
   */
  public async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    this.cache = await initUnifiedCache({
      freshTime: this.config.freshTime,
      staleTime: this.config.staleTime,
      maxAge: this.config.maxAge
    });
  }

  /**
   * Fetch a feed with SWR semantics
   *
   * @param feedUrl - The feed URL to fetch
   * @param fetcher - Function that fetches the feed from network
   * @param options - Optional configuration
   */
  public async fetch(
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    options: FetchOptions = {}
  ): Promise<SWRResult> {
    await this.ensureInitialized();

    const cacheKey = this.getCacheKey(feedUrl, options.keyParams);

    // Handle force refresh - bypass cache and deduplication completely
    if (options.forceRefresh) {
      // Clear any in-flight request for this key
      this.inFlightRequests.delete(cacheKey);
      return this.doFreshFetch(cacheKey, feedUrl, fetcher, options, true);
    }

    // Check cache first (before deduplication)
    const cacheResult = await this.cache!.get(cacheKey);

    // Handle based on cache state
    switch (cacheResult.state) {
      case 'fresh':
        return {
          data: cacheResult.data,
          isFromCache: true,
          isRevalidating: false,
          cacheState: 'fresh',
          age: cacheResult.age
        };

      case 'stale':
        // Return stale data immediately, trigger background refresh
        this.triggerBackgroundRefresh(cacheKey, feedUrl, fetcher, options);
        return {
          data: cacheResult.data,
          isFromCache: true,
          isRevalidating: true,
          cacheState: 'stale',
          age: cacheResult.age
        };

      case 'expired':
      case 'missing':
      default: {
        // Check for in-flight request (deduplication) only on cache miss
        const existing = this.getDeduplicatedRequest(cacheKey);
        if (existing) {
          try {
            const data = await existing;
            return {
              data,
              isFromCache: false,
              isRevalidating: false,
              cacheState: 'fresh',
              age: 0
            };
          } catch (error) {
            return this.createErrorResult(error);
          }
        }

        // Must fetch fresh data
        return this.doFreshFetch(cacheKey, feedUrl, fetcher, options);
      }
    }
  }

  /**
   * Prefetch a feed into cache without returning the result
   */
  public async prefetch(
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    keyParams?: Partial<CacheKeyParams>
  ): Promise<void> {
    await this.ensureInitialized();

    const cacheKey = this.getCacheKey(feedUrl, keyParams);
    const cacheResult = await this.cache!.get(cacheKey);

    // Only prefetch if missing or expired
    if (cacheResult.state === 'missing' || cacheResult.state === 'expired') {
      try {
        const data = await this.executeWithDeduplication(cacheKey, fetcher);
        await this.cache!.set(cacheKey, feedUrl, data);
      } catch (error) {
        console.warn(`[SWR] Prefetch failed for ${feedUrl}:`, error);
      }
    }
  }

  /**
   * Invalidate a cached feed, forcing next fetch to get fresh data
   */
  public async invalidate(feedUrl: string, keyParams?: Partial<CacheKeyParams>): Promise<void> {
    await this.ensureInitialized();
    const cacheKey = this.getCacheKey(feedUrl, keyParams);
    // Clear any in-flight requests for this key
    this.inFlightRequests.delete(cacheKey);
    await this.cache!.delete(cacheKey);
  }

  /**
   * Invalidate all cached feeds
   */
  public async invalidateAll(): Promise<void> {
    await this.ensureInitialized();
    await this.cache!.clear();
  }

  /**
   * Check if a feed is cached and get its state
   */
  public async getCacheState(feedUrl: string, keyParams?: Partial<CacheKeyParams>): Promise<CacheResult | null> {
    await this.ensureInitialized();
    const cacheKey = this.getCacheKey(feedUrl, keyParams);
    return this.cache!.get(cacheKey);
  }

  /**
   * Get the number of active background refreshes
   */
  public getActiveRefreshCount(): number {
    return this.backgroundRefreshes.size;
  }

  /**
   * Check if a specific feed is currently being refreshed
   */
  public isRefreshing(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean {
    const cacheKey = this.getCacheKey(feedUrl, keyParams);
    return this.backgroundRefreshes.has(cacheKey) || this.inFlightRequests.has(cacheKey);
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<SWRConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.cache) {
      this.cache.setConfig({
        freshTime: this.config.freshTime,
        staleTime: this.config.staleTime,
        maxAge: this.config.maxAge
      });
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): SWRConfig {
    return { ...this.config };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.inFlightRequests.clear();
    this.backgroundRefreshes.clear();
    resetUnifiedCache();
    this.cache = null;
    this.initPromise = null;
  }

  // Private methods

  private async ensureInitialized(): Promise<void> {
    if (!this.cache) {
      await this.init();
    }
  }

  private getCacheKey(feedUrl: string, keyParams?: Partial<CacheKeyParams>): string {
    return generateCacheKey({
      feedUrl,
      ...keyParams
    });
  }

  private getDeduplicatedRequest(key: string): Promise<ParsedFeed> | null {
    const existing = this.inFlightRequests.get(key);
    if (existing && Date.now() - existing.timestamp < this.config.dedupeInterval) {
      return existing.promise;
    }
    return null;
  }

  private async executeWithDeduplication(
    key: string,
    fetcher: () => Promise<ParsedFeed>
  ): Promise<ParsedFeed> {
    // Check for existing request
    const existing = this.getDeduplicatedRequest(key);
    if (existing) {
      return existing;
    }

    // Create new request
    const promise = fetcher();
    this.inFlightRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up after dedupe interval
      setTimeout(() => {
        this.inFlightRequests.delete(key);
      }, this.config.dedupeInterval);
    }
  }

  private async doFreshFetch(
    cacheKey: string,
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    options: FetchOptions,
    skipDeduplication: boolean = false
  ): Promise<SWRResult> {
    try {
      // For force refresh, bypass deduplication to ensure we get new data
      const data = skipDeduplication
        ? await fetcher()
        : await this.executeWithDeduplication(cacheKey, fetcher);
      await this.cache!.set(cacheKey, feedUrl, data);

      return {
        data,
        isFromCache: false,
        isRevalidating: false,
        cacheState: 'fresh',
        age: 0
      };
    } catch (error) {
      // Try to return stale data on error
      const cacheResult = await this.cache!.get(cacheKey);
      if (cacheResult.data) {
        if (options.onError) {
          options.onError(cacheKey, error instanceof Error ? error : new Error(String(error)));
        }
        return {
          data: cacheResult.data,
          isFromCache: true,
          isRevalidating: false,
          cacheState: cacheResult.state,
          age: cacheResult.age,
          error: error instanceof Error ? error : new Error(String(error))
        };
      }
      return this.createErrorResult(error);
    }
  }

  private triggerBackgroundRefresh(
    cacheKey: string,
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    options: FetchOptions
  ): void {
    // Don't exceed max concurrent refreshes
    if (this.backgroundRefreshes.size >= this.config.maxConcurrentRefreshes) {
      return;
    }

    // Don't refresh if already refreshing
    if (this.backgroundRefreshes.has(cacheKey)) {
      return;
    }

    this.backgroundRefreshes.add(cacheKey);

    // Fire and forget background refresh
    (async () => {
      try {
        const data = await this.executeWithDeduplication(cacheKey, fetcher);
        await this.cache!.set(cacheKey, feedUrl, data);

        if (options.onRevalidate) {
          options.onRevalidate(cacheKey, data);
        }
      } catch (error) {
        if (options.onError) {
          options.onError(cacheKey, error instanceof Error ? error : new Error(String(error)));
        }
        console.warn(`[SWR] Background refresh failed for ${feedUrl}:`, error);
      } finally {
        this.backgroundRefreshes.delete(cacheKey);
      }
    })();
  }

  private createErrorResult(error: unknown): SWRResult {
    return {
      data: null,
      isFromCache: false,
      isRevalidating: false,
      cacheState: 'missing',
      age: 0,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// Singleton instance
let swrServiceInstance: SWRService | null = null;

/**
 * Get the singleton SWR service instance
 */
export function getSWRService(): SWRService {
  if (!swrServiceInstance) {
    swrServiceInstance = new SWRService();
  }
  return swrServiceInstance;
}

/**
 * Initialize and return the SWR service
 */
export async function initSWRService(config?: Partial<SWRConfig>): Promise<SWRService> {
  if (!swrServiceInstance) {
    swrServiceInstance = new SWRService(config);
  } else if (config) {
    swrServiceInstance.setConfig(config);
  }
  await swrServiceInstance.init();
  return swrServiceInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetSWRService(): void {
  if (swrServiceInstance) {
    swrServiceInstance.dispose();
    swrServiceInstance = null;
  }
}
