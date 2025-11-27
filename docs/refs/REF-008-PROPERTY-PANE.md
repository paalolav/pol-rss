# REF-008-PROPERTY-PANE

> **Status:** Completed
> **Priority:** Medium
> **Phase:** 3 - UI/UX Improvements
> **Estimated Complexity:** Medium
> **Completed:** 2025-11-27

## Overview

Improve the property pane configuration experience with grouped settings, live preview, feed URL validation, and preset templates. Make configuration intuitive for non-technical users.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE
- REF-007-LAYOUT-COMPONENTS

## Dependencies

- REF-007-LAYOUT-COMPONENTS

## Current Property Pane Analysis

Current properties in `RssFeedWebPart.ts`:
- 15+ configurable properties
- Flat structure (not grouped)
- No URL validation
- No live preview
- No presets

## Sub-Tasks

### ST-008-01: Reorganize Property Groups
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/presets.test.ts`, `tests/propertyPane/conditionalFields.test.ts`

**Description:**
Reorganize properties into logical groups with clear headers.

**Steps:**
1. Define property groups
2. Implement accordion-style groups
3. Add group descriptions
4. Order by importance/frequency

**Property Group Structure:**
```typescript
const getPropertyPaneConfiguration = (): IPropertyPaneConfiguration => ({
  pages: [
    {
      header: { description: strings.PropertyPaneDescription },
      groups: [
        {
          groupName: strings.BasicGroupName,
          groupFields: [
            // Title, Feed URL, Layout
          ],
          isCollapsed: false
        },
        {
          groupName: strings.DisplayGroupName,
          groupFields: [
            // Max items, Show date, Show description
          ],
          isCollapsed: true
        },
        {
          groupName: strings.FilterGroupName,
          groupFields: [
            // Keyword filter, Category filter
          ],
          isCollapsed: true
        },
        {
          groupName: strings.AdvancedGroupName,
          groupFields: [
            // Auto refresh, Proxy URL, Debug mode
          ],
          isCollapsed: true
        }
      ]
    }
  ]
});
```

**Property Groups:**

| Group | Properties |
|-------|------------|
| Basic | Title, Feed URL(s), Layout |
| Display | Max items, Show date, Show description, Show categories |
| Images | Force fallback, Fallback URL, Aspect ratio |
| Filtering | Keyword filter, Category filter, Filter mode |
| Carousel | Autoplay, Interval, Navigation style |
| Advanced | Proxy URL, Auto refresh, Refresh interval, Cache duration |

**Acceptance Criteria:**
- [ ] Groups are logically organized
- [ ] Most used options easily accessible
- [ ] Advanced options hidden by default
- [ ] Clear group descriptions

---

### ST-008-02: Implement Feed URL Validation
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/presets.test.ts`

**Description:**
Add real-time URL validation with status feedback in property pane.

**Steps:**
1. Create custom property pane control
2. Validate URL format on change
3. Test feed accessibility on blur
4. Show validation status inline
5. Provide error suggestions

**Custom Feed URL Control:**
```typescript
class PropertyPaneFeedUrl implements IPropertyPaneField<IPropertyPaneFeedUrlProps> {
  public type = PropertyPaneFieldType.Custom;

  private async validateUrl(url: string): Promise<ValidationResult> {
    // 1. Check URL format
    if (!isValidUrl(url)) {
      return { valid: false, message: 'Please enter a valid URL' };
    }

    // 2. Test feed accessibility
    try {
      const response = await testFeedUrl(url);
      return {
        valid: true,
        message: `Feed found: ${response.title} (${response.itemCount} items)`
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Unable to access feed. Try configuring a proxy URL.',
        suggestion: 'corsProxy'
      };
    }
  }

  public render(): React.ReactElement {
    return (
      <FeedUrlField
        value={this.properties.url}
        onChange={this.onChanged}
        validationResult={this.validationResult}
        isValidating={this.isValidating}
      />
    );
  }
}
```

**Validation States:**
```
[ ] Idle - No validation shown
[🔄] Validating - Spinner shown
[✓] Valid - Green checkmark, feed title shown
[✗] Invalid - Red X, error message, suggestions
```

**Acceptance Criteria:**
- [ ] URL format validated immediately
- [ ] Feed tested on blur
- [ ] Clear success/error states
- [ ] Helpful error messages

---

