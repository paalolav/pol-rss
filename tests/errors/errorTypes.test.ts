/**
 * Tests for RSS Error Types
 *
 * Tests the error type system including error codes, factory functions,
 * classification, and utility functions.
 */

import {
  RssErrorCode,
  RssErrorCategory,
  RssErrorSeverity,
  RssError,
  ERROR_METADATA,
  createRssError,
  createRssErrorFromError,
  classifyError,
  isRssError,
  getErrorCategory,
  isRetryable,
  isRecoverable,
  getRetryDelay,
  getMaxRetries
} from '../../src/webparts/polRssGallery/errors/errorTypes';

describe('RssErrorCode', () => {
  describe('Network errors (1xx)', () => {
    it('should have CORS blocked error code 101', () => {
      expect(RssErrorCode.NETWORK_CORS_BLOCKED).toBe(101);
    });

    it('should have timeout error code 102', () => {
      expect(RssErrorCode.NETWORK_TIMEOUT).toBe(102);
    });

    it('should have DNS failed error code 103', () => {
      expect(RssErrorCode.NETWORK_DNS_FAILED).toBe(103);
    });

    it('should have offline error code 104', () => {
      expect(RssErrorCode.NETWORK_OFFLINE).toBe(104);
    });

    it('should have proxy failed error code 105', () => {
      expect(RssErrorCode.NETWORK_PROXY_FAILED).toBe(105);
    });

    it('should have all network error codes in 1xx range', () => {
      const networkCodes = [
        RssErrorCode.NETWORK_CORS_BLOCKED,
        RssErrorCode.NETWORK_TIMEOUT,
        RssErrorCode.NETWORK_DNS_FAILED,
        RssErrorCode.NETWORK_OFFLINE,
        RssErrorCode.NETWORK_PROXY_FAILED,
        RssErrorCode.NETWORK_HTTP_ERROR,
        RssErrorCode.NETWORK_CONNECTION_REFUSED,
        RssErrorCode.NETWORK_SSL_ERROR,
        RssErrorCode.NETWORK_UNKNOWN
      ];

      networkCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(100);
        expect(code).toBeLessThan(200);
      });
    });
  });

  describe('Parsing errors (2xx)', () => {
    it('should have invalid XML error code 201', () => {
      expect(RssErrorCode.PARSE_INVALID_XML).toBe(201);
    });

    it('should have unknown format error code 202', () => {
      expect(RssErrorCode.PARSE_UNKNOWN_FORMAT).toBe(202);
    });

    it('should have all parsing error codes in 2xx range', () => {
      const parseCodes = [
        RssErrorCode.PARSE_INVALID_XML,
        RssErrorCode.PARSE_UNKNOWN_FORMAT,
        RssErrorCode.PARSE_EMPTY_FEED,
        RssErrorCode.PARSE_MISSING_ITEMS,
        RssErrorCode.PARSE_ENCODING_ERROR,
        RssErrorCode.PARSE_CSP_VIOLATION,
        RssErrorCode.PARSE_VALIDATION_FAILED,
        RssErrorCode.PARSE_RECOVERY_FAILED
      ];

      parseCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(200);
        expect(code).toBeLessThan(300);
      });
    });
  });

  describe('Configuration errors (3xx)', () => {
    it('should have invalid URL error code 301', () => {
      expect(RssErrorCode.CONFIG_INVALID_URL).toBe(301);
    });

    it('should have all configuration error codes in 3xx range', () => {
      const configCodes = [
        RssErrorCode.CONFIG_INVALID_URL,
        RssErrorCode.CONFIG_MISSING_URL,
        RssErrorCode.CONFIG_PROXY_MISSING,
        RssErrorCode.CONFIG_INVALID_SETTINGS,
        RssErrorCode.CONFIG_URL_BLOCKED
      ];

      configCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(300);
        expect(code).toBeLessThan(400);
      });
    });
  });

  describe('Runtime errors (4xx)', () => {
    it('should have component crash error code 401', () => {
      expect(RssErrorCode.RUNTIME_COMPONENT_CRASH).toBe(401);
    });

    it('should have all runtime error codes in 4xx range', () => {
      const runtimeCodes = [
        RssErrorCode.RUNTIME_COMPONENT_CRASH,
        RssErrorCode.RUNTIME_MEMORY_EXCEEDED,
        RssErrorCode.RUNTIME_RENDER_TIMEOUT,
        RssErrorCode.RUNTIME_UNKNOWN
      ];

      runtimeCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(400);
        expect(code).toBeLessThan(500);
      });
    });
  });
});

