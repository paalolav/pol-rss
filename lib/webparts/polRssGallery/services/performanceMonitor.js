/**
 * Performance Monitor Service
 *
 * Tracks cache performance metrics for optimization and debugging.
 * Features:
 * - Cache hit/miss tracking
 * - Fetch and parse time measurements
 * - Entry age statistics
 * - Performance metrics logging
 * - Debug panel support
 */
const DEFAULT_CONFIG = {
    enabled: true,
    maxHistorySize: 1000,
    maxTimingsSize: 500,
    consoleLogging: false,
    sampleRate: 1
};
/**
 * Performance Monitor
 *
 * Tracks and reports cache performance metrics.
 */
export class PerformanceMonitor {
    constructor(config = {}) {
        this.hits = 0;
        this.misses = 0;
        this.fetchTimings = [];
        this.parseTimings = [];
        this.cacheReadTimings = [];
        this.cacheWriteTimings = [];
        this.events = [];
        this.entryTimestamps = new Map();
        this.totalBytesTransferred = 0;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Record a cache hit
     */
    recordHit(key, source = 'memory') {
        if (!this.shouldSample())
            return;
        this.hits++;
        this.addEvent({ type: 'hit', key, timestamp: Date.now(), source });
        this.updateEntryAccess(key);
        if (this.config.consoleLogging) {
            console.debug(`[Cache HIT] ${key} from ${source}`);
        }
    }
    /**
     * Record a cache miss
     */
    recordMiss(key) {
        if (!this.shouldSample())
            return;
        this.misses++;
        this.addEvent({ type: 'miss', key, timestamp: Date.now() });
        if (this.config.consoleLogging) {
            console.debug(`[Cache MISS] ${key}`);
        }
    }
    /**
     * Record a fetch operation timing
     */
    recordFetch(key, duration, bytesTransferred) {
        if (!this.shouldSample())
            return;
        this.addTiming(this.fetchTimings, duration);
        if (bytesTransferred) {
            this.totalBytesTransferred += bytesTransferred;
        }
        if (this.config.consoleLogging) {
            console.debug(`[Fetch] ${key}: ${duration}ms${bytesTransferred ? `, ${bytesTransferred} bytes` : ''}`);
        }
    }
    /**
     * Record a parse operation timing
     */
    recordParse(key, duration) {
        if (!this.shouldSample())
            return;
        this.addTiming(this.parseTimings, duration);
        if (this.config.consoleLogging) {
            console.debug(`[Parse] ${key}: ${duration}ms`);
        }
    }
    /**
     * Record a cache read timing
     */
    recordCacheRead(key, duration) {
        if (!this.shouldSample())
            return;
        this.addTiming(this.cacheReadTimings, duration);
    }
    /**
     * Record a cache write timing
     */
    recordCacheWrite(key, duration, size) {
        if (!this.shouldSample())
            return;
        this.addTiming(this.cacheWriteTimings, duration);
        this.entryTimestamps.set(key, {
            created: Date.now(),
            lastAccessed: Date.now()
        });
        if (this.config.consoleLogging) {
            console.debug(`[Cache Write] ${key}: ${duration}ms${size ? `, ${size} bytes` : ''}`);
        }
    }
    /**
     * Record a cache eviction
     */
    recordEviction(key, reason = 'lru') {
        if (!this.shouldSample())
            return;
        this.addEvent({
            type: 'eviction',
            key,
            timestamp: Date.now(),
            details: { reason }
        });
        this.entryTimestamps.delete(key);
        if (this.config.consoleLogging) {
            console.debug(`[Eviction] ${key}: ${reason}`);
        }
    }
    /**
     * Record a cache entry expiration
     */
    recordExpiration(key) {
        if (!this.shouldSample())
            return;
        this.addEvent({ type: 'expiration', key, timestamp: Date.now() });
        this.entryTimestamps.delete(key);
        if (this.config.consoleLogging) {
            console.debug(`[Expiration] ${key}`);
        }
    }
    /**
     * Record an error
     */
    recordError(key, error) {
        this.addEvent({
            type: 'error',
            key,
            timestamp: Date.now(),
            details: { message: error.message, name: error.name }
        });
        if (this.config.consoleLogging) {
            console.error(`[Cache Error] ${key}:`, error);
        }
    }
    /**
     * Get current metrics
     */
    getMetrics(cacheEntryCount = 0, cacheSizeBytes = 0) {
        const total = this.hits + this.misses;
        const now = Date.now();
        // Calculate entry ages
        let oldestEntryTime = null;
        let newestEntryTime = null;
        let totalAge = 0;
        let entryCount = 0;
        for (const [, timestamps] of this.entryTimestamps) {
            if (oldestEntryTime === null || timestamps.created < oldestEntryTime) {
                oldestEntryTime = timestamps.created;
            }
            if (newestEntryTime === null || timestamps.created > newestEntryTime) {
                newestEntryTime = timestamps.created;
            }
            totalAge += now - timestamps.created;
            entryCount++;
        }
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? this.hits / total : 0,
            averageFetchTime: this.calculateAverage(this.fetchTimings),
            averageParseTime: this.calculateAverage(this.parseTimings),
            cacheEntryCount,
            cacheSizeBytes,
            oldestEntryTime,
            newestEntryTime,
            totalBytesTransferred: this.totalBytesTransferred,
            averageEntryAge: entryCount > 0 ? totalAge / entryCount : 0
        };
    }
    /**
     * Get detailed timing statistics
     */
    getTimingStats() {
        return {
            fetch: this.getTimingStatsForArray(this.fetchTimings),
            parse: this.getTimingStatsForArray(this.parseTimings),
            cacheRead: this.getTimingStatsForArray(this.cacheReadTimings),
            cacheWrite: this.getTimingStatsForArray(this.cacheWriteTimings)
        };
    }
    /**
     * Get recent events
     */
    getRecentEvents(count = 100) {
        return this.events.slice(-count);
    }
    /**
     * Get events by type
     */
    getEventsByType(type) {
        return this.events.filter(e => e.type === type);
    }
    /**
     * Get hit rate for a specific time window
     */
    getHitRateForWindow(windowMs) {
        const cutoff = Date.now() - windowMs;
        const recentEvents = this.events.filter(e => e.timestamp >= cutoff && (e.type === 'hit' || e.type === 'miss'));
        const hits = recentEvents.filter(e => e.type === 'hit').length;
        const total = recentEvents.length;
        return total > 0 ? hits / total : 0;
    }
    /**
     * Generate a performance report
     */
    generateReport(cacheEntryCount = 0, cacheSizeBytes = 0) {
        const metrics = this.getMetrics(cacheEntryCount, cacheSizeBytes);
        const timingStats = this.getTimingStats();
        const lines = [
            '=== Cache Performance Report ===',
            '',
            '--- Cache Effectiveness ---',
            `Total requests: ${metrics.hits + metrics.misses}`,
            `Cache hits: ${metrics.hits}`,
            `Cache misses: ${metrics.misses}`,
            `Hit rate: ${(metrics.hitRate * 100).toFixed(1)}%`,
            '',
            '--- Timing Statistics ---',
            `Average fetch time: ${metrics.averageFetchTime.toFixed(2)}ms`,
            `Average parse time: ${metrics.averageParseTime.toFixed(2)}ms`,
            `Fetch timings: min=${timingStats.fetch.min}ms, max=${timingStats.fetch.max}ms`,
            `Parse timings: min=${timingStats.parse.min}ms, max=${timingStats.parse.max}ms`,
            '',
            '--- Cache State ---',
            `Current entries: ${cacheEntryCount}`,
            `Total size: ${this.formatBytes(cacheSizeBytes)}`,
            `Total data transferred: ${this.formatBytes(metrics.totalBytesTransferred)}`,
            `Average entry age: ${this.formatDuration(metrics.averageEntryAge)}`,
            '',
            '--- Recent Activity ---',
            `Recent hits (last 5min): ${this.getEventsByType('hit').filter(e => e.timestamp > Date.now() - 300000).length}`,
            `Recent misses (last 5min): ${this.getEventsByType('miss').filter(e => e.timestamp > Date.now() - 300000).length}`,
            `Recent evictions (last 5min): ${this.getEventsByType('eviction').filter(e => e.timestamp > Date.now() - 300000).length}`,
            ''
        ];
        return lines.join('\n');
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.hits = 0;
        this.misses = 0;
        this.fetchTimings = [];
        this.parseTimings = [];
        this.cacheReadTimings = [];
        this.cacheWriteTimings = [];
        this.events = [];
        this.entryTimestamps.clear();
        this.totalBytesTransferred = 0;
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
     * Enable console logging
     */
    enableConsoleLogging() {
        this.config.consoleLogging = true;
    }
    /**
     * Disable console logging
     */
    disableConsoleLogging() {
        this.config.consoleLogging = false;
    }
    /**
     * Check if monitoring is enabled
     */
    isEnabled() {
        return this.config.enabled;
    }
    // Private helper methods
    shouldSample() {
        if (!this.config.enabled)
            return false;
        if (this.config.sampleRate >= 1)
            return true;
        return Math.random() < this.config.sampleRate;
    }
    addTiming(array, duration) {
        array.push(duration);
        if (array.length > this.config.maxTimingsSize) {
            array.shift();
        }
    }
    addEvent(event) {
        this.events.push(event);
        if (this.events.length > this.config.maxHistorySize) {
            this.events.shift();
        }
    }
    updateEntryAccess(key) {
        const entry = this.entryTimestamps.get(key);
        if (entry) {
            entry.lastAccessed = Date.now();
        }
    }
    calculateAverage(array) {
        if (array.length === 0)
            return 0;
        return array.reduce((a, b) => a + b, 0) / array.length;
    }
    getTimingStatsForArray(array) {
        if (array.length === 0) {
            return { avg: 0, min: 0, max: 0, count: 0 };
        }
        return {
            avg: this.calculateAverage(array),
            min: Math.min(...array),
            max: Math.max(...array),
            count: array.length
        };
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    }
    formatDuration(ms) {
        if (ms < 1000)
            return `${Math.round(ms)}ms`;
        if (ms < 60000)
            return `${(ms / 1000).toFixed(1)}s`;
        if (ms < 3600000)
            return `${(ms / 60000).toFixed(1)}min`;
        return `${(ms / 3600000).toFixed(1)}h`;
    }
}
// Singleton instance
let performanceMonitorInstance = null;
/**
 * Get the singleton performance monitor instance
 */
export function getPerformanceMonitor() {
    if (!performanceMonitorInstance) {
        performanceMonitorInstance = new PerformanceMonitor();
    }
    return performanceMonitorInstance;
}
/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetPerformanceMonitor() {
    if (performanceMonitorInstance) {
        performanceMonitorInstance.reset();
        performanceMonitorInstance = null;
    }
}
/**
 * Create a timing helper for measuring operations
 */
export function createTimingHelper(monitor, key) {
    const startTime = Date.now();
    return {
        recordFetch: (bytesTransferred) => {
            monitor.recordFetch(key, Date.now() - startTime, bytesTransferred);
        },
        recordParse: () => {
            monitor.recordParse(key, Date.now() - startTime);
        },
        recordCacheRead: () => {
            monitor.recordCacheRead(key, Date.now() - startTime);
        },
        recordCacheWrite: (size) => {
            monitor.recordCacheWrite(key, Date.now() - startTime, size);
        }
    };
}
//# sourceMappingURL=performanceMonitor.js.map