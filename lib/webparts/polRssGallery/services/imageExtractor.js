/**
 * Image Extractor Service (ST-003-04)
 *
 * Extracts images from RSS/Atom feed items with a prioritized fallback chain.
 * Handles various image sources including media:thumbnail, media:content,
 * enclosures, inline HTML images, itunes:image, and channel images.
 *
 * Priority Order:
 * 1. media:thumbnail (preferred size)
 * 2. media:content (type="image/*")
 * 3. enclosure (type="image/*")
 * 4. First <img> in content:encoded
 * 5. First <img> in description
 * 6. itunes:image
 * 7. Channel image (fallback)
 * 8. Configured fallback image
 */
/**
 * Validates and normalizes an image URL
 */
export function validateImageUrl(url, baseUrl) {
    if (!url || typeof url !== 'string') {
        return { isValid: false, url: '' };
    }
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
        return { isValid: false, url: '' };
    }
    // Handle protocol-relative URLs (//example.com/image.jpg)
    if (trimmedUrl.startsWith('//')) {
        return { isValid: true, url: `https:${trimmedUrl}` };
    }
    // Handle absolute URLs
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        try {
            const urlObj = new URL(trimmedUrl);
            // Filter out tracking/proxy URLs and extract inner URL if present
            const inner = urlObj.searchParams.get('url');
            if (inner === null || inner === void 0 ? void 0 : inner.startsWith('http')) {
                return { isValid: true, url: decodeURIComponent(inner) };
            }
            // Remove common tracking parameters
            ['utm_source', 'utm_medium', 'utm_campaign'].forEach(p => urlObj.searchParams.delete(p));
            return { isValid: true, url: urlObj.toString() };
        }
        catch (_a) {
            return { isValid: false, url: '' };
        }
    }
    // Handle relative URLs
    if (baseUrl && (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('.') || !trimmedUrl.includes(':'))) {
        try {
            const resolved = new URL(trimmedUrl, baseUrl);
            return { isValid: true, url: resolved.toString() };
        }
        catch (_b) {
            return { isValid: false, url: '' };
        }
    }
    // Data URLs for images are valid
    if (trimmedUrl.startsWith('data:image/')) {
        return { isValid: true, url: trimmedUrl };
    }
    return { isValid: false, url: '' };
}
/**
 * Checks if a MIME type indicates an image
 */
export function isImageMimeType(type) {
    if (!type)
        return false;
    const normalizedType = type.toLowerCase().trim();
    return normalizedType.startsWith('image/') ||
        normalizedType === 'image' ||
        ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].some(ext => normalizedType.includes(ext));
}
/**
 * Selects namespace-aware elements using optimized selector strategies (ST-003-08)
 * Performance optimized: avoids querySelectorAll('*') which is O(n) on all descendants
 */
function selectNamespacedElements(parent, localName, namespace) {
    const target = namespace ? `${namespace}:${localName}` : localName;
    // Strategy 1: Direct namespace selector (fast, works in most browsers)
    if (namespace) {
        try {
            const prefixed = parent.querySelectorAll(`${namespace}\\:${localName}`);
            if (prefixed.length > 0) {
                return Array.from(prefixed);
            }
        }
        catch (_a) {
            // Selector might not be supported, try fallback
        }
    }
    // Strategy 2: getElementsByTagName is much faster than querySelectorAll('*')
    // This works because browsers handle namespaced tag names
    try {
        const byTagName = parent.getElementsByTagName(target);
        if (byTagName.length > 0) {
            return Array.from(byTagName);
        }
    }
    catch (_b) {
        // Fallback
    }
    // Strategy 3: Try without namespace prefix (some parsers strip it)
    try {
        const byLocalName = parent.getElementsByTagName(localName);
        if (byLocalName.length > 0) {
            return Array.from(byLocalName);
        }
    }
    catch (_c) {
        // Fallback failed
    }
    return [];
}
/**
 * Extracts media:thumbnail elements from an item
 */
export function extractMediaThumbnails(item, options = {}) {
    const images = [];
    const seenUrls = new Set();
    const thumbnails = selectNamespacedElements(item, 'thumbnail', 'media');
    // Also check for thumbnails inside media:group (but avoid duplicates)
    const mediaGroups = selectNamespacedElements(item, 'group', 'media');
    for (const group of mediaGroups) {
        const groupThumbnails = selectNamespacedElements(group, 'thumbnail', 'media');
        for (const gt of groupThumbnails) {
            // Only add if not already in thumbnails array
            if (!thumbnails.includes(gt)) {
                thumbnails.push(gt);
            }
        }
    }
    for (const thumbnail of thumbnails) {
        const url = thumbnail.getAttribute('url');
        const validated = validateImageUrl(url, options.baseUrl);
        if (validated.isValid && !seenUrls.has(validated.url)) {
            seenUrls.add(validated.url);
            const width = parseInt(thumbnail.getAttribute('width') || '0', 10) || undefined;
            const height = parseInt(thumbnail.getAttribute('height') || '0', 10) || undefined;
            images.push({
                url: validated.url,
                source: 'media:thumbnail',
                width,
                height,
            });
        }
    }
    return images;
}
/**
 * Extracts media:content elements with image type from an item
 */