describe('ERROR_METADATA', () => {
  it('should have metadata for all error codes', () => {
    const allCodes = Object.values(RssErrorCode).filter(
      v => typeof v === 'number'
    ) as RssErrorCode[];

    allCodes.forEach(code => {
      expect(ERROR_METADATA[code]).toBeDefined();
      expect(ERROR_METADATA[code].code).toBe(code);
    });
  });

  it('should have correct categories for network errors', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_CORS_BLOCKED].category).toBe(
      RssErrorCategory.NETWORK
    );
    expect(ERROR_METADATA[RssErrorCode.NETWORK_TIMEOUT].category).toBe(
      RssErrorCategory.NETWORK
    );
  });

  it('should have correct categories for parsing errors', () => {
    expect(ERROR_METADATA[RssErrorCode.PARSE_INVALID_XML].category).toBe(
      RssErrorCategory.PARSING
    );
  });

  it('should have correct categories for configuration errors', () => {
    expect(ERROR_METADATA[RssErrorCode.CONFIG_INVALID_URL].category).toBe(
      RssErrorCategory.CONFIGURATION
    );
  });

  it('should have correct categories for runtime errors', () => {
    expect(ERROR_METADATA[RssErrorCode.RUNTIME_COMPONENT_CRASH].category).toBe(
      RssErrorCategory.RUNTIME
    );
  });

  it('should mark CORS errors as not retryable', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_CORS_BLOCKED].retryable).toBe(false);
  });

  it('should mark timeout errors as retryable', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_TIMEOUT].retryable).toBe(true);
  });

  it('should mark offline errors as retryable', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_OFFLINE].retryable).toBe(true);
  });

  it('should have retry delays for retryable errors', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_TIMEOUT].defaultRetryDelayMs).toBeGreaterThan(0);
    expect(ERROR_METADATA[RssErrorCode.NETWORK_OFFLINE].defaultRetryDelayMs).toBeGreaterThan(0);
  });

  it('should have max retries for retryable errors', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_TIMEOUT].defaultMaxRetries).toBeGreaterThan(0);
  });

  it('should have zero max retries for non-retryable errors', () => {
    expect(ERROR_METADATA[RssErrorCode.NETWORK_CORS_BLOCKED].defaultMaxRetries).toBe(0);
  });
});

describe('createRssError', () => {
  it('should create error with correct code', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(error.code).toBe(RssErrorCode.NETWORK_TIMEOUT);
  });

  it('should create error with correct category', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(error.category).toBe(RssErrorCategory.NETWORK);
  });

  it('should create error with timestamp', () => {
    const before = new Date();
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    const after = new Date();

    expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(error.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should use custom message when provided', () => {
    const customMessage = 'Custom error message';
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT, {
      message: customMessage
    });
    expect(error.message).toBe(customMessage);
  });

  it('should use custom user message when provided', () => {
    const customUserMessage = 'Something went wrong';
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT, {
      userMessage: customUserMessage
    });
    expect(error.userMessage).toBe(customUserMessage);
  });

  it('should include error details when provided', () => {
    const details = {
      feedUrl: 'https://example.com/feed.xml',
      httpStatus: 500
    };
    const error = createRssError(RssErrorCode.NETWORK_HTTP_ERROR, { details });
    expect(error.details).toEqual(details);
  });

  it('should include cause when provided', () => {
    const cause = new Error('Original error');
    const error = createRssError(RssErrorCode.NETWORK_UNKNOWN, { cause });
    expect(error.cause).toBe(cause);
  });

  it('should include suggested actions', () => {
    const error = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);
    expect(error.suggestedActions).toBeDefined();
    expect(error.suggestedActions!.length).toBeGreaterThan(0);
    expect(error.suggestedActions!.some(a => a.id === 'configure-proxy')).toBe(true);
  });

  it('should use custom suggested actions when provided', () => {
    const customActions = [{ id: 'custom', label: 'Custom Action', primary: true }];
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT, {
      suggestedActions: customActions
    });
    expect(error.suggestedActions).toEqual(customActions);
  });

  it('should set retryable flag from metadata', () => {
    const timeoutError = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(timeoutError.retryable).toBe(true);

    const corsError = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);
    expect(corsError.retryable).toBe(false);
  });

  it('should set recoverable flag from metadata', () => {
    const configError = createRssError(RssErrorCode.CONFIG_MISSING_URL);
    expect(configError.recoverable).toBe(true);

    const sslError = createRssError(RssErrorCode.NETWORK_SSL_ERROR);
    expect(sslError.recoverable).toBe(false);
  });

  it('should set severity from metadata', () => {
    const warningError = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(warningError.severity).toBe(RssErrorSeverity.WARNING);

    const criticalError = createRssError(RssErrorCode.NETWORK_SSL_ERROR);
    expect(criticalError.severity).toBe(RssErrorSeverity.CRITICAL);
  });
});

