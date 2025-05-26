/**
 * Collection of utilities to handle RSS feeds with authentication and special formats
 * This is a transitional helper that now provides generic handling for all feeds.
 */
export declare class RssSpecialFeedsHandler {
    /**
     * Check if the feed URL contains authentication parameters that need special handling
     */
    static isAuthenticatedFeed(url: string): boolean;
    /**
     * Check if the given URL is a Meltwater feed
     * Meltwater feeds often require special handling for authentication
     */
    static isMeltwaterFeed(url: string): boolean;
    /**
     * Handle fetching of authenticated feeds - now uses a generic approach
     * @param url The feed URL
     * @returns Response object
     */
    static fetchAuthenticatedFeed(url: string): Promise<Response>;
    /**
     * Special handling for Meltwater feeds
     * Meltwater feeds often require specific authentication handling
     */
    private static fetchMeltwaterFeed;
    /**
     * Always assume feeds might have format issues and apply universal fixes
     * @deprecated Use the preprocessingHints directly in ImprovedFeedParser
     */
    static hasKnownFormatIssues(_url: string): boolean;
    /**
     * Get generic pre-processing hints for the feed parser
     * @param url The feed URL
     */
    static getPreProcessingHints(url: string): {
        addMissingNamespaces?: boolean;
        fixUnclosedTags?: boolean;
        addMissingXmlDeclaration?: boolean;
        fixCdataSequences?: boolean;
    };
}
//# sourceMappingURL=rssSpecialFeedsHandler.d.ts.map