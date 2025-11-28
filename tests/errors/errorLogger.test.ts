/**
 * Tests for ErrorLogger
 *
 * Tests the error logging service including log storage,
 * filtering, and external handler integration.
 */

import {
  ErrorLogger,
  createScopedLogger,
  ErrorLogEntry
} from '../../src/webparts/polRssGallery/errors/errorLogger';
import {
  RssErrorCode,
  RssErrorCategory,
  RssErrorSeverity,
  createRssError
} from '../../src/webparts/polRssGallery/errors/errorTypes';

describe('ErrorLogger', () => {
  beforeEach(() => {
    // Clear logs before each test
    ErrorLogger.clearLogs();
    // Reset console mocks
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('log', () => {
    it('should log an error and return entry', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const entry = ErrorLogger.log(error);

      expect(entry).toBeDefined();
      expect(entry.code).toBe(RssErrorCode.NETWORK_TIMEOUT);
      expect(entry.category).toBe(RssErrorCategory.NETWORK);
      expect(entry.severity).toBe(RssErrorSeverity.WARNING);
    });

    it('should include timestamp', () => {
      const before = new Date();
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const entry = ErrorLogger.log(error);
      const after = new Date();

      expect(entry.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entry.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should include error message', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT, {
        message: 'Custom message'
      });
      const entry = ErrorLogger.log(error);

      expect(entry.message).toBe('Custom message');
    });

    it('should include context information', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const entry = ErrorLogger.log(error, {
        webPartId: 'wp-123',
        pageUrl: 'https://example.com/page',
        retryAttempt: 2
      });

      expect(entry.context.webPartId).toBe('wp-123');
      expect(entry.context.retryAttempt).toBe(2);
    });

    it('should sanitize URLs', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const entry = ErrorLogger.log(error, {
        pageUrl: 'https://example.com/page?token=secret&key=apikey123'
      });

      // Should remove sensitive params
      expect(entry.context.pageUrl).not.toContain('secret');
      expect(entry.context.pageUrl).not.toContain('apikey123');
    });

    it('should generate unique IDs', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const entry1 = ErrorLogger.log(error);
      const entry2 = ErrorLogger.log(error);

      expect(entry1.id).not.toBe(entry2.id);
    });

    it('should log to console for non-production', () => {
      ErrorLogger.configure({ logToConsole: true });
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      ErrorLogger.log(error);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should call external handler if provided', () => {
      const externalHandler = jest.fn();
      ErrorLogger.configure({ externalHandler });

      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      ErrorLogger.log(error);

      expect(externalHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          code: RssErrorCode.NETWORK_TIMEOUT
        })
      );
    });

    it('should not throw if external handler fails', () => {
      const externalHandler = jest.fn().mockImplementation(() => {
        throw new Error('Handler failed');
      });
      ErrorLogger.configure({ externalHandler });

      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

      expect(() => ErrorLogger.log(error)).not.toThrow();
    });
  });

  describe('warn', () => {
    it('should log warning to console', () => {
      ErrorLogger.configure({ logToConsole: true });
      ErrorLogger.warn('Test warning');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Test warning'),
        expect.any(Object)
      );
    });
  });

  describe('info', () => {
    it('should log info to console', () => {
      ErrorLogger.configure({ logToConsole: true });
      ErrorLogger.info('Test info');

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Test info'),
        expect.any(Object)
      );
    });
  });

  describe('getRecentLogs', () => {
    it('should return empty array initially', () => {
      const logs = ErrorLogger.getRecentLogs();
      expect(logs).toEqual([]);
    });

    it('should return all logs', () => {
      const error1 = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const error2 = createRssError(RssErrorCode.PARSE_INVALID_XML);

      ErrorLogger.log(error1);
      ErrorLogger.log(error2);

      const logs = ErrorLogger.getRecentLogs();
      expect(logs).toHaveLength(2);
    });

    it('should return logs in reverse chronological order', () => {
      const error1 = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      const error2 = createRssError(RssErrorCode.PARSE_INVALID_XML);

      ErrorLogger.log(error1);
      ErrorLogger.log(error2);

      const logs = ErrorLogger.getRecentLogs();
      expect(logs[0].code).toBe(RssErrorCode.PARSE_INVALID_XML);
      expect(logs[1].code).toBe(RssErrorCode.NETWORK_TIMEOUT);
    });

    it('should respect count parameter', () => {
      for (let i = 0; i < 10; i++) {
        ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT));
      }

      const logs = ErrorLogger.getRecentLogs(5);
      expect(logs).toHaveLength(5);
    });
  });

  describe('getFilteredLogs', () => {
    beforeEach(() => {
      // Add various errors
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT), { custom: { feedUrl: 'feed1' } });
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_CORS_BLOCKED), { custom: { feedUrl: 'feed2' } });
      ErrorLogger.log(createRssError(RssErrorCode.PARSE_INVALID_XML), { custom: { feedUrl: 'feed1' } });
    });

    it('should filter by code', () => {
      const logs = ErrorLogger.getFilteredLogs({
        code: RssErrorCode.NETWORK_TIMEOUT
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].code).toBe(RssErrorCode.NETWORK_TIMEOUT);
    });

    it('should filter by category', () => {
      const logs = ErrorLogger.getFilteredLogs({
        category: RssErrorCategory.NETWORK
      });

      expect(logs).toHaveLength(2);
    });

    it('should filter by severity', () => {
      const logs = ErrorLogger.getFilteredLogs({
        severity: RssErrorSeverity.WARNING
      });

      expect(logs.every(l => l.severity === RssErrorSeverity.WARNING)).toBe(true);
    });

    it('should filter by multiple criteria', () => {
      const logs = ErrorLogger.getFilteredLogs({
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.WARNING
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].code).toBe(RssErrorCode.NETWORK_TIMEOUT);
    });

    it('should filter by time', () => {
      const recentLogs = ErrorLogger.getFilteredLogs({
        since: new Date(Date.now() - 1000)
      });

      expect(recentLogs).toHaveLength(3);
    });
  });

  describe('clearLogs', () => {
    it('should clear all logs', () => {
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT));
      ErrorLogger.log(createRssError(RssErrorCode.PARSE_INVALID_XML));

      ErrorLogger.clearLogs();

      expect(ErrorLogger.getRecentLogs()).toHaveLength(0);
    });
  });

  describe('getStats', () => {
    it('should return empty stats initially', () => {
      const stats = ErrorLogger.getStats();

      expect(stats.total).toBe(0);
      expect(stats.recentCount).toBe(0);
    });

    it('should count logs by category', () => {
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT));
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_CORS_BLOCKED));
      ErrorLogger.log(createRssError(RssErrorCode.PARSE_INVALID_XML));

      const stats = ErrorLogger.getStats();

      expect(stats.byCategory[RssErrorCategory.NETWORK]).toBe(2);
      expect(stats.byCategory[RssErrorCategory.PARSING]).toBe(1);
    });

    it('should count logs by severity', () => {
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT)); // WARNING
      ErrorLogger.log(createRssError(RssErrorCode.PARSE_INVALID_XML)); // ERROR
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_SSL_ERROR)); // CRITICAL

      const stats = ErrorLogger.getStats();

      expect(stats.bySeverity[RssErrorSeverity.WARNING]).toBe(1);
      expect(stats.bySeverity[RssErrorSeverity.ERROR]).toBe(1);
      expect(stats.bySeverity[RssErrorSeverity.CRITICAL]).toBe(1);
    });

    it('should count recent logs', () => {
      ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT));
      ErrorLogger.log(createRssError(RssErrorCode.PARSE_INVALID_XML));

      const stats = ErrorLogger.getStats();

      expect(stats.total).toBe(2);
      expect(stats.recentCount).toBe(2); // Both should be recent
    });
  });

  describe('configure', () => {
    it('should update configuration', () => {
      ErrorLogger.configure({ logToConsole: false, externalHandler: undefined });

      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);
      ErrorLogger.log(error);

      // Should not log to console when disabled
      // Note: console.warn might be called from elsewhere, so we check that
      // our specific error was not logged
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('TIMEOUT'),
        expect.any(Object)
      );
    });

    it('should respect maxLogs limit', () => {
      ErrorLogger.configure({ maxLogs: 5 });

      for (let i = 0; i < 10; i++) {
        ErrorLogger.log(createRssError(RssErrorCode.NETWORK_TIMEOUT));
      }

      expect(ErrorLogger.getRecentLogs()).toHaveLength(5);
    });
  });

  describe('Log entry structure', () => {
    it('should have all required fields', () => {
      const error = createRssError(RssErrorCode.NETWORK_TIMEOUT, {
        message: 'Test message',
        userMessage: 'User message',
        details: {
          feedUrl: 'https://example.com/feed.xml',
          stack: 'Error stack trace'
        }
      });

      const entry = ErrorLogger.log(error, {
        webPartId: 'wp-123',
        pageUrl: 'https://example.com'
      });

      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeInstanceOf(Date);
      expect(entry.code).toBe(RssErrorCode.NETWORK_TIMEOUT);
      expect(entry.category).toBe(RssErrorCategory.NETWORK);
      expect(entry.severity).toBe(RssErrorSeverity.WARNING);
      expect(entry.message).toBe('Test message');
      expect(entry.userMessage).toBe('User message');
      expect(entry.feedUrl).toContain('example.com');
      expect(entry.context.webPartId).toBe('wp-123');
    });
  });
});

