/**
 * Feed Validator Service
 *
 * Validates feed content and detects format (RSS 1.0, RSS 2.0, Atom, JSON Feed).
 * Returns structured validation results with errors and warnings.
 */
/**
 * Supported feed formats
 */
export type FeedFormat = 'rss1' | 'rss2' | 'atom' | 'json' | 'unknown';
/**
 * Validation error structure
 */
export interface ValidationError {
    code: string;
    message: string;
    field?: string;
}
/**
 * Validation warning structure
 */
export interface ValidationWarning {
    code: string;
    message: string;
    field?: string;
}
/**
 * Feed validation result
 */
export interface FeedValidationResult {
    isValid: boolean;
    format: FeedFormat;
    formatVersion?: string;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    metadata?: {
        title?: string;
        description?: string;
        link?: string;
        itemCount?: number;
    };
}
/**
 * Validate feed content and detect format
 *
 * @param content - Raw feed content string
 * @returns Validation result with format, errors, and warnings
 */
export declare function validateFeed(content: string): FeedValidationResult;
/**
 * Detect feed format without full validation
 *
 * @param content - Raw feed content string
 * @returns Detected feed format
 */
export declare function detectFeedFormat(content: string): FeedFormat;
//# sourceMappingURL=feedValidator.d.ts.map