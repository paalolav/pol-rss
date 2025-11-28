/**
 * Feed Test Data
 *
 * Sample RSS and Atom feed XML for testing the parser and components.
 */

import { IRssItem } from '../../src/webparts/polRssGallery/components/IRssItem';

/**
 * Standard RSS 2.0 feed
 */
export const rss2StandardXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test RSS Feed</title>
    <link>https://example.com</link>
    <description>A test RSS feed for unit testing</description>
    <language>en-US</language>
    <lastBuildDate>Sun, 24 Nov 2025 12:00:00 GMT</lastBuildDate>
    <item>
      <title>First Article</title>
      <link>https://example.com/article-1</link>
      <description>This is the first article description.</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
      <guid>https://example.com/article-1</guid>
      <category>News</category>
      <category>Technology</category>
    </item>
    <item>
      <title>Second Article</title>
      <link>https://example.com/article-2</link>
      <description>This is the second article description.</description>
      <pubDate>Sat, 23 Nov 2025 15:30:00 GMT</pubDate>
      <guid>https://example.com/article-2</guid>
      <category>Sports</category>
    </item>
    <item>
      <title>Third Article</title>
      <link>https://example.com/article-3</link>
      <description><![CDATA[<p>This article has <strong>HTML</strong> content.</p>]]></description>
      <pubDate>Fri, 22 Nov 2025 09:00:00 GMT</pubDate>
      <guid>https://example.com/article-3</guid>
    </item>
  </channel>
</rss>`;

/**
 * RSS 2.0 with media namespace (images)
 */
export const rss2WithMediaXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Media RSS Feed</title>
    <link>https://example.com</link>
    <description>RSS feed with media elements</description>
    <item>
      <title>Article with Image</title>
      <link>https://example.com/article-image</link>
      <description>Article with media thumbnail</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
      <media:thumbnail url="https://example.com/images/thumb.jpg" width="120" height="90" />
      <media:content url="https://example.com/images/full.jpg" type="image/jpeg" width="800" height="600" />
    </item>
    <item>
      <title>Article with Enclosure</title>
      <link>https://example.com/article-enclosure</link>
      <description>Article with enclosure image</description>
      <pubDate>Sat, 23 Nov 2025 12:00:00 GMT</pubDate>
      <enclosure url="https://example.com/images/enclosure.jpg" type="image/jpeg" length="12345" />
    </item>
  </channel>
</rss>`;

/**
 * RSS 2.0 with content:encoded (full HTML content)
 */
export const rss2WithContentEncodedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Content Encoded Feed</title>
    <link>https://example.com</link>
    <description>RSS feed with content:encoded</description>
    <item>
      <title>Rich Content Article</title>
      <link>https://example.com/rich-article</link>
      <description>Short description</description>
      <content:encoded><![CDATA[
        <div class="article">
          <img src="https://example.com/images/inline.jpg" alt="Inline image" />
          <p>This is the full article content with HTML markup.</p>
          <p>It includes <a href="https://example.com">links</a> and formatting.</p>
        </div>
      ]]></content:encoded>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

/**
 * WordPress-style RSS with wp-block-image figures (sentralregisteret.no style)
 */
export const wordpressRssWithFiguresXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>WordPress Blog</title>
  <link>https://example.com</link>
  <description>WordPress RSS feed with wp-block-image</description>
  <item>
    <title>Article 1 with Figure</title>
    <link>https://example.com/article-1</link>
    <dc:creator><![CDATA[author1]]></dc:creator>
    <pubDate>Fri, 31 Oct 2025 13:35:57 +0000</pubDate>
    <description><![CDATA[<p>Short excerpt without image...</p>]]></description>
    <content:encoded><![CDATA[
<figure class="wp-block-image size-large"><img fetchpriority="high" decoding="async" width="1024" height="768" src="https://example.com/uploads/article1-image.jpg" alt="" class="wp-image-5068" srcset="https://example.com/uploads/article1-image.jpg 1024w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
<p>Full article content here...</p>
]]></content:encoded>
  </item>
  <item>
    <title>Article 2 with Figure</title>
    <link>https://example.com/article-2</link>
    <dc:creator><![CDATA[author2]]></dc:creator>
    <pubDate>Wed, 29 Oct 2025 10:00:00 +0000</pubDate>
    <description><![CDATA[<p>Another short excerpt...</p>]]></description>
    <content:encoded><![CDATA[
<figure class="wp-block-image size-large"><img width="800" height="600" src="https://example.com/uploads/article2-image.jpg" alt="Article 2 featured" /></figure>
<p>Second article content...</p>
]]></content:encoded>
  </item>
  <item>
    <title>Article 3 without image</title>
    <link>https://example.com/article-3</link>
    <dc:creator><![CDATA[author3]]></dc:creator>
    <pubDate>Mon, 27 Oct 2025 08:00:00 +0000</pubDate>
    <description><![CDATA[<p>This article has no image...</p>]]></description>
    <content:encoded><![CDATA[
<p>Just text content, no images in this one.</p>
]]></content:encoded>
  </item>