describe('createScopedLogger', () => {
  beforeEach(() => {
    ErrorLogger.clearLogs();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a scoped logger', () => {
    const logger = createScopedLogger('TestComponent');

    expect(logger).toHaveProperty('log');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('info');
  });

  it('should include scope in logged errors', () => {
    const logger = createScopedLogger('TestComponent');
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

    const entry = logger.log(error);

    expect(entry.context.custom?.scope).toBe('TestComponent');
  });

  it('should include base context in all logs', () => {
    const logger = createScopedLogger('TestComponent', {
      webPartId: 'wp-123'
    });
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

    const entry = logger.log(error);

    expect(entry.context.webPartId).toBe('wp-123');
  });

  it('should allow additional context in individual logs', () => {
    const logger = createScopedLogger('TestComponent', {
      webPartId: 'wp-123'
    });
    const error = createRssError(RssErrorCode.NETWORK_TIMEOUT);

    const entry = logger.log(error, { retryAttempt: 3 });

    expect(entry.context.webPartId).toBe('wp-123');
    expect(entry.context.retryAttempt).toBe(3);
  });

  it('should prefix warn messages with scope', () => {
    ErrorLogger.configure({ logToConsole: true });
    const logger = createScopedLogger('TestComponent');

    logger.warn('Test warning');

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[TestComponent]'),
      expect.any(Object)
    );
  });

  it('should prefix info messages with scope', () => {
    ErrorLogger.configure({ logToConsole: true });
    const logger = createScopedLogger('TestComponent');

    logger.info('Test info');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[TestComponent]'),
      expect.any(Object)
    );
  });
});