describe('createRssErrorFromError', () => {
  it('should create RssError from native Error', () => {
    const nativeError = new Error('Something went wrong');
    const error = createRssErrorFromError(nativeError);

    expect(error).toBeDefined();
    expect(error.cause).toBe(nativeError);
  });

  it('should classify CORS errors correctly', () => {
    const corsError = new Error('Access to XMLHttpRequest blocked by CORS policy');
    const error = createRssErrorFromError(corsError);

    expect(error.code).toBe(RssErrorCode.NETWORK_CORS_BLOCKED);
  });

  it('should classify timeout errors correctly', () => {
    const timeoutError = new Error('Request timeout');
    const error = createRssErrorFromError(timeoutError);

    expect(error.code).toBe(RssErrorCode.NETWORK_TIMEOUT);
  });

  it('should classify DNS errors correctly', () => {
    const dnsError = new Error('getaddrinfo ENOTFOUND example.com');
    const error = createRssErrorFromError(dnsError);

    expect(error.code).toBe(RssErrorCode.NETWORK_DNS_FAILED);
  });

  it('should include feed URL in details', () => {
    const nativeError = new Error('Connection refused');
    const feedUrl = 'https://example.com/feed.xml';
    const error = createRssErrorFromError(nativeError, feedUrl);

    expect(error.details?.feedUrl).toBe(feedUrl);
  });

  it('should include stack trace in details', () => {
    const nativeError = new Error('Test error');
    const error = createRssErrorFromError(nativeError);

    expect(error.details?.stack).toBe(nativeError.stack);
  });
});

