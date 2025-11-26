import { IRssItem } from '../components/IRssItem';
import { cleanDescription, resolveImageUrl } from '../components/rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { isJsonFeed, parseJsonFeed } from './jsonFeedParser';
import { decodeXmlText, decodeEntitiesInHtml } from './entityDecoder';
import { extractImage, ImageExtractionOptions } from './imageExtractor';
import { parseDate, parseDateToIsoString } from './dateParser';
import {
  attemptRecovery,
  needsRecovery,
  validateRecoveredContent,
  extractItemsAlternative,
  RecoveryResult,
  RecoveryOptions,
} from './feedRecovery';

/**
 * Result from parsing a feed, includes both items and recovery information
 */
export interface IFeedParseResult {
  /** Parsed feed items */
  items: IRssItem[];
  /** Whether recovery mode was used */
  recoveryUsed: boolean;
  /** Details about recovery actions if recovery was attempted */
  recoveryInfo?: RecoveryResult;
  /** Any warnings about the feed (non-fatal issues) */
  warnings: string[];
}

export interface IFeedParserOptions {
  fallbackImageUrl: string;
  maxItems?: number;
  enableDebug?: boolean;
  /**
   * Enable recovery mode for malformed feeds (ST-003-07)
   * When enabled, parser will attempt to fix and extract content from broken feeds
   * @default true
   */
  enableRecovery?: boolean;
  /**
   * Recovery mode options
   */
  recoveryOptions?: RecoveryOptions;
  preprocessingHints?: {
    addMissingNamespaces?: boolean;
    fixUnclosedTags?: boolean;
    addMissingXmlDeclaration?: boolean;
    fixCdataSequences?: boolean;
  };
}

export class ImprovedFeedParser {
  /**
   * Parse a feed and return items (backwards-compatible method)
   * Uses recovery mode by default to handle malformed feeds
   */
  public static parse(xmlString: string, options: IFeedParserOptions): IRssItem[] {
    const result = this.parseWithRecovery(xmlString, options);
    return result.items;
  }

