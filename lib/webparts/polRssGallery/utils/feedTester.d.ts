/**
 * Simple utility to test RSS feed parsing
 */
export declare class FeedTester {
    /**
     * Test a specific feed URL to validate parsing
     * @param url The URL of the feed to test
     * @param options Additional options for the test
     * @returns Promise with test results
     */
    static testFeed(url: string, options?: {
        maxItems?: number;
        enableConsoleOutput?: boolean;
        timeout?: number;
    }): Promise<{
        success: boolean;
        itemCount: number;
        itemsWithImages: number;
        parseTimeMs: number;
        error?: string;
    }>;
}
//# sourceMappingURL=feedTester.d.ts.map