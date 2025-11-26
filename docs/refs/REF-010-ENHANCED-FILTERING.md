# REF-010-ENHANCED-FILTERING

> **Status:** Not Started
> **Priority:** Low
> **Phase:** 4 - New Features
> **Estimated Complexity:** Medium

## Overview

Implement advanced filtering capabilities including date range filtering, full-text search, category multi-select, and the ability to save filter presets. Make it easy for users to find specific content within RSS feeds.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE
- REF-007-LAYOUT-COMPONENTS (for filter UI integration)
- REF-009-FEED-AGGREGATION (for source filtering)

## Dependencies

- REF-007-LAYOUT-COMPONENTS
- REF-009-FEED-AGGREGATION (optional)

## Current Filtering Analysis

Existing filtering in `RssFeed.tsx`:
- Keyword filter (include/exclude mode)
- Category filter (basic)
- No date filtering
- No search
- No saved presets

## Sub-Tasks

### ST-010-01: Design Filter System Architecture
**Status:** `[ ]` Not Started
**Test File:** `tests/services/filterSystem.test.ts`

**Description:**
Design extensible filter system that supports multiple filter types.

**Steps:**
1. Define filter types and interfaces
2. Design composable filter pipeline
3. Plan filter state management
4. Design preset serialization

**Filter System Types:**
```typescript
// Base filter interface
interface Filter<T = unknown> {
  id: string;
  type: FilterType;
  label: string;
  value: T;
  isActive: boolean;
}

type FilterType =
  | 'keyword'
  | 'category'
  | 'dateRange'
  | 'search'
  | 'source';

// Specific filter types
interface KeywordFilter extends Filter<string[]> {
  type: 'keyword';
  mode: 'include' | 'exclude';
  matchField: 'title' | 'description' | 'both';
}

interface DateRangeFilter extends Filter<{ start?: Date; end?: Date }> {
  type: 'dateRange';
  preset?: 'today' | 'week' | 'month' | 'custom';
}

interface SearchFilter extends Filter<string> {
  type: 'search';
  caseSensitive: boolean;
  matchField: 'title' | 'description' | 'both';
}

interface CategoryFilter extends Filter<string[]> {
  type: 'category';
  mode: 'include' | 'exclude';
}

interface SourceFilter extends Filter<string[]> {
  type: 'source';
}

// Filter pipeline
type FilterPipeline = (Filter<unknown>)[];

interface FilterState {
  filters: FilterPipeline;
  resultCount: number;
  totalCount: number;
}
```

**Acceptance Criteria:**
- [ ] All filter types defined
- [ ] Interfaces are extensible
- [ ] Clear composition model
- [ ] State management planned

---

### ST-010-02: Implement Filter Service
**Status:** `[ ]` Not Started
**Test File:** `tests/services/filterService.test.ts`

**Description:**
Create service to apply filters to feed items.

**Steps:**
1. Create FilterService class
2. Implement filter application
3. Support filter composition (AND logic)
4. Optimize for performance
5. Return filtered results with metadata

**Filter Service:**
```typescript
class FilterService {
  private filters: FilterPipeline = [];

  setFilters(filters: FilterPipeline): void {
    this.filters = filters;
  }

  addFilter(filter: Filter): void {
    this.filters.push(filter);
  }

  removeFilter(filterId: string): void {
    this.filters = this.filters.filter(f => f.id !== filterId);
  }

  apply(items: IRssItem[]): FilterResult {
    const activeFilters = this.filters.filter(f => f.isActive);

    if (activeFilters.length === 0) {
      return { items, matchCount: items.length, totalCount: items.length };
    }

    const filtered = items.filter(item =>
      activeFilters.every(filter => this.matchFilter(item, filter))
    );

    return {
      items: filtered,
      matchCount: filtered.length,
      totalCount: items.length
    };
  }

  private matchFilter(item: IRssItem, filter: Filter): boolean {
    switch (filter.type) {
      case 'keyword':
        return this.matchKeyword(item, filter as KeywordFilter);
      case 'dateRange':
        return this.matchDateRange(item, filter as DateRangeFilter);
      case 'search':
        return this.matchSearch(item, filter as SearchFilter);
      case 'category':
        return this.matchCategory(item, filter as CategoryFilter);
      case 'source':
        return this.matchSource(item, filter as SourceFilter);
      default:
        return true;
    }
  }

  private matchKeyword(item: IRssItem, filter: KeywordFilter): boolean {
    const text = this.getSearchText(item, filter.matchField);
    const hasKeyword = filter.value.some(kw =>
      text.toLowerCase().includes(kw.toLowerCase())
    );
    return filter.mode === 'include' ? hasKeyword : !hasKeyword;
  }

  private matchDateRange(item: IRssItem, filter: DateRangeFilter): boolean {
    const pubDate = new Date(item.pubDate);
    const { start, end } = filter.value;
    if (start && pubDate < start) return false;
    if (end && pubDate > end) return false;
    return true;
  }

  private matchSearch(item: IRssItem, filter: SearchFilter): boolean {
    const text = this.getSearchText(item, filter.matchField);
    const searchTerm = filter.caseSensitive
      ? filter.value
      : filter.value.toLowerCase();
    const targetText = filter.caseSensitive ? text : text.toLowerCase();
    return targetText.includes(searchTerm);
  }
}
```

