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
export var RssErrorCategory;
(function (RssErrorCategory) {
    /** Network-related errors (CORS, timeout, DNS) */
    RssErrorCategory["NETWORK"] = "NETWORK";
    /** Feed parsing errors (invalid XML, unknown format) */
    RssErrorCategory["PARSING"] = "PARSING";
    /** Configuration errors (invalid URL, missing settings) */
    RssErrorCategory["CONFIGURATION"] = "CONFIGURATION";
    /** Runtime errors (component crash, memory) */
    RssErrorCategory["RUNTIME"] = "RUNTIME";
})(RssErrorCategory || (RssErrorCategory = {}));
/**
 * Specific error codes with unique identifiers
 */
export var RssErrorCode;
(function (RssErrorCode) {
    // Network errors (1xx)
    /** CORS policy blocked the request */
    RssErrorCode[RssErrorCode["NETWORK_CORS_BLOCKED"] = 101] = "NETWORK_CORS_BLOCKED";
    /** Request timed out */
    RssErrorCode[RssErrorCode["NETWORK_TIMEOUT"] = 102] = "NETWORK_TIMEOUT";
    /** DNS resolution failed */
    RssErrorCode[RssErrorCode["NETWORK_DNS_FAILED"] = 103] = "NETWORK_DNS_FAILED";
    /** Browser is offline */
    RssErrorCode[RssErrorCode["NETWORK_OFFLINE"] = 104] = "NETWORK_OFFLINE";
    /** Proxy service failed */
    RssErrorCode[RssErrorCode["NETWORK_PROXY_FAILED"] = 105] = "NETWORK_PROXY_FAILED";
    /** HTTP error response (4xx/5xx) */
    RssErrorCode[RssErrorCode["NETWORK_HTTP_ERROR"] = 106] = "NETWORK_HTTP_ERROR";
    /** Connection refused */
    RssErrorCode[RssErrorCode["NETWORK_CONNECTION_REFUSED"] = 107] = "NETWORK_CONNECTION_REFUSED";
    /** SSL/TLS certificate error */
    RssErrorCode[RssErrorCode["NETWORK_SSL_ERROR"] = 108] = "NETWORK_SSL_ERROR";
    /** Unknown network error */
    RssErrorCode[RssErrorCode["NETWORK_UNKNOWN"] = 109] = "NETWORK_UNKNOWN";
    // Parsing errors (2xx)
    /** XML is malformed */
    RssErrorCode[RssErrorCode["PARSE_INVALID_XML"] = 201] = "PARSE_INVALID_XML";
    /** Feed format not recognized */
    RssErrorCode[RssErrorCode["PARSE_UNKNOWN_FORMAT"] = 202] = "PARSE_UNKNOWN_FORMAT";
    /** Feed is empty (no content) */
    RssErrorCode[RssErrorCode["PARSE_EMPTY_FEED"] = 203] = "PARSE_EMPTY_FEED";
    /** Feed has no items */
    RssErrorCode[RssErrorCode["PARSE_MISSING_ITEMS"] = 204] = "PARSE_MISSING_ITEMS";
    /** Invalid character encoding */
    RssErrorCode[RssErrorCode["PARSE_ENCODING_ERROR"] = 205] = "PARSE_ENCODING_ERROR";
    /** Content security policy violation */
    RssErrorCode[RssErrorCode["PARSE_CSP_VIOLATION"] = 206] = "PARSE_CSP_VIOLATION";
    /** Feed validation failed */
    RssErrorCode[RssErrorCode["PARSE_VALIDATION_FAILED"] = 207] = "PARSE_VALIDATION_FAILED";
    /** Recovery failed after all attempts */
    RssErrorCode[RssErrorCode["PARSE_RECOVERY_FAILED"] = 208] = "PARSE_RECOVERY_FAILED";
    // Configuration errors (3xx)
    /** Feed URL is invalid */
    RssErrorCode[RssErrorCode["CONFIG_INVALID_URL"] = 301] = "CONFIG_INVALID_URL";
    /** Feed URL is missing */
    RssErrorCode[RssErrorCode["CONFIG_MISSING_URL"] = 302] = "CONFIG_MISSING_URL";
    /** Proxy URL is missing but required */
    RssErrorCode[RssErrorCode["CONFIG_PROXY_MISSING"] = 303] = "CONFIG_PROXY_MISSING";
    /** Invalid property pane configuration */
    RssErrorCode[RssErrorCode["CONFIG_INVALID_SETTINGS"] = 304] = "CONFIG_INVALID_SETTINGS";
    /** URL is blocked for security reasons */
    RssErrorCode[RssErrorCode["CONFIG_URL_BLOCKED"] = 305] = "CONFIG_URL_BLOCKED";
    // Runtime errors (4xx)
    /** React component crashed */
    RssErrorCode[RssErrorCode["RUNTIME_COMPONENT_CRASH"] = 401] = "RUNTIME_COMPONENT_CRASH";
    /** Memory exceeded (too many items) */
    RssErrorCode[RssErrorCode["RUNTIME_MEMORY_EXCEEDED"] = 402] = "RUNTIME_MEMORY_EXCEEDED";
    /** Render timeout */
    RssErrorCode[RssErrorCode["RUNTIME_RENDER_TIMEOUT"] = 403] = "RUNTIME_RENDER_TIMEOUT";
    /** Unknown runtime error */
    RssErrorCode[RssErrorCode["RUNTIME_UNKNOWN"] = 404] = "RUNTIME_UNKNOWN";
})(RssErrorCode || (RssErrorCode = {}));
/**
 * Severity levels for errors
 */
