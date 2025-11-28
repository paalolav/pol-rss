/**
 * Feed Validator Service
 *
 * Validates feed content and detects format (RSS 1.0, RSS 2.0, Atom, JSON Feed).
 * Returns structured validation results with errors and warnings.
 */
/**
 * Validate feed content and detect format
 *
 * @param content - Raw feed content string
 * @returns Validation result with format, errors, and warnings
 */
export function validateFeed(content) {
    const result = {
        isValid: false,
        format: 'unknown',
        errors: [],
        warnings: [],
    };
    if (!content || typeof content !== 'string') {
        result.errors.push({
            code: 'EMPTY_CONTENT',
            message: 'Feed content is empty or invalid',
        });
        return result;
    }
    const trimmed = content.trim();
    if (!trimmed) {
        result.errors.push({
            code: 'EMPTY_CONTENT',
            message: 'Feed content is empty after trimming',
        });
        return result;
    }
    // Check for JSON Feed first
    if (trimmed.startsWith('{')) {
        return validateJsonFeed(trimmed);
    }
    // Check for XML feeds
    return validateXmlFeed(trimmed);
}
/**
 * Validate JSON Feed content
 */
function validateJsonFeed(content) {
    const result = {
        isValid: false,
        format: 'unknown',
        errors: [],
        warnings: [],
    };
    let data;
    try {
        data = JSON.parse(content);
    }
    catch (error) {
        result.errors.push({
            code: 'INVALID_JSON',
            message: `Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`,
        });
        return result;
    }
    // Check for JSON Feed version
    if (!data.version || typeof data.version !== 'string') {
        result.errors.push({
            code: 'MISSING_VERSION',
            message: 'Missing or invalid version field',
            field: 'version',
        });
        return result;
    }
    const version = data.version;
    if (!version.includes('jsonfeed.org')) {
        result.errors.push({
            code: 'INVALID_VERSION',
            message: 'Version field does not contain jsonfeed.org URL',
            field: 'version',
        });
        return result;
    }
    result.format = 'json';
    result.formatVersion = version.includes('1.1') ? '1.1' : '1.0';
    // Validate required fields
    if (!data.title) {
        result.warnings.push({
            code: 'MISSING_TITLE',
            message: 'Feed is missing a title',
            field: 'title',
        });
    }
    if (!Array.isArray(data.items)) {
        result.errors.push({
            code: 'MISSING_ITEMS',
            message: 'Feed is missing items array',
            field: 'items',
        });
        return result;
    }
    const items = data.items;
    // Validate items have required fields
    items.forEach((item, index) => {
        if (!item.id) {
            result.warnings.push({
                code: 'ITEM_MISSING_ID',
                message: `Item at index ${index} is missing required id field`,
                field: `items[${index}].id`,
            });
        }
    });
    // Extract metadata
    result.metadata = {
        title: data.title,
        description: data.description,
        link: data.home_page_url,
        itemCount: items.length,
    };
    result.isValid = result.errors.length === 0;
    return result;
}
/**
 * Validate XML feed content (RSS/Atom)
 */
function validateXmlFeed(content) {
    const result = {
        isValid: false,
        format: 'unknown',
        errors: [],
        warnings: [],
    };
    // Try to parse XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'application/xml');
    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        const errorText = parserError.textContent || '';
        // Check if there's still parseable content despite errors
        const hasContent = doc.querySelector('item') || doc.querySelector('entry') ||
            doc.querySelector('channel') || doc.querySelector('feed');
        if (!hasContent) {
            result.errors.push({
                code: 'XML_PARSE_ERROR',
                message: `XML parsing error: ${errorText.substring(0, 200)}`,
            });
            return result;
        }
        result.warnings.push({
            code: 'XML_PARSE_WARNING',
            message: 'XML has parsing issues but content was recovered',
        });
    }
    // Detect feed format
    const rootElement = doc.documentElement;
    if (rootElement.nodeName === 'rdf:RDF' || content.includes('xmlns="http://purl.org/rss/1.0/"')) {
        result.format = 'rss1';
        result.formatVersion = '1.0';
        return validateRss1Feed(doc, result);
    }
    if (rootElement.nodeName === 'feed' || doc.querySelector('feed')) {
        result.format = 'atom';
        result.formatVersion = '1.0';
        return validateAtomFeed(doc, result);
    }
    if (rootElement.nodeName === 'rss' || doc.querySelector('rss') || doc.querySelector('channel')) {
        result.format = 'rss2';
        const versionAttr = rootElement.getAttribute('version');
        result.formatVersion = versionAttr || '2.0';
        return validateRss2Feed(doc, result);
    }
    result.errors.push({
        code: 'UNKNOWN_FORMAT',
        message: 'Could not detect feed format. Expected RSS, Atom, or JSON Feed.',
    });
    return result;
}
/**
 * Validate RSS 1.0 (RDF) feed
 */
