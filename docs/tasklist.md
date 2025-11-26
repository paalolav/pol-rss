# POL RSS Gallery WebPart - Task List

> Version: 1.3.0-dev
> Last Updated: 2025-11-26
> Status: In Progress

## Overview

This document tracks all tasks for the POL RSS Gallery SPFX webpart rework. Each task has a unique reference number (REF-xxx) with a detailed reference file in `docs/refs/`.

## Task Status Legend

| Status | Description |
|--------|-------------|
| `[ ]` | Not Started |
| `[~]` | In Progress |
| `[x]` | Completed |
| `[!]` | Blocked |

---

## Phase 1: Foundation (Reliability First)

### REF-001-TESTING-INFRASTRUCTURE
**Status:** `[~]` In Progress
**Priority:** Critical
**Reference:** [REF-001-TESTING-INFRASTRUCTURE.md](refs/REF-001-TESTING-INFRASTRUCTURE.md)

Set up Jest + React Testing Library testing infrastructure for SPFx webpart.

**Sub-tasks:** 9 | **Completed:** 8/9

---

### REF-002-AZURE-PROXY
**Status:** `[x]` Completed
**Priority:** Critical
**Reference:** [REF-002-AZURE-PROXY.md](refs/REF-002-AZURE-PROXY.md)

Refactor and enhance Azure Function CORS proxy with one-click tenant deployment.

**Sub-tasks:** 11 | **Completed:** 11/11

---

### REF-012-SECURITY-HARDENING
**Status:** `[x]` Completed
**Priority:** Critical
**Reference:** [REF-012-SECURITY-HARDENING.md](refs/REF-012-SECURITY-HARDENING.md)

Implement comprehensive security measures including XSS prevention (DOMPurify), SSRF protection, CSP compliance, and optional Azure AD authentication.

**Sub-tasks:** 7 | **Completed:** 6/7 (ST-012-04 Proxy Auth deferred - optional feature)

---

## Phase 2: Core Reliability

### REF-003-FEED-PARSER
**Status:** `[~]` In Progress
**Priority:** High
**Reference:** [REF-003-FEED-PARSER.md](refs/REF-003-FEED-PARSER.md)

Harden the ImprovedFeedParser for edge cases and malformed feeds. Supports RSS 1.0/2.0, Atom 1.0, and JSON Feed.

**Sub-tasks:** 10 | **Completed:** 8/10

---

### REF-004-ERROR-HANDLING
**Status:** `[ ]` Not Started
**Priority:** High
**Reference:** [REF-004-ERROR-HANDLING.md](refs/REF-004-ERROR-HANDLING.md)

Implement comprehensive error handling with user-friendly feedback.

**Sub-tasks:** 8 | **Completed:** 0/8

---

### REF-005-CACHING-PERFORMANCE
**Status:** `[ ]` Not Started
**Priority:** High
**Reference:** [REF-005-CACHING-PERFORMANCE.md](refs/REF-005-CACHING-PERFORMANCE.md)

Improve caching with IndexedDB persistence and smarter invalidation.

**Sub-tasks:** 7 | **Completed:** 0/7

---

## Phase 3: UI/UX Improvements

### REF-006-RESPONSIVE-DESIGN
**Status:** `[ ]` Not Started
**Priority:** Medium
**Reference:** [REF-006-RESPONSIVE-DESIGN.md](refs/REF-006-RESPONSIVE-DESIGN.md)

Mobile-first responsive layouts with WCAG 2.1 AA accessibility. Includes SharePoint theme integration, high contrast mode, and print styles.

**Sub-tasks:** 11 | **Completed:** 0/11

---

### REF-007-LAYOUT-COMPONENTS
**Status:** `[ ]` Not Started
**Priority:** Medium
**Reference:** [REF-007-LAYOUT-COMPONENTS.md](refs/REF-007-LAYOUT-COMPONENTS.md)

Refactor layout components with shared base, skeleton loading, and animations.

**Sub-tasks:** 9 | **Completed:** 0/9

---

### REF-008-PROPERTY-PANE
**Status:** `[ ]` Not Started
**Priority:** Medium
**Reference:** [REF-008-PROPERTY-PANE.md](refs/REF-008-PROPERTY-PANE.md)

