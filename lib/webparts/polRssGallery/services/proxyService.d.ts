import { HttpClient } from '@microsoft/sp-http';
/**
 * Service to fetch RSS feeds through a proxy when direct access is restricted due to CORS
 */
export declare class ProxyService {
    private static readonly LOG_SOURCE;
    private static readonly DEFAULT_PROXIES;
    private static _proxyUrls;
    private static _httpClient;
    private static _debugMode;
    private static readonly MAX_REDIRECTS;
    private static _attemptedUrls;
    /**
     * Enable or disable debug mode for detailed logging
     */
    static setDebugMode(enable: boolean): void;
    /**
     * Initialize the service with an HttpClient
     */
    static init(httpClient: HttpClient): void;
    /**
     * Add a custom proxy URL
     */
    static addProxyUrl(url: string): void;
    /**
     * Reset proxy URLs to default
     */
    static resetProxyUrls(): void;
    /**
     * Extract API key and other authentication parameters from URL for special handling
     * This is useful for services like Meltwater that require specific authentication
     */
    private static extractAuthParams;
    /**
     * Log errors in debug mode
     */
    private static logError;
    /**
     * Fetch content through available proxies, trying each one until successful
     * Enhanced to handle authentication parameters better and prevent redirect loops
     */
    static fetch(url: string, options?: RequestInit): Promise<Response>;
    /**
     * Helper method to handle redirects manually to prevent redirect loops
     */
    private static _fetchWithRedirectHandling;
    /**
     * Fetch with retry mechanism for handling intermittent failures like 403s
     * Particularly useful for Meltwater feeds that sometimes return 403
     */
    private static fetchWithRetry;
}
//# sourceMappingURL=proxyService.d.ts.map