</channel>
</rss>`;

/**
 * Atom 1.0 feed
 */
export const atom1StandardXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test Atom Feed</title>
  <link href="https://example.com" />
  <link href="https://example.com/feed.atom" rel="self" />
  <id>urn:uuid:feed-id-1234</id>
  <updated>2025-11-24T12:00:00Z</updated>
  <author>
    <name>Test Author</name>
    <email>author@example.com</email>
  </author>
  <entry>
    <title>First Atom Entry</title>
    <link href="https://example.com/entry-1" />
    <id>urn:uuid:entry-1</id>
    <updated>2025-11-24T10:00:00Z</updated>
    <published>2025-11-24T10:00:00Z</published>
    <summary>Short summary of the first entry</summary>
    <content type="html"><![CDATA[<p>Full HTML content of the first entry.</p>]]></content>
    <category term="News" />
    <category term="Technology" />
  </entry>
  <entry>
    <title>Second Atom Entry</title>
    <link href="https://example.com/entry-2" />
    <id>urn:uuid:entry-2</id>
    <updated>2025-11-23T15:00:00Z</updated>
    <summary>Summary of the second entry</summary>
  </entry>
</feed>`;

/**
 * RSS 1.0 (RDF) feed
 */
export const rss1RdfXml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel rdf:about="https://example.com/rdf">
    <title>Test RDF Feed</title>
    <link>https://example.com</link>
    <description>RSS 1.0 RDF feed</description>
    <items>
      <rdf:Seq>
        <rdf:li rdf:resource="https://example.com/rdf-1" />
        <rdf:li rdf:resource="https://example.com/rdf-2" />
      </rdf:Seq>
    </items>
  </channel>
  <item rdf:about="https://example.com/rdf-1">
    <title>RDF Item One</title>
    <link>https://example.com/rdf-1</link>
    <description>First RDF item</description>
    <dc:date>2025-11-24T10:00:00Z</dc:date>
    <dc:creator>Author Name</dc:creator>
  </item>
  <item rdf:about="https://example.com/rdf-2">
    <title>RDF Item Two</title>
    <link>https://example.com/rdf-2</link>
    <description>Second RDF item</description>
    <dc:date>2025-11-23T10:00:00Z</dc:date>
  </item>
</rdf:RDF>`;

/**
 * Minimal RSS feed (missing optional elements)
 */
export const rss2MinimalXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Minimal Feed</title>
    <link>https://example.com</link>
    <description>Minimal feed</description>
    <item>
      <title>Minimal Item</title>
      <link>https://example.com/minimal</link>
    </item>
  </channel>
</rss>`;

/**
 * Malformed XML (missing closing tag)
 */
export const malformedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Malformed Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Broken Item
      <link>https://example.com/broken</link>
    </item>
  </channel>
</rss>`;

/**
 * Feed with unusual date formats
 */
export const rss2UnusualDatesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Date Test Feed</title>
    <link>https://example.com</link>
    <description>Feed with various date formats</description>
    <item>
      <title>RFC 822 Date</title>
      <link>https://example.com/rfc822</link>
      <pubDate>Sun, 24 Nov 2025 10:00:00 +0100</pubDate>
    </item>
    <item>
      <title>ISO 8601 Date</title>
      <link>https://example.com/iso8601</link>
      <pubDate>2025-11-24T10:00:00Z</pubDate>
    </item>
    <item>
      <title>Non-Standard Date</title>
      <link>https://example.com/nonstandard</link>
      <pubDate>November 24, 2025</pubDate>
    </item>
    <item>
      <title>Invalid Date</title>
      <link>https://example.com/invalid</link>
      <pubDate>not a date</pubDate>
    </item>
  </channel>
</rss>`;

/**
 * Empty feed (no items)
 */
export const rss2EmptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Empty Feed</title>
    <link>https://example.com</link>
    <description>Feed with no items</description>
  </channel>
