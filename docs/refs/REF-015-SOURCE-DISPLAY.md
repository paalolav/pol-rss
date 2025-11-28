# REF-015: Source Display

**Status:** ✅ Completed
**Completed:** 2025-11-28

## Overview

Add "Source" as a display option showing the feed/publication name for each item. This is particularly useful for aggregated news feeds from services like Retriever and Meltwater, where the `<author>` tag contains the publication name (e.g., "Finansavisen", "Kapital", "E24").

## Problem Statement

Retriever and similar news aggregation feeds include source information in RSS items:
- `<author>Finansavisen.no</author>` - Publication name in standard author tag
- `<ret:source>Finansavisen.no</ret:source>` - Retriever's custom namespace

Currently, this information is parsed but not displayed to users. Users need to see which publication each article comes from.

## Solution

Display source/publication name on the same line as the date, using our existing meta styling:

```
25. nov 2025 • Finansavisen
```

This follows the existing UI pattern where author is shown with a bullet separator.

## Implementation Details

### Sub-tasks

#### ST-015-01: Update FeedItem Component
**Files:** `src/webparts/polRssGallery/components/shared/FeedItem/FeedItem.tsx`

- Rename `showAuthor` prop to `showSource`
- Update JSX to use `.source` class
- Keep backward compatibility (author field contains source for Retriever feeds)

#### ST-015-02: Update FeedItem Styles
**Files:** `src/webparts/polRssGallery/components/shared/FeedItem/FeedItem.module.scss`

- Rename `.author` class to `.source`
- Keep existing bullet separator styling

#### ST-015-03: Update Parser for ret:source
**Files:** `src/webparts/polRssGallery/services/ImprovedFeedParser.ts`

- Extract `<ret:source>` from Retriever namespace as fallback
- Priority: `<author>` → `<ret:source>` → `<source>` → `<dc:creator>`
- Store in `author` field (maintains compatibility)

#### ST-015-04: Add showSource to Web Part Props
**Files:**
- `src/webparts/polRssGallery/RssFeedWebPart.ts`
- `src/webparts/polRssGallery/components/IRssFeedProps.ts` (if exists)

- Add `showSource: boolean` property
- Default to `false` for backward compatibility

#### ST-015-05: Add Property Pane Toggle
**Files:** `src/webparts/polRssGallery/RssFeedWebPart.ts`

- Add "Vis kilde" toggle in Display Settings group
- Position after "Vis dato" toggle

#### ST-015-06: Add Localization Strings
**Files:**
- `src/webparts/polRssGallery/loc/en-us.js`
- `src/webparts/polRssGallery/loc/nb-no.js`
- `src/webparts/polRssGallery/loc/nn-no.js`
- `src/webparts/polRssGallery/loc/RssFeedWebPartStrings.d.ts`

Strings needed:
- `ShowSourceFieldLabel`: "Vis kilde" / "Show source"
- `ShowSourceFieldDescription`: "Vis kilden/publikasjonen ved siden av datoen" / "Show source/publication next to date"

#### ST-015-07: Update Layout Components
**Files:**
- `src/webparts/polRssGallery/components/layouts/CardLayout/CardLayout.tsx`
- `src/webparts/polRssGallery/components/layouts/ListLayout/ListLayout.tsx`
- `src/webparts/polRssGallery/components/layouts/BannerCarousel/BannerCarousel.tsx`
- `src/webparts/polRssGallery/components/layouts/MinimalLayout/MinimalLayout.tsx`
- `src/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryLayout.tsx`

- Add `showSource` prop to layout interfaces
- Pass `showSource` to FeedItem components

#### ST-015-08: Update RssFeed Component
**Files:** `src/webparts/polRssGallery/components/RssFeed.tsx`

- Pass `showSource` prop to layout components

#### ST-015-09: Write Tests
**Files:**
- `tests/components/shared/FeedItem.test.tsx`
- `tests/services/ImprovedFeedParser.test.ts`

- Test source display with showSource=true/false
- Test ret:source namespace extraction
- Test fallback priority chain

## Data Flow

```
RSS Feed XML
    │
    ▼
ImprovedFeedParser
    │ Extracts: <author> || <ret:source> || <source> || <dc:creator>
    ▼
IRssItem.author
    │
    ▼
RssFeed (showSource prop)
    │
    ▼
Layout Component (CardLayout, ListLayout, etc.)
    │
    ▼
FeedItem (showSource prop)
    │
    ▼
.meta > .source (styled with bullet separator)
```

## UI Design

### Display Format
```
┌─────────────────────────────────────┐
│ [Image]                             │
│                                     │
│ Article Title Here                  │
│ 25. nov 2025 • Finansavisen        │  ← Source displayed here
│                                     │
│ Article description text...         │
└─────────────────────────────────────┘
```

### Styling
- Same font size as date (--font-size-sm)
- Same color as date (--neutralSecondary)
- Bullet separator (•) before source
- Flexbox layout with gap

## Testing Checklist

- [ ] Source displays when showSource=true and item.author exists
- [ ] Source hidden when showSource=false
- [ ] Source hidden when item.author is empty
- [ ] Bullet separator appears between date and source
- [ ] Works in all layouts (Card, List, Banner, Minimal, Gallery)
- [ ] ret:source namespace extracted correctly
- [ ] Property pane toggle works
- [ ] Localization strings display correctly

## References

- Puzzlepart RSS Feed: https://github.com/Puzzlepart/spfx-solutions/tree/master/Pzl.Part.RssFeed
- Retriever RSS format documentation
- Existing FeedItem component patterns

## Completion Criteria

1. Source/publication name displays next to date when enabled
2. Property pane toggle controls visibility
3. Parser extracts source from multiple XML locations
4. All layouts support the feature
5. Tests pass
6. Localization complete for nb-no, nn-no, en-us
