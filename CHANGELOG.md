# Changelog

All notable changes to the POL RSS Gallery web part are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-11-28

### Added

#### New Features
- **Gallery Layout** - Masonry-style image grid layout showcasing images as primary content
  - Configurable columns (auto, 2, 3, 4)
  - Title position options (hover overlay, below, hidden)
  - Aspect ratio presets (1:1, 4:3, 16:9)
  - Gap size options (small, medium, large)
- **Source Display** - Show feed/publication name next to date
  - Essential for aggregated feeds (Retriever, Meltwater)
  - Supports `<author>`, `<ret:source>`, `<source>`, and `<dc:creator>` tags
- **Minimal Layout** - Text-only compact layout for sidebars
- **Preset Templates** - One-click configurations (News Banner, Blog Grid, Compact List, Photo Gallery)

#### Infrastructure
- **Testing Infrastructure** - Jest + React Testing Library (1685+ tests)
- **E2E Testing** - Playwright tests for SharePoint Online
- **Azure CORS Proxy** - TypeScript Azure Function with:
  - Domain allowlist with wildcard support
  - Rate limiting
  - Health endpoint for monitoring
  - SSRF protection
  - One-click Bicep/ARM deployment

#### Performance
- **Code Splitting** - React.lazy() for all layout components
- **Two-tier Caching** - Memory L1 + IndexedDB L2 with SWR pattern
- **Bundle Optimization** - 32% size reduction (364K → 246K gzipped)

#### Security
- **XSS Prevention** - DOMPurify content sanitization
- **SSRF Protection** - URL validation blocks private networks
- **CSP Compliance** - Works within SharePoint's Content Security Policy

### Changed

#### User Interface
- **Reorganized Property Pane** - Grouped settings with conditional visibility
- **Feed URL Validation** - Real-time validation with feed testing
- **Layout Picker** - Visual SVG previews for layout selection
- **Responsive Design** - Mobile-first with container queries
- **Touch Support** - Touch-friendly interactions and gestures

#### Feed Parsing
- **Enhanced Parser** - Supports RSS 1.0/2.0, Atom 1.0, JSON Feed 1.0/1.1
- **Recovery Mode** - Auto-fixes malformed feeds with 10+ recovery strategies
- **Better Date Parsing** - Handles non-standard formats and timezones
- **Image Extraction** - Priority-based extraction from multiple sources
- **Entity Decoding** - Handles HTML entities and double-encoded content

#### Accessibility
- **WCAG 2.1 AA** - Full keyboard navigation and screen reader support
- **High Contrast Mode** - Respects system preferences
- **Reduced Motion** - Honors `prefers-reduced-motion`

### Fixed

- Norwegian character encoding (ISO-8859-1 feeds)
- Banner pagination centering in narrow columns
- Property pane groups not expanding
- Force fallback image not working in layouts
- Banner image zoom/aspect ratio issues

### Removed

- Category filtering (broken UX, deferred for future redesign)
- Keyword filtering (deferred for future redesign)
- Pause indicator on banner (non-functional)

### Migration Notes

If upgrading from v1.2.x:
- No breaking changes to web part properties
- Existing configurations will continue to work
- New features can be enabled via property pane

---

## [1.2.0] - 2024-06-01

### Added

- TypeScript strict mode enforcement
- Improved code documentation

### Changed

- Codebase cleanup and removal of dead code
- Enhanced type safety across all components
- Automated build artifact cleaning

### Fixed

- Various TypeScript type errors
- Memory leak in debug console

---

## [1.1.0] - 2021-03-10

### Changed

- Upgraded to SPFx 1.21
- Updated Microsoft 365 dependencies

---

## [1.0.0] - 2021-01-29

### Added

- Initial release
- Banner carousel layout with Swiper
- Card grid layout
- List layout
- RSS 2.0 and Atom feed support
- Category-based filtering
- Keyword filtering
- Auto-refresh capability
- Debug mode for troubleshooting
- Norwegian localization (nb-NO, nn-NO)

---

## Future Plans

The following features are planned for future releases:

- **Feed Aggregation** (REF-009) - Multiple feeds in single view
- **Enhanced Filtering** (REF-010) - Full-text search, date ranges, shareable URL state

See [docs/tasklist.md](docs/tasklist.md) for detailed roadmap.