</rss>`;

/**
 * Feed with double-encoded entities
 */
export const rss2DoubleEncodedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Entity Test Feed</title>
    <link>https://example.com</link>
    <description>Feed with entity encoding issues</description>
    <item>
      <title>Article &amp;amp; More</title>
      <link>https://example.com/entities</link>
      <description>&amp;lt;p&amp;gt;Double encoded HTML&amp;lt;/p&amp;gt;</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

/**
 * Feed with comprehensive XML entity examples (ST-003-03)
 */
export const rss2XmlEntitiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>XML Entities Test Feed</title>
    <link>https://example.com</link>
    <description>Feed testing various XML entity encodings</description>
    <item>
      <title>Standard XML Entities: &lt;tag&gt; &amp; &quot;quotes&quot;</title>
      <link>https://example.com/xml-entities</link>
      <description>Testing &lt;p&gt;HTML in text&lt;/p&gt; and &apos;apostrophes&apos;</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Numeric Entities: Price &#36;100</title>
      <link>https://example.com/numeric-entities</link>
      <description>Copyright &#169; 2025 &#8212; All rights reserved</description>
    </item>
    <item>
      <title>Hex Entities: &#x3C;code&#x3E;</title>
      <link>https://example.com/hex-entities</link>
      <description>Using hex: &#x24;50 &#x2014; discount</description>
    </item>
    <item>
      <title>Norwegian: V&#229;rt Land &#8211; Nyheter</title>
      <link>https://example.com/norwegian</link>
      <description>&#197;rets beste &#248;yeblikk fra &#198;render</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with HTML named entities
 */
export const rss2HtmlEntitiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>HTML Entities Test Feed</title>
    <link>https://example.com</link>
    <description>Feed testing HTML named entities</description>
    <item>
      <title>Typography: &ldquo;Smart Quotes&rdquo; &ndash; News</title>
      <link>https://example.com/typography</link>
      <description>Using &lsquo;single quotes&rsquo; and &hellip; ellipsis</description>
    </item>
    <item>
      <title>Currency: &euro;100 &pound;80 &yen;15000</title>
      <link>https://example.com/currency</link>
      <description>Price: &cent;99 per item</description>
    </item>
    <item>
      <title>Symbols: &copy; 2025 &reg; &trade;</title>
      <link>https://example.com/symbols</link>
      <description>Temperature: 20&deg;C &plusmn; 2&deg;</description>
    </item>
    <item>
      <title>Math: 2 &times; 3 &divide; 2 = 3</title>
      <link>https://example.com/math</link>
      <description>Fractions: &frac14; + &frac12; = &frac34;</description>
    </item>
    <item>
      <title>Spacing: Hello&nbsp;World</title>
      <link>https://example.com/spacing</link>
      <description>Non-breaking&nbsp;space&nbsp;test</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with triple-encoded entities (severe proxy issues)
 */
export const rss2TripleEncodedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Triple Encoded Feed</title>
    <link>https://example.com</link>
    <description>Feed with severe encoding issues</description>
    <item>
      <title>Breaking &amp;amp;amp; News</title>
      <link>https://example.com/triple</link>
      <description>&amp;amp;lt;p&amp;amp;gt;Triple encoded&amp;amp;lt;/p&amp;amp;gt;</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with CDATA containing entities
 */
export const rss2CdataEntitiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CDATA Entities Feed</title>
    <link>https://example.com</link>
    <description>Testing CDATA with entities</description>
    <item>
      <title>CDATA Test</title>
      <link>https://example.com/cdata</link>
      <description><![CDATA[<p>HTML content with &amp; ampersand and &nbsp; space</p>]]></description>
    </item>
    <item>
      <title>Mixed CDATA</title>
      <link>https://example.com/mixed</link>
      <description><![CDATA[Price: $100 &mdash; Special &ldquo;offer&rdquo;]]></description>
    </item>
  </channel>
</rss>`;

/**
 * Create mock RSS items for component testing
 */
export const createMockRssItems = (count: number = 5): IRssItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Test Article ${i + 1}`,
    link: `https://example.com/article-${i + 1}`,
    description: `This is the description for test article ${i + 1}. It contains some sample text.`,
    pubDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Each day older
    imageUrl: i % 2 === 0 ? `https://example.com/images/article-${i + 1}.jpg` : undefined,
    categories: i % 3 === 0 ? ['News', 'Technology'] : i % 3 === 1 ? ['Sports'] : [],
    author: `Author ${i + 1}`,
  }));

/**
 * Create a single mock RSS item with customization
 */
export const createMockRssItem = (overrides?: Partial<IRssItem>): IRssItem => ({
  id: 'mock-item-1',
  title: 'Mock Article Title',
  link: 'https://example.com/mock-article',
  description: 'This is a mock article description for testing purposes.',
  pubDate: new Date('2025-11-24T10:00:00Z'),
  imageUrl: 'https://example.com/images/mock.jpg',
  categories: ['Test', 'Mock'],
  author: 'Test Author',
  ...overrides,
});

/**
 * Expected parsed result for rss2StandardXml
 */