describe('classifyError', () => {
  it('should classify CORS errors', () => {
    expect(classifyError(new Error('Blocked by CORS policy'))).toBe(
      RssErrorCode.NETWORK_CORS_BLOCKED
    );
    expect(classifyError(new Error('Access-Control-Allow-Origin missing'))).toBe(
      RssErrorCode.NETWORK_CORS_BLOCKED
    );
  });

  it('should classify timeout errors', () => {
    expect(classifyError(new Error('Request timeout'))).toBe(
      RssErrorCode.NETWORK_TIMEOUT
    );
    const timeoutError = new Error('Timed out');
    timeoutError.name = 'TimeoutError';
    expect(classifyError(timeoutError)).toBe(RssErrorCode.NETWORK_TIMEOUT);
  });

  it('should classify DNS errors', () => {
    expect(classifyError(new Error('getaddrinfo ENOTFOUND'))).toBe(
      RssErrorCode.NETWORK_DNS_FAILED
    );
    expect(classifyError(new Error('DNS resolution failed'))).toBe(
      RssErrorCode.NETWORK_DNS_FAILED
    );
  });

  it('should classify proxy errors', () => {
    expect(classifyError(new Error('Proxy connection failed'))).toBe(
      RssErrorCode.NETWORK_PROXY_FAILED
    );
  });

  it('should classify SSL errors', () => {
    expect(classifyError(new Error('SSL certificate problem'))).toBe(
      RssErrorCode.NETWORK_SSL_ERROR
    );
    expect(classifyError(new Error('Certificate validation failed'))).toBe(
      RssErrorCode.NETWORK_SSL_ERROR
    );
  });

  it('should classify connection refused errors', () => {
    expect(classifyError(new Error('ECONNREFUSED'))).toBe(
      RssErrorCode.NETWORK_CONNECTION_REFUSED
    );
    expect(classifyError(new Error('Connection refused'))).toBe(
      RssErrorCode.NETWORK_CONNECTION_REFUSED
    );
  });

  it('should classify XML parsing errors', () => {
    expect(classifyError(new Error('Invalid XML syntax'))).toBe(
      RssErrorCode.PARSE_INVALID_XML
    );
    expect(classifyError(new Error('XML parse error'))).toBe(
      RssErrorCode.PARSE_INVALID_XML
    );
  });

  it('should classify unknown format errors', () => {
    expect(classifyError(new Error('Unrecognized feed format'))).toBe(
      RssErrorCode.PARSE_UNKNOWN_FORMAT
    );
  });

  it('should classify empty feed errors', () => {
    expect(classifyError(new Error('Feed is empty'))).toBe(
      RssErrorCode.PARSE_EMPTY_FEED
    );
  });

  it('should classify encoding errors', () => {
    expect(classifyError(new Error('Character encoding error'))).toBe(
      RssErrorCode.PARSE_ENCODING_ERROR
    );
    expect(classifyError(new Error('Invalid charset'))).toBe(
      RssErrorCode.PARSE_ENCODING_ERROR
    );
  });

  it('should classify CSP errors', () => {
    expect(classifyError(new Error('Content Security Policy violation'))).toBe(
      RssErrorCode.PARSE_CSP_VIOLATION
    );
  });

  it('should classify invalid URL errors', () => {
    expect(classifyError(new Error('Invalid URL format'))).toBe(
      RssErrorCode.CONFIG_INVALID_URL
    );
    expect(classifyError(new Error('Malformed URL'))).toBe(
      RssErrorCode.CONFIG_INVALID_URL
    );
  });

  it('should classify missing URL errors', () => {
    expect(classifyError(new Error('URL is required but missing'))).toBe(
      RssErrorCode.CONFIG_MISSING_URL
    );
  });

  it('should classify blocked URL errors', () => {
    expect(classifyError(new Error('URL is blocked'))).toBe(
      RssErrorCode.CONFIG_URL_BLOCKED
    );
    expect(classifyError(new Error('Access forbidden'))).toBe(
      RssErrorCode.CONFIG_URL_BLOCKED
    );
  });

  it('should classify memory errors', () => {
    expect(classifyError(new Error('Out of memory'))).toBe(
      RssErrorCode.RUNTIME_MEMORY_EXCEEDED
    );
    expect(classifyError(new Error('Heap limit reached'))).toBe(
      RssErrorCode.RUNTIME_MEMORY_EXCEEDED
    );
  });

  it('should classify component errors', () => {
    expect(classifyError(new Error('Component render failed'))).toBe(
      RssErrorCode.RUNTIME_COMPONENT_CRASH
    );
  });

  it('should default to unknown runtime error', () => {
    expect(classifyError(new Error('Some random error'))).toBe(
      RssErrorCode.RUNTIME_UNKNOWN
    );
  });
});

