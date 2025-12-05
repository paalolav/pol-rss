/**
 * Console Errors Investigation
 *
 * Captures and analyzes console errors from the deployed SharePoint page
 * to identify issues that need fixing.
 */

import { test, expect } from '@playwright/test';

const PAGE_URL = 'https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx';

interface ConsoleMessage {
  type: string;
  text: string;
  location?: string;
}

test.describe('Webpart Error Assertions (TDD)', () => {
  /**
   * TDD Test: This test MUST pass - our webpart should not cause any console errors
   */
  test('RSS webpart should not produce console errors', async ({ page }) => {
    const webpartErrors: ConsoleMessage[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text().toLowerCase();
        const location = msg.location()?.url?.toLowerCase() || '';

        // Check if error is from our webpart
        const isOurWebpart =
          text.includes('rss') ||
          text.includes('feed') ||
          text.includes('polrssgallery') ||
          text.includes('pol-rss') ||
          location.includes('pol-rss') ||
          location.includes('polrssgallery');

        // Exclude known SharePoint/Microsoft errors AND expected CORS errors
        const isSharePointError =
          location.includes('res.cdn.office.net') ||
          location.includes('sharepoint.com/_') ||
          text.includes('string map is empty') ||
          text.includes('mime type') ||
          text.includes('polstyler');

        // CORS errors are expected - the webpart tries direct fetch first, then falls back to proxy
        const isExpectedCorsError =
          text.includes('cors') ||
          text.includes('access-control-allow-origin') ||
          text.includes('net::err_failed');

        if (isOurWebpart && !isSharePointError && !isExpectedCorsError) {
          webpartErrors.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location()?.url
          });
        }
      }
    });

    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    // This assertion will FAIL if our webpart produces errors
    if (webpartErrors.length > 0) {
      console.log('\n=== WEBPART ERRORS (FAILING) ===');
      webpartErrors.forEach((err, i) => {
        console.log(`[${i + 1}] ${err.text}`);
        console.log(`    Source: ${err.location}`);
      });
    }

    expect(webpartErrors.length, `Webpart produced ${webpartErrors.length} console errors`).toBe(0);
  });

  /**
   * Informational: Track CORS errors (expected behavior, not a failure)
   * These occur when direct fetch fails and proxy fallback is used
   */
  test('report expected CORS errors from proxy fallback', async ({ page }) => {
    const corsErrors: ConsoleMessage[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text().toLowerCase();
        if (text.includes('cors') || text.includes('access-control-allow-origin') || text.includes('net::err_failed')) {
          corsErrors.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location()?.url
          });
        }
      }
    });

    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Log CORS errors for visibility (these are expected, not failures)
    console.log(`\n=== EXPECTED CORS ERRORS (proxy fallback) ===`);
    console.log(`Count: ${corsErrors.length}`);
    corsErrors.forEach((err, i) => {
      // Extract feed URL from error message
      const feedMatch = err.text.match(/fetch at '([^']+)'/);
      const feedUrl = feedMatch ? feedMatch[1] : 'unknown';
      console.log(`  ${i + 1}. Feed: ${feedUrl}`);
    });

    // This test always passes - it's informational
    // CORS errors are expected when feeds don't support CORS headers
    expect(true).toBe(true);
  });

  /**
   * TDD Test: Webpart should not cause uncaught exceptions
   */
  test('RSS webpart should not throw uncaught exceptions', async ({ page }) => {
    const pageErrors: Error[] = [];

    page.on('pageerror', (error) => {
      // Check if error stack mentions our webpart
      const stack = error.stack?.toLowerCase() || '';
      const message = error.message.toLowerCase();

      if (stack.includes('pol-rss') ||
          stack.includes('polrssgallery') ||
          message.includes('rss') ||
          message.includes('feed')) {
        pageErrors.push(error);
      }
    });

    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    if (pageErrors.length > 0) {
      console.log('\n=== PAGE ERRORS FROM WEBPART (FAILING) ===');
      pageErrors.forEach((err, i) => {
        console.log(`[${i + 1}] ${err.message}`);
        console.log(`    Stack: ${err.stack?.substring(0, 500)}`);
      });
    }

    expect(pageErrors.length, `Webpart threw ${pageErrors.length} uncaught exceptions`).toBe(0);
  });

  /**
   * TDD Test: No memory leaks from webpart interactions
   */
  test('RSS webpart should not leak memory during interactions', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Get initial memory
    const getHeapSize = async (): Promise<number | null> => {
      return await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return null;
      });
    };

    const initialHeap = await getHeapSize();

    // Perform repeated interactions
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      // Hover gallery items
      const items = page.locator('[class*="galleryItem"]');
      const count = await items.count();
      for (let j = 0; j < Math.min(count, 3); j++) {
        await items.nth(j).hover().catch(() => {});
        await page.waitForTimeout(100);
      }
    }

    const finalHeap = await getHeapSize();

    if (initialHeap && finalHeap) {
      const increase = finalHeap - initialHeap;
      const increaseMB = Math.round(increase / 1024 / 1024);

      console.log(`Memory: ${Math.round(initialHeap / 1024 / 1024)}MB -> ${Math.round(finalHeap / 1024 / 1024)}MB (+${increaseMB}MB)`);

      // Allow up to 20MB increase (normal for page interactions)
      // Fail if >50MB increase (likely memory leak)
      expect(increaseMB, `Memory increased by ${increaseMB}MB - possible leak`).toBeLessThan(50);
    }
  });
});