**Acceptance Criteria:**
- [ ] All filter types implemented
- [ ] Filters compose correctly
- [ ] Performance acceptable
- [ ] Metadata returned

---

### ST-010-03: Create Search Input Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/SearchInput.test.tsx`

**Description:**
Create search input with debouncing and clear button.

**Steps:**
1. Create SearchInput component
2. Implement debounced onChange
3. Add clear button
4. Show result count
5. Support keyboard shortcuts

**Search Input Component:**
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  resultCount?: number;
  totalCount?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  resultCount,
  totalCount
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useMemo(
    () => debounce(onChange, debounceMs),
    [onChange, debounceMs]
  );

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={styles.searchInput}>
      <Icon iconName="Search" className={styles.searchIcon} />
      <input
        type="search"
        value={localValue}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search feed items"
      />
      {localValue && (
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={handleClear}
          aria-label="Clear search"
          className={styles.clearButton}
        />
      )}
      {resultCount !== undefined && (
        <span className={styles.resultCount}>
          {resultCount} of {totalCount}
        </span>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Debouncing prevents excess filtering
- [ ] Clear button works
- [ ] Result count displayed
- [ ] Accessible

---

### ST-010-04: Create Date Range Picker
**Status:** `[ ]` Not Started
**Test File:** `tests/components/DateRangePicker.test.tsx`

**Description:**
Create date range picker with presets.

**Steps:**
1. Create DateRangePicker component
2. Add common presets (today, week, month)
3. Support custom date range
4. Localize date formatting
5. Integrate with Fluent UI

**Date Range Picker:**
```typescript
interface DateRangePickerProps {
  value: { start?: Date; end?: Date };
  onChange: (range: { start?: Date; end?: Date }) => void;
  presets?: DatePreset[];
}

type DatePreset = {
  key: string;
  label: string;
  getRange: () => { start: Date; end: Date };
};

const defaultPresets: DatePreset[] = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => ({
      start: startOfDay(new Date()),
      end: endOfDay(new Date())
    })
  },
  {
    key: 'week',
    label: 'This Week',
    getRange: () => ({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date())
    })
  },
  {
    key: 'month',
    label: 'This Month',
    getRange: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    })
  },
  {
    key: 'custom',
    label: 'Custom Range',
    getRange: () => ({ start: undefined, end: undefined })
  }
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  presets = defaultPresets
}) => (
  <div className={styles.dateRangePicker}>
    <Dropdown
      options={presets.map(p => ({ key: p.key, text: p.label }))}
      selectedKey={getSelectedPreset(value)}
      onChange={(_, option) => handlePresetChange(option.key)}
    />

    {isCustomRange && (
      <div className={styles.customRange}>
        <DatePicker
          label="From"
          value={value.start}
          onSelectDate={date => onChange({ ...value, start: date })}
          maxDate={value.end}
        />
        <DatePicker
          label="To"
          value={value.end}
          onSelectDate={date => onChange({ ...value, end: date })}
          minDate={value.start}
        />
      </div>
    )}
  </div>
);
```

**Acceptance Criteria:**
- [ ] Presets work correctly
- [ ] Custom range selectable
- [ ] Date validation (start < end)
- [ ] Localized date format

---

### ST-010-05: Create Category Multi-Select
**Status:** `[ ]` Not Started
**Test File:** `tests/components/CategoryMultiSelect.test.tsx`

**Description:**
Create category multi-select with chips.

**Steps:**
1. Create CategoryMultiSelect component
2. Extract categories from items
3. Show category chips
4. Support multi-selection
5. Show count per category

**Category Multi-Select:**
```typescript
interface CategoryMultiSelectProps {
  items: IRssItem[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  mode: 'include' | 'exclude';
  onModeChange: (mode: 'include' | 'exclude') => void;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  items,
  selectedCategories,
  onChange,
  mode,
  onModeChange
}) => {
  // Extract and count categories
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach(item => {
      item.categories?.forEach(cat => {
        counts.set(cat, (counts.get(cat) || 0) + 1);
      });
    });
    return counts;
  }, [items]);

  const categories = Array.from(categoryCounts.keys()).sort();

  return (
    <div className={styles.categorySelect}>
      <div className={styles.header}>
        <span>Categories</span>
        <Toggle
          onText="Include"
          offText="Exclude"
          checked={mode === 'include'}
          onChange={(_, checked) => onModeChange(checked ? 'include' : 'exclude')}
        />
      </div>

      <div className={styles.categoryChips}>
        {categories.map(category => (
          <Chip
            key={category}
            label={`${category} (${categoryCounts.get(category)})`}
            selected={selectedCategories.includes(category)}
            onClick={() => toggleCategory(category)}
          />
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <ActionButton onClick={() => onChange([])}>
          Clear selection
        </ActionButton>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Categories extracted from items
- [ ] Multi-select works
- [ ] Include/exclude mode
- [ ] Count shown per category

---

### ST-010-06: Create Filter Panel Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/FilterPanel.test.tsx`

**Description:**
Create collapsible filter panel combining all filter controls.

**Steps:**
1. Create FilterPanel component
2. Combine all filter controls
3. Show active filter count
4. Collapsible design
5. Clear all filters button

**Filter Panel:**
```typescript
interface FilterPanelProps {
  items: IRssItem[];
  filterState: FilterState;
  onFilterChange: (filters: FilterPipeline) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  items,
  filterState,
  onFilterChange,
  collapsed = true,
  onCollapsedChange
}) => {
  const activeCount = filterState.filters.filter(f => f.isActive).length;

  return (
    <div className={styles.filterPanel}>
      <div className={styles.header} onClick={() => onCollapsedChange?.(!collapsed)}>
        <Icon iconName="Filter" />
        <span>Filters</span>
        {activeCount > 0 && (
          <Badge>{activeCount} active</Badge>
        )}
        <Icon iconName={collapsed ? 'ChevronDown' : 'ChevronUp'} />
      </div>

      {!collapsed && (
        <div className={styles.filters}>
          <SearchInput
            value={getSearchFilter(filterState).value}
            onChange={value => updateFilter('search', value)}
            resultCount={filterState.resultCount}
            totalCount={filterState.totalCount}
          />

          <DateRangePicker
            value={getDateFilter(filterState).value}
            onChange={value => updateFilter('dateRange', value)}
          />

          <CategoryMultiSelect
            items={items}
            selectedCategories={getCategoryFilter(filterState).value}
            onChange={value => updateFilter('category', value)}
            mode={getCategoryFilter(filterState).mode}
            onModeChange={mode => updateFilterMode('category', mode)}
          />

          {activeCount > 0 && (
            <ActionButton onClick={clearAllFilters}>
              Clear all filters
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] All filters in one panel
- [ ] Collapsible design
- [ ] Active filter count shown
- [ ] Clear all works

---

### ST-010-07: Implement Filter Presets
**Status:** `[ ]` Not Started
**Test File:** `tests/services/filterPresets.test.ts`

**Description:**
Allow saving and loading filter presets.

**Steps:**
1. Define preset interface
2. Create save preset UI
3. Implement localStorage persistence
4. Add preset selection dropdown
5. Support preset deletion

**Filter Presets:**
```typescript
interface FilterPreset {
  id: string;
  name: string;
  filters: FilterPipeline;
  createdAt: Date;
}

class FilterPresetManager {
  private storageKey = 'rss-filter-presets';

  getPresets(): FilterPreset[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  savePreset(name: string, filters: FilterPipeline): FilterPreset {
    const presets = this.getPresets();
    const preset: FilterPreset = {
      id: generateId(),
      name,
      filters,
      createdAt: new Date()
    };
    presets.push(preset);
    localStorage.setItem(this.storageKey, JSON.stringify(presets));
    return preset;
  }

  deletePreset(id: string): void {
    const presets = this.getPresets().filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(presets));
  }

  loadPreset(id: string): FilterPreset | undefined {
    return this.getPresets().find(p => p.id === id);
  }
}

// UI Component
const PresetSelector: React.FC<PresetSelectorProps> = ({
  onPresetSelect,
  onSavePreset,
  currentFilters
}) => (
  <div className={styles.presetSelector}>
    <Dropdown
      placeholder="Load preset..."
      options={presets.map(p => ({ key: p.id, text: p.name }))}
      onChange={(_, option) => handleLoadPreset(option.key)}
    />
    <ActionButton onClick={openSaveDialog}>
      Save current filters
    </ActionButton>
  </div>
);
```

**Acceptance Criteria:**
- [ ] Save presets to localStorage
- [ ] Load presets by selection
- [ ] Delete presets
- [ ] Unique preset names

---

### ST-010-08: Implement URL State for Shareable Filters
**Status:** `[ ]` Not Started
**Test File:** `tests/hooks/useFilterUrlState.test.ts`

**Description:**
Persist filter state in URL parameters to enable shareable filtered views. Users can share a link that opens the feed with specific filters already applied.

**Steps:**
1. Design URL parameter schema
2. Create serialization/deserialization functions
3. Sync filter state with URL
4. Handle page load with URL params
5. Consider URL length limits

**URL Schema:**
```
?filters=<base64-encoded-state>

# Or individual params (more readable but longer):
?q=technology&dateFrom=2025-11-01&dateTo=2025-11-24&cat=Tech,AI&sources=feed1,feed2
```

**Implementation:**
```typescript
// hooks/useFilterUrlState.ts
interface FilterUrlState {
  search?: string;
  dateFrom?: string;  // ISO date
  dateTo?: string;    // ISO date
  categories?: string[];
  sources?: string[];
  catMode?: 'include' | 'exclude';
}

const PARAM_KEYS = {
  search: 'q',
  dateFrom: 'from',
  dateTo: 'to',
  categories: 'cat',
  sources: 'src',
  categoryMode: 'catMode',
};

export function useFilterUrlState(
  initialFilters: FilterPipeline,
  onFiltersChange: (filters: FilterPipeline) => void
): {
  syncToUrl: (filters: FilterPipeline) => void;
  getShareableUrl: () => string;
} {
  // Parse URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters = parseUrlParams(params);

    if (Object.keys(urlFilters).length > 0) {
      const filters = urlFiltersToFilterPipeline(urlFilters);
      onFiltersChange(filters);
    }
  }, []);

  const syncToUrl = useCallback((filters: FilterPipeline) => {
    const urlState = filterPipelineToUrlState(filters);
    const params = buildUrlParams(urlState);

    // Update URL without page reload
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, []);

  const getShareableUrl = useCallback(() => {
    return window.location.href;
  }, []);

  return { syncToUrl, getShareableUrl };
}

// URL param serialization
function buildUrlParams(state: FilterUrlState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) {
    params.set(PARAM_KEYS.search, state.search);
  }

  if (state.dateFrom) {
    params.set(PARAM_KEYS.dateFrom, state.dateFrom);
  }

  if (state.dateTo) {
    params.set(PARAM_KEYS.dateTo, state.dateTo);
  }

  if (state.categories?.length) {
    params.set(PARAM_KEYS.categories, state.categories.join(','));
  }

  if (state.sources?.length) {
    params.set(PARAM_KEYS.sources, state.sources.join(','));
  }

  if (state.catMode && state.catMode !== 'include') {
    params.set(PARAM_KEYS.categoryMode, state.catMode);
  }

  return params;
}