describe('isRssError', () => {
  it('should return true for valid RssError objects', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(isRssError(error)).toBe(true);
  });

  it('should return false for native Error objects', () => {
    expect(isRssError(new Error('test'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isRssError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isRssError(undefined)).toBe(false);
  });

  it('should return false for plain objects without required fields', () => {
    expect(isRssError({ message: 'test' })).toBe(false);
    expect(isRssError({ code: 'not-a-number' })).toBe(false);
  });

  it('should return false for objects with invalid error code', () => {
    expect(
      isRssError({
        code: 999,
        category: RssErrorCategory.NETWORK,
        message: 'test',
        severity: RssErrorSeverity.ERROR
      })
    ).toBe(false);
  });

  it('should return true for manually constructed valid objects', () => {
    const manualError = {
      code: RssErrorCode.NETWORK_TIMEOUT,
      category: RssErrorCategory.NETWORK,
      message: 'Timeout',
      userMessage: 'Please wait',
      severity: RssErrorSeverity.WARNING,
      recoverable: true,
      retryable: true,
      timestamp: new Date()
    };
    expect(isRssError(manualError)).toBe(true);
  });
});

describe('getErrorCategory', () => {
  it('should return NETWORK for network errors', () => {
    expect(getErrorCategory(RssErrorCode.NETWORK_TIMEOUT)).toBe(RssErrorCategory.NETWORK);
    expect(getErrorCategory(RssErrorCode.NETWORK_CORS_BLOCKED)).toBe(RssErrorCategory.NETWORK);
  });

  it('should return PARSING for parsing errors', () => {
    expect(getErrorCategory(RssErrorCode.PARSE_INVALID_XML)).toBe(RssErrorCategory.PARSING);
  });

  it('should return CONFIGURATION for config errors', () => {
    expect(getErrorCategory(RssErrorCode.CONFIG_INVALID_URL)).toBe(RssErrorCategory.CONFIGURATION);
  });

  it('should return RUNTIME for runtime errors', () => {
    expect(getErrorCategory(RssErrorCode.RUNTIME_COMPONENT_CRASH)).toBe(RssErrorCategory.RUNTIME);
  });
});

describe('isRetryable', () => {
  it('should return true for retryable error codes', () => {
    expect(isRetryable(RssErrorCode.NETWORK_TIMEOUT)).toBe(true);
    expect(isRetryable(RssErrorCode.NETWORK_OFFLINE)).toBe(true);
    expect(isRetryable(RssErrorCode.NETWORK_HTTP_ERROR)).toBe(true);
  });

  it('should return false for non-retryable error codes', () => {
    expect(isRetryable(RssErrorCode.NETWORK_CORS_BLOCKED)).toBe(false);
    expect(isRetryable(RssErrorCode.PARSE_UNKNOWN_FORMAT)).toBe(false);
    expect(isRetryable(RssErrorCode.CONFIG_INVALID_URL)).toBe(false);
  });

  it('should work with RssError objects', () => {
    const retryableError = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(isRetryable(retryableError)).toBe(true);

    const nonRetryableError = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);
    expect(isRetryable(nonRetryableError)).toBe(false);
  });
});

describe('isRecoverable', () => {
  it('should return true for recoverable errors', () => {
    expect(isRecoverable(RssErrorCode.CONFIG_MISSING_URL)).toBe(true);
    expect(isRecoverable(RssErrorCode.NETWORK_CORS_BLOCKED)).toBe(true);
    expect(isRecoverable(RssErrorCode.RUNTIME_COMPONENT_CRASH)).toBe(true);
  });

  it('should return false for non-recoverable errors', () => {
    expect(isRecoverable(RssErrorCode.NETWORK_SSL_ERROR)).toBe(false);
    expect(isRecoverable(RssErrorCode.PARSE_UNKNOWN_FORMAT)).toBe(false);
    expect(isRecoverable(RssErrorCode.RUNTIME_MEMORY_EXCEEDED)).toBe(false);
  });

  it('should work with RssError objects', () => {
    const recoverableError = createRssError(RssErrorCode.CONFIG_MISSING_URL);
    expect(isRecoverable(recoverableError)).toBe(true);
  });
});

describe('getRetryDelay', () => {
  it('should return base delay for attempt 0', () => {
    const delay = getRetryDelay(RssErrorCode.NETWORK_TIMEOUT, 0);
    // Base delay is 2000ms, with up to 10% jitter
    expect(delay).toBeGreaterThanOrEqual(2000);
    expect(delay).toBeLessThanOrEqual(2200);
  });

  it('should apply exponential backoff', () => {
    const delay0 = getRetryDelay(RssErrorCode.NETWORK_TIMEOUT, 0);
    const delay1 = getRetryDelay(RssErrorCode.NETWORK_TIMEOUT, 1);
    const delay2 = getRetryDelay(RssErrorCode.NETWORK_TIMEOUT, 2);

    // Each attempt should roughly double (with jitter)
    expect(delay1).toBeGreaterThan(delay0);
    expect(delay2).toBeGreaterThan(delay1);
  });

  it('should cap delay at 30 seconds', () => {
    const delay = getRetryDelay(RssErrorCode.NETWORK_TIMEOUT, 10);
    expect(delay).toBeLessThanOrEqual(30000);
  });

  it('should use default delay for errors without specified delay', () => {
    const delay = getRetryDelay(RssErrorCode.RUNTIME_UNKNOWN, 0);
    expect(delay).toBeGreaterThan(0);
  });

  it('should work with RssError objects', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    const delay = getRetryDelay(error, 0);
    expect(delay).toBeGreaterThan(0);
  });
});

