/**
 * Feed Parser Types
 *
 * Comprehensive TypeScript type definitions for feed parsing.
 * These types provide strict typing for all feed-related operations.
 */

/**
 * Supported feed format types
 */
export type FeedFormatType = 'rss1' | 'rss2' | 'atom' | 'json';

/**
 * Feed type as returned in parsed items
 */
export type FeedItemType = 'rss' | 'atom' | 'json';

/**
 * Parsed feed result with metadata
 */
export interface ParsedFeed {
  /** Feed title */
  title: string;
  /** Feed description or subtitle */
  description: string;
  /** Feed homepage link */
  link: string;
  /** Feed language (e.g., 'en-US', 'nb-NO') */
  language?: string;
  /** Last build/update date */
  lastBuildDate?: Date;
  /** Feed format (rss1, rss2, atom, json) */
  format: FeedFormatType;
  /** Parsed feed items */
  items: RssFeedItem[];
  /** Validation result (optional) */
  validation?: FeedValidation;
}

/**
 * Individual feed item structure
 */
export interface RssFeedItem {
  /** Item title */
  title: string;
  /** Item link/URL */
  link: string;
  /** Item description/content (cleaned HTML) */
  description: string;
  /** Publication date (string format from feed) */
  pubDate: string;
  /** Parsed publication date (optional) */
  pubDateParsed?: Date;
  /** Item author name */
  author?: string;
  /** Item categories/tags */
  categories?: string[];
  /** Primary image URL */
  imageUrl?: string;
  /** Item GUID/ID */
  guid?: string;
  /** Enclosures (media attachments) */
  enclosures?: FeedEnclosure[];
  /** Source feed (for aggregated feeds) */
  source?: FeedSource;
  /** Feed type indicator */
  feedType?: FeedItemType;
}

/**
 * Feed enclosure (media attachment)
 */
export interface FeedEnclosure {
  /** Enclosure URL */
  url: string;
  /** MIME type (e.g., 'image/jpeg', 'audio/mpeg') */
  type: string;
  /** File size in bytes */
  length?: number;
  /** Title/description (for JSON Feed attachments) */
  title?: string;
}

/**
 * Feed source attribution
 */
export interface FeedSource {
  /** Source name */
  title: string;
  /** Source feed URL */
  url?: string;
}

/**
 * Feed validation result
 */
export interface FeedValidation {
  /** Whether feed is valid */
  isValid: boolean;
  /** Detected format */
  format: FeedFormatType | 'unknown';
  /** Format version (e.g., '2.0', '1.0', '1.1') */
  formatVersion?: string;
  /** Validation errors (critical issues) */
  errors: FeedValidationIssue[];
  /** Validation warnings (non-critical issues) */
  warnings: FeedValidationIssue[];
}

/**
 * Validation issue (error or warning)
 */
export interface FeedValidationIssue {
  /** Issue code (e.g., 'MISSING_TITLE', 'INVALID_DATE') */
  code: string;
  /** Human-readable message */
  message: string;
  /** Affected field path (optional) */
  field?: string;
}

/**
 * Parser options for feed parsing
 */
export interface FeedParserOptions {
  /** Fallback image URL when no image is found */
  fallbackImageUrl: string;
  /** Maximum number of items to parse (0 = no limit) */
  maxItems?: number;
  /** Enable debug logging */
  enableDebug?: boolean;
  /** Preprocessing hints for malformed feeds */
  preprocessingHints?: FeedPreprocessingHints;
  /** Parse dates into Date objects */
  parseDates?: boolean;
  /** Validate feed structure */
  validate?: boolean;
}

/**
 * Preprocessing hints for handling malformed feeds
 */
export interface FeedPreprocessingHints {
  /** Add missing namespace declarations */
  addMissingNamespaces?: boolean;
  /** Attempt to fix unclosed XML tags */
  fixUnclosedTags?: boolean;
  /** Add XML declaration if missing */
  addMissingXmlDeclaration?: boolean;
  /** Fix malformed CDATA sequences */
  fixCdataSequences?: boolean;
  /** Extract feed from HTML wrapper */
  extractFromHtml?: boolean;
  /** Strip BOM (Byte Order Mark) */
  stripBom?: boolean;
  /** Remove control characters */
  removeControlChars?: boolean;
}

/**
 * Date formats commonly found in feeds
 */
export type DateFormatHint =
  | 'rfc822'      // RSS standard: "Sat, 24 Nov 2025 10:00:00 GMT"
  | 'rfc3339'     // Atom standard: "2025-11-24T10:00:00Z"
  | 'iso8601'     // "2025-11-24T10:00:00+01:00"
  | 'custom';     // Non-standard format

/**
 * Parsed date with format information
 */
export interface ParsedDate {
  /** Original date string from feed */
  original: string;
  /** Parsed Date object (or null if parsing failed) */
  parsed: Date | null;
  /** Detected format */
  format: DateFormatHint;
  /** Whether parsing was successful */
  valid: boolean;
}

/**
 * Image source with metadata
 */
export interface FeedImage {
  /** Image URL */
  url: string;
  /** Image source type */
  source: ImageSourceType;
  /** Image width (if available) */
  width?: number;
  /** Image height (if available) */
  height?: number;
  /** Alt text (if available) */
  alt?: string;
}

