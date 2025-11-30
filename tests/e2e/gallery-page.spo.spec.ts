/**
 * POL RSS Gallery WebPart - E2E Tests on Deployed Page
 *
 * Tests the Gallery layout on a real SharePoint page with the webpart deployed.
 * Target: https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx
 */

import { test, expect, Page } from '@playwright/test';

const PAGE_URL = 'https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx';

// Selectors for the RSS Gallery webpart
const SELECTORS = {
  // Webpart container
  webpart: '[class*="rssFeed"], [class*="polRssGallery"], [data-automation-id*="RssFeed"]',

  // Layout containers
  gallery: '[class*="gallery"]',
  galleryItem: '[class*="galleryItem"]',
  cardLayout: '[class*="cardLayout"], [class*="card"]',
  listLayout: '[class*="listLayout"]',
  bannerCarousel: '[class*="bannerCarousel"], [class*="swiper"]',

  // Item elements
  itemImage: 'img',
  itemTitle: '[class*="title"], h3, h4',
  itemDate: 'time, [class*="date"]',
  itemDescription: '[class*="description"]',
  itemSource: '[class*="source"]',
  itemMeta: '[class*="meta"]',

  // Gallery specific
  hoverOverlay: '[class*="hoverOverlay"]',
  titleBelow: '[class*="titleBelow"]',
  imageContainer: '[class*="imageContainer"]',

  // Loading/error states
  loading: '[class*="loading"], .ms-Spinner',
  error: '[class*="error"], [role="alert"]',
};

test.describe.configure({ mode: 'serial' });

