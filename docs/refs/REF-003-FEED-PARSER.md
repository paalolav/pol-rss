# REF-003-FEED-PARSER

> **Status:** Completed
> **Priority:** High
> **Phase:** 2 - Core Reliability
> **Estimated Complexity:** High
> **Progress:** 10/10 sub-tasks completed

## Overview

Harden the ImprovedFeedParser service to handle edge cases, malformed feeds, and ensure compatibility with all common RSS/Atom formats. The parser must gracefully handle real-world feeds that often don't conform to specifications.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE (for comprehensive testing)

## Dependencies

- REF-001-TESTING-INFRASTRUCTURE

## Current Parser Analysis

The existing `ImprovedFeedParser` in `src/webparts/polRssGallery/services/improvedFeedParser.ts`:
- Supports RSS 2.0 and Atom formats
- Has XML pre-processing for namespaces and entities
- Extracts images from multiple sources
- Uses DOMParser for XML parsing

## Sub-Tasks

### ST-003-01: Create Comprehensive Feed Test Suite
**Status:** `[x]` Completed
**Test File:** `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Created 78+ test cases covering RSS 1.0, RSS 2.0, Atom 1.0, JSON Feed, and edge cases. Added 30+ test fixtures in `tests/utils/feedTestData.ts`.

**Description:**
Create extensive test suite with real-world feed samples covering all formats and edge cases.

**Steps:**
1. Collect sample feeds:
   - RSS 2.0 (standard, minimal, rich)
   - RSS 1.0 (RDF-based)
   - Atom 1.0 (standard, with extensions)
   - Media RSS (with media:content)
   - Dublin Core extended
   - Malformed but common patterns
2. Create test data files in `tests/fixtures/feeds/`
3. Write test cases for each format

**Test Categories:**
```typescript
describe('ImprovedFeedParser', () => {
  describe('RSS 2.0', () => { /* ... */ });
  describe('RSS 1.0', () => { /* ... */ });
  describe('Atom 1.0', () => { /* ... */ });
  describe('Media RSS', () => { /* ... */ });
  describe('Edge Cases', () => { /* ... */ });
  describe('Error Handling', () => { /* ... */ });
});
```

**Acceptance Criteria:**
- [ ] 50+ test cases covering all scenarios
- [ ] Real-world feed samples included
- [ ] Edge cases documented

---

### ST-003-02: Implement RSS 1.0 (RDF) Support
**Status:** `[x]` Completed
**Test File:** `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Parser's generic selectors already support RSS 1.0 RDF structure. Tests verify dc:date and dc:creator extraction work correctly.

**Description:**
Add support for RSS 1.0 format which uses RDF/XML structure.

**Steps:**
1. Detect RSS 1.0 format (rdf:RDF root element)
2. Parse RDF structure correctly
3. Map RDF properties to IRssItem interface
4. Handle rdf:resource references

**RSS 1.0 Structure:**
```xml
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <channel>
    <title>Feed Title</title>
    <items>
      <rdf:Seq>
        <rdf:li rdf:resource="..." />
      </rdf:Seq>
    </items>
  </channel>
  <item rdf:about="...">
    <title>Item Title</title>
  </item>
</rdf:RDF>
```

**Acceptance Criteria:**
- [ ] RSS 1.0 feeds parse correctly
- [ ] RDF references resolved
- [ ] Backward compatible with RSS 2.0/Atom

---

### ST-003-03: Improve XML Entity Handling
**Status:** `[x]` Completed
**Test File:** `tests/services/entityDecoder.test.ts`, `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Created comprehensive `entityDecoder.ts` service with 85 tests. Handles standard XML entities (&lt;, &gt;, &amp;, &quot;, &apos;), numeric entities (decimal &#60; and hex &#x3C;), HTML named entities (&nbsp;, &mdash;, etc.), and double/triple-encoded entities. Integrated into ImprovedFeedParser.

**Description:**
Enhance handling of XML entities, especially in CDATA sections and encoded content.

**Steps:**
1. Handle standard XML entities (&lt;, &gt;, &amp;, etc.)
2. Handle numeric entities (&#60;, &#x3C;)
3. Handle HTML entities in content (&nbsp;, &mdash;)
4. Preserve CDATA content correctly
5. Handle double-encoded entities

**Edge Cases:**
```xml
<!-- Double encoded -->
<description>&amp;lt;p&amp;gt;Text&amp;lt;/p&amp;gt;</description>

