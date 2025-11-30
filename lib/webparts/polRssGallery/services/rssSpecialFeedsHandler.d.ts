/**
 * Collection of utilities to handle RSS feeds with authentication and special formats.
 * Uses intelligent detection based on URL patterns rather than hardcoded domain names.
 */
export declare class RssSpecialFeedsHandler {
    /**
     * Check if the feed URL contains authentication parameters that need special handling.
     * Detection is based on URL parameter patterns, not domain names.
     */
    static isAuthenticatedFeed(url: string): boolean;
    /**
     * Check if URL appears to be an API-based feed (vs standard RSS endpoint).
     * API feeds often need special auth header handling and longer timeouts.
     */
    static isApiFeed(url: string): boolean;
    /**
     * @deprecated Use isApiFeed() instead. This method now uses intelligent detection
     * instead of hardcoded domain checks.
     */
    static isMeltwaterFeed(url: string): boolean;
    /**
     * Handle fetching of authenticated feeds using intelligent detection.
     * Tries multiple auth header strategies based on detected parameters.
     * @param url The feed URL
     * @returns Response object
     */
    static fetchAuthenticatedFeed(url: string): Promise<Response>;
    /**
     * Fetch with multiple auth header strategies for API-based feeds.
     * Tries different header combinations that various APIs expect.
     */
    private static fetchWithAuthRetry;
    /**
     * Fetch with timeout to prevent hanging connections
     */
    private static fetchWithTimeout;
    /**
     * Always assume feeds might have format issues and apply universal fixes
     * @deprecated Use the preprocessingHints directly in ImprovedFeedParser
     */
    static hasKnownFormatIssues(_url: string): boolean;
    /**
     * Get generic pre-processing hints for the feed parser.
     * Applies all fixes universally - the parser's recovery system will
     * intelligently detect which fixes are actually needed.
     * @param _url The feed URL (unused - all feeds get same treatment)
     */
    static getPreProcessingHints(_url: string): {
        addMissingNamespaces?: boolean;
        fixUnclosedTags?: boolean;
        addMissingXmlDeclaration?: boolean;
        fixCdataSequences?: boolean;
    };
}
//# sourceMappingURL=rssSpecialFeedsHandler.d.ts.map