describe('getMaxRetries', () => {
  it('should return correct max retries for retryable errors', () => {
    expect(getMaxRetries(RssErrorCode.NETWORK_TIMEOUT)).toBe(3);
    expect(getMaxRetries(RssErrorCode.NETWORK_OFFLINE)).toBe(10);
  });

  it('should return 0 for non-retryable errors', () => {
    expect(getMaxRetries(RssErrorCode.NETWORK_CORS_BLOCKED)).toBe(0);
    expect(getMaxRetries(RssErrorCode.CONFIG_INVALID_URL)).toBe(0);
  });

  it('should work with RssError objects', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(getMaxRetries(error)).toBe(3);
  });
});

describe('RssErrorSeverity', () => {
  it('should have INFO level', () => {
    expect(RssErrorSeverity.INFO).toBe('info');
  });

  it('should have WARNING level', () => {
    expect(RssErrorSeverity.WARNING).toBe('warning');
  });

  it('should have ERROR level', () => {
    expect(RssErrorSeverity.ERROR).toBe('error');
  });

  it('should have CRITICAL level', () => {
    expect(RssErrorSeverity.CRITICAL).toBe('critical');
  });
});

describe('RssErrorCategory', () => {
  it('should have NETWORK category', () => {
    expect(RssErrorCategory.NETWORK).toBe('NETWORK');
  });

  it('should have PARSING category', () => {
    expect(RssErrorCategory.PARSING).toBe('PARSING');
  });

  it('should have CONFIGURATION category', () => {
    expect(RssErrorCategory.CONFIGURATION).toBe('CONFIGURATION');
  });

  it('should have RUNTIME category', () => {
    expect(RssErrorCategory.RUNTIME).toBe('RUNTIME');
  });
});

describe('Error code uniqueness', () => {
  it('should have unique error codes', () => {
    const codes = Object.values(RssErrorCode).filter(
      v => typeof v === 'number'
    ) as number[];

    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });
});

describe('Default messages', () => {
  it('should provide default messages for all error codes', () => {
    const allCodes = Object.values(RssErrorCode).filter(
      v => typeof v === 'number'
    ) as RssErrorCode[];

    allCodes.forEach(code => {
      const error = createRssError(code);
      expect(error.message).toBeTruthy();
      expect(error.userMessage).toBeTruthy();
    });
  });

  it('should have user-friendly messages that differ from technical messages', () => {
    const error = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);
    // User message should be more helpful/friendly
    expect(error.userMessage).toContain('proxy');
    expect(error.message).not.toBe(error.userMessage);
  });
});

describe('Suggested actions', () => {
  it('should provide suggested actions for CORS errors', () => {
    const error = createRssError(RssErrorCode.NETWORK_CORS_BLOCKED);
    expect(error.suggestedActions).toBeDefined();
    expect(error.suggestedActions!.some(a => a.id === 'configure-proxy')).toBe(true);
  });

  it('should provide retry action for timeout errors', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    expect(error.suggestedActions!.some(a => a.id === 'retry')).toBe(true);
  });

  it('should provide settings action for config errors', () => {
    const error = createRssError(RssErrorCode.CONFIG_MISSING_URL);
    expect(error.suggestedActions!.some(a => a.id === 'open-settings')).toBe(true);
  });

  it('should have primary action marked', () => {
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
    const primaryAction = error.suggestedActions!.find(a => a.primary);
    expect(primaryAction).toBeDefined();
  });
});
