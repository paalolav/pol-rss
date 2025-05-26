import { cleanDescription, resolveImageUrl, findImage } from '../components/rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import { RssDebugUtils } from '../utils/rssDebugUtils';
/**
 * Improved Feed parser service to handle both RSS and ATOM feeds
 * with better support for various feed formats including Meltwater
 */
export class ImprovedFeedParser {
    /**
     * Parse XML feed content (RSS or ATOM) and convert to IRssItem array
     */
    static parse(xmlString, options) {
        if (!xmlString) {
            throw new Error("Empty feed content received");
        }
        // Enable debug mode if requested
        if (options.enableDebug) {
            RssDebugUtils.setDebugMode(true);
        }
        try {
            // Pre-process the XML string to handle common issues
            const cleanedXml = this.preProcessXml(xmlString, options.preprocessingHints);
            const parser = new DOMParser();
            const xml = parser.parseFromString(cleanedXml, 'application/xml');
            // Debug info for parser errors
            const hasParserError = xml.querySelector('parsererror');
            const hasItems = xml.querySelectorAll('item').length > 0;
            const hasEntries = xml.querySelectorAll('entry').length > 0;
            // Debug logging if enabled
            if (RssDebugUtils.isDebugEnabled()) {
                // eslint-disable-next-line no-console
                console.log(`RSS Parse Info:
          - Parser errors detected: ${hasParserError ? 'Yes' : 'No'}
          - RSS items found: ${xml.querySelectorAll('item').length}
          - ATOM entries found: ${xml.querySelectorAll('entry').length}
        `);
            }
            if (hasParserError && !hasItems && !hasEntries) {
                // Try to extract the error message for better debugging
                const errorMsg = hasParserError.textContent || strings.ErrorParsingFeed;
                throw new Error(`${strings.ErrorParsingFeed}: ${errorMsg.substring(0, 200)}`);
            }
            // Log namespaces for debugging
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
            // Detect feed type
            let items;
            if (xml.querySelector('feed')) {
                items = this.parseAtom(xml, options);
            }
            else {
                items = this.parseRss(xml, options);
            }
            // Debug log the results
            if (RssDebugUtils.isDebugEnabled()) {
                // eslint-disable-next-line no-console
                console.log(`RSS Parser found ${items.length} items`);
                // Analyze how many items have images
                const withImages = items.filter(i => !!i.imageUrl).length;
                // eslint-disable-next-line no-console
                console.log(`RSS Items with images: ${withImages}/${items.length}`);
                // Log detailed analysis
                // eslint-disable-next-line no-console
                console.log(RssDebugUtils.analyzeRssFeed(items, 'Feed analysis'));
            }
            return items;
        }
        catch (error) {
            // Provide more context about the error
            const errorMessage = error instanceof Error ? error.message : strings.ErrorParsingFeed;
            if (RssDebugUtils.isDebugEnabled()) {
                // eslint-disable-next-line no-console
                console.error(`RSS Parse Error: ${errorMessage}`);
            }
            throw new Error(`${strings.ErrorParsingFeed}: ${errorMessage}`);
        }
    }
    /**
     * Pre-process XML string to fix common issues in malformed feeds
     */
    static preProcessXml(xml, hints) {
        var _a, _b;
        let result = xml;
        // Apply hints if provided
        const addMissingNamespaces = (_a = hints === null || hints === void 0 ? void 0 : hints.addMissingNamespaces) !== null && _a !== void 0 ? _a : true;
        const addXmlDeclaration = (_b = hints === null || hints === void 0 ? void 0 : hints.addMissingXmlDeclaration) !== null && _b !== void 0 ? _b : true;
        // Detect if the content is actually an HTML page instead of XML/RSS
        if (result.includes('<html') && result.includes('</html>')) {
            if (RssDebugUtils.isDebugEnabled()) {
                RssDebugUtils.log('RSS Parser: Detected HTML instead of XML, attempting to extract RSS content');
            }
            // Try to extract feed data from HTML (for feeds embedded in HTML pages)
            const rssMatch = result.match(/<rss[^>]*>[\s\S]*?<\/rss>/i);
            if (rssMatch) {
                result = rssMatch[0];
            }
            else {
                // If no RSS tag found, look for channel section
                const channelMatch = result.match(/<channel[^>]*>[\s\S]*?<\/channel>/i);
                if (channelMatch) {
                    result = `<rss version="2.0">${channelMatch[0]}</rss>`;
                }
            }
        }
        // IMPORTANT: Take a minimal approach to fixing feeds to avoid breaking structure
        // Step 1: Fix basics (XML declaration, entities, CDATA)
        // Replace common control characters that cause XML parsing to fail
        // eslint-disable-next-line no-control-regex
        result = result.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
        // Make sure all & are properly escaped as &amp; if not in existing entities
        result = result.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
        // Fix XML declaration if needed
        if (addXmlDeclaration && !result.trim().startsWith('<?xml')) {
            result = '<?xml version="1.0" encoding="UTF-8"?>' + result;
        }
        // Fix unclosed CDATA sections
        result = result.replace(/<!\[CDATA\[((?!\]\]>).)*$/gs, '$&]]>');
        // Fix invalid CDATA - replace ]]> inside CDATA with ]]&gt;
        result = result.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gs, (match, content) => {
            if (content.includes(']]>')) {
                return `<![CDATA[${content.replace(/\]\]>/g, ']]&gt;')}]]>`;
            }
            return match;
        });
        // Deal with XML prolog issues that might occur with certain feeds (like Nettavisen)
        // Sometimes feeds have multiple XML declarations or they're not at the beginning
        const xmlDeclarations = result.match(/<\?xml[^>]*\?>/g);
        if (xmlDeclarations && xmlDeclarations.length > 1) {
            // Keep only the first XML declaration and remove others
            const firstDeclaration = xmlDeclarations[0];
            const firstIndex = result.indexOf(firstDeclaration);
            // Create a new string with only one XML declaration
            result = firstDeclaration +
                result.substring(firstIndex + firstDeclaration.length)
                    .replace(/<\?xml[^>]*\?>/g, '');
        }
        // Step 2: Handle incomplete RSS structure
        // If we have a channel without rss wrapper, add the rss tags
        if (!result.includes('<rss') && result.includes('<channel>')) {
            result = result.replace(/(<channel>)/i, '<rss version="2.0">$1');
            result = result.replace(/(<\/channel>)/i, '$1</rss>');
        }
        // Step 3: Add missing namespaces if needed
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
        // Step 4: Carefully fix content in description tags (without breaking the XML structure)
        // Always wrap description text in CDATA (but don't mess with existing CDATA)
        result = result.replace(/<description>(?!\s*<!\[CDATA\[)([^<][\s\S]*?)<\/description>/g, '<description><![CDATA[$1]]></description>');
        // IMPORTANT: Don't try to fix HTML tags or structure anymore - let the browser handle that
        // Our aggressive tag fixing was breaking the RSS structure
        return result;
    }
    // No additional cleaning functions - we're taking a minimal approach to avoid breaking XML structure
    /**
     * Helper method to safely extract text from an element
     * Handles CDATA sections and common XML quirks
     */
    static safeExtractText(node) {
        if (!node)
            return '';
        try {
            // Get the raw text content
            const content = node.textContent || '';
            // Remove CDATA wrappers if present
            const cdataPattern = /^(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?$/s;
            const match = content.match(cdataPattern);
            return (match ? match[1] : content).trim();
        }
        catch (_a) {
            return '';
        }
    }
    /**
     * Parse RSS feed format
     */
    static parseRss(xml, options) {
        const rssItems = [];
        // Try multiple selectors to find items in various RSS feed structures
        let itemNodes = [];
        // Try each selector in order of specificity, using the first one that returns results
        const itemSelectors = [
            'item',
            'rss > channel > item',
            'rdf\\:RDF > item',
            'channel > item',
            'feed > entry',
            'rss > item'
        ];
        // Try each selector until we find items
        for (const selector of itemSelectors) {
            try {
                const nodes = Array.from(xml.querySelectorAll(selector));
                if (nodes.length > 0) {
                    itemNodes = nodes;
                    break;
                }
            }
            catch (_a) {
                // Ignore selector errors and try the next one
                continue;
            }
        }
        // If still no items found, try a more generic approach
        if (itemNodes.length === 0) {
            // Look for elements that look like news items
            const possibleItems = Array.from(xml.querySelectorAll('*'))
                .filter(el => {
                // An element is likely an RSS item if it has title and link/guid children
                return ((el.querySelector('title') || el.querySelector('heading')) &&
                    (el.querySelector('link') || el.querySelector('guid')));
            });
            if (possibleItems.length > 0) {
                itemNodes = possibleItems;
            }
        }
        if (RssDebugUtils.isDebugEnabled()) {
            // eslint-disable-next-line no-console
            console.log(`Found ${itemNodes.length} RSS items in the feed`);
        }
        // Apply maximum items limit if specified
        if (options.maxItems && options.maxItems > 0 && itemNodes.length > options.maxItems) {
            itemNodes = itemNodes.slice(0, options.maxItems);
        }
        itemNodes.forEach(itemNode => {
            try {
                // --- Extract item properties with robustness ---
                // Title extraction
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
                // Publication date
                let pubDate = '';
                const dateNode = itemNode.querySelector('pubDate') ||
                    itemNode.querySelector('dc\\:date') ||
                    itemNode.querySelector('date') ||
                    itemNode.querySelector('published');
                if (dateNode) {
                    pubDate = this.safeExtractText(dateNode);
                }
                // Description extraction
                const descNode = itemNode.querySelector('description') ||
                    itemNode.querySelector('summary') ||
                    itemNode.querySelector('content\\:encoded') ||
                    itemNode.querySelector('content');
                const descriptionText = descNode ? this.safeExtractText(descNode) : '';
                const cleanedDescription = cleanDescription(descriptionText);
                // Author extraction
                let author = '';
                const authorNode = itemNode.querySelector('author') ||
                    itemNode.querySelector('dc\\:creator') ||
                    itemNode.querySelector('creator');
                if (authorNode) {
                    author = this.safeExtractText(authorNode);
                }
                // Image extraction
                let rawImageUrl = findImage(itemNode);
                // If no image found at item level, try channel level as fallback
                if (!rawImageUrl) {
                    const channelNode = itemNode.closest('channel');
                    if (channelNode) {
                        rawImageUrl = findImage(channelNode);
                    }
                }
                const finalImageUrl = rawImageUrl ? resolveImageUrl(rawImageUrl) || rawImageUrl : options.fallbackImageUrl;
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
                // Only add items with at least a title (don't add completely empty items)
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
        });
        return rssItems;
    }
    /**
     * Parse ATOM feed format
     */
    static parseAtom(xml, options) {
        const atomItems = [];
        const entryNodes = Array.from(xml.querySelectorAll('entry'));
        if (RssDebugUtils.isDebugEnabled()) {
            // eslint-disable-next-line no-console
            console.log(`Found ${entryNodes.length} ATOM entries in the feed`);
        }
        entryNodes.forEach(entryNode => {
            try {
                // Title extraction
                let title = '';
                const titleNode = entryNode.querySelector('title');
                if (titleNode) {
                    title = this.safeExtractText(titleNode);
                }
                // Link extraction
                let linkUrl = '';
                const linkNode = entryNode.querySelector('link[rel="alternate"]') ||
                    entryNode.querySelector('link');
                if (linkNode) {
                    linkUrl = linkNode.getAttribute('href') || '';
                }
                // Date extraction
                let pubDate = '';
                const dateNode = entryNode.querySelector('published') ||
                    entryNode.querySelector('updated') ||
                    entryNode.querySelector('issued');
                if (dateNode) {
                    pubDate = this.safeExtractText(dateNode);
                }
                // Content extraction
                let description = '';
                const contentNode = entryNode.querySelector('content') ||
                    entryNode.querySelector('summary');
                if (contentNode) {
                    description = this.safeExtractText(contentNode);
                }
                const cleanedDescription = cleanDescription(description);
                // Author extraction
                let author = '';
                const authorNode = entryNode.querySelector('author name') ||
                    entryNode.querySelector('author');
                if (authorNode) {
                    author = this.safeExtractText(authorNode);
                }
                // Image extraction
                let rawImageUrl = findImage(entryNode);
                // Alternative image finding approaches
                if (!rawImageUrl) {
                    const mediaContent = entryNode.querySelector('media\\:content[type^="image"], content[type^="image"]');
                    if (mediaContent) {
                        rawImageUrl = mediaContent.getAttribute('url') || undefined;
                    }
                    else if (description) {
                        // Try to extract image from content HTML
                        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (imgMatch === null || imgMatch === void 0 ? void 0 : imgMatch[1]) {
                            rawImageUrl = imgMatch[1];
                        }
                    }
                }
                // Extract categories
                const categories = [];
                entryNode.querySelectorAll('category').forEach(categoryNode => {
                    const term = categoryNode.getAttribute('term');
                    const label = categoryNode.getAttribute('label') || term;
                    if (label && !categories.includes(label)) {
                        categories.push(label);
                    }
                });
                const finalImageUrl = rawImageUrl ? (resolveImageUrl(rawImageUrl) || rawImageUrl) : options.fallbackImageUrl;
                // Only add items with at least a title or content
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
                // Skip problematic items
                if (RssDebugUtils.isDebugEnabled()) {
                    // eslint-disable-next-line no-console
                    console.error(`Error processing ATOM entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        return atomItems;
    }
}
//# sourceMappingURL=improvedFeedParser.js.map