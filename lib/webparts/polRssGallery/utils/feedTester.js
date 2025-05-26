/**
 * Test utility for RSS feed parsing
 * This can be used to verify fixes for problematic feeds
 */
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { RssSpecialFeedsHandler } from '../services/rssSpecialFeedsHandler';
import { RssDebugUtils } from './rssDebugUtils';
/**
 * Simple utility to test RSS feed parsing
 */
export class FeedTester {
    /**
     * Test a specific feed URL to validate parsing
     * @param url The URL of the feed to test
     * @param options Additional options for the test
     * @returns Promise with test results
     */
    static async testFeed(url, options = {}) {
        const startTime = Date.now();
        const timeout = options.timeout || 15000; // 15s default timeout
        const maxItems = options.maxItems || 10;
        const enableLog = options.enableConsoleOutput || false;
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            let response;
            let feedContent = '';
            try {
                // Handle authenticated feeds if needed
                if (RssSpecialFeedsHandler.isAuthenticatedFeed(url)) {
                    try {
                        if (enableLog) {
                            RssDebugUtils.log(`Testing authenticated feed: ${url}`);
                        }
                        response = await RssSpecialFeedsHandler.fetchAuthenticatedFeed(url);
                    }
                    catch (authError) {
                        if (enableLog) {
                            RssDebugUtils.warn(`Auth handler failed: ${authError instanceof Error ? authError.message : 'Unknown error'}`);
                        }
                        // Fall back to regular fetch
                        response = await fetch(url, { signal: controller.signal });
                    }
                }
                else {
                    // Regular fetch for non-authenticated feeds
                    response = await fetch(url, { signal: controller.signal });
                }
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - ${response.statusText || 'Error'}`);
                }
                feedContent = await response.text();
                if (!feedContent || feedContent.trim().length === 0) {
                    throw new Error('Feed returned empty content');
                }
                // Log the start of the content for debugging
                if (enableLog) {
                    RssDebugUtils.log(`Feed content length: ${feedContent.length} bytes`);
                    RssDebugUtils.log(`Feed content starts with: ${feedContent.substring(0, 100)}...`);
                }
            }
            finally {
                clearTimeout(timeoutId);
            }
            // Get preprocessing hints for the feed
            const preprocessingHints = RssSpecialFeedsHandler.getPreProcessingHints(url);
            // Parse the feed
            const items = ImprovedFeedParser.parse(feedContent, {
                fallbackImageUrl: 'https://placeholder.com/300x200',
                maxItems,
                enableDebug: enableLog,
                preprocessingHints
            });
            // Count items with images
            const itemsWithImages = items.filter(item => item.imageUrl && !item.imageUrl.includes('placeholder.com')).length;
            const endTime = Date.now();
            // Return test results
            return {
                success: true,
                itemCount: items.length,
                itemsWithImages,
                parseTimeMs: endTime - startTime
            };
        }
        catch (error) {
            const endTime = Date.now();
            return {
                success: false,
                itemCount: 0,
                itemsWithImages: 0,
                parseTimeMs: endTime - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
//# sourceMappingURL=feedTester.js.map