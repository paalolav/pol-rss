export class CacheService {
    constructor() {
        this.cache = new Map();
        this.config = {
            maxSize: 100,
            defaultStaleAfter: 5 * 60 * 1000, // 5 minutes
            maxAge: 60 * 60 * 1000 // 1 hour
        };
    }
    static getInstance() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }
    async get(key, fetchFn, staleAfter = this.config.defaultStaleAfter) {
        const cached = this.cache.get(key);
        const now = Date.now();
        // If we have cached data
        if (cached) {
            const age = now - cached.timestamp;
            // If data is not stale, return it immediately
            if (age < cached.staleAfter) {
                return cached.data;
            }
            // If data is stale but not expired, trigger background refresh and return stale data
            if (age < this.config.maxAge) {
                this.backgroundRefresh(key, fetchFn, staleAfter);
                return cached.data;
            }
        }
        // If no cache or data is expired, fetch fresh data
        return this.fetchAndCache(key, fetchFn, staleAfter);
    }
    async backgroundRefresh(key, fetchFn, staleAfter) {
        try {
            await this.fetchAndCache(key, fetchFn, staleAfter);
        }
        catch (error) {
            console.error(`Background refresh failed for key ${key}:`, error);
        }
    }
    async fetchAndCache(key, fetchFn, staleAfter) {
        const data = await fetchFn();
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            staleAfter
        });
        this.cleanup();
        return data;
    }
    cleanup() {
        const now = Date.now();
        // Remove expired items
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.config.maxAge) {
                this.cache.delete(key);
            }
        }
        // If still over size limit, remove oldest items
        if (this.cache.size > this.config.maxSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const toRemove = entries.length - this.config.maxSize;
            for (let i = 0; i < toRemove; i++) {
                this.cache.delete(entries[i][0]);
            }
        }
    }
    clear() {
        this.cache.clear();
    }
    /**
     * Delete a specific key from the cache
     * @param key The cache key to remove
     */
    delete(key) {
        return this.cache.delete(key);
    }
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
//# sourceMappingURL=cacheService.js.map