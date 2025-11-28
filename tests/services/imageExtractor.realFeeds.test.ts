/**
 * Real-world Feed Image Extraction Tests (ST-003-04)
 *
 * Tests image extraction with actual RSS feed structures from:
 * - Computas (WordPress blog with content:encoded images)
 * - Retriever (news aggregator with channel image only)
 * - Meltwater-style (media:thumbnail with multiple sizes)
 */

import {
  extractImage,
  extractImageUrl,
  extractChannelImage,
  ImageExtractionOptions,
} from '../../src/webparts/polRssGallery/services/imageExtractor';

function parseXml(xml: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
}

describe('ImageExtractor - Real-world Feeds', () => {
  // ==========================================================================
  // Computas-style WordPress Feed
  // ==========================================================================
  describe('Computas-style feed (WordPress with content:encoded)', () => {
    const computasFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Computas</title>
    <link>https://computas.com/</link>
    <description>IT-tjenester og rådgivning</description>
    <image>
      <url>https://i0.wp.com/computas.com/wp-content/uploads/2020/11/cropped-logo-copy-1.png?fit=32%2C32&amp;ssl=1</url>
      <title>Computas</title>
      <link>https://computas.com/</link>
      <width>32</width>
      <height>32</height>
    </image>
    <item>
      <title>Fra smart student til superkonsultent</title>
      <link>https://computas.com/artikkel/fra-smart-student/</link>
      <dc:creator><![CDATA[editor@computas.com]]></dc:creator>
      <pubDate>Tue, 25 Nov 2025 15:04:40 +0000</pubDate>
      <category><![CDATA[Artikkel]]></category>
      <description><![CDATA[<p>Å starte karrieren som konsulent er et sjakktrekk!</p>]]></description>
      <content:encoded><![CDATA[
<p class="has-large-font-size">Å starte karrieren som konsulent er et sjakktrekk!</p>
<figure class="wp-block-image size-large">
  <img decoding="async" width="1024" height="615"
    src="https://i0.wp.com/computas.com/wp-content/uploads/2025/08/NXT_kullet.jpg?resize=1024%2C615&ssl=1"
    alt="NXT kullet"
    srcset="https://i0.wp.com/computas.com/wp-content/uploads/2025/08/NXT_kullet.jpg?resize=1024%2C615&ssl=1 1024w,
            https://i0.wp.com/computas.com/wp-content/uploads/2025/08/NXT_kullet.jpg?resize=300%2C180&ssl=1 300w" />
  <figcaption>Her er årets NXT-kull</figcaption>
</figure>
<p>I august ønsket vi 9 nyutdannede velkommen.</p>
      ]]></content:encoded>
    </item>
    <item>
      <title>Artikkel uten bilde</title>
      <link>https://computas.com/artikkel/no-image/</link>
      <description><![CDATA[<p>En artikkel uten bilder.</p>]]></description>
      <content:encoded><![CDATA[<p>Bare tekst her, ingen bilder.</p>]]></content:encoded>
    </item>
  </channel>
</rss>`;

    it('extracts image from content:encoded', () => {
      const doc = parseXml(computasFeed);
      const items = doc.querySelectorAll('item');
      const channel = doc.querySelector('channel');

      const result = extractImage(items[0], { channelElement: channel });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('content:encoded');
      expect(result!.url).toContain('NXT_kullet.jpg');
    });

    it('falls back to channel image when item has no image', () => {
      const doc = parseXml(computasFeed);
      const items = doc.querySelectorAll('item');
      const channel = doc.querySelector('channel');

      const result = extractImage(items[1], { channelElement: channel });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('channel');
      expect(result!.url).toContain('cropped-logo-copy-1.png');
    });

    it('extracts channel image correctly', () => {
      const doc = parseXml(computasFeed);
      const channel = doc.querySelector('channel');

      const result = extractChannelImage(channel);

      expect(result).not.toBeNull();
      expect(result!.url).toContain('cropped-logo-copy-1.png');
    });
  });

  // ==========================================================================
  // Retriever-style News Aggregator Feed
  // ==========================================================================
  describe('Retriever-style feed (news aggregator, channel image only)', () => {
    const retrieverFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:ret="http://www.retriever-info.com">
  <channel>
    <title>Intranett</title>
    <link>https://www.retriever-info.com</link>
    <description>RSS 2.0 News feed from Retriever Norge AS</description>
    <image>
      <title>Retriever</title>
      <url>https://www.retriever-info.com/gfx/logo/retriever_logo.jpg</url>
      <link>https://www.retriever-info.com</link>
    </image>
    <item>
      <title>Bygger datasentre i Vennesla</title>
      <link>https://nogo.retriever-info.com/prod?a=79312&amp;d=00232020251125</link>
      <description>Vi har planer om å investere 40 milliarder i dataparken.</description>
      <pubDate>Tue, 25 Nov 2025 09:45:14 GMT</pubDate>
      <author>Finansavisen.no</author>
      <ret:source>Finansavisen.no</ret:source>
      <ret:imgtext>KJEMPEEMISJONER: Peder Nørbø i Bulk Infrastructure FOTO: Storm Gulbrandsen</ret:imgtext>
    </item>
    <item>
      <title>Store fondstap etter Novo Nordisk-smell</title>
      <link>https://nogo.retriever-info.com/prod?a=79312&amp;d=0201222025112564</link>
      <description>Fondsforvaltere som har satset på aksjen.</description>
      <pubDate>Tue, 25 Nov 2025 02:00:00 GMT</pubDate>
      <author>Finansavisen</author>
    </item>
  </channel>
</rss>`;

    it('uses channel image as fallback when items have no images', () => {
      const doc = parseXml(retrieverFeed);
      const items = doc.querySelectorAll('item');
      const channel = doc.querySelector('channel');

      const result = extractImage(items[0], { channelElement: channel });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('channel');
      expect(result!.url).toBe('https://www.retriever-info.com/gfx/logo/retriever_logo.jpg');
    });

    it('returns fallback image when no channel image either', () => {
      const doc = parseXml(retrieverFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0], {
        fallbackImageUrl: 'https://example.com/fallback.jpg',
        // No channel element provided
      });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('fallback');
      expect(result!.url).toBe('https://example.com/fallback.jpg');
    });
  });

  // ==========================================================================
  // Meltwater-style Media Feed
  // ==========================================================================
  describe('Meltwater-style feed (media:thumbnail with sizes)', () => {
    const meltwaterFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Meltwater News Feed</title>
    <link>https://www.meltwater.com</link>
    <description>News monitoring feed</description>
    <item>
      <title>News Article with Multiple Thumbnails</title>
      <link>https://example.com/article-1</link>
      <description>Article description text</description>
      <pubDate>Tue, 26 Nov 2025 10:00:00 +0100</pubDate>
      <media:thumbnail url="https://img.example.com/thumb-100.jpg" width="100" height="75" />
      <media:thumbnail url="https://img.example.com/thumb-400.jpg" width="400" height="300" />
      <media:thumbnail url="https://img.example.com/thumb-800.jpg" width="800" height="600" />
      <dc:creator>Journalist Name</dc:creator>
    </item>
    <item>
      <title>Video Article with Thumbnail</title>
      <link>https://example.com/article-2</link>
      <description>Video article</description>
      <media:content url="https://video.example.com/video.mp4" type="video/mp4" />
      <media:thumbnail url="https://img.example.com/video-thumb.jpg" width="480" height="360" />
    </item>
    <item>
      <title>Article with Image in Description</title>
      <link>https://example.com/article-3</link>
      <description><![CDATA[<p>Text <img src="https://img.example.com/inline.jpg" /> more text</p>]]></description>
    </item>
    <item>
      <title>Article with media:content image</title>
      <link>https://example.com/article-4</link>
      <description>Simple description</description>
      <media:content url="https://img.example.com/media-content.jpg" type="image/jpeg" medium="image" width="600" height="400" />
    </item>
  </channel>
</rss>`;

    it('extracts media:thumbnail as primary source', () => {
      const doc = parseXml(meltwaterFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0]);

      expect(result).not.toBeNull();
      expect(result!.source).toBe('media:thumbnail');
      // Should prefer larger thumbnail when preferredMinWidth is set
    });

    it('prefers larger thumbnails with size preference', () => {
      const doc = parseXml(meltwaterFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0], { preferredMinWidth: 300 });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('media:thumbnail');
      // Should select 400x300 or 800x600, not 100x75
      expect(result!.width).toBeGreaterThanOrEqual(300);
    });

    it('extracts thumbnail from video item (not video URL)', () => {
      const doc = parseXml(meltwaterFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[1]);

      expect(result).not.toBeNull();
      expect(result!.source).toBe('media:thumbnail');
      expect(result!.url).toContain('video-thumb.jpg');
      expect(result!.url).not.toContain('.mp4');
    });

    it('extracts image from description HTML', () => {
      const doc = parseXml(meltwaterFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[2]);

      expect(result).not.toBeNull();
      expect(result!.source).toBe('description');
      expect(result!.url).toContain('inline.jpg');
    });

    it('extracts image from media:content with image type', () => {
      const doc = parseXml(meltwaterFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[3]);

      expect(result).not.toBeNull();
      expect(result!.source).toBe('media:content');
      expect(result!.url).toContain('media-content.jpg');
    });
  });

  // ==========================================================================
  // YouTube-style Media Feed (media:group)
  // ==========================================================================
  describe('YouTube-style feed (media:group)', () => {
    const youtubeFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>YouTube Channel</title>
    <link>https://www.youtube.com/channel/UCXXX</link>
    <item>
      <title>Video Title</title>
      <link>https://www.youtube.com/watch?v=abc123</link>
      <description>Video description</description>
      <media:group>
        <media:content url="https://www.youtube.com/v/abc123" type="application/x-shockwave-flash" />
        <media:thumbnail url="https://i.ytimg.com/vi/abc123/default.jpg" width="120" height="90" />
        <media:thumbnail url="https://i.ytimg.com/vi/abc123/mqdefault.jpg" width="320" height="180" />
        <media:thumbnail url="https://i.ytimg.com/vi/abc123/hqdefault.jpg" width="480" height="360" />
      </media:group>
    </item>
  </channel>
</rss>`;

    it('extracts thumbnail from media:group', () => {
      const doc = parseXml(youtubeFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0]);

      expect(result).not.toBeNull();
      expect(result!.source).toBe('media:thumbnail');
      expect(result!.url).toContain('ytimg.com');
    });

    it('does not return video URL as image', () => {
      const doc = parseXml(youtubeFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0]);

      expect(result!.url).not.toContain('shockwave-flash');
      expect(result!.url).not.toContain('/v/abc123');
    });

    it('prefers larger YouTube thumbnail with size preference', () => {
      const doc = parseXml(youtubeFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0], { preferredMinWidth: 300 });

      expect(result).not.toBeNull();
      // Should select mqdefault (320x180) or hqdefault (480x360)
      expect(result!.width).toBeGreaterThanOrEqual(300);
    });
  });

  // ==========================================================================
  // Podcast Feed (iTunes namespace)
  // ==========================================================================
  describe('Podcast feed (iTunes namespace)', () => {
    const podcastFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Tech Podcast</title>
    <link>https://podcast.example.com</link>
    <itunes:image href="https://podcast.example.com/cover-3000x3000.jpg" />
    <itunes:author>Podcast Host</itunes:author>
    <item>
      <title>Episode 42: AI in 2025</title>
      <link>https://podcast.example.com/ep42</link>
      <description>Discussion about AI trends.</description>
      <enclosure url="https://podcast.example.com/ep42.mp3" type="audio/mpeg" length="50000000" />
      <itunes:image href="https://podcast.example.com/ep42-cover.jpg" />
      <itunes:duration>01:23:45</itunes:duration>
    </item>
    <item>
      <title>Episode 41: Web Development</title>
      <link>https://podcast.example.com/ep41</link>
      <description>Web development discussion.</description>
      <enclosure url="https://podcast.example.com/ep41.mp3" type="audio/mpeg" />
      <!-- No episode-specific image, should use channel image -->
    </item>
  </channel>
</rss>`;

    it('extracts itunes:image from episode', () => {
      const doc = parseXml(podcastFeed);
      const items = doc.querySelectorAll('item');
      const channel = doc.querySelector('channel');

      const result = extractImage(items[0], { channelElement: channel });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('itunes:image');
      expect(result!.url).toContain('ep42-cover.jpg');
    });

    it('does not return audio enclosure as image', () => {
      const doc = parseXml(podcastFeed);
      const items = doc.querySelectorAll('item');

      const result = extractImage(items[0]);

      expect(result!.url).not.toContain('.mp3');
    });

    it('falls back to channel itunes:image when episode has no image', () => {
      const doc = parseXml(podcastFeed);
      const items = doc.querySelectorAll('item');
      const channel = doc.querySelector('channel');

      const result = extractImage(items[1], { channelElement: channel });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('channel');
      expect(result!.url).toContain('cover-3000x3000.jpg');
    });
  });

  // ==========================================================================
  // Edge Cases from Real Feeds
  // ==========================================================================
  describe('Edge cases from real feeds', () => {
    it('handles WordPress srcset attributes without breaking', () => {
      const xml = `<item xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <content:encoded><![CDATA[
          <img src="https://example.com/image.jpg?resize=1024%2C615"
               srcset="https://example.com/image.jpg?resize=1024%2C615 1024w,
                       https://example.com/image.jpg?resize=300%2C180 300w"
               sizes="(max-width: 1000px) 100vw, 1000px" />
        ]]></content:encoded>
      </item>`;

      const doc = parseXml(`<rss>${xml}</rss>`);
      const item = doc.querySelector('item')!;

      const result = extractImage(item);

      expect(result).not.toBeNull();
      expect(result!.url).toContain('image.jpg');
    });

    it('handles encoded ampersands in URLs', () => {
      const xml = `<item xmlns:media="http://search.yahoo.com/mrss/">
        <media:thumbnail url="https://example.com/image.jpg?w=100&amp;h=100&amp;fit=crop" />
      </item>`;

      const doc = parseXml(`<rss>${xml}</rss>`);
      const item = doc.querySelector('item')!;

      const result = extractImage(item);

      expect(result).not.toBeNull();
      // URL should be properly decoded/handled
      expect(result!.url).toContain('image.jpg');
    });

    it('handles ISO-8859-1 encoded feeds (like Retriever)', () => {
      // Note: In JS, the DOMParser typically handles encoding, but content may have issues
      const xml = `<item>
        <title>Sjefene i statsbedriftene har lønnsfest</title>
        <description>Norske bedrifter med årsrapport.</description>
      </item>`;

      const doc = parseXml(`<rss><channel>${xml}</channel></rss>`);
      const item = doc.querySelector('item')!;

      // Should not crash, even if item has no image
      const result = extractImage(item, { fallbackImageUrl: 'https://fallback.com/img.jpg' });

      expect(result).not.toBeNull();
      expect(result!.source).toBe('fallback');
    });

    it('handles ret: namespace elements gracefully', () => {
      const xml = `<item xmlns:ret="http://www.retriever-info.com">
        <title>News Article</title>
        <ret:imgtext>Photo caption FOTO: Photographer</ret:imgtext>
        <ret:pdfurl>https://retriever.com/pdf</ret:pdfurl>
      </item>`;

      const doc = parseXml(`<rss><channel>${xml}</channel></rss>`);
      const item = doc.querySelector('item')!;

      // ret:imgtext is NOT an image URL - should return null or fallback
      const result = extractImage(item);

      expect(result).toBeNull();
    });
  });
});
