import { HttpClient } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { RssSpecialFeedsHandler } from './rssSpecialFeedsHandler';

interface IAuthParams {
  cleanUrl: string;
  apiKey?: string;
  otherParams: Record<string, string>;
}

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

export class ProxyService {
  private static readonly LOG_SOURCE = 'ProxyService';
  private static readonly DEFAULT_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy/?quest='
  ];

  /**
   * Sensitive URL parameter names that should be masked in logs
   * Includes common patterns for API keys, tokens, and authentication credentials
   */
  private static readonly SENSITIVE_PARAMS = [
    'code',           // Azure Function key
    'apikey',         // Common API key parameter
    'api_key',        // Alternative API key format
    'key',            // Generic key parameter
    'token',          // Auth tokens
    'access_token',   // OAuth access tokens
    'auth',           // Auth credentials
    'secret',         // Client secrets
    'password'        // Passwords
  ];

  private static _proxyUrls: string[] = [...ProxyService.DEFAULT_PROXIES];
  private static _httpClient: HttpClient | null = null;
  private static _debugMode = false;
  private static readonly MAX_REDIRECTS = 5;

  private static _attemptedUrls = new Set<string>();

  /** Tenant-specific Azure Function proxy configuration */
  private static _tenantProxy: ITenantProxyConfig | null = null;

  /**
   * Sanitize a URL for safe logging by masking sensitive parameters
   * This prevents accidental exposure of API keys, function codes, and tokens
   * @param url The URL to sanitize
   * @returns The URL with sensitive parameter values replaced with '***'
   */
  public static sanitizeUrlForLogging(url: string): string {
    try {
      const parsed = new URL(url);
      let hasChanges = false;

      // Check each parameter against our sensitive list
      parsed.searchParams.forEach((value, key) => {
        const keyLower = key.toLowerCase();
        if (this.SENSITIVE_PARAMS.includes(keyLower)) {
          parsed.searchParams.set(key, '***');
          hasChanges = true;
        }
      });

      return hasChanges ? parsed.toString() : url;
    } catch {
      // If URL parsing fails, return as-is (might be a partial URL)
      return url;
    }
  }

  public static setDebugMode(enable: boolean): void {
    ProxyService._debugMode = enable;
  }

  public static init(httpClient: HttpClient): void {
    ProxyService._httpClient = httpClient;
  }

  /**
   * Configure tenant-specific Azure Function proxy
   * This proxy will be used as the primary proxy before falling back to public proxies
   */
  public static setTenantProxy(config: ITenantProxyConfig | null): void {
    ProxyService._tenantProxy = config;
    if (config && this._debugMode) {
      RssDebugUtils.log(`Tenant proxy configured: ${config.proxyUrl}`);
    }
  }

  /**
   * Get the currently configured tenant proxy
   */
  public static getTenantProxy(): ITenantProxyConfig | null {
    return ProxyService._tenantProxy;
  }

  /**
   * Test the tenant proxy health endpoint
   * Returns the health status or null if the proxy is not configured or unreachable
   */
  public static async testTenantProxy(): Promise<IProxyHealthResponse | null> {
    if (!ProxyService._tenantProxy) {
      return null;
    }

    try {
      // Derive health endpoint from proxy URL (replace /proxy with /health)
      const healthUrl = ProxyService._tenantProxy.proxyUrl.replace(/\/proxy\/?$/, '/health');

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (this._debugMode) {
          RssDebugUtils.warn(`Tenant proxy health check failed: ${response.status}`);
        }
        return null;
      }

      const health = await response.json() as IProxyHealthResponse;

      if (this._debugMode) {
        RssDebugUtils.log(`Tenant proxy health: ${health.status}, version: ${health.version}`);
      }

      return health;
    } catch (error) {
      if (this._debugMode) {
        const msg = error instanceof Error ? error.message : String(error);
        RssDebugUtils.warn(`Tenant proxy health check error: ${msg}`);
      }
      return null;
    }
  }

  /**
   * Build the full proxy URL for the tenant proxy
   */
  private static buildTenantProxyUrl(targetUrl: string): string | null {
    if (!ProxyService._tenantProxy) {
      return null;
    }

    const { proxyUrl, functionKey } = ProxyService._tenantProxy;
    const separator = proxyUrl.includes('?') ? '&' : '?';
    return `${proxyUrl}${separator}code=${functionKey}&url=${encodeURIComponent(targetUrl)}`;
  }

  public static addProxyUrl(url: string): void {
    if (!ProxyService._proxyUrls.includes(url)) {
      ProxyService._proxyUrls.unshift(url);
    }
  }

  public static resetProxyUrls(): void {
    ProxyService._proxyUrls = [...ProxyService.DEFAULT_PROXIES];
  }
  
  private static extractAuthParams(url: string): IAuthParams {
    try {
      const parsedUrl = new URL(url);
      const apiKey = parsedUrl.searchParams.get('apiKey') || undefined;
      const otherParams: Record<string, string> = {};
      
      parsedUrl.searchParams.forEach((value, key) => {
        if (key !== 'apiKey' && (
          key.toLowerCase().includes('auth') || 
          key.toLowerCase().includes('key') || 
          key.toLowerCase().includes('token')
        )) {
          otherParams[key] = value;
        }
      });
      
      return { cleanUrl: parsedUrl.toString(), apiKey, otherParams };
    } catch (error) {
      this.logError('extractAuthParams', error, url);
      return { cleanUrl: url, otherParams: {} };
    }
  }
  
  private static logError(method: string, error: unknown, url: string): void {
    if (this._debugMode) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const safeUrl = this.sanitizeUrlForLogging(url);
      Log.warn(this.LOG_SOURCE, `${method} failed for ${safeUrl}: ${errorMessage}`);
      RssDebugUtils.warn(`ProxyService.${method} failed for ${safeUrl}: ${errorMessage}`);
    }
  }
  
  public static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    this._attemptedUrls = new Set<string>();
    this._attemptedUrls.add(url);

    // API feeds benefit from retry mechanism with different auth strategies
    if (RssSpecialFeedsHandler.isApiFeed(url)) {
      return this.fetchWithRetry(url, 3, options);
    }

    const authInfo = this.extractAuthParams(url);
    const headersWithAuth = new Headers(options.headers || {});

    if (authInfo.apiKey) {
      headersWithAuth.set('Authorization', `Bearer ${authInfo.apiKey}`);
      headersWithAuth.set('X-API-Key', authInfo.apiKey);
    }

    const enhancedOptions = {
      ...options,
      headers: headersWithAuth,
      redirect: 'manual' as RequestRedirect
    };

    // 1. Try direct fetch first
    try {
      const directResponse = await this._fetchWithRedirectHandling(url, enhancedOptions);
      if (directResponse.ok) {
        if (this._debugMode) {
          RssDebugUtils.log(`Direct fetch succeeded for ${this.sanitizeUrlForLogging(url)}`);
        }
        return directResponse;
      }

      if (this._debugMode) {
        Log.info(this.LOG_SOURCE, `Direct fetch returned ${directResponse.status}, trying proxies.`);
        RssDebugUtils.log(`Direct fetch returned ${directResponse.status}, trying proxies.`);
      }
    } catch (error) {
      this.logError('directFetch', error, url);
    }

    // 2. Try tenant proxy if configured (primary proxy)
    if (ProxyService._tenantProxy) {
      try {
        const tenantProxyUrl = this.buildTenantProxyUrl(url);
        if (tenantProxyUrl && !this._attemptedUrls.has(tenantProxyUrl)) {
          this._attemptedUrls.add(tenantProxyUrl);

          if (this._debugMode) {
            RssDebugUtils.log(`Trying tenant proxy: ${ProxyService._tenantProxy.proxyUrl}`);
          }

          const response = await this._fetchWithRedirectHandling(tenantProxyUrl, {
            ...options,
            headers: headersWithAuth,
            redirect: 'follow' as RequestRedirect
          });

          if (response.ok) {
            if (this._debugMode) {
              RssDebugUtils.log(`Tenant proxy fetch succeeded`);
            }
            return response;
          }

          if (this._debugMode) {
            Log.info(this.LOG_SOURCE, `Tenant proxy returned ${response.status}.`);
            RssDebugUtils.log(`Tenant proxy returned ${response.status}, trying fallback proxies.`);
          }
        }
      } catch (error) {
        this.logError('tenantProxyFetch', error, url);
      }
    }

    // 3. Try fallback public proxies
    for (const proxyUrl of ProxyService._proxyUrls) {
      try {
        const proxiedUrl = proxyUrl + encodeURIComponent(url);

        if (this._attemptedUrls.has(proxiedUrl)) {
          if (this._debugMode) {
            RssDebugUtils.warn(`Skipping already attempted proxy URL: ${this.sanitizeUrlForLogging(proxiedUrl)}`);
          }
          continue;
        }

        this._attemptedUrls.add(proxiedUrl);
        const response = await this._fetchWithRedirectHandling(proxiedUrl, enhancedOptions);

        if (response.ok) {
          if (this._debugMode) {
            RssDebugUtils.log(`Proxy fetch succeeded with ${proxyUrl}`);
          }
          return response;
        }

        if (this._debugMode) {
          Log.info(this.LOG_SOURCE, `Proxy ${proxyUrl} returned ${response.status}.`);
          RssDebugUtils.log(`Proxy ${proxyUrl} returned ${response.status}.`);
        }
      } catch (error) {
        this.logError('proxyFetch', error, `${proxyUrl}${url}`);
      }
    }
    
    if (ProxyService._httpClient) {
      try {
        const headers: HeadersInit = {};
        if (authInfo.apiKey) {
          headers['Authorization'] = `Bearer ${authInfo.apiKey}`;
          headers['X-API-Key'] = authInfo.apiKey;
        }
        
        const response = await ProxyService._httpClient.fetch(url, HttpClient.configurations.v1, {
          method: options.method || 'GET',
          headers: headers
        });
        
        if (response.ok) {
          if (this._debugMode) {
            RssDebugUtils.log(`SP HttpClient fetch succeeded for ${this.sanitizeUrlForLogging(url)}`);
          }
          
          // Convert SPHttpClient response to standard Response
          const responseText = await response.text();
          
          // Create headers object without using 'as any'
          const responseHeaders = new Headers();
          
          // Copy headers more safely
          if (response.headers) {
            Object.entries(response.headers).forEach(([key, value]) => {
              if (typeof value === 'string') {
                responseHeaders.append(key, value);
              }
            });
          }
          
          return new Response(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
          });
        }
        
        if (this._debugMode) {
          Log.info(this.LOG_SOURCE, `SP HttpClient returned ${response.status}.`);
          RssDebugUtils.log(`SP HttpClient returned ${response.status}.`);
        }
      } catch (error) {
        this.logError('spHttpClientFetch', error, url);
      }
    }
    
    const errorMsg = `Failed to fetch ${this.sanitizeUrlForLogging(url)} after trying direct access and all available proxies`;
    Log.error(this.LOG_SOURCE, new Error(errorMsg));
    throw new Error(errorMsg);
  }
  
  private static async _fetchWithRedirectHandling(url: string, options: RequestInit): Promise<Response> {
    let redirectCount = 0;
    let currentUrl = url;
    
    while (redirectCount < this.MAX_REDIRECTS) {
      const response = await fetch(currentUrl, options);
      
      if (![301, 302, 303, 307, 308].includes(response.status)) {
        return response;
      }
      
      const location = response.headers.get('location');
      if (!location) {
        return response;
      }
      
      let redirectUrl: string;
      try {
        redirectUrl = new URL(location, currentUrl).href;
      } catch {
        redirectUrl = location;
      }
      
      if (this._attemptedUrls.has(redirectUrl)) {
        if (this._debugMode) {
          RssDebugUtils.warn(`Detected redirect loop to already attempted URL: ${this.sanitizeUrlForLogging(redirectUrl)}`);
        }
        return response;
      }

      this._attemptedUrls.add(redirectUrl);
      currentUrl = redirectUrl;
      redirectCount++;

      if (this._debugMode) {
        RssDebugUtils.log(`Following redirect ${redirectCount}/${this.MAX_REDIRECTS} to: ${this.sanitizeUrlForLogging(currentUrl)}`);
      }
    }

    throw new Error(`ERR_TOO_MANY_REDIRECTS: Maximum redirects (${this.MAX_REDIRECTS}) exceeded for ${this.sanitizeUrlForLogging(url)}`);
  }
  
  private static async fetchWithRetry(
    url: string, 
    maxRetries: number = 3, 
    options: RequestInit = {}
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    const userAgentVariations = [
      'Mozilla/5.0 SharePoint RSS Reader',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    ];
    
    this._attemptedUrls = new Set<string>();
    this._attemptedUrls.add(url);
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const headers = new Headers(options.headers || {});
        headers.set('User-Agent', userAgentVariations[i % userAgentVariations.length]);
        headers.set('Accept', 'application/xml, text/xml, */*');
        
        // For API feeds, try different auth header strategies on each retry
        if (RssSpecialFeedsHandler.isApiFeed(url)) {
          try {
            const urlObj = new URL(url);
            const apiKey = urlObj.searchParams.get('apiKey') ||
                          urlObj.searchParams.get('api_key') ||
                          urlObj.searchParams.get('apikey');

            if (apiKey) {
              if (i === 0) {
                headers.set('Authorization', `Bearer ${apiKey}`);
              } else if (i === 1) {
                headers.set('X-API-Key', apiKey);
              } else {
                headers.set('apiKey', apiKey);
              }
            }
          } catch {
            // URL parsing failed, continue with basic headers
          }
        }
        
        const response = await this._fetchWithRedirectHandling(url, { 
          ...options, 
          headers,
          cache: 'no-store'
        });
        
        if (response.ok) {
          if (this._debugMode) {
            RssDebugUtils.log(`Direct fetch with retry ${i+1} succeeded for ${this.sanitizeUrlForLogging(url)}`);
          }
          return response;
        }

        if (this._debugMode) {
          RssDebugUtils.warn(`Direct fetch with retry ${i+1} returned ${response.status} for ${this.sanitizeUrlForLogging(url)}`);
        }
        
        lastError = new Error(`HTTP ${response.status} - ${response.statusText || 'Error'}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (this._debugMode) {
          RssDebugUtils.warn(`Direct fetch with retry ${i+1} failed: ${lastError.message}`);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    try {
      if (this._debugMode) {
        RssDebugUtils.log(`Falling back to proxy method after ${maxRetries} retries failed`);
      }
      
      const authInfo = this.extractAuthParams(url);
      const headersWithAuth = new Headers(options.headers || {});
      
      if (authInfo.apiKey) {
        headersWithAuth.set('Authorization', `Bearer ${authInfo.apiKey}`);
      }
      
      for (const proxyUrl of ProxyService._proxyUrls) {
        try {
          const proxiedUrl = proxyUrl + encodeURIComponent(url);
          
          if (this._attemptedUrls.has(proxiedUrl)) {
            continue;
          }
          
          this._attemptedUrls.add(proxiedUrl);
          const response = await this._fetchWithRedirectHandling(proxiedUrl, { 
            ...options, 
            headers: headersWithAuth
          });
          
          if (response.ok) {
            return response;
          }
        } catch (proxyError) {
          lastError = proxyError instanceof Error ? proxyError : new Error(String(proxyError));
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
    
    throw lastError || new Error(`Failed to fetch ${this.sanitizeUrlForLogging(url)} after ${maxRetries} retries`);
  }
  
  public static async fetchWithFirstProxy(url: string, options: RequestInit = {}): Promise<Response> {
    if (ProxyService._proxyUrls.length === 0) {
      throw new Error('No proxy URLs available');
    }
    
    const firstProxy = ProxyService._proxyUrls[0];
    const authInfo = this.extractAuthParams(url);
    const headersWithAuth = new Headers(options.headers || {});
    
    if (authInfo.apiKey) {
      headersWithAuth.set('Authorization', `Bearer ${authInfo.apiKey}`);
      headersWithAuth.set('X-API-Key', authInfo.apiKey);
    }
    
    const enhancedOptions = {
      ...options,
      headers: headersWithAuth,
      redirect: 'manual' as RequestRedirect
    };
    
    const proxiedUrl = firstProxy + encodeURIComponent(url);
    
    if (this._debugMode) {
      RssDebugUtils.log(`Trying first proxy: ${firstProxy}`);
    }
    
    const response = await this._fetchWithRedirectHandling(proxiedUrl, enhancedOptions);
    
    if (!response.ok) {
      throw new Error(`Proxy fetch failed: HTTP ${response.status} - ${response.statusText || 'Error'}`);
    }
    
    if (this._debugMode) {
      RssDebugUtils.log(`First proxy fetch succeeded`);
    }
    
    return response;
  }
}
