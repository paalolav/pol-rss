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
import { initSWRService } from './swrService';
import { generateCacheKey } from './cacheKeyService';
/**
 * Priority levels for preloading
 */
export var PreloadPriority;
(function (PreloadPriority) {
    PreloadPriority[PreloadPriority["LOW"] = 0] = "LOW";
    PreloadPriority[PreloadPriority["NORMAL"] = 1] = "NORMAL";
    PreloadPriority[PreloadPriority["HIGH"] = 2] = "HIGH";
    PreloadPriority[PreloadPriority["CRITICAL"] = 3] = "CRITICAL";
})(PreloadPriority || (PreloadPriority = {}));
const DEFAULT_CONFIG = {
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
    constructor(config = {}) {
        this.queue = new Map();
        this.active = new Set();
        this.completed = new Map();
        this.swrService = null;
        this.initPromise = null;
        this.isDisposed = false;
        this.idleCallbackId = null;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Initialize the preloader
     */
    async init() {
        if (this.initPromise) {
            return this.initPromise;
        }
        this.initPromise = this._doInit();
        return this.initPromise;
    }
    async _doInit() {
        this.swrService = await initSWRService();
    }
    /**
     * Add a feed to the preload queue
     */
    preload(feedUrl, fetcher, priority = PreloadPriority.NORMAL, keyParams) {
        var _a;
        if (this.isDisposed)
            return;
        const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
        // Don't add if already active or completed successfully
        if (this.active.has(cacheKey))
            return;
        if ((_a = this.completed.get(cacheKey)) === null || _a === void 0 ? void 0 : _a.success)
            return;
        // Check queue size limit
        if (this.queue.size >= this.config.maxQueueSize) {
            // Remove lowest priority item if new one has higher priority
            const lowestPriority = this.findLowestPriorityKey();
            if (lowestPriority) {
                const existing = this.queue.get(lowestPriority);
                if (existing && existing.priority < priority) {
                    this.queue.delete(lowestPriority);
                }
                else {
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
    cancelPreload(feedUrl, keyParams) {
        const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
        return this.queue.delete(cacheKey);
    }
    /**
     * Cancel all pending preloads
     */
    cancelAll() {
        this.queue.clear();
    }
    /**
     * Check if a feed is currently being preloaded
     */
    isPreloading(feedUrl, keyParams) {
        const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
        return this.active.has(cacheKey) || this.queue.has(cacheKey);
    }
    /**
     * Check if a feed has been preloaded
     */
    isPreloaded(feedUrl, keyParams) {
        var _a;
        const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
        return ((_a = this.completed.get(cacheKey)) === null || _a === void 0 ? void 0 : _a.success) === true;
    }
    /**
     * Get preload result for a feed
     */
    getPreloadResult(feedUrl, keyParams) {
        const cacheKey = generateCacheKey({ feedUrl, ...keyParams });
        return this.completed.get(cacheKey) || null;
    }
    /**
     * Get current queue size
     */
    getQueueSize() {
        return this.queue.size;
    }
    /**
     * Get number of active preloads
     */
    getActiveCount() {
        return this.active.size;
    }
    /**
     * Get all completed results
     */
    getCompletedResults() {
        return Array.from(this.completed.values());
    }
    /**
     * Clear completed results
     */
    clearCompletedResults() {
        this.completed.clear();
    }
    /**
     * Schedule preloading during browser idle time
     */
    scheduleIdlePreload(feedUrl, fetcher, keyParams) {
        if (!this.config.preloadOnIdle || this.isDisposed)
            return;
        // Use requestIdleCallback if available
        if (typeof requestIdleCallback !== 'undefined') {
            this.idleCallbackId = requestIdleCallback(() => {
                this.preload(feedUrl, fetcher, PreloadPriority.LOW, keyParams);
            }, { timeout: 5000 });
        }
        else {
            // Fallback to setTimeout
            setTimeout(() => {
                this.preload(feedUrl, fetcher, PreloadPriority.LOW, keyParams);
            }, 1000);
        }
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
    /**
     * Dispose the preloader
     */
    dispose() {
        this.isDisposed = true;
        this.queue.clear();
        this.active.clear();
        if (this.idleCallbackId !== null && typeof cancelIdleCallback !== 'undefined') {
            cancelIdleCallback(this.idleCallbackId);
        }
        this.initPromise = null;
    }
    // Private methods
    /**
     * Process the preload queue
     */
    processQueue() {
        if (this.isDisposed)
            return;
        if (this.active.size >= this.config.maxConcurrent)
            return;
        if (this.queue.size === 0)
            return;
        // Get highest priority item
        const nextKey = this.getNextKey();
        if (!nextKey)
            return;
        const request = this.queue.get(nextKey);
        if (!request)
            return;
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
    async executePreload(key, request) {
        this.active.add(key);
        const startTime = Date.now();
        try {
            await this.ensureInitialized();
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Preload timeout')), this.config.timeout);
            });
            // Race between fetch and timeout
            await Promise.race([
                this.swrService.prefetch(request.feedUrl, request.fetcher, request.keyParams),
                timeoutPromise
            ]);
            // Check cache state to determine if prefetch actually succeeded
            // (prefetch catches errors internally, so we need to verify the cache was populated)
            const cacheState = await this.swrService.getCacheState(request.feedUrl, request.keyParams);
            const success = (cacheState === null || cacheState === void 0 ? void 0 : cacheState.state) === 'fresh' || (cacheState === null || cacheState === void 0 ? void 0 : cacheState.state) === 'stale';
            this.completed.set(key, {
                feedUrl: request.feedUrl,
                success,
                duration: Date.now() - startTime,
                fromCache: (cacheState === null || cacheState === void 0 ? void 0 : cacheState.source) === 'memory' || (cacheState === null || cacheState === void 0 ? void 0 : cacheState.source) === 'indexeddb',
                error: success ? undefined : new Error('Prefetch failed - cache not populated')
            });
        }
        catch (error) {
            this.completed.set(key, {
                feedUrl: request.feedUrl,
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
                duration: Date.now() - startTime,
                fromCache: false
            });
        }
        finally {
            this.active.delete(key);
            this.processQueue(); // Continue processing
        }
    }
    /**
     * Get the next key from queue based on priority
     */
    getNextKey() {
        let nextKey = null;
        let highestPriority = -1;
        let earliestTime = Infinity;
        for (const [key, request] of this.queue) {
            // Higher priority wins
            if (request.priority > highestPriority) {
                highestPriority = request.priority;
                earliestTime = request.addedAt;
                nextKey = key;
            }
            else if (request.priority === highestPriority && request.addedAt < earliestTime) {
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
    findLowestPriorityKey() {
        let lowestKey = null;
        let lowestPriority = Infinity;
        let latestTime = 0;
        for (const [key, request] of this.queue) {
            if (request.priority < lowestPriority) {
                lowestPriority = request.priority;
                latestTime = request.addedAt;
                lowestKey = key;
            }
            else if (request.priority === lowestPriority && request.addedAt > latestTime) {
                // Same priority - later request gets evicted first
                latestTime = request.addedAt;
                lowestKey = key;
            }
        }
        return lowestKey;
    }
    async ensureInitialized() {
        if (!this.swrService) {
            await this.init();
        }
    }
}
// Singleton instance
let feedPreloaderInstance = null;
/**
 * Get the singleton feed preloader instance
 */
export function getFeedPreloader() {
    if (!feedPreloaderInstance) {
        feedPreloaderInstance = new FeedPreloader();
    }
    return feedPreloaderInstance;
}
/**
 * Initialize and return the feed preloader
 */
export async function initFeedPreloader(config) {
    if (!feedPreloaderInstance) {
        feedPreloaderInstance = new FeedPreloader(config);
    }
    else if (config) {
        feedPreloaderInstance.setConfig(config);
    }
    await feedPreloaderInstance.init();
    return feedPreloaderInstance;
}
/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetFeedPreloader() {
    if (feedPreloaderInstance) {
        feedPreloaderInstance.dispose();
        feedPreloaderInstance = null;
    }
}
//# sourceMappingURL=feedPreloader.js.map