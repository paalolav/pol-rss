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
import { initIndexedDBCache } from './indexedDbCache';
const DEFAULT_CONFIG = {
    freshTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 30 * 60 * 1000, // 30 minutes
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxMemoryEntries: 50,
    useIndexedDB: true
};
/**
 * Unified Cache Service
 *
 * Provides two-tier caching with memory (L1) and IndexedDB (L2).
 * Memory cache provides instant access, IndexedDB provides persistence.
 */
export class UnifiedCacheService {
    constructor(config = {}) {
        this.indexedDBCache = null;
        this.initPromise = null;
        this.cleanupInterval = null;
        this.memoryCache = new Map();
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Initialize the cache service
     * Must be called before using IndexedDB features
     */
    async init() {
        if (this.initPromise) {
            return this.initPromise;
        }
        this.initPromise = this._doInit();
        return this.initPromise;
    }
    async _doInit() {
        if (this.config.useIndexedDB) {
            try {
                this.indexedDBCache = await initIndexedDBCache();
                // Preload recent entries from IndexedDB to memory
                await this.preloadFromIndexedDB();
            }
            catch (error) {
                console.warn('[UnifiedCache] IndexedDB initialization failed, using memory-only mode:', error);
                this.indexedDBCache = null;
            }
        }
        // Start periodic cleanup
        this.startCleanupTimer();
    }
    /**
     * Preload recent entries from IndexedDB into memory cache
     */
    async preloadFromIndexedDB() {
        var _a;
        if (!((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()))
            return;
        try {
            const entries = await this.indexedDBCache.getAll();
            const now = Date.now();
            // Sort by last accessed (most recent first) and take only valid entries
            const validEntries = entries
                .filter(entry => entry.expiresAt > now)
                .sort((a, b) => b.lastAccessed - a.lastAccessed)
                .slice(0, this.config.maxMemoryEntries);
            for (const entry of validEntries) {
                this.memoryCache.set(entry.key, {
                    content: entry.content,
                    fetchedAt: entry.fetchedAt,
                    staleAt: entry.fetchedAt + this.config.freshTime,
                    expiresAt: entry.expiresAt,
                    size: entry.size,
                    feedUrl: entry.feedUrl
                });
            }
        }
        catch (error) {
            console.warn('[UnifiedCache] Failed to preload from IndexedDB:', error);
        }
    }
    /**
     * Get a cached feed by key
     * Returns cached data and its state (fresh, stale, expired, missing)
     */
    async get(key) {
        var _a;
        const now = Date.now();
        // Try memory cache first (L1)
        const memoryEntry = this.memoryCache.get(key);
        if (memoryEntry) {
            const age = now - memoryEntry.fetchedAt;
            const state = this.getCacheState(memoryEntry.fetchedAt, memoryEntry.staleAt, memoryEntry.expiresAt);
            if (state !== 'expired') {
                return {
                    data: memoryEntry.content,
                    state,
                    age,
                    source: 'memory',
                    fetchedAt: memoryEntry.fetchedAt
                };
            }
            // Entry is expired, remove from memory
            this.memoryCache.delete(key);
        }
        // Try IndexedDB (L2)
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            const indexedEntry = await this.indexedDBCache.get(key);
            if (indexedEntry && indexedEntry.expiresAt > now) {
                const age = now - indexedEntry.fetchedAt;
                const staleAt = indexedEntry.fetchedAt + this.config.freshTime;
                const state = this.getCacheState(indexedEntry.fetchedAt, staleAt, indexedEntry.expiresAt);
                // Promote to memory cache (L1)
                this.promoteToMemory(key, indexedEntry);
                return {
                    data: indexedEntry.content,
                    state,
                    age,
                    source: 'indexeddb',
                    fetchedAt: indexedEntry.fetchedAt
                };
            }
        }
        // Cache miss
        return {
            data: null,
            state: 'missing',
            age: 0,
            source: null,
            fetchedAt: null
        };
    }
    /**
     * Store a feed in the cache
     */
    async set(key, feedUrl, content, options = {}) {
        var _a;
        const now = Date.now();
        // @ts-expect-error Reserved for future SWR implementation
        const _staleTime = options.staleTime || this.config.staleTime; // eslint-disable-line @typescript-eslint/no-unused-vars
        const maxAge = options.maxAge || this.config.maxAge;
        const size = this.estimateSize(content);
        // Store in memory (L1)
        const memoryEntry = {
            content,
            fetchedAt: now,
            staleAt: now + this.config.freshTime,
            expiresAt: now + maxAge,
            size,
            feedUrl
        };
        this.memoryCache.set(key, memoryEntry);
        this.enforceMemoryLimit();
        // Store in IndexedDB (L2) asynchronously
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            const indexedEntry = {
                key,
                feedUrl,
                content,
                fetchedAt: now,
                expiresAt: now + maxAge,
                size,
                lastAccessed: now
            };
            // Fire and forget - don't block on IndexedDB write
            this.indexedDBCache.set(indexedEntry).catch(error => {
                console.warn('[UnifiedCache] Failed to persist to IndexedDB:', error);
            });
        }
    }
    /**
     * Check if a key exists and is not expired
     */
    async has(key) {
        const result = await this.get(key);
        return result.state !== 'missing' && result.state !== 'expired';
    }
    /**
     * Delete a specific key from both cache layers
     */
    async delete(key) {
        var _a;
        this.memoryCache.delete(key);
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            await this.indexedDBCache.delete(key);
        }
    }
    /**
     * Clear all cached data
     */
    async clear() {
        var _a;
        this.memoryCache.clear();
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            await this.indexedDBCache.clear();
        }
    }
    /**
     * Get cache statistics
     */
    async getStats() {
        var _a;
        let memorySize = 0;
        for (const entry of this.memoryCache.values()) {
            memorySize += entry.size;
        }
        let indexedDBEntries = 0;
        let indexedDBSize = 0;
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            indexedDBEntries = await this.indexedDBCache.count();
            indexedDBSize = await this.indexedDBCache.getTotalSize();
        }
        return {
            memoryEntries: this.memoryCache.size,
            memorySize,
            indexedDBEntries,
            indexedDBSize
        };
    }
    /**
     * Force refresh expired entries from IndexedDB
     */
    async cleanup() {
        var _a;
        const now = Date.now();
        let memoryRemoved = 0;
        // Clean memory cache
        for (const [key, entry] of this.memoryCache.entries()) {
            if (entry.expiresAt <= now) {
                this.memoryCache.delete(key);
                memoryRemoved++;
            }
        }
        // Clean IndexedDB
        let indexedDBRemoved = 0;
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            indexedDBRemoved = await this.indexedDBCache.deleteExpired();
        }
        return { memoryRemoved, indexedDBRemoved };
    }
    /**
     * Get all keys currently in cache
     */
    async getAllKeys() {
        var _a;
        const keys = new Set(this.memoryCache.keys());
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            const indexedKeys = await this.indexedDBCache.getAllKeys();
            indexedKeys.forEach(key => keys.add(key));
        }
        return Array.from(keys);
    }
    /**
     * Update configuration
     */
    setConfig(config) {
        this.config = { ...this.config, ...config };
        // Re-enforce memory limit if max entries changed
        if (config.maxMemoryEntries !== undefined) {
            this.enforceMemoryLimit();
        }
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Check if IndexedDB is available and initialized
     */
    isIndexedDBAvailable() {
        var _a;
        return ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) || false;
    }
    /**
     * Stop the cache service and cleanup resources
     */
    dispose() {
        this.stopCleanupTimer();
        this.memoryCache.clear();
        if (this.indexedDBCache) {
            this.indexedDBCache.close();
            this.indexedDBCache = null;
        }
        this.initPromise = null;
    }
    // Private helper methods
    /**
     * Determine cache state based on timestamps
     */
    getCacheState(fetchedAt, staleAt, expiresAt) {
        const now = Date.now();
        if (now >= expiresAt) {
            return 'expired';
        }
        if (now >= staleAt) {
            return 'stale';
        }
        return 'fresh';
    }
    /**
     * Promote an IndexedDB entry to memory cache
     */
    promoteToMemory(key, entry) {
        const memoryEntry = {
            content: entry.content,
            fetchedAt: entry.fetchedAt,
            staleAt: entry.fetchedAt + this.config.freshTime,
            expiresAt: entry.expiresAt,
            size: entry.size,
            feedUrl: entry.feedUrl
        };
        this.memoryCache.set(key, memoryEntry);
        this.enforceMemoryLimit();
    }
    /**
     * Ensure memory cache doesn't exceed limit (LRU eviction)
     */
    enforceMemoryLimit() {
        if (this.memoryCache.size <= this.config.maxMemoryEntries) {
            return;
        }
        // Find entries to evict (oldest first based on fetchedAt)
        const entries = Array.from(this.memoryCache.entries())
            .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt);
        const toRemove = this.memoryCache.size - this.config.maxMemoryEntries;
        for (let i = 0; i < toRemove; i++) {
            this.memoryCache.delete(entries[i][0]);
        }
    }
    /**
     * Estimate size of feed content in bytes
     */
    estimateSize(content) {
        try {
            return JSON.stringify(content).length * 2; // Approximate UTF-16 encoding
        }
        catch (_a) {
            return 10000; // Default estimate
        }
    }
    /**
     * Start periodic cleanup timer
     */
    startCleanupTimer() {
        // Run cleanup every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup().catch(error => {
                console.warn('[UnifiedCache] Cleanup failed:', error);
            });
        }, 5 * 60 * 1000);
    }
    /**
     * Stop cleanup timer
     */
    stopCleanupTimer() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}
// Singleton instance
let unifiedCacheInstance = null;
/**
 * Get the singleton unified cache instance
 */
export function getUnifiedCache() {
    if (!unifiedCacheInstance) {
        unifiedCacheInstance = new UnifiedCacheService();
    }
    return unifiedCacheInstance;
}
/**
 * Initialize and return the unified cache
 */
export async function initUnifiedCache(config) {
    if (!unifiedCacheInstance) {
        unifiedCacheInstance = new UnifiedCacheService(config);
    }
    else if (config) {
        unifiedCacheInstance.setConfig(config);
    }
    await unifiedCacheInstance.init();
    return unifiedCacheInstance;
}
/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetUnifiedCache() {
    if (unifiedCacheInstance) {
        unifiedCacheInstance.dispose();
        unifiedCacheInstance = null;
    }
}
//# sourceMappingURL=unifiedCacheService.js.map