# REF-013: Bundle Optimization

## Overview
Optimize the webpart bundle size for faster loading, especially on mobile devices and slower connections. Focus on reducing dependencies, implementing code splitting, and tree-shaking unused code.

## Priority
Medium-High (Impacts user experience and SharePoint performance)

## Dependencies
- REF-007 (Layout Components) - Carousel implementation choice

## Current State Analysis

### Bundle Size Concerns
1. **Swiper.js** (~150KB minified) - Heavy carousel library
2. **html-react-parser** (~15KB) - Could be replaced with DOMPurify
3. **Fluent UI** - Ensure tree-shaking works properly
4. **Unused dependencies** - comlink (not used)

### Target Metrics
- Initial bundle: < 200KB gzipped
- Carousel chunk: Lazy loaded only when carousel layout selected
- Time to Interactive: < 3s on 3G connection

## Sub-Tasks

### ST-013-01: Dependency Audit and Cleanup
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** N/A (Build verification)

**Description:**
Remove unused dependencies and audit remaining ones for bundle impact.

**Tasks:**
```bash
# Remove unused dependencies
npm uninstall comlink

# Analyze bundle
npx webpack-bundle-analyzer dist/stats.json

# Check for duplicates
npx duplicate-package-checker-webpack-plugin
```

**package.json changes:**
```json
{
  "scripts": {
    "analyze": "gulp bundle --ship && webpack-bundle-analyzer ./temp/stats/[name].stats.json",
    "bundle:size": "gulp bundle --ship && du -sh dist/*.js"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.10.0"
  }
}
```

**Acceptance Criteria:**
- [ ] Unused dependencies removed
- [ ] Bundle analysis documented
- [ ] No duplicate packages in bundle

---

### ST-013-02: Swiper.js Optimization
**Status:** [ ] Not Started
**Complexity:** High
**Tests:** `tests/components/carousel.test.tsx`

**Description:**
Optimize or replace Swiper.js to reduce bundle size.

**Options:**

**Option A: Swiper Tree-Shaking (Recommended)**
```typescript
// Only import what we need
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// Import minimal CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// DON'T import the full bundle
// import 'swiper/swiper-bundle.css'; // BAD - includes everything
```

**Option B: Native CSS Scroll Snap (Lightest)**
```typescript
// src/webparts/polRssGallery/components/NativeCarousel.tsx
import * as React from 'react';
import styles from './NativeCarousel.module.scss';

interface INativeCarouselProps {
  items: IRssItem[];
  renderItem: (item: IRssItem) => React.ReactNode;
}

export const NativeCarousel: React.FC<INativeCarouselProps> = ({ items, renderItem }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.carouselWrapper}>
      <button
        className={styles.navButton}
        onClick={() => scroll('left')}
        aria-label="Previous"
      >
        &lt;
      </button>

      <div ref={containerRef} className={styles.carouselContainer}>
        {items.map((item, index) => (
          <div key={item.id || index} className={styles.carouselItem}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      <button
        className={styles.navButton}
        onClick={() => scroll('right')}
        aria-label="Next"
      >
        &gt;
      </button>
    </div>
  );
};
```

```scss
// NativeCarousel.module.scss
.carouselWrapper {
  position: relative;
  width: 100%;
}

.carouselContainer {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;  // Firefox

  &::-webkit-scrollbar {
    display: none;  // Chrome, Safari
  }
}

.carouselItem {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 300px;  // Or percentage
  margin-right: 16px;
}

.navButton {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  // ... button styles
}
```

**Option C: Embla Carousel (~20KB)**
Lighter alternative with similar features:
```bash
npm install embla-carousel embla-carousel-react
```

**Recommendation:** Start with Option A (tree-shaking). If still too heavy, implement Option B for simple cases and lazy-load Swiper only for advanced carousel features.

