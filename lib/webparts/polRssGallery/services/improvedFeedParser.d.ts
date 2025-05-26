import { IRssItem } from '../components/IRssItem';
/**
 * Interface for feed parser options
 */
export interface IFeedParserOptions {
    fallbackImageUrl: string;
    maxItems?: number;
    enableDebug?: boolean;
    preprocessingHints?: {
        addMissingNamespaces?: boolean;
        fixUnclosedTags?: boolean;
        addMissingXmlDeclaration?: boolean;
        fixCdataSequences?: boolean;
    };
}
/**
 * Improved Feed parser service to handle both RSS and ATOM feeds
 * with better support for various feed formats including Meltwater
 */
export declare class ImprovedFeedParser {
    /**
     * Parse XML feed content (RSS or ATOM) and convert to IRssItem array
     */
    static parse(xmlString: string, options: IFeedParserOptions): IRssItem[];
    /**
     * Pre-process XML string to fix common issues in malformed feeds
     */
    private static preProcessXml;
    /**
     * Helper method to safely extract text from an element
     * Handles CDATA sections and common XML quirks
     */
    private static safeExtractText;
    /**
     * Parse RSS feed format
     */
    private static parseRss;
    /**
     * Parse ATOM feed format
     */
    private static parseAtom;
}
//# sourceMappingURL=improvedFeedParser.d.ts.map