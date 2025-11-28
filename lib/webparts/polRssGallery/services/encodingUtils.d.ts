/**
 * Encoding Utilities
 *
 * Handles proper character encoding detection and conversion for RSS feeds.
 * Many RSS feeds use ISO-8859-1 (Latin-1) encoding, which must be properly
 * decoded to display Norwegian characters (æ, ø, å) correctly.
 */
/**
 * Detect encoding from XML declaration or Content-Type header
 */
export declare function detectEncoding(contentTypeHeader: string | null, xmlContent?: Uint8Array): string;
/**
 * Decode response body with proper encoding detection
 *
 * This is the main function to use instead of response.text()
 * when you need proper encoding support for non-UTF-8 feeds.
 */
export declare function decodeResponseText(response: Response): Promise<string>;
/**
 * Check if content appears to have encoding issues
 * (useful for debugging)
 */
export declare function hasEncodingIssues(text: string): boolean;
//# sourceMappingURL=encodingUtils.d.ts.map