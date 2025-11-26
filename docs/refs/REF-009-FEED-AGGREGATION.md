# REF-009-FEED-AGGREGATION

> **Status:** Not Started
> **Priority:** Medium
> **Phase:** 4 - New Features
> **Estimated Complexity:** High

## Overview

Implement support for multiple RSS feeds that are merged into a single view. Users can configure multiple feed URLs, and items from all feeds are combined, sorted by date, and displayed with source indicators.

## Prerequisites

- REF-003-FEED-PARSER (robust parsing for multiple formats)
- REF-004-ERROR-HANDLING (per-feed error handling)
- REF-005-CACHING-PERFORMANCE (caching multiple feeds)

## Dependencies

- REF-003-FEED-PARSER
- REF-004-ERROR-HANDLING
- REF-005-CACHING-PERFORMANCE

## Feature Requirements

1. Support 1-10 feed URLs
2. Merge items from all feeds
3. Sort by publication date (newest first)
4. Show source indicator per item
5. Handle per-feed errors gracefully
6. Cache feeds independently

## Sub-Tasks

### ST-009-01: Design Feed Collection Data Model
**Status:** `[ ]` Not Started
**Test File:** `tests/services/feedCollection.test.ts`

**Description:**
Design data model for managing multiple feeds.

**Steps:**
1. Define FeedSource interface
2. Define FeedCollection interface
3. Define aggregated item interface
4. Plan state management approach

**Data Models:**
```typescript
interface FeedSource {
  id: string;           // Unique identifier
  url: string;          // Feed URL
  name?: string;        // Display name (auto-detected or custom)
  color?: string;       // Source indicator color
  enabled: boolean;     // Can disable without removing
  priority?: number;    // For weighted sorting
}

interface FeedSourceStatus {
  sourceId: string;
  status: 'loading' | 'success' | 'error';
  lastUpdated?: Date;
  itemCount?: number;
  error?: RssError;
}

interface AggregatedFeedItem extends IRssItem {
  sourceId: string;     // Which feed this came from
  sourceName: string;   // Display name of source
  sourceColor: string;  // Color for indicator
}

interface FeedCollection {
  sources: FeedSource[];
  items: AggregatedFeedItem[];
  statuses: FeedSourceStatus[];
  lastAggregated: Date;
}
```

**Acceptance Criteria:**
- [ ] Models support all requirements
- [ ] Type-safe interfaces
- [ ] Extensible for future features
- [ ] Clear documentation

---

### ST-009-02: Create Feed Source Manager
**Status:** `[ ]` Not Started
**Test File:** `tests/services/feedSourceManager.test.ts`

**Description:**
Create service to manage feed sources (CRUD operations).

**Steps:**
1. Create FeedSourceManager class
2. Implement add/remove/update operations
3. Validate source URLs
4. Auto-detect feed names
5. Generate unique colors

**Feed Source Manager:**
```typescript
class FeedSourceManager {
  private sources: Map<string, FeedSource>;

  constructor(initialSources?: FeedSource[]) {
    this.sources = new Map();
    initialSources?.forEach(s => this.sources.set(s.id, s));
  }

  addSource(url: string): FeedSource {
    const id = generateId();
    const source: FeedSource = {
      id,
      url: normalizeUrl(url),
      enabled: true,
      color: this.getNextColor()
    };
    this.sources.set(id, source);
    return source;
  }

  removeSource(id: string): void {
    this.sources.delete(id);
  }

  updateSource(id: string, updates: Partial<FeedSource>): FeedSource {
    const source = this.sources.get(id);
    if (!source) throw new Error('Source not found');
    const updated = { ...source, ...updates };
    this.sources.set(id, updated);
    return updated;
  }

  getSources(): FeedSource[] {
    return Array.from(this.sources.values());
  }

  private getNextColor(): string {
    const colors = ['#0078D4', '#107C10', '#D83B01', '#5C2D91', '#008272'];
    return colors[this.sources.size % colors.length];
  }
}
```

**Acceptance Criteria:**
- [ ] CRUD operations work
- [ ] URLs validated and normalized
- [ ] Unique colors assigned
- [ ] ID generation is unique