Improve property pane UX with grouped settings and live preview.

**Sub-tasks:** 7 | **Completed:** 0/7

---

### REF-013-BUNDLE-OPTIMIZATION
**Status:** `[ ]` Not Started
**Priority:** Medium
**Reference:** [REF-013-BUNDLE-OPTIMIZATION.md](refs/REF-013-BUNDLE-OPTIMIZATION.md)

Optimize bundle size for faster loading. Includes Swiper optimization, code splitting, lazy loading, and tree-shaking.

**Sub-tasks:** 7 | **Completed:** 0/7

---

## Phase 4: New Features

### REF-009-FEED-AGGREGATION
**Status:** `[ ]` Not Started
**Priority:** Medium
**Reference:** [REF-009-FEED-AGGREGATION.md](refs/REF-009-FEED-AGGREGATION.md)

Support multiple RSS feeds merged into a single view. Includes duplicate detection and migration strategy.

**Sub-tasks:** 10 | **Completed:** 0/10

---

### REF-010-ENHANCED-FILTERING
**Status:** `[ ]` Not Started
**Priority:** Low
**Reference:** [REF-010-ENHANCED-FILTERING.md](refs/REF-010-ENHANCED-FILTERING.md)

Advanced filtering with date ranges, full-text search, presets, and shareable URL state.

**Sub-tasks:** 8 | **Completed:** 0/8

---

## Phase 5: Polish & Documentation

### REF-011-DOCUMENTATION
**Status:** `[ ]` Not Started
**Priority:** Low
**Reference:** [REF-011-DOCUMENTATION.md](refs/REF-011-DOCUMENTATION.md)

Comprehensive documentation for admins and users.

**Sub-tasks:** 6 | **Completed:** 0/6

---

## Summary

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| Phase 1: Foundation | 3 | 2 | ~85% |
| Phase 2: Core Reliability | 3 | 0.5 | ~17% |
| Phase 3: UI/UX | 4 | 0 | 0% |
| Phase 4: Features | 2 | 0 | 0% |
| Phase 5: Documentation | 1 | 0 | 0% |
| **Total** | **13** | **2.5** | **~27%** |

---

## Dependencies

```
REF-001 (Testing) ──┬──> REF-003 (Parser)
                    ├──> REF-004 (Errors)
                    └──> REF-005 (Cache)

REF-002 (Proxy) ────┬──> REF-004 (Errors)
                    └──> REF-012 (Security) [URL validation]

REF-003 (Parser) ───────> REF-012 (Security) [Content sanitization]

REF-003 + REF-004 ──────> REF-009 (Aggregation)

REF-006 (Responsive) ───> REF-007 (Layouts)

REF-007 (Layouts) ──┬──> REF-008 (Property Pane)
                    └──> REF-013 (Bundle Opt) [Carousel optimization]

All Tasks ──────────────> REF-011 (Documentation)
```

---

## Changelog

### 2025-11-26 (Session 5)
- REF-003: Feed Parser hardening in progress (8/10 sub-tasks completed)
  - ST-003-05: Implemented robust date parsing service
    - Created `dateParser.ts` with 77 new tests
    - Supports RFC 822 (RSS), RFC 3339/ISO 8601 (Atom), Unix timestamps
    - Handles non-standard formats (US/EU dates, long dates)
    - Timezone support including common abbreviations (EST, CET, PST, etc.)
    - Norwegian month name support
    - All parsed dates normalized to ISO format for consistency
    - Integrated into ImprovedFeedParser and jsonFeedParser
    - Added utility functions: formatDate, formatRelativeDate, compareDates
  - Total tests: 647 (up from 570)

### 2025-11-26 (Session 4)
- REF-003: Feed Parser hardening in progress (7/10 sub-tasks completed)
  - ST-003-04: Implemented enhanced image extraction with priority chain
    - Created `imageExtractor.ts` service with 84 unit tests
    - Created `imageExtractor.realFeeds.test.ts` with 20 real-world feed tests
    - Priority chain: media:thumbnail → media:content → enclosure → content:encoded → description → itunes:image → channel image → fallback
    - Added URL validation with relative URL resolution
    - Added size/quality preferences for image selection
    - Added duplicate detection for media:group elements
    - Integrated into ImprovedFeedParser for RSS and Atom parsing
    - Tested with Computas, Retriever, Meltwater-style, YouTube, and Podcast feed structures
  - Total tests: 570 (up from 466)

