# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pol-rss-gallery is a SharePoint Framework (SPFx) 1.21 web part that displays RSS feeds in various layouts (banner carousel, card, list). It supports authenticated feeds (Meltwater), non-standard RSS formats, and includes CORS proxy fallbacks.

## Build Commands

```bash
npm install          # Install dependencies (requires Node.js >=22.14.0 <23)
gulp serve           # Start local development server with workbench
gulp bundle          # Build the project
gulp clean           # Clean build artifacts
```

## Test Commands

```bash
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

Tests are located in `tests/` directory with mocks for SPFx modules. Coverage threshold is 70%.

## Lint

```bash
npm run lint         # ESLint for src/**/*.ts,tsx
```

## Architecture

### Core Components

- **RssFeedWebPart.ts** (`src/webparts/polRssGallery/`) - SPFx web part entry point. Initializes theme provider and ProxyService, renders RssFeed component with configurable properties.

- **RssFeed.tsx** - Main React component orchestrating feed loading, caching, filtering, and layout selection. Manages state for items, errors, loading, and category filtering.

### Layout Components

Three interchangeable layouts in `components/`:
- `BannerCarousel.tsx` - Swiper-based carousel with autoscroll
- `CardLayout.tsx` - Grid of cards
- `ListLayout.tsx` - Vertical list

### Services (`services/`)

- **ImprovedFeedParser.ts** - XML parser supporting RSS 2.0 and Atom feeds. Handles malformed XML with preprocessing (namespace injection, CDATA fixes, control character removal). Key methods: `parse()`, `parseRss()`, `parseAtom()`.

- **ProxyService.ts** - CORS handling with multiple fallback strategies: direct fetch -> CORS proxies (allorigins.win, corsproxy.io) -> SP HttpClient. Handles redirects with loop detection.

- **CacheService.ts** - In-memory caching for feed data with configurable TTL.

- **RssSpecialFeedsHandler.ts** - Special handling for authenticated feeds (Meltwater) with custom headers and preprocessing hints.

### Utilities (`utils/`)

- **rssDebugUtils.ts** - Debug logging activated via URL param `?rssDebug` or `?debugRss`
- **rssUtils.ts** - Helper functions for description cleaning, image URL resolution, image extraction from various XML structures

### Localization (`loc/`)

String resources in `nb-no.js` (Norwegian Bokmål) and `nn-no.js` (Norwegian Nynorsk). Type definitions in `RssFeedWebPartStrings.d.ts`.

## Key Patterns

### Feed Loading Flow
1. RssFeed checks cache via CacheService
2. If miss: detect special feeds -> try direct fetch -> fallback to proxies -> parse with ImprovedFeedParser
3. Apply keyword and category filters
4. Render selected layout

### Debug Mode
Add `?rssDebug` to URL to enable verbose logging and on-page debug console for troubleshooting feed issues.

### Property Pane
Web part properties configured in `getPropertyPaneConfiguration()` including feed URL, layout selection, filtering options, and display settings.
