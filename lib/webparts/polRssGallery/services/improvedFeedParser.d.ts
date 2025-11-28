import { IRssItem } from '../components/IRssItem';
import { RecoveryResult, RecoveryOptions } from './feedRecovery';
/**
 * Result from parsing a feed, includes both items and recovery information
 */
export interface IFeedParseResult {
    /** Parsed feed items */
    items: IRssItem[];
    /** Whether recovery mode was used */
    recoveryUsed: boolean;
    /** Details about recovery actions if recovery was attempted */
    recoveryInfo?: RecoveryResult;
    /** Any warnings about the feed (non-fatal issues) */
    warnings: string[];
}
export interface IFeedParserOptions {
    fallbackImageUrl: string;
    maxItems?: number;
    enableDebug?: boolean;
    /**
     * Enable recovery mode for malformed feeds (ST-003-07)
     * When enabled, parser will attempt to fix and extract content from broken feeds
     * @default true
     */
    enableRecovery?: boolean;
    /**
     * Recovery mode options
     */
    recoveryOptions?: RecoveryOptions;
    preprocessingHints?: {
        addMissingNamespaces?: boolean;
        fixUnclosedTags?: boolean;
        addMissingXmlDeclaration?: boolean;
        fixCdataSequences?: boolean;
    };
}
export declare class ImprovedFeedParser {
    /**
     * Parse a feed and return items (backwards-compatible method)
     * Uses recovery mode by default to handle malformed feeds
     */
    static parse(xmlString: string, options: IFeedParserOptions): IRssItem[];
    /**
     * Parse a feed with full recovery information (ST-003-07)
     * Returns detailed information about any recovery actions taken
     */
    static parseWithRecovery(xmlString: string, options: IFeedParserOptions): IFeedParseResult;
    /**
     * Internal method to parse XML content
     * Uses lazy preprocessing for performance (ST-003-08):
     * 1. Try parsing raw XML first (fast path for clean feeds)
     * 2. If that fails, apply preprocessing and retry
     */
    private static parseXmlContent;
    private static preProcessXml;
    /**
     * Safely extract text content from an XML node
     * Handles CDATA sections and decodes XML/HTML entities
     */
    private static safeExtractText;
    /**
     * Normalize a date string to ISO format using robust date parsing
     * Handles RFC 822 (RSS), RFC 3339 (Atom), and various non-standard formats
     *
     * @param dateStr - Raw date string from feed
     * @returns Normalized ISO date string, or original string if parsing fails
     */
    private static normalizeDate;
    private static parseRss;
    /**
     * Get item nodes from XML document with optimized selector strategy (ST-003-08)
     * Uses the most common selector first for performance
     */
    private static getItemNodes;
    /**
     * Parse ATOM feed format
     */
    private static parseAtom;
}
//# sourceMappingURL=improvedFeedParser.d.ts.map