---

### ST-009-03: Implement Feed Aggregator Service
**Status:** `[ ]` Not Started
**Test File:** `tests/services/feedAggregator.test.ts`

**Description:**
Create service to fetch and aggregate multiple feeds.

**Steps:**
1. Create FeedAggregatorService
2. Fetch feeds in parallel
3. Merge and sort items
4. Handle partial failures
5. Track per-feed status

**Feed Aggregator Service:**
```typescript
class FeedAggregatorService {
  constructor(
    private parser: ImprovedFeedParser,
    private proxyService: ProxyService,
    private cacheService: UnifiedCacheService
  ) {}

  async aggregateFeeds(
    sources: FeedSource[],
    options: AggregationOptions
  ): Promise<FeedCollection> {
    const enabledSources = sources.filter(s => s.enabled);

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      enabledSources.map(source => this.fetchSingleFeed(source))
    );

    // Process results
    const statuses: FeedSourceStatus[] = [];
    const allItems: AggregatedFeedItem[] = [];

    results.forEach((result, index) => {
      const source = enabledSources[index];

      if (result.status === 'fulfilled') {
        statuses.push({
          sourceId: source.id,
          status: 'success',
          lastUpdated: new Date(),
          itemCount: result.value.items.length
        });

        // Add source info to items
        const itemsWithSource = result.value.items.map(item => ({
          ...item,
          sourceId: source.id,
          sourceName: source.name || result.value.title,
          sourceColor: source.color
        }));

        allItems.push(...itemsWithSource);
      } else {
        statuses.push({
          sourceId: source.id,
          status: 'error',
          error: result.reason
        });
      }
    });

    // Sort by date
    const sortedItems = allItems.sort(
      (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
    );

    // Apply limit
    const limitedItems = sortedItems.slice(0, options.maxItems);

    return {
      sources,
      items: limitedItems,
      statuses,
      lastAggregated: new Date()
    };
  }

  private async fetchSingleFeed(source: FeedSource): Promise<ParsedFeed> {
    // Check cache first
    const cached = await this.cacheService.get(source.url);
    if (cached && !this.isStale(cached)) {
      return cached.content;
    }

    // Fetch and parse
    const response = await this.proxyService.fetch(source.url);
    const feed = this.parser.parse(response);

    // Cache result
    await this.cacheService.set(source.url, feed);

    return feed;
  }
}
```

**Acceptance Criteria:**
- [ ] Parallel fetching works
- [ ] Partial failures handled
- [ ] Items merged correctly
- [ ] Sorted by date
- [ ] Per-feed caching works

---

### ST-009-04: Create Multi-Feed Property Pane UI
**Status:** `[ ]` Not Started
**Test File:** `tests/webpart/multiFeedConfig.test.tsx`

**Description:**
Create property pane UI for managing multiple feed URLs.

**Steps:**
1. Create feed list component
2. Add/remove feed buttons
3. Inline validation per URL
4. Reorder feeds (optional)
5. Collapsible feed details

**Multi-Feed Configuration UI:**
```typescript
interface MultiFeedConfigProps {
  sources: FeedSource[];
  onSourcesChange: (sources: FeedSource[]) => void;
  maxSources?: number;
}

const MultiFeedConfig: React.FC<MultiFeedConfigProps> = ({
  sources,
  onSourcesChange,
  maxSources = 10
}) => (
  <div className={styles.multiFeedConfig}>
    <div className={styles.header}>
      <span>Feed Sources ({sources.length}/{maxSources})</span>
      <IconButton
        iconProps={{ iconName: 'Add' }}
        onClick={handleAddSource}
        disabled={sources.length >= maxSources}
        title="Add feed"
      />
    </div>

    {sources.map((source, index) => (
      <div key={source.id} className={styles.sourceRow}>
        <div
          className={styles.colorIndicator}
          style={{ backgroundColor: source.color }}
        />
        <TextField
          value={source.url}
          onChange={(_, value) => handleUrlChange(source.id, value)}
          placeholder="https://example.com/feed.rss"
          errorMessage={getValidationError(source)}
        />
        <Toggle
          checked={source.enabled}
          onChange={(_, enabled) => handleToggle(source.id, enabled)}
          onText="On"
          offText="Off"
        />
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          onClick={() => handleRemove(source.id)}
          title="Remove feed"
        />
      </div>
    ))}

    {sources.length === 0 && (
      <div className={styles.emptyState}>
        No feeds configured. Click + to add a feed.
      </div>
    )}
  </div>
);
```

