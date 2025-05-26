/**
 * Test script to verify RSS feed parsing improvements
 *
 * To run this test:
 * 1. Build the project: gulp build
 * 2. Run with Node.js: node ./lib/webparts/polRssGallery/utils/testRunner.js
 */
import { FeedTester } from './feedTester';
import { RssDebugUtils } from './rssDebugUtils';
// List of feeds to test, including problematic ones
// Add any URLs you want to test here
const FEEDS_TO_TEST = [
    // Regular RSS feeds (should work without issues)
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    'https://www.rikstv.no/feed/',
    // Previously problematic feeds that should now work
    'https://www.nettavisen.no/rss/nyheter', // Previously only showed one item
    // Meltwater feed example (replace with actual URL or remove comment to test)
    // 'https://www.meltwater.com/api/public/newsletters/XXXX/newsletter/view?apiKey=YYYY&newsletterId=ZZZZ',
    // Add any other feeds you want to test
];
/**
 * Run tests on all specified feeds
 */
async function runTests() {
    RssDebugUtils.log('RSS Feed Parser Test Runner');
    RssDebugUtils.log('==========================');
    RssDebugUtils.log(`Testing ${FEEDS_TO_TEST.length} feeds...\n`);
    const results = [];
    // Test each feed
    for (const url of FEEDS_TO_TEST) {
        RssDebugUtils.log(`Testing feed: ${url}`);
        try {
            const result = await FeedTester.testFeed(url, {
                enableConsoleOutput: true, // Changed to true for better debugging
                timeout: 30000 // Increased timeout for slow feeds
            });
            results.push({ url, result });
            // Log the results
            if (result.success) {
                RssDebugUtils.log(`✅ SUCCESS: Found ${result.itemCount} items (${result.itemsWithImages} with images) in ${result.parseTimeMs}ms\n`);
            }
            else {
                RssDebugUtils.log(`❌ FAILED: ${result.error} (${result.parseTimeMs}ms)\n`);
            }
        }
        catch (error) {
            RssDebugUtils.error(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
            results.push({
                url,
                result: {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }
    }
    // Summary
    RssDebugUtils.log('\nTEST SUMMARY');
    RssDebugUtils.log('============');
    const successCount = results.filter(r => r.result.success).length;
    RssDebugUtils.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${results.length - successCount}`);
    // Detailed results
    RssDebugUtils.log('\nDETAILED RESULTS');
    RssDebugUtils.log('===============');
    results.forEach(({ url, result }) => {
        if (result.success) {
            RssDebugUtils.log(`✅ ${url}: ${result.itemCount} items`);
        }
        else {
            RssDebugUtils.log(`❌ ${url}: ${result.error}`);
        }
    });
}
// Run the tests
runTests().catch(error => {
    RssDebugUtils.error(`Error running tests: ${error instanceof Error ? error.message : String(error)}`);
});
//# sourceMappingURL=testRunner.js.map