/**
 * Unified Cache Service
 *
 * Two-tier caching system combining memory (L1) and IndexedDB (L2) layers.
 * Provides fast access with persistent storage for RSS feeds.
 *
 * Architecture:
 * ┌─────────────────────────────────────────┐
 * │           UnifiedCacheService           │
 * ├─────────────────────────────────────────┤
 * │  ┌─────────────────┐  ┌──────────────┐  │
 * │  │  Memory Cache   │──│  IndexedDB   │  │
 * │  │  (L1 - Fast)    │  │  (L2 - Persist)│ │
 * │  └─────────────────┘  └──────────────┘  │
 * └─────────────────────────────────────────┘
 *
 * Read:  Memory → IndexedDB → Network
 * Write: Network → Memory → IndexedDB (async)
 */
import { ParsedFeed } from './feedTypes';
/**
 * Entry stored in memory cache (L1)
 */
export interface MemoryCacheEntry {
    /** Parsed feed content */
    content: ParsedFeed;
    /** When the feed was fetched */
    fetchedAt: number;
    /** When the entry becomes stale */
    staleAt: number;
    /** When the entry expires completely */
    expiresAt: number;
    /** Approximate size in bytes */
    size: number;
    /** Original feed URL */
    feedUrl: string;
}
/**
 * Cache state for determining freshness
 */
export type CacheState = 'fresh' | 'stale' | 'expired' | 'missing';
/**
 * Result of a cache lookup
 */
export interface CacheResult {
    /** The cached feed data (if any) */
    data: ParsedFeed | null;
    /** Current state of the cache entry */
    state: CacheState;
    /** Age of the cached data in milliseconds */
    age: number;
    /** Source of the data (memory, indexeddb, or null) */
    source: 'memory' | 'indexeddb' | null;
    /** When the entry was fetched */
    fetchedAt: number | null;
}
/**
 * Configuration for the unified cache service
 */
export interface UnifiedCacheConfig {
    /** Time in ms before data is considered stale (default: 5 minutes) */
    freshTime: number;
    /** Time in ms before stale data triggers background refresh (default: 30 minutes) */
    staleTime: number;
    /** Maximum age in ms before data is completely expired (default: 24 hours) */
    maxAge: number;
    /** Maximum number of entries in memory cache (default: 50) */
    maxMemoryEntries: number;
    /** Whether to use IndexedDB for persistence (default: true) */
    useIndexedDB: boolean;
}
/**
 * Options for set operations
 */
export interface SetOptions {
    /** Custom stale time for this entry */
    staleTime?: number;
    /** Custom max age for this entry */
    maxAge?: number;
}
/**
 * Unified Cache Service
 *
 * Provides two-tier caching with memory (L1) and IndexedDB (L2).
 * Memory cache provides instant access, IndexedDB provides persistence.
 */
export declare class UnifiedCacheService {
    private memoryCache;
    private indexedDBCache;
    private config;
    private initPromise;
    private cleanupInterval;
    constructor(config?: Partial<UnifiedCacheConfig>);
    /**
     * Initialize the cache service
     * Must be called before using IndexedDB features
     */
    init(): Promise<void>;
    private _doInit;
    /**
     * Preload recent entries from IndexedDB into memory cache
     */
    private preloadFromIndexedDB;
    /**
     * Get a cached feed by key
     * Returns cached data and its state (fresh, stale, expired, missing)
     */
    get(key: string): Promise<CacheResult>;
    /**
     * Store a feed in the cache
     */
    set(key: string, feedUrl: string, content: ParsedFeed, options?: SetOptions): Promise<void>;
    /**
     * Check if a key exists and is not expired
     */
    has(key: string): Promise<boolean>;
    /**
     * Delete a specific key from both cache layers
     */
    delete(key: string): Promise<void>;
    /**
     * Clear all cached data
     */
    clear(): Promise<void>;
    /**
     * Get cache statistics
     */
    getStats(): Promise<{
        memoryEntries: number;
        memorySize: number;
        indexedDBEntries: number;
        indexedDBSize: number;
    }>;
    /**
     * Force refresh expired entries from IndexedDB
     */
    cleanup(): Promise<{
        memoryRemoved: number;
        indexedDBRemoved: number;
    }>;
    /**
     * Get all keys currently in cache
     */
    getAllKeys(): Promise<string[]>;
    /**
     * Update configuration
     */
    setConfig(config: Partial<UnifiedCacheConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): UnifiedCacheConfig;
    /**
     * Check if IndexedDB is available and initialized
     */
    isIndexedDBAvailable(): boolean;
    /**
     * Stop the cache service and cleanup resources
     */
    dispose(): void;
    /**
     * Determine cache state based on timestamps
     */
    private getCacheState;
    /**
     * Promote an IndexedDB entry to memory cache
     */
    private promoteToMemory;
    /**
     * Ensure memory cache doesn't exceed limit (LRU eviction)
     */
    private enforceMemoryLimit;
    /**
     * Estimate size of feed content in bytes
     */
    private estimateSize;
    /**
     * Start periodic cleanup timer
     */
    private startCleanupTimer;
    /**
     * Stop cleanup timer
     */
    private stopCleanupTimer;
}
/**
 * Get the singleton unified cache instance
 */
export declare function getUnifiedCache(): UnifiedCacheService;
/**
 * Initialize and return the unified cache
 */
export declare function initUnifiedCache(config?: Partial<UnifiedCacheConfig>): Promise<UnifiedCacheService>;
/**
 * Reset the singleton instance (mainly for testing)
 */
export declare function resetUnifiedCache(): void;
//# sourceMappingURL=unifiedCacheService.d.ts.map