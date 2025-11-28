/**
 * Retry Service
 *
 * Provides intelligent retry mechanism with exponential backoff and jitter.
 * Handles automatic retry scheduling for retryable errors.
 */
import { RssError } from './errorTypes';
/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
    /** Maximum number of retry attempts (default: from error metadata) */
    maxRetries?: number;
    /** Initial delay in milliseconds (default: from error metadata) */
    initialDelayMs?: number;
    /** Maximum delay in milliseconds (default: 30000) */
    maxDelayMs?: number;
    /** Backoff multiplier (default: 2) */
    backoffMultiplier?: number;
    /** Jitter factor (0-1, default: 0.1) */
    jitterFactor?: number;
    /** Callback when retry is scheduled */
    onRetryScheduled?: (attempt: number, delayMs: number) => void;
    /** Callback when retry is attempted */
    onRetryAttempt?: (attempt: number) => void;
    /** Callback when all retries are exhausted */
    onRetriesExhausted?: (error: RssError) => void;
}
/**
 * State of a retry operation
 */
export interface RetryState {
    /** Current retry attempt (0 = initial, 1+ = retry) */
    attempt: number;
    /** Whether currently in retry process */
    isRetrying: boolean;
    /** Time until next retry in seconds (null if not scheduled) */
    nextRetryIn: number | null;
    /** Last error encountered */
    lastError: RssError | null;
    /** Whether max retries has been reached */
    exhausted: boolean;
}
/**
 * Retry Service class
 *
 * Manages retry attempts for failed operations with exponential backoff.
 *
 * @example
 * ```typescript
 * const retryService = new RetryService({
 *   onRetryAttempt: (attempt) => console.log(`Retry ${attempt}`),
 * });
 *
 * const result = await retryService.execute(
 *   () => fetchFeed(url),
 *   error
 * );
 * ```
 */
export declare class RetryService {
    private config;
    private state;
    private retryTimer;
    private countdownTimer;
    constructor(config?: RetryConfig);
    /**
     * Gets the current retry state
     */
    getState(): RetryState;
    /**
     * Resets the retry state to initial
     */
    reset(): void;
    /**
     * Calculates the delay for the next retry attempt
     * @param attempt - The current attempt number (0-based)
     * @param error - Optional error for error-specific delays
     * @returns Delay in milliseconds
     */
    calculateDelay(attempt: number, error?: RssError): number;
    /**
     * Determines if an operation should be retried
     * @param error - The error from the failed operation
     * @returns True if should retry
     */
    shouldRetry(error: RssError): boolean;
    /**
     * Schedules a retry with callback
     * @param error - The error that triggered retry
     * @param onRetry - Callback to execute on retry
     * @returns Cleanup function to cancel scheduled retry
     */
    scheduleRetry(error: RssError, onRetry: () => void): () => void;
    /**
     * Executes an operation with automatic retry
     * @param operation - The async operation to execute
     * @param initialError - Optional initial error (skip first attempt)
     * @returns Result of the operation
     * @throws RssError if all retries exhausted
     */
    execute<T>(operation: () => Promise<T>, initialError?: RssError): Promise<T>;
    /**
     * Clears all timers
     */
    private clearTimers;
    /**
     * Clears the retry timer
     */
    private clearRetry;
    /**
     * Clears the countdown timer
     */
    private clearCountdown;
    /**
     * Promise-based delay
     * @param ms - Milliseconds to delay
     */
    private delay;
}
/**
 * Creates a retry service with default configuration
 */
export declare function createRetryService(config?: RetryConfig): RetryService;
/**
 * Utility to wrap an async function with automatic retry
 * @param fn - The async function to wrap
 * @param config - Retry configuration
 * @returns Wrapped function with retry behavior
 */
export declare function withRetry<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>, config?: RetryConfig): (...args: TArgs) => Promise<TResult>;
export default RetryService;
//# sourceMappingURL=retryService.d.ts.map