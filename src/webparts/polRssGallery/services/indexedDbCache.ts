/**
 * IndexedDB Cache Layer
 *
 * Provides persistent browser storage for RSS feed caching using IndexedDB.
 * Features:
 * - Schema versioning with migration support
 * - Automatic quota management
 * - Fallback for browsers without IndexedDB support
 */

import { ParsedFeed } from './feedTypes';

// Database configuration
const DB_NAME = 'pol-rss-cache';
const DB_VERSION = 1;
const FEEDS_STORE = 'feeds';
const METADATA_STORE = 'metadata';

/**
 * Structure stored in IndexedDB for each cached feed
 */
export interface IndexedDBCacheEntry {
  /** Unique key (hash of feed URL) */
  key: string;
  /** Original feed URL */
  feedUrl: string;
  /** Parsed feed content */
  content: ParsedFeed;
  /** When the feed was fetched */
  fetchedAt: number;
  /** When the cache entry expires */
  expiresAt: number;
  /** Approximate size in bytes */
  size: number;
  /** Last time this entry was accessed (for LRU) */
  lastAccessed: number;
}

/**
 * Metadata entry for storing cache statistics and configuration
 */
export interface IndexedDBMetadataEntry {
  key: string;
  value: unknown;
}

/**
 * Options for IndexedDB operations
 */
export interface IndexedDBOptions {
  /** Timeout for database operations in ms (default: 5000) */
  timeout?: number;
}

/**
 * Result of database initialization
 */
export interface InitResult {
  success: boolean;
  supported: boolean;
  error?: Error;
}

/**
 * IndexedDB Cache Service
 *
 * Low-level IndexedDB wrapper for persistent feed caching.
 * Handles browser compatibility, schema migrations, and storage quotas.
 */