### ST-008-03: Add Layout Preview
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/presets.test.ts`

**Description:**
Show visual preview of layout options in property pane.

**Steps:**
1. Create layout preview component
2. Show mini preview for each option
3. Highlight current selection
4. Update on hover (optional)

**Layout Preview Control:**
```typescript
interface LayoutOption {
  key: 'banner' | 'card' | 'list';
  label: string;
  icon: string;
  preview: React.ReactNode;
}

const layoutOptions: LayoutOption[] = [
  {
    key: 'banner',
    label: 'Banner',
    icon: 'PictureStretch',
    preview: <BannerPreview />
  },
  {
    key: 'card',
    label: 'Cards',
    icon: 'GridViewSmall',
    preview: <CardPreview />
  },
  {
    key: 'list',
    label: 'List',
    icon: 'BulletedList',
    preview: <ListPreview />
  }
];

const PropertyPaneLayoutPicker: React.FC = ({ value, onChange }) => (
  <div className={styles.layoutPicker}>
    {layoutOptions.map(option => (
      <button
        key={option.key}
        className={classNames(styles.option, { [styles.selected]: value === option.key })}
        onClick={() => onChange(option.key)}
        aria-pressed={value === option.key}
      >
        <Icon iconName={option.icon} />
        <span>{option.label}</span>
        <div className={styles.preview}>{option.preview}</div>
      </button>
    ))}
  </div>
);
```

**Acceptance Criteria:**
- [ ] Visual previews for each layout
- [ ] Clear selection state
- [ ] Accessible keyboard navigation
- [ ] Tooltips with descriptions

---

### ST-008-04: Create Preset Templates
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/presets.test.ts`

**Description:**
Add preset configurations for common use cases.

**Steps:**
1. Define preset configurations
2. Create preset picker control
3. Apply preset on selection
4. Allow customization after preset

**Preset Definitions:**
```typescript
interface Preset {
  key: string;
  label: string;
  description: string;
  config: Partial<IRssFeedWebPartProps>;
}

const presets: Preset[] = [
  {
    key: 'news-banner',
    label: 'News Banner',
    description: 'Full-width rotating banner for featured news',
    config: {
      layout: 'banner',
      autoscroll: true,
      interval: 5,
      maxItems: 5,
      showDescription: false
    }
  },
  {
    key: 'blog-cards',
    label: 'Blog Grid',
    description: 'Card grid ideal for blog posts with images',
    config: {
      layout: 'card',
      maxItems: 6,
      showDescription: true,
      showPubDate: true
    }
  },
  {
    key: 'compact-list',
    label: 'Compact List',
    description: 'Space-efficient list for sidebar placement',
    config: {
      layout: 'list',
      maxItems: 10,
      showDescription: false,
      showPubDate: true
    }
  },
  {
    key: 'custom',
    label: 'Custom',
    description: 'Configure all options manually',
    config: {}
  }
];
```

**Acceptance Criteria:**
- [ ] Presets apply all settings
- [ ] User can customize after
- [ ] Clear preset descriptions
- [ ] "Custom" option available

---

### ST-008-05: Implement Conditional Fields
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/conditionalFields.test.ts`

**Description:**
Show/hide fields based on other settings (e.g., carousel options only for banner layout).

**Steps:**
1. Define field dependencies
2. Implement conditional rendering
3. Smooth show/hide transitions
4. Maintain values when hidden

**Conditional Logic:**
```typescript
const shouldShowField = (
  fieldKey: string,
  properties: IRssFeedWebPartProps
): boolean => {
  const rules: Record<string, () => boolean> = {
    // Carousel settings only for banner
    autoscroll: () => properties.layout === 'banner',
    interval: () => properties.layout === 'banner' && properties.autoscroll,

    // Filter keywords only when filtering enabled
    filterKeywords: () => properties.filterByKeywords,
    filterMode: () => properties.filterByKeywords,

    // Category filter only when enabled
    categoryFilterMode: () => properties.filterByCategory,

    // Fallback image URL only when force fallback
    fallbackImageUrl: () => properties.forceFallbackImage,

    // Refresh interval only when auto refresh
    refreshInterval: () => properties.autoRefresh
  };

  return rules[fieldKey]?.() ?? true;
};
```

**Acceptance Criteria:**
- [ ] Irrelevant fields hidden
- [ ] Values preserved when hidden
- [ ] Smooth transitions
- [ ] Clear dependencies

---

### ST-008-06: Add Proxy Configuration Section
**Status:** `[x]` Completed
**Test File:** `tests/propertyPane/conditionalFields.test.ts`

**Description:**
Add dedicated proxy configuration with connection testing.

**Steps:**
1. Add proxy URL field
2. Add connection test button
3. Show connection status
4. Link to deployment guide

**Proxy Configuration:**
```typescript
const ProxyConfigSection: React.FC = ({
  proxyUrl,
  onProxyUrlChange,
  onTestConnection
}) => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    const result = await onTestConnection(proxyUrl);
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className={styles.proxyConfig}>
      <TextField
        label="Proxy URL"
        value={proxyUrl}
        onChange={onProxyUrlChange}
        placeholder="https://your-proxy.azurewebsites.net/api/proxy"
        description="Optional: Configure a custom CORS proxy for reliable feed access"
      />
      <PrimaryButton
        onClick={handleTest}
        disabled={!proxyUrl || testing}
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </PrimaryButton>
      {testResult && (
        <MessageBar messageBarType={testResult.success ? MessageBarType.success : MessageBarType.error}>
          {testResult.message}
        </MessageBar>
      )}
      <Link href="https://docs.example.com/proxy-setup">
        Learn how to deploy your own proxy
      </Link>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Proxy URL configurable
