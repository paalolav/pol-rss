/**
 * Tests for IndexedDB Cache Layer
 */

// Import fake-indexeddb to provide full IndexedDB implementation
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import {
  IndexedDBCache,
  IndexedDBCacheEntry,
  getIndexedDBCache,
  initIndexedDBCache
} from '../../src/webparts/polRssGallery/services/indexedDbCache';
import { ParsedFeed } from '../../src/webparts/polRssGallery/services/feedTypes';

// Set up fake-indexeddb before tests
beforeAll(() => {
  // Replace the mock indexedDB with fake-indexeddb
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true
  });
  // Also expose IDBKeyRange globally
  Object.defineProperty(globalThis, 'IDBKeyRange', {
    value: IDBKeyRange,
    configurable: true,
    writable: true
  });
});

// Reset IndexedDB between tests
beforeEach(() => {
  // Create fresh IndexedDB instance for each test
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true
  });
});

// Mock feed data for testing
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

const createMockEntry = (
  key: string,
  feedUrl: string = 'https://example.com/feed',
  expiresInMs: number = 3600000
): IndexedDBCacheEntry => ({
  key,
  feedUrl,
  content: createMockFeed(),
  fetchedAt: Date.now(),
  expiresAt: Date.now() + expiresInMs,
  size: 1000,
  lastAccessed: Date.now()
});

