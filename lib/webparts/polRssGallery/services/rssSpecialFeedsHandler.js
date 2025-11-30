/**
 * Collection of utilities to handle RSS feeds with authentication and special formats.
 * Uses intelligent detection based on URL patterns rather than hardcoded domain names.
 */
export class RssSpecialFeedsHandler {
    /**
     * Check if the feed URL contains authentication parameters that need special handling.
     * Detection is based on URL parameter patterns, not domain names.
     */
    static isAuthenticatedFeed(url) {
        try {
            const urlObj = new URL(url);
            // Check for common API key parameter names
            const authParamNames = ['apiKey', 'api_key', 'apikey', 'token', 'access_token', 'auth_token'];
            for (const param of authParamNames) {
                if (urlObj.searchParams.has(param)) {
                    return true;
                }
            }
            // Look for other auth-related parameters by pattern
            let hasAuthParam = false;
            urlObj.searchParams.forEach((_value, key) => {
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('key') ||
                    lowerKey.includes('auth') ||
                    lowerKey.includes('token') ||
                    lowerKey.includes('secret')) {
                    hasAuthParam = true;
                }
            });
            return hasAuthParam;
        }
        catch (_a) {
            return false;
        }
    }
    /**
     * Check if URL appears to be an API-based feed (vs standard RSS endpoint).
     * API feeds often need special auth header handling and longer timeouts.
     */
    static isApiFeed(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.toLowerCase();
            // Detect API-style paths
            if (path.includes('/api/') ||
                path.includes('/v1/') ||
                path.includes('/v2/') ||
                path.includes('/newsletters/')) {
                return true;
            }
            // Has auth parameters = likely API feed
            return this.isAuthenticatedFeed(url);
        }
        catch (_a) {
            return false;
        }
    }
    /**
     * @deprecated Use isApiFeed() instead. This method now uses intelligent detection
     * instead of hardcoded domain checks.
     */
    static isMeltwaterFeed(url) {
        return this.isApiFeed(url);
    }
    /**
     * Handle fetching of authenticated feeds using intelligent detection.
     * Tries multiple auth header strategies based on detected parameters.
     * @param url The feed URL
     * @returns Response object
     */
    static async fetchAuthenticatedFeed(url) {
        try {
            const urlObj = new URL(url);
            // Extract auth parameters using common naming conventions
            const apiKey = urlObj.searchParams.get('apiKey') ||
                urlObj.searchParams.get('api_key') ||
                urlObj.searchParams.get('apikey');
            const token = urlObj.searchParams.get('token') ||
                urlObj.searchParams.get('access_token') ||
                urlObj.searchParams.get('auth_token');
            // If this looks like an API feed, use enhanced fetching
            if (this.isApiFeed(url)) {
                return this.fetchWithAuthRetry(url, apiKey, token);
            }
            // Standard auth header approach
            const headers = {};
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
                headers['X-API-Key'] = apiKey;
            }
            else if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Add any other custom auth headers based on URL parameters
            urlObj.searchParams.forEach((value, key) => {
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('auth') &&
                    !lowerKey.includes('key') &&
                    !lowerKey.includes('token')) {
                    headers[key] = value;
                }
            });
            // Only do a special fetch if we have auth headers to add
            if (Object.keys(headers).length > 0) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);
                    const response = await fetch(url, {
                        headers,
                        signal: controller.signal,
                        redirect: 'follow',
                        credentials: 'omit'
                    });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response;
                    }
                }
                catch (fetchError) {
                    console.warn(`Auth fetch failed, trying fallback:`, fetchError);
                }
            }
        }
        catch (error) {
            console.error('Error in fetchAuthenticatedFeed:', error);
        }
        // Fall back to regular fetch
        return this.fetchWithTimeout(url);
    }
    /**
     * Fetch with multiple auth header strategies for API-based feeds.
     * Tries different header combinations that various APIs expect.
     */
    static async fetchWithAuthRetry(url, apiKey, token) {
        const baseHeaders = {
            'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml, */*',
            'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader'
        };
        // Strategy 1: Bearer token in Authorization header
        if (apiKey || token) {
            const authValue = apiKey || token;
            try {
                const response = await fetch(url, {
                    headers: {
                        ...baseHeaders,
                        'Authorization': `Bearer ${authValue}`,
                        ...(apiKey ? { 'X-API-Key': apiKey } : {})
                    }
                });
                if (response.ok)
                    return response;
            }
            catch ( /* continue to next strategy */_a) { /* continue to next strategy */ }
        }
        // Strategy 2: API key in custom header (some APIs expect this)
        if (apiKey) {
            try {
                const response = await fetch(url, {
                    headers: { ...baseHeaders, 'apiKey': apiKey }
                });
                if (response.ok)
                    return response;
            }
            catch ( /* continue to next strategy */_b) { /* continue to next strategy */ }
        }
        // Strategy 3: Minimal headers (some feeds reject extra headers)
        try {
            const response = await fetch(url, { headers: baseHeaders });
            if (response.ok)
                return response;
        }
        catch ( /* continue to fallback */_c) { /* continue to fallback */ }
        // Final fallback: plain fetch
        return this.fetchWithTimeout(url);
    }
    /**
     * Fetch with timeout to prevent hanging connections
     */
    static async fetchWithTimeout(url, timeoutMs = 10000) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                credentials: 'omit'
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (error) {
            console.error('Fetch with timeout failed:', error);
            return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title><description>Feed unavailable</description></channel></rss>', { status: 200, headers: { 'Content-Type': 'application/xml' } });
        }
    }
    /**
     * Always assume feeds might have format issues and apply universal fixes
     * @deprecated Use the preprocessingHints directly in ImprovedFeedParser
     */
    static hasKnownFormatIssues(_url) {
        // Return true for all URLs to ensure robust handling everywhere
        return true;
    }
    /**
     * Get generic pre-processing hints for the feed parser.
     * Applies all fixes universally - the parser's recovery system will
     * intelligently detect which fixes are actually needed.
     * @param _url The feed URL (unused - all feeds get same treatment)
     */
    static getPreProcessingHints(_url) {
        // Apply all fixes universally for maximum compatibility.
        // The parser's recovery system handles detection intelligently.
        return {
            addMissingNamespaces: true,
            fixUnclosedTags: true,
            addMissingXmlDeclaration: true,
            fixCdataSequences: true
        };
    }
}
//# sourceMappingURL=rssSpecialFeedsHandler.js.map