### 2025-11-26 (Session 3)
- REF-003: Feed Parser hardening in progress (6/10 sub-tasks completed)
  - ST-003-03: Implemented comprehensive XML entity handling
    - Created `entityDecoder.ts` with 85 new tests
    - Handles standard XML entities (&lt;, &gt;, &amp;, &quot;, &apos;)
    - Handles numeric entities (decimal &#60; and hex &#x3C;)
    - Handles HTML named entities (&nbsp;, &mdash;, Norwegian chars, etc.)
    - Handles double and triple-encoded entities from proxy issues
    - Integrated into ImprovedFeedParser for automatic decoding
  - Total tests: 466 (up from 364)

### 2025-11-26 (Session 2)
- REF-003: Feed Parser hardening in progress (5/10 sub-tasks completed)
  - ST-003-01: Created comprehensive test suite (78+ tests)
  - ST-003-02: Verified RSS 1.0 (RDF) support works
  - ST-003-06: Implemented feed validation with format detection
  - ST-003-09: Implemented JSON Feed v1.0/v1.1 support
  - ST-003-10: Added TypeScript strict types with type guards
  - New files: `jsonFeedParser.ts`, `feedValidator.ts`, `feedTypes.ts`
  - Total tests: 364 (up from 309)

### 2025-11-26
- REF-012: Completed Security Hardening (6/7 sub-tasks)
  - Implemented DOMPurify content sanitization for XSS prevention
  - Created ContentSanitizer service with comprehensive HTML/URL sanitization
  - Added CSP compliance utilities (cspCompliance.ts)
  - Implemented URL validator with SSRF protection (urlValidator.ts)
  - Created property pane input validators (propertyValidators.ts)
  - Created security audit checklist (docs/SECURITY_CHECKLIST.md)
  - Ran dependency security audit, removed unused `comlink` package
  - Added security-related npm scripts (test:security, security:audit)
  - 265 total tests passing, including 137 new security tests
  - ST-012-04 (Proxy Auth) deferred as optional feature
- REF-002: Completed Azure Function CORS Proxy (11/11 sub-tasks)
  - Rewrote proxy from PowerShell to TypeScript
  - Implemented URL validation with SSRF protection
  - Added domain allowlist with wildcard support
  - Added rate limiting with configurable limits
  - Created Bicep and ARM templates for one-click deployment
  - Created PowerShell and Bash deployment scripts
  - Added health check endpoint for monitoring
  - Implemented structured logging for Application Insights
  - Updated WebPart ProxyService to use tenant proxy
  - Created comprehensive admin documentation

### 2025-11-24 (Session 2)
- REF-001: Completed 8/9 sub-tasks for testing infrastructure
  - Fixed @testing-library/react version (v14→v12) for React 17 compatibility
  - Configured Jest with SPFx module mocks and localization mocks
  - Created comprehensive component test template (22 tests for RssFeed)
  - Created comprehensive service test template (21 tests for ImprovedFeedParser)
  - All 43 tests passing
  - Coverage at ~33% (below 70% threshold, more tests needed in future tasks)
- Only ST-001-09 (E2E Testing with Playwright) remains optional

### 2025-11-24 (Update)
- Added REF-012-SECURITY-HARDENING (XSS, SSRF, CSP compliance)
- Added REF-013-BUNDLE-OPTIMIZATION (code splitting, tree-shaking)
- Updated REF-001: Added E2E testing with Playwright, fixed Node version
- Updated REF-002: Added Bicep templates, Azure AD authentication option
- Updated REF-003: Added JSON Feed format support
- Updated REF-006: Added SharePoint theme integration, high contrast, print styles
- Updated REF-009: Added duplicate detection, migration strategy
- Updated REF-010: Added shareable URL state for filters
- Total tasks: 13 (was 11)
- Total sub-tasks: 100 (was 87)

### 2025-11-24
- Initial task list created
- 11 tasks defined across 5 phases
- Reference files structure established