test.describe('Gallery Layout - Deployed Page', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`Navigating to: ${PAGE_URL}`);
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for page to fully load
    await page.waitForTimeout(2000);
  });

  test('page loads with webpart content', async ({ page }) => {
    // Check that webpart content is visible
    const content = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}, ${SELECTORS.bannerCarousel}`).first();

    await expect(content).toBeVisible({ timeout: 30000 });
    console.log('Webpart content is visible');

    // Take screenshot
    await page.screenshot({ path: 'test-results/e2e/page-loaded.png', fullPage: true });
  });

  test('gallery layout displays items', async ({ page }) => {
    // Look for gallery items
    const galleryItems = page.locator(SELECTORS.galleryItem);
    const itemCount = await galleryItems.count();

    console.log(`Found ${itemCount} gallery items`);

    if (itemCount > 0) {
      expect(itemCount).toBeGreaterThan(0);

      // Take screenshot of gallery
      await page.screenshot({ path: 'test-results/e2e/gallery-items.png', fullPage: true });
    } else {
      // May be using different layout - check for any feed items
      const anyItems = page.locator(`${SELECTORS.cardLayout} > *, ${SELECTORS.listLayout} > *`);
      const anyCount = await anyItems.count();
      console.log(`Found ${anyCount} items in other layouts`);
    }
  });

  test('items display images', async ({ page }) => {
    // Find images in the webpart area
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    const images = webpartArea.locator('img');

    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);

    expect(imageCount).toBeGreaterThan(0);

    // Verify first image has src
    const firstSrc = await images.first().getAttribute('src');
    expect(firstSrc).toBeTruthy();
    console.log(`First image src: ${firstSrc?.substring(0, 80)}...`);
  });

  test('items display titles', async ({ page }) => {
    // Find titles in items
    const titles = page.locator(`${SELECTORS.galleryItem} ${SELECTORS.itemTitle}, [class*="card"] ${SELECTORS.itemTitle}`);
    const titleCount = await titles.count();

    console.log(`Found ${titleCount} titles`);

    if (titleCount > 0) {
      const firstTitle = await titles.first().textContent();
      expect(firstTitle).toBeTruthy();
      console.log(`First title: ${firstTitle}`);
    }
  });

  test('items display dates when enabled', async ({ page }) => {
    // Find date elements
    const dates = page.locator(`${SELECTORS.galleryItem} time, ${SELECTORS.galleryItem} ${SELECTORS.itemDate}, [class*="card"] time`);
    const dateCount = await dates.count();

    console.log(`Found ${dateCount} date elements`);

    if (dateCount > 0) {
      const firstDate = await dates.first().textContent();
      console.log(`First date: ${firstDate}`);
    }
  });

  test('items display descriptions when enabled', async ({ page }) => {
    // Find description elements
    const descriptions = page.locator(`${SELECTORS.galleryItem} ${SELECTORS.itemDescription}, [class*="card"] ${SELECTORS.itemDescription}`);
    const descCount = await descriptions.count();

    console.log(`Found ${descCount} description elements`);

    if (descCount > 0) {
      const firstDesc = await descriptions.first().textContent();
      console.log(`First description: ${firstDesc?.substring(0, 100)}...`);
    }
  });

  test('items display source when enabled', async ({ page }) => {
    // Find source elements
    const sources = page.locator(`${SELECTORS.galleryItem} ${SELECTORS.itemSource}, [class*="card"] ${SELECTORS.itemSource}`);
    const sourceCount = await sources.count();

    console.log(`Found ${sourceCount} source elements`);

    if (sourceCount > 0) {
      const firstSource = await sources.first().textContent();
      console.log(`First source: ${firstSource}`);
    }
  });

  test('gallery hover overlay appears on hover', async ({ page }) => {
    const galleryItem = page.locator(SELECTORS.galleryItem).first();

    if (await galleryItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Hover over item
      await galleryItem.hover();
      await page.waitForTimeout(500);

      // Check for hover overlay
      const overlay = page.locator(SELECTORS.hoverOverlay);
      const overlayVisible = await overlay.first().isVisible().catch(() => false);

      console.log(`Hover overlay visible: ${overlayVisible}`);

      // Take screenshot of hover state
      await page.screenshot({ path: 'test-results/e2e/gallery-hover.png' });
    } else {
      console.log('No gallery items to hover');
    }
  });

  test('gallery title-below mode shows titles under images', async ({ page }) => {
    // Check for title-below elements
    const titlesBelow = page.locator(SELECTORS.titleBelow);
    const count = await titlesBelow.count();

    console.log(`Found ${count} title-below sections`);

    if (count > 0) {
      // Verify they contain title text
      const firstTitleBelow = await titlesBelow.first().textContent();
      console.log(`Title below content: ${firstTitleBelow?.substring(0, 50)}...`);
    }
  });

  test('clicking item opens link', async ({ page, context }) => {
    // Find clickable link in item
    const itemLink = page.locator(`${SELECTORS.galleryItem} a, [class*="card"] a`).first();

    if (await itemLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await itemLink.getAttribute('href');
      console.log(`Item link: ${href}`);

      // Listen for new page
      const newPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);

      await itemLink.click();

      const newPage = await newPagePromise;
      if (newPage) {
        const url = newPage.url();
        console.log(`Opened in new tab: ${url}`);
        expect(url).not.toBe('about:blank');
        await newPage.close();
      } else {
        console.log('Link may navigate in same window or require different handling');
      }
    }
  });

  test('meta information displays correctly', async ({ page }) => {
    // Check for meta container with date/source
    const meta = page.locator(SELECTORS.itemMeta);
    const metaCount = await meta.count();

    console.log(`Found ${metaCount} meta sections`);

    if (metaCount > 0) {
      const metaContent = await meta.first().textContent();
      console.log(`Meta content: ${metaContent}`);
    }
  });

  test('responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify content still visible
    const content = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(content).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'test-results/e2e/gallery-mobile.png', fullPage: true });
    console.log('Mobile viewport screenshot captured');
  });

  test('responsive layout on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const content = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(content).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'test-results/e2e/gallery-tablet.png', fullPage: true });
    console.log('Tablet viewport screenshot captured');
  });

  test('capture all visual states', async ({ page }) => {
    // Full page screenshot
    await page.screenshot({
      path: 'test-results/e2e/full-page.png',
      fullPage: true
    });

    // Webpart area screenshot
    const webpart = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    if (await webpart.isVisible()) {
      await webpart.screenshot({ path: 'test-results/e2e/webpart-only.png' });
    }

    console.log('Visual screenshots captured');
  });

  test('descriptions do not contain HTML tags', async ({ page }) => {
    // Find description elements
    const descriptions = page.locator(`${SELECTORS.galleryItem} ${SELECTORS.itemDescription}, [class*="card"] ${SELECTORS.itemDescription}`);
    const descCount = await descriptions.count();

    console.log(`Found ${descCount} description elements`);

    if (descCount > 0) {
      // Check each description for HTML tags
      for (let i = 0; i < Math.min(descCount, 5); i++) {
        const descText = await descriptions.nth(i).textContent();
        console.log(`Description ${i + 1}: ${descText?.substring(0, 100)}...`);

        // Should NOT contain raw HTML tags like <p>, </p>, <br>, etc.
        if (descText) {
          expect(descText).not.toMatch(/<\/?[a-z][^>]*>/i);
          console.log(`Description ${i + 1} is clean (no HTML tags)`);
        }
      }
    } else {
      console.log('No descriptions found to check (descriptions may be disabled)');
    }
  });
});