export var RssErrorSeverity;
(function (RssErrorSeverity) {
    /** Informational - not a real error */
    RssErrorSeverity["INFO"] = "info";
    /** Warning - degraded functionality */
    RssErrorSeverity["WARNING"] = "warning";
    /** Error - feature not working */
    RssErrorSeverity["ERROR"] = "error";
    /** Critical - entire component broken */
    RssErrorSeverity["CRITICAL"] = "critical";
})(RssErrorSeverity || (RssErrorSeverity = {}));
/**
 * Error metadata registry
 */
export const ERROR_METADATA = {
    // Network errors
    [RssErrorCode.NETWORK_CORS_BLOCKED]: {
        code: RssErrorCode.NETWORK_CORS_BLOCKED,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: false, // CORS won't magically resolve
        defaultMaxRetries: 0
    },
    [RssErrorCode.NETWORK_TIMEOUT]: {
        code: RssErrorCode.NETWORK_TIMEOUT,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 2000,
        defaultMaxRetries: 3
    },
    [RssErrorCode.NETWORK_DNS_FAILED]: {
        code: RssErrorCode.NETWORK_DNS_FAILED,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.NETWORK_OFFLINE]: {
        code: RssErrorCode.NETWORK_OFFLINE,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: true, // Will retry when back online
        defaultRetryDelayMs: 5000,
        defaultMaxRetries: 10
    },
    [RssErrorCode.NETWORK_PROXY_FAILED]: {
        code: RssErrorCode.NETWORK_PROXY_FAILED,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 3000,
        defaultMaxRetries: 2
    },
    [RssErrorCode.NETWORK_HTTP_ERROR]: {
        code: RssErrorCode.NETWORK_HTTP_ERROR,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: true, // Some HTTP errors are transient
        defaultRetryDelayMs: 2000,
        defaultMaxRetries: 2
    },
    [RssErrorCode.NETWORK_CONNECTION_REFUSED]: {
        code: RssErrorCode.NETWORK_CONNECTION_REFUSED,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: false,
        retryable: true,
        defaultRetryDelayMs: 5000,
        defaultMaxRetries: 2
    },
    [RssErrorCode.NETWORK_SSL_ERROR]: {
        code: RssErrorCode.NETWORK_SSL_ERROR,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.CRITICAL,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.NETWORK_UNKNOWN]: {
        code: RssErrorCode.NETWORK_UNKNOWN,
        category: RssErrorCategory.NETWORK,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 3000,
        defaultMaxRetries: 3
    },
    // Parsing errors
    [RssErrorCode.PARSE_INVALID_XML]: {
        code: RssErrorCode.PARSE_INVALID_XML,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.ERROR,
        recoverable: true, // Can try recovery mode
        retryable: false, // Same content won't parse differently
        defaultMaxRetries: 0
    },
    [RssErrorCode.PARSE_UNKNOWN_FORMAT]: {
        code: RssErrorCode.PARSE_UNKNOWN_FORMAT,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.ERROR,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.PARSE_EMPTY_FEED]: {
        code: RssErrorCode.PARSE_EMPTY_FEED,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: true, // Feed might have content later
        defaultRetryDelayMs: 60000,
        defaultMaxRetries: 1
    },
    [RssErrorCode.PARSE_MISSING_ITEMS]: {
        code: RssErrorCode.PARSE_MISSING_ITEMS,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 60000,
        defaultMaxRetries: 1
    },
    [RssErrorCode.PARSE_ENCODING_ERROR]: {
        code: RssErrorCode.PARSE_ENCODING_ERROR,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.PARSE_CSP_VIOLATION]: {
        code: RssErrorCode.PARSE_CSP_VIOLATION,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.CRITICAL,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.PARSE_VALIDATION_FAILED]: {
        code: RssErrorCode.PARSE_VALIDATION_FAILED,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.PARSE_RECOVERY_FAILED]: {
        code: RssErrorCode.PARSE_RECOVERY_FAILED,
        category: RssErrorCategory.PARSING,
        severity: RssErrorSeverity.ERROR,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    // Configuration errors
    [RssErrorCode.CONFIG_INVALID_URL]: {
        code: RssErrorCode.CONFIG_INVALID_URL,
        category: RssErrorCategory.CONFIGURATION,
        severity: RssErrorSeverity.ERROR,
        recoverable: true, // User can fix the URL
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.CONFIG_MISSING_URL]: {
        code: RssErrorCode.CONFIG_MISSING_URL,
        category: RssErrorCategory.CONFIGURATION,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.CONFIG_PROXY_MISSING]: {
        code: RssErrorCode.CONFIG_PROXY_MISSING,
        category: RssErrorCategory.CONFIGURATION,
        severity: RssErrorSeverity.WARNING,
        recoverable: true,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.CONFIG_INVALID_SETTINGS]: {
        code: RssErrorCode.CONFIG_INVALID_SETTINGS,
        category: RssErrorCategory.CONFIGURATION,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.CONFIG_URL_BLOCKED]: {
        code: RssErrorCode.CONFIG_URL_BLOCKED,
        category: RssErrorCategory.CONFIGURATION,
        severity: RssErrorSeverity.CRITICAL,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    // Runtime errors
    [RssErrorCode.RUNTIME_COMPONENT_CRASH]: {
        code: RssErrorCode.RUNTIME_COMPONENT_CRASH,
        category: RssErrorCategory.RUNTIME,
        severity: RssErrorSeverity.CRITICAL,
        recoverable: true, // Error boundary can reset
        retryable: true,
        defaultRetryDelayMs: 1000,
        defaultMaxRetries: 2
    },
    [RssErrorCode.RUNTIME_MEMORY_EXCEEDED]: {
        code: RssErrorCode.RUNTIME_MEMORY_EXCEEDED,
        category: RssErrorCategory.RUNTIME,
        severity: RssErrorSeverity.CRITICAL,
        recoverable: false,
        retryable: false,
        defaultMaxRetries: 0
    },
    [RssErrorCode.RUNTIME_RENDER_TIMEOUT]: {
        code: RssErrorCode.RUNTIME_RENDER_TIMEOUT,
        category: RssErrorCategory.RUNTIME,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 2000,
        defaultMaxRetries: 2
    },
    [RssErrorCode.RUNTIME_UNKNOWN]: {
        code: RssErrorCode.RUNTIME_UNKNOWN,
        category: RssErrorCategory.RUNTIME,
        severity: RssErrorSeverity.ERROR,
        recoverable: true,
        retryable: true,
        defaultRetryDelayMs: 2000,
        defaultMaxRetries: 2
    }
};
/**
 * Creates a structured RssError from an error code and optional details
 * @param code - The error code
 * @param options - Additional error options
 * @returns Structured RssError object
 */
export function createRssError(code, options = {}) {
    const metadata = ERROR_METADATA[code];
    return {
        code,
        category: metadata.category,
        message: options.message || getDefaultMessage(code),
        userMessage: options.userMessage || getDefaultUserMessage(code),
        severity: metadata.severity,
        recoverable: metadata.recoverable,
        retryable: metadata.retryable,
        retryDelayMs: metadata.defaultRetryDelayMs,
        maxRetries: metadata.defaultMaxRetries,
        suggestedActions: options.suggestedActions || getDefaultActions(code),
        details: options.details,
        cause: options.cause,
        timestamp: new Date()
    };
}
/**
 * Creates an RssError from a native Error object
 * @param error - The native Error
 * @param feedUrl - The feed URL that caused the error
 * @returns Structured RssError object
 */
export function createRssErrorFromError(error, feedUrl) {
    const code = classifyError(error);
    return createRssError(code, {
        message: error.message,
        cause: error,
        details: {
            feedUrl,
            stack: error.stack
        }
    });
}
/**
 * Classifies a native Error into an RssErrorCode
 * @param error - The error to classify
 * @returns The classified error code
 */
export function classifyError(error) {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();
    // Network errors
    if (message.includes('cors') || message.includes('access-control')) {
        return RssErrorCode.NETWORK_CORS_BLOCKED;
    }
    if (message.includes('timeout') || name.includes('timeout')) {
        return RssErrorCode.NETWORK_TIMEOUT;
    }
    if (message.includes('dns') || message.includes('getaddrinfo')) {
        return RssErrorCode.NETWORK_DNS_FAILED;
    }
    if (message.includes('offline') || !navigator.onLine) {
        return RssErrorCode.NETWORK_OFFLINE;
    }
    if (message.includes('proxy')) {
        return RssErrorCode.NETWORK_PROXY_FAILED;
    }
    if (message.includes('ssl') || message.includes('certificate')) {
        return RssErrorCode.NETWORK_SSL_ERROR;
    }
    if (message.includes('connection refused') || message.includes('econnrefused')) {
        return RssErrorCode.NETWORK_CONNECTION_REFUSED;
    }
    if (name === 'typeerror' && message.includes('fetch')) {
        return RssErrorCode.NETWORK_UNKNOWN;
    }
    // Configuration errors (check before parsing to catch "invalid url format" correctly)
    if (message.includes('invalid url') || message.includes('malformed url')) {
        return RssErrorCode.CONFIG_INVALID_URL;
    }
    if (message.includes('url') && (message.includes('missing') || message.includes('required'))) {
        return RssErrorCode.CONFIG_MISSING_URL;
    }
    if (message.includes('blocked') || message.includes('forbidden')) {
        return RssErrorCode.CONFIG_URL_BLOCKED;
    }
    // Parsing errors
    if (message.includes('xml') && (message.includes('parse') || message.includes('invalid'))) {
        return RssErrorCode.PARSE_INVALID_XML;
    }
    if (message.includes('format') || message.includes('unrecognized')) {
        return RssErrorCode.PARSE_UNKNOWN_FORMAT;
    }
    if (message.includes('empty')) {
        return RssErrorCode.PARSE_EMPTY_FEED;
    }
    if (message.includes('encoding') || message.includes('charset')) {
        return RssErrorCode.PARSE_ENCODING_ERROR;
    }
    if (message.includes('csp') || message.includes('content security')) {
        return RssErrorCode.PARSE_CSP_VIOLATION;
    }
    // Runtime errors
    if (message.includes('memory') || message.includes('heap')) {
        return RssErrorCode.RUNTIME_MEMORY_EXCEEDED;
    }
    if (message.includes('render') || message.includes('component')) {
        return RssErrorCode.RUNTIME_COMPONENT_CRASH;
    }
    // Default to runtime unknown
    return RssErrorCode.RUNTIME_UNKNOWN;
}
/**
 * Gets the default technical message for an error code
 * @param code - The error code
 * @returns Default message string
 */
function getDefaultMessage(code) {
    const messages = {
        [RssErrorCode.NETWORK_CORS_BLOCKED]: 'CORS policy blocked the request',
        [RssErrorCode.NETWORK_TIMEOUT]: 'Request timed out',
        [RssErrorCode.NETWORK_DNS_FAILED]: 'DNS resolution failed',
        [RssErrorCode.NETWORK_OFFLINE]: 'Network is offline',
        [RssErrorCode.NETWORK_PROXY_FAILED]: 'Proxy service failed',
        [RssErrorCode.NETWORK_HTTP_ERROR]: 'HTTP error response',
        [RssErrorCode.NETWORK_CONNECTION_REFUSED]: 'Connection refused',
        [RssErrorCode.NETWORK_SSL_ERROR]: 'SSL certificate error',
        [RssErrorCode.NETWORK_UNKNOWN]: 'Unknown network error',
        [RssErrorCode.PARSE_INVALID_XML]: 'Invalid XML in feed',
        [RssErrorCode.PARSE_UNKNOWN_FORMAT]: 'Unknown feed format',
        [RssErrorCode.PARSE_EMPTY_FEED]: 'Feed is empty',
        [RssErrorCode.PARSE_MISSING_ITEMS]: 'Feed has no items',
        [RssErrorCode.PARSE_ENCODING_ERROR]: 'Character encoding error',
        [RssErrorCode.PARSE_CSP_VIOLATION]: 'Content Security Policy violation',
        [RssErrorCode.PARSE_VALIDATION_FAILED]: 'Feed validation failed',
        [RssErrorCode.PARSE_RECOVERY_FAILED]: 'Feed recovery failed',
        [RssErrorCode.CONFIG_INVALID_URL]: 'Invalid feed URL',
        [RssErrorCode.CONFIG_MISSING_URL]: 'Feed URL is missing',
        [RssErrorCode.CONFIG_PROXY_MISSING]: 'Proxy URL is required',
        [RssErrorCode.CONFIG_INVALID_SETTINGS]: 'Invalid configuration settings',
        [RssErrorCode.CONFIG_URL_BLOCKED]: 'URL is blocked for security reasons',
        [RssErrorCode.RUNTIME_COMPONENT_CRASH]: 'Component crashed',
        [RssErrorCode.RUNTIME_MEMORY_EXCEEDED]: 'Memory limit exceeded',
        [RssErrorCode.RUNTIME_RENDER_TIMEOUT]: 'Render timeout',
        [RssErrorCode.RUNTIME_UNKNOWN]: 'Unknown runtime error'
    };
    return messages[code] || 'Unknown error';
}
/**
 * Gets the default user-friendly message for an error code
 * @param code - The error code
 * @returns User-friendly message string
 */
function getDefaultUserMessage(code) {
    const messages = {
        [RssErrorCode.NETWORK_CORS_BLOCKED]: 'Unable to access the feed. The source may require a proxy.',
        [RssErrorCode.NETWORK_TIMEOUT]: 'The feed is taking too long to load. Please try again.',
        [RssErrorCode.NETWORK_DNS_FAILED]: 'Could not find the feed server. Please check the URL.',
        [RssErrorCode.NETWORK_OFFLINE]: 'You appear to be offline. Please check your connection.',
        [RssErrorCode.NETWORK_PROXY_FAILED]: 'The proxy service is unavailable. Please try again later.',
        [RssErrorCode.NETWORK_HTTP_ERROR]: 'The feed server returned an error. Please try again.',
        [RssErrorCode.NETWORK_CONNECTION_REFUSED]: 'Could not connect to the feed server.',
        [RssErrorCode.NETWORK_SSL_ERROR]: 'Security certificate error. The feed may not be secure.',
        [RssErrorCode.NETWORK_UNKNOWN]: 'A network error occurred. Please try again.',
        [RssErrorCode.PARSE_INVALID_XML]: 'The feed content is malformed. It may need recovery.',
        [RssErrorCode.PARSE_UNKNOWN_FORMAT]: 'The feed format is not supported.',
        [RssErrorCode.PARSE_EMPTY_FEED]: 'The feed is empty. Please check back later.',
        [RssErrorCode.PARSE_MISSING_ITEMS]: 'The feed has no items to display.',
        [RssErrorCode.PARSE_ENCODING_ERROR]: 'The feed has character encoding issues.',
        [RssErrorCode.PARSE_CSP_VIOLATION]: 'Security policy prevents loading this content.',
        [RssErrorCode.PARSE_VALIDATION_FAILED]: 'The feed structure is invalid.',
        [RssErrorCode.PARSE_RECOVERY_FAILED]: 'Could not repair the malformed feed.',
        [RssErrorCode.CONFIG_INVALID_URL]: 'The feed URL is not valid. Please check the settings.',
        [RssErrorCode.CONFIG_MISSING_URL]: 'Please configure a feed URL in the settings.',
        [RssErrorCode.CONFIG_PROXY_MISSING]: 'A proxy URL is required for this feed.',
        [RssErrorCode.CONFIG_INVALID_SETTINGS]: 'Some settings are invalid. Please check the configuration.',
        [RssErrorCode.CONFIG_URL_BLOCKED]: 'This URL is not allowed for security reasons.',
        [RssErrorCode.RUNTIME_COMPONENT_CRASH]: 'Something went wrong. Please refresh the page.',
        [RssErrorCode.RUNTIME_MEMORY_EXCEEDED]: 'Too much data to display. Try reducing the item count.',
        [RssErrorCode.RUNTIME_RENDER_TIMEOUT]: 'Display took too long. Please try again.',
        [RssErrorCode.RUNTIME_UNKNOWN]: 'An unexpected error occurred.'
    };
    return messages[code] || 'An error occurred';
}
/**
 * Gets default suggested actions for an error code
 * @param code - The error code
 * @returns Array of suggested actions
 */
function getDefaultActions(code) {
    const actions = {
        [RssErrorCode.NETWORK_CORS_BLOCKED]: [
            { id: 'configure-proxy', label: 'Configure Proxy', icon: 'Settings', primary: true },
            { id: 'retry', label: 'Try Again', icon: 'Refresh' }
        ],
        [RssErrorCode.NETWORK_TIMEOUT]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.NETWORK_DNS_FAILED]: [
            { id: 'check-url', label: 'Check URL', icon: 'Link', primary: true }
        ],
        [RssErrorCode.NETWORK_OFFLINE]: [
            { id: 'wait', label: 'Waiting for connection...', icon: 'WifiWarning' }
        ],
        [RssErrorCode.NETWORK_PROXY_FAILED]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true },
            { id: 'direct', label: 'Try Direct', icon: 'Globe' }
        ],
        [RssErrorCode.NETWORK_HTTP_ERROR]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.NETWORK_CONNECTION_REFUSED]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.NETWORK_SSL_ERROR]: [
            { id: 'check-url', label: 'Check URL', icon: 'Shield' }
        ],
        [RssErrorCode.NETWORK_UNKNOWN]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.PARSE_INVALID_XML]: [
            { id: 'retry-recovery', label: 'Try Recovery', icon: 'Repair', primary: true }
        ],
        [RssErrorCode.PARSE_UNKNOWN_FORMAT]: [
            { id: 'check-url', label: 'Check Feed URL', icon: 'Link' }
        ],
        [RssErrorCode.PARSE_EMPTY_FEED]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.PARSE_MISSING_ITEMS]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.PARSE_ENCODING_ERROR]: [
            { id: 'report', label: 'Report Issue', icon: 'Feedback' }
        ],
        [RssErrorCode.PARSE_CSP_VIOLATION]: [],
        [RssErrorCode.PARSE_VALIDATION_FAILED]: [
            { id: 'retry-recovery', label: 'Try Recovery', icon: 'Repair', primary: true }
        ],
        [RssErrorCode.PARSE_RECOVERY_FAILED]: [
            { id: 'report', label: 'Report Issue', icon: 'Feedback' }
        ],
        [RssErrorCode.CONFIG_INVALID_URL]: [
            { id: 'open-settings', label: 'Open Settings', icon: 'Settings', primary: true }
        ],
        [RssErrorCode.CONFIG_MISSING_URL]: [
            { id: 'open-settings', label: 'Configure Feed', icon: 'Settings', primary: true }
        ],
        [RssErrorCode.CONFIG_PROXY_MISSING]: [
            { id: 'open-settings', label: 'Configure Proxy', icon: 'Settings', primary: true }
        ],
        [RssErrorCode.CONFIG_INVALID_SETTINGS]: [
            { id: 'open-settings', label: 'Fix Settings', icon: 'Settings', primary: true }
        ],
        [RssErrorCode.CONFIG_URL_BLOCKED]: [],
        [RssErrorCode.RUNTIME_COMPONENT_CRASH]: [
            { id: 'reset', label: 'Reset Component', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.RUNTIME_MEMORY_EXCEEDED]: [
            { id: 'open-settings', label: 'Reduce Items', icon: 'Settings', primary: true }
        ],
        [RssErrorCode.RUNTIME_RENDER_TIMEOUT]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ],
        [RssErrorCode.RUNTIME_UNKNOWN]: [
            { id: 'retry', label: 'Try Again', icon: 'Refresh', primary: true }
        ]
    };
    return actions[code] || [];
}
/**
 * Type guard to check if an error is an RssError
 * @param error - The error to check
 * @returns True if the error is an RssError
 */
