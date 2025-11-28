# REF-014-GALLERY-LAYOUT

> **Status:** Not Started
> **Priority:** High
> **Phase:** 3 - UI/UX Improvements
> **Estimated Complexity:** Medium

## Overview

Create a new "Gallery" layout that showcases images as the primary content. This masonry-style grid makes images the hero, differentiating pol-rss-gallery from text-heavy RSS solutions in SharePoint. Images are displayed prominently with titles on hover or below - clicking goes straight to the article (no extra steps).

## Prerequisites

- REF-006-RESPONSIVE-DESIGN (responsive grid system)
- REF-007-LAYOUT-COMPONENTS (shared FeedItem, layout patterns)

## Why This Feature

**Market Differentiator:** Most SharePoint RSS solutions display text-only lists. pol-rss-gallery already has sophisticated image extraction - this layout showcases that capability.

**Use Cases:**
- News dashboards with visual appeal
- Photo-heavy feeds (news agencies, internal comms)
- Marketing/brand pages
- Intranet homepages

## Design Goals

1. **Images as hero** - Large, prominent images
2. **Minimal text** - Title on hover or below, no descriptions
3. **No extra clicks** - Direct link to article
4. **Responsive** - Works in all SharePoint column widths
5. **Performance** - Lazy loading, optimized images

## Visual Design

```
Full Width (3-4 columns):
┌─────────────┬───────────────────┬─────────────┐
│             │                   │             │
│   IMAGE 1   │     IMAGE 2       │   IMAGE 3   │
│             │    (featured)     │             │
│   Title 1   │                   │   Title 3   │
├─────────────┤     Title 2       ├──────┬──────┤
│             │                   │      │      │
│   IMAGE 4   ├─────────┬─────────┤ IMG6 │ IMG7 │
│             │         │         │      │      │
│   Title 4   │  IMG 5  │  IMG 8  │  T6  │  T7  │
└─────────────┴─────────┴─────────┴──────┴──────┘

1/3 Column (1-2 columns):
┌───────────┐
│  IMAGE 1  │
│  Title 1  │
├───────────┤
│  IMAGE 2  │
│  Title 2  │
├───────────┤
│  IMAGE 3  │
│  Title 3  │
└───────────┘
```

## Sub-Tasks

### ST-014-01: Create GalleryLayout Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/layouts/GalleryLayout.test.tsx`

**Description:**
Create the main GalleryLayout component with masonry-style image grid.

**Implementation:**
```typescript
// components/layouts/GalleryLayout/GalleryLayout.tsx

interface GalleryLayoutProps {
  items: IRssItem[];
  columns?: 'auto' | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  showTitles?: 'hover' | 'below' | 'none';
  aspectRatio?: '1:1' | '4:3' | '16:9' | 'auto';
  onItemClick?: (item: IRssItem) => void;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({
  items,
  columns = 'auto',
  gap = 'md',
  showTitles = 'below',
  aspectRatio = '4:3',
  onItemClick
}) => {
  // Filter items without images
  const itemsWithImages = items.filter(item => item.imageUrl);

  return (
    <div
      className={styles.gallery}
      style={{
        '--gallery-columns': columns === 'auto' ? 'auto-fill' : columns,
        '--gallery-gap': `var(--spacing-${gap})`,
      } as React.CSSProperties}
    >
      {itemsWithImages.map((item, index) => (
        <GalleryItem
          key={item.id || index}
          item={item}
          showTitle={showTitles}
          aspectRatio={aspectRatio}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Masonry/grid layout renders correctly
- [ ] Responsive column count based on container width
- [ ] Items without images are filtered out or show fallback
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

---

### ST-014-02: Create GalleryItem Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/layouts/GalleryItem.test.tsx`

**Description:**
Create individual gallery item with image, hover effects, and title display options.

**Implementation:**
```typescript
// components/layouts/GalleryLayout/GalleryItem.tsx

interface GalleryItemProps {
  item: IRssItem;
  showTitle: 'hover' | 'below' | 'none';
  aspectRatio: '1:1' | '4:3' | '16:9' | 'auto';
  onClick?: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  item,
  showTitle,
  aspectRatio,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className={classNames(styles.galleryItem, styles[`title-${showTitle}`])}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={item.title}
    >
      <div
        className={styles.imageWrapper}
        style={{ '--aspect-ratio': getAspectRatio(aspectRatio) } as React.CSSProperties}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className={styles.image}
        />

        {showTitle === 'hover' && (
          <div className={styles.hoverOverlay}>
            <h3 className={styles.title}>{item.title}</h3>
            {item.pubDate && (
              <time className={styles.date}>
                {formatDate(item.pubDate)}
              </time>
            )}
          </div>
        )}
      </div>

      {showTitle === 'below' && (
        <div className={styles.titleBelow}>
          <h3 className={styles.title}>{item.title}</h3>
        </div>
      )}
    </article>
  );
};
```

