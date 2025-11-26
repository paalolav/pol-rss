# REF-007-LAYOUT-COMPONENTS

> **Status:** Not Started
> **Priority:** Medium
> **Phase:** 3 - UI/UX Improvements
> **Estimated Complexity:** High

## Overview

Refactor the layout components (Banner, Card, List) with shared base components, skeleton loading states, image lazy loading, and consistent animations. Create a cohesive visual system across all layout options.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE
- REF-006-RESPONSIVE-DESIGN

## Dependencies

- REF-006-RESPONSIVE-DESIGN

## Current Component Analysis

| Component | Lines | Issues |
|-----------|-------|--------|
| BannerCarousel.tsx | ~200 | Swiper dependency, limited customization |
| CardLayout.tsx | ~150 | Basic memoization, no skeleton |
| ListLayout.tsx | ~120 | Simple implementation, no lazy loading |

## Sub-Tasks

### ST-007-01: Create Shared FeedItem Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/FeedItem.test.tsx`

**Description:**
Create base FeedItem component used by all layouts.

**Steps:**
1. Extract common item rendering logic
2. Create flexible prop interface
3. Support different display modes
4. Implement hover/focus states

**FeedItem Component:**
```typescript
interface FeedItemProps {
  item: IRssItem;
  variant: 'card' | 'list' | 'banner';
  showImage?: boolean;
  showDescription?: boolean;
  showDate?: boolean;
  showCategories?: boolean;
  imageAspectRatio?: '16:9' | '4:3' | '1:1';
  onItemClick?: (item: IRssItem) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  item,
  variant,
  showImage = true,
  showDescription = true,
  showDate = true,
  showCategories = false,
  imageAspectRatio = '16:9',
  onItemClick
}) => {
  // Shared rendering logic
  return (
    <article className={classNames(styles.feedItem, styles[variant])}>
      {showImage && <FeedItemImage ... />}
      <FeedItemContent ... />
    </article>
  );
};
```

**Acceptance Criteria:**
- [ ] Works with all layout variants
- [ ] Props control visibility
- [ ] Accessible markup
- [ ] Consistent styling

---

### ST-007-02: Implement Skeleton Loading
**Status:** `[ ]` Not Started
**Test File:** `tests/components/Skeleton.test.tsx`

**Description:**
Create skeleton loading components for each layout.

**Steps:**
1. Create base Skeleton component
2. Create CardSkeleton
3. Create ListSkeleton
4. Create BannerSkeleton
5. Add shimmer animation

**Skeleton Components:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'wave'
}) => (
  <div
    className={classNames(styles.skeleton, styles[variant], styles[animation])}
    style={{ width, height }}
    aria-hidden="true"
  />
);

// Layout-specific skeletons
const CardSkeleton: React.FC = () => (
  <div className={styles.cardSkeleton}>
    <Skeleton variant="rectangular" height={180} />
    <div className={styles.content}>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
  </div>
);
```

**Acceptance Criteria:**
- [ ] Skeletons match actual content shape
- [ ] Smooth shimmer animation
- [ ] Accessible (hidden from screen readers)
- [ ] No layout shift on load

---

### ST-007-03: Refactor BannerCarousel
**Status:** `[ ]` Not Started
**Test File:** `tests/components/BannerCarousel.test.tsx`

**Description:**
Refactor BannerCarousel with improved customization and accessibility.

**Steps:**
1. Review Swiper configuration
2. Add custom navigation
3. Improve accessibility
4. Add pause on hover/focus
5. Support keyboard navigation
6. Add touch swipe indicators

**Enhanced Banner Features:**
```typescript
interface BannerCarouselProps {
  items: IRssItem[];
  autoplay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  pauseOnHover?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'auto';
}

// Accessibility features
const BannerCarousel: React.FC<BannerCarouselProps> = (props) => {
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="News carousel"
    >
      <Swiper
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          paginationBulletMessage: 'Go to slide {{index}}'
        }}
        keyboard={{ enabled: true }}
        {...swiperConfig}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} role="group" aria-roledescription="slide">
            <FeedItem item={item} variant="banner" />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        Slide {currentSlide} of {totalSlides}
      </div>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Keyboard navigable
