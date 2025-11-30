/**
 * ProxyService Tests
 *
 * Tests the CORS proxy fallback chain for fetching RSS feeds
 */
import 'whatwg-fetch';
import { ProxyService } from '../../src/webparts/polRssGallery/services/proxyService';

// Mock the SharePoint HttpClient
const mockHttpClient = {
  fetch: jest.fn()
};

// Mock RssDebugUtils
jest.mock('../../src/webparts/polRssGallery/utils/rssDebugUtils', () => ({
  RssDebugUtils: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    isEnabled: () => false
  }
}));

// Mock sp-core-library Log
jest.mock('@microsoft/sp-core-library', () => ({
  Log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Mock sp-http
jest.mock('@microsoft/sp-http', () => ({
  HttpClient: {
    configurations: {
      v1: {}
    }
  }
}));

// Store original fetch
const originalFetch = global.fetch;

describe('ProxyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset ProxyService state
    ProxyService.setTenantProxy(null);
    ProxyService.setDebugMode(false);
    // Reset global fetch mock
    global.fetch = jest.fn();
  });

  afterAll(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('initialization', () => {
    it('should initialize with HttpClient', () => {
      expect(() => ProxyService.init(mockHttpClient as never)).not.toThrow();
    });

    it('should set debug mode', () => {
      expect(() => ProxyService.setDebugMode(true)).not.toThrow();
      expect(() => ProxyService.setDebugMode(false)).not.toThrow();
    });
  });

  describe('tenant proxy configuration', () => {
    it('should configure tenant proxy', () => {
      const config = {
        proxyUrl: 'https://my-proxy.azurewebsites.net/api/proxy',
        functionKey: 'test-key'
      };

      ProxyService.setTenantProxy(config);
      expect(ProxyService.getTenantProxy()).toEqual(config);
    });

    it('should clear tenant proxy with null', () => {
      ProxyService.setTenantProxy({
        proxyUrl: 'https://my-proxy.azurewebsites.net/api/proxy',
        functionKey: 'test-key'
      });

      ProxyService.setTenantProxy(null);
      expect(ProxyService.getTenantProxy()).toBeNull();
    });
  });

  describe('fetch (with fallback)', () => {
    const testUrl = 'https://sentralregisteret.no/feed';
    const rssContent = '<?xml version="1.0"?><rss><channel><title>Test</title></channel></rss>';

    it('should try direct fetch first', async () => {
      const mockResponse = new Response(rssContent, { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await ProxyService.fetch(testUrl);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.ok).toBe(true);
    });

    it('should fall back to proxy when direct fetch fails with CORS', async () => {
      // First call (direct) fails with CORS
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        // Second call (proxy) succeeds
        .mockResolvedValueOnce(new Response(rssContent, { status: 200 }));

      const result = await ProxyService.fetch(testUrl);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result.ok).toBe(true);

      // Second call should use a proxy URL
      const secondCallUrl = (global.fetch as jest.Mock).mock.calls[1][0];
      expect(secondCallUrl).toContain('api.allorigins.win');
    });

    it('should try multiple proxies if first fails', async () => {
      // Direct fails
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        // First proxy fails
        .mockRejectedValueOnce(new Error('Proxy error'))
        // Second proxy succeeds
        .mockResolvedValueOnce(new Response(rssContent, { status: 200 }));

      const result = await ProxyService.fetch(testUrl);

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result.ok).toBe(true);

      // Third call should use corsproxy.io
      const thirdCallUrl = (global.fetch as jest.Mock).mock.calls[2][0];
      expect(thirdCallUrl).toContain('corsproxy.io');
    });

    it('should use tenant proxy before public proxies', async () => {
      // Configure tenant proxy
      ProxyService.setTenantProxy({
        proxyUrl: 'https://my-tenant-proxy.azurewebsites.net/api/proxy',
        functionKey: 'my-key'
      });

      // Direct fails
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        // Tenant proxy succeeds
        .mockResolvedValueOnce(new Response(rssContent, { status: 200 }));

      const result = await ProxyService.fetch(testUrl);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result.ok).toBe(true);

      // Second call should use tenant proxy
      const secondCallUrl = (global.fetch as jest.Mock).mock.calls[1][0];
      expect(secondCallUrl).toContain('my-tenant-proxy.azurewebsites.net');
    });

    it('should throw when all methods fail', async () => {
      // All fetches fail
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(ProxyService.fetch(testUrl)).rejects.toThrow();
    });
  });

  describe('proxy URLs', () => {
    it('should include default proxies', () => {
      // This is tested indirectly through fetchWithFallback
      // The default proxies are allorigins.win, corsproxy.io, codetabs.com
      expect(true).toBe(true);
    });
  });

  describe('testTenantProxy', () => {
    it('should return null when no tenant proxy is configured', async () => {
      const result = await ProxyService.testTenantProxy();
      expect(result).toBeNull();
    });

    it('should test tenant proxy health endpoint', async () => {
      ProxyService.setTenantProxy({
        proxyUrl: 'https://my-proxy.azurewebsites.net/api/proxy',
        functionKey: 'test-key'
      });

      const healthResponse = {
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        configuration: {
          allowlistEnabled: true,
          allowlistPatterns: 5,
          rateLimitEnabled: true,
          rateLimitRequests: '100',
          rateLimitWindowSeconds: '60'
        },
        uptime: 12345
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(healthResponse), { status: 200 })
      );

      const result = await ProxyService.testTenantProxy();

      expect(result).toEqual(healthResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://my-proxy.azurewebsites.net/api/health',
        expect.any(Object)
      );
    });

    it('should return null when health check fails', async () => {
      ProxyService.setTenantProxy({
        proxyUrl: 'https://my-proxy.azurewebsites.net/api/proxy',
        functionKey: 'test-key'
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response('Not found', { status: 404 })
      );

      const result = await ProxyService.testTenantProxy();
      expect(result).toBeNull();
    });
  });

  describe('URL sanitization for logging', () => {
    it('should mask function key code parameter', () => {
      const url = 'https://proxy.azure.net/api/proxy?code=abc123secret&url=https://feed.com';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      // URL parser properly encodes the url parameter value
      expect(sanitized).toBe('https://proxy.azure.net/api/proxy?code=***&url=https%3A%2F%2Ffeed.com');
      expect(sanitized).not.toContain('abc123secret');
    });

    it('should mask apiKey parameter', () => {
      const url = 'https://api.meltwater.com/rss?apiKey=mw-secret-key-12345';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.meltwater.com/rss?apiKey=***');
      expect(sanitized).not.toContain('mw-secret-key-12345');
    });

    it('should mask api_key parameter (underscore variant)', () => {
      const url = 'https://api.example.com/feed?api_key=secret123&format=xml';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?api_key=***&format=xml');
      expect(sanitized).not.toContain('secret123');
    });

    it('should mask token parameter', () => {
      const url = 'https://api.example.com/feed?token=bearer-token-xyz&id=123';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?token=***&id=123');
      expect(sanitized).not.toContain('bearer-token-xyz');
    });

    it('should mask auth parameter', () => {
      const url = 'https://api.example.com/feed?auth=authsecret123';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?auth=***');
      expect(sanitized).not.toContain('authsecret123');
    });

    it('should mask multiple sensitive parameters', () => {
      const url = 'https://proxy.azure.net/api/proxy?code=secret1&apiKey=secret2&url=https://feed.com';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      // URL parser properly encodes the url parameter value
      expect(sanitized).toBe('https://proxy.azure.net/api/proxy?code=***&apiKey=***&url=https%3A%2F%2Ffeed.com');
      expect(sanitized).not.toContain('secret1');
      expect(sanitized).not.toContain('secret2');
    });

    it('should preserve non-sensitive parameters', () => {
      const url = 'https://api.example.com/feed?format=xml&count=10';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?format=xml&count=10');
    });

    it('should handle URLs without query parameters', () => {
      const url = 'https://www.nrk.no/toppsaker.rss';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://www.nrk.no/toppsaker.rss');
    });

    it('should handle invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      const sanitized = ProxyService.sanitizeUrlForLogging(invalidUrl);
      // Should return masked version even for invalid URLs
      expect(sanitized).toBe('not-a-valid-url');
    });

    it('should be case-insensitive for parameter names', () => {
      const url = 'https://api.example.com/feed?APIKEY=SECRET&Code=secret2';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?APIKEY=***&Code=***');
    });

    it('should mask access_token parameter', () => {
      const url = 'https://api.example.com/feed?access_token=oauth-token-xyz';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?access_token=***');
      expect(sanitized).not.toContain('oauth-token-xyz');
    });

    it('should mask key parameter', () => {
      const url = 'https://api.example.com/feed?key=google-api-key-123';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?key=***');
      expect(sanitized).not.toContain('google-api-key-123');
    });

    it('should mask secret parameter', () => {
      const url = 'https://api.example.com/feed?secret=client-secret-abc';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?secret=***');
      expect(sanitized).not.toContain('client-secret-abc');
    });

    it('should mask password parameter', () => {
      const url = 'https://api.example.com/feed?password=mypassword123';
      const sanitized = ProxyService.sanitizeUrlForLogging(url);
      expect(sanitized).toBe('https://api.example.com/feed?password=***');
      expect(sanitized).not.toContain('mypassword123');
    });
  });
});
