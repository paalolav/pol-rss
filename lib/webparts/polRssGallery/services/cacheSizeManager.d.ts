/**
 * Cache Size Manager
 *
 * Manages cache size to prevent storage quota issues.
 * Features:
 * - Size tracking for both memory and IndexedDB
 * - LRU (Least Recently Used) eviction strategy
 * - Configurable size limits
 * - High usage warnings
 * - Quota exceeded handling
 */
import { IndexedDBCache } from './indexedDbCache';
import { ParsedFeed } from './feedTypes';
/**
 * Configuration for cache size management
 */
export interface CacheSizeConfig {
    /** Maximum entries in memory cache (default: 50) */
    maxMemoryEntries: number;
    /** Maximum IndexedDB size in bytes (default: 50MB) */
    maxIndexedDBSize: number;
    /** Eviction strategy (default: 'lru') */
    evictionStrategy: 'lru' | 'lfu' | 'ttl';
    /** Warning threshold as percentage of max (default: 0.8 = 80%) */
    warningThreshold: number;
    /** Number of entries to evict when limit reached (default: 10%) */
    evictionBatchPercent: number;
}
/**
 * Cache size statistics
 */
export interface CacheSizeStats {
    /** Number of entries in memory */
    memoryEntries: number;
    /** Total size of memory entries in bytes */
    memorySize: number;
    /** Memory usage as percentage of limit */
    memoryUsagePercent: number;
    /** Number of entries in IndexedDB */
    indexedDBEntries: number;
    /** Total size of IndexedDB entries in bytes */
    indexedDBSize: number;
    /** IndexedDB usage as percentage of limit */
    indexedDBUsagePercent: number;
    /** Whether memory is near limit */
    memoryNearLimit: boolean;
    /** Whether IndexedDB is near limit */
    indexedDBNearLimit: boolean;
    /** Last cleanup timestamp */
    lastCleanup: number | null;
}
/**
 * Result of an eviction operation
 */
export interface EvictionResult {
    /** Number of entries evicted from memory */
    memoryEvicted: number;
    /** Number of entries evicted from IndexedDB */
    indexedDBEvicted: number;
    /** Bytes freed from memory */
    memoryBytesFreed: number;
    /** Bytes freed from IndexedDB */
    indexedDBBytesFreed: number;
}
/**
 * Cache Size Manager
 *
 * Monitors and manages cache size across memory and IndexedDB layers.
 */
export declare class CacheSizeManager {
    private config;
    private memoryEntries;
    private lastCleanup;
    private indexedDBCache;
    constructor(config?: Partial<CacheSizeConfig>);
    /**
     * Set the IndexedDB cache reference for size tracking
     */
    setIndexedDBCache(cache: IndexedDBCache): void;
    /**
     * Track a new entry being added to memory cache
     */
    trackMemoryEntry(key: string, content: ParsedFeed, expiresAt: number): void;
    /**
     * Record an access to an entry (for LRU/LFU tracking)
     */
    recordAccess(key: string): void;
    /**
     * Remove tracking for an entry
     */
    untrackEntry(key: string): void;
    /**
     * Check if memory cache should trigger eviction
     */
    shouldEvictMemory(): boolean;
    /**
     * Check if IndexedDB cache should trigger eviction
     */
    shouldEvictIndexedDB(): Promise<boolean>;
    /**
     * Get entries to evict from memory based on strategy
     */
    getMemoryEvictionCandidates(count?: number): string[];
    /**
     * Get entries to evict from IndexedDB based on strategy
     */
    getIndexedDBEvictionCandidates(count?: number): Promise<string[]>;
    /**
     * Evict entries from memory cache
     */
    evictFromMemory(keys: string[]): number;
    /**
     * Evict entries from IndexedDB cache
     */
    evictFromIndexedDB(keys: string[]): Promise<number>;
    /**
     * Perform automatic eviction if limits are exceeded
     */
    performEvictionIfNeeded(): Promise<EvictionResult>;
    /**
     * Get current size statistics
     */
    getStats(): Promise<CacheSizeStats>;
    /**
     * Get the size of a specific entry
     */
    getEntrySize(key: string): number;
    /**
     * Get current memory entry count
     */
    getMemoryEntryCount(): number;
    /**
     * Get current memory size total
     */
    getCurrentMemorySize(): number;
    /**
     * Clear all expired entries
     */
    clearExpired(): number;
    /**
     * Clear all tracked entries
     */
    clear(): void;
    /**
     * Update configuration
     */
    setConfig(config: Partial<CacheSizeConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): CacheSizeConfig;
    /**
     * Estimate the size of a feed object in bytes
     */
    private estimateSize;
}
/**
 * Get the singleton cache size manager instance
 */
export declare function getCacheSizeManager(): CacheSizeManager;
/**
 * Reset the singleton instance (mainly for testing)
 */
export declare function resetCacheSizeManager(): void;
//# sourceMappingURL=cacheSizeManager.d.ts.map