  /**
   * Parse a feed with full recovery information (ST-003-07)
   * Returns detailed information about any recovery actions taken
   */
  public static parseWithRecovery(xmlString: string, options: IFeedParserOptions): IFeedParseResult {
    const result: IFeedParseResult = {
      items: [],
      recoveryUsed: false,
      warnings: [],
    };

    if (!xmlString) {
      throw new Error("Empty feed content received");
    }

    if (options.enableDebug) {
      RssDebugUtils.setDebugMode(true);
    }

    const enableRecovery = options.enableRecovery !== false; // Default to true

    // Check if content is JSON Feed format first
    if (isJsonFeed(xmlString)) {
      if (RssDebugUtils.isDebugEnabled()) {
        RssDebugUtils.log('RSS Parser: Detected JSON Feed format');
      }

      try {
        result.items = parseJsonFeed(xmlString, {
          fallbackImageUrl: options.fallbackImageUrl,
          maxItems: options.maxItems,
        });

        if (RssDebugUtils.isDebugEnabled()) {
          // eslint-disable-next-line no-console
          console.log(`JSON Feed Parser found ${result.items.length} items`);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;
        throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
      }
    }

    // Check if recovery might be needed before processing
    let contentToProcess = xmlString;
    let recoveryInfo: RecoveryResult | undefined;

    if (enableRecovery && needsRecovery(xmlString)) {
      if (RssDebugUtils.isDebugEnabled()) {
        RssDebugUtils.log('RSS Parser: Feed may have issues, attempting proactive recovery');
      }
      recoveryInfo = attemptRecovery(xmlString, options.recoveryOptions);
      if (recoveryInfo.recoveryAttempted) {
        contentToProcess = recoveryInfo.recoveredContent;
        result.recoveryUsed = true;
        result.recoveryInfo = recoveryInfo;
        result.warnings.push(...recoveryInfo.warnings);
      }
    }

    // Process as XML feed (RSS/Atom)
    try {
      const items = this.parseXmlContent(contentToProcess, options);
      result.items = items;

      if (RssDebugUtils.isDebugEnabled()) {
        // eslint-disable-next-line no-console
        console.log(`RSS Parser found ${items.length} items`);

        const withImages = items.filter(i => !!i.imageUrl).length;
        // eslint-disable-next-line no-console
        console.log(`RSS Items with images: ${withImages}/${items.length}`);

        // eslint-disable-next-line no-console
        console.log(RssDebugUtils.analyzeRssFeed(items, 'Feed analysis'));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;

      // If recovery wasn't tried yet, try it now
      if (enableRecovery && !result.recoveryUsed) {
        if (RssDebugUtils.isDebugEnabled()) {
          RssDebugUtils.log(`RSS Parser: Initial parse failed, attempting recovery. Error: ${errorMessage}`);
        }

        recoveryInfo = attemptRecovery(xmlString, {
          ...options.recoveryOptions,
          aggressive: true, // Use aggressive mode on failure
        });

        result.recoveryUsed = true;
        result.recoveryInfo = recoveryInfo;
        result.recoveryInfo.originalError = errorMessage;
        result.warnings.push(...recoveryInfo.warnings);

        if (recoveryInfo.recoveryAttempted) {
          // Validate recovered content before trying to parse
          const validation = validateRecoveredContent(recoveryInfo.recoveredContent);

          if (validation.valid) {
            try {
              const recoveredItems = this.parseXmlContent(recoveryInfo.recoveredContent, options);
              result.items = recoveredItems;

              if (RssDebugUtils.isDebugEnabled()) {
                RssDebugUtils.log(`RSS Parser: Recovery successful, found ${recoveredItems.length} items`);
              }

              return result;
            } catch (recoveryError) {
              // Recovery parsing also failed, continue to alternative extraction
              if (RssDebugUtils.isDebugEnabled()) {
                RssDebugUtils.log(`RSS Parser: Recovery parse also failed: ${recoveryError instanceof Error ? recoveryError.message : 'Unknown'}`);
              }
            }
          } else {
            result.warnings.push(`Recovered content still invalid: ${validation.error}`);
          }
        }

        // Last resort: try alternative extraction (regex-based)
        const extractedItems = extractItemsAlternative(xmlString);
        if (extractedItems.length > 0) {
          if (RssDebugUtils.isDebugEnabled()) {
            RssDebugUtils.log(`RSS Parser: Using alternative extraction, found ${extractedItems.length} items`);
          }

          result.items = extractedItems.map((item) => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            description: item.description ? cleanDescription(item.description) : '',
            pubDate: item.pubDate || '',
            imageUrl: options.fallbackImageUrl,
            feedType: 'rss' as const,
          }));
          result.warnings.push('Used fallback extraction method - some content may be incomplete');

          return result;
        }
      }

      if (RssDebugUtils.isDebugEnabled()) {
        // eslint-disable-next-line no-console
        console.error(`RSS Parse Error: ${errorMessage}`);
      }

      throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
    }
  }

  /**
   * Internal method to parse XML content
   * Uses lazy preprocessing for performance (ST-003-08):
   * 1. Try parsing raw XML first (fast path for clean feeds)
   * 2. If that fails, apply preprocessing and retry
   */
  private static parseXmlContent(xmlString: string, options: IFeedParserOptions): IRssItem[] {
    const parser = new DOMParser();

    // ST-003-08: Fast path - try parsing without preprocessing first
    // This significantly improves performance for well-formed feeds
    let xml = parser.parseFromString(xmlString, 'application/xml');
    let hasParserError = xml.querySelector('parsererror');
    let hasItems = xml.querySelectorAll('item').length > 0;
    let hasEntries = xml.querySelectorAll('entry').length > 0;

    // If parsing failed or no content found, try with preprocessing
    if ((hasParserError && !hasItems && !hasEntries) || (!hasItems && !hasEntries)) {
      if (RssDebugUtils.isDebugEnabled()) {
        RssDebugUtils.log('RSS Parser: Initial parse failed or empty, applying preprocessing');
      }

      const cleanedXml = this.preProcessXml(xmlString, options.preprocessingHints);
      xml = parser.parseFromString(cleanedXml, 'application/xml');
      hasParserError = xml.querySelector('parsererror');
      hasItems = xml.querySelectorAll('item').length > 0;
      hasEntries = xml.querySelectorAll('entry').length > 0;
    }

    if (RssDebugUtils.isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`RSS Parse Info:
        - Parser errors detected: ${hasParserError ? 'Yes' : 'No'}
        - RSS items found: ${xml.querySelectorAll('item').length}
        - ATOM entries found: ${xml.querySelectorAll('entry').length}
      `);
    }

