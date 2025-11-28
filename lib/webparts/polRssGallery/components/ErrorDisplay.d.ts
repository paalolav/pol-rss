import * as React from 'react';
import { RssError, RssErrorAction } from '../errors/errorTypes';
/**
 * Props for ErrorDisplay component
 */
export interface IErrorDisplayProps {
    /** The error to display */
    error: RssError;
    /** Retry count (for showing retry progress) */
    retryCount?: number;
    /** Whether currently retrying */
    isRetrying?: boolean;
    /** Seconds until next auto-retry */
    nextRetryIn?: number | null;
    /** Callback when action button is clicked */
    onAction?: (action: RssErrorAction) => void;
    /** Whether to show technical details */
    showDetails?: boolean;
    /** Compact mode for inline display */
    compact?: boolean;
}
/**
 * ErrorDisplay Component
 *
 * A reusable component for displaying errors with user-friendly messages,
 * appropriate icons based on severity, and action buttons for recovery.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={myError}
 *   onAction={(action) => handleAction(action)}
 * />
 * ```
 */
export declare const ErrorDisplay: React.FC<IErrorDisplayProps>;
export default ErrorDisplay;
//# sourceMappingURL=ErrorDisplay.d.ts.map