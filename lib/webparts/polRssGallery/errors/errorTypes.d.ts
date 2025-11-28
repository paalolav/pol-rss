/**
 * RSS Feed Error Types
 *
 * Comprehensive error type system for the RSS Feed WebPart.
 * Provides structured error handling with error codes, user-friendly messages,
 * and metadata for retry logic and recovery.
 */
/**
 * Error categories for classification
 */
export declare enum RssErrorCategory {
    /** Network-related errors (CORS, timeout, DNS) */
    NETWORK = "NETWORK",
    /** Feed parsing errors (invalid XML, unknown format) */
    PARSING = "PARSING",
    /** Configuration errors (invalid URL, missing settings) */
    CONFIGURATION = "CONFIGURATION",
    /** Runtime errors (component crash, memory) */
    RUNTIME = "RUNTIME"
}
/**
 * Specific error codes with unique identifiers
 */
export declare enum RssErrorCode {
    /** CORS policy blocked the request */
    NETWORK_CORS_BLOCKED = 101,
    /** Request timed out */
    NETWORK_TIMEOUT = 102,
    /** DNS resolution failed */
    NETWORK_DNS_FAILED = 103,
    /** Browser is offline */
    NETWORK_OFFLINE = 104,
    /** Proxy service failed */
    NETWORK_PROXY_FAILED = 105,
    /** HTTP error response (4xx/5xx) */
    NETWORK_HTTP_ERROR = 106,
    /** Connection refused */
    NETWORK_CONNECTION_REFUSED = 107,
    /** SSL/TLS certificate error */
    NETWORK_SSL_ERROR = 108,
    /** Unknown network error */
    NETWORK_UNKNOWN = 109,
    /** XML is malformed */
    PARSE_INVALID_XML = 201,
    /** Feed format not recognized */
    PARSE_UNKNOWN_FORMAT = 202,
    /** Feed is empty (no content) */
    PARSE_EMPTY_FEED = 203,
    /** Feed has no items */
    PARSE_MISSING_ITEMS = 204,
    /** Invalid character encoding */
    PARSE_ENCODING_ERROR = 205,
    /** Content security policy violation */
    PARSE_CSP_VIOLATION = 206,
    /** Feed validation failed */
    PARSE_VALIDATION_FAILED = 207,
    /** Recovery failed after all attempts */
    PARSE_RECOVERY_FAILED = 208,
    /** Feed URL is invalid */
    CONFIG_INVALID_URL = 301,
    /** Feed URL is missing */
    CONFIG_MISSING_URL = 302,
    /** Proxy URL is missing but required */
    CONFIG_PROXY_MISSING = 303,
    /** Invalid property pane configuration */
    CONFIG_INVALID_SETTINGS = 304,
    /** URL is blocked for security reasons */
    CONFIG_URL_BLOCKED = 305,
    /** React component crashed */
    RUNTIME_COMPONENT_CRASH = 401,
    /** Memory exceeded (too many items) */
    RUNTIME_MEMORY_EXCEEDED = 402,
    /** Render timeout */
    RUNTIME_RENDER_TIMEOUT = 403,
    /** Unknown runtime error */
    RUNTIME_UNKNOWN = 404
}
/**
 * Severity levels for errors
 */
export declare enum RssErrorSeverity {
    /** Informational - not a real error */
    INFO = "info",
    /** Warning - degraded functionality */
    WARNING = "warning",
    /** Error - feature not working */
    ERROR = "error",
    /** Critical - entire component broken */
    CRITICAL = "critical"
}
/**
 * Structured error interface
 */
