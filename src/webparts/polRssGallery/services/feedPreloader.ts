/**
 * Feed Preloader Service
 *
 * Preloads RSS feeds for improved perceived performance.
 * Features:
 * - Priority queue for multiple feeds
 * - Background preloading on webpart mount
 * - Cancellation support
 * - Duplicate request prevention
 */

import { ParsedFeed } from './feedTypes';
import { SWRService, initSWRService } from './swrService';
import { generateCacheKey, CacheKeyParams } from './cacheKeyService';

/**
 * Priority levels for preloading
 */
export enum PreloadPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

/**
 * Preload request configuration
 */
export interface PreloadRequest {
  /** Feed URL to preload */
  feedUrl: string;
  /** Function to fetch the feed */
  fetcher: () => Promise<ParsedFeed>;
  /** Priority level */
  priority: PreloadPriority;
  /** Optional cache key params */
  keyParams?: Partial<CacheKeyParams>;
  /** Timestamp when request was added */
  addedAt: number;
}

/**
 * Preload result
 */
export interface PreloadResult {
  /** Feed URL */
  feedUrl: string;
  /** Whether preload was successful */
  success: boolean;
  /** Error if failed */
  error?: Error;
  /** Time taken in ms */
  duration: number;
  /** Whether it was from cache */
  fromCache: boolean;
}

/**
 * Preloader configuration
 */
export interface PreloaderConfig {
  /** Maximum concurrent preloads (default: 2) */
  maxConcurrent: number;
  /** Maximum queue size (default: 10) */
  maxQueueSize: number;
  /** Request timeout in ms (default: 30000) */
  timeout: number;
  /** Whether to preload on idle (default: true) */
  preloadOnIdle: boolean;
}

const DEFAULT_CONFIG: PreloaderConfig = {
  maxConcurrent: 2,
  maxQueueSize: 10,
  timeout: 30000,
  preloadOnIdle: true
};

/**
 * Feed Preloader
 *
 * Manages preloading of RSS feeds with priority queue.
 */
export class FeedPreloader {
  private config: PreloaderConfig;
  private queue: Map<string, PreloadRequest> = new Map();
  private active: Set<string> = new Set();
  private completed: Map<string, PreloadResult> = new Map();
  private swrService: SWRService | null = null;
  private initPromise: Promise<void> | null = null;
  private isDisposed: boolean = false;
  private idleCallbackId: number | null = null;
  private fallbackTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private activeTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();

  constructor(config: Partial<PreloaderConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the preloader
   */
  public async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    this.swrService = await initSWRService();
  }

  /**
   * Add a feed to the preload queue
   */
  public preload(
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    priority: PreloadPriority = PreloadPriority.NORMAL,
    keyParams?: Partial<CacheKeyParams>
  ): void {
    if (this.isDisposed) return;

    const cacheKey = generateCacheKey({ feedUrl, ...keyParams });

    // Don't add if already active or completed successfully
    if (this.active.has(cacheKey)) return;
    if (this.completed.get(cacheKey)?.success) return;

    // Check queue size limit
    if (this.queue.size >= this.config.maxQueueSize) {
      // Remove lowest priority item if new one has higher priority
      const lowestPriority = this.findLowestPriorityKey();
      if (lowestPriority) {
        const existing = this.queue.get(lowestPriority);
        if (existing && existing.priority < priority) {
          this.queue.delete(lowestPriority);
        } else {
          return; // Queue full with higher priority items
        }
      }
    }

    // Add to queue
    this.queue.set(cacheKey, {
      feedUrl,
      fetcher,
      priority,
      keyParams,
      addedAt: Date.now()
    });

    // Process queue
    this.processQueue();
  }

