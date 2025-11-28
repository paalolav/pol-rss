/**
 * Retry Service
 *
 * Provides intelligent retry mechanism with exponential backoff and jitter.
 * Handles automatic retry scheduling for retryable errors.
 */

import {
  RssError,
  RssErrorCode,
  isRetryable,
  getRetryDelay,
  getMaxRetries,
  createRssError
} from './errorTypes';

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
 * Default retry configuration
 */
const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 2000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  onRetryScheduled: () => { /* noop */ },
  onRetryAttempt: () => { /* noop */ },
  onRetriesExhausted: () => { /* noop */ }
};

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
export class RetryService {
  private config: Required<RetryConfig>;
  private state: RetryState;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: RetryConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      attempt: 0,
      isRetrying: false,
      nextRetryIn: null,
      lastError: null,
      exhausted: false
    };
  }

  /**
   * Gets the current retry state
   */
  public getState(): RetryState {
    return { ...this.state };
  }

  /**
   * Resets the retry state to initial
   */
  public reset(): void {
    this.clearTimers();
    this.state = {
      attempt: 0,
      isRetrying: false,
      nextRetryIn: null,
      lastError: null,
      exhausted: false
    };
  }

  /**
   * Calculates the delay for the next retry attempt
   * @param attempt - The current attempt number (0-based)
   * @param error - Optional error for error-specific delays
   * @returns Delay in milliseconds
   */
  public calculateDelay(attempt: number, error?: RssError): number {
    if (error) {
      return getRetryDelay(error, attempt);
    }

    const { initialDelayMs, maxDelayMs, backoffMultiplier, jitterFactor } = this.config;

    // Exponential backoff
    const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt);

    // Add jitter to prevent thundering herd
    const jitter = exponentialDelay * jitterFactor * Math.random();

    // Cap at max delay
    return Math.min(exponentialDelay + jitter, maxDelayMs);
  }

  /**
   * Determines if an operation should be retried
   * @param error - The error from the failed operation
   * @returns True if should retry
   */
  public shouldRetry(error: RssError): boolean {
    if (!isRetryable(error)) {
      return false;
    }

    const maxRetries = this.config.maxRetries ?? getMaxRetries(error);
    return this.state.attempt < maxRetries;
  }

  /**
   * Schedules a retry with callback
   * @param error - The error that triggered retry
   * @param onRetry - Callback to execute on retry
   * @returns Cleanup function to cancel scheduled retry
   */
  public scheduleRetry(
    error: RssError,
    onRetry: () => void
  ): () => void {
    if (!this.shouldRetry(error)) {
      this.state.exhausted = true;
      this.config.onRetriesExhausted(error);
      return () => { /* noop */ };
    }

    const delay = this.calculateDelay(this.state.attempt, error);
    const delaySeconds = Math.ceil(delay / 1000);

    this.state.lastError = error;
    this.state.nextRetryIn = delaySeconds;
    this.config.onRetryScheduled(this.state.attempt + 1, delay);

    // Start countdown
    this.countdownTimer = setInterval(() => {
      if (this.state.nextRetryIn !== null && this.state.nextRetryIn > 0) {
        this.state.nextRetryIn--;
      } else {
        this.clearCountdown();
      }
    }, 1000);

    // Schedule retry
    this.retryTimer = setTimeout(() => {
      this.clearTimers();
      this.state.attempt++;
      this.state.isRetrying = true;
      this.state.nextRetryIn = null;
      this.config.onRetryAttempt(this.state.attempt);
      onRetry();
      this.state.isRetrying = false;
    }, delay);

    return () => this.clearTimers();
  }

  /**
   * Executes an operation with automatic retry
   * @param operation - The async operation to execute
   * @param initialError - Optional initial error (skip first attempt)
   * @returns Result of the operation
   * @throws RssError if all retries exhausted
   */
  public async execute<T>(
    operation: () => Promise<T>,
    initialError?: RssError
  ): Promise<T> {
    this.reset();

    // If initial error provided, check if retryable
    if (initialError) {
      this.state.lastError = initialError;
      if (!this.shouldRetry(initialError)) {
        throw initialError;
      }
    }

    // Execute with retries - loop exits via return (success) or throw (exhausted)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (this.state.attempt > 0 || initialError) {
          const delay = this.calculateDelay(
            this.state.attempt,
            this.state.lastError ?? undefined
          );
          await this.delay(delay);
          this.config.onRetryAttempt(this.state.attempt);
        }

        this.state.isRetrying = this.state.attempt > 0;
        const result = await operation();
        this.reset();
        return result;
      } catch (error) {
        const rssError = error instanceof Error
          ? createRssError(RssErrorCode.RUNTIME_UNKNOWN, { cause: error, message: error.message })
          : createRssError(RssErrorCode.RUNTIME_UNKNOWN, { message: String(error) });

        this.state.lastError = rssError;
        this.state.attempt++;

        if (!this.shouldRetry(rssError)) {
          this.state.exhausted = true;
          this.config.onRetriesExhausted(rssError);
          throw rssError;
        }
      }
    }
  }

  /**
   * Clears all timers
   */
  private clearTimers(): void {
    this.clearRetry();
    this.clearCountdown();
  }

  /**
   * Clears the retry timer
   */
  private clearRetry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  /**
   * Clears the countdown timer
   */
  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  /**
   * Promise-based delay
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Creates a retry service with default configuration
 */
export function createRetryService(config?: RetryConfig): RetryService {
  return new RetryService(config);
}

/**
 * Utility to wrap an async function with automatic retry
 * @param fn - The async function to wrap
 * @param config - Retry configuration
 * @returns Wrapped function with retry behavior
 */
export function withRetry<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config?: RetryConfig
): (...args: TArgs) => Promise<TResult> {
  const service = new RetryService(config);

  return async (...args: TArgs): Promise<TResult> => {
    return service.execute(() => fn(...args));
  };
}

export default RetryService;