<!-- Mixed encoding -->
<content:encoded><![CDATA[<p>Text &amp; more</p>]]></content:encoded>

<!-- Numeric entities -->
<title>Price: &#36;100</title>
```

**Acceptance Criteria:**
- [ ] All standard XML entities decoded
- [ ] HTML entities in content handled
- [ ] Double-encoded content detected and fixed
- [ ] CDATA preserved correctly

---

### ST-003-04: Enhance Image Extraction
**Status:** `[x]` Completed
**Test File:** `tests/services/imageExtractor.test.ts`, `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Created comprehensive `imageExtractor.ts` service with 84 tests. Implements prioritized fallback chain (media:thumbnail → media:content → enclosure → content:encoded → description → itunes:image → channel image → fallback). Includes URL validation, relative URL resolution, size/quality preferences, and duplicate detection for media:group elements. Integrated into ImprovedFeedParser for both RSS and Atom parsing.

**Description:**
Improve image extraction to find images from all possible sources with proper fallback chain.

**Steps:**
1. Extract from media:content and media:thumbnail
2. Extract from enclosure (type="image/*")
3. Extract from content:encoded HTML
4. Extract from description HTML
5. Extract from itunes:image
6. Extract from og:image in linked content (optional)
7. Implement quality/size preference

**Image Source Priority:**
```
1. media:thumbnail (preferred size)
2. media:content (type="image/*")
3. enclosure (type="image/*")
4. First <img> in content:encoded
5. First <img> in description
6. itunes:image
7. Channel image (fallback)
8. Configured fallback image
```

**Acceptance Criteria:**
- [ ] Images extracted from all sources
- [ ] Correct priority order followed
- [ ] Invalid image URLs filtered
- [ ] Relative URLs resolved

---

