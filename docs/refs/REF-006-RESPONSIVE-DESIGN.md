# REF-006-RESPONSIVE-DESIGN

> **Status:** Not Started
> **Priority:** Medium
> **Phase:** 3 - UI/UX Improvements
> **Estimated Complexity:** Medium

## Overview

Implement mobile-first responsive design with WCAG 2.1 AA accessibility compliance. The webpart must work flawlessly across all screen sizes, from mobile phones to large desktop monitors, within SharePoint's various page layouts.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE
- Core reliability tasks (REF-003, REF-004, REF-005)

## Dependencies

- REF-001-TESTING-INFRASTRUCTURE

## SharePoint Layout Context

The webpart operates within SharePoint's responsive grid:
- **Full-width section**: 100% container width
- **1-column section**: ~768px max
- **2-column section**: ~384px per column
- **3-column section**: ~256px per column

## Sub-Tasks

### ST-006-01: Define Responsive Breakpoints
**Status:** `[ ]` Not Started
**Test File:** `tests/utils/breakpoints.test.ts`

**Description:**
Define consistent breakpoint system aligned with SharePoint and common device sizes.

**Steps:**
1. Define breakpoint constants
2. Create breakpoint utilities
3. Create SCSS mixins
4. Document usage patterns

**Breakpoint System:**
```typescript
export const breakpoints = {
  xs: 320,   // Small phones
  sm: 480,   // Phones
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Desktops
  xxl: 1440  // Large desktops
} as const;

// SCSS Mixins
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

// Usage
.card {
  width: 100%;
  @include respond-to(md) {
    width: 50%;
  }
  @include respond-to(lg) {
    width: 33.333%;
  }
}
```

**Acceptance Criteria:**
- [ ] Breakpoints consistent across codebase
- [ ] SCSS mixins available
- [ ] TypeScript utilities available
- [ ] Aligned with SharePoint grid

---

### ST-006-02: Implement Container Query Support
**Status:** `[ ]` Not Started
**Test File:** `tests/hooks/useContainerSize.test.ts`

**Description:**
Use container queries to respond to webpart container size, not just viewport.

**Steps:**
1. Create useContainerSize hook
2. Implement ResizeObserver-based sizing
3. Add container-based responsive classes
4. Fallback for older browsers

**Container Size Hook:**
```typescript
interface ContainerSize {
  width: number;
  height: number;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const useContainerSize = (containerRef: RefObject<HTMLElement>): ContainerSize => {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0, breakpoint: 'md' });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({
        width,
        height,
        breakpoint: getBreakpoint(width)
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [containerRef]);

  return size;
};
```

**Acceptance Criteria:**
- [ ] Hook returns current container size
- [ ] Breakpoint calculated correctly
- [ ] Updates on resize
- [ ] No memory leaks

---

### ST-006-03: Create Responsive Grid System
**Status:** `[ ]` Not Started
**Test File:** `tests/components/ResponsiveGrid.test.tsx`

**Description:**
Create responsive grid component for card layouts.

**Steps:**
1. Create ResponsiveGrid component
2. Support auto-fit with minmax
3. Handle gap spacing responsively
4. Support explicit column counts

**Grid Component:**
```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  minItemWidth?: number;    // Default: 280px
  maxColumns?: number;      // Default: 4
  gap?: 'sm' | 'md' | 'lg'; // Default: 'md'
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minItemWidth = 280,
  maxColumns = 4,
  gap = 'md'
}) => (
  <div
    className={styles.grid}
    style={{
      '--min-item-width': `${minItemWidth}px`,
      '--max-columns': maxColumns
    } as React.CSSProperties}
  >
    {children}
  </div>
);

// SCSS
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(var(--min-item-width), 100%), 1fr)
  );
  gap: var(--gap-md);
}
```

**Acceptance Criteria:**
- [ ] Grid adapts to container width
- [ ] Minimum item width respected
- [ ] Maximum columns enforced
- [ ] Gap scales appropriately

---

### ST-006-04: Implement Touch-Friendly Interactions
**Status:** `[x]` Completed
**Test File:** `tests/hooks/useTouchInteraction.test.ts`

