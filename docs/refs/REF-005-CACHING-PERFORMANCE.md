# REF-005-CACHING-PERFORMANCE

> **Status:** Not Started
> **Priority:** High
> **Phase:** 2 - Core Reliability
> **Estimated Complexity:** Medium

## Overview

Improve the caching system with IndexedDB persistence, smarter stale-while-revalidate patterns, and memory management. Ensure feeds load instantly on return visits and handle offline scenarios gracefully.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE

## Dependencies

- REF-001-TESTING-INFRASTRUCTURE

## Current Implementation Analysis

The existing `CacheService` in `src/webparts/polRssGallery/services/cacheService.ts`:
- Singleton pattern
- In-memory only (lost on page refresh)
- 5-minute stale time, 1-hour max age
- Background refresh for stale data

## Sub-Tasks

### ST-005-01: Implement IndexedDB Storage Layer
**Status:** `[ ]` Not Started
**Test File:** `tests/services/indexedDbCache.test.ts`

**Description:**
Create persistent storage layer using IndexedDB for feed caching.

**Steps:**
1. Create IndexedDB wrapper service
2. Define database schema
3. Implement CRUD operations
4. Add migration support for schema changes
5. Handle quota exceeded errors

**Database Schema:**
```typescript
interface CacheDatabase {
  feeds: {
    key: string;          // Feed URL hash
    feedUrl: string;
    content: ParsedFeed;
    fetchedAt: Date;
    expiresAt: Date;
    size: number;
  };
  metadata: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'pol-rss-cache';
const DB_VERSION = 1;
```

**Acceptance Criteria:**
- [ ] IndexedDB database created successfully
- [ ] CRUD operations work reliably
- [ ] Handles browser without IndexedDB support
- [ ] Quota errors handled gracefully

---

### ST-005-02: Create Unified Cache Service
**Status:** `[ ]` Not Started
**Test File:** `tests/services/unifiedCacheService.test.ts`

**Description:**
Create unified cache service that combines memory and IndexedDB layers.

**Steps:**
1. Create UnifiedCacheService
2. Implement two-tier caching (memory → IndexedDB)
3. Memory cache for hot data
4. IndexedDB for persistence
5. Sync between layers

**Cache Architecture:**
```
┌─────────────────────────────────────────┐
│           UnifiedCacheService            │
├─────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────┐  │
│  │  Memory Cache   │──│  IndexedDB   │  │
│  │  (L1 - Fast)    │  │  (L2 - Persist)│ │
│  └─────────────────┘  └──────────────┘  │
└─────────────────────────────────────────┘

Read:  Memory → IndexedDB → Network
Write: Network → Memory → IndexedDB
```

**Acceptance Criteria:**
- [ ] Memory cache serves hot data instantly
- [ ] IndexedDB provides persistence
- [ ] Automatic promotion to memory on read
- [ ] Background sync to IndexedDB

---

### ST-005-03: Implement Stale-While-Revalidate
**Status:** `[ ]` Not Started
**Test File:** `tests/services/swr.test.ts`

**Description:**
Implement proper stale-while-revalidate pattern for optimal UX.

**Steps:**
1. Define freshness windows (fresh, stale, expired)
2. Return stale content immediately
3. Background refresh for stale content
4. Force refresh for expired content
5. Add revalidation callbacks

**SWR Configuration:**
```typescript
interface SWRConfig {
  freshTime: number;      // Return cached, no revalidate (default: 5 min)
  staleTime: number;      // Return cached, revalidate in background (default: 30 min)
  maxAge: number;         // Force refresh (default: 24 hours)
  onRevalidate?: (newData: ParsedFeed) => void;
}

type CacheState = 'fresh' | 'stale' | 'expired' | 'missing';
```

**Acceptance Criteria:**
- [ ] Fresh content served without network
- [ ] Stale content served with background refresh
- [ ] Expired content triggers foreground refresh
- [ ] Callbacks notify of updates

---

### ST-005-04: Add Cache Key Management
**Status:** `[ ]` Not Started
**Test File:** `tests/services/cacheKeys.test.ts`

**Description:**
Implement consistent cache key generation and management.

**Steps:**
1. Create deterministic key generation
2. Include relevant parameters in key
3. Support cache invalidation patterns
4. Add key prefix for namespacing

**Key Generation:**
```typescript
interface CacheKeyParams {
  feedUrl: string;
  maxItems?: number;
  filterKeywords?: string;
  // Other params that affect content
}

const generateCacheKey = (params: CacheKeyParams): string => {
  const normalized = {
    url: normalizeUrl(params.feedUrl),
    max: params.maxItems || 'default',
    filter: params.filterKeywords || 'none'
  };
  return `rss_${hash(JSON.stringify(normalized))}`;
};
```

**Acceptance Criteria:**
- [ ] Keys are deterministic
- [ ] Same params = same key
- [ ] URL normalization handles variations
- [ ] Keys are reasonable length

---

### ST-005-05: Implement Cache Size Management
**Status:** `[ ]` Not Started
**Test File:** `tests/services/cacheSizeManager.test.ts`