export const expectedRss2StandardParsed = {
  title: 'Test RSS Feed',
  description: 'A test RSS feed for unit testing',
  link: 'https://example.com',
  language: 'en-US',
  itemCount: 3,
  items: [
    {
      title: 'First Article',
      link: 'https://example.com/article-1',
      categories: ['News', 'Technology'],
    },
    {
      title: 'Second Article',
      link: 'https://example.com/article-2',
      categories: ['Sports'],
    },
    {
      title: 'Third Article',
      link: 'https://example.com/article-3',
      categories: [],
    },
  ],
};

/**
 * Feed URLs for integration testing (real feeds that should be stable)
 */
export const stableFeedUrls = {
  nrk: 'https://www.nrk.no/toppsaker.rss',
  bbc: 'https://feeds.bbci.co.uk/news/rss.xml',
  reddit: 'https://www.reddit.com/r/javascript/.rss',
};

// ============================================================================
// Additional Test Fixtures for Comprehensive Feed Parser Testing (REF-003)
// ============================================================================

/**
 * JSON Feed v1.1 standard
 */
export const jsonFeedV11 = `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "My JSON Feed",
  "home_page_url": "https://example.org/",
  "feed_url": "https://example.org/feed.json",
  "description": "A sample JSON Feed",
  "items": [
    {
      "id": "1",
      "url": "https://example.org/article-1",
      "title": "First JSON Article",
      "content_html": "<p>This is the first article content.</p>",
      "date_published": "2025-11-24T10:00:00Z",
      "image": "https://example.org/images/1.jpg",
      "authors": [
        { "name": "John Doe", "url": "https://example.org/john" }
      ],
      "tags": ["news", "technology"]
    },
    {
      "id": "2",
      "url": "https://example.org/article-2",
      "title": "Second JSON Article",
      "content_text": "Plain text content for the second article.",
      "summary": "A brief summary",
      "date_published": "2025-11-23T15:00:00Z",
      "attachments": [
        {
          "url": "https://example.org/doc.pdf",
          "mime_type": "application/pdf",
          "title": "Related Document"
        }
      ]
    }
  ]
}`;

/**
 * JSON Feed v1.0 (older version)
 */
export const jsonFeedV10 = `{
  "version": "https://jsonfeed.org/version/1",
  "title": "Legacy JSON Feed",
  "home_page_url": "https://example.com/",
  "items": [
    {
      "id": "legacy-1",
      "url": "https://example.com/item-1",
      "title": "Legacy Item",
      "content_html": "<p>Content</p>"
    }
  ]
}`;

/**
 * JSON Feed minimal (only required fields)
 */
export const jsonFeedMinimal = `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "Minimal Feed",
  "items": [
    { "id": "1" }
  ]
}`;

/**
 * RSS 2.0 with iTunes namespace (podcasts)
 */
export const rss2iTunesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Podcast</title>
    <link>https://example.com/podcast</link>
    <description>A test podcast feed</description>
    <itunes:image href="https://example.com/podcast-cover.jpg" />
    <itunes:author>Podcast Host</itunes:author>
    <item>
      <title>Episode 1</title>
      <link>https://example.com/ep1</link>
      <description>First episode description</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
      <itunes:image href="https://example.com/ep1-cover.jpg" />
      <itunes:duration>01:23:45</itunes:duration>
      <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg" length="50000000" />
    </item>
  </channel>
</rss>`;

/**
 * RSS 2.0 with extensive Dublin Core metadata
 */
export const rss2DublinCoreXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Dublin Core Feed</title>
    <link>https://example.com</link>
    <description>Feed with Dublin Core elements</description>
    <item>
      <title>DC Article</title>
      <link>https://example.com/dc-article</link>
      <description>Article with Dublin Core metadata</description>
      <dc:creator>Jane Smith</dc:creator>
      <dc:date>2025-11-24T10:00:00Z</dc:date>
      <dc:subject>Technology</dc:subject>
      <dc:subject>Science</dc:subject>
      <dc:publisher>Example Publishing</dc:publisher>
      <dc:rights>Copyright 2025</dc:rights>
    </item>
  </channel>
</rss>`;

/**
 * RSS 2.0 with media:content variations
 */
export const rss2MediaContentXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Media Content Feed</title>
    <link>https://example.com</link>
    <description>Feed with various media:content patterns</description>
    <item>
      <title>Multiple Images</title>
      <link>https://example.com/multi-image</link>
      <description>Item with multiple media:content elements</description>
      <media:content url="https://example.com/small.jpg" type="image/jpeg" width="100" height="100" />
      <media:content url="https://example.com/medium.jpg" type="image/jpeg" width="400" height="300" medium="image" isDefault="true" />
      <media:content url="https://example.com/large.jpg" type="image/jpeg" width="800" height="600" />
      <media:thumbnail url="https://example.com/thumb.jpg" />
    </item>
    <item>
      <title>Video with Thumbnail</title>
      <link>https://example.com/video</link>
      <description>Item with video content and image thumbnail</description>
      <media:content url="https://example.com/video.mp4" type="video/mp4" />
      <media:thumbnail url="https://example.com/video-thumb.jpg" width="480" height="360" />
    </item>
    <item>
      <title>Media Group</title>
      <link>https://example.com/group</link>
      <description>Item with media:group</description>
      <media:group>
        <media:content url="https://example.com/group-small.jpg" width="100" height="100" />
        <media:content url="https://example.com/group-large.jpg" width="800" height="600" />
        <media:thumbnail url="https://example.com/group-thumb.jpg" />
      </media:group>
    </item>
  </channel>
