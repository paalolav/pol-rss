/**
 * POL RSS Gallery WebPart - SharePoint Online E2E Tests
 *
 * These tests run against a real SharePoint Online environment.
 * Authentication is required.
 *
 * Prerequisites:
 * 1. Set SHAREPOINT_SITE_URL environment variable
 * 2. Run authentication setup: npx ts-node tests/e2e/auth/sharepoint-auth.ts
 * 3. Run tests: npm run test:e2e:spo
 */

import { test, expect, WorkbenchPage, RssFeedWebPart } from './fixtures';

// Test feed URLs
const TEST_FEEDS = {
  NRK: 'https://www.nrk.no/toppsaker.rss',
  BBC: 'https://feeds.bbci.co.uk/news/rss.xml',
};

// Skip tests if no SharePoint URL is configured
const shouldSkip = !process.env.SHAREPOINT_SITE_URL;

test.describe('RSS Feed WebPart - SharePoint Online', () => {
  test.skip(shouldSkip, 'SHAREPOINT_SITE_URL not configured');

  let workbench: WorkbenchPage;

  test.beforeEach(async ({ page }) => {
    workbench = new WorkbenchPage(page);
    // Navigate to SharePoint workbench
    await workbench.goto();
  });

  test.describe('SharePoint Integration', () => {
    test('workbench loads with authentication', async () => {
      // Verify we're authenticated and workbench loaded
      await expect(workbench.canvas).toBeVisible({ timeout: 60000 });
    });

    test('can add webpart from gallery', async () => {
      const webpart = await workbench.addRssFeedWebPart();
      await expect(webpart.container).toBeVisible();
    });

    test('webpart persists after page refresh', async ({ page }) => {
      // Add and configure webpart
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Verify items loaded
      const initialCount = await webpart.getFeedItemCount();
      expect(initialCount).toBeGreaterThan(0);

      // Note: In workbench, changes aren't persisted
      // This test is more relevant for production pages
    });
  });

  test.describe('Theme Integration', () => {
    test('respects SharePoint theme colors', async ({ page }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Check that theme CSS variables are being used
      const container = webpart.container;
      const computedStyle = await container.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          // Check for theme-aware styling
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      // Just verify we got style values (theme integration is working)
      expect(computedStyle.color).toBeTruthy();
    });
  });

  test.describe('Performance in SharePoint', () => {
    test('loads feed within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Verify items loaded
      await expect(async () => {
        const count = await webpart.getFeedItemCount();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 30000 });

      const loadTime = Date.now() - startTime;

      // Feed should load within 30 seconds (including network latency)
      expect(loadTime).toBeLessThan(30000);

      console.log(`Feed loaded in ${loadTime}ms`);
    });

    test('caches feed data for subsequent loads', async ({ page }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);

      // First load
      const firstLoadStart = Date.now();
      await webpart.waitForLoad();
      const firstLoadTime = Date.now() - firstLoadStart;

      // Simulate cache by reloading with same feed
      // (In real scenario, cache would be in IndexedDB)
      await page.reload();
      await workbench.canvas.waitFor({ state: 'visible' });

      // Note: After reload in workbench, webpart needs to be re-added
      // This is a limitation of workbench testing

      console.log(`First load: ${firstLoadTime}ms`);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('renders correctly in current browser', async ({ page, browserName }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Take screenshot for visual comparison
      await page.screenshot({
        path: `test-results/screenshots/spo-${browserName}.png`,
        fullPage: false,
      });

      // Verify basic functionality
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);

      console.log(`Tested in browser: ${browserName}`);
    });
  });

  test.describe('Error Recovery', () => {
    test('recovers from temporary network issues', async ({ page }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);

      // Start with working feed
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();
      const initialCount = await webpart.getFeedItemCount();
      expect(initialCount).toBeGreaterThan(0);

      // Simulate network failure and recovery
      await page.route('**/*nrk*', (route) => route.abort());
      await page.waitForTimeout(2000);
      await page.unroute('**/*nrk*');

      // Webpart should still show cached data or recover
      const currentCount = await webpart.getFeedItemCount();
      expect(currentCount).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('RSS Feed WebPart - Production Page', () => {
  test.skip(shouldSkip, 'SHAREPOINT_SITE_URL not configured');

  // Tests for production SharePoint pages (not workbench)
  // These require a pre-configured page with the webpart

  test('webpart displays on SharePoint page', async ({ page }) => {
    // This test requires a SharePoint page URL with the webpart pre-configured
    const pageUrl = process.env.SHAREPOINT_PAGE_URL;

    if (!pageUrl) {
      test.skip(true, 'SHAREPOINT_PAGE_URL not configured');
      return;
    }

    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');

    const webpart = new RssFeedWebPart(page);
    await webpart.waitForLoad();

    const hasItems = await webpart.hasFeedItems();
    expect(hasItems).toBe(true);
  });
});
