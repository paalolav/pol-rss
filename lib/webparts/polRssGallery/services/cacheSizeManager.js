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
const DEFAULT_CONFIG = {
    maxMemoryEntries: 50,
    maxIndexedDBSize: 50 * 1024 * 1024, // 50MB
    evictionStrategy: 'lru',
    warningThreshold: 0.8,
    evictionBatchPercent: 0.1
};
/**
 * Cache Size Manager
 *
 * Monitors and manages cache size across memory and IndexedDB layers.
 */
export class CacheSizeManager {
    constructor(config = {}) {
        this.memoryEntries = new Map();
        this.lastCleanup = null;
        this.indexedDBCache = null;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Set the IndexedDB cache reference for size tracking
     */
    setIndexedDBCache(cache) {
        this.indexedDBCache = cache;
    }
    /**
     * Track a new entry being added to memory cache
     */
    trackMemoryEntry(key, content, expiresAt) {
        const size = this.estimateSize(content);
        const existing = this.memoryEntries.get(key);
        this.memoryEntries.set(key, {
            key,
            size,
            lastAccessed: Date.now(),
            accessCount: existing ? existing.accessCount + 1 : 1,
            expiresAt
        });
    }
    /**
     * Record an access to an entry (for LRU/LFU tracking)
     */
    recordAccess(key) {
        const entry = this.memoryEntries.get(key);
        if (entry) {
            entry.lastAccessed = Date.now();
            entry.accessCount++;
        }
    }
    /**
     * Remove tracking for an entry
     */
    untrackEntry(key) {
        this.memoryEntries.delete(key);
    }
    /**
     * Check if memory cache should trigger eviction
     */
    shouldEvictMemory() {
        return this.memoryEntries.size > this.config.maxMemoryEntries;
    }
    /**
     * Check if IndexedDB cache should trigger eviction
     */
    async shouldEvictIndexedDB() {
        var _a;
        if (!((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable())) {
            return false;
        }
        const totalSize = await this.indexedDBCache.getTotalSize();
        return totalSize > this.config.maxIndexedDBSize;
    }
    /**
     * Get entries to evict from memory based on strategy
     */
    getMemoryEvictionCandidates(count = 0) {
        const targetCount = count || Math.ceil(this.memoryEntries.size * this.config.evictionBatchPercent);
        const entries = Array.from(this.memoryEntries.values());
        // Sort based on eviction strategy
        switch (this.config.evictionStrategy) {
            case 'lfu':
                // Least Frequently Used - evict entries with lowest access count
                entries.sort((a, b) => a.accessCount - b.accessCount);
                break;
            case 'ttl':
                // Time To Live - evict entries closest to expiration
                entries.sort((a, b) => a.expiresAt - b.expiresAt);
                break;
            case 'lru':
            default:
                // Least Recently Used - evict entries with oldest access time
                entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
                break;
        }
        return entries.slice(0, targetCount).map(e => e.key);
    }
    /**
     * Get entries to evict from IndexedDB based on strategy
     */
    async getIndexedDBEvictionCandidates(count = 0) {
        var _a;
        if (!((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable())) {
            return [];
        }
        const entries = await this.indexedDBCache.getAll();
        const targetCount = count || Math.ceil(entries.length * this.config.evictionBatchPercent);
        // Sort based on eviction strategy
        switch (this.config.evictionStrategy) {
            case 'ttl':
                // Time To Live - evict entries closest to expiration
                entries.sort((a, b) => a.expiresAt - b.expiresAt);
                break;
            case 'lru':
            default:
                // LRU - evict entries with oldest access time
                entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
                break;
        }
        return entries.slice(0, targetCount).map(e => e.key);
    }
    /**
     * Evict entries from memory cache
     */
    evictFromMemory(keys) {
        let evicted = 0;
        for (const key of keys) {
            if (this.memoryEntries.delete(key)) {
                evicted++;
            }
        }
        return evicted;
    }
    /**
     * Evict entries from IndexedDB cache
     */
    async evictFromIndexedDB(keys) {
        var _a;
        if (!((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable())) {
            return 0;
        }
        let evicted = 0;
        for (const key of keys) {
            if (await this.indexedDBCache.delete(key)) {
                evicted++;
            }
        }
        return evicted;
    }
    /**
     * Perform automatic eviction if limits are exceeded
     */
    async performEvictionIfNeeded() {
        const result = {
            memoryEvicted: 0,
            indexedDBEvicted: 0,
            memoryBytesFreed: 0,
            indexedDBBytesFreed: 0
        };
        // Check and evict from memory
        if (this.shouldEvictMemory()) {
            const candidates = this.getMemoryEvictionCandidates();
            for (const key of candidates) {
                const entry = this.memoryEntries.get(key);
                if (entry) {
                    result.memoryBytesFreed += entry.size;
                }
            }
            result.memoryEvicted = this.evictFromMemory(candidates);
        }
        // Check and evict from IndexedDB
        if (await this.shouldEvictIndexedDB()) {
            const sizeBefore = await this.indexedDBCache.getTotalSize();
            const candidates = await this.getIndexedDBEvictionCandidates();
            result.indexedDBEvicted = await this.evictFromIndexedDB(candidates);
            const sizeAfter = await this.indexedDBCache.getTotalSize();
            result.indexedDBBytesFreed = sizeBefore - sizeAfter;
        }
        if (result.memoryEvicted > 0 || result.indexedDBEvicted > 0) {
            this.lastCleanup = Date.now();
        }
        return result;
    }
    /**
     * Get current size statistics
     */
    async getStats() {
        var _a;
        // Calculate memory stats
        let memorySize = 0;
        for (const entry of this.memoryEntries.values()) {
            memorySize += entry.size;
        }
        // Calculate IndexedDB stats
        let indexedDBEntries = 0;
        let indexedDBSize = 0;
        if ((_a = this.indexedDBCache) === null || _a === void 0 ? void 0 : _a.isAvailable()) {
            indexedDBEntries = await this.indexedDBCache.count();
            indexedDBSize = await this.indexedDBCache.getTotalSize();
        }
        const memoryUsagePercent = this.memoryEntries.size / this.config.maxMemoryEntries;
        const indexedDBUsagePercent = indexedDBSize / this.config.maxIndexedDBSize;
        return {
            memoryEntries: this.memoryEntries.size,
            memorySize,
            memoryUsagePercent,
            indexedDBEntries,
            indexedDBSize,
            indexedDBUsagePercent,
            memoryNearLimit: memoryUsagePercent >= this.config.warningThreshold,
            indexedDBNearLimit: indexedDBUsagePercent >= this.config.warningThreshold,
            lastCleanup: this.lastCleanup
        };
    }
    /**
     * Get the size of a specific entry
     */
    getEntrySize(key) {
        var _a;
        return ((_a = this.memoryEntries.get(key)) === null || _a === void 0 ? void 0 : _a.size) || 0;
    }
    /**
     * Get current memory entry count
     */
    getMemoryEntryCount() {
        return this.memoryEntries.size;
    }
    /**
     * Get current memory size total
     */
    getCurrentMemorySize() {
        let total = 0;
        for (const entry of this.memoryEntries.values()) {
            total += entry.size;
        }
        return total;
    }
    /**
     * Clear all expired entries
     */
    clearExpired() {
        const now = Date.now();
        let cleared = 0;
        for (const [key, entry] of this.memoryEntries.entries()) {
            if (entry.expiresAt <= now) {
                this.memoryEntries.delete(key);
                cleared++;
            }
        }
        return cleared;
    }
    /**
     * Clear all tracked entries
     */
    clear() {
        this.memoryEntries.clear();
        this.lastCleanup = null;
    }
    /**
     * Update configuration
     */
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    // Private methods
    /**
     * Estimate the size of a feed object in bytes
     */
    estimateSize(content) {
        try {
            // JSON.stringify gives a reasonable estimate
            // Multiply by 2 for UTF-16 encoding overhead
            return JSON.stringify(content).length * 2;
        }
        catch (_a) {
            // Fallback estimate
            return 10000;
        }
    }
}
// Singleton instance
let cacheSizeManagerInstance = null;
/**
 * Get the singleton cache size manager instance
 */
export function getCacheSizeManager() {
    if (!cacheSizeManagerInstance) {
        cacheSizeManagerInstance = new CacheSizeManager();
    }
    return cacheSizeManagerInstance;
}
/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetCacheSizeManager() {
    if (cacheSizeManagerInstance) {
        cacheSizeManagerInstance.clear();
        cacheSizeManagerInstance = null;
    }
}
//# sourceMappingURL=cacheSizeManager.js.map