### ST-003-05: Improve Date Parsing
**Status:** `[x]` Completed
**Test File:** `tests/services/dateParser.test.ts`, `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Created comprehensive `dateParser.ts` service with 77 tests. Supports RFC 822 (RSS standard), RFC 3339/ISO 8601 (Atom standard), Unix timestamps, and various non-standard formats. Handles timezone conversions and Norwegian month names. All dates are now normalized to ISO format. Integrated into ImprovedFeedParser and jsonFeedParser.

**Description:**
Handle all common date formats found in RSS/Atom feeds.

**Steps:**
1. Support RFC 822 (RSS standard)
2. Support RFC 3339/ISO 8601 (Atom standard)
3. Support common non-standard formats
4. Handle timezone variations
5. Fallback to current date if unparseable

**Date Formats to Support:**
```
RFC 822:     "Sat, 23 Nov 2025 14:30:00 GMT"
RFC 3339:    "2025-11-23T14:30:00Z"
ISO 8601:    "2025-11-23T14:30:00+01:00"
Non-standard: "November 23, 2025"
Non-standard: "23/11/2025 14:30"
Non-standard: "2025-11-23"
```

**Acceptance Criteria:**
- [ ] All standard formats parsed
- [ ] Common non-standard formats handled
- [ ] Timezones correctly applied
- [ ] Invalid dates don't crash parser

---

### ST-003-06: Add Feed Validation
**Status:** `[x]` Completed
**Test File:** `tests/services/feedValidator.test.ts`
**Completed:** 2025-11-26
**Notes:** Created `feedValidator.ts` with `validateFeed()` and `detectFeedFormat()` functions. Supports RSS 1.0, RSS 2.0, Atom, and JSON Feed validation. 29 tests.

**Description:**
Add validation layer to detect and report feed issues.

**Steps:**
1. Validate XML well-formedness
2. Detect feed format (RSS/Atom/unknown)
3. Validate required elements present
4. Return structured validation result
5. Support "lenient" mode for recovery

**Validation Response:**
```typescript
interface FeedValidationResult {
  isValid: boolean;
  format: 'rss1' | 'rss2' | 'atom' | 'json' | 'unknown';
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

**Acceptance Criteria:**
- [ ] Invalid XML detected with clear message
- [ ] Missing required elements reported
- [ ] Format correctly identified
- [ ] Warnings for non-critical issues

---

### ST-003-07: Implement Recovery Mode
**Status:** `[x]` Completed
**Test File:** `tests/services/feedRecovery.test.ts`
**Completed:** 2025-11-26
**Notes:** Created comprehensive `feedRecovery.ts` service with 10 recovery strategies. Added `parseWithRecovery()` method to ImprovedFeedParser. Recovery enabled by default, includes alternative regex-based extraction as last resort. 59 new tests.

**Description:**
Add recovery mode to extract as much content as possible from malformed feeds.

**Steps:**
1. Detect common malformation patterns
2. Apply fixes (unclosed tags, bad encoding)
3. Extract items even if some fail
4. Return partial results with error list
5. Log recovery actions for debugging

**Recovery Strategies:**
```typescript
const recoveryStrategies = [
  'removeControlCharacters',
  'fixDuplicateDeclarations',
  'stripInvalidXml',
  'fixBrokenCdata',
  'fixBadEncoding',
  'fixMissingNamespaces',
  'fixUnclosedTags',
  'fixMalformedAttributes',
  'extractFromHtml',
  'normalizeWhitespace'
];
```

**Acceptance Criteria:**
- [x] Partial content extracted from bad feeds
- [x] Recovery actions logged
- [x] Original errors preserved
- [x] User informed of issues

---

### ST-003-08: Optimize Performance
**Status:** `[x]` Completed
**Test File:** `tests/services/improvedFeedParser.performance.test.ts`
**Completed:** 2025-11-26
**Notes:** Implemented multiple performance optimizations achieving 21x improvement for large feeds. Key changes: lazy XML preprocessing (only preprocess if initial parse fails), early loop termination with maxItems, cached channel/feed element lookups, optimized `selectNamespacedElements` using `getElementsByTagName` instead of `querySelectorAll('*')`. All targets met.

**Description:**
Optimize parser performance for large feeds.

**Steps:**
1. Profile current parser with large feeds
2. Reduce DOM operations
3. Use streaming where possible
4. Add early termination when maxItems reached
5. Cache parsed results (via CacheService)

**Performance Results:**
| Feed Size | Before | After | Target | Improvement |
|-----------|--------|-------|--------|-------------|
| 10 items | 4.72ms | 3.65ms | < 10ms | 1.3x |
| 50 items | 27.91ms | 10.40ms | < 50ms | 2.7x |
| 100 items | 84.52ms | 16.95ms | < 100ms | 5x |
| 500 items | 1769ms | 82.29ms | < 300ms | 21x |

**Acceptance Criteria:**
- [x] Performance targets met
- [x] Memory usage stable for large feeds
- [x] No UI blocking during parse

---

### ST-003-09: Implement JSON Feed Support
**Status:** `[x]` Completed
**Test File:** `tests/services/improvedFeedParser.test.ts`
**Completed:** 2025-11-26
**Notes:** Created `jsonFeedParser.ts` with full JSON Feed v1.0/v1.1 support. Integrated into main parser with automatic format detection. 13 tests. Added `feedType: 'json'` to IRssItem interface.

**Description:**
Add support for JSON Feed format (jsonfeed.org), a modern JSON-based alternative to RSS/Atom.

**Steps:**
1. Detect JSON Feed format (check for version field and items array)
2. Parse JSON structure directly (no XML parsing needed)
3. Map JSON fields to IRssItem interface
4. Handle attachments (equivalent to enclosures)
5. Support both version 1.0 and 1.1

**JSON Feed Structure:**
```json
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "My Feed",
  "home_page_url": "https://example.org/",
  "feed_url": "https://example.org/feed.json",
  "items": [
    {
      "id": "1",
      "url": "https://example.org/article-1",
      "title": "Article Title",
      "content_html": "<p>Content</p>",
      "content_text": "Content",
      "date_published": "2025-11-24T10:00:00Z",
      "image": "https://example.org/image.jpg",
      "attachments": [
        {
          "url": "https://example.org/file.pdf",
          "mime_type": "application/pdf",
          "title": "Document"
        }
      ],
      "authors": [
        { "name": "John Doe", "url": "https://example.org/john" }
      ],
      "tags": ["news", "technology"]
    }
  ]
}
```

**Implementation:**
```typescript
// src/webparts/polRssGallery/services/jsonFeedParser.ts
interface JsonFeed {
  version: string;
  title: string;
  home_page_url?: string;
  feed_url?: string;
  description?: string;
  items: JsonFeedItem[];
}

interface JsonFeedItem {
  id: string;
  url?: string;
  title?: string;
  content_html?: string;
  content_text?: string;
  summary?: string;
  image?: string;
  date_published?: string;
  date_modified?: string;
  authors?: { name: string; url?: string }[];
  tags?: string[];
  attachments?: { url: string; mime_type: string; title?: string }[];
}

export function isJsonFeed(content: string): boolean {
  try {
    const data = JSON.parse(content);
    return data.version && data.version.includes('jsonfeed.org') && Array.isArray(data.items);
  } catch {
    return false;
  }
}

export function parseJsonFeed(content: string): ParsedFeed {
  const data: JsonFeed = JSON.parse(content);

  return {
    title: data.title,
    description: data.description || '',
    link: data.home_page_url || '',
    format: 'json',
    items: data.items.map(item => ({
      id: item.id,
      title: item.title || 'Untitled',
      link: item.url || '',
      description: item.content_html || item.content_text || item.summary || '',
      pubDate: item.date_published ? new Date(item.date_published) : new Date(),
      imageUrl: item.image,
      author: item.authors?.[0]?.name,
      categories: item.tags || [],
    })),
  };
}
```

**Detection Order:**
```
1. Try JSON parse → if valid JSON Feed, use JSON parser
2. Try XML parse → detect RSS 1.0, RSS 2.0, or Atom
3. Return error if neither
```

**Acceptance Criteria:**
- [ ] JSON Feed v1.0 and v1.1 supported
- [ ] Content automatically detected (XML vs JSON)
- [ ] All standard fields mapped
- [ ] Attachments handled as enclosures
- [ ] Authors and tags preserved

---

### ST-003-10: Add TypeScript Strict Types
**Status:** `[x]` Completed
**Test File:** `tests/services/feedTypes.test.ts`
**Completed:** 2025-11-26
**Notes:** Created `feedTypes.ts` with comprehensive type definitions for ParsedFeed, RssFeedItem, FeedEnclosure, FeedValidation, and format-specific namespaces (JsonFeed, Rss2, Atom). Added type guards for hasCategories, hasAuthor, hasImage, hasEnclosures. 13 tests.

**Description:**
Add comprehensive TypeScript types for all parser interfaces.

**Steps:**
1. Define strict types for parsed feed
2. Define types for feed items
3. Define types for parser options
4. Add JSDoc documentation
5. Export types for consumer use

**Type Definitions:**
```typescript
export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  language?: string;
  lastBuildDate?: Date;
  items: RssFeedItem[];
  format: FeedFormat;
  validationResult: FeedValidationResult;
}

export interface RssFeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  author?: string;
  categories: string[];
  imageUrl?: string;
  guid?: string;
  enclosures: Enclosure[];
}
```

**Acceptance Criteria:**
- [ ] All interfaces strictly typed
- [ ] No `any` types in parser code
- [ ] JSDoc for all public methods
- [ ] Types exported for consumers

---

## Test Fixtures Needed

```
tests/fixtures/feeds/
├── rss2/
│   ├── standard.xml
│   ├── minimal.xml
│   ├── with-media.xml
│   ├── with-enclosure.xml
│   └── malformed.xml
├── rss1/
│   ├── standard.xml
│   └── with-dc.xml
├── atom/
│   ├── standard.xml
│   ├── with-media.xml
│   └── minimal.xml
├── json/
│   ├── standard-v1.json
│   ├── standard-v11.json
│   ├── with-attachments.json
│   └── minimal.json
├── edge-cases/
│   ├── double-encoded.xml
│   ├── bad-dates.xml
│   ├── missing-required.xml
│   ├── huge-feed.xml
│   └── non-utf8.xml
└── real-world/
    ├── nrk.xml
    ├── bbc.xml
    └── meltwater.xml
```

## Files to Modify

```
src/webparts/polRssGallery/services/
├── improvedFeedParser.ts    # Main parser (refactor) ✓
├── feedValidator.ts         # Validation logic ✓
├── feedRecovery.ts          # Recovery strategies ✓
├── feedTypes.ts             # Type definitions ✓
├── jsonFeedParser.ts        # JSON Feed support ✓
├── entityDecoder.ts         # Entity handling ✓
├── imageExtractor.ts        # Image extraction ✓
└── dateParser.ts            # Date parsing utilities ✓
```

## Related Tasks

- **REF-001-TESTING-INFRASTRUCTURE:** Provides test framework
- **REF-004-ERROR-HANDLING:** Parser errors need proper handling
- **REF-009-FEED-AGGREGATION:** Parser must support merging feeds
