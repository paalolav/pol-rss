# REF-016: Strong Background Theme Support

## Status: Completed

## Problem
When the RSS web part is placed on a SharePoint section with a "Strong" (dark blue) background:
1. The web part title displays correctly in white
2. But the content inside Card, List, Minimal, and Gallery layouts still shows dark text on dark background (unreadable)
3. Card layout has white background cards - should be transparent on dark backgrounds

## Requirements
- Card layout: Cards should have transparent/semi-transparent background on dark section backgrounds
- List layout: Text should be white on dark backgrounds
- Minimal layout: Text should be white on dark backgrounds
- Gallery layout: Title-below text should be white on dark backgrounds
- Banner layout: NO CHANGES (already handles its own caption styling)

## Technical Implementation

### Detection
SharePoint provides `themeVariant.isInverted` boolean when section has strong background.
- `RssFeed.tsx` already detects this and passes `isInverted` prop to layouts

### Components Fixed

#### FeedItem.tsx / FeedItem.module.scss
- Already had `isInverted` prop and `.inverted` CSS class
- **Fixed**: Added `.inverted.card` with transparent background and white border
- **Fixed**: Added `.inverted.list` with white border color
- Text colors (title, meta, date, source, description, category) already handled

#### GalleryItem.tsx / GalleryLayout.module.scss
- Already had `isInverted` prop
- Already had `.inverted.title-below` styling for white text
- No additional changes needed

## Test Coverage

### Unit Tests (All passing)
- `tests/components/FeedItem.test.tsx` - 38 tests
  - isInverted class application tests (3 new tests)
- `tests/components/layouts/GalleryLayout.test.tsx` - 48 tests
  - isInverted propagation tests (3 new tests)

## Files Modified
- `src/webparts/polRssGallery/components/shared/FeedItem/FeedItem.module.scss`
- `tests/components/FeedItem.test.tsx` (added styles mock, added isInverted tests)
- `tests/components/layouts/GalleryLayout.test.tsx` (added inverted to styles mock, added isInverted tests)

## Changelog
- Session 29: Created task, added isInverted tests, fixed FeedItem CSS (transparent background for card, white border colors)