**Description:**
Ensure all interactions work well on touch devices.

**Steps:**
1. Increase touch target sizes (44px minimum)
2. Add touch feedback (active states)
3. Implement swipe gestures for carousel
4. Handle touch vs mouse consistently

**Touch Guidelines:**
```scss
// Minimum touch target
.touchTarget {
  min-height: 44px;
  min-width: 44px;
  padding: 8px;
}

// Touch feedback
.interactive {
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
}

// Prevent double-tap zoom
.card {
  touch-action: manipulation;
}
```

**Acceptance Criteria:**
- [x] Touch targets >= 44px
- [x] Active states visible
- [x] Swipe gestures smooth
- [x] No accidental zooming

---

### ST-006-05: Implement WCAG 2.1 AA Accessibility
**Status:** `[ ]` Not Started
**Test File:** `tests/accessibility/wcag.test.tsx`

**Description:**
Ensure full WCAG 2.1 AA compliance.

**Steps:**
1. Add proper ARIA labels
2. Ensure color contrast (4.5:1 minimum)
3. Support keyboard navigation
4. Add focus indicators
5. Support screen readers
6. Add skip links

**Accessibility Checklist:**
```typescript
// ARIA labels
<article aria-label={`Article: ${item.title}`}>

// Live regions for dynamic content
<div role="status" aria-live="polite">
  {isLoading && 'Loading feed...'}
</div>

// Focus management
const focusFirst = () => {
  containerRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
};

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight': focusNext(); break;
    case 'ArrowLeft': focusPrev(); break;
    case 'Home': focusFirst(); break;
    case 'End': focusLast(); break;
  }
};
```

**Acceptance Criteria:**
- [ ] All images have alt text
- [ ] Color contrast >= 4.5:1
- [ ] Full keyboard navigation
- [ ] Screen reader friendly
- [ ] Focus visible at all times

---

### ST-006-06: Create Typography Scale
**Status:** `[ ]` Not Started
**Test File:** `tests/styles/typography.test.ts`

**Description:**
Implement responsive typography that scales appropriately.

**Steps:**
1. Define type scale
2. Use CSS clamp for fluid sizing
3. Ensure readability at all sizes
4. Respect user font size preferences

**Typography Scale:**
```scss
:root {
  // Fluid type scale using clamp
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-md: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.375rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --font-size-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);

  // Line heights
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

.title {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
}

.description {
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}
```

**Acceptance Criteria:**
- [ ] Text readable at all sizes
- [ ] Scales smoothly between breakpoints
- [ ] Respects browser font size
- [ ] Consistent hierarchy

---

### ST-006-07: Optimize Images for Responsive
**Status:** `[ ]` Not Started
**Test File:** `tests/components/ResponsiveImage.test.tsx`

**Description:**
Implement responsive images with proper sizing and loading.

**Steps:**
1. Create ResponsiveImage component
2. Implement lazy loading
3. Add aspect ratio preservation
4. Handle loading states
5. Implement error fallbacks

