export function getImageSrc(imageUrl, fallbackImageUrl, forceFallback) {
    return forceFallback || !imageUrl ? fallbackImageUrl || '' : imageUrl;
}
export function imgError(e, fallbackImageUrl) {
    const el = e.currentTarget;
    if (!el.dataset.failed) {
        el.dataset.failed = '1';
        el.src = fallbackImageUrl || '';
    }
}
export function cleanDescription(raw, max = 380) {
    if (!raw)
        return '';
    let desc = raw.trim().replace(/\]\]>\s*$/, '');
    desc = desc
        .replace(/(<br\s*\/?>\s*){2,}/gi, ' ')
        .replace(/^<br\s*\/?>|<br\s*\/?>$/gi, '')
        .trim();
    const parts = desc.split(/<br\s*\/?>/gi).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2 && parts[0] === parts[1]) {
        desc = parts.slice(1).join(' ');
    }
    if (desc.length > max) {
        desc = desc.slice(0, max).replace(/\s+\S*$/, '') + '…';
    }
    return desc;
}
export function resolveImageUrl(rawUrl) {
    if (!(rawUrl === null || rawUrl === void 0 ? void 0 : rawUrl.startsWith('http')))
        return undefined;
    try {
        const urlObj = new URL(rawUrl);
        const inner = urlObj.searchParams.get('url');
        if (inner === null || inner === void 0 ? void 0 : inner.startsWith('http'))
            return decodeURIComponent(inner);
        ['utm_source', 'utm_medium', 'utm_campaign'].forEach(p => urlObj.searchParams.delete(p));
        return urlObj.toString();
    }
    catch (_a) {
        return undefined;
    }
}
/**
 * Enhanced image finding function that handles a variety of RSS feed formats
 * including Meltwater and Nettavisen
 */
export function findImage(item) {
    // Media namespace elements (common in many feeds including Meltwater)
    // Try multiple approaches to handle namespaces in different browsers/environments
    // Approach 1: Direct namespace selector (works in most modern browsers)
    const mediaThumbnails = Array.from(item.querySelectorAll('media\\:thumbnail, *[nodeName="media:thumbnail"], *[tagName="media:thumbnail"]'));
    // If the direct search didn't work, try attribute selectors
    if (!mediaThumbnails.length) {
        const possibleMediaElements = Array.from(item.querySelectorAll('*'));
        for (const el of possibleMediaElements) {
            if (el.nodeName.toLowerCase() === 'media:thumbnail' ||
                el.tagName.toLowerCase() === 'media:thumbnail') {
                mediaThumbnails.push(el);
            }
        }
    }
    // Process any media:thumbnail elements found
    if (mediaThumbnails && mediaThumbnails.length > 0) {
        for (const thumbnail of mediaThumbnails) {
            const urlAttr = thumbnail.getAttribute('url');
            if (urlAttr && urlAttr.startsWith('http')) {
                return urlAttr;
            }
        }
    }
    // Check for media:content with image properties (common in Nettavisen and many other feeds)
    const mediaContentElements = Array.from(item.querySelectorAll('media\\:content, *[nodeName="media:content"], *[tagName="media:content"]'));
    for (const mediaContent of mediaContentElements) {
        // Media elements with image related attributes
        const medium = (mediaContent.getAttribute('medium') || '').toLowerCase();
        const type = (mediaContent.getAttribute('type') || '').toLowerCase();
        const url = mediaContent.getAttribute('url');
        if (url && url.startsWith('http') && (medium === 'image' || type.startsWith('image/'))) {
            return url;
        }
    }
    // Check for standard enclosures with image MIME types
    const enclosureElements = Array.from(item.querySelectorAll('enclosure'));
    for (const enclosure of enclosureElements) {
        const type = (enclosure.getAttribute('type') || '').toLowerCase();
        const url = enclosure.getAttribute('url');
        if (url && url.startsWith('http') && (type.startsWith('image/') || !type)) {
            return url;
        }
    }
    // Check for image links in the "content:encoded" section
    const contentEncoded = item.querySelector('content\\:encoded') ||
        item.querySelector('content') ||
        item.querySelector('description');
    if (contentEncoded) {
        const contentHtml = contentEncoded.textContent || '';
        const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
            return imgMatch[1];
        }
    }
    // Check for iTunes specific image (podcasts)
    const itunesImages = Array.from(item.querySelectorAll('itunes\\:image, *[nodeName="itunes:image"], *[tagName="itunes:image"]'));
    for (const itunesImage of itunesImages) {
        const href = itunesImage.getAttribute('href');
        if (href && href.startsWith('http')) {
            return href;
        }
    }
    // Check for any tag that has 'image' in its name
    const imageElements = Array.from(item.querySelectorAll('*'));
    for (const el of imageElements) {
        const tagName = el.tagName.toLowerCase();
        const nodeName = el.nodeName.toLowerCase();
        if (tagName.includes('image') || nodeName.includes('image')) {
            // Try different attributes that might contain the image URL
            const possibleUrlAttributes = ['url', 'href', 'src'];
            for (const attr of possibleUrlAttributes) {
                const urlValue = el.getAttribute(attr);
                if (urlValue && urlValue.startsWith('http')) {
                    return urlValue;
                }
            }
            // If no attribute with URL found, try the text content
            const content = el.textContent;
            if (content && content.trim().startsWith('http')) {
                return content.trim();
            }
        }
    }
    // Also check for generic thumbnail tags in any namespace
    for (const el of Array.from(item.querySelectorAll('*'))) {
        const tagName = el.tagName.toLowerCase();
        const nodeName = el.nodeName.toLowerCase();
        const url = el.getAttribute('url');
        // Check if tag name contains 'thumbnail' in any form
        const isMediaThumbnail = tagName.includes('thumbnail') ||
            nodeName.includes('thumbnail') ||
            (tagName.includes('content') &&
                ((el.getAttribute('medium') || '').toLowerCase() === 'image' ||
                    (el.getAttribute('type') || '').toLowerCase().startsWith('image')));
        if (isMediaThumbnail && url && url.startsWith('http')) {
            return url;
        }
    }
    // If all attempts fail, return undefined
    return undefined;
}
//# sourceMappingURL=rssUtils.js.map