function validateRss1Feed(doc, result) {
    var _a, _b;
    const channel = doc.querySelector('channel');
    if (!channel) {
        result.errors.push({
            code: 'MISSING_CHANNEL',
            message: 'RSS 1.0 feed is missing channel element',
            field: 'channel',
        });
        return result;
    }
    const title = (_a = channel.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent;
    const link = (_b = channel.querySelector('link')) === null || _b === void 0 ? void 0 : _b.textContent;
    const items = doc.querySelectorAll('item');
    if (!title) {
        result.warnings.push({
            code: 'MISSING_TITLE',
            message: 'Channel is missing title',
            field: 'channel/title',
        });
    }
    if (!link) {
        result.warnings.push({
            code: 'MISSING_LINK',
            message: 'Channel is missing link',
            field: 'channel/link',
        });
    }
    result.metadata = {
        title: title || undefined,
        link: link || undefined,
        itemCount: items.length,
    };
    result.isValid = result.errors.length === 0;
    return result;
}
/**
 * Validate RSS 2.0 feed
 */
function validateRss2Feed(doc, result) {
    var _a, _b, _c;
    const channel = doc.querySelector('channel');
    if (!channel) {
        result.errors.push({
            code: 'MISSING_CHANNEL',
            message: 'RSS 2.0 feed is missing channel element',
            field: 'channel',
        });
        return result;
    }
    // Get direct child elements only (not nested item children)
    const getDirectChild = (element, tagName) => {
        for (const child of Array.from(element.children)) {
            if (child.tagName.toLowerCase() === tagName.toLowerCase()) {
                return child;
            }
        }
        return null;
    };
    const title = (_a = getDirectChild(channel, 'title')) === null || _a === void 0 ? void 0 : _a.textContent;
    const link = (_b = getDirectChild(channel, 'link')) === null || _b === void 0 ? void 0 : _b.textContent;
    const description = (_c = getDirectChild(channel, 'description')) === null || _c === void 0 ? void 0 : _c.textContent;
    const items = doc.querySelectorAll('item');
    if (!title) {
        result.warnings.push({
            code: 'MISSING_TITLE',
            message: 'Channel is missing required title element',
            field: 'channel/title',
        });
    }
    if (!link) {
        result.warnings.push({
            code: 'MISSING_LINK',
            message: 'Channel is missing required link element',
            field: 'channel/link',
        });
    }
    if (!description) {
        result.warnings.push({
            code: 'MISSING_DESCRIPTION',
            message: 'Channel is missing required description element',
            field: 'channel/description',
        });
    }
    // Validate items
    items.forEach((item, index) => {
        var _a, _b;
        const itemTitle = (_a = item.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent;
        const itemDesc = (_b = item.querySelector('description')) === null || _b === void 0 ? void 0 : _b.textContent;
        if (!itemTitle && !itemDesc) {
            result.warnings.push({
                code: 'ITEM_MISSING_CONTENT',
                message: `Item at index ${index} has neither title nor description`,
                field: `item[${index}]`,
            });
        }
    });
    result.metadata = {
        title: title || undefined,
        description: description || undefined,
        link: link || undefined,
        itemCount: items.length,
    };
    result.isValid = result.errors.length === 0;
    return result;
}
/**
 * Validate Atom 1.0 feed
 */
function validateAtomFeed(doc, result) {
    var _a, _b, _c;
    const feed = doc.querySelector('feed');
    if (!feed) {
        result.errors.push({
            code: 'MISSING_FEED',
            message: 'Atom feed is missing feed element',
            field: 'feed',
        });
        return result;
    }
    const title = (_a = feed.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent;
    const id = (_b = feed.querySelector('id')) === null || _b === void 0 ? void 0 : _b.textContent;
    const updated = (_c = feed.querySelector('updated')) === null || _c === void 0 ? void 0 : _c.textContent;
    const entries = doc.querySelectorAll('entry');
    const linkElement = feed.querySelector('link[rel="alternate"], link:not([rel])');
    const link = linkElement === null || linkElement === void 0 ? void 0 : linkElement.getAttribute('href');
    if (!title) {
        result.warnings.push({
            code: 'MISSING_TITLE',
            message: 'Feed is missing required title element',
            field: 'feed/title',
        });
    }
    if (!id) {
        result.warnings.push({
            code: 'MISSING_ID',
            message: 'Feed is missing required id element',
            field: 'feed/id',
        });
    }
    if (!updated) {
        result.warnings.push({
            code: 'MISSING_UPDATED',
            message: 'Feed is missing required updated element',
            field: 'feed/updated',
        });
    }
    // Validate entries
    entries.forEach((entry, index) => {
        var _a, _b;
        const entryTitle = (_a = entry.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent;
        const entryId = (_b = entry.querySelector('id')) === null || _b === void 0 ? void 0 : _b.textContent;
        if (!entryTitle) {
            result.warnings.push({
                code: 'ENTRY_MISSING_TITLE',
                message: `Entry at index ${index} is missing required title`,
                field: `entry[${index}]/title`,
            });
        }
        if (!entryId) {
            result.warnings.push({
                code: 'ENTRY_MISSING_ID',
                message: `Entry at index ${index} is missing required id`,
                field: `entry[${index}]/id`,
            });
        }
    });
    result.metadata = {
        title: title || undefined,
        link: link || undefined,
        itemCount: entries.length,
    };
    result.isValid = result.errors.length === 0;
    return result;
}
/**
 * Detect feed format without full validation
 *
 * @param content - Raw feed content string
 * @returns Detected feed format
 */
export function detectFeedFormat(content) {
    if (!content || typeof content !== 'string') {
        return 'unknown';
    }
    const trimmed = content.trim();
    // JSON Feed
    if (trimmed.startsWith('{')) {
        try {
            const data = JSON.parse(trimmed);
            if (data.version && typeof data.version === 'string' && data.version.includes('jsonfeed.org')) {
                return 'json';
            }
        }
        catch (_a) {
            // Not JSON
        }
        return 'unknown';
    }
    // RSS 1.0 (RDF)
    if (trimmed.includes('xmlns="http://purl.org/rss/1.0/"') || trimmed.includes('rdf:RDF')) {
        return 'rss1';
    }
    // Atom
    if (trimmed.includes('xmlns="http://www.w3.org/2005/Atom"') || trimmed.includes('<feed')) {
        return 'atom';
    }
    // RSS 2.0
    if (trimmed.includes('<rss') || (trimmed.includes('<channel') && trimmed.includes('<item'))) {
        return 'rss2';
    }
    return 'unknown';
}
//# sourceMappingURL=feedValidator.js.map