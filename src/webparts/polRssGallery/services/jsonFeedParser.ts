/**
 * JSON Feed Parser
 *
 * Parses JSON Feed format (jsonfeed.org) version 1.0 and 1.1.
 * JSON Feed is a modern, JSON-based alternative to RSS/Atom.
 *
 * @see https://jsonfeed.org/version/1.1
 */

import { IRssItem } from '../components/IRssItem';
import { cleanDescription } from '../components/rssUtils';
import { parseDateToIsoString } from './dateParser';

/**
 * JSON Feed structure (v1.0/v1.1)
 */
interface JsonFeed {
  version: string;
  title: string;
  home_page_url?: string;
  feed_url?: string;
  description?: string;
  user_comment?: string;
  next_url?: string;
  icon?: string;
  favicon?: string;
  authors?: JsonFeedAuthor[];
  language?: string;
  expired?: boolean;
  hubs?: JsonFeedHub[];
  items: JsonFeedItem[];
}

/**
 * JSON Feed item structure
 */
interface JsonFeedItem {
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
  authors?: JsonFeedAuthor[];
  tags?: string[];
  language?: string;
  attachments?: JsonFeedAttachment[];
}

/**
 * JSON Feed author structure
 */
interface JsonFeedAuthor {
  name?: string;
  url?: string;
  avatar?: string;
}

/**
 * JSON Feed attachment structure
 */
interface JsonFeedAttachment {
  url: string;
  mime_type: string;
  title?: string;
  size_in_bytes?: number;
  duration_in_seconds?: number;
}

/**
 * JSON Feed hub structure (for real-time subscriptions)
 */
interface JsonFeedHub {
  type: string;
  url: string;
}

/**
 * Options for JSON Feed parsing
 */
export interface IJsonFeedParserOptions {
  fallbackImageUrl: string;
  maxItems?: number;
}

/**
 * Check if content is a JSON Feed
 *
 * @param content - Raw content string to check
 * @returns true if content appears to be a JSON Feed
 */
export function isJsonFeed(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const trimmed = content.trim();

  // Must start with { (JSON object)
  if (!trimmed.startsWith('{')) {
    return false;
  }

  try {
    const data = JSON.parse(trimmed);

    // Check for JSON Feed version field
    if (!data.version || typeof data.version !== 'string') {
      return false;
    }

    // Version must contain jsonfeed.org
    if (!data.version.includes('jsonfeed.org')) {
      return false;
    }

    // Must have items array
    if (!Array.isArray(data.items)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON Feed content into RSS items
 *
 * @param content - JSON Feed content string
 * @param options - Parser options
 * @returns Array of parsed RSS items
 * @throws Error if parsing fails
 */
export function parseJsonFeed(content: string, options: IJsonFeedParserOptions): IRssItem[] {
  if (!content) {
    throw new Error('Empty JSON Feed content received');
  }

  let feed: JsonFeed;

  try {
    feed = JSON.parse(content.trim());
  } catch (error) {
    throw new Error(`Invalid JSON Feed: ${error instanceof Error ? error.message : 'Parse error'}`);
  }

  // Validate JSON Feed structure
  if (!feed.version || !feed.version.includes('jsonfeed.org')) {
    throw new Error('Invalid JSON Feed: missing or invalid version field');
  }

  if (!Array.isArray(feed.items)) {
    throw new Error('Invalid JSON Feed: missing items array');
  }

  // Get feed-level fallback image
  const feedImage = feed.icon || feed.favicon || options.fallbackImageUrl;

  // Parse items
  let items = feed.items;

  // Apply maxItems limit
  if (options.maxItems && options.maxItems > 0 && items.length > options.maxItems) {
    items = items.slice(0, options.maxItems);
  }

  return items.map((item): IRssItem => {
    // Get title (use "Untitled" if missing)
    const title = item.title || 'Untitled';

    // Get link (prefer url, fallback to external_url, then id if it's a URL)
    let link = item.url || item.external_url || '';
    if (!link && item.id && (item.id.startsWith('http://') || item.id.startsWith('https://'))) {
      link = item.id;
    }

    // Get description (prefer content_html, then content_text, then summary)
    const rawDescription = item.content_html || item.content_text || item.summary || '';
    const description = cleanDescription(rawDescription);

    // Get publication date - normalize using date parser (ST-003-05)
    const rawDate = item.date_published || item.date_modified || '';
    const pubDate = rawDate ? (parseDateToIsoString(rawDate) || rawDate) : '';

    // Get image (prefer item image, then banner, then feed icon)
    let imageUrl = item.image || item.banner_image;

    // Check attachments for images
    if (!imageUrl && item.attachments) {
      const imageAttachment = item.attachments.find(att =>
        att.mime_type && att.mime_type.startsWith('image/')
      );
      if (imageAttachment) {
        imageUrl = imageAttachment.url;
      }
    }

    // Fall back to feed image
    if (!imageUrl) {
      imageUrl = feedImage;
    }

    // Get author
    let author: string | undefined;
    if (item.authors && item.authors.length > 0) {
      author = item.authors[0].name;
    } else if (feed.authors && feed.authors.length > 0) {
      // Fall back to feed-level author
      author = feed.authors[0].name;
    }

    // Get categories from tags
    const categories = item.tags && item.tags.length > 0 ? item.tags : undefined;

    return {
      title,
      link,
      description,
      pubDate,
      imageUrl,
      author,
      categories,
      feedType: 'json' as const,
    };
  });
}

/**
 * Get JSON Feed metadata
 *
 * @param content - JSON Feed content string
 * @returns Feed metadata or null if invalid
 */
export function getJsonFeedMetadata(content: string): {
  title: string;
  description: string;
  homePageUrl: string;
  version: string;
} | null {
  try {
    const feed: JsonFeed = JSON.parse(content.trim());

    if (!feed.version || !feed.version.includes('jsonfeed.org')) {
      return null;
    }

    return {
      title: feed.title || 'Untitled Feed',
      description: feed.description || '',
      homePageUrl: feed.home_page_url || '',
      version: feed.version,
    };
  } catch {
    return null;
  }
}