**Acceptance Criteria:**
- [ ] Swiper imports optimized
- [ ] Carousel chunk < 50KB gzipped
- [ ] Touch/swipe still works on mobile
- [ ] Accessibility maintained

---

### ST-013-03: Code Splitting and Lazy Loading
**Status:** [ ] Not Started
**Complexity:** Medium
**Tests:** `tests/components/lazyLoading.test.tsx`

**Description:**
Implement code splitting for non-critical features.

**Implementation:**
```typescript
// src/webparts/polRssGallery/components/RssFeed.tsx
import * as React from 'react';

// Lazy load layout components
const CardLayout = React.lazy(() => import('./layouts/CardLayout'));
const ListLayout = React.lazy(() => import('./layouts/ListLayout'));
const CarouselLayout = React.lazy(() => import('./layouts/CarouselLayout'));
const TickerLayout = React.lazy(() => import('./layouts/TickerLayout'));

interface IRssFeedProps {
  layout: 'card' | 'list' | 'carousel' | 'ticker';
  // ...other props
}

export const RssFeed: React.FC<IRssFeedProps> = ({ layout, ...props }) => {
  const LayoutComponent = React.useMemo(() => {
    switch (layout) {
      case 'card': return CardLayout;
      case 'list': return ListLayout;
      case 'carousel': return CarouselLayout;
      case 'ticker': return TickerLayout;
      default: return CardLayout;
    }
  }, [layout]);

  return (
    <React.Suspense fallback={<LayoutSkeleton layout={layout} />}>
      <LayoutComponent {...props} />
    </React.Suspense>
  );
};
```

**SPFx Webpack Configuration:**
```javascript
// gulpfile.js - Add chunk splitting
build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          swiper: {
            test: /[\\/]node_modules[\\/]swiper[\\/]/,
            name: 'swiper',
            chunks: 'async',
          },
          fluentui: {
            test: /[\\/]node_modules[\\/]@fluentui[\\/]/,
            name: 'fluentui',
            chunks: 'all',
          },
        },
      },
    };
    return config;
  },
});
```

**Acceptance Criteria:**
- [ ] Layout components lazy loaded
- [ ] Separate chunk for carousel
- [ ] Proper loading states
- [ ] No flash of unstyled content

---

### ST-013-04: Fluent UI Tree-Shaking
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** N/A (Build verification)

**Description:**
Ensure Fluent UI components are properly tree-shaken.

**Best Practices:**
```typescript
// GOOD - Named imports
import { PrimaryButton, TextField, Dropdown } from '@fluentui/react';

// BAD - Full import
import * as FluentUI from '@fluentui/react';

// BETTER - Deep imports (if tree-shaking issues)
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
```

**Verification:**
```bash
# Check if Fluent UI is properly split
grep -r "fluentui" dist/*.js | wc -l
```

**Acceptance Criteria:**
- [ ] Only used Fluent UI components in bundle
- [ ] No full @fluentui/react import
- [ ] Bundle size reduced by tree-shaking

---

### ST-013-05: Image Optimization
**Status:** [ ] Not Started
**Complexity:** Medium
**Tests:** `tests/components/imageOptimization.test.tsx`

**Description:**
Implement image optimization for feed images.

**Implementation:**
```typescript
// src/webparts/polRssGallery/components/OptimizedImage.tsx
import * as React from 'react';
import styles from './OptimizedImage.module.scss';

interface IOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<IOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  // Placeholder for failed images
  if (error) {
    return (
      <div className={styles.placeholder} style={{ width, height }}>
        <span className={styles.placeholderIcon}>No Image</span>
      </div>
    );
  }

  return (
    <div className={styles.imageWrapper}>
      {!loaded && <div className={styles.skeleton} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={loaded ? styles.loaded : styles.loading}
      />
    </div>
  );
};
```

**Features:**
- Native lazy loading
- Async decoding
- Error fallback
- Loading skeleton
- Proper aspect ratio

