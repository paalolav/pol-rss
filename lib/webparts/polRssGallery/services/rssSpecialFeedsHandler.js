/**
 * Collection of utilities to handle RSS feeds with authentication and special formats
 * This is a transitional helper that now provides generic handling for all feeds.
 */
export class RssSpecialFeedsHandler {
    /**
     * Check if the feed URL contains authentication parameters that need special handling
     */
    static isAuthenticatedFeed(url) {
        try {
            const urlObj = new URL(url);
            // Specific check for Meltwater feeds which often have 403 issues
            if (url.includes('meltwater.com') || url.includes('mwapi')) {
                return true;
            }
            // Generic check for API keys in URL parameters (common pattern)
            if (urlObj.searchParams.has('apiKey') ||
                urlObj.searchParams.has('api_key') ||
                urlObj.searchParams.has('token') ||
                urlObj.searchParams.has('access_token')) {
                return true;
            }
            // Look for other auth-related parameters
            let hasAuthParam = false;
            urlObj.searchParams.forEach((value, key) => {
                if (key.toLowerCase().includes('key') ||
                    key.toLowerCase().includes('auth') ||
                    key.toLowerCase().includes('token')) {
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
     * Check if the given URL is a Meltwater feed
     * Meltwater feeds often require special handling for authentication
     */
    static isMeltwaterFeed(url) {
        return url.includes('meltwater.com') || url.includes('mwapi');
    }
    /**
     * Handle fetching of authenticated feeds - now uses a generic approach
     * @param url The feed URL
     * @returns Response object
     */
    static async fetchAuthenticatedFeed(url) {
        try {
            const urlObj = new URL(url);
            const headers = {};
            // Special handling for Meltwater feeds
            if (this.isMeltwaterFeed(url)) {
                return this.fetchMeltwaterFeed(url);
            }
            // Generic handling for common API authentication patterns
            const apiKey = urlObj.searchParams.get('apiKey') ||
                urlObj.searchParams.get('api_key');
            const token = urlObj.searchParams.get('token') ||
                urlObj.searchParams.get('access_token') ||
                urlObj.searchParams.get('auth_token');
            // Add appropriate headers based on authentication parameters
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
                headers['X-API-Key'] = apiKey;
            }
            else if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Add any other custom auth headers based on URL parameters
            let hasAuthHeader = false;
            urlObj.searchParams.forEach((value, key) => {
                if (key.toLowerCase().includes('auth') &&
                    !key.toLowerCase().includes('key') &&
                    !key.toLowerCase().includes('token')) {
                    headers[key] = value;
                    hasAuthHeader = true;
                }
            });
            // Only do a special fetch if we have auth headers to add
            if (Object.keys(headers).length > 0 || hasAuthHeader) {
                try {
                    // Add timeout handling to prevent hanging on redirect loops
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                    const response = await fetch(url, {
                        headers,
                        signal: controller.signal,
                        redirect: 'follow',
                        credentials: 'omit' // Avoid cookies which might cause redirect loops
                    });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response;
                    }
                }
                catch (fetchError) {
                    console.warn(`Auth fetch failed for ${url}:`, fetchError);
                    // Continue to fallback fetch
                }
            }
        }
        catch (error) {
            console.error('Error in fetchAuthenticatedFeed:', error);
        }
        // Fall back to regular fetch if no special handling matched or if it failed
        try {
            // Add timeout and handle redirect issues in fallback fetch too
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                credentials: 'omit'
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (fallbackError) {
            console.error('Fallback fetch failed:', fallbackError);
            // Return an empty response to prevent further errors
            return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title><description>Feed unavailable</description></channel></rss>', {
                status: 200,
                headers: { 'Content-Type': 'application/xml' }
            });
        }
    }
    /**
     * Special handling for Meltwater feeds
     * Meltwater feeds often require specific authentication handling
     */
    static async fetchMeltwaterFeed(url) {
        const headers = {
            'Accept': 'application/xml, text/xml, */*',
            'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader'
        };
        try {
            const urlObj = new URL(url);
            // Extract potential auth parameters
            const apiKey = urlObj.searchParams.get('apiKey') ||
                urlObj.searchParams.get('api_key');
            const token = urlObj.searchParams.get('token') ||
                urlObj.searchParams.get('access_token');
            // Try different auth header combinations
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
                headers['X-API-Key'] = apiKey;
            }
            else if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Try fetch with headers first
            const response = await fetch(url, { headers });
            if (response.ok) {
                return response;
            }
            // If that fails, try with a different auth approach
            if (apiKey) {
                delete headers['Authorization'];
                headers['apiKey'] = apiKey;
                const altResponse = await fetch(url, { headers });
                if (altResponse.ok) {
                    return altResponse;
                }
            }
            // If both approaches fail, try one more time with minimal headers
            return await fetch(url, {
                headers: {
                    'Accept': 'application/xml, text/xml, */*',
                    'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader'
                }
            });
        }
        catch (error) {
            // If all special handling fails, try plain fetch as last resort
            console.error('Error in fetchMeltwaterFeed:', error);
            return fetch(url);
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
     * Get generic pre-processing hints for the feed parser
     * @param url The feed URL
     */
    static getPreProcessingHints(url) {
        // Apply specific fixes for known problematic feeds
        if (url.includes('nettavisen.no')) {
            return {
                addMissingNamespaces: true,
                fixUnclosedTags: true,
                addMissingXmlDeclaration: true,
                fixCdataSequences: true
            };
        }
        // Special handling for Meltwater feeds
        if (this.isMeltwaterFeed(url)) {
            return {
                addMissingNamespaces: true,
                fixUnclosedTags: true,
                addMissingXmlDeclaration: true,
                fixCdataSequences: true
            };
        }
        // Apply all fixes to all other feeds for maximum compatibility
        return {
            addMissingNamespaces: true,
            fixUnclosedTags: true,
            addMissingXmlDeclaration: true,
            fixCdataSequences: true
        };
    }
}
//# sourceMappingURL=rssSpecialFeedsHandler.js.map