</rss>`;

/**
 * Atom with media namespace
 */
export const atomWithMediaXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Atom Media Feed</title>
  <link href="https://example.com" />
  <id>urn:uuid:atom-media-feed</id>
  <updated>2025-11-24T12:00:00Z</updated>
  <entry>
    <title>Atom with Media</title>
    <link href="https://example.com/atom-media" />
    <id>urn:uuid:atom-media-1</id>
    <updated>2025-11-24T10:00:00Z</updated>
    <summary>Entry with media namespace</summary>
    <media:thumbnail url="https://example.com/atom-thumb.jpg" />
    <media:content url="https://example.com/atom-full.jpg" type="image/jpeg" />
  </entry>
</feed>`;

/**
 * RSS with HTML in title (should be stripped)
 */
export const rss2HtmlInTitleXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>HTML Test Feed</title>
    <link>https://example.com</link>
    <description>Feed with HTML in unexpected places</description>
    <item>
      <title><![CDATA[<b>Bold Title</b> with <em>emphasis</em>]]></title>
      <link>https://example.com/html-title</link>
      <description>Normal description</description>
    </item>
    <item>
      <title>Normal &lt;Title&gt; With Entities</title>
      <link>https://example.com/entity-title</link>
      <description>&lt;script&gt;alert('xss')&lt;/script&gt;Safe description</description>
    </item>
  </channel>
</rss>`;

/**
 * RSS with relative URLs
 */
export const rss2RelativeUrlsXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Relative URLs Feed</title>
    <link>https://example.com</link>
    <description>Feed with relative URLs</description>
    <image>
      <url>/images/channel-logo.jpg</url>
      <title>Channel Logo</title>
      <link>https://example.com</link>
    </image>
    <item>
      <title>Item with Relative URLs</title>
      <link>/article/1</link>
      <description><![CDATA[<img src="/images/inline.jpg" /> Content with relative image]]></description>
      <media:thumbnail url="../thumbnails/thumb1.jpg" />
    </item>
    <item>
      <title>Item with Protocol-Relative URL</title>
      <link>//example.com/article/2</link>
      <description>Protocol relative</description>
      <enclosure url="//cdn.example.com/image.jpg" type="image/jpeg" />
    </item>
  </channel>
</rss>`;

/**
 * RSS with special characters and international text
 */
export const rss2InternationalXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>国際フィード - International Feed</title>
    <link>https://example.com</link>
    <description>Feed with international characters</description>
    <item>
      <title>日本語タイトル - Japanese Title</title>
      <link>https://example.com/japanese</link>
      <description>これは日本語のテストです。Special chars: àéîõü ñ ß Ø</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Emoji Support 🎉 🚀 ✨</title>
      <link>https://example.com/emoji</link>
      <description>Testing emoji in feed content 👍</description>
    </item>
    <item>
      <title>RTL عربي Text</title>
      <link>https://example.com/arabic</link>
      <description>مرحبا بالعالم - Hello World in Arabic</description>
    </item>
  </channel>
</rss>`;

/**
 * RSS with very long content
 */
export const rss2LongContentXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Long Content Feed</title>
    <link>https://example.com</link>
    <description>Feed with very long descriptions</description>
    <item>
      <title>Article with Long Description</title>
      <link>https://example.com/long</link>
      <description>${'Lorem ipsum dolor sit amet. '.repeat(500)}</description>
      <pubDate>Sun, 24 Nov 2025 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>${'Very Long Title That Goes On And On '.repeat(20)}</title>
      <link>https://example.com/long-title</link>
      <description>Short description</description>
    </item>
  </channel>
</rss>`;

/**
 * RSS with missing/broken links
 */
export const rss2BrokenLinksXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Broken Links Feed</title>
    <link>https://example.com</link>
    <description>Feed with various link issues</description>
    <item>
      <title>No Link At All</title>
      <description>This item has no link element</description>
      <guid isPermaLink="false">no-link-item</guid>
    </item>
    <item>
      <title>Empty Link</title>
      <link></link>
      <description>This item has an empty link</description>
    </item>
    <item>
      <title>GUID as Permalink</title>
      <description>Item uses guid as link</description>
      <guid isPermaLink="true">https://example.com/guid-link</guid>
    </item>
    <item>
      <title>Malformed URL</title>
      <link>not a valid url</link>
      <description>Link is not a valid URL</description>
    </item>
  </channel>
