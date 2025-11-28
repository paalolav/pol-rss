/**
 * Error Logger Service
 *
 * Provides error logging for debugging and monitoring.
 * Logs to browser console in development mode and optionally
 * to external services (e.g., Application Insights) in production.
 */

import { RssError, RssErrorCode, RssErrorCategory, RssErrorSeverity } from './errorTypes';

/**
 * Error log entry structure
 */
export interface ErrorLogEntry {
  /** Unique log ID */
  id: string;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Error code */
  code: RssErrorCode;
  /** Error category */
  category: RssErrorCategory;
  /** Error severity */
  severity: RssErrorSeverity;
  /** Error message */
  message: string;
  /** User-friendly message */
  userMessage: string;
  /** Feed URL that caused the error (if applicable) */
  feedUrl?: string;
  /** Stack trace (if available) */
  stack?: string;
  /** Additional context */
  context: ErrorLogContext;
}

/**
 * Context information for error logs
 */
export interface ErrorLogContext {
  /** Web part instance ID */
  webPartId?: string;
  /** Current page URL (sanitized) */
  pageUrl?: string;
  /** Browser user agent */
  userAgent?: string;
  /** Retry attempt number */
  retryAttempt?: number;
  /** Additional custom data */
  custom?: Record<string, unknown>;
}

/**
 * Configuration for ErrorLogger
 */
export interface ErrorLoggerConfig {
  /** Whether to log to console (default: true in dev) */
  logToConsole?: boolean;
  /** Maximum number of logs to keep in memory */
  maxLogs?: number;
  /** Whether to include stack traces */
  includeStack?: boolean;
  /** Custom log handler for external services */
  externalHandler?: (entry: ErrorLogEntry) => void;
  /** Whether to sanitize URLs (remove query params, etc.) */
  sanitizeUrls?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<ErrorLoggerConfig> = {
  logToConsole: process.env.NODE_ENV !== 'production',
  maxLogs: 50,
  includeStack: true,
  externalHandler: () => { /* noop */ },
  sanitizeUrls: true
};

/**
 * Error Logger class
 *
 * Manages error logging with memory storage and optional external reporting.
 */
class ErrorLoggerClass {
  private config: Required<ErrorLoggerConfig>;
  private logs: ErrorLogEntry[] = [];
  private static instance: ErrorLoggerClass | null = null;

