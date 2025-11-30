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
import { CacheKeyParams } from './cacheKeyService';
/**
 * Priority levels for preloading
 */
export declare enum PreloadPriority {
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
/**
 * Feed Preloader
 *
 * Manages preloading of RSS feeds with priority queue.
 */
export declare class FeedPreloader {
    private config;
    private queue;
    private active;
    private completed;
    private swrService;
    private initPromise;
    private isDisposed;
    private idleCallbackId;
    private fallbackTimeoutId;
    private activeTimeouts;
    constructor(config?: Partial<PreloaderConfig>);
    /**
     * Initialize the preloader
     */
    init(): Promise<void>;
    private _doInit;
    /**
     * Add a feed to the preload queue
     */
    preload(feedUrl: string, fetcher: () => Promise<ParsedFeed>, priority?: PreloadPriority, keyParams?: Partial<CacheKeyParams>): void;
    /**
     * Cancel a pending preload
     */
    cancelPreload(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean;
    /**
     * Cancel all pending preloads
     */
    cancelAll(): void;
    /**
     * Check if a feed is currently being preloaded
     */
    isPreloading(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean;
    /**
     * Check if a feed has been preloaded
     */
    isPreloaded(feedUrl: string, keyParams?: Partial<CacheKeyParams>): boolean;
    /**
     * Get preload result for a feed
     */
    getPreloadResult(feedUrl: string, keyParams?: Partial<CacheKeyParams>): PreloadResult | null;
    /**
     * Get current queue size
     */
    getQueueSize(): number;
    /**
     * Get number of active preloads
     */
    getActiveCount(): number;
    /**
     * Get all completed results
     */
    getCompletedResults(): PreloadResult[];
    /**
     * Clear completed results
     */
    clearCompletedResults(): void;
    /**
     * Schedule preloading during browser idle time
     */
    scheduleIdlePreload(feedUrl: string, fetcher: () => Promise<ParsedFeed>, keyParams?: Partial<CacheKeyParams>): void;
    /**
     * Update configuration
     */
    setConfig(config: Partial<PreloaderConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): PreloaderConfig;
    /**
     * Dispose the preloader
     */
    dispose(): void;
    /**
     * Process the preload queue
     */
    private processQueue;
    /**
     * Execute a preload request
     */
    private executePreload;
    /**
     * Get the next key from queue based on priority
     */
    private getNextKey;
    /**
     * Find the key with lowest priority in queue
     */
    private findLowestPriorityKey;
    private ensureInitialized;
}
/**
 * Get the singleton feed preloader instance
 */
export declare function getFeedPreloader(): FeedPreloader;
/**
 * Initialize and return the feed preloader
 */
export declare function initFeedPreloader(config?: Partial<PreloaderConfig>): Promise<FeedPreloader>;
/**
 * Reset the singleton instance (mainly for testing)
 */
export declare function resetFeedPreloader(): void;
//# sourceMappingURL=feedPreloader.d.ts.map