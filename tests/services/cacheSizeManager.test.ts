/**
 * Tests for Cache Size Manager
 */

import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import {
  CacheSizeManager,
  getCacheSizeManager,
  resetCacheSizeManager
} from '../../src/webparts/polRssGallery/services/cacheSizeManager';
import { IndexedDBCache } from '../../src/webparts/polRssGallery/services/indexedDbCache';
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
  resetCacheSizeManager();
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true
  });
});

// Mock feed data
const createMockFeed = (itemCount: number = 1): ParsedFeed => ({
  title: 'Test Feed',
  description: 'Test description',
  link: 'https://example.com',
  items: Array.from({ length: itemCount }, (_, i) => ({
    title: `Item ${i}`,
    link: `https://example.com/${i}`,
    description: 'A'.repeat(100),
    pubDate: new Date().toISOString(),
    guid: `guid-${i}`
  })),
  lastBuildDate: new Date().toISOString(),
  language: 'en',
  feedUrl: 'https://example.com/feed'
});

describe('CacheSizeManager', () => {
  describe('initialization', () => {
    it('should create with default config', () => {
      const manager = new CacheSizeManager();
      const config = manager.getConfig();

      expect(config.maxMemoryEntries).toBe(50);
      expect(config.maxIndexedDBSize).toBe(50 * 1024 * 1024);
      expect(config.evictionStrategy).toBe('lru');
      expect(config.warningThreshold).toBe(0.8);
    });

    it('should accept custom config', () => {
      const manager = new CacheSizeManager({
        maxMemoryEntries: 100,
        evictionStrategy: 'lfu'
      });
      const config = manager.getConfig();

      expect(config.maxMemoryEntries).toBe(100);
      expect(config.evictionStrategy).toBe('lfu');
    });
  });

  describe('memory tracking', () => {
    let manager: CacheSizeManager;

    beforeEach(() => {
      manager = new CacheSizeManager({ maxMemoryEntries: 5 });
    });

    it('should track memory entries', () => {
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('key1', feed, expiresAt);

      expect(manager.getMemoryEntryCount()).toBe(1);
      expect(manager.getEntrySize('key1')).toBeGreaterThan(0);
    });

    it('should update entry on re-track', () => {
      const feed1 = createMockFeed(1);
      const feed2 = createMockFeed(10);
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('key1', feed1, expiresAt);
      const size1 = manager.getEntrySize('key1');

      manager.trackMemoryEntry('key1', feed2, expiresAt);
      const size2 = manager.getEntrySize('key1');

      expect(size2).toBeGreaterThan(size1);
    });

    it('should record access', () => {
      const feed = createMockFeed();
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);

      // Access the entry
      manager.recordAccess('key1');
      manager.recordAccess('key1');

      // Internal state tracked
      expect(manager.getEntrySize('key1')).toBeGreaterThan(0);
    });

    it('should untrack entry', () => {
      const feed = createMockFeed();
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);

      manager.untrackEntry('key1');

      expect(manager.getMemoryEntryCount()).toBe(0);
      expect(manager.getEntrySize('key1')).toBe(0);
    });

    it('should calculate total memory size', () => {
      const feed = createMockFeed(10);
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key2', feed, Date.now() + 60000);

      const total = manager.getCurrentMemorySize();
      expect(total).toBeGreaterThan(0);
      expect(total).toBe(manager.getEntrySize('key1') + manager.getEntrySize('key2'));
    });
  });

  describe('eviction detection', () => {
    it('should detect when memory eviction is needed', () => {
      const manager = new CacheSizeManager({ maxMemoryEntries: 3 });
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      // Add 3 entries - at limit
      manager.trackMemoryEntry('key1', feed, expiresAt);
      manager.trackMemoryEntry('key2', feed, expiresAt);
      manager.trackMemoryEntry('key3', feed, expiresAt);
      expect(manager.shouldEvictMemory()).toBe(false);

      // Add 4th entry - over limit
      manager.trackMemoryEntry('key4', feed, expiresAt);
      expect(manager.shouldEvictMemory()).toBe(true);
    });
  });

  describe('LRU eviction strategy', () => {
    let manager: CacheSizeManager;

    beforeEach(() => {
      manager = new CacheSizeManager({
        maxMemoryEntries: 5,
        evictionStrategy: 'lru',
        evictionBatchPercent: 0.4 // Evict 40%
      });
    });

    it('should identify oldest accessed entries', async () => {
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      // Add entries with different access times
      manager.trackMemoryEntry('oldest', feed, expiresAt);
      await new Promise(r => setTimeout(r, 10));

      manager.trackMemoryEntry('middle', feed, expiresAt);
      await new Promise(r => setTimeout(r, 10));

      manager.trackMemoryEntry('newest', feed, expiresAt);

      const candidates = manager.getMemoryEvictionCandidates(2);

      expect(candidates).toContain('oldest');
      expect(candidates).toContain('middle');
      expect(candidates).not.toContain('newest');
    });

    it('should respect access time updates', async () => {
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('entry1', feed, expiresAt);
      await new Promise(r => setTimeout(r, 10));

      manager.trackMemoryEntry('entry2', feed, expiresAt);
      await new Promise(r => setTimeout(r, 10));

      manager.trackMemoryEntry('entry3', feed, expiresAt);

      // Access entry1 to make it "newer"
      manager.recordAccess('entry1');

      const candidates = manager.getMemoryEvictionCandidates(1);

      // entry2 should now be oldest (entry1 was just accessed)
      expect(candidates[0]).toBe('entry2');
    });
  });

  describe('LFU eviction strategy', () => {
    let manager: CacheSizeManager;

    beforeEach(() => {
      manager = new CacheSizeManager({
        maxMemoryEntries: 5,
        evictionStrategy: 'lfu',
        evictionBatchPercent: 0.4
      });
    });

    it('should identify least frequently accessed entries', () => {
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('frequent', feed, expiresAt);
      manager.trackMemoryEntry('infrequent', feed, expiresAt);
      manager.trackMemoryEntry('medium', feed, expiresAt);

      // Simulate different access patterns
      for (let i = 0; i < 10; i++) {
        manager.recordAccess('frequent');
      }
      for (let i = 0; i < 5; i++) {
        manager.recordAccess('medium');
      }
      // 'infrequent' is not accessed additionally

      const candidates = manager.getMemoryEvictionCandidates(1);

      expect(candidates[0]).toBe('infrequent');
    });
  });

  describe('TTL eviction strategy', () => {
    let manager: CacheSizeManager;

    beforeEach(() => {
      manager = new CacheSizeManager({
        maxMemoryEntries: 5,
        evictionStrategy: 'ttl',
        evictionBatchPercent: 0.4
      });
    });

    it('should identify entries closest to expiration', () => {
      const feed = createMockFeed();
      const now = Date.now();

      manager.trackMemoryEntry('expiresSoon', feed, now + 10000);
      manager.trackMemoryEntry('expiresLater', feed, now + 60000);
      manager.trackMemoryEntry('expiresLast', feed, now + 120000);

      const candidates = manager.getMemoryEvictionCandidates(1);

      expect(candidates[0]).toBe('expiresSoon');
    });
  });

  describe('eviction execution', () => {
    let manager: CacheSizeManager;

    beforeEach(() => {
      manager = new CacheSizeManager({ maxMemoryEntries: 3 });
    });

    it('should evict entries from memory', () => {
      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('key1', feed, expiresAt);
      manager.trackMemoryEntry('key2', feed, expiresAt);
      manager.trackMemoryEntry('key3', feed, expiresAt);

      const evicted = manager.evictFromMemory(['key1', 'key2']);

      expect(evicted).toBe(2);
      expect(manager.getMemoryEntryCount()).toBe(1);
      expect(manager.getEntrySize('key3')).toBeGreaterThan(0);
    });

    it('should handle evicting non-existent keys', () => {
      const feed = createMockFeed();
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);

      const evicted = manager.evictFromMemory(['key1', 'nonexistent']);

      expect(evicted).toBe(1);
    });
  });

  describe('automatic eviction', () => {
    it('should perform eviction when limits exceeded', async () => {
      const manager = new CacheSizeManager({
        maxMemoryEntries: 2,
        evictionBatchPercent: 0.5
      });

      const feed = createMockFeed();
      const expiresAt = Date.now() + 60000;

      manager.trackMemoryEntry('key1', feed, expiresAt);
      manager.trackMemoryEntry('key2', feed, expiresAt);
      manager.trackMemoryEntry('key3', feed, expiresAt);

      const result = await manager.performEvictionIfNeeded();

      expect(result.memoryEvicted).toBeGreaterThan(0);
      expect(manager.getMemoryEntryCount()).toBeLessThanOrEqual(2);
    });

    it('should not evict when under limits', async () => {
      const manager = new CacheSizeManager({ maxMemoryEntries: 10 });

      const feed = createMockFeed();
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key2', feed, Date.now() + 60000);

      const result = await manager.performEvictionIfNeeded();

      expect(result.memoryEvicted).toBe(0);
      expect(manager.getMemoryEntryCount()).toBe(2);
    });
  });

  describe('statistics', () => {
    it('should return accurate stats', async () => {
      const manager = new CacheSizeManager({ maxMemoryEntries: 10 });
      const feed = createMockFeed(5);

      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key2', feed, Date.now() + 60000);

      const stats = await manager.getStats();

      expect(stats.memoryEntries).toBe(2);
      expect(stats.memorySize).toBeGreaterThan(0);
      expect(stats.memoryUsagePercent).toBe(0.2); // 2 out of 10
      expect(stats.memoryNearLimit).toBe(false);
    });

    it('should detect near-limit conditions', async () => {
      const manager = new CacheSizeManager({
        maxMemoryEntries: 5,
        warningThreshold: 0.6
      });

      const feed = createMockFeed();
      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key2', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key3', feed, Date.now() + 60000);

      const stats = await manager.getStats();

      expect(stats.memoryNearLimit).toBe(true); // 3/5 = 60% >= threshold
    });
  });

  describe('expired entry cleanup', () => {
    it('should clear expired entries', () => {
      const manager = new CacheSizeManager();
      const feed = createMockFeed();

      // Add entries with different expiration times
      manager.trackMemoryEntry('expired1', feed, Date.now() - 1000);
      manager.trackMemoryEntry('expired2', feed, Date.now() - 2000);
      manager.trackMemoryEntry('valid', feed, Date.now() + 60000);

      const cleared = manager.clearExpired();

      expect(cleared).toBe(2);
      expect(manager.getMemoryEntryCount()).toBe(1);
      expect(manager.getEntrySize('valid')).toBeGreaterThan(0);
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const manager = new CacheSizeManager();

      manager.setConfig({ maxMemoryEntries: 100, evictionStrategy: 'lfu' });

      const config = manager.getConfig();
      expect(config.maxMemoryEntries).toBe(100);
      expect(config.evictionStrategy).toBe('lfu');
    });
  });

  describe('clear', () => {
    it('should clear all tracked entries', () => {
      const manager = new CacheSizeManager();
      const feed = createMockFeed();

      manager.trackMemoryEntry('key1', feed, Date.now() + 60000);
      manager.trackMemoryEntry('key2', feed, Date.now() + 60000);

      manager.clear();

      expect(manager.getMemoryEntryCount()).toBe(0);
    });
  });

  describe('singleton helpers', () => {
    it('should return same instance from getCacheSizeManager', () => {
      const manager1 = getCacheSizeManager();
      const manager2 = getCacheSizeManager();
      expect(manager1).toBe(manager2);
    });

    it('should reset singleton with resetCacheSizeManager', () => {
      const manager1 = getCacheSizeManager();
      manager1.trackMemoryEntry('key1', createMockFeed(), Date.now() + 60000);

      resetCacheSizeManager();

      const manager2 = getCacheSizeManager();
      expect(manager1).not.toBe(manager2);
      expect(manager2.getMemoryEntryCount()).toBe(0);
    });
  });

  describe('IndexedDB integration', () => {
    let manager: CacheSizeManager;
    let indexedDBCache: IndexedDBCache;

    beforeEach(async () => {
      manager = new CacheSizeManager({
        maxIndexedDBSize: 10000 // 10KB limit for testing
      });
      indexedDBCache = new IndexedDBCache();
      await indexedDBCache.init();
      manager.setIndexedDBCache(indexedDBCache);
    });

    afterEach(() => {
      indexedDBCache.close();
    });

    it('should detect when IndexedDB eviction is needed', async () => {
      // Add entries to exceed limit
      for (let i = 0; i < 5; i++) {
        await indexedDBCache.set({
          key: `key${i}`,
          feedUrl: `https://example.com/feed${i}`,
          content: createMockFeed(10),
          fetchedAt: Date.now(),
          expiresAt: Date.now() + 60000,
          size: 3000,
          lastAccessed: Date.now()
        });
      }

      // Total size should exceed 10KB limit
      const shouldEvict = await manager.shouldEvictIndexedDB();
      expect(shouldEvict).toBe(true);
    });

    it('should get IndexedDB eviction candidates', async () => {
      const now = Date.now();

      // Add entries with different access times
      await indexedDBCache.set({
        key: 'oldest',
        feedUrl: 'url1',
        content: createMockFeed(),
        fetchedAt: now - 3000,
        expiresAt: now + 60000,
        size: 1000,
        lastAccessed: now - 3000
      });

      await indexedDBCache.set({
        key: 'newest',
        feedUrl: 'url2',
        content: createMockFeed(),
        fetchedAt: now,
        expiresAt: now + 60000,
        size: 1000,
        lastAccessed: now
      });

      const candidates = await manager.getIndexedDBEvictionCandidates(1);

      expect(candidates).toContain('oldest');
      expect(candidates).not.toContain('newest');
    });

    it('should evict from IndexedDB', async () => {
      await indexedDBCache.set({
        key: 'key1',
        feedUrl: 'url1',
        content: createMockFeed(),
        fetchedAt: Date.now(),
        expiresAt: Date.now() + 60000,
        size: 1000,
        lastAccessed: Date.now()
      });

      await indexedDBCache.set({
        key: 'key2',
        feedUrl: 'url2',
        content: createMockFeed(),
        fetchedAt: Date.now(),
        expiresAt: Date.now() + 60000,
        size: 1000,
        lastAccessed: Date.now()
      });

      const evicted = await manager.evictFromIndexedDB(['key1']);

      expect(evicted).toBe(1);
      expect(await indexedDBCache.get('key1')).toBeNull();
      expect(await indexedDBCache.get('key2')).not.toBeNull();
    });
  });
});
