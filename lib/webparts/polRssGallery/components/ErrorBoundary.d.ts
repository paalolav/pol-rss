import * as React from 'react';
import { RssError } from '../errors/errorTypes';
/**
 * Error boundary state interface
 */
interface IErrorBoundaryState {
    hasError: boolean;
    error: RssError | null;
    retryCount: number;
    lastRetry: Date | null;
    isRetrying: boolean;
    nextRetryIn: number | null;
}
/**
 * Error boundary props interface
 */
interface IErrorBoundaryProps {
    children: React.ReactNode;
    /** Custom fallback renderer */
    customFallback?: (error: RssError, retry: () => void) => React.ReactNode;
    /** Callback when error occurs */
    onError?: (error: RssError) => void;
    /** Callback when action button is clicked */
    onAction?: (actionId: string, error: RssError) => void;
    /** Whether to enable auto-retry for retryable errors */
    enableAutoRetry?: boolean;
    /** Feed URL for error context */
    feedUrl?: string;
}
/**
 * Enhanced Error Boundary with structured error handling
 *
 * Features:
 * - Categorizes errors using RssError types
 * - Shows appropriate icons based on severity
 * - Supports retry with exponential backoff
 * - Provides action buttons for recovery
 * - Logs errors with context
 */
export declare class RssErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    private retryTimer;
    private countdownTimer;
    state: IErrorBoundaryState;
    static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState>;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    componentWillUnmount(): void;
    private clearTimers;
    private scheduleAutoRetry;
    private handleRetry;
    private _handleReset;
    private handleAction;
    private getIconClassName;
    private renderDefaultFallback;
    private getErrorTitle;
    render(): React.ReactNode;
}
export default RssErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map