**Acceptance Criteria:**
- [ ] Add/remove feeds works
- [ ] Maximum limit enforced
- [ ] Per-feed validation
- [ ] Enable/disable toggle
- [ ] Color indicators shown

---

### ST-009-05: Create Source Indicator Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/SourceIndicator.test.tsx`

**Description:**
Create component to show source origin on feed items.

**Steps:**
1. Create SourceIndicator component
2. Support different display modes
3. Add tooltip with source name
4. Consistent styling across layouts

**Source Indicator Component:**
```typescript
interface SourceIndicatorProps {
  sourceName: string;
  sourceColor: string;
  variant?: 'badge' | 'dot' | 'text';
  showTooltip?: boolean;
}

const SourceIndicator: React.FC<SourceIndicatorProps> = ({
  sourceName,
  sourceColor,
  variant = 'badge',
  showTooltip = true
}) => {
  const content = (
    <span
      className={classNames(styles.indicator, styles[variant])}
      style={{ '--source-color': sourceColor } as React.CSSProperties}
    >
      {variant === 'badge' && sourceName}
      {variant === 'dot' && <span className={styles.dot} />}
      {variant === 'text' && sourceName}
    </span>
  );

  if (showTooltip && variant === 'dot') {
    return <TooltipHost content={sourceName}>{content}</TooltipHost>;
  }

  return content;
};
```

**Variants:**
- **badge**: Colored background with text (for cards)
- **dot**: Small colored circle (for list items)
- **text**: Colored text only (compact mode)

**Acceptance Criteria:**
- [ ] All variants styled correctly
- [ ] Tooltips work
- [ ] Colors from source config
- [ ] Accessible

---

### ST-009-06: Add Feed Status Display
**Status:** `[ ]` Not Started
**Test File:** `tests/components/FeedStatus.test.tsx`

**Description:**
Show status of each feed source (loading, success, error).

**Steps:**
1. Create FeedStatusBar component
2. Show per-feed status
3. Allow retry for failed feeds
4. Expandable error details

