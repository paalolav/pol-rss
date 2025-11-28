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
/**
 * Performance metrics summary
 */
export interface CacheMetrics {
    /** Total cache hits */
    hits: number;
    /** Total cache misses */
    misses: number;
    /** Hit rate (hits / total) */
    hitRate: number;
    /** Average fetch time in ms */
    averageFetchTime: number;
    /** Average parse time in ms */
    averageParseTime: number;
    /** Current cache size in entries */
    cacheEntryCount: number;
    /** Current cache size in bytes */
    cacheSizeBytes: number;
    /** Oldest entry timestamp */
    oldestEntryTime: number | null;
    /** Newest entry timestamp */
    newestEntryTime: number | null;
    /** Total network bytes fetched */
    totalBytesTransferred: number;
    /** Average entry age in ms */
    averageEntryAge: number;
}
/**
 * Individual operation timing
 */
export interface OperationTiming {
    /** Operation type */
    type: 'fetch' | 'parse' | 'cache_read' | 'cache_write';
    /** Duration in ms */
    duration: number;
    /** Timestamp when operation occurred */
    timestamp: number;
    /** Cache key involved */
    key: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Cache event for logging
 */
export interface CacheEvent {
    /** Event type */
    type: 'hit' | 'miss' | 'eviction' | 'expiration' | 'error';
    /** Cache key involved */
    key: string;
    /** Timestamp when event occurred */
    timestamp: number;
    /** Source (memory, indexeddb) */
    source?: 'memory' | 'indexeddb';
    /** Additional details */
    details?: Record<string, unknown>;
}
/**
 * Performance monitor configuration
 */
export interface PerformanceMonitorConfig {
    /** Whether monitoring is enabled (default: true) */
    enabled: boolean;
    /** Maximum events to store in history (default: 1000) */
    maxHistorySize: number;
    /** Maximum timings to store (default: 500) */
    maxTimingsSize: number;
    /** Whether to log to console in debug mode (default: false) */
    consoleLogging: boolean;
    /** Sample rate for detailed metrics (0-1, default: 1) */
    sampleRate: number;
}
/**
 * Performance Monitor
 *
 * Tracks and reports cache performance metrics.
 */
export declare class PerformanceMonitor {
    private config;
    private hits;
    private misses;
    private fetchTimings;
    private parseTimings;
    private cacheReadTimings;
    private cacheWriteTimings;
    private events;
    private entryTimestamps;
    private totalBytesTransferred;
    constructor(config?: Partial<PerformanceMonitorConfig>);
    /**
     * Record a cache hit
     */
    recordHit(key: string, source?: 'memory' | 'indexeddb'): void;
    /**
     * Record a cache miss
     */
    recordMiss(key: string): void;
    /**
     * Record a fetch operation timing
     */
    recordFetch(key: string, duration: number, bytesTransferred?: number): void;
    /**
     * Record a parse operation timing
     */
    recordParse(key: string, duration: number): void;
    /**
     * Record a cache read timing
     */
    recordCacheRead(key: string, duration: number): void;
    /**
     * Record a cache write timing
     */
    recordCacheWrite(key: string, duration: number, size?: number): void;
    /**
     * Record a cache eviction
     */
    recordEviction(key: string, reason?: string): void;
    /**
     * Record a cache entry expiration
     */
    recordExpiration(key: string): void;
    /**
     * Record an error
     */
    recordError(key: string, error: Error): void;
    /**
     * Get current metrics
     */
    getMetrics(cacheEntryCount?: number, cacheSizeBytes?: number): CacheMetrics;
    /**
     * Get detailed timing statistics
     */
    getTimingStats(): {
        fetch: {
            avg: number;
            min: number;
            max: number;
            count: number;
        };
        parse: {
            avg: number;
            min: number;
            max: number;
            count: number;
        };
        cacheRead: {
            avg: number;
            min: number;
            max: number;
            count: number;
        };
        cacheWrite: {
            avg: number;
            min: number;
            max: number;
            count: number;
        };
    };
    /**
     * Get recent events
     */
    getRecentEvents(count?: number): CacheEvent[];
    /**
     * Get events by type
     */
    getEventsByType(type: CacheEvent['type']): CacheEvent[];
    /**
     * Get hit rate for a specific time window
     */
    getHitRateForWindow(windowMs: number): number;
    /**
     * Generate a performance report
     */
    generateReport(cacheEntryCount?: number, cacheSizeBytes?: number): string;
    /**
     * Reset all metrics
     */
    reset(): void;
    /**
     * Update configuration
     */
    setConfig(config: Partial<PerformanceMonitorConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): PerformanceMonitorConfig;
    /**
     * Enable console logging
     */
    enableConsoleLogging(): void;
    /**
     * Disable console logging
     */
    disableConsoleLogging(): void;
    /**
     * Check if monitoring is enabled
     */
    isEnabled(): boolean;
    private shouldSample;
    private addTiming;
    private addEvent;
    private updateEntryAccess;
    private calculateAverage;
    private getTimingStatsForArray;
    private formatBytes;
    private formatDuration;
}
/**
 * Get the singleton performance monitor instance
 */
export declare function getPerformanceMonitor(): PerformanceMonitor;
/**
 * Reset the singleton instance (mainly for testing)
 */
export declare function resetPerformanceMonitor(): void;
/**
 * Create a timing helper for measuring operations
 */
export declare function createTimingHelper(monitor: PerformanceMonitor, key: string): {
    recordFetch: (bytesTransferred?: number) => void;
    recordParse: () => void;
    recordCacheRead: () => void;
    recordCacheWrite: (size?: number) => void;
};
//# sourceMappingURL=performanceMonitor.d.ts.map