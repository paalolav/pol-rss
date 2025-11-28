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
import { IndexedDBCache, IndexedDBCacheEntry, initIndexedDBCache } from './indexedDbCache';

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

const DEFAULT_CONFIG: UnifiedCacheConfig = {
  freshTime: 5 * 60 * 1000,      // 5 minutes
  staleTime: 30 * 60 * 1000,     // 30 minutes
  maxAge: 24 * 60 * 60 * 1000,   // 24 hours
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
  private memoryCache: Map<string, MemoryCacheEntry>;
  private indexedDBCache: IndexedDBCache | null = null;
  private config: UnifiedCacheConfig;
  private initPromise: Promise<void> | null = null;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<UnifiedCacheConfig> = {}) {
    this.memoryCache = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the cache service
   * Must be called before using IndexedDB features
   */
  public async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    if (this.config.useIndexedDB) {
      try {
        this.indexedDBCache = await initIndexedDBCache();
        // Preload recent entries from IndexedDB to memory
        await this.preloadFromIndexedDB();
      } catch (error) {
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
  private async preloadFromIndexedDB(): Promise<void> {
    if (!this.indexedDBCache?.isAvailable()) return;

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
    } catch (error) {
      console.warn('[UnifiedCache] Failed to preload from IndexedDB:', error);
    }
  }

  /**
   * Get a cached feed by key
   * Returns cached data and its state (fresh, stale, expired, missing)
   */
  public async get(key: string): Promise<CacheResult> {
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
    if (this.indexedDBCache?.isAvailable()) {
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
  public async set(key: string, feedUrl: string, content: ParsedFeed, options: SetOptions = {}): Promise<void> {
    const now = Date.now();
    // @ts-expect-error Reserved for future SWR implementation
    const _staleTime = options.staleTime || this.config.staleTime; // eslint-disable-line @typescript-eslint/no-unused-vars
    const maxAge = options.maxAge || this.config.maxAge;

    const size = this.estimateSize(content);

    // Store in memory (L1)
    const memoryEntry: MemoryCacheEntry = {
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
    if (this.indexedDBCache?.isAvailable()) {
      const indexedEntry: IndexedDBCacheEntry = {
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
  public async has(key: string): Promise<boolean> {
    const result = await this.get(key);
    return result.state !== 'missing' && result.state !== 'expired';
  }

  /**
   * Delete a specific key from both cache layers
   */
  public async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.indexedDBCache?.isAvailable()) {
      await this.indexedDBCache.delete(key);
    }
  }

  /**
   * Clear all cached data
   */
  public async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.indexedDBCache?.isAvailable()) {
      await this.indexedDBCache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  public async getStats(): Promise<{
    memoryEntries: number;
    memorySize: number;
    indexedDBEntries: number;
    indexedDBSize: number;
  }> {
    let memorySize = 0;
    for (const entry of this.memoryCache.values()) {
      memorySize += entry.size;
    }

    let indexedDBEntries = 0;
    let indexedDBSize = 0;

    if (this.indexedDBCache?.isAvailable()) {
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
  public async cleanup(): Promise<{ memoryRemoved: number; indexedDBRemoved: number }> {
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
    if (this.indexedDBCache?.isAvailable()) {
      indexedDBRemoved = await this.indexedDBCache.deleteExpired();
    }

    return { memoryRemoved, indexedDBRemoved };
  }

  /**
   * Get all keys currently in cache
   */
  public async getAllKeys(): Promise<string[]> {
    const keys = new Set<string>(this.memoryCache.keys());

    if (this.indexedDBCache?.isAvailable()) {
      const indexedKeys = await this.indexedDBCache.getAllKeys();
      indexedKeys.forEach(key => keys.add(key));
    }

    return Array.from(keys);
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<UnifiedCacheConfig>): void {
    this.config = { ...this.config, ...config };

    // Re-enforce memory limit if max entries changed
    if (config.maxMemoryEntries !== undefined) {
      this.enforceMemoryLimit();
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): UnifiedCacheConfig {
    return { ...this.config };
  }

  /**
   * Check if IndexedDB is available and initialized
   */
  public isIndexedDBAvailable(): boolean {
    return this.indexedDBCache?.isAvailable() || false;
  }

  /**
   * Stop the cache service and cleanup resources
   */
  public dispose(): void {
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
  private getCacheState(fetchedAt: number, staleAt: number, expiresAt: number): CacheState {
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
  private promoteToMemory(key: string, entry: IndexedDBCacheEntry): void {
    const memoryEntry: MemoryCacheEntry = {
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
  private enforceMemoryLimit(): void {
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
  private estimateSize(content: ParsedFeed): number {
    try {
      return JSON.stringify(content).length * 2; // Approximate UTF-16 encoding
    } catch {
      return 10000; // Default estimate
    }
  }

  /**
   * Start periodic cleanup timer
   */
  private startCleanupTimer(): void {
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
  private stopCleanupTimer(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
let unifiedCacheInstance: UnifiedCacheService | null = null;

/**
 * Get the singleton unified cache instance
 */
export function getUnifiedCache(): UnifiedCacheService {
  if (!unifiedCacheInstance) {
    unifiedCacheInstance = new UnifiedCacheService();
  }
  return unifiedCacheInstance;
}

/**
 * Initialize and return the unified cache
 */
export async function initUnifiedCache(config?: Partial<UnifiedCacheConfig>): Promise<UnifiedCacheService> {
  if (!unifiedCacheInstance) {
    unifiedCacheInstance = new UnifiedCacheService(config);
  } else if (config) {
    unifiedCacheInstance.setConfig(config);
  }
  await unifiedCacheInstance.init();
  return unifiedCacheInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetUnifiedCache(): void {
  if (unifiedCacheInstance) {
    unifiedCacheInstance.dispose();
    unifiedCacheInstance = null;
  }
}