</rss>`;

/**
 * RSS with multiple channel images
 */
export const rss2ChannelImageXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Channel Image Feed</title>
    <link>https://example.com</link>
    <description>Feed with channel-level images</description>
    <image>
      <url>https://example.com/channel-image.jpg</url>
      <title>Channel Image</title>
      <link>https://example.com</link>
    </image>
    <item>
      <title>Item Without Own Image</title>
      <link>https://example.com/no-image</link>
      <description>This item should use channel image as fallback</description>
    </item>
    <item>
      <title>Item With Own Image</title>
      <link>https://example.com/has-image</link>
      <description>This item has its own image</description>
      <media:thumbnail url="https://example.com/item-thumb.jpg" />
    </item>
  </channel>
</rss>`;

/**
 * Atom with different content types
 */
export const atomContentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Atom Content Types Feed</title>
  <link href="https://example.com" />
  <id>urn:uuid:content-types</id>
  <updated>2025-11-24T12:00:00Z</updated>
  <entry>
    <title>HTML Content</title>
    <link href="https://example.com/html" />
    <id>urn:uuid:html-entry</id>
    <updated>2025-11-24T10:00:00Z</updated>
    <content type="html"><![CDATA[<p>HTML <strong>content</strong></p>]]></content>
  </entry>
  <entry>
    <title>XHTML Content</title>
    <link href="https://example.com/xhtml" />
    <id>urn:uuid:xhtml-entry</id>
    <updated>2025-11-24T09:00:00Z</updated>
    <content type="xhtml">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p>XHTML <em>content</em></p>
      </div>
    </content>
  </entry>
  <entry>
    <title>Text Content</title>
    <link href="https://example.com/text" />
    <id>urn:uuid:text-entry</id>
    <updated>2025-11-24T08:00:00Z</updated>
    <content type="text">Plain text content with &lt;no&gt; HTML</content>
  </entry>
  <entry>
    <title>Summary Only</title>
    <link href="https://example.com/summary" />
    <id>urn:uuid:summary-entry</id>
    <updated>2025-11-24T07:00:00Z</updated>
    <summary>Just a summary, no full content</summary>
  </entry>
</feed>`;

/**
 * Feed wrapped in HTML (proxy/error response)
 */
export const feedInHtmlWrapper = `<!DOCTYPE html>
<html>
<head><title>Feed</title></head>
<body>
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wrapped Feed</title>
    <link>https://example.com</link>
    <description>Feed accidentally wrapped in HTML</description>
    <item>
      <title>Wrapped Item</title>
      <link>https://example.com/wrapped</link>
      <description>Should still be parseable</description>
    </item>
  </channel>
</rss>
</body>
</html>`;

/**
 * Feed with BOM (Byte Order Mark)
 */
export const feedWithBOM = '\uFEFF<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>BOM Feed</title>\n    <link>https://example.com</link>\n    <description>Feed with BOM</description>\n    <item>\n      <title>BOM Item</title>\n      <link>https://example.com/bom</link>\n      <description>Should handle BOM correctly</description>\n    </item>\n  </channel>\n</rss>';

/**
 * RSS with namespace prefix on all elements
 */
export const rss2NamespacedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss:rss version="2.0" xmlns:rss="http://purl.org/rss/1.0/">
  <rss:channel>
    <rss:title>Namespaced Feed</rss:title>
    <rss:link>https://example.com</rss:link>
    <rss:description>All elements have namespace prefix</rss:description>
    <rss:item>
      <rss:title>Namespaced Item</rss:title>
      <rss:link>https://example.com/ns-item</rss:link>
      <rss:description>Namespaced description</rss:description>
    </rss:item>
  </rss:channel>
</rss:rss>`;

/**
 * Empty but valid XML
 */
export const emptyValidXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed></feed>`;

/**
 * XML with only whitespace content
 */
export const whitespaceOnlyXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>   </title>
    <link>https://example.com</link>
    <description>

    </description>
    <item>
      <title>   Whitespace Title   </title>
      <link>https://example.com/ws</link>
      <description>   </description>
    </item>
  </channel>
</rss>`;

/**
 * Control characters in content (should be stripped)
 */
export const feedWithControlChars = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Control\x00Chars\x08Feed</title>
    <link>https://example.com</link>
    <description>Feed with control characters</description>
    <item>
      <title>Item\x0BWith\x0CChars</title>
      <link>https://example.com/ctrl</link>
      <description>Description\x1Fwith\x1Echars</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with source element
 */
