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

const DEFAULT_CONFIG: CacheSizeConfig = {
  maxMemoryEntries: 50,
  maxIndexedDBSize: 50 * 1024 * 1024, // 50MB
  evictionStrategy: 'lru',
  warningThreshold: 0.8,
  evictionBatchPercent: 0.1
};

/**
 * Entry tracking for size management
 */
interface TrackedEntry {
  key: string;
  size: number;
  lastAccessed: number;
  accessCount: number;
  expiresAt: number;
}

/**
 * Cache Size Manager
 *
 * Monitors and manages cache size across memory and IndexedDB layers.
 */
export class CacheSizeManager {
  private config: CacheSizeConfig;
  private memoryEntries: Map<string, TrackedEntry> = new Map();
  private lastCleanup: number | null = null;
  private indexedDBCache: IndexedDBCache | null = null;

  constructor(config: Partial<CacheSizeConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set the IndexedDB cache reference for size tracking
   */
  public setIndexedDBCache(cache: IndexedDBCache): void {
    this.indexedDBCache = cache;
  }

  /**
   * Track a new entry being added to memory cache
   */
  public trackMemoryEntry(key: string, content: ParsedFeed, expiresAt: number): void {
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
  public recordAccess(key: string): void {
    const entry = this.memoryEntries.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
      entry.accessCount++;
    }
  }

  /**
   * Remove tracking for an entry
   */
  public untrackEntry(key: string): void {
    this.memoryEntries.delete(key);
  }

  /**
   * Check if memory cache should trigger eviction
   */
  public shouldEvictMemory(): boolean {
    return this.memoryEntries.size > this.config.maxMemoryEntries;
  }

  /**
   * Check if IndexedDB cache should trigger eviction
   */
  public async shouldEvictIndexedDB(): Promise<boolean> {
    if (!this.indexedDBCache?.isAvailable()) {
      return false;
    }

    const totalSize = await this.indexedDBCache.getTotalSize();
    return totalSize > this.config.maxIndexedDBSize;
  }

  /**
   * Get entries to evict from memory based on strategy
   */
  public getMemoryEvictionCandidates(count: number = 0): string[] {
    const targetCount = count || Math.ceil(
      this.memoryEntries.size * this.config.evictionBatchPercent
    );

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
  public async getIndexedDBEvictionCandidates(count: number = 0): Promise<string[]> {
    if (!this.indexedDBCache?.isAvailable()) {
      return [];
    }

    const entries = await this.indexedDBCache.getAll();
    const targetCount = count || Math.ceil(
      entries.length * this.config.evictionBatchPercent
    );

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
  public evictFromMemory(keys: string[]): number {
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
  public async evictFromIndexedDB(keys: string[]): Promise<number> {
    if (!this.indexedDBCache?.isAvailable()) {
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
  public async performEvictionIfNeeded(): Promise<EvictionResult> {
    const result: EvictionResult = {
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
      const sizeBefore = await this.indexedDBCache!.getTotalSize();
      const candidates = await this.getIndexedDBEvictionCandidates();
      result.indexedDBEvicted = await this.evictFromIndexedDB(candidates);
      const sizeAfter = await this.indexedDBCache!.getTotalSize();
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
  public async getStats(): Promise<CacheSizeStats> {
    // Calculate memory stats
    let memorySize = 0;
    for (const entry of this.memoryEntries.values()) {
      memorySize += entry.size;
    }

    // Calculate IndexedDB stats
    let indexedDBEntries = 0;
    let indexedDBSize = 0;
    if (this.indexedDBCache?.isAvailable()) {
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
  public getEntrySize(key: string): number {
    return this.memoryEntries.get(key)?.size || 0;
  }

  /**
   * Get current memory entry count
   */
  public getMemoryEntryCount(): number {
    return this.memoryEntries.size;
  }

  /**
   * Get current memory size total
   */
  public getCurrentMemorySize(): number {
    let total = 0;
    for (const entry of this.memoryEntries.values()) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Clear all expired entries
   */
  public clearExpired(): number {
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
  public clear(): void {
    this.memoryEntries.clear();
    this.lastCleanup = null;
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<CacheSizeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): CacheSizeConfig {
    return { ...this.config };
  }

  // Private methods

  /**
   * Estimate the size of a feed object in bytes
   */
  private estimateSize(content: ParsedFeed): number {
    try {
      // JSON.stringify gives a reasonable estimate
      // Multiply by 2 for UTF-16 encoding overhead
      return JSON.stringify(content).length * 2;
    } catch {
      // Fallback estimate
      return 10000;
    }
  }
}

// Singleton instance
let cacheSizeManagerInstance: CacheSizeManager | null = null;

/**
 * Get the singleton cache size manager instance
 */
export function getCacheSizeManager(): CacheSizeManager {
  if (!cacheSizeManagerInstance) {
    cacheSizeManagerInstance = new CacheSizeManager();
  }
  return cacheSizeManagerInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetCacheSizeManager(): void {
  if (cacheSizeManagerInstance) {
    cacheSizeManagerInstance.clear();
    cacheSizeManagerInstance = null;
  }
}