**Acceptance Criteria:**
- [ ] Image displays with correct aspect ratio
- [ ] Hover overlay animates smoothly
- [ ] Title below option works
- [ ] Click opens article in new tab
- [ ] Focus states visible
- [ ] Touch-friendly (44px targets)

---

### ST-014-03: Create Gallery Styles with Masonry
**Status:** `[ ]` Not Started
**Test File:** N/A (CSS)

**Description:**
Create responsive masonry-style CSS grid that adapts to container width.

**Implementation:**
```scss
// components/layouts/GalleryLayout/GalleryLayout.module.scss

.gallery {
  display: grid;
  grid-template-columns: repeat(var(--gallery-columns, auto-fill), minmax(200px, 1fr));
  gap: var(--gallery-gap, 16px);

  // Container query for responsive columns
  container-type: inline-size;
}

// Responsive adjustments based on container width
@container (max-width: 400px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}

@container (min-width: 401px) and (max-width: 600px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 601px) and (max-width: 900px) {
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container (min-width: 901px) {
  .gallery {
    grid-template-columns: repeat(4, 1fr);
  }
}

.galleryItem {
  position: relative;
  cursor: pointer;
  border-radius: var(--border-radius-md, 8px);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:focus-visible {
    outline: 2px solid var(--themePrimary);
    outline-offset: 2px;
  }
}

.imageWrapper {
  position: relative;
  aspect-ratio: var(--aspect-ratio, 4/3);
  overflow: hidden;
  background: var(--neutralLighter, #f3f2f1);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  .galleryItem:hover & {
    transform: scale(1.05);
  }
}

// Hover overlay for title
.hoverOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .galleryItem:hover &,
  .galleryItem:focus-visible & {
    opacity: 1;
  }

  .title {
    color: white;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .date {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    margin-top: 4px;
  }
}

// Title below image
.titleBelow {
  padding: 12px 0;

  .title {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: var(--neutralPrimary);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .galleryItem,
  .image,
  .hoverOverlay {
    transition: none;
  }

  .galleryItem:hover .image {
    transform: none;
  }
}

// High contrast mode
@media (forced-colors: active) {
  .hoverOverlay {
    background: Canvas;
    opacity: 1;
    border: 1px solid CanvasText;
  }

  .hoverOverlay .title {
    color: CanvasText;
  }
}
```

**Acceptance Criteria:**
- [ ] Grid adapts to container width
- [ ] Hover effects are smooth
- [ ] Works in 1/3, 1/2, 2/3, and full-width columns
- [ ] Reduced motion supported
- [ ] High contrast mode supported
- [ ] Print styles hide hover overlays

---

### ST-014-04: Add Gallery Layout to RssFeed
**Status:** `[ ]` Not Started
**Test File:** `tests/components/RssFeed.test.tsx` (update existing)

**Description:**
Integrate GalleryLayout into RssFeed component with lazy loading.

**Implementation:**
```typescript
// In RssFeed.tsx

// Add lazy import
const GalleryLayout = React.lazy(() =>
  import(/* webpackChunkName: "layout-gallery" */ './layouts/GalleryLayout/GalleryLayout')
);

// Add to layout switch
case 'gallery':
  return (
    <React.Suspense fallback={<SkeletonGrid count={maxItems} variant="card" />}>
      <GalleryLayout
        items={displayItems}
        columns={galleryColumns}
        showTitles={galleryTitlePosition}
        aspectRatio={galleryAspectRatio}
      />
    </React.Suspense>
  );
```

**Acceptance Criteria:**
- [ ] Gallery layout option works
- [ ] Lazy loaded (separate chunk)
- [ ] Loading skeleton shows during load
- [ ] Props passed correctly from webpart

---

### ST-014-05: Add Gallery to PropertyPaneLayoutPicker
**Status:** `[ ]` Not Started
**Test File:** `tests/propertyPane/PropertyPaneLayoutPicker.test.ts` (update existing)

**Description:**
Add Gallery option to the visual layout picker in property pane.

**Implementation:**
```typescript
// In PropertyPaneLayoutPicker.ts

// Add gallery layout option with SVG preview
const layouts = [
  { key: 'banner', label: strings.LayoutBanner, icon: bannerSvg },
  { key: 'card', label: strings.LayoutCard, icon: cardSvg },
  { key: 'list', label: strings.LayoutList, icon: listSvg },
  { key: 'minimal', label: strings.LayoutMinimal, icon: minimalSvg },
  { key: 'gallery', label: strings.LayoutGallery, icon: gallerySvg },  // New
];

// Gallery SVG icon
const gallerySvg = `
<svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
  <rect x="23" y="2" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
  <rect x="44" y="2" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
  <rect x="2" y="23" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
  <rect x="23" y="23" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
  <rect x="44" y="23" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