**Responsive Image Component:**
```typescript
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = '16:9',
  loading = 'lazy',
  fallbackSrc
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.imageContainer} data-aspect={aspectRatio}>
      {isLoading && <div className={styles.skeleton} />}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoading(false)}
        onError={() => fallbackSrc && setImgSrc(fallbackSrc)}
      />
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Images lazy load
- [ ] Aspect ratio preserved
- [ ] Skeleton during load
- [ ] Fallback on error

---

### ST-006-08: Test Across Devices and Browsers
**Status:** `[~]` In Progress
**Test File:** N/A (manual testing)

**Description:**
Comprehensive testing across devices and browsers.

**Steps:**
1. Test on iOS Safari
2. Test on Android Chrome
3. Test on Edge (SharePoint default)
4. Test on various screen sizes
5. Test with SharePoint section layouts
6. Document any browser-specific issues

**Bugs Found and Fixed (Session 14):**
- **Layout buttons not working**: Fixed by adding `this.render()` in RssFeedWebPart.ts
- **Preset buttons not working**: Fixed by adding `this.render()` after preset selection
- **Norwegian character encoding (æ, ø, å)**: Fixed by creating `encodingUtils.ts` with proper ISO-8859-1 support

**New Feature Added (Session 14):**
- **Hide Images option**: Toggle in Images settings to hide all images across layouts

**Test Matrix:**

| Device | Browser | Screen Size | Status |
|--------|---------|-------------|--------|
| Desktop | Chrome | 1440px | [x] Tested - bugs fixed |
| iPhone SE | Safari | 375px | [ ] |
| iPhone 14 | Safari | 390px | [ ] |
| iPad | Safari | 768px | [ ] |
| Android Phone | Chrome | 360px | [ ] |
| Android Tablet | Chrome | 800px | [ ] |
| Desktop | Edge | 1920px | [ ] |

**Remaining Tests:**
- Test Norwegian encoding with Retriever feed (clear cache + reload)
- Test Hide Images toggle in all three layouts
- Browser compatibility testing (Firefox, Safari, Edge)
- Mobile/tablet responsive testing
- Touch interaction testing on touch devices

**Acceptance Criteria:**
- [x] Layout buttons work correctly
- [x] Preset buttons work correctly
- [ ] Norwegian characters display correctly
- [ ] Hide Images feature works in all layouts
- [ ] All layouts work on all devices
- [ ] No horizontal scrolling
- [ ] Touch interactions work
- [ ] Performance acceptable on mobile

---

### ST-006-09: SharePoint Theme Integration
**Status:** `[ ]` Not Started
**Test File:** `tests/styles/themeIntegration.test.ts`

**Description:**
Integrate with SharePoint's theme system to automatically adapt colors and styles to the site's theme.

**Steps:**
1. Use SharePoint theme CSS variables
2. Support both classic and modern themes
3. Handle custom themes
4. Test with multiple color schemes

**Theme Variables:**
```scss
// SharePoint theme variables (available in SPFx)
.rssFeedContainer {
  // Primary colors
  color: var(--bodyText);
  background-color: var(--bodyBackground);

  // Links
  a {
    color: var(--themePrimary);
    &:hover {
      color: var(--themeDarker);
    }
  }

  // Borders
  border-color: var(--neutralLight);

  // Semantic colors
  .error {
    color: var(--errorText);
    background-color: var(--errorBackground);
  }
}

// Theme-aware card
.card {
  background-color: var(--neutralLighter);
  border: 1px solid var(--neutralLight);

  &:hover {
    box-shadow: 0 2px 8px var(--neutralTertiaryAlt);
  }

  .title {
    color: var(--neutralPrimary);
  }

  .metadata {
    color: var(--neutralSecondary);
  }
}
```

**TypeScript Theme Access:**
```typescript
import { ThemeProvider, useTheme } from '@fluentui/react';

