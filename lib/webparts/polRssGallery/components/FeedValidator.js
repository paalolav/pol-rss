/**
 * FeedValidator Component
 *
 * Provides real-time feed URL validation with accessibility testing.
 * Used in the property pane to help users configure valid feed URLs.
 */
import * as React from 'react';
import styles from './RssFeed.module.scss';
import { RssErrorCode, createRssError, createRssErrorFromError } from '../errors/errorTypes';
import { validateFeed } from '../services/feedValidator';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
/**
 * Validate URL format
 */
export function validateUrlFormat(url) {
    if (!url || !url.trim()) {
        return {
            isValid: false,
            error: 'URL is required',
            suggestion: 'Enter a valid RSS or Atom feed URL'
        };
    }
    const trimmed = url.trim();
    // Check for protocol
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return {
            isValid: false,
            error: 'URL must start with http:// or https://',
            suggestion: `Did you mean https://${trimmed}?`
        };
    }
    // Try to parse as URL
    try {
        const parsed = new URL(trimmed);
        // Check for valid hostname (allow localhost for development)
        const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
        if (!parsed.hostname || (!isLocalhost && !parsed.hostname.includes('.'))) {
            return {
                isValid: false,
                error: 'Invalid hostname',
                suggestion: 'Enter a complete domain name (e.g., example.com)'
            };
        }
        // Warn about common mistakes
        if (parsed.hostname === 'localhost') {
            return {
                isValid: true,
                suggestion: 'Note: localhost URLs only work during development'
            };
        }
        // Check for feed-like paths
        const pathLower = parsed.pathname.toLowerCase();
        const feedPatterns = ['/feed', '/rss', '/atom', '.xml', '.rss', '/syndication'];
        const hasFeedPath = feedPatterns.some(pattern => pathLower.includes(pattern));
        if (!hasFeedPath && !parsed.search) {
            return {
                isValid: true,
                suggestion: 'This URL may not be a feed. Feed URLs typically contain /feed, /rss, or end with .xml'
            };
        }
        return { isValid: true };
    }
    catch (_a) {
        return {
            isValid: false,
            error: 'Invalid URL format',
            suggestion: 'Please enter a valid URL starting with https://'
        };
    }
}
/**
 * FeedValidator Component
 *
 * Provides URL input with real-time validation and feed testing capabilities.
 * Shows detailed feedback about feed validity and common issues.
 */
