/**
 * Tests for RetryService
 *
 * Tests the retry mechanism including exponential backoff,
 * jitter, and retry state management.
 */

import {
  RetryService,
  createRetryService,
  withRetry,
  RetryConfig
} from '../../src/webparts/polRssGallery/errors/retryService';
import {
  RssErrorCode,
  createRssError
} from '../../src/webparts/polRssGallery/errors/errorTypes';

describe('RetryService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Constructor and Configuration', () => {
    it('should create with default config', () => {
      const service = new RetryService();
      expect(service.getState().attempt).toBe(0);
    });

    it('should create with custom config', () => {
      const config: RetryConfig = {
        maxRetries: 5,
        initialDelayMs: 500
      };
      const service = new RetryService(config);
      expect(service.getState().attempt).toBe(0);
    });
  });

  describe('getState', () => {
    it('should return initial state', () => {
      const service = new RetryService();
      const state = service.getState();

      expect(state.attempt).toBe(0);
      expect(state.isRetrying).toBe(false);
      expect(state.nextRetryIn).toBeNull();
      expect(state.lastError).toBeNull();
      expect(state.exhausted).toBe(false);
    });

    it('should return a copy of state', () => {
      const service = new RetryService();
      const state1 = service.getState();
      const state2 = service.getState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', () => {
      const service = new RetryService();
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

      // Trigger a retry
      service.scheduleRetry(error, jest.fn());

      // Reset
      service.reset();

      const state = service.getState();
      expect(state.attempt).toBe(0);
      expect(state.isRetrying).toBe(false);
      expect(state.nextRetryIn).toBeNull();
      expect(state.exhausted).toBe(false);
    });
  });

  describe('calculateDelay', () => {
    it('should return initial delay for attempt 0', () => {
      const service = new RetryService({ initialDelayMs: 1000, jitterFactor: 0 });
      const delay = service.calculateDelay(0);

      expect(delay).toBe(1000);
    });

    it('should apply exponential backoff', () => {
      const service = new RetryService({
        initialDelayMs: 1000,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      expect(service.calculateDelay(0)).toBe(1000);
      expect(service.calculateDelay(1)).toBe(2000);
      expect(service.calculateDelay(2)).toBe(4000);
      expect(service.calculateDelay(3)).toBe(8000);
    });

    it('should cap at maxDelay', () => {
      const service = new RetryService({
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      expect(service.calculateDelay(10)).toBe(5000);
    });

    it('should add jitter', () => {
      const service = new RetryService({
        initialDelayMs: 1000,
        jitterFactor: 0.5
      });

      // With 50% jitter, delay should be between 1000 and 1500
      const delay = service.calculateDelay(0);
      expect(delay).toBeGreaterThanOrEqual(1000);
      expect(delay).toBeLessThanOrEqual(1500);
    });

    it('should use error-specific delay when error is provided', () => {
      const service = new RetryService();
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

      const delay = service.calculateDelay(0, error);
      // NETWORK_TIMEOUT has default delay of 2000ms
      expect(delay).toBeGreaterThanOrEqual(2000);
    });
  });

  describe('shouldRetry', () => {
    it('should return true for retryable errors', () => {
      const service = new RetryService({ maxRetries: 3 });
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

      expect(service.shouldRetry(error)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const service = new RetryService({ maxRetries: 3 });
      const error = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);

      expect(service.shouldRetry(error)).toBe(false);
    });

    it('should return false when max retries reached', () => {
      const service = new RetryService({ maxRetries: 1 });
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

      // First should allow
      expect(service.shouldRetry(error)).toBe(true);

      // Simulate retry attempt
      service.scheduleRetry(error, jest.fn());
      jest.advanceTimersByTime(10000);

      // Second should not allow (max is 1)
      expect(service.shouldRetry(error)).toBe(false);
    });
  });

  describe('scheduleRetry', () => {
    it('should schedule a retry for retryable errors', () => {
      const service = new RetryService();
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const onRetry = jest.fn();

      service.scheduleRetry(error, onRetry);

      // Should have countdown set
      const state = service.getState();
      expect(state.nextRetryIn).toBeGreaterThan(0);
    });

    it('should call onRetry after delay', () => {
      const service = new RetryService({ initialDelayMs: 1000, jitterFactor: 0 });
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const onRetry = jest.fn();

      service.scheduleRetry(error, onRetry);

      // Fast-forward past delay
      jest.advanceTimersByTime(3000);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call config callbacks', () => {
      const onRetryScheduled = jest.fn();
      const onRetryAttempt = jest.fn();

      const service = new RetryService({
        initialDelayMs: 1000,
        jitterFactor: 0,
        onRetryScheduled,
        onRetryAttempt
      });

      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      service.scheduleRetry(error, jest.fn());

      // Should be called with attempt 1 and some delay
      expect(onRetryScheduled).toHaveBeenCalledWith(1, expect.any(Number));

      // Advance past the retry delay
      jest.advanceTimersByTime(10000);

      expect(onRetryAttempt).toHaveBeenCalledWith(1);
    });

    it('should return cleanup function', () => {
      const service = new RetryService();
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const onRetry = jest.fn();

      const cleanup = service.scheduleRetry(error, onRetry);
      cleanup();

      jest.advanceTimersByTime(10000);

      expect(onRetry).not.toHaveBeenCalled();
    });

    it('should call onRetriesExhausted when max retries reached', () => {
      const onRetriesExhausted = jest.fn();
      const service = new RetryService({
        maxRetries: 0,
        onRetriesExhausted
      });

      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      service.scheduleRetry(error, jest.fn());

      expect(onRetriesExhausted).toHaveBeenCalledWith(error);
    });
  });

  describe('execute', () => {
    it('should execute operation successfully', async () => {
      jest.useRealTimers();
      const service = new RetryService();
      const operation = jest.fn().mockResolvedValue('success');

      const result = await service.execute(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      jest.useRealTimers();
      const service = new RetryService({
        maxRetries: 2,
        initialDelayMs: 10,
        jitterFactor: 0
      });

      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const result = await service.execute(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should throw when all retries exhausted', async () => {
      jest.useRealTimers();
      const onRetriesExhausted = jest.fn();
      const service = new RetryService({
        maxRetries: 1,
        initialDelayMs: 10,
        jitterFactor: 0,
        onRetriesExhausted
      });

      const operation = jest.fn().mockRejectedValue(new Error('always fails'));

      try {
        await service.execute(operation);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeDefined();
      }

      // Initial attempt + max retries (1)
      expect(operation).toHaveBeenCalled();
      expect(onRetriesExhausted).toHaveBeenCalled();
    });

    it('should reset state on success', async () => {
      jest.useRealTimers();
      const service = new RetryService({
        initialDelayMs: 10,
        jitterFactor: 0
      });

      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      await service.execute(operation);

      const state = service.getState();
      expect(state.attempt).toBe(0);
      expect(state.exhausted).toBe(false);
    });
  });
});

describe('createRetryService', () => {
  it('should create a new RetryService instance', () => {
    const service = createRetryService();
    expect(service).toBeInstanceOf(RetryService);
  });

  it('should pass config to service', () => {
    const service = createRetryService({ maxRetries: 10 });
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

    // Verify service respects config
    expect(service.shouldRetry(error)).toBe(true);
  });
});

describe('withRetry', () => {
  it('should wrap function with retry behavior', async () => {
    jest.useRealTimers();
    const fn = jest.fn().mockResolvedValue('result');
    const wrappedFn = withRetry(fn, { maxRetries: 2, initialDelayMs: 10 });

    const result = await wrappedFn('arg1', 'arg2');

    expect(result).toBe('result');
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should retry on failure', async () => {
    jest.useRealTimers();
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const wrappedFn = withRetry(fn, {
      maxRetries: 2,
      initialDelayMs: 10,
      jitterFactor: 0
    });

    const result = await wrappedFn();

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