const RssFeed: React.FC = () => {
  const theme = useTheme();

  // Access theme programmatically if needed
  const primaryColor = theme.palette.themePrimary;

  return (
    <div style={{ color: theme.palette.bodyText }}>
      {/* Content */}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Colors adapt to SharePoint theme
- [ ] Works with dark themes
- [ ] Works with custom brand colors
- [ ] No hardcoded colors in SCSS

---

### ST-006-10: High Contrast Mode Support
**Status:** `[ ]` Not Started
**Test File:** `tests/accessibility/highContrast.test.tsx`

**Description:**
Support Windows High Contrast mode for users with visual impairments.

**Steps:**
1. Detect high contrast mode
2. Override styles for high contrast
3. Ensure borders/outlines visible
4. Test with all Windows HC themes

**High Contrast Implementation:**
```scss
// High contrast media query
@media (forced-colors: active) {
  .card {
    // Use system colors
    border: 2px solid CanvasText;
    background-color: Canvas;
    color: CanvasText;

    &:focus {
      outline: 3px solid Highlight;
    }
  }

  .button {
    border: 2px solid ButtonText;
    background-color: ButtonFace;
    color: ButtonText;

    &:hover {
      background-color: Highlight;
      color: HighlightText;
    }
  }

  // Ensure links are distinguishable
  a {
    color: LinkText;
    text-decoration: underline;
  }

  // Images need visible borders
  img {
    border: 1px solid CanvasText;
  }
}

// Legacy IE/Edge high contrast
@media (-ms-high-contrast: active) {
  .card {
    border: 2px solid currentColor;
  }
}
```

**Detection in TypeScript:**
```typescript
const useHighContrast = (): boolean => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    setIsHighContrast(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return isHighContrast;
};
```

**Acceptance Criteria:**
- [ ] Readable in all Windows HC themes
- [ ] Focus indicators visible
- [ ] Borders/outlines maintained
- [ ] No loss of functionality

---

### ST-006-11: Print Stylesheet
**Status:** `[ ]` Not Started
**Test File:** N/A (manual testing)

**Description:**
Add print-optimized styles for users who print feed content.

**Steps:**
1. Create print media query styles
2. Hide interactive elements
3. Optimize typography for print
4. Ensure images print correctly

**Print Styles:**
```scss
@media print {
  // Hide non-essential elements
  .rssFeedContainer {
    // Remove backgrounds
    background: white !important;
    color: black !important;

    // Hide interactive elements
    .carouselNav,
    .filterPanel,
    .loadMoreButton,
    .refreshButton {
      display: none !important;
    }

    // Force card layout for printing
    .itemGrid {
      display: block !important;
    }

    // Each card on its own line
    .card {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      box-shadow: none !important;

      // Ensure images print
      img {
        max-width: 100%;
        height: auto;
      }
    }

    // Show URLs for links
    a[href]::after {
      content: " (" attr(href) ")";
      font-size: 0.8em;
      color: #666;
    }

    // Don't print internal links
    a[href^="#"]::after,
    a[href^="javascript"]::after {
      content: "";
    }

    // Typography for print
    .title {
      font-size: 14pt;
    }

    .description {
      font-size: 11pt;
      line-height: 1.4;
    }

    .metadata {
      font-size: 9pt;
      color: #666;
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Content prints cleanly
- [ ] No background colors wasting ink
- [ ] Images sized appropriately
- [ ] URLs shown after links
- [ ] Page breaks respected

---

## Responsive Layout Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                    Layout Responsive Behavior                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BANNER LAYOUT                                                   │
│  ├─ Mobile (< 480px):  Full width, reduced height               │
│  ├─ Tablet (< 768px):  Full width, standard height              │
│  └─ Desktop (≥ 768px): Full width, larger height                │
│                                                                  │
│  CARD LAYOUT                                                     │
│  ├─ Mobile (< 480px):  1 column, stacked                        │
│  ├─ Tablet (< 768px):  2 columns                                │
│  ├─ Desktop (< 1024px): 3 columns                               │
│  └─ Large (≥ 1024px):  4 columns (configurable)                 │
│                                                                  │
│  LIST LAYOUT                                                     │
│  ├─ Mobile (< 480px):  Full width, compact thumbnails           │
│  ├─ Tablet (< 768px):  Full width, standard thumbnails          │
│  └─ Desktop (≥ 768px): Full width, larger thumbnails            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Files to Create/Modify

```
src/webparts/polRssGallery/
├── styles/
│   ├── _breakpoints.scss    # New: breakpoint mixins
│   ├── _typography.scss     # New: type scale
│   ├── _spacing.scss        # New: spacing scale
│   └── _accessibility.scss  # New: a11y utilities
├── components/
│   ├── ResponsiveGrid.tsx   # New: grid component
│   ├── ResponsiveImage.tsx  # New: image component
│   └── *.tsx                # Modify: add responsive styles
├── hooks/
│   ├── useContainerSize.ts  # New: container sizing
│   └── useBreakpoint.ts     # New: breakpoint detection
└── utils/
    └── breakpoints.ts       # New: breakpoint constants
```

## Related Tasks

- **REF-007-LAYOUT-COMPONENTS:** Uses responsive foundation
- **REF-008-PROPERTY-PANE:** Responsive property pane