test.describe('Console Error Investigation', () => {
  test('capture all console messages from page load', async ({ page }) => {
    const consoleMessages: ConsoleMessage[] = [];
    const errors: ConsoleMessage[] = [];
    const warnings: ConsoleMessage[] = [];

    // Listen for console messages
    page.on('console', (msg) => {
      const message: ConsoleMessage = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url
      };

      consoleMessages.push(message);

      if (msg.type() === 'error') {
        errors.push(message);
      } else if (msg.type() === 'warning') {
        warnings.push(message);
      }
    });

    // Listen for page errors (uncaught exceptions)
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error);
    });

    // Navigate and wait for full load
    console.log(`Navigating to: ${PAGE_URL}`);
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait additional time for dynamic content
    await page.waitForTimeout(5000);

    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Report findings
    console.log('\n=== CONSOLE ERRORS ===');
    console.log(`Total errors: ${errors.length}`);
    errors.forEach((err, i) => {
      console.log(`\n[ERROR ${i + 1}]`);
      console.log(`  Text: ${err.text.substring(0, 500)}`);
      if (err.location) console.log(`  Source: ${err.location}`);
    });

    console.log('\n=== CONSOLE WARNINGS ===');
    console.log(`Total warnings: ${warnings.length}`);
    warnings.forEach((warn, i) => {
      console.log(`\n[WARNING ${i + 1}]`);
      console.log(`  Text: ${warn.text.substring(0, 300)}`);
    });

    console.log('\n=== PAGE ERRORS (Uncaught Exceptions) ===');
    console.log(`Total page errors: ${pageErrors.length}`);
    pageErrors.forEach((err, i) => {
      console.log(`\n[PAGE ERROR ${i + 1}]`);
      console.log(`  Message: ${err.message}`);
      console.log(`  Stack: ${err.stack?.substring(0, 500)}`);
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Page errors: ${pageErrors.length}`);

    // Group errors by type/pattern
    const errorPatterns: Map<string, number> = new Map();
    errors.forEach(err => {
      // Extract error pattern (first line or first 100 chars)
      const pattern = err.text.split('\n')[0].substring(0, 100);
      errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
    });

    if (errorPatterns.size > 0) {
      console.log('\n=== ERROR PATTERNS ===');
      errorPatterns.forEach((count, pattern) => {
        console.log(`  [${count}x] ${pattern}`);
      });
    }

    // Take screenshot for reference
    await page.screenshot({ path: 'test-results/e2e/console-errors-page.png', fullPage: true });
  });

  test('identify RSS webpart specific errors', async ({ page }) => {
    const rssErrors: ConsoleMessage[] = [];
    const networkErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter for RSS-related errors
        if (text.toLowerCase().includes('rss') ||
            text.toLowerCase().includes('feed') ||
            text.toLowerCase().includes('cors') ||
            text.toLowerCase().includes('proxy') ||
            text.toLowerCase().includes('polrssgallery') ||
            text.toLowerCase().includes('pol-rss')) {
          rssErrors.push({
            type: msg.type(),
            text: text,
            location: msg.location()?.url
          });
        }
      }
    });

    // Listen for failed network requests
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    console.log('\n=== RSS WEBPART SPECIFIC ERRORS ===');
    console.log(`Found ${rssErrors.length} RSS-related errors`);
    rssErrors.forEach((err, i) => {
      console.log(`\n[RSS ERROR ${i + 1}]`);
      console.log(`  ${err.text}`);
    });

    console.log('\n=== FAILED NETWORK REQUESTS ===');
    console.log(`Found ${networkErrors.length} failed requests`);
    networkErrors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  });

  test('check for React/JavaScript errors', async ({ page }) => {
    const reactErrors: string[] = [];
    const jsErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('React') || text.includes('Warning:') || text.includes('component')) {
          reactErrors.push(text);
        } else if (text.includes('TypeError') || text.includes('ReferenceError') ||
                   text.includes('SyntaxError') || text.includes('undefined')) {
          jsErrors.push(text);
        }
      }
    });

    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);

    console.log('\n=== REACT ERRORS/WARNINGS ===');
    reactErrors.forEach((err, i) => console.log(`${i + 1}. ${err.substring(0, 300)}`));

    console.log('\n=== JAVASCRIPT ERRORS ===');
    jsErrors.forEach((err, i) => console.log(`${i + 1}. ${err.substring(0, 300)}`));
  });

  test('performance and resource loading check', async ({ page }) => {
    const largeResources: string[] = [];

    page.on('response', async (response) => {
      const url = response.url();

      // Check for large resources (>500KB)
      const headers = response.headers();
      const contentLength = headers['content-length'];
      if (contentLength && parseInt(contentLength) > 500000) {
        largeResources.push(`${url} - ${Math.round(parseInt(contentLength) / 1024)}KB`);
      }
    });

    const startTime = Date.now();
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    const loadTime = Date.now() - startTime;

    await page.waitForTimeout(2000);

    console.log('\n=== PERFORMANCE METRICS ===');
    console.log(`Page load time: ${loadTime}ms`);

    // Get performance metrics using Navigation Timing API
    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const nav = entries[0];
        return {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          domInteractive: Math.round(nav.domInteractive),
          loadComplete: Math.round(nav.loadEventEnd),
          resourceCount: performance.getEntriesByType('resource').length
        };
      }
      return {
        domContentLoaded: 0,
        domInteractive: 0,
        loadComplete: 0,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });

    console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`Load Complete: ${metrics.loadComplete}ms`);
    console.log(`Resource Count: ${metrics.resourceCount}`);

    if (largeResources.length > 0) {
      console.log('\n=== LARGE RESOURCES (>500KB) ===');
      largeResources.forEach(r => console.log(`  ${r}`));
    }
  });

  test('memory leak detection during interaction', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Get initial memory if available
    const getMemory = async () => {
      return await page.evaluate(() => {
        if ((performance as any).memory) {
          return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize
          };
        }
        return null;
      });
    };

    const initialMemory = await getMemory();

    // Perform interactions that might cause leaks
    for (let i = 0; i < 5; i++) {
      // Scroll up and down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      // Hover over gallery items if present
      const items = page.locator('[class*="galleryItem"]');
      const count = await items.count();
      for (let j = 0; j < Math.min(count, 3); j++) {
        await items.nth(j).hover().catch(() => {});
        await page.waitForTimeout(200);
      }
    }

    const finalMemory = await getMemory();

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      console.log('\n=== MEMORY USAGE ===');
      console.log(`Initial heap: ${Math.round(initialMemory.usedJSHeapSize / 1024 / 1024)}MB`);
      console.log(`Final heap: ${Math.round(finalMemory.usedJSHeapSize / 1024 / 1024)}MB`);
      console.log(`Increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);

      if (memoryIncrease > 10 * 1024 * 1024) { // >10MB increase
        console.log('WARNING: Significant memory increase detected - possible memory leak');
      }
    } else {
      console.log('Memory API not available in this browser context');
    }
  });
});