</svg>
`;
```

**Acceptance Criteria:**
- [ ] Gallery option visible in layout picker
- [ ] SVG icon represents grid layout
- [ ] Selection works and triggers re-render
- [ ] Keyboard accessible

---

### ST-014-06: Add Gallery-Specific Property Pane Settings
**Status:** `[ ]` Not Started
**Test File:** `tests/propertyPane/gallerySettings.test.ts`

**Description:**
Add gallery-specific settings to property pane (shown conditionally when gallery layout selected).

**Properties:**
```typescript
// Add to IRssFeedWebPartProps
interface IRssFeedWebPartProps {
  // ... existing props

  // Gallery-specific
  galleryColumns?: 'auto' | 2 | 3 | 4;
  galleryTitlePosition?: 'hover' | 'below' | 'none';
  galleryAspectRatio?: '1:1' | '4:3' | '16:9';
  galleryGap?: 'sm' | 'md' | 'lg';
}
```

**Property Pane Group:**
```typescript
// Gallery Settings group (shown when layout === 'gallery')
PropertyPaneDropdown('galleryColumns', {
  label: strings.GalleryColumnsLabel,
  options: [
    { key: 'auto', text: strings.GalleryColumnsAuto },
    { key: 2, text: '2' },
    { key: 3, text: '3' },
    { key: 4, text: '4' },
  ],
  selectedKey: this.properties.galleryColumns || 'auto'
}),
PropertyPaneChoiceGroup('galleryTitlePosition', {
  label: strings.GalleryTitlePositionLabel,
  options: [
    { key: 'hover', text: strings.GalleryTitleHover },
    { key: 'below', text: strings.GalleryTitleBelow },
    { key: 'none', text: strings.GalleryTitleNone },
  ]
}),
PropertyPaneDropdown('galleryAspectRatio', {
  label: strings.GalleryAspectRatioLabel,
  options: [
    { key: '1:1', text: strings.AspectRatio1x1 },
    { key: '4:3', text: strings.AspectRatio4x3 },
    { key: '16:9', text: strings.AspectRatio16x9 },
  ]
})
```

**Acceptance Criteria:**
- [ ] Gallery settings group shows only when gallery layout selected
- [ ] Column options work correctly
- [ ] Title position options work
- [ ] Aspect ratio options work
- [ ] Settings persist

---

### ST-014-07: Add Localization Strings
**Status:** `[ ]` Not Started
**Test File:** N/A

**Description:**
Add Norwegian (nb-no, nn-no) and English (en-us) strings for gallery layout.

**Strings to add:**
```typescript
// English (en-us.js)
LayoutGallery: "Gallery",
GallerySettingsGroup: "Gallery Settings",
GalleryColumnsLabel: "Columns",
GalleryColumnsAuto: "Auto (responsive)",
GalleryTitlePositionLabel: "Title display",
GalleryTitleHover: "Show on hover",
GalleryTitleBelow: "Show below image",
GalleryTitleNone: "Hide titles",
GalleryAspectRatioLabel: "Image aspect ratio",
AspectRatio1x1: "Square (1:1)",
AspectRatio4x3: "Standard (4:3)",
AspectRatio16x9: "Widescreen (16:9)",
GalleryNoImages: "No items with images to display",

// Norwegian Bokmål (nb-no.js)
LayoutGallery: "Galleri",
GallerySettingsGroup: "Galleriinnstillinger",
GalleryColumnsLabel: "Kolonner",
GalleryColumnsAuto: "Automatisk (responsiv)",
GalleryTitlePositionLabel: "Tittelvisning",
GalleryTitleHover: "Vis ved pekerfokus",
GalleryTitleBelow: "Vis under bilde",
GalleryTitleNone: "Skjul titler",
GalleryAspectRatioLabel: "Bildeforhold",
AspectRatio1x1: "Kvadratisk (1:1)",
AspectRatio4x3: "Standard (4:3)",
AspectRatio16x9: "Bredformat (16:9)",
GalleryNoImages: "Ingen elementer med bilder å vise",

// Norwegian Nynorsk (nn-no.js)
LayoutGallery: "Galleri",
GallerySettingsGroup: "Galleriinnstillingar",
GalleryColumnsLabel: "Kolonnar",
GalleryColumnsAuto: "Automatisk (responsiv)",
GalleryTitlePositionLabel: "Tittelvisning",
GalleryTitleHover: "Vis ved peikerfokus",
GalleryTitleBelow: "Vis under bilde",
GalleryTitleNone: "Gøym titlar",
GalleryAspectRatioLabel: "Bileteforhold",
AspectRatio1x1: "Kvadratisk (1:1)",
AspectRatio4x3: "Standard (4:3)",
AspectRatio16x9: "Breidformat (16:9)",
GalleryNoImages: "Ingen element med bilde å vise",
```