**Acceptance Criteria:**
- [ ] Images lazy loaded by default
- [ ] Graceful error handling
- [ ] No layout shift (CLS)
- [ ] Accessibility maintained

---

### ST-013-06: Runtime Performance Optimization
**Status:** [ ] Not Started
**Complexity:** Medium
**Tests:** `tests/performance/rendering.test.tsx`

**Description:**
Optimize React rendering performance.

**Implementation:**
```typescript
// Memoize expensive computations
const sortedItems = React.useMemo(() => {
  return items.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}, [items]);

// Memoize components that receive object props
const MemoizedFeedItem = React.memo(FeedItem, (prev, next) => {
  return prev.item.id === next.item.id &&
         prev.layout === next.layout;
});

// Use callback for event handlers
const handleItemClick = React.useCallback((item: IRssItem) => {
  window.open(item.link, '_blank', 'noopener,noreferrer');
}, []);

// Virtual list for many items
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedList: React.FC<{ items: IRssItem[] }> = ({ items }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <FeedItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] No unnecessary re-renders
- [ ] Large lists virtualized
- [ ] Smooth scrolling (60fps)
- [ ] Memory usage stable

---

### ST-013-07: Production Build Optimization
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** N/A (Build verification)

**Description:**
Ensure production builds are fully optimized.

**gulpfile.js additions:**
```javascript
const build = require('@microsoft/sp-build-web');

// Production optimizations
build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    if (build.getConfig().production) {
      // Minimize CSS
      config.optimization.minimizer.push(
        new CssMinimizerPlugin()
      );

      // Production source maps (smaller)
      config.devtool = 'hidden-source-map';

      // Define production
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      );
    }
    return config;
  },
});
```

**Build verification script:**
```bash
#!/bin/bash
# scripts/verify-build.sh

echo "Building for production..."
gulp bundle --ship

echo "Checking bundle sizes..."
for file in dist/*.js; do
  size=$(du -h "$file" | cut -f1)
  gzip_size=$(gzip -c "$file" | wc -c | awk '{print $1/1024 " KB"}')
  echo "$file: $size (gzipped: $gzip_size)"
done

echo "Checking for common issues..."
# Check for console.log
grep -r "console.log" dist/*.js && echo "WARNING: console.log found in production build"

# Check for debugger statements
grep -r "debugger" dist/*.js && echo "ERROR: debugger statement found!"

echo "Done!"
```

**Acceptance Criteria:**
- [ ] Production build < 200KB gzipped
- [ ] No console.log in production
- [ ] Source maps separate from bundle
- [ ] CSS minimized

---

## Bundle Size Budget

| Component | Max Size (gzipped) | Current |
|-----------|-------------------|---------|
| Main bundle | 150KB | TBD |
| Swiper chunk | 50KB | TBD |
| Fluent UI chunk | 80KB | TBD |
| Total | 200KB | TBD |

## Testing Strategy

### Bundle Analysis
```bash
# Generate stats file
gulp bundle --ship --stats

# Analyze with webpack-bundle-analyzer
npx webpack-bundle-analyzer ./temp/stats/*.stats.json
```

### Performance Testing
```typescript
// tests/performance/bundleSize.test.ts
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

describe('Bundle Size', () => {
  const distPath = path.join(__dirname, '../../dist');

  it('main bundle should be under 150KB gzipped', () => {
    const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
    const mainBundle = files.find(f => f.includes('pol-rss-gallery'));

    if (mainBundle) {
      const content = fs.readFileSync(path.join(distPath, mainBundle));
      const gzipped = zlib.gzipSync(content);
      const sizeKB = gzipped.length / 1024;

      expect(sizeKB).toBeLessThan(150);
    }
  });
});
```

## Notes
- Bundle optimization is iterative - measure before and after each change
- SPFx has specific webpack configurations that may limit some optimizations
- Consider user's network conditions in SharePoint (often corporate networks)
- Monitor bundle size in CI/CD pipeline
