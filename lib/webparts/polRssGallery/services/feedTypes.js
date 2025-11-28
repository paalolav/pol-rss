/**
 * Feed Parser Types
 *
 * Comprehensive TypeScript type definitions for feed parsing.
 * These types provide strict typing for all feed-related operations.
 */
/**
 * Type guard to check if an item has categories
 */
export function hasCategories(item) {
    return Array.isArray(item.categories) && item.categories.length > 0;
}
/**
 * Type guard to check if an item has an author
 */
export function hasAuthor(item) {
    return typeof item.author === 'string' && item.author.length > 0;
}
/**
 * Type guard to check if an item has an image
 */
export function hasImage(item) {
    return typeof item.imageUrl === 'string' && item.imageUrl.length > 0;
}
/**
 * Type guard to check if an item has enclosures
 */
export function hasEnclosures(item) {
    return Array.isArray(item.enclosures) && item.enclosures.length > 0;
}
//# sourceMappingURL=feedTypes.js.map