/**
 * Tests for Unified Cache Service
 */

import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import {
  UnifiedCacheService,
  CacheState,
  CacheResult,
  getUnifiedCache,
  initUnifiedCache,
  resetUnifiedCache
} from '../../src/webparts/polRssGallery/services/unifiedCacheService';
import { ParsedFeed } from '../../src/webparts/polRssGallery/services/feedTypes';

// Set up fake-indexeddb
beforeAll(() => {
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true
  });
  Object.defineProperty(globalThis, 'IDBKeyRange', {
    value: IDBKeyRange,
    configurable: true,
    writable: true
  });
});

beforeEach(() => {
  // Reset singleton between tests
  resetUnifiedCache();
  // Fresh IndexedDB for each test
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true
  });
});

// Mock feed data
const createMockFeed = (title: string = 'Test Feed'): ParsedFeed => ({
  title,
  description: 'Test description',
  link: 'https://example.com',
  items: [
    {
      title: 'Item 1',
      link: 'https://example.com/1',
      description: 'Item 1 description',
      pubDate: new Date().toISOString(),
      guid: 'guid-1'
    }
  ],
  lastBuildDate: new Date().toISOString(),
  language: 'en',
  feedUrl: 'https://example.com/feed'
});

describe('UnifiedCacheService', () => {
  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const cache = new UnifiedCacheService();
      await cache.init();
      expect(cache.isIndexedDBAvailable()).toBe(true);
      cache.dispose();
    });

    it('should work without IndexedDB', async () => {
      const cache = new UnifiedCacheService({ useIndexedDB: false });
      await cache.init();
      expect(cache.isIndexedDBAvailable()).toBe(false);
      cache.dispose();
    });

    it('should handle multiple init calls', async () => {
      const cache = new UnifiedCacheService();
      await cache.init();
      await cache.init(); // Should not throw
      expect(cache.isIndexedDBAvailable()).toBe(true);
      cache.dispose();
    });
  });

  describe('set and get operations', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({
        freshTime: 60000, // 1 minute
        staleTime: 120000, // 2 minutes
        maxAge: 300000 // 5 minutes
      });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should store and retrieve a feed', async () => {
      const feed = createMockFeed('My Feed');
      await cache.set('key1', 'https://example.com/feed', feed);

      const result = await cache.get('key1');
      expect(result.data).not.toBeNull();
      expect(result.data?.title).toBe('My Feed');
      expect(result.state).toBe('fresh');
      expect(result.source).toBe('memory');
    });

    it('should return missing state for non-existent key', async () => {
      const result = await cache.get('non-existent');
      expect(result.data).toBeNull();
      expect(result.state).toBe('missing');
      expect(result.source).toBeNull();
    });

    it('should overwrite existing entry', async () => {
      const feed1 = createMockFeed('First');
      const feed2 = createMockFeed('Second');

      await cache.set('key1', 'https://example.com/feed', feed1);
      await cache.set('key1', 'https://example.com/feed', feed2);

      const result = await cache.get('key1');
      expect(result.data?.title).toBe('Second');
    });

    it('should track age correctly', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      // Small delay to ensure age > 0
      await new Promise(resolve => setTimeout(resolve, 10));

      const result = await cache.get('key1');
      expect(result.age).toBeGreaterThan(0);
      expect(result.fetchedAt).toBeLessThan(Date.now());
    });
  });

  describe('cache state transitions', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({
        freshTime: 50, // 50ms for testing
        staleTime: 100, // 100ms
        maxAge: 200, // 200ms
        useIndexedDB: false // Memory only for faster tests
      });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should return fresh state for new entries', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      const result = await cache.get('key1');
      expect(result.state).toBe('fresh');
    });

    it('should transition to stale state', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      // Wait for fresh time to pass
      await new Promise(resolve => setTimeout(resolve, 60));

      const result = await cache.get('key1');
      expect(result.state).toBe('stale');
      expect(result.data).not.toBeNull();
    });

    it('should transition to expired state', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      // Wait for max age to pass
      await new Promise(resolve => setTimeout(resolve, 210));

      const result = await cache.get('key1');
      expect(result.state).toBe('missing'); // Expired entries are treated as missing
    });
  });

  describe('two-tier caching', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({
        maxMemoryEntries: 2 // Small limit for testing
      });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should persist to IndexedDB', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      // Wait for async IndexedDB write
      await new Promise(resolve => setTimeout(resolve, 50));

      const stats = await cache.getStats();
      expect(stats.indexedDBEntries).toBeGreaterThan(0);
    });

    it('should promote from IndexedDB to memory on read', async () => {
      const feed = createMockFeed();
      await cache.set('key1', 'https://example.com/feed', feed);

      // Wait for IndexedDB write
      await new Promise(resolve => setTimeout(resolve, 50));

      // Clear memory but keep IndexedDB
      cache['memoryCache'].clear();

      // Get should promote from IndexedDB
      const result = await cache.get('key1');
      expect(result.data).not.toBeNull();
      expect(result.source).toBe('indexeddb');

      // Second get should be from memory
      const result2 = await cache.get('key1');
      expect(result2.source).toBe('memory');
    });

    it('should enforce memory limit with LRU eviction', async () => {
      // Set 3 entries with limit of 2
      await cache.set('key1', 'url1', createMockFeed('Feed 1'));
      await new Promise(resolve => setTimeout(resolve, 10));
      await cache.set('key2', 'url2', createMockFeed('Feed 2'));
      await new Promise(resolve => setTimeout(resolve, 10));
      await cache.set('key3', 'url3', createMockFeed('Feed 3'));

      // Memory should only have 2 entries (LRU evicted oldest)
      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(2);
    });
  });

  describe('delete and clear', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService();
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should delete a specific key', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      await cache.set('key2', 'url2', createMockFeed());

      await cache.delete('key1');

      expect(await cache.has('key1')).toBe(false);
      expect(await cache.has('key2')).toBe(true);
    });

    it('should clear all entries', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      await cache.set('key2', 'url2', createMockFeed());

      await cache.clear();

      expect(await cache.has('key1')).toBe(false);
      expect(await cache.has('key2')).toBe(false);
    });
  });

  describe('has method', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({ useIndexedDB: false });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should return true for existing non-expired entry', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      expect(await cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      expect(await cache.has('non-existent')).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService();
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should return all keys from both layers', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      await cache.set('key2', 'url2', createMockFeed());

      const keys = await cache.getAllKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    it('should deduplicate keys from both layers', async () => {
      await cache.set('key1', 'url1', createMockFeed());

      // Wait for IndexedDB write
      await new Promise(resolve => setTimeout(resolve, 50));

      const keys = await cache.getAllKeys();
      expect(keys.filter(k => k === 'key1')).toHaveLength(1);
    });
  });

  describe('getStats', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService();
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should return accurate statistics', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      await cache.set('key2', 'url2', createMockFeed());

      // Wait for IndexedDB writes
      await new Promise(resolve => setTimeout(resolve, 50));

      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(2);
      expect(stats.memorySize).toBeGreaterThan(0);
      expect(stats.indexedDBEntries).toBe(2);
      expect(stats.indexedDBSize).toBeGreaterThan(0);
    });

    it('should return zeros for empty cache', async () => {
      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(0);
      expect(stats.memorySize).toBe(0);
    });
  });

  describe('cleanup', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({
        maxAge: 50, // Short max age for testing
        useIndexedDB: false
      });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should remove expired entries', async () => {
      await cache.set('key1', 'url1', createMockFeed());

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));

      const result = await cache.cleanup();
      expect(result.memoryRemoved).toBeGreaterThanOrEqual(1);
    });
  });

  describe('configuration', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService();
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should return current config', () => {
      const config = cache.getConfig();
      expect(config.freshTime).toBeDefined();
      expect(config.staleTime).toBeDefined();
      expect(config.maxAge).toBeDefined();
      expect(config.maxMemoryEntries).toBeDefined();
    });

    it('should update config', () => {
      cache.setConfig({ freshTime: 10000 });
      const config = cache.getConfig();
      expect(config.freshTime).toBe(10000);
    });

    it('should enforce new memory limit after config change', async () => {
      await cache.set('key1', 'url1', createMockFeed());
      await cache.set('key2', 'url2', createMockFeed());
      await cache.set('key3', 'url3', createMockFeed());

      cache.setConfig({ maxMemoryEntries: 1 });

      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(1);
    });
  });

  describe('dispose', () => {
    it('should clean up resources', async () => {
      const cache = new UnifiedCacheService();
      await cache.init();
      await cache.set('key1', 'url1', createMockFeed());

      cache.dispose();

      // After dispose, cache should be empty
      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(0);
      expect(cache.isIndexedDBAvailable()).toBe(false);
    });
  });

  describe('singleton helpers', () => {
    it('should return same instance from getUnifiedCache', () => {
      const cache1 = getUnifiedCache();
      const cache2 = getUnifiedCache();
      expect(cache1).toBe(cache2);
    });

    it('should initialize with initUnifiedCache', async () => {
      const cache = await initUnifiedCache({ freshTime: 5000 });
      expect(cache).toBeInstanceOf(UnifiedCacheService);
      expect(cache.getConfig().freshTime).toBe(5000);
    });

    it('should reset singleton with resetUnifiedCache', async () => {
      const cache1 = await initUnifiedCache();
      await cache1.set('key1', 'url1', createMockFeed());

      resetUnifiedCache();

      const cache2 = getUnifiedCache();
      expect(cache1).not.toBe(cache2);
    });
  });

  describe('edge cases', () => {
    let cache: UnifiedCacheService;

    beforeEach(async () => {
      cache = new UnifiedCacheService({ useIndexedDB: false });
      await cache.init();
    });

    afterEach(() => {
      cache.dispose();
    });

    it('should handle empty feed content', async () => {
      const emptyFeed: ParsedFeed = {
        title: '',
        description: '',
        link: '',
        items: [],
        feedUrl: ''
      };

      await cache.set('empty', 'url', emptyFeed);
      const result = await cache.get('empty');
      expect(result.data).toEqual(emptyFeed);
    });

    it('should handle special characters in keys', async () => {
      const feed = createMockFeed();
      const key = 'key/with:special?chars&more=yes#hash';

      await cache.set(key, 'url', feed);
      const result = await cache.get(key);
      expect(result.data).not.toBeNull();
    });

    it('should handle large feeds', async () => {
      const largeFeed = createMockFeed();
      largeFeed.items = [];
      for (let i = 0; i < 100; i++) {
        largeFeed.items.push({
          title: `Item ${i}`,
          link: `https://example.com/${i}`,
          description: 'A'.repeat(1000),
          pubDate: new Date().toISOString(),
          guid: `guid-${i}`
        });
      }

      await cache.set('large', 'url', largeFeed);
      const result = await cache.get('large');
      expect(result.data?.items).toHaveLength(100);
    });

    it('should handle concurrent operations', async () => {
      const operations = [];
      for (let i = 0; i < 10; i++) {
        operations.push(cache.set(`key${i}`, `url${i}`, createMockFeed(`Feed ${i}`)));
      }

      await Promise.all(operations);

      const stats = await cache.getStats();
      expect(stats.memoryEntries).toBe(10);
    });
  });
});
