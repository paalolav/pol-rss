import { IRssItem } from '../components/IRssItem';
import { cleanDescription, resolveImageUrl } from '../components/rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { isJsonFeed, parseJsonFeed } from './jsonFeedParser';
import { decodeXmlText, decodeEntitiesInHtml } from './entityDecoder';
import { extractImage, ImageExtractionOptions } from './imageExtractor';
import { parseDate, parseDateToIsoString } from './dateParser';

export interface IFeedParserOptions {
  fallbackImageUrl: string;
  maxItems?: number;
  enableDebug?: boolean;
  preprocessingHints?: {
    addMissingNamespaces?: boolean;
    fixUnclosedTags?: boolean;
    addMissingXmlDeclaration?: boolean;
    fixCdataSequences?: boolean;
  };
}

export class ImprovedFeedParser {
  public static parse(xmlString: string, options: IFeedParserOptions): IRssItem[] {
    if (!xmlString) {
      throw new Error("Empty feed content received");
    }

    if (options.enableDebug) {
      RssDebugUtils.setDebugMode(true);
    }

    // Check if content is JSON Feed format first
    if (isJsonFeed(xmlString)) {
      if (RssDebugUtils.isDebugEnabled()) {
        RssDebugUtils.log('RSS Parser: Detected JSON Feed format');
      }

      try {
        const items = parseJsonFeed(xmlString, {
          fallbackImageUrl: options.fallbackImageUrl,
          maxItems: options.maxItems,
        });

        if (RssDebugUtils.isDebugEnabled()) {
          // eslint-disable-next-line no-console
          console.log(`JSON Feed Parser found ${items.length} items`);
        }

        return items;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;
        throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
      }
    }

    // Process as XML feed (RSS/Atom)
    try {
      const cleanedXml = this.preProcessXml(xmlString, options.preprocessingHints);      
      const parser = new DOMParser();
      const xml = parser.parseFromString(cleanedXml, 'application/xml');
      const hasParserError = xml.querySelector('parsererror');
      const hasItems = xml.querySelectorAll('item').length > 0;
      const hasEntries = xml.querySelectorAll('entry').length > 0;
      
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
      
      if (RssDebugUtils.isDebugEnabled()) {
        // eslint-disable-next-line no-console
        console.log(`RSS Parser found ${items.length} items`);
        
        const withImages = items.filter(i => !!i.imageUrl).length;
        // eslint-disable-next-line no-console
        console.log(`RSS Items with images: ${withImages}/${items.length}`);
        
        // eslint-disable-next-line no-console
        console.log(RssDebugUtils.analyzeRssFeed(items, 'Feed analysis'));
      }
      
      return items;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;
      
      if (RssDebugUtils.isDebugEnabled()) {
        // eslint-disable-next-line no-console
        console.error(`RSS Parse Error: ${errorMessage}`);
      }
      
      throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
    }
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
    
    let itemNodes: Element[] = [];
    
    const itemSelectors = [
      'item',
      'rss > channel > item',
      'rdf\\:RDF > item',
      'channel > item',
      'feed > entry',
      'rss > item'
    ];
    
    for (const selector of itemSelectors) {
      try {
        const nodes = Array.from(xml.querySelectorAll(selector));
        if (nodes.length > 0) {
          itemNodes = nodes;
          break;
        }
      } catch {
        // Ignore selector errors and try the next one
        continue;
      }
    }
    
    if (itemNodes.length === 0) {
      const possibleItems = Array.from(xml.querySelectorAll('*'))
        .filter(el => {
          return (
            (el.querySelector('title') || el.querySelector('heading')) &&
            (el.querySelector('link') || el.querySelector('guid'))
          );
        });
        
      if (possibleItems.length > 0) {
        itemNodes = possibleItems;
      }
    }
    
    if (RssDebugUtils.isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`Found ${itemNodes.length} RSS items in the feed`);
    }
    
    if (options.maxItems && options.maxItems > 0 && itemNodes.length > options.maxItems) {
      itemNodes = itemNodes.slice(0, options.maxItems);
    }
    
    itemNodes.forEach(itemNode => {
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
        const channelNode = itemNode.closest('channel') || xml.querySelector('channel');
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
    });

    return rssItems;
  }

  /**
   * Parse ATOM feed format
   */
  private static parseAtom(xml: Document, options: IFeedParserOptions): IRssItem[] {
    const atomItems: IRssItem[] = [];
    
    const entryNodes = Array.from(xml.querySelectorAll('entry'));
    
    if (RssDebugUtils.isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`Found ${entryNodes.length} ATOM entries in the feed`);
    }

    entryNodes.forEach(entryNode => {
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
        const feedElement = xml.querySelector('feed');
        const atomImageOptions: ImageExtractionOptions = {
          fallbackImageUrl: options.fallbackImageUrl,
          channelElement: feedElement, // Atom uses <feed> as channel equivalent
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
    });

    return atomItems;
  }
}
