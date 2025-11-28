/**
 * Tests for Performance Monitor Service
 */

import {
  PerformanceMonitor,
  CacheMetrics,
  CacheEvent,
  getPerformanceMonitor,
  resetPerformanceMonitor,
  createTimingHelper
} from '../../src/webparts/polRssGallery/services/performanceMonitor';

beforeEach(() => {
  resetPerformanceMonitor();
});

describe('PerformanceMonitor', () => {
  describe('initialization', () => {
    it('should create with default config', () => {
      const monitor = new PerformanceMonitor();
      const config = monitor.getConfig();

      expect(config.enabled).toBe(true);
      expect(config.maxHistorySize).toBe(1000);
      expect(config.maxTimingsSize).toBe(500);
      expect(config.consoleLogging).toBe(false);
      expect(config.sampleRate).toBe(1);
    });

    it('should accept custom config', () => {
      const monitor = new PerformanceMonitor({
        enabled: false,
        maxHistorySize: 500,
        consoleLogging: true
      });
      const config = monitor.getConfig();

      expect(config.enabled).toBe(false);
      expect(config.maxHistorySize).toBe(500);
      expect(config.consoleLogging).toBe(true);
    });
  });

  describe('hit/miss tracking', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should record cache hits', () => {
      monitor.recordHit('key1', 'memory');
      monitor.recordHit('key2', 'indexeddb');
      monitor.recordHit('key3');

      const metrics = monitor.getMetrics();
      expect(metrics.hits).toBe(3);
      expect(metrics.misses).toBe(0);
      expect(metrics.hitRate).toBe(1);
    });

    it('should record cache misses', () => {
      monitor.recordMiss('key1');
      monitor.recordMiss('key2');

      const metrics = monitor.getMetrics();
      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(2);
      expect(metrics.hitRate).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      monitor.recordHit('key1');
      monitor.recordHit('key2');
      monitor.recordHit('key3');
      monitor.recordMiss('key4');

      const metrics = monitor.getMetrics();
      expect(metrics.hitRate).toBe(0.75); // 3 hits / 4 total
    });

    it('should handle zero requests', () => {
      const metrics = monitor.getMetrics();
      expect(metrics.hitRate).toBe(0);
    });
  });

  describe('timing tracking', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should record fetch timings', () => {
      monitor.recordFetch('key1', 100);
      monitor.recordFetch('key2', 200);
      monitor.recordFetch('key3', 150);

      const metrics = monitor.getMetrics();
      expect(metrics.averageFetchTime).toBe(150);
    });

    it('should record fetch with bytes transferred', () => {
      monitor.recordFetch('key1', 100, 1000);
      monitor.recordFetch('key2', 200, 2000);

      const metrics = monitor.getMetrics();
      expect(metrics.totalBytesTransferred).toBe(3000);
    });

    it('should record parse timings', () => {
      monitor.recordParse('key1', 10);
      monitor.recordParse('key2', 20);

      const metrics = monitor.getMetrics();
      expect(metrics.averageParseTime).toBe(15);
    });

    it('should record cache read timings', () => {
      monitor.recordCacheRead('key1', 5);
      monitor.recordCacheRead('key2', 10);

      const stats = monitor.getTimingStats();
      expect(stats.cacheRead.avg).toBe(7.5);
    });

    it('should record cache write timings', () => {
      monitor.recordCacheWrite('key1', 15);
      monitor.recordCacheWrite('key2', 25, 1000);

      const stats = monitor.getTimingStats();
      expect(stats.cacheWrite.avg).toBe(20);
    });

    it('should provide timing statistics', () => {
      monitor.recordFetch('key1', 50);
      monitor.recordFetch('key2', 100);
      monitor.recordFetch('key3', 150);

      const stats = monitor.getTimingStats();
      expect(stats.fetch.avg).toBe(100);
      expect(stats.fetch.min).toBe(50);
      expect(stats.fetch.max).toBe(150);
      expect(stats.fetch.count).toBe(3);
    });

    it('should limit timing array size', () => {
      const monitor = new PerformanceMonitor({ maxTimingsSize: 5 });

      for (let i = 0; i < 10; i++) {
        monitor.recordFetch(`key${i}`, 100);
      }

      const stats = monitor.getTimingStats();
      expect(stats.fetch.count).toBe(5);
    });
  });

  describe('event logging', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should log hit events', () => {
      monitor.recordHit('key1', 'memory');

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('hit');
      expect(events[0].key).toBe('key1');
      expect(events[0].source).toBe('memory');
    });

    it('should log miss events', () => {
      monitor.recordMiss('key1');

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('miss');
    });

    it('should log eviction events', () => {
      monitor.recordEviction('key1', 'lru');

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('eviction');
      expect(events[0].details?.reason).toBe('lru');
    });

    it('should log expiration events', () => {
      monitor.recordExpiration('key1');

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('expiration');
    });

    it('should log error events', () => {
      monitor.recordError('key1', new Error('Test error'));

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('error');
      expect(events[0].details?.message).toBe('Test error');
    });

    it('should filter events by type', () => {
      monitor.recordHit('key1');
      monitor.recordMiss('key2');
      monitor.recordHit('key3');

      const hits = monitor.getEventsByType('hit');
      expect(hits).toHaveLength(2);
    });

    it('should limit event history size', () => {
      const monitor = new PerformanceMonitor({ maxHistorySize: 5 });

      for (let i = 0; i < 10; i++) {
        monitor.recordHit(`key${i}`);
      }

      const events = monitor.getRecentEvents();
      expect(events).toHaveLength(5);
    });

    it('should get recent events with limit', () => {
      for (let i = 0; i < 20; i++) {
        monitor.recordHit(`key${i}`);
      }

      const events = monitor.getRecentEvents(5);
      expect(events).toHaveLength(5);
    });
  });

  describe('entry age tracking', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should track entry timestamps on write', () => {
      monitor.recordCacheWrite('key1', 10);
      monitor.recordCacheWrite('key2', 15);

      const metrics = monitor.getMetrics();
      expect(metrics.oldestEntryTime).not.toBeNull();
      expect(metrics.newestEntryTime).not.toBeNull();
    });

    it('should calculate average entry age', async () => {
      monitor.recordCacheWrite('key1', 10);

      // Wait a bit
      await new Promise(r => setTimeout(r, 50));

      const metrics = monitor.getMetrics();
      expect(metrics.averageEntryAge).toBeGreaterThan(0);
    });

    it('should remove entry on eviction', () => {
      monitor.recordCacheWrite('key1', 10);
      monitor.recordCacheWrite('key2', 10);

      monitor.recordEviction('key1');

      // Re-get metrics to check entry count
      const events = monitor.getEventsByType('eviction');
      expect(events).toHaveLength(1);
    });
  });

  describe('hit rate for time window', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should calculate hit rate for recent window', () => {
      monitor.recordHit('key1');
      monitor.recordHit('key2');
      monitor.recordMiss('key3');
      monitor.recordMiss('key4');

      const hitRate = monitor.getHitRateForWindow(60000); // Last minute
      expect(hitRate).toBe(0.5);
    });

    it('should return 0 for empty window', () => {
      const hitRate = monitor.getHitRateForWindow(60000);
      expect(hitRate).toBe(0);
    });
  });

  describe('report generation', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should generate performance report', () => {
      monitor.recordHit('key1');
      monitor.recordMiss('key2');
      monitor.recordFetch('key3', 100, 1000);
      monitor.recordParse('key3', 10);

      const report = monitor.generateReport(10, 50000);

      expect(report).toContain('Cache Performance Report');
      expect(report).toContain('Hit rate:');
      expect(report).toContain('Average fetch time:');
      expect(report).toContain('Current entries: 10');
    });

    it('should format bytes correctly', () => {
      monitor.recordFetch('key1', 100, 1536);

      const report = monitor.generateReport(0, 1048576);
      expect(report).toContain('MB');
    });
  });

  describe('reset', () => {
    it('should reset all metrics', () => {
      const monitor = new PerformanceMonitor();

      monitor.recordHit('key1');
      monitor.recordMiss('key2');
      monitor.recordFetch('key3', 100, 1000);

      monitor.reset();

      const metrics = monitor.getMetrics();
      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
      expect(metrics.totalBytesTransferred).toBe(0);
      expect(monitor.getRecentEvents()).toHaveLength(0);
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const monitor = new PerformanceMonitor();

      monitor.setConfig({ consoleLogging: true, sampleRate: 0.5 });

      const config = monitor.getConfig();
      expect(config.consoleLogging).toBe(true);
      expect(config.sampleRate).toBe(0.5);
    });

    it('should enable/disable console logging', () => {
      const monitor = new PerformanceMonitor();

      monitor.enableConsoleLogging();
      expect(monitor.getConfig().consoleLogging).toBe(true);

      monitor.disableConsoleLogging();
      expect(monitor.getConfig().consoleLogging).toBe(false);
    });

    it('should check if enabled', () => {
      const enabledMonitor = new PerformanceMonitor({ enabled: true });
      const disabledMonitor = new PerformanceMonitor({ enabled: false });

      expect(enabledMonitor.isEnabled()).toBe(true);
      expect(disabledMonitor.isEnabled()).toBe(false);
    });
  });

  describe('sampling', () => {
    it('should respect sample rate', () => {
      const monitor = new PerformanceMonitor({ sampleRate: 0 });

      // None should be recorded
      for (let i = 0; i < 100; i++) {
        monitor.recordHit(`key${i}`);
      }

      const metrics = monitor.getMetrics();
      expect(metrics.hits).toBe(0);
    });

    it('should not record when disabled', () => {
      const monitor = new PerformanceMonitor({ enabled: false });

      monitor.recordHit('key1');
      monitor.recordMiss('key2');

      const metrics = monitor.getMetrics();
      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
    });
  });

  describe('singleton helpers', () => {
    it('should return same instance from getPerformanceMonitor', () => {
      const monitor1 = getPerformanceMonitor();
      const monitor2 = getPerformanceMonitor();
      expect(monitor1).toBe(monitor2);
    });

    it('should reset singleton with resetPerformanceMonitor', () => {
      const monitor1 = getPerformanceMonitor();
      monitor1.recordHit('key1');

      resetPerformanceMonitor();

      const monitor2 = getPerformanceMonitor();
      expect(monitor1).not.toBe(monitor2);
      expect(monitor2.getMetrics().hits).toBe(0);
    });
  });

  describe('timing helper', () => {
    it('should create timing helper', async () => {
      const monitor = new PerformanceMonitor();
      const helper = createTimingHelper(monitor, 'test-key');

      // Simulate some time passing
      await new Promise(r => setTimeout(r, 10));

      helper.recordFetch(1000);

      const stats = monitor.getTimingStats();
      expect(stats.fetch.count).toBe(1);
      expect(stats.fetch.avg).toBeGreaterThanOrEqual(10);
    });

    it('should record different operation types', async () => {
      const monitor = new PerformanceMonitor();

      const fetchHelper = createTimingHelper(monitor, 'fetch-key');
      await new Promise(r => setTimeout(r, 5));
      fetchHelper.recordFetch();

      const parseHelper = createTimingHelper(monitor, 'parse-key');
      await new Promise(r => setTimeout(r, 5));
      parseHelper.recordParse();

      const stats = monitor.getTimingStats();
      expect(stats.fetch.count).toBe(1);
      expect(stats.parse.count).toBe(1);
    });
  });

  describe('metrics with cache info', () => {
    it('should include cache entry count and size', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordHit('key1');

      const metrics = monitor.getMetrics(50, 102400);

      expect(metrics.cacheEntryCount).toBe(50);
      expect(metrics.cacheSizeBytes).toBe(102400);
    });
  });
});
