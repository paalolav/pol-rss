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
export declare class IndexedDBCache {
    private db;
    private initPromise;
    private isSupported;
    private defaultTimeout;
    constructor(options?: IndexedDBOptions);
    /**
     * Initialize the IndexedDB database
     * Creates object stores and handles schema migrations
     */
    init(): Promise<InitResult>;
    private _doInit;
    /**
     * Check if IndexedDB is supported in this browser
     */
    private checkSupport;
    /**
     * Open the IndexedDB database with schema creation
     */
    private openDatabase;
    /**
     * Create or upgrade database schema
     */
    private createSchema;
    /**
     * Get a cached feed entry by key
     */
    get(key: string): Promise<IndexedDBCacheEntry | null>;
    /**
     * Store a feed entry
     */
    set(entry: IndexedDBCacheEntry): Promise<boolean>;
    /**
     * Delete a feed entry by key
     */
    delete(key: string): Promise<boolean>;
    /**
     * Get all cached feed entries
     */
    getAll(): Promise<IndexedDBCacheEntry[]>;
    /**
     * Get all keys in the cache
     */
    getAllKeys(): Promise<string[]>;
    /**
     * Clear all cached feeds
     */
    clear(): Promise<boolean>;
    /**
     * Get the number of cached entries
     */
    count(): Promise<number>;
    /**
     * Get expired entries (expiresAt < now)
     */
    getExpiredKeys(): Promise<string[]>;
    /**
     * Delete expired entries
     */
    deleteExpired(): Promise<number>;
    /**
     * Get entries sorted by last accessed (oldest first) - for LRU eviction
     */
    getOldestAccessedKeys(limit: number): Promise<string[]>;
    /**
     * Get metadata value
     */
    getMetadata<T = unknown>(key: string): Promise<T | null>;
    /**
     * Set metadata value
     */
    setMetadata(key: string, value: unknown): Promise<boolean>;
    /**
     * Get approximate total cache size
     */
    getTotalSize(): Promise<number>;
    /**
     * Check if IndexedDB is available and initialized
     */
    isAvailable(): boolean;
    /**
     * Close the database connection
     */
    close(): void;
    /**
     * Delete the entire database
     */
    deleteDatabase(): Promise<boolean>;
    /**
     * Update last accessed timestamp for an entry
     */
    private updateLastAccessed;
    /**
     * Check if an error is a quota exceeded error
     */
    private isQuotaError;
    /**
     * Cleanup oldest entries to make space
     */
    private cleanupForSpace;
    /**
     * Generic transaction helper
     */
    private performTransaction;
    /**
     * Cursor-based transaction helper for iteration
     */
    private performCursorTransaction;
}
/**
 * Get the singleton IndexedDB cache instance
 */
export declare function getIndexedDBCache(): IndexedDBCache;
/**
 * Initialize and return the IndexedDB cache
 */
export declare function initIndexedDBCache(): Promise<IndexedDBCache>;
//# sourceMappingURL=indexedDbCache.d.ts.map