export interface RssError {
    /** Unique error code */
    code: RssErrorCode;
    /** Error category */
    category: RssErrorCategory;
    /** Technical error message (for logging) */
    message: string;
    /** User-friendly error message (for display) */
    userMessage: string;
    /** Error severity level */
    severity: RssErrorSeverity;
    /** Whether the error can be recovered from */
    recoverable: boolean;
    /** Whether a retry might succeed */
    retryable: boolean;
    /** Suggested retry delay in ms (if retryable) */
    retryDelayMs?: number;
    /** Maximum retry attempts recommended */
    maxRetries?: number;
    /** Suggested user actions */
    suggestedActions?: RssErrorAction[];
    /** Additional error details */
    details?: RssErrorDetails;
    /** Original error that caused this */
    cause?: Error;
    /** Timestamp when error occurred */
    timestamp: Date;
}
/**
 * Suggested actions for error recovery
 */
export interface RssErrorAction {
    /** Action identifier */
    id: string;
    /** Display label for the action */
    label: string;
    /** Icon name (Fluent UI icon) */
    icon?: string;
    /** Whether this is the primary action */
    primary?: boolean;
}
/**
 * Additional error details
 */
export interface RssErrorDetails {
    /** HTTP status code if applicable */
    httpStatus?: number;
    /** HTTP status text */
    httpStatusText?: string;
    /** Feed URL that caused the error */
    feedUrl?: string;
    /** Proxy URL used (if any) */
    proxyUrl?: string;
    /** Request duration in ms */
    requestDurationMs?: number;
    /** Retry attempt number */
    retryAttempt?: number;
    /** Stack trace */
    stack?: string;
    /** Any additional context */
    context?: Record<string, unknown>;
}
/**
 * Error metadata mapping for each error code
 */
export interface RssErrorMetadata {
    code: RssErrorCode;
    category: RssErrorCategory;
    severity: RssErrorSeverity;
    recoverable: boolean;
    retryable: boolean;
    defaultRetryDelayMs?: number;
    defaultMaxRetries?: number;
}
/**
 * Error metadata registry
 */
export declare const ERROR_METADATA: Record<RssErrorCode, RssErrorMetadata>;
/**
 * Creates a structured RssError from an error code and optional details
 * @param code - The error code
 * @param options - Additional error options
 * @returns Structured RssError object
 */
export declare function createRssError(code: RssErrorCode, options?: {
    message?: string;
    userMessage?: string;
    details?: RssErrorDetails;
    cause?: Error;
    suggestedActions?: RssErrorAction[];
}): RssError;
/**
 * Creates an RssError from a native Error object
 * @param error - The native Error
 * @param feedUrl - The feed URL that caused the error
 * @returns Structured RssError object
 */
export declare function createRssErrorFromError(error: Error, feedUrl?: string): RssError;
/**
 * Classifies a native Error into an RssErrorCode
 * @param error - The error to classify
 * @returns The classified error code
 */
export declare function classifyError(error: Error): RssErrorCode;
/**
 * Type guard to check if an error is an RssError
 * @param error - The error to check
 * @returns True if the error is an RssError
 */
export declare function isRssError(error: unknown): error is RssError;
/**
 * Gets the error category from an error code
 * @param code - The error code
 * @returns The error category
 */
export declare function getErrorCategory(code: RssErrorCode): RssErrorCategory;
/**
 * Checks if an error is retryable
 * @param error - The error to check
 * @returns True if the error can be retried
 */
export declare function isRetryable(error: RssError | RssErrorCode): boolean;
/**
 * Checks if an error is recoverable
 * @param error - The error to check
 * @returns True if the error can be recovered from
 */
export declare function isRecoverable(error: RssError | RssErrorCode): boolean;
/**
 * Gets the recommended retry delay for an error
 * @param error - The error
 * @param attempt - Current retry attempt (for exponential backoff)
 * @returns Delay in milliseconds
 */
export declare function getRetryDelay(error: RssError | RssErrorCode, attempt?: number): number;
/**
 * Gets the maximum retry count for an error
 * @param error - The error
 * @returns Maximum retry count
 */
export declare function getMaxRetries(error: RssError | RssErrorCode): number;
//# sourceMappingURL=errorTypes.d.ts.map