  constructor(config: ErrorLoggerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Gets the singleton instance
   */
  public static getInstance(config?: ErrorLoggerConfig): ErrorLoggerClass {
    if (!ErrorLoggerClass.instance) {
      ErrorLoggerClass.instance = new ErrorLoggerClass(config);
    } else if (config) {
      ErrorLoggerClass.instance.configure(config);
    }
    return ErrorLoggerClass.instance;
  }

  /**
   * Updates configuration
   */
  public configure(config: Partial<ErrorLoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Logs an RssError with context
   * @param error - The error to log
   * @param context - Additional context information
   */
  public log(error: RssError, context: Partial<ErrorLogContext> = {}): ErrorLogEntry {
    const entry = this.createLogEntry(error, context);

    // Add to memory storage
    this.logs.push(entry);
    this.trimLogs();

    // Log to console if enabled
    if (this.config.logToConsole) {
      this.logToConsole(entry);
    }

    // Send to external handler
    if (this.config.externalHandler) {
      try {
        this.config.externalHandler(entry);
      } catch (e) {
        // Don't let external handler errors break the app
        console.warn('Error in external log handler:', e);
      }
    }

    return entry;
  }

  /**
   * Logs a warning-level message
   */
  public warn(message: string, context: Partial<ErrorLogContext> = {}): void {
    if (this.config.logToConsole) {
      console.warn(`[RSS Feed Warning] ${message}`, context);
    }
  }

  /**
   * Logs an info-level message
   */
  public info(message: string, context: Partial<ErrorLogContext> = {}): void {
    if (this.config.logToConsole) {
      console.info(`[RSS Feed Info] ${message}`, context);
    }
  }

  /**
   * Gets recent error logs
   * @param count - Number of logs to return (default: all)
   * @returns Array of log entries
   */
  public getRecentLogs(count?: number): ErrorLogEntry[] {
    const logs = [...this.logs].reverse();
    return count ? logs.slice(0, count) : logs;
  }

  /**
   * Gets logs filtered by criteria
   */
  public getFilteredLogs(filter: {
    code?: RssErrorCode;
    category?: RssErrorCategory;
    severity?: RssErrorSeverity;
    feedUrl?: string;
    since?: Date;
  }): ErrorLogEntry[] {
    return this.logs.filter(entry => {
      if (filter.code !== undefined && entry.code !== filter.code) return false;
      if (filter.category !== undefined && entry.category !== filter.category) return false;
      if (filter.severity !== undefined && entry.severity !== filter.severity) return false;
      if (filter.feedUrl !== undefined && entry.feedUrl !== filter.feedUrl) return false;
      if (filter.since !== undefined && entry.timestamp < filter.since) return false;
      return true;
    });
  }

  /**
   * Clears all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Gets error statistics
   */
  public getStats(): {
    total: number;
    byCategory: Record<RssErrorCategory, number>;
    bySeverity: Record<RssErrorSeverity, number>;
    recentCount: number;
  } {
    const byCategory = {} as Record<RssErrorCategory, number>;
    const bySeverity = {} as Record<RssErrorSeverity, number>;
    const recentThreshold = new Date(Date.now() - 3600000); // Last hour

    for (const entry of this.logs) {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
      bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    }

    return {
      total: this.logs.length,
      byCategory,
      bySeverity,
      recentCount: this.logs.filter(e => e.timestamp > recentThreshold).length
    };
  }

  /**
   * Creates a log entry from an error
   */
  private createLogEntry(error: RssError, context: Partial<ErrorLogContext>): ErrorLogEntry {
    return {
      id: this.generateId(),
      timestamp: error.timestamp || new Date(),
      code: error.code,
      category: error.category,
      severity: error.severity,
      message: error.message,
      userMessage: error.userMessage,
      feedUrl: this.sanitizeUrl(error.details?.feedUrl),
      stack: this.config.includeStack ? error.details?.stack : undefined,
      context: {
        webPartId: context.webPartId,
        pageUrl: this.sanitizeUrl(context.pageUrl),
        userAgent: this.sanitizeUserAgent(context.userAgent || navigator?.userAgent),
        retryAttempt: context.retryAttempt ?? error.details?.retryAttempt,
        custom: context.custom
      }
    };
  }

  /**
   * Logs an entry to the browser console
   */
  private logToConsole(entry: ErrorLogEntry): void {
    const prefix = `[RSS Feed ${entry.severity.toUpperCase()}]`;
    const details = {
      code: entry.code,
      category: entry.category,
      feedUrl: entry.feedUrl,
      context: entry.context
    };

    switch (entry.severity) {
      case RssErrorSeverity.CRITICAL:
      case RssErrorSeverity.ERROR:
        console.error(`${prefix} ${entry.message}`, details);
        break;
      case RssErrorSeverity.WARNING:
        console.warn(`${prefix} ${entry.message}`, details);
        break;
      default:
        console.info(`${prefix} ${entry.message}`, details);
    }
  }

  /**
   * Trims logs to max limit
   */
  private trimLogs(): void {
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }
  }

  /**
   * Sanitizes a URL to remove sensitive information
   */
  private sanitizeUrl(url?: string): string | undefined {
    if (!url || !this.config.sanitizeUrls) return url;

    try {
      const parsed = new URL(url);
      // Remove query parameters that might contain sensitive data
      const sensitiveParams = ['key', 'token', 'apikey', 'api_key', 'auth', 'password'];
      sensitiveParams.forEach(param => parsed.searchParams.delete(param));
      return parsed.toString();
    } catch {
      // If URL parsing fails, just return the original
      return url;
    }
  }

  /**
   * Sanitizes user agent string
   */
  private sanitizeUserAgent(ua?: string): string | undefined {
    if (!ua) return undefined;
    // Keep only essential browser info, truncate to reasonable length
    return ua.substring(0, 200);
  }

  /**
   * Generates a unique log ID
   */
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Singleton error logger instance
 */
export const ErrorLogger = ErrorLoggerClass.getInstance();

/**
 * Creates a scoped logger for a specific component
 */
export function createScopedLogger(
  scope: string,
  context: Partial<ErrorLogContext> = {}
): {
  log: (error: RssError, additionalContext?: Partial<ErrorLogContext>) => ErrorLogEntry;
  warn: (message: string) => void;
  info: (message: string) => void;
} {
  return {
    log: (error, additionalContext = {}) =>
      ErrorLogger.log(error, { ...context, ...additionalContext, custom: { ...context.custom, scope } }),
    warn: (message) => ErrorLogger.warn(`[${scope}] ${message}`, context),
    info: (message) => ErrorLogger.info(`[${scope}] ${message}`, context)
  };
}

export default ErrorLogger;
