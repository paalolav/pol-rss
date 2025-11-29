# REF-017: PropertyPane Feed Validation with ProxyService

## Status: Completed

## Problem
When validating feed URLs in the property pane, direct fetch was used without CORS proxy fallback. This caused feeds like `sentralregisteret.no/feed` and `nrk.no/rss` to fail with CORS errors when testing in the property pane.

## Root Cause
`PropertyPaneFeedUrl._validateFeed()` used direct `fetch()` with a single optional `proxyUrl` prop, instead of using the existing `ProxyService` which handles the full CORS fallback chain.

## Solution
Refactored `PropertyPaneFeedUrl._validateFeed()` to use `ProxyService.fetch()` which automatically handles:
1. Direct fetch first
2. Tenant proxy fallback (if configured)
3. Public CORS proxies (allorigins.win, corsproxy.io, codetabs.com)
4. SPHttpClient fallback

## Files Modified
- `src/webparts/polRssGallery/propertyPane/PropertyPaneFeedUrl.ts` - Use ProxyService.fetch

## Tests Added
- `tests/services/proxyService.test.ts` - 13 tests for proxy fallback chain
- `tests/propertyPane/PropertyPaneFeedUrl.test.ts` - 8 tests for validation with ProxyService

## Test Infrastructure Updates
- Renamed `tests/mocks/spfxMocks.ts` to `spfxMocks.tsx` for JSX support
- Added `PropertyPaneFieldType` enum mock
- Updated `jest.config.js` moduleNameMapper paths

## Changelog
- Session 30: Created task, wrote tests (TDD), fixed PropertyPaneFeedUrl to use ProxyService
