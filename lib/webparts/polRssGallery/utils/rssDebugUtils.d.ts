/**
 * RSS Debug Utilities
 * This file provides functions for debugging RSS feed processing
 */
import { IRssItem } from '../components/IRssItem';
/**
 * RSS Debug class with utilities to help diagnose RSS feed issues
 */
export declare class RssDebugUtils {
    private static isDebugMode;
    /**
     * Enable or disable debug mode globally
     * @param enable Whether to enable debug mode
     */
    static setDebugMode(enable: boolean): void;
    /**
     * Check if debug mode is enabled
     */
    static isDebugEnabled(): boolean;
    /**
     * Log a message if debug mode is enabled
     * @param message The message to log
     */
    static log(message: string): void;
    /**
     * Log a warning if debug mode is enabled
     * @param warning The warning message to log
     */
    static warn(warning: string): void;
    /**
     * Log an error if debug mode is enabled
     * @param error The error message to log
     */
    static error(error: string): void;
    /**
     * Convert a DOM Element to a readable debug string
     * @param element The DOM element to analyze
     * @param maxDepth Maximum depth to recurse
     * @param includeContent Whether to include element content
     */
    static elementToDebugString(element: Element, maxDepth?: number, includeContent?: boolean): string;
    /**
     * Generate a debug log for an RSS item
     * @param item The DOM element representing an RSS item
     */
    static debugRssItem(item: Element): string;
    /**
     * Analyze a processed RSS feed for issues
     * @param items The processed RSS items
     * @param feedUrl The original feed URL
     */
    static analyzeRssFeed(items: IRssItem[], feedUrl: string): string;
    /**
     * Create a debug console
     * Only appears when debug mode is enabled
     */
    static createDebugConsole(container: HTMLElement): void;
    /**
     * Log a message to the debug console
     * @param message The message to log
     */
    static logToDebugConsole(message: string): void;
}
//# sourceMappingURL=rssDebugUtils.d.ts.map