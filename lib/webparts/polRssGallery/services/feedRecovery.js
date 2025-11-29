/**
 * Feed Recovery Service (ST-003-07)
 *
 * Implements recovery strategies to extract as much content as possible
 * from malformed feeds. When a feed fails to parse normally, this service
 * applies various fixes to salvage the content.
 */
import { RssDebugUtils } from '../utils/rssDebugUtils';
/**
 * Common XML tags that should have closing tags in feeds
 */
const SELF_CLOSING_TAGS = ['br', 'hr', 'img', 'link', 'meta', 'input', 'source', 'track', 'wbr'];
/**
 * Tags commonly found in RSS/Atom feeds
 */
const FEED_TAGS = [
    'title', 'link', 'description', 'item', 'entry', 'channel', 'feed',
    'pubDate', 'published', 'updated', 'author', 'category', 'guid', 'id',
    'content', 'summary', 'enclosure', 'source', 'image', 'url'
];
/**
 * Default order of recovery strategies
 */
const DEFAULT_STRATEGIES = [
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
/**
 * Fix unclosed or improperly closed XML tags
 */
function fixUnclosedTags(xml) {
    let content = xml;
    let fixes = 0;
    const tagStack = [];
    // Track opened tags
    const tagRegex = /<(\/?)(\w+)(?:\s[^>]*)?>/g;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
        const isClosing = match[1] === '/';
        const tagName = match[2].toLowerCase();
        if (SELF_CLOSING_TAGS.includes(tagName))
            continue;
        if (!isClosing) {
            tagStack.push(tagName);
        }
        else {
            // Find and remove matching opening tag
            const lastIndex = tagStack.lastIndexOf(tagName);
            if (lastIndex !== -1) {
                tagStack.splice(lastIndex, 1);
            }
        }
    }
    // Add missing closing tags for feed-relevant tags
    for (const tag of tagStack.reverse()) {
        if (FEED_TAGS.includes(tag)) {
            // Find where to insert the closing tag (before next sibling or parent close)
            const closeTag = `</${tag}>`;
            if (!content.includes(closeTag) || content.lastIndexOf(`<${tag}`) > content.lastIndexOf(closeTag)) {
                // Simple heuristic: add before the parent's closing tag or at end
                const parentTags = ['item', 'entry', 'channel', 'feed', 'rss'];
                let inserted = false;
                for (const parent of parentTags) {
                    const parentClose = `</${parent}>`;
                    const lastParentClose = content.lastIndexOf(parentClose);
                    if (lastParentClose !== -1) {
                        content = content.slice(0, lastParentClose) + closeTag + content.slice(lastParentClose);
                        fixes++;
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    content += closeTag;
                    fixes++;
                }
            }
        }
    }
    // Fix common unclosed tag patterns: <title>Text (missing </title>)
    for (const tag of FEED_TAGS) {
        const unclosedPattern = new RegExp(`<${tag}([^>]*)>([^<]*?)(?=<(?!/${tag}))`, 'gi');
        content = content.replace(unclosedPattern, (match, attrs, inner, offset, str) => {
            // Check if there's a closing tag after this
            const after = str.slice(offset + match.length);
            if (!after.includes(`</${tag}>`)) {
                fixes++;
                return `<${tag}${attrs}>${inner}</${tag}>`;
            }
            return match;
        });
    }
    return { content, fixes };
}
/**
 * Fix bad character encoding issues
 */
function fixBadEncoding(xml) {
    let content = xml;
    let fixes = 0;
    // Fix UTF-8 BOM
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        fixes++;
    }
    // Fix common mojibake patterns (UTF-8 interpreted as Latin-1)
    const mojibakePatterns = [
        [/Ã¦/g, 'æ'],
        [/Ã¸/g, 'ø'],
        [/Ã¥/g, 'å'],
        [/Ã†/g, 'Æ'],
        [/Ã˜/g, 'Ø'],
        [/Ã…/g, 'Å'],
        [/Ã©/g, 'é'],
        [/Ã¨/g, 'è'],
        [/Ã«/g, 'ë'],
        [/Ã¼/g, 'ü'],
        [/Ã¶/g, 'ö'],
        [/Ã¤/g, 'ä'],
        [/â€"/g, '\u2013'], // en-dash –
        [/â€"/g, '\u2014'], // em-dash —
        [/â€œ/g, '\u201C'], // left double quote "
        [/â€/g, '\u201D'], // right double quote "
        [/â€˜/g, '\u2018'], // left single quote '
        [/â€™/g, '\u2019'], // right single quote '
        [/â€¦/g, '\u2026'], // ellipsis …
    ];
    for (const [pattern, replacement] of mojibakePatterns) {
        const beforeLength = content.length;
        content = content.replace(pattern, replacement);
        if (content.length !== beforeLength) {
            fixes++;
        }
    }
    // Fix incorrectly declared encoding
    content = content.replace(/encoding\s*=\s*["'](?:iso-8859-1|latin-?1|windows-1252)["']/gi, 'encoding="UTF-8"');
    return { content, fixes };
}
/**
 * Add missing XML namespace declarations
 */
function fixMissingNamespaces(xml) {
    let content = xml;
    let fixes = 0;
    const namespaceMap = {
        'media': 'http://search.yahoo.com/mrss/',
        'dc': 'http://purl.org/dc/elements/1.1/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'atom': 'http://www.w3.org/2005/Atom',
        'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'sy': 'http://purl.org/rss/1.0/modules/syndication/',
        'slash': 'http://purl.org/rss/1.0/modules/slash/',
        'wfw': 'http://wellformedweb.org/CommentAPI/',
    };
    for (const [prefix, uri] of Object.entries(namespaceMap)) {
        const hasUsage = new RegExp(`<${prefix}:|</${prefix}:`, 'i').test(content);
        const hasDeclaration = new RegExp(`xmlns:${prefix}\\s*=`, 'i').test(content);
        if (hasUsage && !hasDeclaration) {
            // Add namespace to rss or feed element
            const rssMatch = content.match(/<(rss|feed)([^>]*?)>/);
            if (rssMatch) {
                const [fullMatch, tagName, attrs] = rssMatch;
                const newAttrs = `${attrs} xmlns:${prefix}="${uri}"`;
                content = content.replace(fullMatch, `<${tagName}${newAttrs}>`);
                fixes++;
            }
        }
    }
    return { content, fixes };
}
/**
 * Strip invalid XML characters and sequences
 * IMPORTANT: Preserves CDATA sections - content inside CDATA should not be modified
 */
function stripInvalidXml(xml) {
    let fixes = 0;
    // Extract CDATA sections and replace with placeholders
    const cdataPlaceholders = [];
    let content = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (match) => {
        const placeholder = `__CDATA_PLACEHOLDER_${cdataPlaceholders.length}__`;
        cdataPlaceholders.push(match);
        return placeholder;
    });
    // Remove control characters (except tab, newline, carriage return)
    const beforeCtrl = content.length;
    // Using Unicode escapes for control character ranges
    // eslint-disable-next-line no-control-regex
    content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (content.length !== beforeCtrl)
        fixes++;
    // Remove invalid XML 1.0 characters
    const beforeInvalid = content.length;
    content = content.replace(/[\uFFFE\uFFFF]/g, '');
    if (content.length !== beforeInvalid)
        fixes++;
    // Fix unescaped ampersands (but not already escaped ones)
    // Only apply to non-CDATA content
    const beforeAmp = content;
    content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/gi, '&amp;');
    if (content !== beforeAmp)
        fixes++;
    // Fix unescaped less-than in text content (outside tags)
    // This is tricky - only fix obvious cases like "a < b" in text
    const beforeLt = content;
    content = content.replace(/>([^<]*)<([^a-zA-Z/!?])/g, '>$1&lt;$2');
    if (content !== beforeLt)
        fixes++;
    // Restore CDATA sections
    cdataPlaceholders.forEach((cdata, i) => {
        content = content.replace(`__CDATA_PLACEHOLDER_${i}__`, cdata);
    });
    return { content, fixes };
}
/**
 * Extract RSS/Atom content from HTML wrapper
 */
function extractFromHtml(xml) {
    let content = xml;
    let fixes = 0;
    // Check if wrapped in HTML
    if (content.includes('<html') || content.includes('<HTML')) {
        // Try to extract RSS feed
        const rssMatch = content.match(/<rss[^>]*>[\s\S]*<\/rss>/i);
        if (rssMatch) {
            content = rssMatch[0];
            fixes++;
        }
        else {
            // Try to extract Atom feed
            const atomMatch = content.match(/<feed[^>]*>[\s\S]*<\/feed>/i);
            if (atomMatch) {
                content = atomMatch[0];
                fixes++;
            }
            else {
                // Try to extract channel content
                const channelMatch = content.match(/<channel[^>]*>[\s\S]*<\/channel>/i);
                if (channelMatch) {
                    content = `<?xml version="1.0"?><rss version="2.0">${channelMatch[0]}</rss>`;
                    fixes++;
                }
            }
        }
    }
    // Remove HTML doctype if present before XML
    if (content.match(/<!DOCTYPE\s+html/i)) {
        content = content.replace(/<!DOCTYPE\s+html[^>]*>/gi, '');
        fixes++;
    }
    return { content, fixes };
}
/**
 * Fix broken CDATA sections
 */
function fixBrokenCdata(xml) {
    let content = xml;
    let fixes = 0;
    // Fix unclosed CDATA sections
    const cdataOpens = (content.match(/<!\[CDATA\[/g) || []).length;
    const cdataCloses = (content.match(/\]\]>/g) || []).length;
    if (cdataOpens > cdataCloses) {
        // Add missing closing ]]> before next tag or end
        for (let i = 0; i < cdataOpens - cdataCloses; i++) {
            // Find unclosed CDATA
            const unclosedMatch = content.match(/<!\[CDATA\[(?:(?!\]\]>).)*$/s);
            if (unclosedMatch) {
                const index = unclosedMatch.index + unclosedMatch[0].length;
                content = content.slice(0, index) + ']]>' + content.slice(index);
                fixes++;
            }
        }
    }
    // Fix nested ]]> inside CDATA (escape it)
    content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (match, inner) => {
        // Check for nested ]]> (excluding the closing one)
        const innerContent = inner.replace(/\]\]>/g, ']]&gt;');
        if (innerContent !== inner) {
            fixes++;
            return `<![CDATA[${innerContent}]]>`;
        }
        return match;
    });
    // Fix CDATA with extra opening
    content = content.replace(/<!\[CDATA\[\s*<!\[CDATA\[/g, '<![CDATA[');
    return { content, fixes };
}
/**
 * Remove control characters that break XML parsing
 */
function removeControlCharacters(xml) {
    let content = xml;
    const originalLength = content.length;
    // Remove NULL bytes
    // eslint-disable-next-line no-control-regex
    content = content.replace(/\x00/g, '');
    // Remove other control characters except tab, newline, carriage return
    // eslint-disable-next-line no-control-regex
    content = content.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, '');
    const fixes = originalLength !== content.length ? 1 : 0;
    return { content, fixes };
}
/**
 * Fix duplicate XML declarations
 */
function fixDuplicateDeclarations(xml) {
    let content = xml;
    let fixes = 0;
    const declarations = content.match(/<\?xml[^?]*\?>/g) || [];
    if (declarations.length > 1) {
        // Keep only the first declaration
        const first = declarations[0];
        content = first + content.replace(/<\?xml[^?]*\?>/g, '');
        fixes = declarations.length - 1;
    }
    return { content, fixes };
}
/**
 * Fix malformed attribute values
 */
function fixMalformedAttributes(xml) {
    let content = xml;
    let fixes = 0;
    // Fix unquoted attribute values: attr=value -> attr="value"
    const unquotedAttrPattern = /(\s\w+)=([^\s"'>]+)(\s|>)/g;
    const beforeUnquoted = content;
    content = content.replace(unquotedAttrPattern, '$1="$2"$3');
    if (content !== beforeUnquoted)
        fixes++;
    // Fix single-quoted to double-quoted (for consistency)
    // Only do this outside of CDATA sections
    const cdataSegments = [];
    content = content.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, (match) => {
        cdataSegments.push(match);
        return `__CDATA_${cdataSegments.length - 1}__`;
    });
    const beforeQuotes = content;
    content = content.replace(/(\s\w+)='([^']*)'/g, '$1="$2"');
    if (content !== beforeQuotes)
        fixes++;
    // Restore CDATA sections
    content = content.replace(/__CDATA_(\d+)__/g, (_, index) => cdataSegments[parseInt(index, 10)]);
    // Fix missing quotes around URLs in href/src/url attributes
    const urlAttrPattern = /((?:href|src|url)\s*=\s*)([^"'\s>][^\s>]*?)(\s|>)/gi;
    const beforeUrl = content;
    content = content.replace(urlAttrPattern, '$1"$2"$3');
    if (content !== beforeUrl)
        fixes++;
    return { content, fixes };
}
/**
 * Normalize excessive whitespace
 */
function normalizeWhitespace(xml) {
    let content = xml;
    let fixes = 0;
    // Collapse multiple spaces/tabs (not newlines) into single space
    const beforeCollapse = content;
    content = content.replace(/[^\S\n\r]+/g, ' ');
    if (content !== beforeCollapse)
        fixes++;
    // Remove leading/trailing whitespace in tag content
    // Only for specific tags where it matters
    for (const tag of ['title', 'link', 'guid', 'id', 'pubDate', 'published', 'updated']) {
        const pattern = new RegExp(`(<${tag}[^>]*>)\\s*([\\s\\S]*?)\\s*(</${tag}>)`, 'gi');
        const beforeTrim = content;
        content = content.replace(pattern, '$1$2$3');
        if (content !== beforeTrim)
            fixes++;
    }
    return { content, fixes };
}
/**
 * Apply a specific recovery strategy
 */
function applyStrategy(xml, strategy) {
    switch (strategy) {
        case 'fixUnclosedTags':
            return fixUnclosedTags(xml);
        case 'fixBadEncoding':
            return fixBadEncoding(xml);
        case 'fixMissingNamespaces':
            return fixMissingNamespaces(xml);
        case 'stripInvalidXml':
            return stripInvalidXml(xml);
        case 'extractFromHtml':
            return extractFromHtml(xml);
        case 'fixBrokenCdata':
            return fixBrokenCdata(xml);
        case 'removeControlCharacters':
            return removeControlCharacters(xml);
        case 'fixDuplicateDeclarations':
            return fixDuplicateDeclarations(xml);
        case 'fixMalformedAttributes':
            return fixMalformedAttributes(xml);
        case 'normalizeWhitespace':
            return normalizeWhitespace(xml);
        default:
            return { content: xml, fixes: 0 };
    }
}
/**
 * Get a human-readable description of a strategy
 */
function getStrategyDescription(strategy) {
    const descriptions = {
        fixUnclosedTags: 'Fixed unclosed XML tags',
        fixBadEncoding: 'Fixed character encoding issues',
        fixMissingNamespaces: 'Added missing namespace declarations',
        stripInvalidXml: 'Removed invalid XML characters',
        extractFromHtml: 'Extracted feed content from HTML wrapper',
        fixBrokenCdata: 'Repaired broken CDATA sections',
        removeControlCharacters: 'Removed control characters',
        fixDuplicateDeclarations: 'Removed duplicate XML declarations',
        fixMalformedAttributes: 'Fixed malformed attribute values',
        normalizeWhitespace: 'Normalized excessive whitespace',
    };
    return descriptions[strategy];
}
/**
 * Try to extract individual items using alternative methods when normal parsing fails
 */
export function extractItemsAlternative(xml) {
    const items = [];
    // Try regex-based extraction for RSS items
    const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let itemMatch;
    while ((itemMatch = itemPattern.exec(xml)) !== null) {
        const itemContent = itemMatch[1];
        const item = {};
        // Extract title
        const titleMatch = itemContent.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        if (titleMatch)
            item.title = titleMatch[1].trim();
        // Extract link
        const linkMatch = itemContent.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        if (linkMatch)
            item.link = linkMatch[1].trim();
        // Extract description
        const descMatch = itemContent.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        if (descMatch)
            item.description = descMatch[1].trim();
        // Extract pubDate
        const dateMatch = itemContent.match(/<pubDate[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
        if (dateMatch)
            item.pubDate = dateMatch[1].trim();
        if (item.title || item.link || item.description) {
            items.push(item);
        }
    }
    // Also try Atom entries
    const entryPattern = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
    let entryMatch;
    while ((entryMatch = entryPattern.exec(xml)) !== null) {
        const entryContent = entryMatch[1];
        const item = {};
        const titleMatch = entryContent.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        if (titleMatch)
            item.title = titleMatch[1].trim();
        const linkMatch = entryContent.match(/<link[^>]*href=["']([^"']*)["']/i);
        if (linkMatch)
            item.link = linkMatch[1];
        const summaryMatch = entryContent.match(/<(?:summary|content)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:summary|content)>/i);
        if (summaryMatch)
            item.description = summaryMatch[1].trim();
        const dateMatch = entryContent.match(/<(?:published|updated)[^>]*>([\s\S]*?)<\/(?:published|updated)>/i);
        if (dateMatch)
            item.pubDate = dateMatch[1].trim();
        if (item.title || item.link || item.description) {
            items.push(item);
        }
    }
    return items;
}
/**
 * Main recovery function - attempts to fix malformed feed content
 */
export function attemptRecovery(xml, options = {}) {
    const { aggressive = false, maxStrategies = 10, strategies = DEFAULT_STRATEGIES, } = options;
    const result = {
        recoveryAttempted: false,
        recoveredContent: xml,
        appliedStrategies: [],
        warnings: [],
        itemErrors: [],
    };
    let currentContent = xml;
    let strategiesApplied = 0;
    for (const strategy of strategies) {
        if (strategiesApplied >= maxStrategies) {
            result.warnings.push(`Maximum recovery strategies (${maxStrategies}) reached`);
            break;
        }
        try {
            const { content, fixes } = applyStrategy(currentContent, strategy);
            if (fixes > 0) {
                result.recoveryAttempted = true;
                result.appliedStrategies.push({
                    strategy,
                    description: getStrategyDescription(strategy),
                    fixCount: fixes,
                    success: true,
                });
                currentContent = content;
                strategiesApplied++;
                if (RssDebugUtils.isDebugEnabled()) {
                    RssDebugUtils.log(`Recovery: ${getStrategyDescription(strategy)} (${fixes} fixes)`);
                }
            }
        }
        catch (error) {
            result.appliedStrategies.push({
                strategy,
                description: getStrategyDescription(strategy),
                fixCount: 0,
                success: false,
            });
            result.warnings.push(`Strategy '${strategy}' failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // If aggressive mode, try alternative extraction as last resort
    if (aggressive && result.appliedStrategies.length > 0) {
        try {
            const extracted = extractItemsAlternative(currentContent);
            if (extracted.length > 0) {
                result.warnings.push(`Extracted ${extracted.length} items using alternative methods`);
            }
        }
        catch (_a) {
            // Alternative extraction is best-effort
        }
    }
    result.recoveredContent = currentContent;
    if (RssDebugUtils.isDebugEnabled() && result.recoveryAttempted) {
        RssDebugUtils.log(`Recovery completed: ${result.appliedStrategies.filter(s => s.success).length} strategies applied`);
    }
    return result;
}
/**
 * Quick check if content might need recovery
 * NOTE: This is a heuristic check - some triggers may be false positives
 * (e.g., unescaped ampersands inside CDATA sections are actually valid)
 */
export function needsRecovery(xml) {
    if (!xml || typeof xml !== 'string')
        return true;
    // For unescaped ampersand check, we need to exclude CDATA content
    // since ampersands inside CDATA are valid and don't need escaping
    const xmlWithoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    const hasUnescapedAmpOutsideCdata = /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/i.test(xmlWithoutCdata);
    // Check for common issues
    const issues = [
        // Control characters
        // eslint-disable-next-line no-control-regex
        /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(xml),
        // HTML wrapper
        /<html/i.test(xml) && (/<rss/i.test(xml) || /<feed/i.test(xml)),
        // Missing namespace declarations but using prefixes
        /<media:/i.test(xml) && !/xmlns:media/i.test(xml),
        /<dc:/i.test(xml) && !/xmlns:dc/i.test(xml),
        /<content:/i.test(xml) && !/xmlns:content/i.test(xml),
        // Multiple XML declarations
        (xml.match(/<\?xml/g) || []).length > 1,
        // BOM character
        xml.charCodeAt(0) === 0xFEFF,
        // Unescaped ampersands (only outside CDATA sections)
        hasUnescapedAmpOutsideCdata,
    ];
    return issues.some(Boolean);
}
/**
 * Validate recovered content by attempting to parse it
 */
export function validateRecoveredContent(xml) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            return {
                valid: false,
                hasItems: false,
                itemCount: 0,
                error: parseError.textContent || 'Parse error',
            };
        }
        const items = doc.querySelectorAll('item');
        const entries = doc.querySelectorAll('entry');
        const itemCount = items.length + entries.length;
        return {
            valid: true,
            hasItems: itemCount > 0,
            itemCount,
        };
    }
    catch (error) {
        return {
            valid: false,
            hasItems: false,
            itemCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
//# sourceMappingURL=feedRecovery.js.map