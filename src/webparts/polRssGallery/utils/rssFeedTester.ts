
import { RssSpecialFeedsHandler } from '../services/rssSpecialFeedsHandler';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { Log } from '@microsoft/sp-core-library';

/**
 * Test result interface
 */
interface ITestResult {
  feedUrl: string;
  success: boolean;
  itemCount: number;
  error?: string;
  firstItem?: {
    title: string;
    hasImage: boolean;
    imageUrl?: string;
  };
}

/**
 * RSS Feed Tester class
 */
export class RssFeedTester {
  private static readonly LOG_SOURCE = 'RssFeedTester';

  /**
   * Test a specific feed URL
   * @param feedUrl The feed URL to test
   */
  public static async testFeed(feedUrl: string): Promise<ITestResult> {
    const result: ITestResult = {
      feedUrl,
      success: false,
      itemCount: 0
    };
    
    try {
      Log.info(this.LOG_SOURCE, `Testing feed: ${feedUrl}`);
      
      // Get the feed content
      let response: Response;
      
      // Check if this feed needs authentication handling
      if (RssSpecialFeedsHandler.isAuthenticatedFeed(feedUrl)) {
        Log.info(this.LOG_SOURCE, 'Using authentication handler');
        response = await RssSpecialFeedsHandler.fetchAuthenticatedFeed(feedUrl);
      } else {
        // Try with proxy first
        try {
          const { ProxyService } = await import('../services/proxyService');
          response = await ProxyService.fetch(feedUrl);
          Log.info(this.LOG_SOURCE, 'Retrieved via proxy');
        } catch (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _
        ) {
          // Fall back to direct fetch (ignore proxy error)
          Log.info(this.LOG_SOURCE, 'Proxy failed, trying direct fetch');
          response = await fetch(feedUrl);
        }
      }
      
      if (!response.ok) {
        result.error = `HTTP Error: ${response.status} ${response.statusText}`;
        return result;
      }
      
      const feedContent = await response.text();
      Log.info(this.LOG_SOURCE, `Received ${feedContent.length} bytes`);
      
      // Get preprocessing hints for the feed
      const preprocessingHints = RssSpecialFeedsHandler.getPreProcessingHints(feedUrl);
      
      // Parse the feed
      const items = ImprovedFeedParser.parse(feedContent, {
        fallbackImageUrl: '',
        enableDebug: true,
        preprocessingHints
      });
      
      result.success = true;
      result.itemCount = items.length;
      
      if (items.length > 0) {
        const firstItem = items[0];
        result.firstItem = {
          title: firstItem.title,
          hasImage: !!firstItem.imageUrl,
          imageUrl: firstItem.imageUrl
        };
      }
      
      return result;
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      return result;
    }
  }
  
  /**
   * Test a batch of feeds
   * @param feedUrls Array of feed URLs to test
   */
  public static async testMultipleFeeds(feedUrls: string[]): Promise<ITestResult[]> {
    const results: ITestResult[] = [];
    
    for (const url of feedUrls) {
      const result = await this.testFeed(url);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Run a standard test battery on problematic feeds
   */
  public static async runStandardTests(): Promise<ITestResult[]> {
    const testFeeds = [
      'https://www.nrk.no/toppsaker.rss',
      'https://www.vg.no/rss/feed',
      'https://e24.no/rss'
    ];
    
    return this.testMultipleFeeds(testFeeds);
  }
}

// Add a way to run this in a browser console for testing without console.log
// These functions will print results through SP logging instead
(window as any).testRssFeed = async (url: string) => {
  const result = await RssFeedTester.testFeed(url);
  Log.info('TestRssFeed', `Test result: ${JSON.stringify(result)}`);
  return result;
};

(window as any).runRssTests = async () => {
  const results = await RssFeedTester.runStandardTests();
  Log.info('RunRssTests', `Test results count: ${results.length}`);
  return results;
};
