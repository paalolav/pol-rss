/**
 * RSS Debug Utils Tests
 *
 * Tests for debug utilities including XSS prevention.
 * @see REF-019-SECURITY-FIXES.md ST-019-01
 */
import { RssDebugUtils } from '../../src/webparts/polRssGallery/utils/rssDebugUtils';

describe('RssDebugUtils', () => {
  describe('Debug Mode', () => {
    beforeEach(() => {
      RssDebugUtils.setDebugMode(false);
    });

    it('should start with debug mode disabled', () => {
      expect(RssDebugUtils.isDebugEnabled()).toBe(false);
    });

    it('should enable debug mode', () => {
      RssDebugUtils.setDebugMode(true);
      expect(RssDebugUtils.isDebugEnabled()).toBe(true);
    });

    it('should disable debug mode', () => {
      RssDebugUtils.setDebugMode(true);
      RssDebugUtils.setDebugMode(false);
      expect(RssDebugUtils.isDebugEnabled()).toBe(false);
    });
  });

  describe('Logging', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      RssDebugUtils.setDebugMode(false);
    });

    it('should not log when debug mode is disabled', () => {
      RssDebugUtils.setDebugMode(false);
      RssDebugUtils.log('test message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log when debug mode is enabled', () => {
      RssDebugUtils.setDebugMode(true);
      RssDebugUtils.log('test message');
      expect(consoleSpy).toHaveBeenCalledWith('test message');
    });
  });

  describe('Warning', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      RssDebugUtils.setDebugMode(false);
    });

    it('should not warn when debug mode is disabled', () => {
      RssDebugUtils.setDebugMode(false);
      RssDebugUtils.warn('test warning');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should warn when debug mode is enabled', () => {
      RssDebugUtils.setDebugMode(true);
      RssDebugUtils.warn('test warning');
      expect(consoleSpy).toHaveBeenCalledWith('test warning');
    });
  });

  describe('Error', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      RssDebugUtils.setDebugMode(false);
    });

    it('should not log errors when debug mode is disabled', () => {
      RssDebugUtils.setDebugMode(false);
      RssDebugUtils.error('test error');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log errors when debug mode is enabled', () => {
      RssDebugUtils.setDebugMode(true);
      RssDebugUtils.error('test error');
      expect(consoleSpy).toHaveBeenCalledWith('test error');
    });
  });

  describe('Debug Console XSS Prevention', () => {
    let container: HTMLElement;

    beforeEach(() => {
      // Create a mock container
      container = document.createElement('div');
      document.body.appendChild(container);
      RssDebugUtils.setDebugMode(true);
    });

    afterEach(() => {
      RssDebugUtils.setDebugMode(false);
      document.body.innerHTML = '';
    });

    it('should create debug console when debug mode is enabled', () => {
      RssDebugUtils.createDebugConsole(container);
      const debugConsole = document.getElementById('rss-debug-console');
      expect(debugConsole).not.toBeNull();
    });

    it('should not create debug console when debug mode is disabled', () => {
      RssDebugUtils.setDebugMode(false);
      RssDebugUtils.createDebugConsole(container);
      const debugConsole = document.getElementById('rss-debug-console');
      expect(debugConsole).toBeNull();
    });

    it('should escape HTML in log messages to prevent XSS', () => {
      RssDebugUtils.createDebugConsole(container);

      // Try to inject XSS via log message
      const xssPayload = '<script>alert("XSS")</script>';
      RssDebugUtils.logToDebugConsole(xssPayload);

      const logContainer = document.getElementById('rss-debug-logs');
      expect(logContainer).not.toBeNull();

      // The script tag should be escaped, not executed
      expect(logContainer!.innerHTML).not.toContain('<script>');
      expect(logContainer!.textContent).toContain('<script>');
    });

    it('should escape event handlers in log messages', () => {
      RssDebugUtils.createDebugConsole(container);

      const xssPayload = '<img src=x onerror="alert(1)">';
      RssDebugUtils.logToDebugConsole(xssPayload);

      const logContainer = document.getElementById('rss-debug-logs');
      expect(logContainer).not.toBeNull();

      // Should not contain actual img element with onerror
      const imgElements = logContainer!.querySelectorAll('img');
      expect(imgElements.length).toBe(0);
    });

    it('should escape javascript: URLs in log messages', () => {
      RssDebugUtils.createDebugConsole(container);

      const xssPayload = '<a href="javascript:alert(1)">click me</a>';
      RssDebugUtils.logToDebugConsole(xssPayload);

      const logContainer = document.getElementById('rss-debug-logs');
      expect(logContainer).not.toBeNull();

      // Should not contain actual anchor with javascript: href
      const anchorElements = logContainer!.querySelectorAll('a[href^="javascript:"]');
      expect(anchorElements.length).toBe(0);
    });

    it('should preserve safe text content in log messages', () => {
      RssDebugUtils.createDebugConsole(container);

      const safeMessage = 'Feed loaded successfully with 10 items';
      RssDebugUtils.logToDebugConsole(safeMessage);

      const logContainer = document.getElementById('rss-debug-logs');
      expect(logContainer!.textContent).toContain(safeMessage);
    });

    it('should handle special characters without encoding issues', () => {
      RssDebugUtils.createDebugConsole(container);

      const norwegianMessage = 'Lastet inn nyheter fra Drøbak & Frogn';
      RssDebugUtils.logToDebugConsole(norwegianMessage);

      const logContainer = document.getElementById('rss-debug-logs');
      expect(logContainer!.textContent).toContain('Drøbak');
      expect(logContainer!.textContent).toContain('&');
    });
  });

  describe('Element Debug String', () => {
    it('should convert element to debug string', () => {
      const element = document.createElement('div');
      element.setAttribute('class', 'test-class');
      element.setAttribute('id', 'test-id');

      const debugStr = RssDebugUtils.elementToDebugString(element);

      expect(debugStr).toContain('<div');
      expect(debugStr).toContain('class="test-class"');
      expect(debugStr).toContain('id="test-id"');
    });

    it('should handle elements with children', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      child.textContent = 'Child content';
      parent.appendChild(child);

      const debugStr = RssDebugUtils.elementToDebugString(parent, 2, false);

      expect(debugStr).toContain('Children:');
      expect(debugStr).toContain('<span');
    });

    it('should respect maxDepth limit', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      const grandchild = document.createElement('a');
      child.appendChild(grandchild);
      parent.appendChild(child);

      const debugStr = RssDebugUtils.elementToDebugString(parent, 0, false);

      expect(debugStr).not.toContain('Children:');
    });
  });

  describe('Feed Analysis', () => {
    it('should analyze feed with items', () => {
      const items = [
        { id: '1', title: 'Test 1', link: 'http://test.com/1', description: 'Desc 1', pubDate: '2024-01-01', imageUrl: 'http://test.com/img1.jpg', categories: [] },
        { id: '2', title: 'Test 2', link: 'http://test.com/2', description: 'Desc 2', pubDate: '2024-01-02', imageUrl: '', categories: [] },
      ];

      const analysis = RssDebugUtils.analyzeRssFeed(items, 'http://test.com/feed');

      expect(analysis).toContain('Total items: 2');
      expect(analysis).toContain('Items with images: 1');
      expect(analysis).toContain('Items without images: 1');
    });

    it('should handle empty feed', () => {
      const analysis = RssDebugUtils.analyzeRssFeed([], 'http://test.com/feed');

      expect(analysis).toContain('No items found');
    });
  });

  describe('debugRssItem Performance (REF-021-04)', () => {
    /**
     * Helper to create a complex RSS item element with many children
     * Simulates a real-world RSS item with media elements
     */
    function createComplexRssItem(childCount: number): Element {
      const item = document.createElement('item');

      // Add standard RSS elements
      const title = document.createElement('title');
      title.textContent = 'Test Article Title';
      item.appendChild(title);

      const link = document.createElement('link');
      link.textContent = 'https://example.com/article';
      item.appendChild(link);

      const description = document.createElement('description');
      description.textContent = 'This is a test description with some content.';
      item.appendChild(description);

      const pubDate = document.createElement('pubDate');
      pubDate.textContent = 'Sat, 30 Nov 2025 12:00:00 GMT';
      item.appendChild(pubDate);

      // Add media elements (these are what debugRssItem looks for)
      for (let i = 0; i < Math.floor(childCount / 4); i++) {
        const mediaContent = document.createElement('media:content');
        mediaContent.setAttribute('url', `https://example.com/image${i}.jpg`);
        mediaContent.setAttribute('type', 'image/jpeg');
        mediaContent.setAttribute('width', '800');
        mediaContent.setAttribute('height', '600');
        item.appendChild(mediaContent);

        const mediaThumbnail = document.createElement('media:thumbnail');
        mediaThumbnail.setAttribute('url', `https://example.com/thumb${i}.jpg`);
        item.appendChild(mediaThumbnail);
      }

      // Add nested content elements
      for (let i = 0; i < Math.floor(childCount / 2); i++) {
        const div = document.createElement('div');
        div.setAttribute('class', `content-block-${i}`);

        const img = document.createElement('img');
        img.setAttribute('src', `https://example.com/content-img${i}.png`);
        img.setAttribute('alt', `Image ${i}`);
        div.appendChild(img);

        const span = document.createElement('span');
        span.textContent = `Content block ${i}`;
        div.appendChild(span);

        item.appendChild(div);
      }

      return item;
    }

    it('should call getElementsByTagName only once (cached)', () => {
      const item = createComplexRssItem(20);
      const spy = jest.spyOn(item, 'getElementsByTagName');

      RssDebugUtils.debugRssItem(item);

      // Should only call getElementsByTagName('*') ONCE due to caching
      const starCalls = spy.mock.calls.filter(call => call[0] === '*');
      expect(starCalls.length).toBe(1);

      spy.mockRestore();
    });

    it('should return correct debug output with cached elements', () => {
      const item = createComplexRssItem(10);

      const debug = RssDebugUtils.debugRssItem(item);

      // Verify the output contains expected sections
      expect(debug).toContain('Item tag name: ITEM');
      expect(debug).toContain('Child elements');
      expect(debug).toContain('Media elements');
      // Note: JSDOM uppercases tag names, so we check for uppercase
      expect(debug.toUpperCase()).toContain('MEDIA:CONTENT');
      expect(debug.toUpperCase()).toContain('MEDIA:THUMBNAIL');
    });

    it('should find all media elements correctly', () => {
      const item = createComplexRssItem(20);

      const debug = RssDebugUtils.debugRssItem(item);

      // Should find media:content and media:thumbnail elements
      expect(debug).toContain('Media elements (10)'); // 5 media:content + 5 media:thumbnail
    });

    it('should find potential image URLs in attributes', () => {
      const item = createComplexRssItem(10);

      const debug = RssDebugUtils.debugRssItem(item);

      // Should find image URLs from both media elements and img tags
      expect(debug).toContain('Potential image URLs');
      expect(debug).toContain('.jpg');
      expect(debug).toContain('.png');
    });

    it('should handle items with no media elements', () => {
      const item = document.createElement('item');
      const title = document.createElement('title');
      title.textContent = 'Simple article';
      item.appendChild(title);

      const debug = RssDebugUtils.debugRssItem(item);

      expect(debug).toContain('Media elements (0)');
    });

    it('should handle null item gracefully', () => {
      const debug = RssDebugUtils.debugRssItem(null as unknown as Element);

      expect(debug).toBe('No item provided');
    });

    it('should perform efficiently with large items (benchmark)', () => {
      // Create a complex item with 100 child elements
      const item = createComplexRssItem(100);

      const startTime = performance.now();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        RssDebugUtils.debugRssItem(item);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      // With caching, each call should take less than 5ms on average
      // Without caching, it would be roughly double due to duplicate DOM traversal
      expect(avgTime).toBeLessThan(5);

      // Log for debugging (won't show in normal test output)
      // console.log(`Average debugRssItem time: ${avgTime.toFixed(3)}ms`);
    });
  });
});