  /**
   * Cancel a pending preload
   */
  public cancelPreload(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean {
    const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
    return this.queue.delete(cacheKey);
  }

  /**
   * Cancel all pending preloads
   */
  public cancelAll(): void {
    this.queue.clear();
  }

  /**
   * Check if a feed is currently being preloaded
   */
  public isPreloading(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean {
    const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
    return this.active.has(cacheKey) || this.queue.has(cacheKey);
  }

  /**
   * Check if a feed has been preloaded
   */
  public isPreloaded(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean {
    const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
    return this.completed.get(cacheKey)?.success === true;
  }

  /**
   * Get preload result for a feed
   */
  public getPreloadResult(feedUrl: string, keyParams?: Partial<CacheKeyParams>): PreloadResult | null {
    const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
    return this.completed.get(cacheKey) || null;
  }

  /**
   * Get current queue size
   */
  public getQueueSize(): number {
    return this.queue.size;
  }

  /**
   * Get number of active preloads
   */
  public getActiveCount(): number {
    return this.active.size;
  }

  /**
   * Get all completed results
   */
  public getCompletedResults(): PreloadResult[] {
    return Array.from(this.completed.values());
  }

  /**
   * Clear completed results
   */
  public clearCompletedResults(): void {
    this.completed.clear();
  }

  /**
   * Schedule preloading during browser idle time
   */
  public scheduleIdlePreload(
    feedUrl: string,
    fetcher: () => Promise<ParsedFeed>,
    keyParams?: Partial<CacheKeyParams>
  ): void {
    if (!this.config.preloadOnIdle || this.isDisposed) return;

    // Use requestIdleCallback if available
    if (typeof requestIdleCallback !== 'undefined') {
      this.idleCallbackId = requestIdleCallback(() => {
        this.preload(feedUrl, fetcher, PreloadPriority.LOW, keyParams);
      }, { timeout: 5000 });
    } else {
      // Fallback to setTimeout - store ID for cleanup
      if (this.fallbackTimeoutId !== null) {
        clearTimeout(this.fallbackTimeoutId);
      }
      this.fallbackTimeoutId = setTimeout(() => {
        this.fallbackTimeoutId = null;
        this.preload(feedUrl, fetcher, PreloadPriority.LOW, keyParams);
      }, 1000);
    }
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<PreloaderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): PreloaderConfig {
    return { ...this.config };
  }

  /**
   * Dispose the preloader
   */
  public dispose(): void {
    this.isDisposed = true;
    this.queue.clear();
    this.active.clear();

    if (this.idleCallbackId !== null && typeof cancelIdleCallback !== 'undefined') {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }

    if (this.fallbackTimeoutId !== null) {
      clearTimeout(this.fallbackTimeoutId);
      this.fallbackTimeoutId = null;
    }

    // Clear all active timeouts from executePreload
    for (const timeoutId of this.activeTimeouts) {
      clearTimeout(timeoutId);
    }
    this.activeTimeouts.clear();

    this.initPromise = null;
  }

  // Private methods

  /**
   * Process the preload queue
   */
  private processQueue(): void {
    if (this.isDisposed) return;
    if (this.active.size >= this.config.maxConcurrent) return;
    if (this.queue.size === 0) return;

    // Get highest priority item
    const nextKey = this.getNextKey();
    if (!nextKey) return;

    const request = this.queue.get(nextKey);
    if (!request) return;

    this.queue.delete(nextKey);
    this.executePreload(nextKey, request);

    // Continue processing if slots available
    if (this.active.size < this.config.maxConcurrent && this.queue.size > 0) {
      this.processQueue();
    }
  }

  /**
   * Execute a preload request
   */
  private async executePreload(key: string, request: PreloadRequest): Promise<void> {
    this.active.add(key);
    const startTime = Date.now();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      await this.ensureInitialized();

      // Create a timeout promise with cleanup tracking
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          this.activeTimeouts.delete(timeoutId!);
          reject(new Error('Preload timeout'));
        }, this.config.timeout);
        this.activeTimeouts.add(timeoutId);
      });

      // Race between fetch and timeout
      await Promise.race([
        this.swrService!.prefetch(request.feedUrl, request.fetcher, request.keyParams),
        timeoutPromise
      ]);

      // Check cache state to determine if prefetch actually succeeded
      // (prefetch catches errors internally, so we need to verify the cache was populated)
      const cacheState = await this.swrService!.getCacheState(request.feedUrl, request.keyParams);
      const success = cacheState?.state === 'fresh' || cacheState?.state === 'stale';

      this.completed.set(key, {
        feedUrl: request.feedUrl,
        success,
        duration: Date.now() - startTime,
        fromCache: cacheState?.source === 'memory' || cacheState?.source === 'indexeddb',
        error: success ? undefined : new Error('Prefetch failed - cache not populated')
      });
    } catch (error) {
      this.completed.set(key, {
        feedUrl: request.feedUrl,
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        duration: Date.now() - startTime,
        fromCache: false
      });
    } finally {
      // Clean up the timeout if the prefetch completed before it fired
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        this.activeTimeouts.delete(timeoutId);
      }
      this.active.delete(key);
      this.processQueue(); // Continue processing
    }
  }

  /**
   * Get the next key from queue based on priority
   */
  private getNextKey(): string | null {
    let nextKey: string | null = null;
    let highestPriority = -1;
    let earliestTime = Infinity;

    for (const [key, request] of this.queue) {
      // Higher priority wins
      if (request.priority > highestPriority) {
        highestPriority = request.priority;
        earliestTime = request.addedAt;
        nextKey = key;
      } else if (request.priority === highestPriority && request.addedAt < earliestTime) {
        // Same priority - earlier request wins
        earliestTime = request.addedAt;
        nextKey = key;
      }
    }

    return nextKey;
  }

  /**
   * Find the key with lowest priority in queue
   */
  private findLowestPriorityKey(): string | null {
    let lowestKey: string | null = null;
    let lowestPriority = Infinity;
    let latestTime = 0;

    for (const [key, request] of this.queue) {
      if (request.priority < lowestPriority) {
        lowestPriority = request.priority;
        latestTime = request.addedAt;
        lowestKey = key;
      } else if (request.priority === lowestPriority && request.addedAt > latestTime) {
        // Same priority - later request gets evicted first
        latestTime = request.addedAt;
        lowestKey = key;
      }
    }

    return lowestKey;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.swrService) {
      await this.init();
    }
  }
}

// Singleton instance
let feedPreloaderInstance: FeedPreloader | null = null;

/**
 * Get the singleton feed preloader instance
 */
export function getFeedPreloader(): FeedPreloader {
  if (!feedPreloaderInstance) {
    feedPreloaderInstance = new FeedPreloader();
  }
  return feedPreloaderInstance;
}

/**
 * Initialize and return the feed preloader
 */
export async function initFeedPreloader(config?: Partial<PreloaderConfig>): Promise<FeedPreloader> {
  if (!feedPreloaderInstance) {
    feedPreloaderInstance = new FeedPreloader(config);
  } else if (config) {
    feedPreloaderInstance.setConfig(config);
  }
  await feedPreloaderInstance.init();
  return feedPreloaderInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetFeedPreloader(): void {
  if (feedPreloaderInstance) {
    feedPreloaderInstance.dispose();
    feedPreloaderInstance = null;
  }
}
