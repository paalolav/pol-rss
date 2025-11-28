const { ImprovedFeedParser } = require('./lib/webparts/polRssGallery/services/improvedFeedParser');
const { RssSpecialFeedsHandler } = require('./lib/webparts/polRssGallery/services/rssSpecialFeedsHandler');

const feeds = [
  'https://www.vg.no/rss/feed',
  'https://computas.com/aktuelt/feed/',
  'https://e24.no/rss2/'
];

async function testFeed(url) {
  console.log(`\n=== Testing: ${url} ===`);
  
  try {
    // First try direct fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`✓ Fetched ${content.length} bytes`);
    
    // Try parsing with the RSS parser
    const preprocessingHints = RssSpecialFeedsHandler.getPreProcessingHints(url);
    const items = ImprovedFeedParser.parse(content, {
      fallbackImageUrl: 'https://via.placeholder.com/150',
      maxItems: 10,
      enableDebug: true,
      preprocessingHints: preprocessingHints
    });
    
    console.log(`✓ Parsed ${items.length} items`);
    
    if (items.length > 0) {
      console.log(`  First item: "${items[0].title}"`);
      console.log(`  Image: ${items[0].imageUrl || '(none)'}`);
      console.log(`  Link: ${items[0].link}`);
    }
    
    return { success: true, itemCount: items.length };
    
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllFeeds() {
  console.log('Testing RSS feeds...\n');
  
  for (const url of feeds) {
    await testFeed(url);
  }
}

testAllFeeds().catch(console.error);