export function extractMediaContent(item, options = {}) {
    const images = [];
    const seenUrls = new Set();
    const mediaContents = selectNamespacedElements(item, 'content', 'media');
    // Also check inside media:group (but avoid duplicates)
    const mediaGroups = selectNamespacedElements(item, 'group', 'media');
    for (const group of mediaGroups) {
        const groupContents = selectNamespacedElements(group, 'content', 'media');
        for (const gc of groupContents) {
            if (!mediaContents.includes(gc)) {
                mediaContents.push(gc);
            }
        }
    }
    for (const mediaContent of mediaContents) {
        const url = mediaContent.getAttribute('url');
        const type = mediaContent.getAttribute('type') || '';
        const medium = mediaContent.getAttribute('medium') || '';
        // Only include if it's an image type or medium
        if (!isImageMimeType(type) && medium.toLowerCase() !== 'image') {
            continue;
        }
        const validated = validateImageUrl(url, options.baseUrl);
        if (validated.isValid && !seenUrls.has(validated.url)) {
            seenUrls.add(validated.url);
            const width = parseInt(mediaContent.getAttribute('width') || '0', 10) || undefined;
            const height = parseInt(mediaContent.getAttribute('height') || '0', 10) || undefined;
            images.push({
                url: validated.url,
                source: 'media:content',
                width,
                height,
                type: type || undefined,
            });
        }
    }
    return images;
}
/**
 * Extracts image from enclosure elements
 */
export function extractEnclosureImages(item, options = {}) {
    const images = [];
    const enclosures = item.querySelectorAll('enclosure');
    for (const enclosure of Array.from(enclosures)) {
        const url = enclosure.getAttribute('url');
        const type = enclosure.getAttribute('type') || '';
        // Only include if it's an image type or no type specified (optimistic)
        if (type && !isImageMimeType(type)) {
            continue;
        }
        const validated = validateImageUrl(url, options.baseUrl);
        if (validated.isValid) {
            images.push({
                url: validated.url,
                source: 'enclosure',
                type: type || undefined,
            });
        }
    }
    return images;
}
/**
 * Extracts the first image from HTML content
 */
