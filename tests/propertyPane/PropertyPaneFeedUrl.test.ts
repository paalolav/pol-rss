/**
 * PropertyPaneFeedUrl Tests
 *
 * Tests the custom property pane feed URL control with proxy fallback
 */
import 'whatwg-fetch';

// Mock ProxyService before importing the module
jest.mock('../../src/webparts/polRssGallery/services/proxyService', () => ({
  ProxyService: {
    fetch: jest.fn(),
    init: jest.fn(),
    setTenantProxy: jest.fn(),
    getTenantProxy: jest.fn(() => null),
    setDebugMode: jest.fn()
  }
}));

// Mock RssDebugUtils
jest.mock('../../src/webparts/polRssGallery/utils/rssDebugUtils', () => ({
  RssDebugUtils: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    isEnabled: () => false
  }
}));

// Mock feedValidator
jest.mock('../../src/webparts/polRssGallery/services/feedValidator', () => ({
  validateFeed: jest.fn(() => ({
    isValid: true,
    format: 'rss2',
    formatVersion: '2.0',
    errors: [],
    warnings: [],
    metadata: { title: 'Test Feed' }
  })),
  detectFeedFormat: jest.fn(() => 'rss2')
}));

// Mock ImprovedFeedParser
jest.mock('../../src/webparts/polRssGallery/services/improvedFeedParser', () => ({
  ImprovedFeedParser: {
    parse: jest.fn(() => [
      { id: '1', title: 'Item 1', link: 'https://example.com/1' },
      { id: '2', title: 'Item 2', link: 'https://example.com/2' }
    ])
  }
}));

// Mock FeedValidator
jest.mock('../../src/webparts/polRssGallery/components/FeedValidator', () => ({
  validateUrlFormat: jest.fn((url: string) => {
    if (!url) return { isValid: false, error: 'URL is required' };
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  })
}));

import { ProxyService } from '../../src/webparts/polRssGallery/services/proxyService';
import { PropertyPaneFeedUrl } from '../../src/webparts/polRssGallery/propertyPane/PropertyPaneFeedUrl';

describe('PropertyPaneFeedUrl', () => {
  const rssContent = '<?xml version="1.0"?><rss version="2.0"><channel><title>Test</title><item><title>Item 1</title></item></channel></rss>';
  let mockElement: HTMLElement;
  let mockOnPropertyChange: jest.Mock;
  let mockOnValidationChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock DOM element
    mockElement = document.createElement('div');
    mockOnPropertyChange = jest.fn();
    mockOnValidationChange = jest.fn();

    // Reset ProxyService mock
    (ProxyService.fetch as jest.Mock).mockReset();
  });

  describe('creation', () => {
    it('should create a property pane field', () => {
      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: '',
        onPropertyChange: mockOnPropertyChange
      });

      expect(field).toBeDefined();
      expect(field.targetProperty).toBe('feedUrl');
    });

    it('should have correct type', () => {
      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: '',
        onPropertyChange: mockOnPropertyChange
      });

      // PropertyPaneFieldType.Custom = 3
      expect(field.type).toBe(3);
    });
  });

  describe('rendering', () => {
    it('should render input and test button', () => {
      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://example.com/feed',
        onPropertyChange: mockOnPropertyChange
      });

      // Call onRender to render the control
      field.properties.onRender(mockElement, {}, jest.fn());

      const input = mockElement.querySelector('input');
      const testBtn = mockElement.querySelector('.ms-PropertyPaneFeedUrl-testBtn');

      expect(input).toBeDefined();
      expect(testBtn).toBeDefined();
    });

    it('should show initial value', () => {
      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://example.com/feed',
        onPropertyChange: mockOnPropertyChange
      });

      field.properties.onRender(mockElement, {}, jest.fn());

      const input = mockElement.querySelector('input') as HTMLInputElement;
      expect(input?.value).toBe('https://example.com/feed');
    });
  });

  describe('validation with ProxyService', () => {
    it('should use ProxyService.fetch for CORS-friendly fetching', async () => {
      // Setup ProxyService mock to succeed
      (ProxyService.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(rssContent, { status: 200 })
      );

      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://sentralregisteret.no/feed',
        onPropertyChange: mockOnPropertyChange,
        onValidationChange: mockOnValidationChange
      });

      field.properties.onRender(mockElement, {}, jest.fn());

      // Click the test button to trigger validation
      const testBtn = mockElement.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;
      testBtn?.click();

      // Wait for async validation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should have called ProxyService.fetch
      expect(ProxyService.fetch).toHaveBeenCalledWith(
        'https://sentralregisteret.no/feed',
        expect.any(Object)
      );
    });

    it('should handle CORS errors gracefully via ProxyService', async () => {
      // ProxyService will handle CORS internally
      (ProxyService.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(rssContent, { status: 200 })
      );

      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://nrk.no/rss',
        onPropertyChange: mockOnPropertyChange,
        onValidationChange: mockOnValidationChange
      });

      field.properties.onRender(mockElement, {}, jest.fn());

      const testBtn = mockElement.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;
      testBtn?.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      // ProxyService handles CORS internally
      expect(ProxyService.fetch).toHaveBeenCalled();
    });

    it('should show error when ProxyService fails', async () => {
      // All methods fail
      (ProxyService.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('All proxy methods failed')
      );

      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://invalid-feed.example.com/feed',
        onPropertyChange: mockOnPropertyChange,
        onValidationChange: mockOnValidationChange
      });

      field.properties.onRender(mockElement, {}, jest.fn());

      const testBtn = mockElement.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;
      testBtn?.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should show error status
      const statusEl = mockElement.querySelector('.ms-PropertyPaneFeedUrl-status');
      expect(statusEl?.classList.contains('invalid') || statusEl?.textContent?.includes('error')).toBeTruthy();
    });
  });

  describe('feed validation results', () => {
    it('should show valid status for valid feed', async () => {
      (ProxyService.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(rssContent, { status: 200 })
      );

      const field = PropertyPaneFeedUrl({
        key: 'feedUrl',
        label: 'Feed URL',
        value: 'https://example.com/feed.xml',
        onPropertyChange: mockOnPropertyChange,
        onValidationChange: mockOnValidationChange
      });

      field.properties.onRender(mockElement, {}, jest.fn());

      const testBtn = mockElement.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;
      testBtn?.click();

      await new Promise(resolve => setTimeout(resolve, 150));

      // Should call validation callback with valid result
      expect(mockOnValidationChange).toHaveBeenCalledWith(
        expect.objectContaining({
          status: expect.stringMatching(/valid|warning/),
          feedTitle: expect.any(String),
          itemCount: expect.any(Number)
        })
      );
    });
  });
});