export const FeedValidator = ({ url, onUrlChange, onValidationChange, fetchFn, proxyUrl, validateOnBlur = true, debounceMs = 500, placeholder = 'Enter feed URL (e.g., https://example.com/feed.xml)', label = 'Feed URL', showDetails = true, disabled = false }) => {
    const [validationState, setValidationState] = React.useState({ status: 'idle' });
    const [urlError, setUrlError] = React.useState(null);
    const [urlSuggestion, setUrlSuggestion] = React.useState(null);
    const debounceRef = React.useRef(null);
    const abortControllerRef = React.useRef(null);
    // Validate URL format when it changes (including initial render)
    React.useEffect(() => {
        if (url) {
            const validation = validateUrlFormat(url);
            setUrlError(validation.isValid ? null : validation.error || null);
            setUrlSuggestion(validation.suggestion || null);
        }
        else {
            setUrlError(null);
            setUrlSuggestion(null);
        }
    }, [url]);
    // Update parent when validation state changes
    React.useEffect(() => {
        if (onValidationChange) {
            onValidationChange(validationState);
        }
    }, [validationState, onValidationChange]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    /**
     * Validate URL format immediately on change
     */
    const handleUrlChange = (newUrl) => {
        onUrlChange(newUrl);
        // Clear previous state
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        // Validate format immediately
        const validation = validateUrlFormat(newUrl);
        setUrlError(validation.isValid ? null : validation.error || null);
        setUrlSuggestion(validation.suggestion || null);
        // Reset validation state if URL changes
        if (validationState.status !== 'idle') {
            setValidationState({ status: 'idle' });
        }
    };
    /**
     * Test feed accessibility
     */
    const validateFeedUrl = async () => {
        var _a;
        const validation = validateUrlFormat(url);
        if (!validation.isValid) {
            return;
        }
        // Cancel any pending validation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        setValidationState({ status: 'validating' });
        try {
            // Use provided fetch function or default
            const fetcher = fetchFn || window.fetch.bind(window);
            // Try direct fetch first
            let response;
            let usedProxy = false;
            try {
                response = await fetcher(url);
            }
            catch (directError) {
                // If direct fetch fails and we have a proxy, try that
                if (proxyUrl) {
                    const proxyFullUrl = `${proxyUrl}?url=${encodeURIComponent(url)}`;
                    response = await fetcher(proxyFullUrl);
                    usedProxy = true;
                }
                else {
                    throw directError;
                }
            }
            if (signal.aborted)
                return;
            if (!response.ok) {
                const error = createRssError(RssErrorCode.NETWORK_HTTP_ERROR, {
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    details: { httpStatus: response.status, httpStatusText: response.statusText }
                });
                setValidationState({ status: 'invalid', error });
                return;
            }
            const content = await response.text();
            if (signal.aborted)
                return;
            // Validate feed content
            const validationResult = validateFeed(content);
            if (!validationResult.isValid) {
                const errorMsg = validationResult.errors.map(e => e.message).join('; ');
                const error = createRssError(validationResult.format === 'unknown'
                    ? RssErrorCode.PARSE_UNKNOWN_FORMAT
                    : RssErrorCode.PARSE_VALIDATION_FAILED, { message: errorMsg });
                setValidationState({ status: 'invalid', error });
                return;
            }
            // Try to parse to get more details
            const parsedItems = ImprovedFeedParser.parse(content, { fallbackImageUrl: '' });
            if (signal.aborted)
                return;
            const warnings = [];
            if (usedProxy) {
                warnings.push('Feed requires proxy due to CORS restrictions');
            }
            if (validationResult.warnings.length > 0) {
                warnings.push(...validationResult.warnings.map(w => w.message));
            }
            setValidationState({
                status: warnings.length > 0 ? 'warning' : 'valid',
                feedTitle: (_a = validationResult.metadata) === null || _a === void 0 ? void 0 : _a.title,
                itemCount: parsedItems.length,
                format: formatVersionString(validationResult.format, validationResult.formatVersion),
                warnings: warnings.length > 0 ? warnings : undefined
            });
        }
        catch (error) {
            if (signal.aborted)
                return;
            const rssError = error instanceof Error
                ? createRssErrorFromError(error)
                : createRssError(RssErrorCode.NETWORK_UNKNOWN, {
                    message: 'Failed to validate feed'
                });
            setValidationState({ status: 'invalid', error: rssError });
        }
    };
    /**
     * Handle blur event
     */
    const handleBlur = () => {
        if (validateOnBlur && url && validateUrlFormat(url).isValid) {
            // Debounce validation
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                validateFeedUrl();
            }, debounceMs);
        }
    };
    /**
     * Handle manual validation trigger
     */
    const handleValidate = () => {
        validateFeedUrl();
    };
    /**
     * Format version string for display
     */
    const formatVersionString = (format, version) => {
        const formatNames = {
            'rss1': 'RSS 1.0',
            'rss2': 'RSS 2.0',
            'atom': 'Atom',
            'json': 'JSON Feed'
        };
        const name = formatNames[format] || format.toUpperCase();
        return version ? `${name} ${version}` : name;
    };
    /**
     * Get status icon
     */
    const getStatusIcon = () => {
        switch (validationState.status) {
            case 'validating': return 'ProgressRingDots';
            case 'valid': return 'CheckMark';
            case 'warning': return 'Warning';
            case 'invalid': return 'ErrorBadge';
            default: return '';
        }
    };
    /**
     * Get status class
     */
    const getStatusClass = () => {
        switch (validationState.status) {
            case 'valid': return styles.validationValid;
            case 'warning': return styles.validationWarning;
            case 'invalid': return styles.validationInvalid;
            default: return '';
        }
    };
    return (React.createElement("div", { className: styles.feedValidator },
        React.createElement("label", { htmlFor: "feed-url-input", className: styles.feedValidatorLabel }, label),
        React.createElement("div", { className: styles.feedValidatorInputWrapper },
            React.createElement("input", { id: "feed-url-input", type: "url", value: url, onChange: (e) => handleUrlChange(e.target.value), onBlur: handleBlur, placeholder: placeholder, disabled: disabled, className: `${styles.feedValidatorInput} ${urlError ? styles.inputError : ''}`, "aria-invalid": !!urlError, "aria-describedby": urlError ? 'url-error' : undefined }),
            React.createElement("button", { type: "button", onClick: handleValidate, disabled: disabled || !url || !!urlError || validationState.status === 'validating', className: styles.feedValidatorButton, "aria-label": "Test feed" },
                React.createElement("i", { className: "ms-Icon ms-Icon--TestBeaker", "aria-hidden": "true" }),
                "Test")),
        urlError && (React.createElement("div", { id: "url-error", className: styles.feedValidatorError, role: "alert" },
            React.createElement("i", { className: "ms-Icon ms-Icon--Error", "aria-hidden": "true" }),
            React.createElement("span", null, urlError))),
        urlSuggestion && !urlError && (React.createElement("div", { className: styles.feedValidatorSuggestion },
            React.createElement("i", { className: "ms-Icon ms-Icon--Info", "aria-hidden": "true" }),
            React.createElement("span", null, urlSuggestion))),
        validationState.status !== 'idle' && (React.createElement("div", { className: `${styles.feedValidatorStatus} ${getStatusClass()}`, role: "status", "aria-live": "polite" },
            React.createElement("i", { className: `ms-Icon ms-Icon--${getStatusIcon()}`, "aria-hidden": "true" }),
            validationState.status === 'validating' && (React.createElement("span", null, "Validating feed...")),
            validationState.status === 'valid' && (React.createElement("div", { className: styles.feedValidatorDetails },
                React.createElement("span", { className: styles.validationSuccess }, "Feed is valid!"),
                showDetails && validationState.feedTitle && (React.createElement("span", { className: styles.feedTitle }, validationState.feedTitle)),
                showDetails && (React.createElement("span", { className: styles.feedMeta },
                    validationState.format,
                    " \u2022 ",
                    validationState.itemCount,
                    " items")))),
            validationState.status === 'warning' && (React.createElement("div", { className: styles.feedValidatorDetails },
                React.createElement("span", { className: styles.validationWarningText }, "Feed is valid with warnings"),
                showDetails && validationState.feedTitle && (React.createElement("span", { className: styles.feedTitle }, validationState.feedTitle)),
                showDetails && (React.createElement("span", { className: styles.feedMeta },
                    validationState.format,
                    " \u2022 ",
                    validationState.itemCount,
                    " items")),
                validationState.warnings && (React.createElement("ul", { className: styles.warningList }, validationState.warnings.map((warning, index) => (React.createElement("li", { key: index }, warning))))))),
            validationState.status === 'invalid' && validationState.error && (React.createElement("div", { className: styles.feedValidatorDetails },
                React.createElement("span", { className: styles.validationError }, validationState.error.userMessage),
                validationState.error.suggestedActions && validationState.error.suggestedActions.length > 0 && (React.createElement("span", { className: styles.errorSuggestion }, validationState.error.suggestedActions[0].label))))))));
};
/**
 * Simple URL validation hook for use elsewhere
 */
export function useFeedUrlValidation(initialUrl = '') {
    const [url, setUrl] = React.useState(initialUrl);
    const [validation, setValidation] = React.useState({ isValid: false });
    React.useEffect(() => {
        setValidation(validateUrlFormat(url));
    }, [url]);
    return {
        url,
        setUrl,
        isValid: validation.isValid,
        error: validation.error || null,
        suggestion: validation.suggestion || null
    };
}
export default FeedValidator;
//# sourceMappingURL=FeedValidator.js.map