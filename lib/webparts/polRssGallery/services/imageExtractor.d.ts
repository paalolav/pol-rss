/**
 * Image Extractor Service (ST-003-04)
 *
 * Extracts images from RSS/Atom feed items with a prioritized fallback chain.
 * Handles various image sources including media:thumbnail, media:content,
 * enclosures, inline HTML images, itunes:image, and channel images.
 *
 * Priority Order:
 * 1. media:thumbnail (preferred size)
 * 2. media:content (type="image/*")
 * 3. enclosure (type="image/*")
 * 4. First <img> in content:encoded
 * 5. First <img> in description
 * 6. itunes:image
 * 7. Channel image (fallback)
 * 8. Configured fallback image
 */
export interface ImageExtractionOptions {
    /** Base URL for resolving relative URLs */
    baseUrl?: string;
    /** Fallback image URL when no image is found */
    fallbackImageUrl?: string;
    /** Preferred minimum width for image selection */
    preferredMinWidth?: number;
    /** Preferred minimum height for image selection */
    preferredMinHeight?: number;
    /** Channel element for fallback channel image */
    channelElement?: Element | null;
}
export interface ExtractedImage {
    url: string;
    source: ImageSource;
    width?: number;
    height?: number;
    type?: string;
}
export type ImageSource = 'media:thumbnail' | 'media:content' | 'enclosure' | 'content:encoded' | 'description' | 'itunes:image' | 'channel' | 'fallback';
/**
 * Image URL validation result
 */
interface ValidatedUrl {
    isValid: boolean;
    url: string;
}
/**
 * Validates and normalizes an image URL
 */
export declare function validateImageUrl(url: string | null | undefined, baseUrl?: string): ValidatedUrl;
/**
 * Checks if a MIME type indicates an image
 */
export declare function isImageMimeType(type: string | null | undefined): boolean;
/**
 * Extracts media:thumbnail elements from an item
 */
export declare function extractMediaThumbnails(item: Element, options?: ImageExtractionOptions): ExtractedImage[];
/**
 * Extracts media:content elements with image type from an item
 */
export declare function extractMediaContent(item: Element, options?: ImageExtractionOptions): ExtractedImage[];
/**
 * Extracts image from enclosure elements
 */
export declare function extractEnclosureImages(item: Element, options?: ImageExtractionOptions): ExtractedImage[];
/**
 * Extracts the first image from HTML content
 */
export declare function extractImagesFromHtml(html: string | null | undefined, source: 'content:encoded' | 'description', options?: ImageExtractionOptions): ExtractedImage[];
/**
 * Extracts itunes:image from an item
 */
export declare function extractItunesImage(item: Element, options?: ImageExtractionOptions): ExtractedImage | null;
/**
 * Extracts channel-level image
 */
export declare function extractChannelImage(channel: Element | null | undefined, options?: ImageExtractionOptions): ExtractedImage | null;
/**
 * Selects the best image from candidates based on size preferences
 */
export declare function selectBestImage(candidates: ExtractedImage[], preferredMinWidth?: number, preferredMinHeight?: number): ExtractedImage | null;
/**
 * Main extraction function - extracts the best image from a feed item
 * following the priority chain:
 *
 * 1. media:thumbnail (preferred size)
 * 2. media:content (type="image/*")
 * 3. enclosure (type="image/*")
 * 4. First <img> in content:encoded
 * 5. First <img> in description
 * 6. itunes:image
 * 7. Channel image (fallback)
 * 8. Configured fallback image
 */
export declare function extractImage(item: Element, options?: ImageExtractionOptions): ExtractedImage | null;
/**
 * Convenience function to get just the URL string
 */
export declare function extractImageUrl(item: Element, options?: ImageExtractionOptions): string | undefined;
/**
 * Legacy compatibility function - matches the old findImage signature
 * but uses the new priority chain
 */
export declare function findImage(item: Element): string | undefined;
export {};
//# sourceMappingURL=imageExtractor.d.ts.map