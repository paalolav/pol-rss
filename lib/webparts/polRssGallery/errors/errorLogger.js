/**
 * Error Logger Service
 *
 * Provides error logging for debugging and monitoring.
 * Logs to browser console in development mode and optionally
 * to external services (e.g., Application Insights) in production.
 */
import { RssErrorSeverity } from './errorTypes';
/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
    logToConsole: process.env.NODE_ENV !== 'production',
    maxLogs: 50,
    includeStack: true,
    externalHandler: () => { },
    sanitizeUrls: true
};
/**
 * Error Logger class
 *
 * Manages error logging with memory storage and optional external reporting.
 */
class ErrorLoggerClass {
    constructor(config = {}) {
        this.logs = [];
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Gets the singleton instance
     */
    static getInstance(config) {
        if (!ErrorLoggerClass.instance) {
            ErrorLoggerClass.instance = new ErrorLoggerClass(config);
        }
        else if (config) {
            ErrorLoggerClass.instance.configure(config);
        }
        return ErrorLoggerClass.instance;
    }
    /**
     * Updates configuration
     */
    configure(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Logs an RssError with context
     * @param error - The error to log
     * @param context - Additional context information
     */
    log(error, context = {}) {
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
            }
            catch (e) {
                // Don't let external handler errors break the app
                console.warn('Error in external log handler:', e);
            }
        }
        return entry;
    }
    /**
     * Logs a warning-level message
     */
    warn(message, context = {}) {
        if (this.config.logToConsole) {
            console.warn(`[RSS Feed Warning] ${message}`, context);
        }
    }
    /**
     * Logs an info-level message
     */
    info(message, context = {}) {
        if (this.config.logToConsole) {
            console.info(`[RSS Feed Info] ${message}`, context);
        }
    }
    /**
     * Gets recent error logs
     * @param count - Number of logs to return (default: all)
     * @returns Array of log entries
     */
    getRecentLogs(count) {
        const logs = [...this.logs].reverse();
        return count ? logs.slice(0, count) : logs;
    }
    /**
     * Gets logs filtered by criteria
     */
    getFilteredLogs(filter) {
        return this.logs.filter(entry => {
            if (filter.code !== undefined && entry.code !== filter.code)
                return false;
            if (filter.category !== undefined && entry.category !== filter.category)
                return false;
            if (filter.severity !== undefined && entry.severity !== filter.severity)
                return false;
            if (filter.feedUrl !== undefined && entry.feedUrl !== filter.feedUrl)
                return false;
            if (filter.since !== undefined && entry.timestamp < filter.since)
                return false;
            return true;
        });
    }
    /**
     * Clears all logs
     */
    clearLogs() {
        this.logs = [];
    }
    /**
     * Gets error statistics
     */
    getStats() {
        const byCategory = {};
        const bySeverity = {};
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
    createLogEntry(error, context) {
        var _a, _b, _c, _d;
        return {
            id: this.generateId(),
            timestamp: error.timestamp || new Date(),
            code: error.code,
            category: error.category,
            severity: error.severity,
            message: error.message,
            userMessage: error.userMessage,
            feedUrl: this.sanitizeUrl((_a = error.details) === null || _a === void 0 ? void 0 : _a.feedUrl),
            stack: this.config.includeStack ? (_b = error.details) === null || _b === void 0 ? void 0 : _b.stack : undefined,
            context: {
                webPartId: context.webPartId,
                pageUrl: this.sanitizeUrl(context.pageUrl),
                userAgent: this.sanitizeUserAgent(context.userAgent || (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent)),
                retryAttempt: (_c = context.retryAttempt) !== null && _c !== void 0 ? _c : (_d = error.details) === null || _d === void 0 ? void 0 : _d.retryAttempt,
                custom: context.custom
            }
        };
    }
    /**
     * Logs an entry to the browser console
     */
    logToConsole(entry) {
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
    trimLogs() {
        if (this.logs.length > this.config.maxLogs) {
            this.logs = this.logs.slice(-this.config.maxLogs);
        }
    }
    /**
     * Sanitizes a URL to remove sensitive information
     */
    sanitizeUrl(url) {
        if (!url || !this.config.sanitizeUrls)
            return url;
        try {
            const parsed = new URL(url);
            // Remove query parameters that might contain sensitive data
            const sensitiveParams = ['key', 'token', 'apikey', 'api_key', 'auth', 'password'];
            sensitiveParams.forEach(param => parsed.searchParams.delete(param));
            return parsed.toString();
        }
        catch (_a) {
            // If URL parsing fails, just return the original
            return url;
        }
    }
    /**
     * Sanitizes user agent string
     */
    sanitizeUserAgent(ua) {
        if (!ua)
            return undefined;
        // Keep only essential browser info, truncate to reasonable length
        return ua.substring(0, 200);
    }
    /**
     * Generates a unique log ID
     */
    generateId() {
        return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}
ErrorLoggerClass.instance = null;
/**
 * Singleton error logger instance
 */
export const ErrorLogger = ErrorLoggerClass.getInstance();
/**
 * Creates a scoped logger for a specific component
 */
export function createScopedLogger(scope, context = {}) {
    return {
        log: (error, additionalContext = {}) => ErrorLogger.log(error, { ...context, ...additionalContext, custom: { ...context.custom, scope } }),
        warn: (message) => ErrorLogger.warn(`[${scope}] ${message}`, context),
        info: (message) => ErrorLogger.info(`[${scope}] ${message}`, context)
    };
}
export default ErrorLogger;
//# sourceMappingURL=errorLogger.js.map