// URL param parsing
function parseUrlParams(params: URLSearchParams): FilterUrlState {
  const state: FilterUrlState = {};

  const search = params.get(PARAM_KEYS.search);
  if (search) state.search = search;

  const dateFrom = params.get(PARAM_KEYS.dateFrom);
  if (dateFrom) state.dateFrom = dateFrom;

  const dateTo = params.get(PARAM_KEYS.dateTo);
  if (dateTo) state.dateTo = dateTo;

  const categories = params.get(PARAM_KEYS.categories);
  if (categories) state.categories = categories.split(',');

  const sources = params.get(PARAM_KEYS.sources);
  if (sources) state.sources = sources.split(',');

  const catMode = params.get(PARAM_KEYS.categoryMode);
  if (catMode === 'exclude') state.catMode = 'exclude';

  return state;
}

// Convert to filter pipeline
function urlFiltersToFilterPipeline(urlState: FilterUrlState): FilterPipeline {
  const filters: FilterPipeline = [];

  if (urlState.search) {
    filters.push({
      id: 'url-search',
      type: 'search',
      label: 'Search',
      value: urlState.search,
      isActive: true,
      caseSensitive: false,
      matchField: 'both',
    });
  }

  if (urlState.dateFrom || urlState.dateTo) {
    filters.push({
      id: 'url-date',
      type: 'dateRange',
      label: 'Date Range',
      value: {
        start: urlState.dateFrom ? new Date(urlState.dateFrom) : undefined,
        end: urlState.dateTo ? new Date(urlState.dateTo) : undefined,
      },
      isActive: true,
    });
  }

  if (urlState.categories?.length) {
    filters.push({
      id: 'url-categories',
      type: 'category',
      label: 'Categories',
      value: urlState.categories,
      isActive: true,
      mode: urlState.catMode || 'include',
    });
  }

  if (urlState.sources?.length) {
    filters.push({
      id: 'url-sources',
      type: 'source',
      label: 'Sources',
      value: urlState.sources,
      isActive: true,
    });
  }

  return filters;
}
```

**Share Button Component:**
```typescript
interface ShareFilterButtonProps {
  filters: FilterPipeline;
}

