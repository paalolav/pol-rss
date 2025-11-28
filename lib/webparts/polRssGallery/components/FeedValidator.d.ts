/**
 * FeedValidator Component
 *
 * Provides real-time feed URL validation with accessibility testing.
 * Used in the property pane to help users configure valid feed URLs.
 */
import * as React from 'react';
import { RssError } from '../errors/errorTypes';
/**
 * Validation state types
 */
export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'warning';
export interface ValidationState {
    status: ValidationStatus;
    feedTitle?: string;
    itemCount?: number;
    format?: string;
    error?: RssError;
    warnings?: string[];
}
/**
 * Props for FeedValidator component
 */
export interface IFeedValidatorProps {
    /** Current URL value */
    url: string;
    /** Callback when URL changes */
    onUrlChange: (url: string) => void;
    /** Callback when validation state changes */
    onValidationChange?: (state: ValidationState) => void;
    /** Optional fetch function for testing (defaults to window.fetch) */
    fetchFn?: (url: string) => Promise<Response>;
    /** Proxy URL to use for CORS issues */
    proxyUrl?: string;
    /** Auto-validate on blur */
    validateOnBlur?: boolean;
    /** Debounce delay in ms for auto-validation */
    debounceMs?: number;
    /** Placeholder text */
    placeholder?: string;
    /** Label text */
    label?: string;
    /** Show detailed validation results */
    showDetails?: boolean;
    /** Disabled state */
    disabled?: boolean;
}
/**
 * URL format validation result
 */
interface UrlValidation {
    isValid: boolean;
    error?: string;
    suggestion?: string;
}
/**
 * Validate URL format
 */
export declare function validateUrlFormat(url: string): UrlValidation;
/**
 * FeedValidator Component
 *
 * Provides URL input with real-time validation and feed testing capabilities.
 * Shows detailed feedback about feed validity and common issues.
 */
export declare const FeedValidator: React.FC<IFeedValidatorProps>;
/**
 * Simple URL validation hook for use elsewhere
 */
export declare function useFeedUrlValidation(initialUrl?: string): {
    url: string;
    setUrl: (url: string) => void;
    isValid: boolean;
    error: string | null;
    suggestion: string | null;
};
export default FeedValidator;
//# sourceMappingURL=FeedValidator.d.ts.map