- [ ] Pause on focus
- [ ] Screen reader announces slides
- [ ] Swipe gestures work on mobile
- [ ] No autoplay accessibility issues

---

### ST-007-04: Refactor CardLayout
**Status:** `[ ]` Not Started
**Test File:** `tests/components/CardLayout.test.tsx`

**Description:**
Refactor CardLayout with responsive grid and enhanced cards.

**Steps:**
1. Use ResponsiveGrid component
2. Implement card hover effects
3. Add image lazy loading
4. Support different card sizes
5. Add masonry option (optional)

**Enhanced Card Features:**
```typescript
interface CardLayoutProps {
  items: IRssItem[];
  columns?: 2 | 3 | 4 | 'auto';
  cardSize?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  truncateDescription?: number;
  gap?: 'sm' | 'md' | 'lg';
}

const CardLayout: React.FC<CardLayoutProps> = ({
  items,
  columns = 'auto',
  cardSize = 'md',
  showDescription = true,
  truncateDescription = 100,
  gap = 'md'
}) => (
  <ResponsiveGrid columns={columns} gap={gap}>
    {items.map(item => (
      <FeedItemCard
        key={item.id}
        item={item}
        size={cardSize}
        showDescription={showDescription}
        descriptionLimit={truncateDescription}
      />
    ))}
  </ResponsiveGrid>
);
```

**Acceptance Criteria:**
- [ ] Grid adapts to container
- [ ] Cards have hover effects
- [ ] Images lazy load
- [ ] Description truncation works
- [ ] Performance with many cards

---

### ST-007-05: Refactor ListLayout
**Status:** `[ ]` Not Started
**Test File:** `tests/components/ListLayout.test.tsx`

**Description:**
Refactor ListLayout with enhanced list items and dividers.

**Steps:**
1. Create FeedItemList component
2. Add thumbnail options
3. Implement divider styles
4. Add compact mode
5. Support virtualization for long lists

**Enhanced List Features:**
```typescript
interface ListLayoutProps {
  items: IRssItem[];
  thumbnailPosition?: 'left' | 'right' | 'none';
  thumbnailSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  showDividers?: boolean;
  virtualize?: boolean;  // For long lists
}

const ListLayout: React.FC<ListLayoutProps> = ({
  items,
  thumbnailPosition = 'left',
  thumbnailSize = 'md',
  compact = false,
  showDividers = true,
  virtualize = false
}) => {
  const ListComponent = virtualize ? VirtualizedList : StandardList;

  return (
    <ListComponent className={styles.list}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <FeedItemList
            item={item}
            thumbnailPosition={thumbnailPosition}
            thumbnailSize={thumbnailSize}
            compact={compact}
          />
          {showDividers && index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </ListComponent>
  );
};
```

**Acceptance Criteria:**
- [ ] Thumbnail positioning works
- [ ] Compact mode reduces spacing
- [ ] Dividers styled correctly
- [ ] Virtualization for 50+ items

---

### ST-007-06: Implement Lazy Loading
**Status:** `[ ]` Not Started
**Test File:** `tests/components/LazyImage.test.tsx`

**Description:**
Implement proper lazy loading for all images.

**Steps:**
1. Create LazyImage component
2. Use IntersectionObserver
3. Show placeholder/blur during load
4. Handle load errors
5. Support native lazy loading fallback

**Lazy Image Component:**
```typescript
interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
  blurDataUrl?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  threshold?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'skeleton',
  blurDataUrl,
  fallbackSrc,
  aspectRatio = '16/9',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div className={styles.imageWrapper} style={{ aspectRatio }}>
      {placeholder === 'skeleton' && !isLoaded && <Skeleton />}
      {placeholder === 'blur' && !isLoaded && blurDataUrl && (
        <img src={blurDataUrl} className={styles.blur} alt="" />
      )}
      <img
        ref={imgRef}
        src={isInView ? (error ? fallbackSrc : src) : undefined}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={classNames(styles.image, { [styles.loaded]: isLoaded })}
      />
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Images load only when visible
- [ ] Placeholder shown during load
- [ ] Smooth fade-in on load
- [ ] Fallback on error

---

### ST-007-07: Add Animation System
**Status:** `[ ]` Not Started
**Test File:** `tests/styles/animations.test.ts`

**Description:**
Create consistent animation system for all components.

**Steps:**
1. Define animation tokens
2. Create CSS keyframes
3. Add animation utilities
4. Support reduced motion preference
5. Document animation usage

**Animation System:**
```scss
// Animation tokens
:root {
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
}