**Feed Status Component:**
```typescript
interface FeedStatusBarProps {
  statuses: FeedSourceStatus[];
  sources: FeedSource[];
  onRetry?: (sourceId: string) => void;
  collapsed?: boolean;
}

const FeedStatusBar: React.FC<FeedStatusBarProps> = ({
  statuses,
  sources,
  onRetry,
  collapsed = true
}) => {
  const hasErrors = statuses.some(s => s.status === 'error');
  const successCount = statuses.filter(s => s.status === 'success').length;

  return (
    <div className={styles.feedStatusBar}>
      <div className={styles.summary}>
        <span>
          {successCount}/{sources.length} feeds loaded
        </span>
        {hasErrors && (
          <IconButton
            iconProps={{ iconName: collapsed ? 'ChevronDown' : 'ChevronUp' }}
            onClick={toggleExpanded}
          />
        )}
      </div>

      {!collapsed && hasErrors && (
        <div className={styles.errorList}>
          {statuses
            .filter(s => s.status === 'error')
            .map(status => {
              const source = sources.find(s => s.id === status.sourceId);
              return (
                <div key={status.sourceId} className={styles.errorItem}>
                  <Icon iconName="Error" className={styles.errorIcon} />
                  <span className={styles.sourceName}>{source?.name || source?.url}</span>
                  <span className={styles.errorMessage}>{status.error?.userMessage}</span>
                  <ActionButton onClick={() => onRetry?.(status.sourceId)}>
                    Retry
                  </ActionButton>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Summary shows count
- [ ] Errors expandable
- [ ] Retry button works
- [ ] Non-intrusive design

---

### ST-009-07: Integrate with Existing Layouts
**Status:** `[ ]` Not Started
**Test File:** `tests/integration/aggregatedLayouts.test.tsx`

**Description:**
Integrate aggregated feeds with all layout components.

**Steps:**
1. Update RssFeed component
2. Pass source info to layouts
3. Add source indicator to each layout
4. Handle mixed-source filtering

**Integration Points:**
```typescript
// RssFeed.tsx updates
const RssFeed: React.FC<IRssFeedProps> = (props) => {
  const { feedUrls, layout, showSourceIndicator } = props;

  // Use aggregated feed if multiple URLs
  const isAggregated = feedUrls.length > 1;

  const { data, statuses, isLoading, refetch } = useAggregatedFeed(
    feedUrls,
    { maxItems: props.maxItems }
  );

  return (
    <div className={styles.rssFeed}>
      {isAggregated && (
        <FeedStatusBar
          statuses={statuses}
          sources={feedUrls}
          onRetry={refetch}
        />
      )}

      {renderLayout(layout, {
        items: data?.items,
        showSourceIndicator: isAggregated && showSourceIndicator
      })}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] All layouts work with aggregated data
- [ ] Source indicators shown when enabled
- [ ] Status bar integrated
- [ ] Backward compatible

---

### ST-009-08: Add Source-Based Filtering
**Status:** `[ ]` Not Started
**Test File:** `tests/services/sourceFilter.test.ts`

**Description:**
Allow filtering items by source.

**Steps:**
1. Add source filter UI
2. Create filter logic
3. Persist filter selection
4. Show filtered count

**Source Filter:**
```typescript
interface SourceFilterProps {
  sources: FeedSource[];
  selectedSources: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const SourceFilter: React.FC<SourceFilterProps> = ({
  sources,
  selectedSources,
  onSelectionChange
}) => (
  <div className={styles.sourceFilter}>
    <span className={styles.label}>Filter by source:</span>
    <div className={styles.chips}>
      {sources.map(source => (
        <Chip
          key={source.id}
          label={source.name}
          color={source.color}
          selected={selectedSources.includes(source.id)}
          onClick={() => toggleSource(source.id)}
        />
      ))}
    </div>
    {selectedSources.length > 0 && selectedSources.length < sources.length && (
      <ActionButton onClick={() => onSelectionChange([])}>
        Clear filter
      </ActionButton>
    )}
  </div>
);
```

**Acceptance Criteria:**
- [ ] Filter by clicking source chips
- [ ] Multiple sources selectable
- [ ] Clear filter option
- [ ] Filter persisted in session

---

### ST-009-09: Implement Duplicate Detection
**Status:** `[ ]` Not Started
**Test File:** `tests/services/duplicateDetection.test.ts`

**Description:**
Detect and handle duplicate items when aggregating feeds from multiple sources. Items may appear in multiple feeds (e.g., syndicated content).

**Steps:**
1. Define duplicate detection strategies
2. Implement fingerprinting algorithm
3. Configure merge behavior
4. Add UI indicators for merged items (optional)

**Detection Strategies:**
```typescript
interface DuplicateDetectionConfig {
  enabled: boolean;
  strategy: 'url' | 'title' | 'combined' | 'fingerprint';
  titleSimilarityThreshold?: number;  // 0-1, for fuzzy matching
  keepStrategy: 'first' | 'newest' | 'mostComplete';
}

// Detection methods
const duplicateDetectors = {
  // Exact URL match (most reliable)
  url: (a: IRssItem, b: IRssItem) =>
    normalizeUrl(a.link) === normalizeUrl(b.link),

  // Title match (handles same article, different URLs)
  title: (a: IRssItem, b: IRssItem) =>
    normalizeTitle(a.title) === normalizeTitle(b.title),

  // Combined (URL or similar title + same date)
  combined: (a: IRssItem, b: IRssItem) => {
    if (normalizeUrl(a.link) === normalizeUrl(b.link)) return true;
    const sameDay = isSameDay(a.pubDate, b.pubDate);
    const similarTitle = calculateSimilarity(a.title, b.title) > 0.85;
    return sameDay && similarTitle;
  },

  // Content fingerprint (most thorough)
  fingerprint: (a: IRssItem, b: IRssItem) => {
    const fpA = generateFingerprint(a);
    const fpB = generateFingerprint(b);
    return fpA === fpB;
  },
};

// Fingerprint generation
function generateFingerprint(item: IRssItem): string {
  const normalized = [
    normalizeTitle(item.title),
    normalizeUrl(item.link),
    item.pubDate?.toISOString().split('T')[0],
  ].join('|');
  return hashString(normalized);
}

// Title normalization (for fuzzy matching)
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // Remove punctuation
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}
```

**Duplicate Handling:**
```typescript
class DuplicateHandler {
  private config: DuplicateDetectionConfig;
  private seen: Map<string, AggregatedFeedItem>;

  deduplicate(items: AggregatedFeedItem[]): AggregatedFeedItem[] {
    if (!this.config.enabled) return items;

    const unique: AggregatedFeedItem[] = [];
    this.seen.clear();

    for (const item of items) {
      const key = this.getKey(item);
      const existing = this.seen.get(key);

      if (!existing) {
        this.seen.set(key, item);
        unique.push(item);
      } else {
        // Merge or replace based on strategy
        const kept = this.resolveConflict(existing, item);
        if (kept !== existing) {
          // Replace in results
          const index = unique.indexOf(existing);
          unique[index] = kept;
          this.seen.set(key, kept);
        }
      }
    }

    return unique;
  }

  private resolveConflict(
    existing: AggregatedFeedItem,
    incoming: AggregatedFeedItem
  ): AggregatedFeedItem {
    switch (this.config.keepStrategy) {
      case 'first':
        return existing;
      case 'newest':
        return incoming.pubDate > existing.pubDate ? incoming : existing;
      case 'mostComplete':
        return this.scoreCompleteness(incoming) > this.scoreCompleteness(existing)
          ? incoming
          : existing;
      default:
        return existing;
    }
  }

  private scoreCompleteness(item: AggregatedFeedItem): number {
    let score = 0;
    if (item.title) score += 1;
    if (item.description) score += item.description.length > 100 ? 2 : 1;
    if (item.imageUrl) score += 2;
    if (item.author) score += 1;
    if (item.categories?.length) score += 1;
    return score;
  }
}
```

**Acceptance Criteria:**
- [ ] URL-based duplicates detected
- [ ] Fuzzy title matching works
- [ ] Correct item kept based on strategy
- [ ] Performance acceptable (< 50ms for 500 items)
- [ ] Configurable via property pane

---

### ST-009-10: Migration Strategy (feedUrl → feedUrls)
**Status:** `[ ]` Not Started
**Test File:** `tests/migration/feedUrlMigration.test.ts`

**Description:**
Implement backward-compatible migration from single `feedUrl` property to multi-feed `feedUrls` array.

**Steps:**
1. Support both old and new property names
2. Auto-migrate on first load
3. Preserve existing configurations
4. Clear migration logging

**Migration Implementation:**
```typescript
// In RssFeedWebPart.ts

interface ILegacyProperties {
  feedUrl?: string;  // Old single URL property
}

interface ICurrentProperties {
  feedUrls?: FeedSource[];  // New multi-feed property
}

type IWebPartProperties = ILegacyProperties & ICurrentProperties;

class RssFeedWebPart extends BaseClientSideWebPart<IWebPartProperties> {

  protected onInit(): Promise<void> {
    // Run migration if needed
    this.migrateProperties();
    return super.onInit();
  }

  private migrateProperties(): void {
    // Check if migration needed
    if (this.properties.feedUrl && !this.properties.feedUrls?.length) {
      console.log('[RSS Feed] Migrating from feedUrl to feedUrls');

      // Create feedUrls from legacy feedUrl
      this.properties.feedUrls = [{
        id: generateId(),
        url: this.properties.feedUrl,
        name: undefined,  // Will be auto-detected
        color: '#0078D4',
        enabled: true,
      }];

      // Clear legacy property (optional, can keep for rollback)
      // delete this.properties.feedUrl;

      // Mark webpart as modified to persist migration
      this.context.propertyPane.refresh();
    }
  }

  // Getter that handles both formats
  private get effectiveFeedUrls(): string[] {
    // Prefer new format
    if (this.properties.feedUrls?.length) {
      return this.properties.feedUrls
        .filter(s => s.enabled)
        .map(s => s.url);
    }

    // Fall back to legacy format
    if (this.properties.feedUrl) {
      return [this.properties.feedUrl];
    }

    return [];
  }
}
```

**Property Pane Migration UI:**
```typescript
// Show migration notice in property pane
{this.properties.feedUrl && !this.properties.feedUrls?.length && (
  <MessageBar messageBarType={MessageBarType.info}>
    <Text>
      Your feed configuration will be upgraded to support multiple feeds.
      Click "Upgrade" to migrate your settings.
    </Text>
    <DefaultButton text="Upgrade" onClick={this.migrateNow} />
  </MessageBar>
)}
```

**Manifest Update:**
```json
// webpart.manifest.json
{
  "preconfiguredEntries": [{
    "properties": {
      "feedUrls": [],  // New default
      "feedUrl": ""    // Keep for backward compatibility
    }
  }]
}
```

**Acceptance Criteria:**
- [ ] Existing single-feed webparts continue to work
- [ ] Migration runs automatically on load
- [ ] No data loss during migration
- [ ] Clear logging for debugging
- [ ] Can rollback if needed

---

## Feature Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Feed Aggregation Flow                         │
└─────────────────────────────────────────────────────────────────┘

Configuration (Property Pane)
┌────────────────────────────┐
│ Feed 1: example.com/feed   │
│ Feed 2: news.com/rss       │
│ Feed 3: blog.org/atom      │
└────────────────────────────┘
              │
              ▼
┌────────────────────────────┐
│   FeedAggregatorService    │
│                            │
│  ┌──────────────────────┐  │
│  │ Parallel Fetch:      │  │
│  │ - Feed 1 ✓           │  │
│  │ - Feed 2 ✓           │  │
│  │ - Feed 3 ✗ (error)   │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │ Merge & Sort:        │  │
│  │ [Item A from Feed 1] │  │
│  │ [Item B from Feed 2] │  │
│  │ [Item C from Feed 1] │  │
│  │ [Item D from Feed 2] │  │
│  │ ...                  │  │
│  └──────────────────────┘  │
└────────────────────────────┘
              │
              ▼
┌────────────────────────────┐
│     Render with Status     │
│                            │
│  [2/3 feeds loaded]        │
│  [▼ Feed 3: CORS error]    │
│                            │
│  ┌──────────────────────┐  │
│  │ 🔵 News Title (Feed1)│  │
│  │ 🟢 Blog Post (Feed2) │  │
│  │ 🔵 Update   (Feed1)  │  │
│  │ 🟢 Article  (Feed2)  │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

## Files to Create/Modify

```
src/webparts/polRssGallery/
├── models/
│   ├── FeedSource.ts              # New: feed source interfaces
│   └── FeedCollection.ts          # New: collection interfaces
├── services/
│   ├── FeedSourceManager.ts       # New: source CRUD
│   ├── FeedAggregatorService.ts   # New: aggregation logic
│   └── improvedFeedParser.ts      # Modify: return source info
├── components/
│   ├── RssFeed.tsx                # Modify: support multi-feed
│   ├── SourceIndicator.tsx        # New: source badge
│   ├── FeedStatusBar.tsx          # New: status display
│   ├── SourceFilter.tsx           # New: source filtering
│   └── layouts/*.tsx              # Modify: add source indicator
├── propertyPane/
│   └── MultiFeedConfig.tsx        # New: multi-feed config
└── RssFeedWebPart.ts              # Modify: add feedUrls property
```

## Related Tasks

- **REF-003-FEED-PARSER:** Robust parsing for all formats
- **REF-004-ERROR-HANDLING:** Per-feed error handling
- **REF-005-CACHING-PERFORMANCE:** Cache multiple feeds
- **REF-008-PROPERTY-PANE:** Multi-feed configuration UI
- **REF-010-ENHANCED-FILTERING:** Filter by source