describe('IndexedDBCache', () => {
  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const cache = new IndexedDBCache();
      const result = await cache.init();

      expect(result.success).toBe(true);
      expect(result.supported).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return same promise if called multiple times', async () => {
      const cache = new IndexedDBCache();
      const promise1 = cache.init();
      const promise2 = cache.init();

      // Both should resolve to the same result
      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1.success).toBe(result2.success);
      expect(result1.supported).toBe(result2.supported);
    });

    it('should report availability after initialization', async () => {
      const cache = new IndexedDBCache();
      expect(cache.isAvailable()).toBe(false);

      await cache.init();
      expect(cache.isAvailable()).toBe(true);
    });

    it('should accept custom timeout option', async () => {
      const cache = new IndexedDBCache({ timeout: 10000 });
      const result = await cache.init();
      expect(result.success).toBe(true);
    });
  });

  describe('CRUD operations', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    describe('set and get', () => {
      it('should store and retrieve an entry', async () => {
        const entry = createMockEntry('test-key');

        const setResult = await cache.set(entry);
        expect(setResult).toBe(true);

        const retrieved = await cache.get('test-key');
        expect(retrieved).not.toBeNull();
        expect(retrieved?.key).toBe('test-key');
        expect(retrieved?.content.title).toBe('Test Feed');
      });

      it('should return null for non-existent key', async () => {
        const result = await cache.get('non-existent');
        expect(result).toBeNull();
      });

      it('should overwrite existing entry with same key', async () => {
        const entry1 = createMockEntry('same-key');
        entry1.content.title = 'First Title';

        const entry2 = createMockEntry('same-key');
        entry2.content.title = 'Second Title';

        await cache.set(entry1);
        await cache.set(entry2);

        const retrieved = await cache.get('same-key');
        expect(retrieved?.content.title).toBe('Second Title');
      });

      it('should update lastAccessed on get', async () => {
        const entry = createMockEntry('access-test');
        entry.lastAccessed = Date.now() - 10000;

        await cache.set(entry);

        // Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 10));

        await cache.get('access-test');

        // The lastAccessed should be updated (fire and forget, so we need to wait)
        await new Promise(resolve => setTimeout(resolve, 50));

        const retrieved = await cache.get('access-test');
        expect(retrieved?.lastAccessed).toBeGreaterThan(entry.lastAccessed);
      });
    });

    describe('delete', () => {
      it('should delete an existing entry', async () => {
        const entry = createMockEntry('to-delete');
        await cache.set(entry);

        const deleteResult = await cache.delete('to-delete');
        expect(deleteResult).toBe(true);

        const retrieved = await cache.get('to-delete');
        expect(retrieved).toBeNull();
      });

      it('should return true even for non-existent key', async () => {
        const result = await cache.delete('non-existent');
        expect(result).toBe(true);
      });
    });

    describe('getAll', () => {
      it('should return all entries', async () => {
        await cache.set(createMockEntry('key1'));
        await cache.set(createMockEntry('key2'));
        await cache.set(createMockEntry('key3'));

        const all = await cache.getAll();
        expect(all).toHaveLength(3);
        expect(all.map(e => e.key).sort()).toEqual(['key1', 'key2', 'key3']);
      });

      it('should return empty array when cache is empty', async () => {
        const all = await cache.getAll();
        expect(all).toEqual([]);
      });
    });

    describe('getAllKeys', () => {
      it('should return all keys', async () => {
        await cache.set(createMockEntry('key1'));
        await cache.set(createMockEntry('key2'));

        const keys = await cache.getAllKeys();
        expect(keys.sort()).toEqual(['key1', 'key2']);
      });
    });

    describe('clear', () => {
      it('should remove all entries', async () => {
        await cache.set(createMockEntry('key1'));
        await cache.set(createMockEntry('key2'));

        const clearResult = await cache.clear();
        expect(clearResult).toBe(true);

        const count = await cache.count();
        expect(count).toBe(0);
      });
    });

    describe('count', () => {
      it('should return correct count', async () => {
        expect(await cache.count()).toBe(0);

        await cache.set(createMockEntry('key1'));
        expect(await cache.count()).toBe(1);

        await cache.set(createMockEntry('key2'));
        expect(await cache.count()).toBe(2);

        await cache.delete('key1');
        expect(await cache.count()).toBe(1);
      });
    });
  });

  describe('expiration handling', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    it('should identify expired entries', async () => {
      // Create an already expired entry
      const expiredEntry = createMockEntry('expired', 'https://example.com/feed', -1000);
      await cache.set(expiredEntry);

      // Create a valid entry
      const validEntry = createMockEntry('valid', 'https://example.com/feed2', 3600000);
      await cache.set(validEntry);

      const expiredKeys = await cache.getExpiredKeys();
      expect(expiredKeys).toContain('expired');
      expect(expiredKeys).not.toContain('valid');
    });

    it('should delete expired entries', async () => {
      const expiredEntry = createMockEntry('expired1', 'https://example.com/1', -1000);
      await cache.set(expiredEntry);

      const expiredEntry2 = createMockEntry('expired2', 'https://example.com/2', -2000);
      await cache.set(expiredEntry2);

      const validEntry = createMockEntry('valid', 'https://example.com/3', 3600000);
      await cache.set(validEntry);

      const deletedCount = await cache.deleteExpired();
      expect(deletedCount).toBe(2);

      expect(await cache.get('expired1')).toBeNull();
      expect(await cache.get('expired2')).toBeNull();
      expect(await cache.get('valid')).not.toBeNull();
    });
  });

  describe('LRU eviction support', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    it('should get oldest accessed keys', async () => {
      const now = Date.now();

      // Create entries with significantly different access times
      const entry1 = createMockEntry('oldest');
      entry1.lastAccessed = now - 300000; // 5 minutes ago
      await cache.set(entry1);

      const entry2 = createMockEntry('middle');
      entry2.lastAccessed = now - 200000; // ~3 minutes ago
      await cache.set(entry2);

      const entry3 = createMockEntry('newest');
      entry3.lastAccessed = now - 100000; // ~1.5 minutes ago
      await cache.set(entry3);

      const oldestKeys = await cache.getOldestAccessedKeys(2);
      expect(oldestKeys).toHaveLength(2);
      // The oldest should come first
      expect(oldestKeys).toContain('oldest');
      expect(oldestKeys).toContain('middle');
      expect(oldestKeys).not.toContain('newest');
    });

    it('should limit results to requested count', async () => {
      for (let i = 0; i < 10; i++) {
        const entry = createMockEntry(`key${i}`);
        entry.lastAccessed = Date.now() - (10 - i) * 1000;
        await cache.set(entry);
      }

      const oldestKeys = await cache.getOldestAccessedKeys(3);
      expect(oldestKeys).toHaveLength(3);
    });
  });

  describe('metadata operations', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    it('should store and retrieve metadata', async () => {
      const result = await cache.setMetadata('lastSync', Date.now());
      expect(result).toBe(true);

      const value = await cache.getMetadata<number>('lastSync');
      expect(typeof value).toBe('number');
    });

    it('should store complex metadata objects', async () => {
      const metadata = {
        hits: 100,
        misses: 20,
        lastCleanup: Date.now()
      };

      await cache.setMetadata('stats', metadata);

      const retrieved = await cache.getMetadata<typeof metadata>('stats');
      expect(retrieved).toEqual(metadata);
    });

    it('should return null for non-existent metadata', async () => {
      const result = await cache.getMetadata('non-existent');
      expect(result).toBeNull();
    });

    it('should overwrite existing metadata', async () => {
      await cache.setMetadata('version', 1);
      await cache.setMetadata('version', 2);

      const value = await cache.getMetadata<number>('version');
      expect(value).toBe(2);
    });
  });

  describe('size tracking', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    it('should calculate total cache size', async () => {
      const entry1 = createMockEntry('key1');
      entry1.size = 1000;
      await cache.set(entry1);

      const entry2 = createMockEntry('key2');
      entry2.size = 2000;
      await cache.set(entry2);

      const totalSize = await cache.getTotalSize();
      expect(totalSize).toBe(3000);
    });

    it('should return 0 for empty cache', async () => {
      const totalSize = await cache.getTotalSize();
      expect(totalSize).toBe(0);
    });
  });

  describe('database lifecycle', () => {
    it('should close database connection', async () => {
      const cache = new IndexedDBCache();
      await cache.init();
      expect(cache.isAvailable()).toBe(true);

      cache.close();
      expect(cache.isAvailable()).toBe(false);
    });

    it('should delete entire database', async () => {
      const cache = new IndexedDBCache();
      await cache.init();
      await cache.set(createMockEntry('test'));

      const deleted = await cache.deleteDatabase();
      expect(deleted).toBe(true);

      // Reinitialize and check it's empty
      const newCache = new IndexedDBCache();
      await newCache.init();
      const count = await newCache.count();
      expect(count).toBe(0);
      newCache.close();
    });
  });

  describe('error handling', () => {
    it('should handle operations before initialization', async () => {
      const cache = new IndexedDBCache();

      expect(await cache.get('test')).toBeNull();
      expect(await cache.set(createMockEntry('test'))).toBe(false);
      expect(await cache.delete('test')).toBe(false);
      expect(await cache.getAll()).toEqual([]);
      expect(await cache.count()).toBe(0);
    });

    it('should return empty array on error from getAll', async () => {
      const cache = new IndexedDBCache();
      // Not initialized, should gracefully return empty
      const result = await cache.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('singleton helpers', () => {
    it('should return same instance from getIndexedDBCache', () => {
      // Reset the module state by re-importing would be ideal,
      // but for this test we just verify it returns an instance
      const instance1 = getIndexedDBCache();
      const instance2 = getIndexedDBCache();

      // They should be the same instance
      expect(instance1).toBe(instance2);
    });

    it('should initialize cache with initIndexedDBCache', async () => {
      const cache = await initIndexedDBCache();
      expect(cache).toBeInstanceOf(IndexedDBCache);
      expect(cache.isAvailable()).toBe(true);
      cache.close();
    });
  });

  describe('edge cases', () => {
    let cache: IndexedDBCache;

    beforeEach(async () => {
      cache = new IndexedDBCache();
      await cache.init();
    });

    afterEach(() => {
      cache.close();
    });

    it('should handle empty feed url', async () => {
      const entry = createMockEntry('empty-url', '');
      const result = await cache.set(entry);
      expect(result).toBe(true);

      const retrieved = await cache.get('empty-url');
      expect(retrieved?.feedUrl).toBe('');
    });

    it('should handle special characters in key', async () => {
      const entry = createMockEntry('key/with:special?chars&more=yes');
      const result = await cache.set(entry);
      expect(result).toBe(true);

      const retrieved = await cache.get('key/with:special?chars&more=yes');
      expect(retrieved).not.toBeNull();
    });

    it('should handle large content', async () => {
      const entry = createMockEntry('large-content');
      // Create a large content array
      entry.content.items = [];
      for (let i = 0; i < 100; i++) {
        entry.content.items.push({
          title: `Item ${i}`,
          link: `https://example.com/${i}`,
          description: 'A'.repeat(1000),
          pubDate: new Date().toISOString(),
          guid: `guid-${i}`
        });
      }
      entry.size = JSON.stringify(entry.content).length;

      const result = await cache.set(entry);
      expect(result).toBe(true);

      const retrieved = await cache.get('large-content');
      expect(retrieved?.content.items).toHaveLength(100);
    });

    it('should handle concurrent operations', async () => {
      // Perform multiple operations concurrently
      const operations = [
        cache.set(createMockEntry('concurrent1')),
        cache.set(createMockEntry('concurrent2')),
        cache.set(createMockEntry('concurrent3'))
      ];

      const results = await Promise.all(operations);
      expect(results).toEqual([true, true, true]);

      const count = await cache.count();
      expect(count).toBe(3);
    });

    it('should handle rapid set/get cycles', async () => {
      for (let i = 0; i < 20; i++) {
        await cache.set(createMockEntry(`rapid-${i}`));
        const retrieved = await cache.get(`rapid-${i}`);
        expect(retrieved).not.toBeNull();
      }

      const count = await cache.count();
      expect(count).toBe(20);
    });
  });
});
