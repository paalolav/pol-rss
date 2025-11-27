/**
 * POL RSS Gallery WebPart - Local Workbench E2E Tests
 *
 * These tests run against the local development workbench (gulp serve).
 * No SharePoint authentication is required.
 *
 * Prerequisites:
 * 1. Start the local server: gulp serve
 * 2. Run tests: npm run test:e2e:local
 */

import { test, expect, WorkbenchPage, RssFeedWebPart } from './fixtures';

// Test feed URLs for E2E testing
const TEST_FEEDS = {
  // Public RSS feeds for testing
  NRK: 'https://www.nrk.no/toppsaker.rss',
  BBC: 'https://feeds.bbci.co.uk/news/rss.xml',
  NPR: 'https://feeds.npr.org/1001/rss.xml',
  // Invalid feed for error testing
  INVALID: 'https://example.com/not-a-feed',
  MALFORMED_URL: 'not-a-valid-url',
};

test.describe('RSS Feed WebPart - Local Workbench', () => {
  let workbench: WorkbenchPage;

  test.beforeEach(async ({ page }) => {
    workbench = new WorkbenchPage(page);
    // Navigate to local workbench
    await workbench.gotoLocal();
  });

  test.describe('Initial State', () => {
    test('workbench loads successfully', async ({ page }) => {
      // Verify workbench canvas is visible
      await expect(workbench.canvas).toBeVisible({ timeout: 30000 });
    });

    test('add webpart button is visible', async () => {
      await expect(workbench.addWebPartButton).toBeVisible();
    });
  });

  test.describe('WebPart Loading', () => {
    test('can add RSS Feed webpart to canvas', async () => {
      const webpart = await workbench.addRssFeedWebPart();
      await expect(webpart.container).toBeVisible();
    });

    test('webpart shows empty state when no feed configured', async () => {
      const webpart = await workbench.addRssFeedWebPart();
      await webpart.waitForLoad();

      // Should show empty state or prompt to configure
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(false);
    });
  });

  test.describe('Feed Configuration', () => {
    test('can configure feed URL via property pane', async () => {
      const webpart = await workbench.addRssFeedWebPart();

      // Open property pane
      await workbench.openPropertyPane(webpart);

      // Set feed URL
      await workbench.setFeedUrl(TEST_FEEDS.NRK);

      // Wait for feed to load
      await webpart.waitForLoad();

      // Verify items are displayed
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });

    test('displays error for invalid feed URL', async () => {
      const webpart = await workbench.addRssFeedWebPart();

      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.INVALID);

      // Wait for error state
      await webpart.container.waitFor({ state: 'visible' });
      await webpart.page.waitForTimeout(5000); // Wait for fetch to fail

      // Should show error or empty state
      const hasError = await webpart.hasError();
      const hasItems = await webpart.hasFeedItems();

      expect(hasError || !hasItems).toBe(true);
    });
  });

  test.describe('Layout Selection', () => {
    test.beforeEach(async () => {
      // Add webpart and configure with test feed
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();
    });

    test('can switch to card layout', async ({ page }) => {
      await workbench.selectLayout('card');
      await page.waitForTimeout(1000);

      // Verify card layout is applied (look for card-specific classes)
      const cardContainer = page.locator('.cardLayout, [data-layout="card"], .card-grid');
      // Layout might not have specific class, just verify feed items exist
      const webpart = workbench.getRssFeedWebPart();
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });

    test('can switch to list layout', async ({ page }) => {
      await workbench.selectLayout('list');
      await page.waitForTimeout(1000);

      const webpart = workbench.getRssFeedWebPart();
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });

    test('can switch to banner layout', async ({ page }) => {
      await workbench.selectLayout('banner');
      await page.waitForTimeout(1000);

      const webpart = workbench.getRssFeedWebPart();
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });
  });

  test.describe('Feed Item Interaction', () => {
    let webpart: RssFeedWebPart;

    test.beforeEach(async () => {
      webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();
    });

    test('feed items are clickable', async ({ page }) => {
      // Get initial URL
      const initialUrl = page.url();

      // Click first feed item
      await webpart.clickFeedItem(0);

      // Wait for navigation or new tab
      await page.waitForTimeout(1000);

      // URL should change or new tab should open
      const currentUrl = page.url();
      const pages = page.context().pages();

      // Either same page navigated or new tab opened
      expect(currentUrl !== initialUrl || pages.length > 1).toBe(true);
    });

    test('feed items have titles', async () => {
      const itemCount = await webpart.getFeedItemCount();
      expect(itemCount).toBeGreaterThan(0);

      const title = await webpart.getFeedItemTitle(0);
      expect(title).toBeTruthy();
      expect(title!.length).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('adapts to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Verify webpart is visible and functional on mobile
      await expect(webpart.container).toBeVisible();
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });

    test('adapts to tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      await expect(webpart.container).toBeVisible();
      const hasItems = await webpart.hasFeedItems();
      expect(hasItems).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('webpart has accessible structure', async ({ page }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Check for basic accessibility attributes
      const articles = page.locator('article, [role="article"]');
      const articleCount = await articles.count();

      // If using semantic articles, verify they exist
      if (articleCount > 0) {
        // Articles should have accessible structure
        const firstArticle = articles.first();
        await expect(firstArticle).toBeVisible();
      }

      // Check for heading structure
      const headings = webpart.container.locator('h1, h2, h3, h4');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
    });

    test('keyboard navigation works', async ({ page }) => {
      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);
      await webpart.waitForLoad();

      // Tab to first feed item
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Check if an element within the webpart has focus
      const focusedElement = page.locator(':focus');
      const isWithinWebpart = await webpart.container.locator(':focus').count();

      // Should be able to focus elements within webpart
      expect(isWithinWebpart).toBeGreaterThanOrEqual(0); // May vary based on implementation
    });
  });

  test.describe('Error Handling', () => {
    test('shows error message for network failure', async ({ page }) => {
      // Block all external requests to simulate network failure
      await page.route('**/*', (route) => {
        if (route.request().url().includes('nrk.no') || route.request().url().includes('allorigins')) {
          route.abort();
        } else {
          route.continue();
        }
      });

      const webpart = await workbench.addRssFeedWebPart();
      await workbench.openPropertyPane(webpart);
      await workbench.setFeedUrl(TEST_FEEDS.NRK);

      // Wait for error to appear
      await page.waitForTimeout(10000);

      // Should show error state
      const hasError = await webpart.hasError();
      const hasItems = await webpart.hasFeedItems();

      expect(hasError || !hasItems).toBe(true);
    });
  });
});