**Acceptance Criteria:**
- [ ] All strings added to all 3 locale files
- [ ] Type definitions updated
- [ ] No missing translations

---

### ST-014-08: Add Gallery Skeleton Loading
**Status:** `[ ]` Not Started
**Test File:** `tests/components/shared/Skeleton.test.tsx` (update existing)

**Description:**
Add gallery-specific skeleton loading state.

**Implementation:**
```typescript
// In components/shared/Skeleton/GallerySkeleton.tsx

export const GallerySkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className={styles.gallerySkeleton}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.gallerySkeletonItem}>
        <Skeleton variant="rectangular" className={styles.image} />
        <Skeleton variant="text" width="80%" className={styles.title} />
      </div>
    ))}
  </div>
);
```

**Acceptance Criteria:**
- [ ] Skeleton matches gallery layout grid
- [ ] Shimmer animation works
- [ ] Responsive like actual gallery

---

### ST-014-09: Add Gallery to Presets
**Status:** `[ ]` Not Started
**Test File:** `tests/propertyPane/presets.test.ts` (update existing)

**Description:**
Add a "Photo Gallery" preset that configures optimal gallery settings.

**Implementation:**
```typescript
// In propertyPane/presets.ts

export const presets: Preset[] = [
  // ... existing presets
  {
    key: 'gallery',
    name: strings.PresetGallery,
    description: strings.PresetGalleryDescription,
    icon: 'PhotoCollection',
    settings: {
      layout: 'gallery',
      maxItems: 12,
      galleryColumns: 'auto',
      galleryTitlePosition: 'hover',
      galleryAspectRatio: '4:3',
      galleryGap: 'md',
      showDate: false,
      showDescription: false,
    }
  }
];
```

**Acceptance Criteria:**
- [ ] Photo Gallery preset visible
- [ ] Applies correct settings
- [ ] Auto-detected when settings match

---

### ST-014-10: Write Comprehensive Tests
**Status:** `[ ]` Not Started
**Test File:** `tests/components/layouts/GalleryLayout.test.tsx`

**Description:**
Write comprehensive test suite for GalleryLayout component.

**Test Cases:**
```typescript
describe('GalleryLayout', () => {
  // Rendering
  it('renders grid of images');
  it('filters out items without images');
  it('uses fallback image when configured');
  it('shows empty state when no images available');

  // Title display
  it('shows titles on hover when showTitles="hover"');
  it('shows titles below when showTitles="below"');
  it('hides titles when showTitles="none"');

  // Interaction
  it('opens link on click');
  it('opens link on Enter key');
  it('opens link on Space key');
  it('calls onItemClick callback when provided');

  // Responsive
  it('adjusts columns based on container width');
  it('respects fixed column count when specified');

  // Accessibility
  it('has correct ARIA attributes');
  it('is keyboard navigable');
  it('respects prefers-reduced-motion');

  // Aspect ratios
  it('applies 1:1 aspect ratio');
  it('applies 4:3 aspect ratio');
  it('applies 16:9 aspect ratio');
});
```

**Acceptance Criteria:**
- [ ] >90% code coverage for GalleryLayout
- [ ] All edge cases covered
- [ ] Accessibility tests included

---

## File Structure

```
src/webparts/polRssGallery/
├── components/
│   ├── layouts/
│   │   └── GalleryLayout/
│   │       ├── GalleryLayout.tsx
│   │       ├── GalleryLayout.module.scss
│   │       ├── GalleryLayout.module.scss.ts
│   │       ├── GalleryItem.tsx
│   │       └── index.ts
│   └── shared/
│       └── Skeleton/
│           └── GallerySkeleton.tsx  (add to existing)
├── loc/
│   ├── en-us.js          (update)
│   ├── nb-no.js          (update)
│   ├── nn-no.js          (update)
│   └── RssFeedWebPartStrings.d.ts (update)
├── propertyPane/
│   ├── PropertyPaneLayoutPicker.ts (update)
│   ├── presets.ts        (update)
│   └── conditionalFields.ts (update)
└── RssFeedWebPart.ts     (update)

tests/
├── components/
│   └── layouts/
│       └── GalleryLayout.test.tsx
└── propertyPane/
    └── gallerySettings.test.ts
```

## Related Tasks

- **REF-006-RESPONSIVE-DESIGN:** Container queries, responsive grid
- **REF-007-LAYOUT-COMPONENTS:** Shared patterns, FeedItem, Skeleton

## Success Metrics

- Gallery layout renders correctly in 1/3, 1/2, 2/3, and full-width columns
- Images load lazily (no performance regression)
- Hover effects work smoothly (60fps)
- All tests pass
- Works in Chrome, Edge, Firefox, Safari
- Accessible (keyboard, screen reader, high contrast)
