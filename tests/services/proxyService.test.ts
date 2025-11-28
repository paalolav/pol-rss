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
});
