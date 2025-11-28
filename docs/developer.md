# POL RSS Gallery - Developer Documentation

> Version: 1.3.0
> For developers extending or customizing the web part

This documentation covers the architecture, APIs, and extension points for the POL RSS Gallery SPFx web part.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Services](#services)
5. [Interfaces](#interfaces)
6. [Extension Points](#extension-points)
7. [Testing](#testing)
8. [Build & Deployment](#build--deployment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RssFeedWebPart.ts                        │
│                   (SPFx Entry Point)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RssFeed.tsx                            │
│                  (Main React Component)                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Caching   │  │   Parsing   │  │   Layout Selection  │  │
│  │ (SWR/IndexedDB)│ │(Multi-format)│ │ (Lazy-loaded)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌───────────┐       ┌───────────┐       ┌───────────┐
    │  Banner   │       │   Card    │       │  Gallery  │
    │  Carousel │       │  Layout   │       │  Layout   │
    └───────────┘       └───────────┘       └───────────┘
```

### Data Flow

1. **Feed Loading**: `RssFeed` checks cache → fetches via `ProxyService` → parses with `ImprovedFeedParser`
2. **Caching**: Two-tier cache (Memory L1 → IndexedDB L2) with SWR pattern
3. **Rendering**: Layout components receive parsed items via props
4. **Error Handling**: `ErrorBoundary` wraps layouts; errors classified by severity

---

## Project Structure

```
src/webparts/polRssGallery/
├── RssFeedWebPart.ts          # SPFx web part entry point
├── RssFeedWebPart.manifest.json
├── components/
│   ├── RssFeed.tsx            # Main orchestration component
│   ├── RssFeed.module.scss    # Main styles
│   ├── IRssItem.ts            # Core item interface
│   ├── rssUtils.ts            # Utility functions
│   ├── layouts/               # Layout components
│   │   ├── BannerCarousel/
│   │   ├── CardLayout/
│   │   ├── ListLayout/
│   │   ├── MinimalLayout/
│   │   └── GalleryLayout/
│   └── shared/                # Reusable components
│       ├── FeedItem/
│       ├── Skeleton/
│       └── EmptyState/
├── services/                  # Business logic
│   ├── ImprovedFeedParser.ts  # XML/JSON parsing
│   ├── ProxyService.ts        # CORS handling
│   ├── CacheService.ts        # In-memory cache
│   ├── feedTypes.ts           # Type definitions
│   └── ...                    # Other services
├── errors/                    # Error handling
│   ├── errorTypes.ts
│   ├── ErrorBoundary.tsx
│   └── ErrorDisplay.tsx
├── hooks/                     # Custom React hooks
│   ├── useContainerSize.ts
│   ├── useTouchInteraction.ts
│   └── useOnlineStatus.ts
├── propertyPane/              # Property pane controls
│   ├── PropertyPaneFeedUrl.ts
│   ├── PropertyPaneLayoutPicker.ts
│   ├── PropertyPanePresets.ts
│   └── conditionalFields.ts
├── utils/                     # Utilities
│   ├── breakpoints.ts
│   ├── rssDebugUtils.ts
│   └── encodingUtils.ts
└── loc/                       # Localization
    ├── en-us.js
    ├── nb-no.js
    ├── nn-no.js
    └── RssFeedWebPartStrings.d.ts
```

---

## Core Components

### RssFeedWebPart.ts

The SPFx web part entry point. Responsible for:
- Property pane configuration
- Theme provider initialization
- Passing props to React component

```typescript
// Key methods
public render(): void
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration
protected onPropertyPaneFieldChanged(propertyPath: string, ...): void
```

### RssFeed.tsx

Main React component orchestrating:
- Feed fetching and caching
- Error handling and loading states
- Layout component selection (lazy-loaded)

```typescript
interface IRssFeedProps {
  feedUrl: string;
  maxItems: number;
  layout: LayoutType;
  showDate: boolean;
  showDescription: boolean;
  showSource: boolean;
  fallbackImageUrl?: string;
  // ... more props
}
```

### Layout Components

All layouts implement a common prop interface:

```typescript
interface ILayoutProps {
  items: IRssItem[];
  isLoading: boolean;
  showDate?: boolean;
  showDescription?: boolean;
  showSource?: boolean;
  forceFallback?: boolean;
  fallbackImageUrl?: string;
}
```

**Available Layouts:**
- `BannerCarousel` - Swiper-based carousel
- `CardLayout` - Responsive card grid
- `ListLayout` - Vertical list with thumbnails
- `MinimalLayout` - Text-only compact list
- `GalleryLayout` - Masonry-style image grid

---

## Services

### ImprovedFeedParser

Static class for parsing RSS/Atom/JSON feeds.

```typescript
class ImprovedFeedParser {
  /**
   * Parse feed content (backwards-compatible)
   */
  static parse(xmlString: string, options: IFeedParserOptions): IRssItem[];

  /**
   * Parse with recovery information
   */
  static parseWithRecovery(
    xmlString: string,
    options: IFeedParserOptions
  ): IFeedParseResult;
}

interface IFeedParserOptions {
  fallbackImageUrl: string;
  maxItems?: number;
  enableDebug?: boolean;
  enableRecovery?: boolean;  // Default: true
  recoveryOptions?: RecoveryOptions;
}

interface IFeedParseResult {
  items: IRssItem[];
  recoveryUsed: boolean;
  recoveryInfo?: RecoveryResult;
  warnings: string[];
}
```

**Supported Formats:**
- RSS 2.0 (standard)
- RSS 1.0 (RDF)
- Atom 1.0
- JSON Feed 1.0/1.1

### ProxyService

Handles CORS with multiple fallback strategies.

```typescript
class ProxyService {
  static getInstance(): ProxyService;

  async fetchWithProxy(
    url: string,
    options?: FetchOptions
  ): Promise<Response>;
}
```

**Proxy Chain:**
1. Configured Azure Function (if set)
2. AllOrigins.win
3. CorsProxy.io
4. Direct fetch (last resort)

### CacheService

In-memory caching with TTL support.

```typescript
class CacheService {
  static getInstance(): CacheService;

  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs?: number): void;
  invalidate(key: string): void;
  clear(): void;
}
```

### Additional Services

| Service | Purpose |
|---------|---------|
| `UnifiedCacheService` | Two-tier caching (Memory + IndexedDB) |
| `SwrService` | Stale-while-revalidate pattern |
| `FeedPreloader` | Background feed preloading |
| `ContentSanitizer` | DOMPurify-based XSS prevention |
| `RetryService` | Exponential backoff for failures |

---

## Interfaces

### IRssItem

Core feed item structure:

```typescript
interface IRssItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  imageUrl?: string;
  author?: string;          // Source/publication name
  categories?: string[];
  feedType?: 'rss' | 'atom' | 'json';
}
```

### Feed Types

```typescript
// Supported formats
type FeedFormatType = 'rss1' | 'rss2' | 'atom' | 'json';

// Parsed feed with metadata
interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  language?: string;
  format: FeedFormatType;
  items: RssFeedItem[];
  validation?: FeedValidation;
}

// Detailed item structure
interface RssFeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  pubDateParsed?: Date;
  author?: string;
  categories?: string[];
  imageUrl?: string;
  guid?: string;
  enclosures?: FeedEnclosure[];
  source?: FeedSource;
  feedType?: FeedItemType;
}
```

### Error Types

```typescript
enum RssErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  CORS_ERROR = 'CORS_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Parse errors
  PARSE_ERROR = 'PARSE_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Validation errors
  INVALID_URL = 'INVALID_URL',
  EMPTY_FEED = 'EMPTY_FEED',

  // ... more codes
}

