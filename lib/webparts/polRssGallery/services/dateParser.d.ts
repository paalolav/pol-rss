/**
 * Date Parser Service for RSS/Atom Feeds
 *
 * Handles various date formats commonly found in feeds:
 * - RFC 822 (RSS standard): "Sat, 23 Nov 2025 14:30:00 GMT"
 * - RFC 3339/ISO 8601 (Atom standard): "2025-11-23T14:30:00Z"
 * - Various non-standard formats used by real-world feeds
 *
 * @module dateParser
 * @see ST-003-05: Improve Date Parsing
 */
/**
 * Result of parsing a date string
 */
export interface DateParseResult {
    /** Successfully parsed Date object, or null if parsing failed */
    date: Date | null;
    /** Original input string */
    original: string;
    /** Whether parsing was successful */
    success: boolean;
    /** The format that was successfully matched, or 'unknown' */
    format: DateFormat | 'unknown';
}
/**
 * Supported date formats
 */
export type DateFormat = 'rfc822' | 'rfc3339' | 'iso8601' | 'iso8601-date' | 'us-date' | 'eu-date' | 'long-date' | 'relative' | 'timestamp';
/**
 * Parse a date string from various formats
 *
 * @param dateStr - The date string to parse
 * @returns DateParseResult with parsed date and metadata
 *
 * @example
 * ```typescript
 * const result = parseDate('Sat, 23 Nov 2025 14:30:00 GMT');
 * if (result.success) {
 *   console.log(result.date); // Date object
 *   console.log(result.format); // 'rfc822'
 * }
 * ```
 */
export declare function parseDate(dateStr: string): DateParseResult;
/**
 * Parse date and return Date object or fallback
 *
 * @param dateStr - The date string to parse
 * @param fallback - Fallback value if parsing fails (default: new Date())
 * @returns Parsed Date or fallback
 */
export declare function parseDateOrDefault(dateStr: string, fallback?: Date): Date;
/**
 * Parse date and return ISO string or null
 *
 * @param dateStr - The date string to parse
 * @returns ISO 8601 string or null if parsing failed
 */
export declare function parseDateToIsoString(dateStr: string): string | null;
/**
 * Check if a Date object is valid (not Invalid Date)
 */
export declare function isValidDate(date: Date): boolean;
/**
 * Format a Date object for display
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'nb-NO')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export declare function formatDate(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format a Date object for relative display (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'nb-NO')
 * @returns Relative time string
 */
export declare function formatRelativeDate(date: Date, locale?: string): string;
/**
 * Compare two dates for sorting
 *
 * @param a - First date string
 * @param b - Second date string
 * @param descending - Sort descending (newest first) if true
 * @returns Comparison result (-1, 0, 1)
 */
export declare function compareDates(a: string, b: string, descending?: boolean): number;
//# sourceMappingURL=dateParser.d.ts.map