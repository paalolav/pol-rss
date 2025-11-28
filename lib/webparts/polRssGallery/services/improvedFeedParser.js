import { cleanDescription, resolveImageUrl } from '../components/rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { isJsonFeed, parseJsonFeed } from './jsonFeedParser';
import { decodeXmlText, decodeEntitiesInHtml } from './entityDecoder';
import { extractImage } from './imageExtractor';
import { parseDate, parseDateToIsoString } from './dateParser';
import { attemptRecovery, needsRecovery, validateRecoveredContent, extractItemsAlternative, } from './feedRecovery';
export class ImprovedFeedParser {
    /**
     * Parse a feed and return items (backwards-compatible method)
     * Uses recovery mode by default to handle malformed feeds
     */
    static parse(xmlString, options) {
        const result = this.parseWithRecovery(xmlString, options);
        return result.items;
    }
    /**
     * Parse a feed with full recovery information (ST-003-07)
     * Returns detailed information about any recovery actions taken
     */
    static parseWithRecovery(xmlString, options) {
        const result = {
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;
                throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
            }
        }
        // Check if recovery might be needed before processing
        let contentToProcess = xmlString;
        let recoveryInfo;
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
        }
        catch (error) {
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
                        }
                        catch (recoveryError) {
                            // Recovery parsing also failed, continue to alternative extraction
                            if (RssDebugUtils.isDebugEnabled()) {
                                RssDebugUtils.log(`RSS Parser: Recovery parse also failed: ${recoveryError instanceof Error ? recoveryError.message : 'Unknown'}`);
                            }
                        }
                    }
                    else {
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
                        feedType: 'rss',
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
    static parseXmlContent(xmlString, options) {
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
        const namespaces = {};
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
        let items;
        if (xml.querySelector('feed')) {
            items = this.parseAtom(xml, options);
        }
        else {
            items = this.parseRss(xml, options);
        }
        return items;
    }
    static preProcessXml(xml, hints) {
        var _a, _b, _c, _d;
        let result = xml;
        const addMissingNamespaces = (_a = hints === null || hints === void 0 ? void 0 : hints.addMissingNamespaces) !== null && _a !== void 0 ? _a : true;
        const addXmlDeclaration = (_b = hints === null || hints === void 0 ? void 0 : hints.addMissingXmlDeclaration) !== null && _b !== void 0 ? _b : true;
        // Check if feed has an encoding declaration and preserve it
        const existingDeclaration = result.match(/<\?xml[^>]*\?>/);
        const existingEncoding = (_d = (_c = existingDeclaration === null || existingDeclaration === void 0 ? void 0 : existingDeclaration[0]) === null || _c === void 0 ? void 0 : _c.match(/encoding=["']([^"']+)["']/)) === null || _d === void 0 ? void 0 : _d[1];
        // Fix ISO-8859-1 encoding issues (common for Norwegian feeds)
        // If the feed declares ISO-8859-1 but was decoded as UTF-8, we may see garbled characters
        if ((existingEncoding === null || existingEncoding === void 0 ? void 0 : existingEncoding.toLowerCase()) === 'iso-8859-1' ||
            (existingEncoding === null || existingEncoding === void 0 ? void 0 : existingEncoding.toLowerCase()) === 'iso_8859-1' ||
            (existingEncoding === null || existingEncoding === void 0 ? void 0 : existingEncoding.toLowerCase()) === 'latin1' ||
            (existingEncoding === null || existingEncoding === void 0 ? void 0 : existingEncoding.toLowerCase()) === 'latin-1') {
            // Try to detect if content was incorrectly decoded as UTF-8
            // Common pattern: Ã¦ instead of æ, Ã¸ instead of ø, Ã¥ instead of å
            if (result.includes('Ã¦') || result.includes('Ã¸') || result.includes('Ã¥') ||
                result.includes('Ã†') || result.includes('Ã˜') || result.includes('Ã…')) {
                if (RssDebugUtils.isDebugEnabled()) {
                    RssDebugUtils.log('RSS Parser: Detected double-encoded ISO-8859-1 content, attempting fix');
                }
                // Fix common Norwegian character double-encoding issues
                result = result
                    .replace(/Ã¦/g, 'æ').replace(/Ã†/g, 'Æ')
                    .replace(/Ã¸/g, 'ø').replace(/Ã˜/g, 'Ø')
                    .replace(/Ã¥/g, 'å').replace(/Ã…/g, 'Å')
                    .replace(/Ã©/g, 'é').replace(/Ã‰/g, 'É')
                    .replace(/Ã¨/g, 'è').replace(/Ã ̈/g, 'È')
                    .replace(/Ã¤/g, 'ä').replace(/Ã„/g, 'Ä')
                    .replace(/Ã¶/g, 'ö').replace(/Ã–/g, 'Ö')
                    .replace(/Ã¼/g, 'ü').replace(/Ãœ/g, 'Ü')
                    .replace(/Ã±/g, 'ñ').replace(/Ã'/g, 'Ñ');
            }
        }
        if (result.includes('<html') && result.includes('</html>')) {
            if (RssDebugUtils.isDebugEnabled()) {
                RssDebugUtils.log('RSS Parser: Detected HTML instead of XML, attempting to extract RSS content');
            }
            const rssMatch = result.match(/<rss[^>]*>[\s\S]*?<\/rss>/i);
            if (rssMatch) {
                result = rssMatch[0];
            }
            else {
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
            // Only add UTF-8 declaration if no encoding was detected
            result = '<?xml version="1.0" encoding="UTF-8"?>' + result;
        }
        else if (existingEncoding && existingEncoding.toLowerCase() !== 'utf-8') {
            // For non-UTF-8 encodings that need to work with DOMParser (which expects UTF-8),
            // update the declaration to UTF-8 after we've fixed the content
            result = result.replace(/<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8"?>');
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
            const nsCheck = (ns) => !result.includes(`xmlns:${ns}=`) &&
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
        result = result.replace(/<description>(?!\s*<!\[CDATA\[)([^<][\s\S]*?)<\/description>/g, '<description><![CDATA[$1]]></description>');
        return result;
    }
    /**
     * Safely extract text content from an XML node
     * Handles CDATA sections and decodes XML/HTML entities
     */
    static safeExtractText(node, decodeHtml = false) {
        if (!node)
            return '';
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
            }
            else {
                // For plain text fields (title, author, etc.)
                return decodeXmlText(rawText);
            }
        }
        catch (_a) {
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
    static normalizeDate(dateStr) {
        if (!dateStr)
            return '';
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
    static parseRss(xml, options) {
        const rssItems = [];
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
                    }
                    else {
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
                const imageOptions = {
                    fallbackImageUrl: options.fallbackImageUrl,
                    channelElement: channelNode,
                };
                const extractedImage = extractImage(itemNode, imageOptions);
                // resolveImageUrl handles proxy unwrapping and UTM removal
                const finalImageUrl = (extractedImage === null || extractedImage === void 0 ? void 0 : extractedImage.url)
                    ? (resolveImageUrl(extractedImage.url) || extractedImage.url)
                    : options.fallbackImageUrl;
                // Extract categories
                const categories = [];
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
            }
            catch (error) {
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
    static getItemNodes(xml) {
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
            }
            catch (_a) {
                continue;
            }
        }
        // Last resort: find elements that look like items
        return Array.from(xml.querySelectorAll('*')).filter(el => {
            return (el.tagName.toLowerCase() === 'item' ||
                ((el.querySelector('title') || el.querySelector('heading')) &&
                    (el.querySelector('link') || el.querySelector('guid'))));
        });
    }
    /**
     * Parse ATOM feed format
     */
    static parseAtom(xml, options) {
        const atomItems = [];
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
                const atomImageOptions = {
                    fallbackImageUrl: options.fallbackImageUrl,
                    channelElement: feedElement,
                };
                const extractedImage = extractImage(entryNode, atomImageOptions);
                // resolveImageUrl handles proxy unwrapping and UTM removal
                const finalImageUrl = (extractedImage === null || extractedImage === void 0 ? void 0 : extractedImage.url)
                    ? (resolveImageUrl(extractedImage.url) || extractedImage.url)
                    : options.fallbackImageUrl;
                const categories = [];
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
            }
            catch (error) {
                if (RssDebugUtils.isDebugEnabled()) {
                    // eslint-disable-next-line no-console
                    console.error(`Error processing ATOM entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }
        return atomItems;
    }
}
//# sourceMappingURL=improvedFeedParser.js.map