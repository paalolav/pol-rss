/**
 * Image Extractor Service Tests (ST-003-04)
 *
 * Comprehensive tests for RSS/Atom feed image extraction with:
 * - URL validation
 * - Priority chain extraction
 * - Size/quality preferences
 * - Relative URL resolution
 * - Edge cases handling
 */

import {
  validateImageUrl,
  isImageMimeType,
  extractMediaThumbnails,
  extractMediaContent,
  extractEnclosureImages,
  extractImagesFromHtml,
  extractItunesImage,
  extractChannelImage,
  extractImage,
  extractImageUrl,
  findImage,
  selectBestImage,
  ExtractedImage,
  ImageExtractionOptions,
} from '../../src/webparts/polRssGallery/services/imageExtractor';

// Helper to create DOM elements from XML string
function parseXml(xml: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
}

function getItemElement(xml: string): Element {
  const doc = parseXml(xml);
  return doc.querySelector('item') || doc.querySelector('entry') || doc.documentElement;
}

describe('ImageExtractor', () => {
  // ==========================================================================
  // URL Validation Tests
  // ==========================================================================
  describe('validateImageUrl', () => {
    describe('absolute URLs', () => {
      it('validates http URLs', () => {
        const result = validateImageUrl('http://example.com/image.jpg');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('http://example.com/image.jpg');
      });

      it('validates https URLs', () => {
        const result = validateImageUrl('https://example.com/image.jpg');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://example.com/image.jpg');
      });

      it('strips UTM tracking parameters', () => {
        const result = validateImageUrl('https://example.com/image.jpg?utm_source=rss&utm_medium=feed&utm_campaign=test');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://example.com/image.jpg');
      });

      it('preserves non-tracking query parameters', () => {
        const result = validateImageUrl('https://example.com/image.jpg?width=800&format=webp');
        expect(result.isValid).toBe(true);
        expect(result.url).toContain('width=800');
        expect(result.url).toContain('format=webp');
      });

      it('extracts inner URL from proxy URLs', () => {
        const result = validateImageUrl('https://proxy.example.com/?url=https%3A%2F%2Fcdn.example.com%2Fimage.jpg');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://cdn.example.com/image.jpg');
      });
    });

    describe('protocol-relative URLs', () => {
      it('converts protocol-relative URLs to https', () => {
        const result = validateImageUrl('//cdn.example.com/image.jpg');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://cdn.example.com/image.jpg');
      });
    });

    describe('relative URLs', () => {
      it('resolves relative URLs with base URL', () => {
        const result = validateImageUrl('/images/photo.jpg', 'https://example.com/feed');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://example.com/images/photo.jpg');
      });

      it('resolves parent-relative URLs', () => {
        const result = validateImageUrl('../images/photo.jpg', 'https://example.com/feeds/rss.xml');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://example.com/images/photo.jpg');
      });

      it('resolves path-relative URLs', () => {
        const result = validateImageUrl('images/photo.jpg', 'https://example.com/');
        expect(result.isValid).toBe(true);
        expect(result.url).toBe('https://example.com/images/photo.jpg');
      });

      it('rejects relative URLs without base URL', () => {
        const result = validateImageUrl('/images/photo.jpg');
        expect(result.isValid).toBe(false);
      });
    });

    describe('data URLs', () => {
      it('validates data URLs for images', () => {
        const result = validateImageUrl('data:image/png;base64,iVBORw0KGgo=');
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid URLs', () => {
      it('rejects null', () => {
        const result = validateImageUrl(null);
        expect(result.isValid).toBe(false);
      });

      it('rejects undefined', () => {
        const result = validateImageUrl(undefined);
        expect(result.isValid).toBe(false);
      });

      it('rejects empty string', () => {
        const result = validateImageUrl('');
        expect(result.isValid).toBe(false);
      });

      it('rejects whitespace only', () => {
        const result = validateImageUrl('   ');
        expect(result.isValid).toBe(false);
      });

      it('rejects javascript URLs', () => {
        const result = validateImageUrl('javascript:alert(1)');
        expect(result.isValid).toBe(false);
      });

      it('rejects malformed URLs', () => {
        const result = validateImageUrl('http://[invalid');
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ==========================================================================
  // MIME Type Detection Tests
  // ==========================================================================
  describe('isImageMimeType', () => {
    it('recognizes image/jpeg', () => {
      expect(isImageMimeType('image/jpeg')).toBe(true);
    });

    it('recognizes image/png', () => {
      expect(isImageMimeType('image/png')).toBe(true);
    });

    it('recognizes image/gif', () => {
      expect(isImageMimeType('image/gif')).toBe(true);
    });

    it('recognizes image/webp', () => {
      expect(isImageMimeType('image/webp')).toBe(true);
    });

    it('recognizes image/svg+xml', () => {
      expect(isImageMimeType('image/svg+xml')).toBe(true);
    });

    it('handles case variations', () => {
      expect(isImageMimeType('IMAGE/JPEG')).toBe(true);
      expect(isImageMimeType('Image/Png')).toBe(true);
    });

    it('rejects video types', () => {
      expect(isImageMimeType('video/mp4')).toBe(false);
    });

    it('rejects audio types', () => {
      expect(isImageMimeType('audio/mpeg')).toBe(false);
    });

    it('rejects application types', () => {
      expect(isImageMimeType('application/pdf')).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(isImageMimeType(null)).toBe(false);
      expect(isImageMimeType(undefined)).toBe(false);
    });
  });

  // ==========================================================================
  // Media Thumbnail Extraction Tests
  // ==========================================================================
  describe('extractMediaThumbnails', () => {
    it('extracts media:thumbnail elements', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <title>Test</title>
        <media:thumbnail url="https://example.com/thumb.jpg" width="120" height="90" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaThumbnails(item);

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/thumb.jpg');
      expect(result[0].source).toBe('media:thumbnail');
      expect(result[0].width).toBe(120);
      expect(result[0].height).toBe(90);
    });

    it('extracts multiple thumbnails', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/small.jpg" width="100" height="100" />
        <media:thumbnail url="https://example.com/large.jpg" width="400" height="400" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaThumbnails(item);

      expect(result).toHaveLength(2);
    });

    it('extracts thumbnails from media:group', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:group>
          <media:thumbnail url="https://example.com/grouped.jpg" />
        </media:group>
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaThumbnails(item);

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/grouped.jpg');
    });

    it('filters invalid URLs', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="" />
        <media:thumbnail url="https://example.com/valid.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaThumbnails(item);

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/valid.jpg');
    });

    it('resolves relative URLs when base URL provided', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="/images/thumb.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaThumbnails(item, { baseUrl: 'https://example.com' });

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/images/thumb.jpg');
    });
  });

  // ==========================================================================
  // Media Content Extraction Tests
  // ==========================================================================
  describe('extractMediaContent', () => {
    it('extracts media:content with image type', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/image.jpg" type="image/jpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/image.jpg');
      expect(result[0].source).toBe('media:content');
      expect(result[0].type).toBe('image/jpeg');
    });

    it('extracts media:content with medium="image"', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/photo.jpg" medium="image" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(1);
    });

    it('skips video content', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/video.mp4" type="video/mp4" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(0);
    });

    it('skips audio content', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/audio.mp3" type="audio/mpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(0);
    });

    it('extracts multiple image content elements', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/small.jpg" type="image/jpeg" width="100" />
        <media:content url="https://example.com/large.jpg" type="image/jpeg" width="800" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(2);
    });

    it('extracts from media:group', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:group>
          <media:content url="https://example.com/grouped.jpg" medium="image" />
        </media:group>
      </item>`;

      const item = getItemElement(xml);
      const result = extractMediaContent(item);

      expect(result).toHaveLength(1);
    });
  });

  // ==========================================================================
  // Enclosure Extraction Tests
  // ==========================================================================
  describe('extractEnclosureImages', () => {
    it('extracts image enclosures', () => {
      const xml = `<item>
        <enclosure url="https://example.com/image.jpg" type="image/jpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractEnclosureImages(item);

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/image.jpg');
      expect(result[0].source).toBe('enclosure');
    });

    it('extracts enclosures without type (optimistic)', () => {
      const xml = `<item>
        <enclosure url="https://example.com/image.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractEnclosureImages(item);

      expect(result).toHaveLength(1);
    });

    it('skips audio enclosures', () => {
      const xml = `<item>
        <enclosure url="https://example.com/podcast.mp3" type="audio/mpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractEnclosureImages(item);

      expect(result).toHaveLength(0);
    });

    it('skips video enclosures', () => {
      const xml = `<item>
        <enclosure url="https://example.com/video.mp4" type="video/mp4" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractEnclosureImages(item);

      expect(result).toHaveLength(0);
    });
  });

  // ==========================================================================
  // HTML Image Extraction Tests
  // ==========================================================================
  describe('extractImagesFromHtml', () => {
    it('extracts img src from HTML', () => {
      const html = '<p>Text</p><img src="https://example.com/photo.jpg" alt="Photo" />';
      const result = extractImagesFromHtml(html, 'content:encoded');

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/photo.jpg');
      expect(result[0].source).toBe('content:encoded');
    });

    it('extracts img with double quotes', () => {
      const html = '<img src="https://example.com/image.jpg">';
      const result = extractImagesFromHtml(html, 'description');

      expect(result).toHaveLength(1);
    });

    it('extracts img with single quotes', () => {
      const html = "<img src='https://example.com/image.jpg'>";
      const result = extractImagesFromHtml(html, 'description');

      expect(result).toHaveLength(1);
    });

    it('extracts multiple images', () => {
      const html = '<img src="https://example.com/1.jpg"><img src="https://example.com/2.jpg">';
      const result = extractImagesFromHtml(html, 'content:encoded');

      expect(result).toHaveLength(2);
    });

    it('extracts width and height from img tags', () => {
      const html = '<img src="https://example.com/image.jpg" width="800" height="600">';
      const result = extractImagesFromHtml(html, 'content:encoded');

      expect(result[0].width).toBe(800);
      expect(result[0].height).toBe(600);
    });

    it('handles img tags with various attribute orderings', () => {
      const html = '<img alt="Photo" src="https://example.com/image.jpg" class="photo">';
      const result = extractImagesFromHtml(html, 'content:encoded');

      expect(result).toHaveLength(1);
    });

    it('resolves relative URLs when base URL provided', () => {
      const html = '<img src="/images/photo.jpg">';
      const result = extractImagesFromHtml(html, 'description', { baseUrl: 'https://example.com' });

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/images/photo.jpg');
    });

    it('returns empty array for null/undefined', () => {
      expect(extractImagesFromHtml(null, 'description')).toEqual([]);
      expect(extractImagesFromHtml(undefined, 'description')).toEqual([]);
    });

    it('returns empty array for HTML without images', () => {
      const html = '<p>No images here</p>';
      const result = extractImagesFromHtml(html, 'description');

      expect(result).toHaveLength(0);
    });
  });

  // ==========================================================================
  // iTunes Image Extraction Tests
  // ==========================================================================
  describe('extractItunesImage', () => {
    it('extracts itunes:image href', () => {
      const xml = `<item xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <itunes:image href="https://example.com/podcast.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractItunesImage(item);

      expect(result).not.toBeNull();
      expect(result!.url).toBe('https://example.com/podcast.jpg');
      expect(result!.source).toBe('itunes:image');
    });

    it('returns null when no itunes:image present', () => {
      const xml = '<item><title>Test</title></item>';
      const item = getItemElement(xml);
      const result = extractItunesImage(item);

      expect(result).toBeNull();
    });

    it('filters invalid itunes:image URLs', () => {
      const xml = `<item xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <itunes:image href="" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractItunesImage(item);

      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // Channel Image Extraction Tests
  // ==========================================================================
  describe('extractChannelImage', () => {
    it('extracts standard RSS channel image', () => {
      const xml = `<channel>
        <title>Test Feed</title>
        <image>
          <url>https://example.com/logo.jpg</url>
          <title>Logo</title>
        </image>
      </channel>`;

      const doc = parseXml(`<rss>${xml}</rss>`);
      const channel = doc.querySelector('channel');
      const result = extractChannelImage(channel);

      expect(result).not.toBeNull();
      expect(result!.url).toBe('https://example.com/logo.jpg');
      expect(result!.source).toBe('channel');
    });

    it('extracts itunes:image from channel', () => {
      const xml = `<channel xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <title>Podcast</title>
        <itunes:image href="https://example.com/podcast-cover.jpg" />
      </channel>`;

      const doc = parseXml(`<rss>${xml}</rss>`);
      const channel = doc.querySelector('channel');
      const result = extractChannelImage(channel);

      expect(result).not.toBeNull();
      expect(result!.url).toBe('https://example.com/podcast-cover.jpg');
    });

    it('returns null for null channel', () => {
      const result = extractChannelImage(null);
      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // Best Image Selection Tests
  // ==========================================================================
  describe('selectBestImage', () => {
    it('returns null for empty array', () => {
      const result = selectBestImage([]);
      expect(result).toBeNull();
    });

    it('returns single image', () => {
      const images: ExtractedImage[] = [
        { url: 'https://example.com/image.jpg', source: 'media:thumbnail' },
      ];
      const result = selectBestImage(images);
      expect(result?.url).toBe('https://example.com/image.jpg');
    });

    it('prefers images meeting minimum size', () => {
      const images: ExtractedImage[] = [
        { url: 'https://example.com/small.jpg', source: 'media:thumbnail', width: 100, height: 100 },
        { url: 'https://example.com/large.jpg', source: 'media:thumbnail', width: 800, height: 600 },
      ];
      const result = selectBestImage(images, 400, 300);

      expect(result?.url).toBe('https://example.com/large.jpg');
    });

    it('prefers images with known dimensions', () => {
      const images: ExtractedImage[] = [
        { url: 'https://example.com/unknown.jpg', source: 'media:thumbnail' },
        { url: 'https://example.com/known.jpg', source: 'media:thumbnail', width: 400, height: 300 },
      ];
      const result = selectBestImage(images);

      expect(result?.url).toBe('https://example.com/known.jpg');
    });

    it('returns first image when no size preference', () => {
      const images: ExtractedImage[] = [
        { url: 'https://example.com/first.jpg', source: 'media:thumbnail' },
        { url: 'https://example.com/second.jpg', source: 'media:thumbnail' },
      ];
      const result = selectBestImage(images, 0, 0);

      expect(result?.url).toBe('https://example.com/first.jpg');
    });
  });

  // ==========================================================================
  // Priority Chain Tests
  // ==========================================================================
  describe('extractImage (priority chain)', () => {
    it('prefers media:thumbnail over media:content', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/thumb.jpg" />
        <media:content url="https://example.com/content.jpg" type="image/jpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/thumb.jpg');
      expect(result?.source).toBe('media:thumbnail');
    });

    it('prefers media:content over enclosure', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:content url="https://example.com/media.jpg" type="image/jpeg" />
        <enclosure url="https://example.com/enclosure.jpg" type="image/jpeg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/media.jpg');
      expect(result?.source).toBe('media:content');
    });

    it('prefers enclosure over content:encoded images', () => {
      const xml = `<item xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <enclosure url="https://example.com/enclosure.jpg" type="image/jpeg" />
        <content:encoded><![CDATA[<img src="https://example.com/inline.jpg" />]]></content:encoded>
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/enclosure.jpg');
      expect(result?.source).toBe('enclosure');
    });

    it('prefers content:encoded images over description images', () => {
      const xml = `<item xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <content:encoded><![CDATA[<img src="https://example.com/content.jpg" />]]></content:encoded>
        <description><![CDATA[<img src="https://example.com/desc.jpg" />]]></description>
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/content.jpg');
      expect(result?.source).toBe('content:encoded');
    });

    it('prefers description images over itunes:image', () => {
      const xml = `<item xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <description><![CDATA[<img src="https://example.com/desc.jpg" />]]></description>
        <itunes:image href="https://example.com/itunes.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/desc.jpg');
      expect(result?.source).toBe('description');
    });

    it('uses itunes:image when no other images available', () => {
      const xml = `<item xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <title>Episode</title>
        <itunes:image href="https://example.com/itunes.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://example.com/itunes.jpg');
      expect(result?.source).toBe('itunes:image');
    });

    it('uses channel image as fallback', () => {
      const itemXml = `<item><title>No image item</title></item>`;
      const channelXml = `<channel>
        <title>Feed</title>
        <image><url>https://example.com/channel.jpg</url></image>
      </channel>`;

      const itemDoc = parseXml(`<rss>${channelXml}${itemXml}</rss>`);
      const item = itemDoc.querySelector('item')!;
      const channel = itemDoc.querySelector('channel');

      const result = extractImage(item, { channelElement: channel });

      expect(result?.url).toBe('https://example.com/channel.jpg');
      expect(result?.source).toBe('channel');
    });

    it('uses configured fallback image when no other images', () => {
      const xml = '<item><title>No images</title></item>';
      const item = getItemElement(xml);

      const result = extractImage(item, {
        fallbackImageUrl: 'https://example.com/fallback.jpg',
      });

      expect(result?.url).toBe('https://example.com/fallback.jpg');
      expect(result?.source).toBe('fallback');
    });

    it('returns null when no images and no fallback', () => {
      const xml = '<item><title>No images</title></item>';
      const item = getItemElement(xml);

      const result = extractImage(item);

      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // Integration / Real-world Tests
  // ==========================================================================
  describe('real-world feeds', () => {
    it('handles Meltwater-style feeds', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <title>News Article</title>
        <link>https://news.example.com/article</link>
        <media:thumbnail url="https://img.example.com/thumb-400.jpg" width="400" height="300" />
        <media:thumbnail url="https://img.example.com/thumb-100.jpg" width="100" height="75" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item, { preferredMinWidth: 200 });

      expect(result?.url).toBe('https://img.example.com/thumb-400.jpg');
    });

    it('handles YouTube-style media content', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <title>Video Title</title>
        <media:group>
          <media:content url="https://youtube.com/watch?v=xyz" type="application/x-shockwave-flash" />
          <media:thumbnail url="https://i.ytimg.com/vi/xyz/hqdefault.jpg" width="480" height="360" />
        </media:group>
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://i.ytimg.com/vi/xyz/hqdefault.jpg');
      expect(result?.source).toBe('media:thumbnail');
    });

    it('handles podcast feeds with itunes namespace', () => {
      const xml = `<item xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <title>Episode 42</title>
        <enclosure url="https://podcast.com/ep42.mp3" type="audio/mpeg" />
        <itunes:image href="https://podcast.com/artwork.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://podcast.com/artwork.jpg');
      expect(result?.source).toBe('itunes:image');
    });

    it('handles blog feeds with inline images', () => {
      const xml = `<item xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <title>Blog Post</title>
        <description>Short excerpt...</description>
        <content:encoded><![CDATA[
          <figure>
            <img src="https://blog.example.com/featured.jpg" width="1200" height="630" />
            <figcaption>Featured image</figcaption>
          </figure>
          <p>Article content...</p>
        ]]></content:encoded>
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://blog.example.com/featured.jpg');
      expect(result?.source).toBe('content:encoded');
    });

    it('handles WordPress feeds with wp-block-image figures (sentralregisteret.no style)', () => {
      const xml = `<item xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <title>Besøk hos Volvo Maskin</title>
        <description><![CDATA[<p>Maskinregisteret hadde gleden av å besøke...</p>]]></description>
        <content:encoded><![CDATA[
<figure class="wp-block-image size-large"><img fetchpriority="high" decoding="async" width="1024" height="768" src="https://sentralregisteret.no/wp-content/uploads/2025/10/IMG_1956-1024x768.jpg" alt="" class="wp-image-5068" srcset="https://sentralregisteret.no/wp-content/uploads/2025/10/IMG_1956-1024x768.jpg 1024w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
<p>Article content...</p>
]]></content:encoded>
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toBe('https://sentralregisteret.no/wp-content/uploads/2025/10/IMG_1956-1024x768.jpg');
      expect(result?.source).toBe('content:encoded');
      expect(result?.width).toBe(1024);
      expect(result?.height).toBe(768);
    });

    it('handles Atom feeds', () => {
      const xml = `<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
        <title>Atom Entry</title>
        <link href="https://example.com/entry" />
        <content type="html"><![CDATA[<img src="https://example.com/atom-image.jpg" />]]></content>
      </entry>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      // For Atom, content is checked as description fallback
      expect(result?.url).toBe('https://example.com/atom-image.jpg');
    });
  });

  // ==========================================================================
  // Convenience Function Tests
  // ==========================================================================
  describe('extractImageUrl', () => {
    it('returns URL string directly', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/thumb.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImageUrl(item);

      expect(result).toBe('https://example.com/thumb.jpg');
    });

    it('returns undefined when no image found', () => {
      const xml = '<item><title>No image</title></item>';
      const item = getItemElement(xml);
      const result = extractImageUrl(item);

      expect(result).toBeUndefined();
    });
  });

  describe('findImage (legacy)', () => {
    it('maintains backwards compatibility', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/thumb.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = findImage(item);

      expect(result).toBe('https://example.com/thumb.jpg');
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================
  describe('edge cases', () => {
    it('handles items with no children', () => {
      const xml = '<item></item>';
      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result).toBeNull();
    });

    it('handles malformed img tags gracefully', () => {
      const html = '<img src=broken>';
      const result = extractImagesFromHtml(html, 'description');

      // Should not crash, may or may not extract
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles very long HTML content', () => {
      const html = '<p>Text</p>'.repeat(1000) + '<img src="https://example.com/deep.jpg">';
      const result = extractImagesFromHtml(html, 'content:encoded');

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://example.com/deep.jpg');
    });

    it('handles special characters in URLs', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/image%20with%20spaces.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result?.url).toContain('image%20with%20spaces');
    });

    it('handles unicode in URLs', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/日本語.jpg" />
      </item>`;

      const item = getItemElement(xml);
      const result = extractImage(item);

      expect(result).not.toBeNull();
    });
  });
});