- [ ] Connection test works
- [ ] Clear status feedback
- [ ] Help link provided

---

### ST-008-07: Localize All Strings
**Status:** `[x]` Completed
**Test File:** N/A (strings verified in localization files)

**Description:**
Ensure all property pane strings are localized.

**Steps:**
1. Audit all hardcoded strings
2. Add to localization files
3. Translate to nb-no and nn-no
4. Test all locales

**Localization Keys:**
```typescript
// loc/mystrings.d.ts
declare interface IRssFeedWebPartStrings {
  // Group names
  BasicGroupName: string;
  DisplayGroupName: string;
  FilterGroupName: string;
  AdvancedGroupName: string;

  // Field labels
  FeedUrlLabel: string;
  FeedUrlDescription: string;
  FeedUrlPlaceholder: string;
  LayoutLabel: string;
  MaxItemsLabel: string;

  // Validation messages
  UrlInvalidFormat: string;
  UrlFeedNotFound: string;
  UrlFeedSuccess: string;

  // Presets
  PresetNewsBanner: string;
  PresetBlogCards: string;
  PresetCompactList: string;
  PresetCustom: string;
}
```

**Acceptance Criteria:**
- [ ] No hardcoded strings
- [ ] All locales complete
- [ ] Translations reviewed
- [ ] Fallback to English

---

## Property Pane Mockup

```
┌─────────────────────────────────────────────────────────────┐
│  RSS Feed Gallery Settings                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ▼ Basic Settings                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Web Part Title                                         │ │
│  │ ┌─────────────────────────────────────────────────┐    │ │
│  │ │ Latest News                                     │    │ │
│  │ └─────────────────────────────────────────────────┘    │ │
│  │                                                        │ │
│  │ Feed URL                                              │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ https://www.nrk.no/toppsaker.rss         ✓     │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │ ✓ Feed found: NRK Toppsaker (15 items)               │ │
│  │                                                        │ │
│  │ Layout                                                │ │
│  │ ┌────────┐ ┌────────┐ ┌────────┐                     │ │
│  │ │ Banner │ │ ▣ Cards│ │  List  │                     │ │
│  │ │  ═══   │ │  ▢ ▢   │ │  ───   │                     │ │
│  │ │        │ │  ▢ ▢   │ │  ───   │                     │ │
│  │ └────────┘ └────────┘ └────────┘                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ▶ Display Options (click to expand)                        │
│  ▶ Filtering                                                │
│  ▶ Advanced                                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Files to Create/Modify

```
src/webparts/polRssGallery/
├── RssFeedWebPart.ts                # Modify: restructure getPropertyPaneConfiguration
├── propertyPane/
│   ├── PropertyPaneFeedUrl.tsx      # New: custom feed URL control
│   ├── PropertyPaneLayoutPicker.tsx # New: layout preview picker
│   ├── PropertyPanePresets.tsx      # New: preset selector
│   ├── PropertyPaneProxyConfig.tsx  # New: proxy configuration
│   └── index.ts                     # New: exports
└── loc/
    ├── en-us.js                     # Modify: add strings
    ├── nb-no.js                     # Modify: add translations
    └── nn-no.js                     # Modify: add translations
```

## Related Tasks

- **REF-002-AZURE-PROXY:** Proxy configuration integration
- **REF-004-ERROR-HANDLING:** Validation error messages
- **REF-007-LAYOUT-COMPONENTS:** Layout preview visuals
- **REF-009-FEED-AGGREGATION:** Multi-feed URL configuration