**Description:**
Manage cache size to prevent storage quota issues.

**Steps:**
1. Track cache entry sizes
2. Implement LRU eviction
3. Set configurable size limits
4. Monitor and warn on high usage
5. Handle quota exceeded

**Size Management:**
```typescript
interface CacheSizeConfig {
  maxMemoryEntries: number;     // Default: 50
  maxIndexedDBSizeMB: number;   // Default: 50
  evictionStrategy: 'lru' | 'lfu' | 'ttl';
}

class CacheSizeManager {
  getCurrentSize(): number;
  getEntrySize(entry: CacheEntry): number;
  shouldEvict(): boolean;
  evictOldest(): void;
  cleanup(): Promise<void>;
}
```

**Acceptance Criteria:**
- [ ] Cache size tracked accurately
- [ ] Eviction works correctly
- [ ] No storage quota errors
- [ ] Old entries cleaned up

---

### ST-005-06: Add Preloading Support
**Status:** `[ ]` Not Started
**Test File:** `tests/services/preloader.test.ts`

**Description:**
Support preloading feeds for improved perceived performance.

**Steps:**
1. Create preload queue
2. Preload on webpart mount
3. Preload on hover (optional)
4. Priority queue for multiple feeds
5. Cancel preload on unmount

**Preloader API:**
```typescript
class FeedPreloader {
  preload(feedUrl: string, priority: number): void;
  cancelPreload(feedUrl: string): void;
  isPreloading(feedUrl: string): boolean;
  getPreloadedFeed(feedUrl: string): ParsedFeed | null;
}
```

**Acceptance Criteria:**
- [ ] Feeds preload in background
- [ ] Priority respected
- [ ] Cancellation works
- [ ] No duplicate requests

---

### ST-005-07: Performance Monitoring
**Status:** `[ ]` Not Started
**Test File:** `tests/services/performanceMonitor.test.ts`

**Description:**
Add performance monitoring for cache effectiveness.

**Steps:**
1. Track cache hit/miss ratio
2. Measure fetch times
3. Track cache entry ages
4. Log performance metrics
5. Add debug panel (dev mode)

**Performance Metrics:**
```typescript
interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  averageFetchTime: number;
  averageParseTime: number;
  cacheSize: number;
  entryCount: number;
  oldestEntry: Date;
}

class PerformanceMonitor {
  recordHit(key: string): void;
  recordMiss(key: string): void;
  recordFetch(key: string, duration: number): void;
  getMetrics(): CacheMetrics;
  reset(): void;
}
```

**Acceptance Criteria:**
- [ ] Metrics accurately tracked
- [ ] Performance visible in debug mode
- [ ] No overhead in production
- [ ] Metrics help identify issues

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Cache hit rate | > 80% for return visits |
| Time to first paint (cached) | < 100ms |
| Time to first paint (network) | < 2s |
| Memory usage per feed | < 500KB |
| IndexedDB per feed | < 1MB |

## Cache Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Cache Read Flow                         │
└─────────────────────────────────────────────────────────────┘

Request for Feed URL
         │
         ▼
┌─────────────────┐
│ Generate Key    │
└─────────────────┘
         │
         ▼
┌─────────────────┐     [HIT]      ┌─────────────────┐
│ Check Memory    │───────────────>│ Return Data     │
│ Cache (L1)      │                │ (Instant)       │
└─────────────────┘                └─────────────────┘
         │ [MISS]
         ▼
┌─────────────────┐     [HIT]      ┌─────────────────┐
│ Check IndexedDB │───────────────>│ Promote to L1   │
│ (L2)            │                │ Return Data     │
└─────────────────┘                └─────────────────┘
         │ [MISS]                          │
         ▼                                 ▼
┌─────────────────┐                ┌─────────────────┐
│ Fetch from      │                │ Check Freshness │
│ Network         │                └─────────────────┘
└─────────────────┘                   │         │
         │                       [FRESH]    [STALE]
         ▼                            │         │
┌─────────────────┐                   │         ▼
│ Store in L1+L2  │                   │   ┌───────────┐
│ Return Data     │                   │   │ Background│
└─────────────────┘                   │   │ Refresh   │
                                      │   └───────────┘
                                      ▼
                              [Return immediately]
```

## Files to Create/Modify

```
src/webparts/polRssGallery/services/
├── cacheService.ts           # Modify: refactor to use new layers
├── indexedDbCache.ts         # New: IndexedDB layer
├── memoryCacheLayer.ts       # New: Memory layer
├── unifiedCacheService.ts    # New: Combined service
├── cacheSizeManager.ts       # New: Size management
├── feedPreloader.ts          # New: Preloading
└── performanceMonitor.ts     # New: Metrics
```

## Browser Support Notes

- IndexedDB supported in all modern browsers
- Fallback to memory-only for unsupported browsers
- Safari has IndexedDB quirks in private mode
- Storage quota varies by browser (~50MB typical)

## Related Tasks

- **REF-004-ERROR-HANDLING:** Cached fallback on errors
- **REF-009-FEED-AGGREGATION:** Cache aggregated feeds