const ShareFilterButton: React.FC<ShareFilterButtonProps> = ({ filters }) => {
  const [copied, setCopied] = useState(false);
  const { getShareableUrl } = useFilterUrlState(filters, () => {});

  const handleShare = async () => {
    const url = getShareableUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      prompt('Copy this URL:', url);
    }
  };

  const hasActiveFilters = filters.some(f => f.isActive);

  if (!hasActiveFilters) return null;

  return (
    <ActionButton
      iconProps={{ iconName: copied ? 'CheckMark' : 'Share' }}
      onClick={handleShare}
      title="Copy shareable link with current filters"
    >
      {copied ? 'Copied!' : 'Share filters'}
    </ActionButton>
  );
};
```

**Acceptance Criteria:**
- [ ] Filters serialized to URL params
- [ ] URL parsed on page load
- [ ] URL updates without page reload
- [ ] Share button copies URL
- [ ] Works with all filter types
- [ ] Handles special characters in search

---

## Filter UI Mockup

```
┌─────────────────────────────────────────────────────────────────┐
│  ▼ Filters (2 active)                                  [Clear] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search: [technology____________] 12 of 50 results           │
│                                                                  │
│  📅 Date Range: [This Week ▼]                                   │
│                                                                  │
│  🏷️ Categories: [Include ▼]                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │✓ Tech(8)│ │ News(12)│ │✓ AI(5) │ │ Sport(3)│              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│  💾 Presets: [Load preset... ▼] [Save current]                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Files to Create/Modify

```
src/webparts/polRssGallery/
├── filters/
│   ├── types.ts                    # New: filter type definitions
│   ├── FilterService.ts            # New: filter application
│   └── FilterPresetManager.ts      # New: preset management
├── components/
│   ├── RssFeed.tsx                 # Modify: integrate filtering
│   ├── filters/
│   │   ├── FilterPanel.tsx         # New: main filter panel
│   │   ├── SearchInput.tsx         # New: search input
│   │   ├── DateRangePicker.tsx     # New: date range
│   │   ├── CategoryMultiSelect.tsx # New: category select
│   │   └── PresetSelector.tsx      # New: preset UI
│   └── shared/
│       └── Chip.tsx                # New: chip component
├── hooks/
│   └── useFilters.ts               # New: filter state hook
└── loc/
    ├── en-us.js                    # Modify: filter strings
    ├── nb-no.js                    # Modify: translations
    └── nn-no.js                    # Modify: translations
```

## Related Tasks

- **REF-007-LAYOUT-COMPONENTS:** Filter UI integration
- **REF-009-FEED-AGGREGATION:** Source filtering integration
