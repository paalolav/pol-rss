/**
 * Feed Recovery Service (ST-003-07)
 *
 * Implements recovery strategies to extract as much content as possible
 * from malformed feeds. When a feed fails to parse normally, this service
 * applies various fixes to salvage the content.
 */
/**
 * Types of recovery strategies available
 */
export type RecoveryStrategyType = 'fixUnclosedTags' | 'fixBadEncoding' | 'fixMissingNamespaces' | 'stripInvalidXml' | 'extractFromHtml' | 'fixBrokenCdata' | 'removeControlCharacters' | 'fixDuplicateDeclarations' | 'fixMalformedAttributes' | 'normalizeWhitespace';
/**
 * Result of a recovery action
 */
export interface RecoveryAction {
    /** The strategy that was applied */
    strategy: RecoveryStrategyType;
    /** Description of what was fixed */
    description: string;
    /** How many fixes were applied */
    fixCount: number;
    /** Whether the fix was successful */
    success: boolean;
}
/**
 * Error information for items that failed to parse
 */
export interface ItemParseError {
    /** Index of the item in the original feed */
    itemIndex: number;
    /** Partial content that could be extracted */
    partialContent?: {
        title?: string;
        link?: string;
        description?: string;
    };
    /** Error message */
    error: string;
}
/**
 * Result of attempting feed recovery
 */
export interface RecoveryResult {
    /** Whether recovery was attempted */
    recoveryAttempted: boolean;
    /** The recovered/fixed XML content */
    recoveredContent: string;
    /** List of recovery actions that were applied */
    appliedStrategies: RecoveryAction[];
    /** Warnings about the feed (non-fatal issues) */
    warnings: string[];
    /** Errors for items that couldn't be recovered */
    itemErrors: ItemParseError[];
    /** Original error that triggered recovery */
    originalError?: string;
}
/**
 * Options for recovery
 */
export interface RecoveryOptions {
    /** Enable aggressive recovery (may alter content more) */
    aggressive?: boolean;
    /** Maximum number of strategies to try */
    maxStrategies?: number;
    /** Specific strategies to try (in order) */
    strategies?: RecoveryStrategyType[];
}
/**
 * Try to extract individual items using alternative methods when normal parsing fails
 */
export declare function extractItemsAlternative(xml: string): Array<{
    title?: string;
    link?: string;
    description?: string;
    pubDate?: string;
}>;
/**
 * Main recovery function - attempts to fix malformed feed content
 */
export declare function attemptRecovery(xml: string, options?: RecoveryOptions): RecoveryResult;
/**
 * Quick check if content might need recovery
 */
export declare function needsRecovery(xml: string): boolean;
/**
 * Validate recovered content by attempting to parse it
 */
export declare function validateRecoveredContent(xml: string): {
    valid: boolean;
    hasItems: boolean;
    itemCount: number;
    error?: string;
};
//# sourceMappingURL=feedRecovery.d.ts.map