export const rss2WithSourceXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Aggregated Feed</title>
    <link>https://aggregator.example.com</link>
    <description>Feed with source attribution</description>
    <item>
      <title>Sourced Article</title>
      <link>https://original.example.com/article</link>
      <description>Content from another feed</description>
      <source url="https://original.example.com/feed.xml">Original Feed Name</source>
    </item>
  </channel>
</rss>`;

/**
 * Feed with comments element
 */
export const rss2WithCommentsXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Comments Feed</title>
    <link>https://example.com</link>
    <description>Feed with comments links</description>
    <item>
      <title>Article with Comments</title>
      <link>https://example.com/article</link>
      <description>An article</description>
      <comments>https://example.com/article#comments</comments>
    </item>
  </channel>
</rss>`;

/**
 * Large feed for performance testing (100 items)
 */
export const createLargeFeed = (itemCount: number = 100): string => {
  const items = Array.from({ length: itemCount }, (_, i) => `
    <item>
      <title>Item ${i + 1}</title>
      <link>https://example.com/item-${i + 1}</link>
      <description>Description for item ${i + 1}. ${('Lorem ipsum dolor sit amet. ').repeat(10)}</description>
      <pubDate>${new Date(Date.now() - i * 86400000).toUTCString()}</pubDate>
      <category>Category ${(i % 5) + 1}</category>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Large Feed (${itemCount} items)</title>
    <link>https://example.com</link>
    <description>Performance test feed</description>
    ${items}
  </channel>
</rss>`;
};

// ============================================================================
// Malformed Feed Test Fixtures for Recovery Mode (ST-003-07)
// ============================================================================

/**
 * Feed with unclosed tags (recovery should fix)
 */
export const malformedUnclosedTagsXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Unclosed Tags Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Broken Item
      <link>https://example.com/broken</link>
      <description>Description with unclosed tag
    </item>
    <item>
      <title>Second Item</title>
      <link>https://example.com/second</link>
    </item>
  </channel>
</rss>`;

/**
 * Feed with unescaped ampersands and special characters
 */
export const malformedUnescapedAmpsXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>News & Updates</title>
    <link>https://example.com</link>
    <item>
      <title>Smith & Jones Report: Q3 < Q4</title>
      <link>https://example.com/report?a=1&b=2</link>
      <description>Comparing A & B performance > expectations</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with missing namespace declarations
 */
export const malformedMissingNamespacesXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Missing Namespaces Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Media Item</title>
      <link>https://example.com/media</link>
      <description>Item with undeclared namespaces</description>
      <media:thumbnail url="https://example.com/thumb.jpg" />
      <dc:creator>John Doe</dc:creator>
      <content:encoded><![CDATA[<p>Full content</p>]]></content:encoded>
    </item>
  </channel>
</rss>`;

/**
 * Feed wrapped in HTML (common proxy error)
 */
export const malformedHtmlWrappedXml = `<!DOCTYPE html>
<html>
<head><title>Feed Error</title></head>
<body>
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>HTML Wrapped Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Wrapped Item</title>
      <link>https://example.com/wrapped</link>
      <description>This feed was accidentally wrapped in HTML</description>
    </item>
  </channel>
</rss>
</body>
</html>`;

/**
 * Feed with multiple XML declarations
 */
export const malformedMultipleDeclarationsXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Multiple Declarations Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Item</title>
      <link>https://example.com/item</link>
    </item>
  </channel>
</rss>`;

/**
 * Feed with BOM (Byte Order Mark) and encoding issues
 */
export const malformedBomAndEncodingXml = '\uFEFF<?xml version="1.0" encoding="iso-8859-1"?>\n<rss version="2.0">\n  <channel>\n    <title>BOM Feed with Wrong Encoding</title>\n    <link>https://example.com</link>\n    <item>\n      <title>Item with BOM</title>\n      <link>https://example.com/bom</link>\n    </item>\n  </channel>\n</rss>';

/**
 * Feed with broken CDATA sections
 */
export const malformedBrokenCdataXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Broken CDATA Feed</title>
    <link>https://example.com</link>
    <item>
      <title>CDATA Test</title>
      <link>https://example.com/cdata</link>
      <description><![CDATA[Content with unclosed CDATA
    </item>
    <item>
      <title>Nested CDATA</title>
      <description><![CDATA[Content with ]]> inside CDATA]]></description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with control characters
 */
export const malformedControlCharsXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Control\x00Chars\x08Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Item\x0BWith\x0CChars</title>
      <link>https://example.com/ctrl</link>
      <description>Description\x1Fwith\x1Echars</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with mojibake (UTF-8 interpreted as Latin-1)
 */
export const malformedMojibakeXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mojibake Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Ã˜stlandets nyheter</title>
      <link>https://example.com/norwegian</link>
      <description>Ã…rets beste Ã¦bler frÃ¥ vÃ¥rt land</description>
    </item>
    <item>
      <title>Smartâ€"quotes and â€˜apostrophesâ€™</title>
      <link>https://example.com/quotes</link>
      <description>Text with â€¦ ellipsis</description>
    </item>
  </channel>
</rss>`;

/**
 * Feed with malformed attribute values
 */
export const malformedAttributesXml = `<?xml version='1.0' encoding=UTF-8?>
<rss version=2.0 xmlns:media=http://search.yahoo.com/mrss/>
  <channel>
    <title>Malformed Attributes Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Item</title>
      <link>https://example.com/item</link>
      <media:thumbnail url=https://example.com/thumb.jpg width=100 height=100 />
    </item>
  </channel>
</rss>`;

/**
 * Severely broken feed combining multiple issues
 */
export const malformedSevereXml = `
\uFEFF<?xml version='1.0'?><?xml version="1.0"?>
<!DOCTYPE html>
<html>
<body>
<rss version=2.0>
  <channel>
    <title>Severely Broken & Malformed Feed</title>
    <item>
      <title>  Broken\x00Item   with    spaces
      <link>https://example.com/broken?a=1&b=2</link>
      <description><![CDATA[Content here without closing
      <media:thumbnail url=test.jpg/>
      <dc:creator>Ã…sa Ã˜stensen</dc:creator>
    </item>
    <item>
      <title>Second Item</title>
      <link>https://example.com/second</link>
    </item>
  </channel>
</rss>
</body>
</html>
`;

/**
 * Create a malformed feed with specified issues for testing
 */
export const createMalformedFeed = (options: {
  addBom?: boolean;
  addControlChars?: boolean;
  addUnescapedAmps?: boolean;
  wrapInHtml?: boolean;
  duplicateDeclarations?: boolean;
  missingNamespaces?: boolean;
  unclosedTags?: boolean;
  brokenCdata?: boolean;
}): string => {
  let feed = '';

  // Add BOM
  if (options.addBom) {
    feed += '\uFEFF';
  }

  // XML declarations
  feed += '<?xml version="1.0"?>';
  if (options.duplicateDeclarations) {
    feed += '<?xml version="1.0"?>';
  }

  // HTML wrapper start
  if (options.wrapInHtml) {
    feed += '<!DOCTYPE html><html><body>';
  }

  feed += '<rss version="2.0">';

  // Add missing namespace usage
  if (options.missingNamespaces) {
    feed += '<channel><item><media:content url="test.jpg"/><dc:creator>Author</dc:creator>';
  } else {
    feed += '<channel><item>';
  }

  // Title with issues
  let title = 'Test Item';
  if (options.addControlChars) {
    title = 'Test\x00\x08Item';
  }
  if (options.addUnescapedAmps) {
    title = 'News & Updates';
  }

  if (options.unclosedTags) {
    feed += `<title>${title}`;  // No closing tag
  } else {
    feed += `<title>${title}</title>`;
  }

  feed += '<link>https://example.com/test</link>';

  // Description with CDATA issues
  if (options.brokenCdata) {
    feed += '<description><![CDATA[Broken CDATA without closing';
  } else {
    feed += '<description>Normal description</description>';
  }

  if (!options.unclosedTags) {
    feed += '</item>';
  }
  feed += '</channel></rss>';

  // HTML wrapper end
  if (options.wrapInHtml) {
    feed += '</body></html>';
  }

  return feed;
};

/**
 * Retriever feed with ret:source namespace (Meltwater/media monitoring feeds)
 * Tests the priority chain: <author> → <ret:source> → <source> → <dc:creator>
 */
export const rss2RetrieverSourceXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:ret="http://www.retriever-info.com/rss/">
  <channel>
    <title>Media Monitoring Feed</title>
    <link>https://meltwater.example.com</link>
    <description>Aggregated media mentions</description>
    <item>
      <title>Article from Dagbladet</title>
      <link>https://dagbladet.no/article-1</link>
      <description>An article from Dagbladet about technology</description>
      <ret:source>Dagbladet</ret:source>
      <pubDate>Mon, 25 Nov 2025 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article from VG</title>
      <link>https://vg.no/article-2</link>
      <description>An article from VG about politics</description>
      <author>VG Nyheter</author>
      <ret:source>VG</ret:source>
      <pubDate>Mon, 25 Nov 2025 09:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article from NRK</title>
      <link>https://nrk.no/article-3</link>
      <description>An article from NRK about sports</description>
      <source url="https://nrk.no/feed.xml">NRK Nyheter</source>
      <pubDate>Mon, 25 Nov 2025 08:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
