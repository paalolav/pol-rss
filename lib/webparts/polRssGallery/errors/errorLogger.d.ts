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
 * Error Logger class
 *
 * Manages error logging with memory storage and optional external reporting.
 */
declare class ErrorLoggerClass {
    private config;
    private logs;
    private static instance;
    constructor(config?: ErrorLoggerConfig);
    /**
     * Gets the singleton instance
     */
    static getInstance(config?: ErrorLoggerConfig): ErrorLoggerClass;
    /**
     * Updates configuration
     */
    configure(config: Partial<ErrorLoggerConfig>): void;
    /**
     * Logs an RssError with context
     * @param error - The error to log
     * @param context - Additional context information
     */
    log(error: RssError, context?: Partial<ErrorLogContext>): ErrorLogEntry;
    /**
     * Logs a warning-level message
     */
    warn(message: string, context?: Partial<ErrorLogContext>): void;
    /**
     * Logs an info-level message
     */
    info(message: string, context?: Partial<ErrorLogContext>): void;
    /**
     * Gets recent error logs
     * @param count - Number of logs to return (default: all)
     * @returns Array of log entries
     */
    getRecentLogs(count?: number): ErrorLogEntry[];
    /**
     * Gets logs filtered by criteria
     */
    getFilteredLogs(filter: {
        code?: RssErrorCode;
        category?: RssErrorCategory;
        severity?: RssErrorSeverity;
        feedUrl?: string;
        since?: Date;
    }): ErrorLogEntry[];
    /**
     * Clears all logs
     */
    clearLogs(): void;
    /**
     * Gets error statistics
     */
    getStats(): {
        total: number;
        byCategory: Record<RssErrorCategory, number>;
        bySeverity: Record<RssErrorSeverity, number>;
        recentCount: number;
    };
    /**
     * Creates a log entry from an error
     */
    private createLogEntry;
    /**
     * Logs an entry to the browser console
     */
    private logToConsole;
    /**
     * Trims logs to max limit
     */
    private trimLogs;
    /**
     * Sanitizes a URL to remove sensitive information
     */
    private sanitizeUrl;
    /**
     * Sanitizes user agent string
     */
    private sanitizeUserAgent;
    /**
     * Generates a unique log ID
     */
    private generateId;
}
/**
 * Singleton error logger instance
 */
export declare const ErrorLogger: ErrorLoggerClass;
/**
 * Creates a scoped logger for a specific component
 */
export declare function createScopedLogger(scope: string, context?: Partial<ErrorLogContext>): {
    log: (error: RssError, additionalContext?: Partial<ErrorLogContext>) => ErrorLogEntry;
    warn: (message: string) => void;
    info: (message: string) => void;
};
export default ErrorLogger;
//# sourceMappingURL=errorLogger.d.ts.map