export function extractImagesFromHtml(html, source, options = {}) {
    if (!html)
        return [];
    const images = [];
    // Match <img> tags and extract src attribute
    const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        const srcValue = match[1];
        const validated = validateImageUrl(srcValue, options.baseUrl);
        if (validated.isValid) {
            // Try to extract width/height from the tag
            const fullTag = match[0];
            const widthMatch = fullTag.match(/width\s*=\s*["']?(\d+)/i);
            const heightMatch = fullTag.match(/height\s*=\s*["']?(\d+)/i);
            images.push({
                url: validated.url,
                source,
                width: widthMatch ? parseInt(widthMatch[1], 10) : undefined,
                height: heightMatch ? parseInt(heightMatch[1], 10) : undefined,
            });
        }
    }
    return images;
}
/**
 * Extracts itunes:image from an item
 */
export function extractItunesImage(item, options = {}) {
    const itunesImages = selectNamespacedElements(item, 'image', 'itunes');
    for (const itunesImage of itunesImages) {
        const href = itunesImage.getAttribute('href');
        const validated = validateImageUrl(href, options.baseUrl);
        if (validated.isValid) {
            return {
                url: validated.url,
                source: 'itunes:image',
            };
        }
    }
    return null;
}
/**
 * Extracts channel-level image
 */
export function extractChannelImage(channel, options = {}) {
    var _a;
    if (!channel)
        return null;
    // Try standard RSS channel image
    const imageElement = channel.querySelector('image > url');
    if (imageElement) {
        const url = (_a = imageElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        const validated = validateImageUrl(url, options.baseUrl);
        if (validated.isValid) {
            return {
                url: validated.url,
                source: 'channel',
            };
        }
    }
    // Try itunes:image at channel level
    const itunesImage = extractItunesImage(channel, options);
    if (itunesImage) {
        return {
            ...itunesImage,
            source: 'channel',
        };
    }
    // Try media:thumbnail at channel level
    const mediaThumbnails = extractMediaThumbnails(channel, options);
    if (mediaThumbnails.length > 0) {
        return {
            ...mediaThumbnails[0],
            source: 'channel',
        };
    }
    return null;
}
/**
 * Selects the best image from candidates based on size preferences
 */
export function selectBestImage(candidates, preferredMinWidth = 0, preferredMinHeight = 0) {
    if (candidates.length === 0)
        return null;
    if (candidates.length === 1)
        return candidates[0];
    // Sort candidates - prefer images with known dimensions, then by size
    const sorted = [...candidates].sort((a, b) => {
        // Prefer images with known dimensions
        const aHasDimensions = !!(a.width && a.height);
        const bHasDimensions = !!(b.width && b.height);
        if (aHasDimensions && !bHasDimensions)
            return -1;
        if (!aHasDimensions && bHasDimensions)
            return 1;
        // If both have dimensions, sort by area (larger first)
        if (aHasDimensions && bHasDimensions) {
            const aArea = (a.width || 0) * (a.height || 0);
            const bArea = (b.width || 0) * (b.height || 0);
            return bArea - aArea;
        }
        // Neither has dimensions, keep original order
        return 0;
    });
    // If no size preference, return the best sorted candidate
    if (preferredMinWidth <= 0 && preferredMinHeight <= 0) {
        return sorted[0];
    }
    // Filter candidates meeting minimum size requirements
    const meetingMinimum = sorted.filter(img => {
        // Images without dimensions are considered as meeting the minimum (optimistic)
        const meetsWidth = !img.width || img.width >= preferredMinWidth;
        const meetsHeight = !img.height || img.height >= preferredMinHeight;
        return meetsWidth && meetsHeight;
    });
    // If some meet minimum, prefer those; otherwise use all sorted candidates
    return meetingMinimum.length > 0 ? meetingMinimum[0] : sorted[0];
}
/**
 * Main extraction function - extracts the best image from a feed item
 * following the priority chain:
 *
 * 1. media:thumbnail (preferred size)
 * 2. media:content (type="image/*")
 * 3. enclosure (type="image/*")
 * 4. First <img> in content:encoded
 * 5. First <img> in description
 * 6. itunes:image
 * 7. Channel image (fallback)
 * 8. Configured fallback image
 */
export function extractImage(item, options = {}) {
    const { preferredMinWidth = 0, preferredMinHeight = 0 } = options;
    // 1. media:thumbnail
    const thumbnails = extractMediaThumbnails(item, options);
    if (thumbnails.length > 0) {
        const best = selectBestImage(thumbnails, preferredMinWidth, preferredMinHeight);
        if (best)
            return best;
    }
    // 2. media:content (images only)
    const mediaContent = extractMediaContent(item, options);
    if (mediaContent.length > 0) {
        const best = selectBestImage(mediaContent, preferredMinWidth, preferredMinHeight);
        if (best)
            return best;
    }
    // 3. enclosure (images only)
    const enclosures = extractEnclosureImages(item, options);
    if (enclosures.length > 0) {
        return enclosures[0]; // Enclosures typically don't have size info
    }
    // 4. First <img> in content:encoded
    const contentEncoded = item.querySelector('content\\:encoded') ||
        selectNamespacedElements(item, 'encoded', 'content')[0];
    if (contentEncoded) {
        const contentHtml = contentEncoded.textContent || '';
        const contentImages = extractImagesFromHtml(contentHtml, 'content:encoded', options);
        if (contentImages.length > 0) {
            return contentImages[0];
        }
    }
    // 5. First <img> in description
    const description = item.querySelector('description');
    if (description) {
        const descHtml = description.textContent || '';
        const descImages = extractImagesFromHtml(descHtml, 'description', options);
        if (descImages.length > 0) {
            return descImages[0];
        }
    }
    // Also check Atom content element for images
    const atomContent = item.querySelector('content');
    if (atomContent && atomContent !== contentEncoded) {
        const atomHtml = atomContent.textContent || '';
        const atomImages = extractImagesFromHtml(atomHtml, 'description', options);
        if (atomImages.length > 0) {
            return atomImages[0];
        }
    }
    // 6. itunes:image
    const itunesImage = extractItunesImage(item, options);
    if (itunesImage)
        return itunesImage;
    // 7. Channel image (fallback) - requires channelElement in options
    const channelImage = extractChannelImage(options.channelElement, options);
    if (channelImage)
        return channelImage;
    // 8. Configured fallback image
    if (options.fallbackImageUrl) {
        return {
            url: options.fallbackImageUrl,
            source: 'fallback',
        };
    }
    return null;
}
/**
 * Convenience function to get just the URL string
 */
export function extractImageUrl(item, options = {}) {
    const extracted = extractImage(item, options);
    return extracted === null || extracted === void 0 ? void 0 : extracted.url;
}
/**
 * Legacy compatibility function - matches the old findImage signature
 * but uses the new priority chain
 */
export function findImage(item) {
    const extracted = extractImage(item, {});
    return extracted === null || extracted === void 0 ? void 0 : extracted.url;
}
//# sourceMappingURL=imageExtractor.js.map