interface RssError {
  code: RssErrorCode;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  isRetryable: boolean;
  isRecoverable: boolean;
}
```

---

## Extension Points

### Creating Custom Layouts

1. Create a new component following the layout interface:

```typescript
// components/layouts/MyLayout/MyLayout.tsx
import React from 'react';
import { IRssItem } from '../../IRssItem';
import styles from './MyLayout.module.scss';

interface IMyLayoutProps {
  items: IRssItem[];
  isLoading: boolean;
  showDate?: boolean;
  showDescription?: boolean;
}

const MyLayout: React.FC<IMyLayoutProps> = ({
  items,
  isLoading,
  showDate = true,
  showDescription = true,
}) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.myLayout}>
      {items.map((item, index) => (
        <article key={index} className={styles.item}>
          <h3>{item.title}</h3>
          {showDate && <time>{item.pubDate}</time>}
          {showDescription && <p>{item.description}</p>}
        </article>
      ))}
    </div>
  );
};

export default React.memo(MyLayout);
```

2. Add lazy loading in `RssFeed.tsx`:

```typescript
const MyLayout = React.lazy(() =>
  import(/* webpackChunkName: "layout-mylayout" */ './layouts/MyLayout/MyLayout')
);
```

3. Add to layout switch and property pane.

### Custom Property Pane Controls

Create controls using `IPropertyPaneField`:

```typescript
// propertyPane/PropertyPaneMyControl.ts
import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';