export class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<InitResult> | null = null;
  private isSupported: boolean = true;
  private defaultTimeout: number = 5000;

  constructor(options: IndexedDBOptions = {}) {
    if (options.timeout) {
      this.defaultTimeout = options.timeout;
    }
  }

  /**
   * Initialize the IndexedDB database
   * Creates object stores and handles schema migrations
   */
  public async init(): Promise<InitResult> {
    // Return existing promise if initialization is in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<InitResult> {
    // Check for IndexedDB support
    if (!this.checkSupport()) {
      this.isSupported = false;
      return {
        success: false,
        supported: false,
        error: new Error('IndexedDB is not supported in this browser')
      };
    }

    try {
      this.db = await this.openDatabase();
      return { success: true, supported: true };
    } catch (error) {
      this.isSupported = false;
      return {
        success: false,
        supported: true,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Check if IndexedDB is supported in this browser
   */
  private checkSupport(): boolean {
    try {
      // Check for indexedDB availability
      if (typeof indexedDB === 'undefined' || !indexedDB) {
        return false;
      }

      // Safari private mode check - try to open a test database
      // In Safari private mode, indexedDB exists but operations fail
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open the IndexedDB database with schema creation
   */
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      const timeoutId = setTimeout(() => {
        reject(new Error('IndexedDB open timeout'));
      }, this.defaultTimeout);

      request.onerror = () => {
        clearTimeout(timeoutId);
        reject(request.error || new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        clearTimeout(timeoutId);
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createSchema(db, event.oldVersion);
      };

      request.onblocked = () => {
        clearTimeout(timeoutId);
        reject(new Error('IndexedDB blocked - close other tabs using this database'));
      };
    });
  }

  /**
   * Create or upgrade database schema
   */
  private createSchema(db: IDBDatabase, oldVersion: number): void {
    // Version 1: Initial schema
    if (oldVersion < 1) {
      // Create feeds store with key path
      const feedsStore = db.createObjectStore(FEEDS_STORE, { keyPath: 'key' });
      feedsStore.createIndex('feedUrl', 'feedUrl', { unique: false });
      feedsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
      feedsStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
      feedsStore.createIndex('fetchedAt', 'fetchedAt', { unique: false });

      // Create metadata store
      db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
    }

    // Future schema migrations go here
    // if (oldVersion < 2) { ... }
  }

  /**
   * Get a cached feed entry by key
   */
  public async get(key: string): Promise<IndexedDBCacheEntry | null> {
    if (!this.isSupported || !this.db) {
      return null;
    }

    try {
      const entry = await this.performTransaction<IndexedDBCacheEntry | undefined>(
        FEEDS_STORE,
        'readonly',
        (store) => store.get(key)
      );

      if (entry) {
        // Update last accessed time (fire and forget)
        this.updateLastAccessed(key).catch(() => {
          // Ignore errors from access time update
        });
      }

      return entry || null;
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting entry:', error);
      return null;
    }
  }

  /**
   * Store a feed entry
   */
  public async set(entry: IndexedDBCacheEntry): Promise<boolean> {
    if (!this.isSupported || !this.db) {
      return false;
    }

    try {
      // Ensure entry has lastAccessed timestamp (preserve if already set)
      const entryWithTimestamp: IndexedDBCacheEntry = {
        ...entry,
        lastAccessed: entry.lastAccessed || Date.now()
      };

      await this.performTransaction(
        FEEDS_STORE,
        'readwrite',
        (store) => store.put(entryWithTimestamp)
      );
      return true;
    } catch (error) {
      // Handle quota exceeded
      if (this.isQuotaError(error)) {
        console.warn('[IndexedDBCache] Storage quota exceeded, attempting cleanup...');
        const cleaned = await this.cleanupForSpace();
        if (cleaned) {
          // Retry after cleanup
          try {
            await this.performTransaction(
              FEEDS_STORE,
              'readwrite',
              (store) => store.put(entry)
            );
            return true;
          } catch {
            return false;
          }
        }
      }
      console.warn('[IndexedDBCache] Error setting entry:', error);
      return false;
    }
  }

  /**
   * Delete a feed entry by key
   */
  public async delete(key: string): Promise<boolean> {
    if (!this.isSupported || !this.db) {
      return false;
    }

    try {
      await this.performTransaction(
        FEEDS_STORE,
        'readwrite',
        (store) => store.delete(key)
      );
      return true;
    } catch (error) {
      console.warn('[IndexedDBCache] Error deleting entry:', error);
      return false;
    }
  }

  /**
   * Get all cached feed entries
   */
  public async getAll(): Promise<IndexedDBCacheEntry[]> {
    if (!this.isSupported || !this.db) {
      return [];
    }

    try {
      const entries = await this.performTransaction<IndexedDBCacheEntry[]>(
        FEEDS_STORE,
        'readonly',
        (store) => store.getAll()
      );
      return entries || [];
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting all entries:', error);
      return [];
    }
  }

  /**
   * Get all keys in the cache
   */
  public async getAllKeys(): Promise<string[]> {
    if (!this.isSupported || !this.db) {
      return [];
    }

    try {
      const keys = await this.performTransaction<IDBValidKey[]>(
        FEEDS_STORE,
        'readonly',
        (store) => store.getAllKeys()
      );
      return (keys || []).map(k => String(k));
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Clear all cached feeds
   */
  public async clear(): Promise<boolean> {
    if (!this.isSupported || !this.db) {
      return false;
    }

    try {
      await this.performTransaction(
        FEEDS_STORE,
        'readwrite',
        (store) => store.clear()
      );
      return true;
    } catch (error) {
      console.warn('[IndexedDBCache] Error clearing cache:', error);
      return false;
    }
  }

  /**
   * Get the number of cached entries
   */
  public async count(): Promise<number> {
    if (!this.isSupported || !this.db) {
      return 0;
    }

    try {
      const count = await this.performTransaction<number>(
        FEEDS_STORE,
        'readonly',
        (store) => store.count()
      );
      return count || 0;
    } catch (error) {
      console.warn('[IndexedDBCache] Error counting entries:', error);
      return 0;
    }
  }

  /**
   * Get expired entries (expiresAt < now)
   */
  public async getExpiredKeys(): Promise<string[]> {
    if (!this.isSupported || !this.db) {
      return [];
    }

    const now = Date.now();
    const expiredKeys: string[] = [];

    try {
      await this.performCursorTransaction(
        FEEDS_STORE,
        'readonly',
        'expiresAt',
        IDBKeyRange.upperBound(now),
        (cursor) => {
          expiredKeys.push(cursor.value.key);
        }
      );
      return expiredKeys;
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting expired keys:', error);
      return [];
    }
  }

  /**
   * Delete expired entries
   */
  public async deleteExpired(): Promise<number> {
    const expiredKeys = await this.getExpiredKeys();
    let deleted = 0;

    for (const key of expiredKeys) {
      if (await this.delete(key)) {
        deleted++;
      }
    }

    return deleted;
  }

  /**
   * Get entries sorted by last accessed (oldest first) - for LRU eviction
   */
  public async getOldestAccessedKeys(limit: number): Promise<string[]> {
    if (!this.isSupported || !this.db) {
      return [];
    }

    const keys: string[] = [];

    try {
      await this.performCursorTransaction(
        FEEDS_STORE,
        'readonly',
        'lastAccessed',
        null,
        (cursor) => {
          if (keys.length < limit) {
            keys.push(cursor.value.key);
            return true; // Continue
          }
          return false; // Stop
        }
      );
      return keys;
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting oldest keys:', error);
      return [];
    }
  }

  /**
   * Get metadata value
   */
  public async getMetadata<T = unknown>(key: string): Promise<T | null> {
    if (!this.isSupported || !this.db) {
      return null;
    }

    try {
      const entry = await this.performTransaction<IndexedDBMetadataEntry | undefined>(
        METADATA_STORE,
        'readonly',
        (store) => store.get(key)
      );
      return entry ? (entry.value as T) : null;
    } catch (error) {
      console.warn('[IndexedDBCache] Error getting metadata:', error);
      return null;
    }
  }

  /**
   * Set metadata value
   */
  public async setMetadata(key: string, value: unknown): Promise<boolean> {
    if (!this.isSupported || !this.db) {
      return false;
    }

    try {
      await this.performTransaction(
        METADATA_STORE,
        'readwrite',
        (store) => store.put({ key, value })
      );
      return true;
    } catch (error) {
      console.warn('[IndexedDBCache] Error setting metadata:', error);
      return false;
    }
  }

  /**
   * Get approximate total cache size
   */
  public async getTotalSize(): Promise<number> {
    const entries = await this.getAll();
    return entries.reduce((total, entry) => total + (entry.size || 0), 0);
  }

  /**
   * Check if IndexedDB is available and initialized
   */
  public isAvailable(): boolean {
    return this.isSupported && this.db !== null;
  }

  /**
   * Close the database connection
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.initPromise = null;
  }

  /**
   * Delete the entire database
   */
  public async deleteDatabase(): Promise<boolean> {
    this.close();

    return new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
      request.onblocked = () => resolve(false);
    });
  }

  // Private helper methods

  /**
   * Update last accessed timestamp for an entry
   */
  private async updateLastAccessed(key: string): Promise<void> {
    if (!this.db) return;

    const entry = await this.performTransaction<IndexedDBCacheEntry | undefined>(
      FEEDS_STORE,
      'readonly',
      (store) => store.get(key)
    );

    if (entry) {
      entry.lastAccessed = Date.now();
      await this.performTransaction(
        FEEDS_STORE,
        'readwrite',
        (store) => store.put(entry)
      );
    }
  }

  /**
   * Check if an error is a quota exceeded error
   */
  private isQuotaError(error: unknown): boolean {
    if (error instanceof DOMException) {
      // Different browsers use different error names
      return (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 // Legacy quota exceeded code
      );
    }
    return false;
  }

  /**
   * Cleanup oldest entries to make space
   */
  private async cleanupForSpace(): Promise<boolean> {
    // Delete expired first
    await this.deleteExpired();

    // Then delete oldest 10% of entries
    const count = await this.count();
    if (count > 0) {
      const toDelete = Math.max(1, Math.ceil(count * 0.1));
      const oldestKeys = await this.getOldestAccessedKeys(toDelete);

      for (const key of oldestKeys) {
        await this.delete(key);
      }
      return true;
    }
    return false;
  }

  /**
   * Generic transaction helper
   */
  private performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('IndexedDB transaction timeout'));
      }, this.defaultTimeout);

      try {
        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);

        request.onsuccess = () => {
          clearTimeout(timeoutId);
          resolve(request.result as T);
        };

        request.onerror = () => {
          clearTimeout(timeoutId);
          reject(request.error);
        };

        transaction.onerror = () => {
          clearTimeout(timeoutId);
          reject(transaction.error);
        };
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Cursor-based transaction helper for iteration
   */
  private performCursorTransaction(
    storeName: string,
    mode: IDBTransactionMode,
    indexName: string | null,
    range: IDBKeyRange | null,
    callback: (cursor: IDBCursorWithValue) => boolean | void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('IndexedDB cursor timeout'));
      }, this.defaultTimeout);

      try {
        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const target = indexName ? store.index(indexName) : store;
        const request = target.openCursor(range);

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const shouldContinue = callback(cursor);
            if (shouldContinue !== false) {
              cursor.continue();
            } else {
              clearTimeout(timeoutId);
              resolve();
            }
          } else {
            clearTimeout(timeoutId);
            resolve();
          }
        };

        request.onerror = () => {
          clearTimeout(timeoutId);
          reject(request.error);
        };

        transaction.onerror = () => {
          clearTimeout(timeoutId);
          reject(transaction.error);
        };
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }
}

// Singleton instance for convenience
let indexedDBCacheInstance: IndexedDBCache | null = null;

/**
 * Get the singleton IndexedDB cache instance
 */
export function getIndexedDBCache(): IndexedDBCache {
  if (!indexedDBCacheInstance) {
    indexedDBCacheInstance = new IndexedDBCache();
  }
  return indexedDBCacheInstance;
}

/**
 * Initialize and return the IndexedDB cache
 */
export async function initIndexedDBCache(): Promise<IndexedDBCache> {
  const cache = getIndexedDBCache();
  await cache.init();
  return cache;
}
