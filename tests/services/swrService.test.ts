/**
 * Tests for Stale-While-Revalidate Service
 */

import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import {
  SWRService,
  SWRResult,
  getSWRService,
  initSWRService,
  resetSWRService
} from '../../src/webparts/polRssGallery/services/swrService';
import { resetUnifiedCache } from '../../src/webparts/polRssGallery/services/unifiedCacheService';
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
  // Reset singletons between tests
  resetSWRService();
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

// Mock fetcher that resolves after a delay
const createMockFetcher = (
  feed: ParsedFeed = createMockFeed(),
  delay: number = 10
): (() => Promise<ParsedFeed>) => {
  return jest.fn().mockImplementation(() =>
    new Promise(resolve => setTimeout(() => resolve(feed), delay))
  );
};

// Mock fetcher that rejects
const createFailingFetcher = (error: Error = new Error('Network error')): (() => Promise<ParsedFeed>) => {
  return jest.fn().mockImplementation(() => Promise.reject(error));
};

describe('SWRService', () => {
  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const swr = new SWRService();
      await swr.init();
      expect(swr.getConfig()).toBeDefined();
      swr.dispose();
    });

    it('should handle multiple init calls', async () => {
      const swr = new SWRService();
      await swr.init();
      await swr.init(); // Should not throw
      swr.dispose();
    });

    it('should accept custom configuration', async () => {
      const swr = new SWRService({ freshTime: 10000 });
      await swr.init();
      expect(swr.getConfig().freshTime).toBe(10000);
      swr.dispose();
    });
  });

  describe('fetch - cache miss', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 60000,
        staleTime: 120000,
        maxAge: 300000
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should fetch from network on cache miss', async () => {
      const feed = createMockFeed('Fresh Feed');
      const fetcher = createMockFetcher(feed);

      const result = await swr.fetch('https://example.com/feed', fetcher);

      expect(result.data?.title).toBe('Fresh Feed');
      expect(result.isFromCache).toBe(false);
      expect(result.cacheState).toBe('fresh');
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('should cache fetched data', async () => {
      const feed = createMockFeed();
      const fetcher = createMockFetcher(feed);

      // First fetch - cache miss
      await swr.fetch('https://example.com/feed', fetcher);

      // Second fetch - should be from cache
      const result = await swr.fetch('https://example.com/feed', fetcher);

      expect(result.isFromCache).toBe(true);
      expect(result.cacheState).toBe('fresh');
      expect(fetcher).toHaveBeenCalledTimes(1); // Still only once
    });
  });

  describe('fetch - cache hit (fresh)', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 60000,
        staleTime: 120000,
        maxAge: 300000
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should return cached data without network request', async () => {
      const feed = createMockFeed();
      const fetcher = createMockFetcher(feed);

      // Populate cache
      await swr.fetch('https://example.com/feed', fetcher);

      // Create new fetcher to verify it's not called
      const secondFetcher = createMockFetcher(createMockFeed('New Feed'));

      const result = await swr.fetch('https://example.com/feed', secondFetcher);

      expect(result.isFromCache).toBe(true);
      expect(result.data?.title).toBe('Test Feed'); // Original cached data
      expect(secondFetcher).not.toHaveBeenCalled();
    });
  });

  describe('fetch - cache hit (stale)', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 50, // 50ms - very short for testing
        staleTime: 200,
        maxAge: 500
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should return stale data immediately and revalidate in background', async () => {
      const originalFeed = createMockFeed('Original');
      const newFeed = createMockFeed('Updated');

      // Populate cache
      await swr.fetch('https://example.com/feed', createMockFetcher(originalFeed));

      // Wait for data to become stale
      await new Promise(resolve => setTimeout(resolve, 60));

      // Fetch with new data available
      const onRevalidate = jest.fn();
      const result = await swr.fetch(
        'https://example.com/feed',
        createMockFetcher(newFeed, 50), // Slow fetcher
        { onRevalidate }
      );

      // Should return stale data immediately
      expect(result.data?.title).toBe('Original');
      expect(result.isFromCache).toBe(true);
      expect(result.cacheState).toBe('stale');
      expect(result.isRevalidating).toBe(true);

      // Wait for background refresh to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Callback should have been called with new data
      expect(onRevalidate).toHaveBeenCalled();
    });
  });

  describe('fetch - force refresh', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 60000,
        staleTime: 120000,
        maxAge: 300000
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should bypass cache when forceRefresh is true', async () => {
      const originalFeed = createMockFeed('Original');
      const newFeed = createMockFeed('Updated');

      // Populate cache
      await swr.fetch('https://example.com/feed', createMockFetcher(originalFeed));

      // Force refresh
      const fetcher = createMockFetcher(newFeed);
      const result = await swr.fetch(
        'https://example.com/feed',
        fetcher,
        { forceRefresh: true }
      );

      expect(result.data?.title).toBe('Updated');
      expect(result.isFromCache).toBe(false);
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('fetch - error handling', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService();
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should return error when fetch fails and no cache', async () => {
      const error = new Error('Network failed');
      const fetcher = createFailingFetcher(error);

      const result = await swr.fetch('https://example.com/feed', fetcher);

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Network failed');
    });

    it('should return stale data when fetch fails but cache exists', async () => {
      // Populate cache
      await swr.fetch('https://example.com/feed', createMockFetcher(createMockFeed('Cached')));

      // Force refresh with failing fetcher
      const onError = jest.fn();
      const result = await swr.fetch(
        'https://example.com/feed',
        createFailingFetcher(),
        { forceRefresh: true, onError }
      );

      // Should fallback to cached data
      expect(result.data?.title).toBe('Cached');
      expect(result.isFromCache).toBe(true);
      expect(result.error).toBeDefined();
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('request deduplication', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({ dedupeInterval: 1000 });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should deduplicate concurrent requests', async () => {
      const fetcher = createMockFetcher(createMockFeed(), 100);

      // Fire multiple concurrent requests
      const promises = [
        swr.fetch('https://example.com/feed', fetcher),
        swr.fetch('https://example.com/feed', fetcher),
        swr.fetch('https://example.com/feed', fetcher)
      ];

      await Promise.all(promises);

      // Fetcher should only be called once
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('prefetch', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService();
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should prefetch into cache', async () => {
      const fetcher = createMockFetcher(createMockFeed('Prefetched'));

      await swr.prefetch('https://example.com/feed', fetcher);

      // Subsequent fetch should be from cache
      const result = await swr.fetch(
        'https://example.com/feed',
        createMockFetcher(createMockFeed('Different'))
      );

      expect(result.data?.title).toBe('Prefetched');
      expect(result.isFromCache).toBe(true);
    });

    it('should not prefetch if already cached', async () => {
      // Populate cache
      await swr.fetch('https://example.com/feed', createMockFetcher(createMockFeed()));

      // Try to prefetch
      const fetcher = createMockFetcher(createMockFeed('New'));
      await swr.prefetch('https://example.com/feed', fetcher);

      // Fetcher should not have been called
      expect(fetcher).not.toHaveBeenCalled();
    });
  });

  describe('invalidate', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService();
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should invalidate specific cache entry', async () => {
      await swr.fetch('https://example.com/feed1', createMockFetcher(createMockFeed('Feed 1')));
      await swr.fetch('https://example.com/feed2', createMockFetcher(createMockFeed('Feed 2')));

      await swr.invalidate('https://example.com/feed1');

      // Feed1 should require fresh fetch
      const fetcher1 = createMockFetcher(createMockFeed('New Feed 1'));
      const result1 = await swr.fetch('https://example.com/feed1', fetcher1);
      expect(fetcher1).toHaveBeenCalled();
      expect(result1.isFromCache).toBe(false);

      // Feed2 should still be cached
      const fetcher2 = createMockFetcher(createMockFeed('New Feed 2'));
      const result2 = await swr.fetch('https://example.com/feed2', fetcher2);
      expect(fetcher2).not.toHaveBeenCalled();
      expect(result2.isFromCache).toBe(true);
    });

    it('should invalidate all entries', async () => {
      await swr.fetch('https://example.com/feed1', createMockFetcher(createMockFeed()));
      await swr.fetch('https://example.com/feed2', createMockFetcher(createMockFeed()));

      await swr.invalidateAll();

      // Both should require fresh fetch
      const state1 = await swr.getCacheState('https://example.com/feed1');
      const state2 = await swr.getCacheState('https://example.com/feed2');

      expect(state1?.state).toBe('missing');
      expect(state2?.state).toBe('missing');
    });
  });

  describe('getCacheState', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 50,
        staleTime: 100,
        maxAge: 200
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should return cache state', async () => {
      await swr.fetch('https://example.com/feed', createMockFetcher(createMockFeed()));

      const state = await swr.getCacheState('https://example.com/feed');
      expect(state?.state).toBe('fresh');
    });

    it('should return null for non-existent key', async () => {
      const state = await swr.getCacheState('https://example.com/nonexistent');
      expect(state?.state).toBe('missing');
    });
  });

  describe('refresh tracking', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService({
        freshTime: 10,
        staleTime: 50,
        maxAge: 100,
        maxConcurrentRefreshes: 2
      });
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should track active refresh count', async () => {
      expect(swr.getActiveRefreshCount()).toBe(0);

      // This would start background refreshes but we're testing the counter
      await swr.fetch('https://example.com/feed', createMockFetcher(createMockFeed()));
      expect(swr.getActiveRefreshCount()).toBe(0); // No background refresh for fresh data
    });

    it('should check if specific feed is refreshing', async () => {
      expect(swr.isRefreshing('https://example.com/feed')).toBe(false);
    });
  });

  describe('configuration', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService();
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should return current config', () => {
      const config = swr.getConfig();
      expect(config.freshTime).toBeDefined();
      expect(config.staleTime).toBeDefined();
      expect(config.maxAge).toBeDefined();
      expect(config.maxConcurrentRefreshes).toBeDefined();
      expect(config.dedupeInterval).toBeDefined();
    });

    it('should update config', () => {
      swr.setConfig({ freshTime: 10000, maxConcurrentRefreshes: 5 });
      const config = swr.getConfig();
      expect(config.freshTime).toBe(10000);
      expect(config.maxConcurrentRefreshes).toBe(5);
    });
  });

  describe('singleton helpers', () => {
    it('should return same instance from getSWRService', () => {
      const swr1 = getSWRService();
      const swr2 = getSWRService();
      expect(swr1).toBe(swr2);
    });

    it('should initialize with initSWRService', async () => {
      const swr = await initSWRService({ freshTime: 5000 });
      expect(swr).toBeInstanceOf(SWRService);
      expect(swr.getConfig().freshTime).toBe(5000);
    });

    it('should reset singleton with resetSWRService', async () => {
      const swr1 = await initSWRService();
      await swr1.fetch('https://example.com/feed', createMockFetcher(createMockFeed()));

      resetSWRService();

      const swr2 = getSWRService();
      expect(swr1).not.toBe(swr2);
    });
  });

  describe('edge cases', () => {
    let swr: SWRService;

    beforeEach(async () => {
      swr = new SWRService();
      await swr.init();
    });

    afterEach(() => {
      swr.dispose();
    });

    it('should handle different key params for same URL', async () => {
      const feed1 = createMockFeed('Feed with 10 items');
      const feed2 = createMockFeed('Feed with 20 items');

      await swr.fetch('https://example.com/feed', createMockFetcher(feed1), {
        keyParams: { maxItems: 10 }
      });

      const fetcher2 = createMockFetcher(feed2);
      await swr.fetch('https://example.com/feed', fetcher2, {
        keyParams: { maxItems: 20 }
      });

      // Second fetch should not be from cache (different key params)
      expect(fetcher2).toHaveBeenCalled();
    });

    it('should handle empty feed URL', async () => {
      const result = await swr.fetch('', createMockFetcher(createMockFeed()));
      expect(result.data).not.toBeNull();
    });

    it('should handle rapid sequential fetches', async () => {
      const fetcher = createMockFetcher(createMockFeed(), 10);

      for (let i = 0; i < 5; i++) {
        await swr.fetch('https://example.com/feed', fetcher);
      }

      // First fetch hits network, rest from cache
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });
});
