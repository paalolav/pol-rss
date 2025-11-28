/**
 * JSON Feed Parser
 *
 * Parses JSON Feed format (jsonfeed.org) version 1.0 and 1.1.
 * JSON Feed is a modern, JSON-based alternative to RSS/Atom.
 *
 * @see https://jsonfeed.org/version/1.1
 */
import { IRssItem } from '../components/IRssItem';
/**
 * Options for JSON Feed parsing
 */
export interface IJsonFeedParserOptions {
    fallbackImageUrl: string;
    maxItems?: number;
}
/**
 * Check if content is a JSON Feed
 *
 * @param content - Raw content string to check
 * @returns true if content appears to be a JSON Feed
 */
export declare function isJsonFeed(content: string): boolean;
/**
 * Parse JSON Feed content into RSS items
 *
 * @param content - JSON Feed content string
 * @param options - Parser options
 * @returns Array of parsed RSS items
 * @throws Error if parsing fails
 */
export declare function parseJsonFeed(content: string, options: IJsonFeedParserOptions): IRssItem[];
/**
 * Get JSON Feed metadata
 *
 * @param content - JSON Feed content string
 * @returns Feed metadata or null if invalid
 */
export declare function getJsonFeedMetadata(content: string): {
    title: string;
    description: string;
    homePageUrl: string;
    version: string;
} | null;
//# sourceMappingURL=jsonFeedParser.d.ts.map