export function PropertyPaneMyControl(
  targetProperty: string,
  properties: IMyControlProps
): IPropertyPaneField<IPropertyPaneCustomFieldProps> {
  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty,
    properties: {
      key: targetProperty,
      onRender: (elem, ctx, changeCallback) => {
        // Render your control using ReactDOM.render()
      },
    },
  };
}
```

### Adding Feed Format Support

Extend `ImprovedFeedParser` or create a new parser:

```typescript
// services/myFeedParser.ts
import { IRssItem } from '../components/IRssItem';

export function parseMyFormat(content: string): IRssItem[] {
  // Parse your custom format
  return items;
}

// Then integrate in ImprovedFeedParser.parseWithRecovery()
if (isMyFormat(content)) {
  return parseMyFormat(content);
}
```

---

## Testing

### Test Stack

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires gulp serve)
npm run test:e2e
```

### Test Structure

```
tests/
├── components/           # Component tests
│   ├── RssFeed.test.tsx
│   └── layouts/
├── services/             # Service tests
│   ├── ImprovedFeedParser.test.ts
│   └── ProxyService.test.ts
├── mocks/                # Test mocks
│   ├── spfxMocks.ts
│   └── swiperMocks.ts
├── fixtures/             # Test data
│   └── feeds/
└── e2e/                  # Playwright tests
    ├── rssFeed.local.spec.ts
    └── gallery-page.spo.spec.ts
```

### Writing Tests

```typescript
// tests/components/MyComponent.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from '../../src/.../MyComponent';

describe('MyComponent', () => {
  it('renders items correctly', () => {
    const items = [{ title: 'Test', link: 'http://example.com' }];
    render(<MyComponent items={items} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
gulp serve

# Run in debug mode
# Add ?rssDebug to workbench URL
```

### Production Build

```bash
# Bundle for production
gulp bundle --ship

# Create .sppkg package
gulp package-solution --ship

# Package location
# sharepoint/solution/pol-rss-gallery.sppkg
```

### Bundle Analysis

```bash
# Check bundle size
gulp bundle --ship
ls -la dist/*.js

# Analyze chunks
# Main bundle should be < 300KB gzipped
# Layout chunks: 5-15KB each
```

### Code Quality

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Security audit
npm run security:audit
```

---

## Performance Considerations

### Lazy Loading

All layout components are lazy-loaded using `React.lazy()`:

```typescript
const BannerCarousel = React.lazy(() =>
  import('./layouts/BannerCarousel/BannerCarousel')
);
```

### Memoization

Components use `React.memo()` to prevent unnecessary re-renders:

```typescript
export default React.memo(MyComponent);
```

### Image Optimization

- `loading="lazy"` on all images
- Responsive images with `srcset` where possible
- Fallback image for missing images

### Cache Strategy

- Memory cache for instant access
- IndexedDB for persistence across sessions
- SWR pattern for background refresh

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass: `npm test`
5. Follow existing code patterns and TypeScript strict mode
6. Submit a pull request

### Code Standards

- TypeScript strict mode enabled
- ESLint rules enforced
- 70% test coverage threshold
- No console.log in production code (use `RssDebugUtils`)