export function isRssError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'category' in error &&
        'message' in error &&
        'severity' in error &&
        typeof error.code === 'number' &&
        Object.values(RssErrorCode).includes(error.code));
}
/**
 * Gets the error category from an error code
 * @param code - The error code
 * @returns The error category
 */
export function getErrorCategory(code) {
    var _a;
    return ((_a = ERROR_METADATA[code]) === null || _a === void 0 ? void 0 : _a.category) || RssErrorCategory.RUNTIME;
}
/**
 * Checks if an error is retryable
 * @param error - The error to check
 * @returns True if the error can be retried
 */
export function isRetryable(error) {
    var _a;
    const code = typeof error === 'number' ? error : error.code;
    return ((_a = ERROR_METADATA[code]) === null || _a === void 0 ? void 0 : _a.retryable) || false;
}
/**
 * Checks if an error is recoverable
 * @param error - The error to check
 * @returns True if the error can be recovered from
 */
export function isRecoverable(error) {
    var _a;
    const code = typeof error === 'number' ? error : error.code;
    return ((_a = ERROR_METADATA[code]) === null || _a === void 0 ? void 0 : _a.recoverable) || false;
}
/**
 * Gets the recommended retry delay for an error
 * @param error - The error
 * @param attempt - Current retry attempt (for exponential backoff)
 * @returns Delay in milliseconds
 */
export function getRetryDelay(error, attempt = 0) {
    var _a;
    const code = typeof error === 'number' ? error : error.code;
    const baseDelay = ((_a = ERROR_METADATA[code]) === null || _a === void 0 ? void 0 : _a.defaultRetryDelayMs) || 2000;
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = exponentialDelay * 0.1 * Math.random();
    return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
}
/**
 * Gets the maximum retry count for an error
 * @param error - The error
 * @returns Maximum retry count
 */
export function getMaxRetries(error) {
    var _a, _b;
    const code = typeof error === 'number' ? error : error.code;
    return (_b = (_a = ERROR_METADATA[code]) === null || _a === void 0 ? void 0 : _a.defaultMaxRetries) !== null && _b !== void 0 ? _b : 0;
}
//# sourceMappingURL=errorTypes.js.map