// Keyframes
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Utility classes
.animate-fadeIn {
  animation: fadeIn var(--transition-normal) var(--easing-decelerate);
}

.animate-slideUp {
  animation: slideUp var(--transition-normal) var(--easing-decelerate);
}
```

**Acceptance Criteria:**
- [ ] Consistent animation tokens
- [ ] Reduced motion respected
- [ ] Smooth transitions
- [ ] No janky animations

---

### ST-007-08: Create Empty State Component
**Status:** `[ ]` Not Started
**Test File:** `tests/components/EmptyState.test.tsx`

**Description:**
Create empty state component for when no items are available.

**Steps:**
1. Design empty state visuals
2. Create EmptyState component
3. Support different messages
4. Add action buttons

**Empty State Component:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => (
  <div className={styles.emptyState}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {action && (
      <PrimaryButton onClick={action.onClick}>
        {action.label}
      </PrimaryButton>
    )}
  </div>
);

// Usage
<EmptyState
  icon={<Icon iconName="Feed" />}
  title="No items to display"
  description="The feed is empty or all items have been filtered out."
  action={{ label: 'Clear filters', onClick: clearFilters }}
/>
```

**Acceptance Criteria:**
- [ ] Clear visual design
- [ ] Supports customization
- [ ] Action button works
- [ ] Accessible

---

### ST-007-09: Write Comprehensive Tests
**Status:** `[ ]` Not Started
**Test File:** `tests/components/*.test.tsx`

**Description:**
Write comprehensive tests for all layout components.

**Steps:**
1. Unit tests for each component
2. Integration tests for layouts
3. Snapshot tests for visual regression
4. Accessibility tests

**Test Coverage:**
```typescript
describe('CardLayout', () => {
  it('renders correct number of cards');
  it('applies responsive grid classes');
  it('handles empty items array');
  it('truncates descriptions correctly');
  it('lazy loads images');
  it('is accessible');
});

describe('BannerCarousel', () => {
  it('renders all slides');
  it('advances automatically when autoplay enabled');
  it('pauses on hover');
  it('supports keyboard navigation');
  it('announces slide changes to screen readers');
});

describe('ListLayout', () => {
  it('renders items in order');
  it('positions thumbnails correctly');
  it('shows dividers between items');
  it('supports compact mode');
});
```

**Acceptance Criteria:**
- [ ] 90%+ test coverage
- [ ] All features tested
- [ ] Accessibility tested
- [ ] Snapshot tests for layouts

---

## Component Hierarchy

```
src/webparts/polRssGallery/components/
├── layouts/
│   ├── BannerCarousel/
│   │   ├── BannerCarousel.tsx
│   │   ├── BannerCarousel.module.scss
│   │   └── BannerSkeleton.tsx
│   ├── CardLayout/
│   │   ├── CardLayout.tsx
│   │   ├── CardLayout.module.scss
│   │   └── CardSkeleton.tsx
│   └── ListLayout/
│       ├── ListLayout.tsx
│       ├── ListLayout.module.scss
│       └── ListSkeleton.tsx
├── shared/
│   ├── FeedItem/
│   │   ├── FeedItem.tsx
│   │   ├── FeedItemCard.tsx
│   │   ├── FeedItemList.tsx
│   │   └── FeedItem.module.scss
│   ├── LazyImage/
│   │   ├── LazyImage.tsx
│   │   └── LazyImage.module.scss
│   ├── Skeleton/
│   │   ├── Skeleton.tsx
│   │   └── Skeleton.module.scss
│   └── EmptyState/
│       ├── EmptyState.tsx
│       └── EmptyState.module.scss
└── index.ts  # Re-exports
```

## Related Tasks

- **REF-006-RESPONSIVE-DESIGN:** Provides responsive foundation
- **REF-008-PROPERTY-PANE:** Layout selection in settings
- **REF-009-FEED-AGGREGATION:** Layouts must support source indicators
