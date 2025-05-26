import { HttpClient } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { RssSpecialFeedsHandler } from './rssSpecialFeedsHandler';

/**
 * Interface for authentication parameters extracted from URLs
 */
interface IAuthParams {
  cleanUrl: string;
  apiKey?: string; 
  otherParams: Record<string, string>;
}

/**
 * Service to fetch RSS feeds through a proxy when direct access is restricted due to CORS
 */
export class ProxyService {
  private static readonly LOG_SOURCE = 'ProxyService';
  private static readonly DEFAULT_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://crossorigin.me/'
  ];
  
  private static _proxyUrls: string[] = [...ProxyService.DEFAULT_PROXIES];
  private static _httpClient: HttpClient | null = null;
  private static _debugMode = false;
  private static readonly MAX_REDIRECTS = 5; // Maximum number of redirects to follow
  
  // Keep track of URLs we've already tried to avoid redirect loops
  private static _attemptedUrls = new Set<string>();
  
  /**
   * Enable or disable debug mode for detailed logging
   */
  public static setDebugMode(enable: boolean): void {
    ProxyService._debugMode = enable;
  }

  /**
   * Initialize the service with an HttpClient
   */
  public static init(httpClient: HttpClient): void {
    ProxyService._httpClient = httpClient;
  }
  
  /**
   * Add a custom proxy URL
   */
  public static addProxyUrl(url: string): void {
    if (!ProxyService._proxyUrls.includes(url)) {
      ProxyService._proxyUrls.unshift(url); // Add to beginning for priority
    }
  }
  
  /**
   * Reset proxy URLs to default
   */
  public static resetProxyUrls(): void {
    ProxyService._proxyUrls = [...ProxyService.DEFAULT_PROXIES];
  }
  
  /**
   * Extract API key and other authentication parameters from URL for special handling
   * This is useful for services like Meltwater that require specific authentication
   */
  private static extractAuthParams(url: string): IAuthParams {
    try {
      const parsedUrl = new URL(url);
      const apiKey = parsedUrl.searchParams.get('apiKey') || undefined;
      const otherParams: Record<string, string> = {};
      
      // Extract other potentially important authorization parameters
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
      // If URL parsing fails, return the original URL
      this.logError('extractAuthParams', error, url);
      return { cleanUrl: url, otherParams: {} };
    }
  }
  
  /**
   * Log errors in debug mode
   */
  private static logError(method: string, error: unknown, url: string): void {
    if (this._debugMode) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Log.warn(this.LOG_SOURCE, `${method} failed for ${url}: ${errorMessage}`);
      RssDebugUtils.warn(`ProxyService.${method} failed for ${url}: ${errorMessage}`);
    }
  }
  
  /**
   * Fetch content through available proxies, trying each one until successful
   * Enhanced to handle authentication parameters better and prevent redirect loops
   */
  public static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Reset attempted URLs for this new fetch operation
    this._attemptedUrls = new Set<string>();
    
    // Add original URL to attempted URLs to prevent immediate loops
    this._attemptedUrls.add(url);
    
    // Special handling for Meltwater feeds with known 403 issues
    if (RssSpecialFeedsHandler.isMeltwaterFeed(url)) {
      return this.fetchWithRetry(url, 3, options);
    }
    
    // Handle special URLs with authentication parameters
    const authInfo = this.extractAuthParams(url);
    const headersWithAuth = new Headers(options.headers || {});
    
    // Add API key as Authorization header if present in URL
    if (authInfo.apiKey) {
      headersWithAuth.set('Authorization', `Bearer ${authInfo.apiKey}`);
      headersWithAuth.set('X-API-Key', authInfo.apiKey);  // Common format for API key
    }
    
    // Merge options with auth headers
    const enhancedOptions = {
      ...options,
      headers: headersWithAuth,
      // Add redirect: 'manual' to handle redirects ourselves
      redirect: 'manual' as RequestRedirect
    };
    
    // First try direct fetch with enhanced options
    try {
      const directResponse = await this._fetchWithRedirectHandling(url, enhancedOptions);
      if (directResponse.ok) {
        if (this._debugMode) {
          RssDebugUtils.log(`Direct fetch succeeded for ${url}`);
        }
        return directResponse;
      }
      
      if (this._debugMode) {
        Log.info(this.LOG_SOURCE, `Direct fetch returned ${directResponse.status}, trying proxies.`);
        RssDebugUtils.log(`Direct fetch returned ${directResponse.status}, trying proxies.`);
      }
    } catch (error) {
      // Direct fetch failed, continue to proxies
      this.logError('directFetch', error, url);
    }
    
    // If direct fetch fails, try proxies
    for (const proxyUrl of ProxyService._proxyUrls) {
      try {
        // For proxies that support headers, we need to pass auth info differently
        const proxiedUrl = proxyUrl + encodeURIComponent(url);
        
        // Skip if we've already attempted this URL (to prevent loops)
        if (this._attemptedUrls.has(proxiedUrl)) {
          if (this._debugMode) {
            RssDebugUtils.warn(`Skipping already attempted proxy URL: ${proxiedUrl}`);
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
        // Proxy failed, continue to next proxy
        this.logError('proxyFetch', error, `${proxyUrl}${url}`);
      }
    }
    
    // Try with SP HttpClient for authenticated SharePoint environments
    if (ProxyService._httpClient) {
      try {
        // Use SP HttpClient with authentication
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
            RssDebugUtils.log(`SP HttpClient fetch succeeded for ${url}`);
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
        // SharePoint HttpClient failed, moving to the next option
        this.logError('spHttpClientFetch', error, url);
      }
    }
    
    // If all methods fail, throw error
    const errorMsg = `Failed to fetch ${url} after trying direct access and all available proxies`;
    Log.error(this.LOG_SOURCE, new Error(errorMsg));
    throw new Error(errorMsg);
  }
  
  /**
   * Helper method to handle redirects manually to prevent redirect loops
   */
  private static async _fetchWithRedirectHandling(url: string, options: RequestInit): Promise<Response> {
    let redirectCount = 0;
    let currentUrl = url;
    
    while (redirectCount < this.MAX_REDIRECTS) {
      const response = await fetch(currentUrl, options);
      
      // If it's not a redirect, return the response
      if (![301, 302, 303, 307, 308].includes(response.status)) {
        return response;
      }
      
      // Handle redirect
      const location = response.headers.get('location');
      if (!location) {
        // No redirect location header
        return response;
      }
      
      // Resolve relative URLs
      let redirectUrl: string;
      try {
        redirectUrl = new URL(location, currentUrl).href;
      } catch {
        redirectUrl = location;
      }
      
      // Check if we're in a redirect loop
      if (this._attemptedUrls.has(redirectUrl)) {
        if (this._debugMode) {
          RssDebugUtils.warn(`Detected redirect loop to already attempted URL: ${redirectUrl}`);
        }
        // Return the current response rather than going into an infinite loop
        return response;
      }
      
      // Add to attempted URLs and update for next fetch
      this._attemptedUrls.add(redirectUrl);
      currentUrl = redirectUrl;
      redirectCount++;
      
      if (this._debugMode) {
        RssDebugUtils.log(`Following redirect ${redirectCount}/${this.MAX_REDIRECTS} to: ${currentUrl}`);
      }
    }
    
    // If we've reached max redirects, throw an error
    throw new Error(`ERR_TOO_MANY_REDIRECTS: Maximum redirects (${this.MAX_REDIRECTS}) exceeded for ${url}`);
  }
  
  /**
   * Fetch with retry mechanism for handling intermittent failures like 403s
   * Particularly useful for Meltwater feeds that sometimes return 403
   */
  private static async fetchWithRetry(
    url: string, 
    maxRetries: number = 3, 
    options: RequestInit = {}
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    // Try different User-Agent headers which can help with some feeds
    const userAgentVariations = [
      'Mozilla/5.0 SharePoint RSS Reader',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    ];
    
    // Reset attempted URLs for this new fetch operation
    this._attemptedUrls = new Set<string>();
    this._attemptedUrls.add(url);
    
    // First attempt with various direct fetch options
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Create a new headers object for this attempt
        const headers = new Headers(options.headers || {});
        
        // Add a different User-Agent for each retry
        headers.set('User-Agent', userAgentVariations[i % userAgentVariations.length]);
        
        // Add common headers that might help
        headers.set('Accept', 'application/xml, text/xml, */*');
        
        // For Meltwater specifically, try different auth approaches
        if (RssSpecialFeedsHandler.isMeltwaterFeed(url)) {
          try {
            const urlObj = new URL(url);
            const apiKey = urlObj.searchParams.get('apiKey') || 
                          urlObj.searchParams.get('api_key');
            
            if (apiKey) {
              // Try different auth header formats
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
        
        // Try direct fetch with enhanced options, using our redirect handler
        const response = await this._fetchWithRedirectHandling(url, { 
          ...options, 
          headers,
          // Add cache busting for retries
          cache: 'no-store'
        });
        
        if (response.ok) {
          if (this._debugMode) {
            RssDebugUtils.log(`Direct fetch with retry ${i+1} succeeded for ${url}`);
          }
          return response;
        }
        
        if (this._debugMode) {
          RssDebugUtils.warn(`Direct fetch with retry ${i+1} returned ${response.status} for ${url}`);
        }
        
        lastError = new Error(`HTTP ${response.status} - ${response.statusText || 'Error'}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (this._debugMode) {
          RssDebugUtils.warn(`Direct fetch with retry ${i+1} failed: ${lastError.message}`);
        }
      }
      
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // If direct fetch with retries fails, try the main fetch method as fallback
    try {
      if (this._debugMode) {
        RssDebugUtils.log(`Falling back to proxy method after ${maxRetries} retries failed`);
      }
      
      // Call the main fetch method with default options
      // But don't recursively call fetchWithRetry
      const authInfo = this.extractAuthParams(url);
      const headersWithAuth = new Headers(options.headers || {});
      
      if (authInfo.apiKey) {
        headersWithAuth.set('Authorization', `Bearer ${authInfo.apiKey}`);
      }
      
      // Try proxies as last resort
      for (const proxyUrl of ProxyService._proxyUrls) {
        try {
          const proxiedUrl = proxyUrl + encodeURIComponent(url);
          
          // Skip if we've already tried this combination
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
          // Try next proxy
          lastError = proxyError instanceof Error ? proxyError : new Error(String(proxyError));
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
    
    // If all attempts fail, throw the last error
    throw lastError || new Error(`Failed to fetch ${url} after ${maxRetries} retries`);
  }
}
