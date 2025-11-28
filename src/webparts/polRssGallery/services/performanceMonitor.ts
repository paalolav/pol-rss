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

const DEFAULT_CONFIG: PerformanceMonitorConfig = {
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
  private config: PerformanceMonitorConfig;
  private hits: number = 0;
  private misses: number = 0;
  private fetchTimings: number[] = [];
  private parseTimings: number[] = [];
  private cacheReadTimings: number[] = [];
  private cacheWriteTimings: number[] = [];
  private events: CacheEvent[] = [];
  private entryTimestamps: Map<string, { created: number; lastAccessed: number }> = new Map();
  private totalBytesTransferred: number = 0;

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Record a cache hit
   */
  public recordHit(key: string, source: 'memory' | 'indexeddb' = 'memory'): void {
    if (!this.shouldSample()) return;

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
  public recordMiss(key: string): void {
    if (!this.shouldSample()) return;

    this.misses++;
    this.addEvent({ type: 'miss', key, timestamp: Date.now() });

    if (this.config.consoleLogging) {
      console.debug(`[Cache MISS] ${key}`);
    }
  }

  /**
   * Record a fetch operation timing
   */
  public recordFetch(key: string, duration: number, bytesTransferred?: number): void {
    if (!this.shouldSample()) return;

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
  public recordParse(key: string, duration: number): void {
    if (!this.shouldSample()) return;

    this.addTiming(this.parseTimings, duration);

    if (this.config.consoleLogging) {
      console.debug(`[Parse] ${key}: ${duration}ms`);
    }
  }

  /**
   * Record a cache read timing
   */
  public recordCacheRead(key: string, duration: number): void {
    if (!this.shouldSample()) return;

    this.addTiming(this.cacheReadTimings, duration);
  }

  /**
   * Record a cache write timing
   */
  public recordCacheWrite(key: string, duration: number, size?: number): void {
    if (!this.shouldSample()) return;

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
  public recordEviction(key: string, reason: string = 'lru'): void {
    if (!this.shouldSample()) return;

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
  public recordExpiration(key: string): void {
    if (!this.shouldSample()) return;

    this.addEvent({ type: 'expiration', key, timestamp: Date.now() });
    this.entryTimestamps.delete(key);

    if (this.config.consoleLogging) {
      console.debug(`[Expiration] ${key}`);
    }
  }

  /**
   * Record an error
   */
  public recordError(key: string, error: Error): void {
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
  public getMetrics(cacheEntryCount: number = 0, cacheSizeBytes: number = 0): CacheMetrics {
    const total = this.hits + this.misses;
    const now = Date.now();

    // Calculate entry ages
    let oldestEntryTime: number | null = null;
    let newestEntryTime: number | null = null;
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
  public getTimingStats(): {
    fetch: { avg: number; min: number; max: number; count: number };
    parse: { avg: number; min: number; max: number; count: number };
    cacheRead: { avg: number; min: number; max: number; count: number };
    cacheWrite: { avg: number; min: number; max: number; count: number };
  } {
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
  public getRecentEvents(count: number = 100): CacheEvent[] {
    return this.events.slice(-count);
  }

  /**
   * Get events by type
   */
  public getEventsByType(type: CacheEvent['type']): CacheEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get hit rate for a specific time window
   */
  public getHitRateForWindow(windowMs: number): number {
    const cutoff = Date.now() - windowMs;
    const recentEvents = this.events.filter(e =>
      e.timestamp >= cutoff && (e.type === 'hit' || e.type === 'miss')
    );

    const hits = recentEvents.filter(e => e.type === 'hit').length;
    const total = recentEvents.length;

    return total > 0 ? hits / total : 0;
  }

  /**
   * Generate a performance report
   */
  public generateReport(cacheEntryCount: number = 0, cacheSizeBytes: number = 0): string {
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
  public reset(): void {
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
  public setConfig(config: Partial<PerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): PerformanceMonitorConfig {
    return { ...this.config };
  }

  /**
   * Enable console logging
   */
  public enableConsoleLogging(): void {
    this.config.consoleLogging = true;
  }

  /**
   * Disable console logging
   */
  public disableConsoleLogging(): void {
    this.config.consoleLogging = false;
  }

  /**
   * Check if monitoring is enabled
   */
  public isEnabled(): boolean {
    return this.config.enabled;
  }

  // Private helper methods

  private shouldSample(): boolean {
    if (!this.config.enabled) return false;
    if (this.config.sampleRate >= 1) return true;
    return Math.random() < this.config.sampleRate;
  }

  private addTiming(array: number[], duration: number): void {
    array.push(duration);
    if (array.length > this.config.maxTimingsSize) {
      array.shift();
    }
  }

  private addEvent(event: CacheEvent): void {
    this.events.push(event);
    if (this.events.length > this.config.maxHistorySize) {
      this.events.shift();
    }
  }

  private updateEntryAccess(key: string): void {
    const entry = this.entryTimestamps.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
    }
  }

  private calculateAverage(array: number[]): number {
    if (array.length === 0) return 0;
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  private getTimingStatsForArray(array: number[]): { avg: number; min: number; max: number; count: number } {
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

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}min`;
    return `${(ms / 3600000).toFixed(1)}h`;
  }
}

// Singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

/**
 * Get the singleton performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetPerformanceMonitor(): void {
  if (performanceMonitorInstance) {
    performanceMonitorInstance.reset();
    performanceMonitorInstance = null;
  }
}

/**
 * Create a timing helper for measuring operations
 */
export function createTimingHelper(monitor: PerformanceMonitor, key: string) {
  const startTime = Date.now();

  return {
    recordFetch: (bytesTransferred?: number) => {
      monitor.recordFetch(key, Date.now() - startTime, bytesTransferred);
    },
    recordParse: () => {
      monitor.recordParse(key, Date.now() - startTime);
    },
    recordCacheRead: () => {
      monitor.recordCacheRead(key, Date.now() - startTime);
    },
    recordCacheWrite: (size?: number) => {
      monitor.recordCacheWrite(key, Date.now() - startTime, size);
    }
  };
}
