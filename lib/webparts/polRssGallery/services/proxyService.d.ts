import { HttpClient } from '@microsoft/sp-http';
export interface ITenantProxyConfig {
    /** The Azure Function proxy URL (e.g., https://fn-rss-proxy.azurewebsites.net/api/proxy) */
    proxyUrl: string;
    /** The function key for authentication */
    functionKey: string;
}
export interface IProxyHealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    timestamp: string;
    configuration: {
        allowlistEnabled: boolean;
        allowlistPatterns: number;
        rateLimitEnabled: boolean;
        rateLimitRequests: string;
        rateLimitWindowSeconds: string;
    };
    uptime: number;
}
export declare class ProxyService {
    private static readonly LOG_SOURCE;
    private static readonly DEFAULT_PROXIES;
    /**
     * Sensitive URL parameter names that should be masked in logs
     * Includes common patterns for API keys, tokens, and authentication credentials
     */
    private static readonly SENSITIVE_PARAMS;
    private static _proxyUrls;
    private static _httpClient;
    private static _debugMode;
    private static readonly MAX_REDIRECTS;
    private static _attemptedUrls;
    /** Tenant-specific Azure Function proxy configuration */
    private static _tenantProxy;
    /**
     * Sanitize a URL for safe logging by masking sensitive parameters
     * This prevents accidental exposure of API keys, function codes, and tokens
     * @param url The URL to sanitize
     * @returns The URL with sensitive parameter values replaced with '***'
     */
    static sanitizeUrlForLogging(url: string): string;
    static setDebugMode(enable: boolean): void;
    static init(httpClient: HttpClient): void;
    /**
     * Configure tenant-specific Azure Function proxy
     * This proxy will be used as the primary proxy before falling back to public proxies
     */
    static setTenantProxy(config: ITenantProxyConfig | null): void;
    /**
     * Get the currently configured tenant proxy
     */
    static getTenantProxy(): ITenantProxyConfig | null;
    /**
     * Test the tenant proxy health endpoint
     * Returns the health status or null if the proxy is not configured or unreachable
     */
    static testTenantProxy(): Promise<IProxyHealthResponse | null>;
    /**
     * Build the full proxy URL for the tenant proxy
     */
    private static buildTenantProxyUrl;
    static addProxyUrl(url: string): void;
    static resetProxyUrls(): void;
    private static extractAuthParams;
    private static logError;
    static fetch(url: string, options?: RequestInit): Promise<Response>;
    private static _fetchWithRedirectHandling;
    private static fetchWithRetry;
    static fetchWithFirstProxy(url: string, options?: RequestInit): Promise<Response>;
}
//# sourceMappingURL=proxyService.d.ts.map