    if (hasParserError && !hasItems && !hasEntries) {
      const errorMsg = hasParserError.textContent || strings.ErrorParsingFeed;
      throw new Error(`${strings.ErrorParsingFeed}: ${errorMsg.substring(0, 200)}`);
    }

    const documentElement = xml.documentElement;
    const namespaces: Record<string, string> = {};

    if (documentElement && documentElement.attributes) {
      for (let i = 0; i < documentElement.attributes.length; i++) {
        const attr = documentElement.attributes[i];
        if (attr.name.startsWith('xmlns:')) {
          const prefix = attr.name.substring(6);
          namespaces[prefix] = attr.value;

          if (RssDebugUtils.isDebugEnabled()) {
            // eslint-disable-next-line no-console
            console.log(`RSS Parse: Found namespace ${prefix} = ${attr.value}`);
          }
        }
      }
    }

    let items: IRssItem[];
    if (xml.querySelector('feed')) {
      items = this.parseAtom(xml, options);
    } else {
      items = this.parseRss(xml, options);
    }

    return items;
  }
  
  private static preProcessXml(xml: string, hints?: IFeedParserOptions['preprocessingHints']): string {
    let result = xml;
    
    const addMissingNamespaces = hints?.addMissingNamespaces ?? true;
    const addXmlDeclaration = hints?.addMissingXmlDeclaration ?? true;
    
    if (result.includes('<html') && result.includes('</html>')) {
      if (RssDebugUtils.isDebugEnabled()) {
        RssDebugUtils.log('RSS Parser: Detected HTML instead of XML, attempting to extract RSS content');
      }
      
      const rssMatch = result.match(/<rss[^>]*>[\s\S]*?<\/rss>/i);
      if (rssMatch) {
        result = rssMatch[0];
      } else {
        const channelMatch = result.match(/<channel[^>]*>[\s\S]*?<\/channel>/i);
        if (channelMatch) {
          result = `<rss version="2.0">${channelMatch[0]}</rss>`;
        }
      }
    }
    
    // eslint-disable-next-line no-control-regex
    result = result.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    
    result = result.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
    
    if (addXmlDeclaration && !result.trim().startsWith('<?xml')) {
      result = '<?xml version="1.0" encoding="UTF-8"?>' + result;
    }
    
    result = result.replace(/<!\[CDATA\[((?!\]\]>).)*$/gs, '$&]]>');
    
    result = result.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gs, (match, content) => {
      if (content.includes(']]>')) {
        return `<![CDATA[${content.replace(/\]\]>/g, ']]&gt;')}]]>`;
      }
      return match;
    });
    
    const xmlDeclarations = result.match(/<\?xml[^>]*\?>/g);
    if (xmlDeclarations && xmlDeclarations.length > 1) {
      const firstDeclaration = xmlDeclarations[0];
      const firstIndex = result.indexOf(firstDeclaration);
      
      result = firstDeclaration + 
               result.substring(firstIndex + firstDeclaration.length)
                    .replace(/<\?xml[^>]*\?>/g, '');
    }
    
    if (!result.includes('<rss') && result.includes('<channel>')) {
      result = result.replace(/(<channel>)/i, '<rss version="2.0">$1');
      result = result.replace(/(<\/channel>)/i, '$1</rss>');
    }
    
    if (addMissingNamespaces) {
      const nsCheck = (ns: string) => !result.includes(`xmlns:${ns}=`) && 
                                      (result.includes(`<${ns}:`) || result.includes(`</${ns}:`));
                                      
      if (nsCheck('media')) {
        result = result.replace(/<rss([^>]*)>/, '<rss$1 xmlns:media="http://search.yahoo.com/mrss/">');
      }
      if (nsCheck('dc')) {
        result = result.replace(/<rss([^>]*)>/, '<rss$1 xmlns:dc="http://purl.org/dc/elements/1.1/">');
      }
      if (nsCheck('content')) {
        result = result.replace(/<rss([^>]*)>/, '<rss$1 xmlns:content="http://purl.org/rss/1.0/modules/content/">');
      }
      if (nsCheck('atom')) {
        result = result.replace(/<rss([^>]*)>/, '<rss$1 xmlns:atom="http://www.w3.org/2005/Atom">');
      }
    }
    
    result = result.replace(/<description>(?!\s*<!\[CDATA\[)([^<][\s\S]*?)<\/description>/g, 
                          '<description><![CDATA[$1]]></description>');
    
    return result;
  }
  
  /**
   * Safely extract text content from an XML node
   * Handles CDATA sections and decodes XML/HTML entities
   */
  private static safeExtractText(node: Element | null, decodeHtml: boolean = false): string {
    if (!node) return '';

    try {
      const content = node.textContent || '';

      // Strip any leftover CDATA markers (shouldn't be in textContent but be safe)
      const cdataPattern = /^(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?$/s;
      const match = content.match(cdataPattern);
      const rawText = (match ? match[1] : content).trim();

      // Decode entities - use appropriate decoder based on content type
      if (decodeHtml) {
        // For content that may contain HTML (description, content:encoded)
        return decodeEntitiesInHtml(rawText);
      } else {
        // For plain text fields (title, author, etc.)
        return decodeXmlText(rawText);
      }
    } catch {
      return '';
    }
  }

  /**
   * Normalize a date string to ISO format using robust date parsing
   * Handles RFC 822 (RSS), RFC 3339 (Atom), and various non-standard formats
   *
   * @param dateStr - Raw date string from feed
   * @returns Normalized ISO date string, or original string if parsing fails
   */
  private static normalizeDate(dateStr: string): string {
    if (!dateStr) return '';

    // Try to parse and normalize to ISO format
    const normalized = parseDateToIsoString(dateStr);
    if (normalized) {
      if (RssDebugUtils.isDebugEnabled()) {
        const result = parseDate(dateStr);
        RssDebugUtils.log(`Date parsed: "${dateStr}" → "${normalized}" (format: ${result.format})`);
      }
      return normalized;
    }

    // If parsing failed, return original string and log warning in debug mode
    if (RssDebugUtils.isDebugEnabled()) {
      RssDebugUtils.log(`Date parsing failed for: "${dateStr}", using original`);
    }
    return dateStr;
  }

  private static parseRss(xml: Document, options: IFeedParserOptions): IRssItem[] {
    const rssItems: IRssItem[] = [];
    const maxItems = options.maxItems && options.maxItems > 0 ? options.maxItems : Infinity;

    // Get item nodes using optimized selector strategy
    const itemNodes = this.getItemNodes(xml);

    if (RssDebugUtils.isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`Found ${itemNodes.length} RSS items in the feed`);
    }

    // Cache channel node lookup once for all items
    const channelNode = xml.querySelector('channel');

    // Process items with early termination (ST-003-08 performance optimization)
    for (let i = 0; i < itemNodes.length && rssItems.length < maxItems; i++) {
      const itemNode = itemNodes[i];
      try {
        let title = '';
        const titleNode = itemNode.querySelector('title') || 
                          itemNode.querySelector('heading') || 
                          itemNode.querySelector('headline');
        if (titleNode) {
          title = this.safeExtractText(titleNode);
        }
        
        // Link extraction
        let linkUrl = '';
        const linkNode = itemNode.querySelector('link');
        if (linkNode) {
          if (linkNode.hasAttribute('href')) {
            linkUrl = linkNode.getAttribute('href') || '';
          } else {
            linkUrl = this.safeExtractText(linkNode);
          }
        }
        
        // Publication date - extract and normalize using robust date parser (ST-003-05)
        let pubDate = '';
        const dateNode = itemNode.querySelector('pubDate') ||
                         itemNode.querySelector('dc\\:date') ||
                         itemNode.querySelector('date') ||
                         itemNode.querySelector('published');
        if (dateNode) {
          const rawDate = this.safeExtractText(dateNode);
          pubDate = this.normalizeDate(rawDate);
        }
        
        // Description extraction - use HTML-aware decoding for content fields
        const descNode = itemNode.querySelector('description') ||
                         itemNode.querySelector('summary') ||
                         itemNode.querySelector('content\\:encoded') ||
                         itemNode.querySelector('content');
        const descriptionText = descNode ? this.safeExtractText(descNode, true) : '';
        const cleanedDescription = cleanDescription(descriptionText);
        
        // Author extraction
        let author = '';
        const authorNode = itemNode.querySelector('author') || 
                          itemNode.querySelector('dc\\:creator') ||
                          itemNode.querySelector('creator');
        if (authorNode) {
          author = this.safeExtractText(authorNode);
        }
        
        // Image extraction using priority chain (ST-003-04)
        // channelNode is cached outside the loop for performance (ST-003-08)
        const imageOptions: ImageExtractionOptions = {
          fallbackImageUrl: options.fallbackImageUrl,
          channelElement: channelNode,
        };
        const extractedImage = extractImage(itemNode, imageOptions);

        // resolveImageUrl handles proxy unwrapping and UTM removal
        const finalImageUrl = extractedImage?.url
          ? (resolveImageUrl(extractedImage.url) || extractedImage.url)
          : options.fallbackImageUrl;
        
        // Extract categories
        const categories: string[] = [];
        itemNode.querySelectorAll('category').forEach(categoryNode => {
          const category = this.safeExtractText(categoryNode);
          if (category && !categories.includes(category)) {
            categories.push(category);
          }
        });
        
        // Source extraction
        let source = '';
        const sourceNode = itemNode.querySelector('source');
        if (sourceNode) {
          source = this.safeExtractText(sourceNode);
        }
        
        // Fallback for link URL
        if (!linkUrl) {
          const guidNode = itemNode.querySelector('guid') || 
                          itemNode.querySelector('id') ||
                          itemNode.querySelector('url');
          if (guidNode) {
            linkUrl = this.safeExtractText(guidNode);
          }
        }
        
        if (title || descriptionText) {
          rssItems.push({
            title: title,
            link: linkUrl,
            pubDate: pubDate,
            description: cleanedDescription,
            imageUrl: finalImageUrl,
            author: author || source || undefined,
            categories: categories.length > 0 ? categories : undefined,
            feedType: 'rss'
          });
        }
      } catch (error) {
        // Skip problematic items instead of failing the entire feed
        if (RssDebugUtils.isDebugEnabled()) {
          // eslint-disable-next-line no-console
          console.error(`Error processing RSS item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return rssItems;
  }

  /**
   * Get item nodes from XML document with optimized selector strategy (ST-003-08)
   * Uses the most common selector first for performance
   */
  private static getItemNodes(xml: Document): Element[] {
    // Try the most common selector first (fastest)
    let items = xml.querySelectorAll('item');
    if (items.length > 0) {
      return Array.from(items);
    }

    // Try RDF items (RSS 1.0)
    items = xml.querySelectorAll('rdf\\:RDF > item');
    if (items.length > 0) {
      return Array.from(items);
    }

    // Try more specific selectors
    const selectors = [
      'rss > channel > item',
      'channel > item',
      'rss > item'
    ];

    for (const selector of selectors) {
      try {
        items = xml.querySelectorAll(selector);
        if (items.length > 0) {
          return Array.from(items);
        }
      } catch {
        continue;
      }
    }

    // Last resort: find elements that look like items
    return Array.from(xml.querySelectorAll('*')).filter(el => {
      return (
        el.tagName.toLowerCase() === 'item' ||
        ((el.querySelector('title') || el.querySelector('heading')) &&
         (el.querySelector('link') || el.querySelector('guid')))
      );
    });
  }

  /**
   * Parse ATOM feed format
   */
  private static parseAtom(xml: Document, options: IFeedParserOptions): IRssItem[] {
    const atomItems: IRssItem[] = [];
    const maxItems = options.maxItems && options.maxItems > 0 ? options.maxItems : Infinity;

    const entryNodes = xml.querySelectorAll('entry');

    if (RssDebugUtils.isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`Found ${entryNodes.length} ATOM entries in the feed`);
    }

    // Cache feed element for all entries
    const feedElement = xml.querySelector('feed');

    // Process entries with early termination (ST-003-08 performance optimization)
    for (let i = 0; i < entryNodes.length && atomItems.length < maxItems; i++) {
      const entryNode = entryNodes[i];
      try {
        let title = '';
        const titleNode = entryNode.querySelector('title');
        if (titleNode) {
          title = this.safeExtractText(titleNode);
        }
        
        let linkUrl = '';
        const linkNode = entryNode.querySelector('link[rel="alternate"]') || 
                         entryNode.querySelector('link');
        if (linkNode) {
          linkUrl = linkNode.getAttribute('href') || '';
        }
        
        // Publication date - extract and normalize using robust date parser (ST-003-05)
        let pubDate = '';
        const dateNode = entryNode.querySelector('published') ||
                         entryNode.querySelector('updated') ||
                         entryNode.querySelector('issued');
        if (dateNode) {
          const rawDate = this.safeExtractText(dateNode);
          pubDate = this.normalizeDate(rawDate);
        }
        
        // Description/content extraction - use HTML-aware decoding
        let description = '';
        const contentNode = entryNode.querySelector('content') ||
                           entryNode.querySelector('summary');
        if (contentNode) {
          description = this.safeExtractText(contentNode, true);
        }
        const cleanedDescription = cleanDescription(description);
        
        let author = '';
        const authorNode = entryNode.querySelector('author name') ||
                          entryNode.querySelector('author');
        if (authorNode) {
          author = this.safeExtractText(authorNode);
        }
                           
        // Image extraction using priority chain (ST-003-04)
        // feedElement is cached outside the loop for performance (ST-003-08)
        const atomImageOptions: ImageExtractionOptions = {
          fallbackImageUrl: options.fallbackImageUrl,
          channelElement: feedElement,
        };
        const extractedImage = extractImage(entryNode, atomImageOptions);

        // resolveImageUrl handles proxy unwrapping and UTM removal
        const finalImageUrl = extractedImage?.url
          ? (resolveImageUrl(extractedImage.url) || extractedImage.url)
          : options.fallbackImageUrl;

        const categories: string[] = [];
        entryNode.querySelectorAll('category').forEach(categoryNode => {
          const term = categoryNode.getAttribute('term');
          const label = categoryNode.getAttribute('label') || term;
          if (label && !categories.includes(label)) {
            categories.push(label);
          }
        });

        if (title || description) {
          atomItems.push({
            title: title,
            link: linkUrl,
            pubDate: pubDate,
            description: cleanedDescription,
            imageUrl: finalImageUrl,
            author: author || undefined,
            categories: categories.length > 0 ? categories : undefined,
            feedType: 'atom'
          });
        }
      } catch (error) {
        if (RssDebugUtils.isDebugEnabled()) {
          // eslint-disable-next-line no-console
          console.error(`Error processing ATOM entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return atomItems;
  }
}
