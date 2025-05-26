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
export declare class RssFeedTester {
    private static readonly LOG_SOURCE;
    /**
     * Test a specific feed URL
     * @param feedUrl The feed URL to test
     */
    static testFeed(feedUrl: string): Promise<ITestResult>;
    /**
     * Test a batch of feeds
     * @param feedUrls Array of feed URLs to test
     */
    static testMultipleFeeds(feedUrls: string[]): Promise<ITestResult[]>;
    /**
     * Run a standard test battery on problematic feeds
     */
    static runStandardTests(): Promise<ITestResult[]>;
}
export {};
//# sourceMappingURL=rssFeedTester.d.ts.map