/**
 * Image source types in priority order
 */
export type ImageSourceType =
  | 'media:thumbnail'
  | 'media:content'
  | 'enclosure'
  | 'content:encoded'
  | 'description'
  | 'itunes:image'
  | 'channel'
  | 'fallback';

/**
 * JSON Feed specific types
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JsonFeed {
  /**
   * JSON Feed author
   */
  export interface Author {
    name?: string;
    url?: string;
    avatar?: string;
  }

  /**
   * JSON Feed attachment
   */
  export interface Attachment {
    url: string;
    mime_type: string;
    title?: string;
    size_in_bytes?: number;
    duration_in_seconds?: number;
  }

  /**
   * JSON Feed item
   */
  export interface Item {
    id: string;
    url?: string;
    external_url?: string;
    title?: string;
    content_html?: string;
    content_text?: string;
    summary?: string;
    image?: string;
    banner_image?: string;
    date_published?: string;
    date_modified?: string;
    authors?: Author[];
    tags?: string[];
    language?: string;
    attachments?: Attachment[];
  }

  /**
   * JSON Feed structure
   */
  export interface Feed {
    version: string;
    title: string;
    home_page_url?: string;
    feed_url?: string;
    description?: string;
    user_comment?: string;
    next_url?: string;
    icon?: string;
    favicon?: string;
    authors?: Author[];
    language?: string;
    expired?: boolean;
    items: Item[];
  }
}

/**
 * RSS 2.0 specific types
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rss2 {
  /**
   * RSS 2.0 channel
   */
  export interface Channel {
    title: string;
    link: string;
    description: string;
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
    pubDate?: string;
    lastBuildDate?: string;
    category?: string[];
    generator?: string;
    docs?: string;
    ttl?: number;
    image?: ChannelImage;
    items: Item[];
  }

  /**
   * RSS 2.0 channel image
   */
  export interface ChannelImage {
    url: string;
    title: string;
    link: string;
    width?: number;
    height?: number;
  }

  /**
   * RSS 2.0 item
   */
  export interface Item {
    title?: string;
    link?: string;
    description?: string;
    author?: string;
    category?: string[];
    comments?: string;
    enclosure?: Enclosure;
    guid?: Guid;
    pubDate?: string;
    source?: Source;
  }

  /**
   * RSS 2.0 enclosure
   */
  export interface Enclosure {
    url: string;
    length?: number;
    type: string;
  }

  /**
   * RSS 2.0 GUID
   */
  export interface Guid {
    value: string;
    isPermaLink?: boolean;
  }

  /**
   * RSS 2.0 source
   */
  export interface Source {
    value: string;
    url?: string;
  }
}

/**
 * Atom 1.0 specific types
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Atom {
  /**
   * Atom feed
   */
  export interface Feed {
    id: string;
    title: TextConstruct;
    updated: string;
    author?: Person[];
    link?: Link[];
    category?: Category[];
    contributor?: Person[];
    generator?: Generator;
    icon?: string;
    logo?: string;
    rights?: TextConstruct;
    subtitle?: TextConstruct;
    entries: Entry[];
  }

  /**
   * Atom entry
   */
  export interface Entry {
    id: string;
    title: TextConstruct;
    updated: string;
    author?: Person[];
    content?: Content;
    link?: Link[];
    summary?: TextConstruct;
    category?: Category[];
    contributor?: Person[];
    published?: string;
    source?: Source;
    rights?: TextConstruct;
  }

  /**
   * Atom text construct
   */
  export interface TextConstruct {
    type?: 'text' | 'html' | 'xhtml';
    value: string;
  }

  /**
   * Atom content
   */
  export interface Content extends TextConstruct {
    src?: string;
  }

  /**
   * Atom person (author/contributor)
   */
  export interface Person {
    name: string;
    uri?: string;
    email?: string;
  }

  /**
   * Atom link
   */
  export interface Link {
    href: string;
    rel?: string;
    type?: string;
    hreflang?: string;
    title?: string;
    length?: number;
  }

  /**
   * Atom category
   */
  export interface Category {
    term: string;
    scheme?: string;
    label?: string;
  }

  /**
   * Atom generator
   */
  export interface Generator {
    value: string;
    uri?: string;
    version?: string;
  }

  /**
   * Atom source (for entries)
   */
  export interface Source {
    id?: string;
    title?: TextConstruct;
    updated?: string;
  }
}

/**
 * Type guard to check if an item has categories
 */
export function hasCategories(item: RssFeedItem): item is RssFeedItem & { categories: string[] } {
  return Array.isArray(item.categories) && item.categories.length > 0;
}

/**
 * Type guard to check if an item has an author
 */
export function hasAuthor(item: RssFeedItem): item is RssFeedItem & { author: string } {
  return typeof item.author === 'string' && item.author.length > 0;
}

/**
 * Type guard to check if an item has an image
 */
export function hasImage(item: RssFeedItem): item is RssFeedItem & { imageUrl: string } {
  return typeof item.imageUrl === 'string' && item.imageUrl.length > 0;
}

/**
 * Type guard to check if an item has enclosures
 */
export function hasEnclosures(item: RssFeedItem): item is RssFeedItem & { enclosures: FeedEnclosure[] } {
  return Array.isArray(item.enclosures) && item.enclosures.length > 0;
}
