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
export function findImage(item) {
    var _a, _b, _c;
    for (const el of Array.from(item.querySelectorAll('*'))) {
        const tag = el.tagName.toLowerCase();
        const url = el.getAttribute('url');
        const isMedia = tag.endsWith('thumbnail') ||
            (tag.endsWith('content') &&
                ((el.getAttribute('medium') || '').toLowerCase() === 'image' ||
                    (el.getAttribute('type') || '').toLowerCase().startsWith('image')));
        if (isMedia && url)
            return url;
    }
    const enc = (_a = item.querySelector('enclosure[type^="image"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('url');
    if (enc)
        return enc;
    const itunes = (_b = item.querySelector('itunes\\:image')) === null || _b === void 0 ? void 0 : _b.getAttribute('href');
    if (itunes)
        return itunes;
    const desc = ((_c = item.querySelector('description')) === null || _c === void 0 ? void 0 : _c.textContent) || '';
    const m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m === null || m === void 0 ? void 0 : m[1])
        return m[1];
    const bin = Array.from(item.querySelectorAll('[url]'))
        .map(n => n.getAttribute('url'))
        .find(u => /\/binary\/[a-f0-9]{10,}.*image_version=/i.test(u));
    return bin;
}
//# sourceMappingURL=rssUtils.js.map