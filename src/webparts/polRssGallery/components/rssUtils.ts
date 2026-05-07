import DOMPurify from 'dompurify';

const SAFE_HTML_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong', 'br', 'p', 'span', 'img'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  ALLOW_DATA_ATTR: false
};

export function getImageSrc(imageUrl?: string, fallbackImageUrl?: string, forceFallback?: boolean): string {
  return forceFallback || !imageUrl ? fallbackImageUrl || '' : imageUrl;
}

export function imgError(e: React.SyntheticEvent<HTMLImageElement>, fallbackImageUrl?: string): void {
  const el = e.currentTarget;
  if (!el.dataset.failed) {
    el.dataset.failed = '1';
    el.src = fallbackImageUrl || '';
  }
}

export function formatPubDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d.toLocaleDateString();
}

export function cleanDescription(raw: string, max = 380): string {
  if (!raw) return '';

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
    const truncated = desc.slice(0, max);
    const lastSpace = truncated.lastIndexOf(' ');
    desc = (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
  }

  return DOMPurify.sanitize(desc, SAFE_HTML_CONFIG);
}

export function safeHref(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const u = new URL(rawUrl);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function resolveImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl?.startsWith('http')) return undefined;

  try {
    const urlObj = new URL(rawUrl);

    const inner = urlObj.searchParams.get('url');
    if (inner?.startsWith('http')) return decodeURIComponent(inner);

    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(p =>
      urlObj.searchParams.delete(p)
    );

    return urlObj.toString();
  } catch {
    return undefined;
  }
}
export function findImage(item: Element): string | undefined {
  for (const el of Array.from(item.querySelectorAll('*'))) {
    const tag = el.tagName.toLowerCase();
    const url = el.getAttribute('url');
    const isMedia =
      tag.endsWith('thumbnail') ||
      (tag.endsWith('content') &&
        ((el.getAttribute('medium') || '').toLowerCase() === 'image' ||
         (el.getAttribute('type') || '').toLowerCase().startsWith('image')));
    if (isMedia && url) return url;
  }

  const enc = item.querySelector('enclosure[type^="image"]')?.getAttribute('url');
  if (enc) return enc;

  const itunes = item.querySelector(String.raw`itunes\:image`)?.getAttribute('href');
  if (itunes) return itunes;

  const desc = item.querySelector('description')?.textContent || '';
  const m = /<img[^>]+src=["']([^"']+)["']/i.exec(desc);
  if (m?.[1]) return m[1];

  const bin = Array.from(item.querySelectorAll('[url]'))
    .map(n => n.getAttribute('url')!)
    .find(u => u.includes('image_version=') && /\/binary\/[a-f0-9]{10,}/i.test(u));
  return bin;
}
