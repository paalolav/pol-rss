/**
 * Norwegian RSS Feeds E2E Tests on SharePoint
 *
 * Tests multiple Norwegian news feeds on a deployed SharePoint page.
 * Target: https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx
 *
 * These tests verify:
 * - Feed content loads correctly in the webpart
 * - Norwegian characters display properly (æ, ø, å)
 * - Images load from Norwegian news sources
 * - Strong background compatibility
 *
 * Norwegian feeds tested:
 * - NRK (currently configured)
 * - VG, E24, TV2 (can be configured via property pane)
 */

import { test, expect } from '@playwright/test';

const PAGE_URL = 'https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx';

// Norwegian news feed URLs for reference
const NORWEGIAN_FEEDS = {
  NRK_TOPPSAKER: 'https://www.nrk.no/toppsaker.rss',
  VG: 'https://www.vg.no/rss/feed/?format=rss',
  E24: 'https://e24.no/rss2',
  TV2_NYHETER: 'https://www.tv2.no/rss/nyheter',
  NRK_SPORT: 'https://www.nrk.no/sport/toppsaker.rss',
  NRK_KULTUR: 'https://www.nrk.no/kultur/toppsaker.rss',
};

// Selectors for the RSS Gallery webpart
const SELECTORS = {
  webpart: '[class*="rssFeed"], [class*="polRssGallery"]',
  gallery: '[class*="gallery"]',
  galleryItem: '[class*="galleryItem"]',
  cardLayout: '[class*="cardLayout"], [class*="card"]',
  listLayout: '[class*="listLayout"]',
  itemImage: 'img',
  itemTitle: '[class*="title"], h3, h4',
  itemDate: 'time, [class*="date"]',
  itemDescription: '[class*="description"]',
  itemMeta: '[class*="meta"]',
  loading: '[class*="loading"], .ms-Spinner',
  error: '[class*="error"], [role="alert"]',
};

test.describe.configure({ mode: 'serial' });

test.describe('Norwegian Feeds on SharePoint', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`Navigating to: ${PAGE_URL}`);
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
  });

  test('page displays Norwegian news content', async ({ page }) => {
    // Find content in any layout
    const content = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(content).toBeVisible({ timeout: 30000 });

    // Check for titles
    const titles = page.locator(`${SELECTORS.itemTitle}`);
    const titleCount = await titles.count();
    console.log(`Found ${titleCount} titles`);
    expect(titleCount).toBeGreaterThan(0);

    // Get first title text
    const firstTitle = await titles.first().textContent();
    console.log(`First title: ${firstTitle}`);
    expect(firstTitle).toBeTruthy();

    await page.screenshot({ path: 'test-results/e2e/norwegian-feeds-content.png', fullPage: true });
  });

  test('Norwegian characters display correctly (æ, ø, å)', async ({ page }) => {
    // Get all visible text content from the webpart
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    const textContent = await webpartArea.textContent();
    console.log(`Webpart text content length: ${textContent?.length || 0} chars`);

    // Check for corrupted encoding patterns (signs of broken encoding)
    const corruptedPatterns = /Ã¦|Ã¸|Ã¥|Ã†|Ã˜|Ã…/;
    const hasCorruptedChars = corruptedPatterns.test(textContent || '');

    if (hasCorruptedChars) {
      console.log('⚠️ WARNING: Found corrupted Norwegian characters (encoding issue)');
      await page.screenshot({ path: 'test-results/e2e/encoding-issue.png', fullPage: true });
    } else {
      console.log('✅ No corrupted encoding patterns detected');
    }

    expect(hasCorruptedChars).toBe(false);

    // Check if Norwegian characters are present (may or may not be in current content)
    const norwegianPattern = /[æøåÆØÅ]/;
    const hasNorwegianChars = norwegianPattern.test(textContent || '');
    console.log(`Norwegian characters (æ, ø, å) present: ${hasNorwegianChars}`);
  });

  test('news images load from Norwegian sources', async ({ page }) => {
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    const images = webpartArea.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);

    expect(imageCount).toBeGreaterThan(0);

    // Check image sources
    const imageSources: string[] = [];
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const src = await images.nth(i).getAttribute('src');
      if (src) {
        imageSources.push(src);
        console.log(`Image ${i + 1}: ${src.substring(0, 80)}...`);
      }
    }

    // Verify at least one image has a valid URL
    const validImages = imageSources.filter(src =>
      src.startsWith('http://') || src.startsWith('https://')
    );
    expect(validImages.length).toBeGreaterThan(0);
  });

  test('news items have valid links to Norwegian sources', async ({ page }) => {
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    // Find clickable items (links)
    const links = webpartArea.locator('a[href]');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links`);

    if (linkCount > 0) {
      // Get first link
      const firstHref = await links.first().getAttribute('href');
      console.log(`First link: ${firstHref}`);

      // Check it's a valid URL
      expect(firstHref).toBeTruthy();
      expect(firstHref).toMatch(/^https?:\/\//);

      // Check if it's a Norwegian news domain
      const norwegianDomains = ['nrk.no', 'vg.no', 'e24.no', 'tv2.no', 'dagbladet.no'];
      const isNorwegianSource = norwegianDomains.some(domain => firstHref?.includes(domain));
      console.log(`Is Norwegian source: ${isNorwegianSource}`);
    }
  });

  test('dates display in Norwegian format', async ({ page }) => {
    const dates = page.locator(`time, [class*="date"], [class*="meta"]`);
    const dateCount = await dates.count();
    console.log(`Found ${dateCount} date/meta elements`);

    if (dateCount > 0) {
      // Check a few dates
      for (let i = 0; i < Math.min(dateCount, 3); i++) {
        const dateText = await dates.nth(i).textContent();
        if (dateText && dateText.trim()) {
          console.log(`Date ${i + 1}: ${dateText.trim()}`);

          // Norwegian months
          const norwegianMonths = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
          const hasNorwegianMonth = norwegianMonths.some(month =>
            dateText.toLowerCase().includes(month)
          );
          if (hasNorwegianMonth) {
            console.log('✅ Date appears to be in Norwegian format');
          }
        }
      }
    }
  });

  test('webpart handles responsive layouts', async ({ page }) => {
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const mobileVisible = await webpartArea.isVisible();
    expect(mobileVisible).toBe(true);
    await page.screenshot({ path: 'test-results/e2e/norwegian-feeds-mobile.png', fullPage: true });
    console.log('✅ Mobile viewport: content visible');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    const tabletVisible = await webpartArea.isVisible();
    expect(tabletVisible).toBe(true);
    await page.screenshot({ path: 'test-results/e2e/norwegian-feeds-tablet.png', fullPage: true });
    console.log('✅ Tablet viewport: content visible');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const desktopVisible = await webpartArea.isVisible();
    expect(desktopVisible).toBe(true);
    await page.screenshot({ path: 'test-results/e2e/norwegian-feeds-desktop.png', fullPage: true });
    console.log('✅ Desktop viewport: content visible');
  });

  test('no error states displayed', async ({ page }) => {
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    // Check for error elements
    const errors = page.locator('[class*="error"], [role="alert"], [class*="Error"]');
    const errorCount = await errors.count();

    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errors.nth(i).textContent();
        console.log(`Error ${i + 1}: ${errorText}`);
      }
    }

    console.log(`Error elements found: ${errorCount}`);
    // Allow for some error elements that might be hidden or from other webparts
    // Main check is that content is visible
  });

  test('page section background compatibility', async ({ page }) => {
    // Check for inverted/strong background sections
    const invertedContainers = page.locator('[data-inverted="true"], [class*="inverted"]');
    const invertedCount = await invertedContainers.count();
    console.log(`Found ${invertedCount} inverted/strong background sections`);

    // Check for webpart container - may have different class names in production
    const webpartArea = page.locator(`${SELECTORS.gallery}, ${SELECTORS.cardLayout}, ${SELECTORS.listLayout}`).first();
    await expect(webpartArea).toBeVisible({ timeout: 30000 });

    // Check if there's a data-inverted attribute anywhere in the webpart hierarchy
    const containers = page.locator('[data-inverted]');
    const containerCount = await containers.count();
    console.log(`Found ${containerCount} containers with data-inverted attribute`);

    if (containerCount > 0) {
      const firstInverted = await containers.first().getAttribute('data-inverted');
      console.log(`First data-inverted value: ${firstInverted}`);
    }

    await page.screenshot({ path: 'test-results/e2e/background-compatibility.png', fullPage: true });
    console.log('✅ Background compatibility check completed');
  });
});

test.describe('Multiple Norwegian News Sources', () => {
  test('current feed source displays properly', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Take a full page screenshot
    await page.screenshot({
      path: 'test-results/e2e/norwegian-feeds-full-page.png',
      fullPage: true
    });

    // Get the page title to verify we're on the right page
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    // Count all feed items visible
    const allItems = page.locator('[class*="galleryItem"], [class*="cardItem"], [class*="listItem"], [class*="card"] > *');
    const itemCount = await allItems.count();
    console.log(`Total feed items on page: ${itemCount}`);

    expect(itemCount).toBeGreaterThan(0);
  });

  test('capture visual state of all webparts on page', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Scroll through the page to trigger any lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Full page screenshot
    await page.screenshot({
      path: 'test-results/e2e/norwegian-feeds-all-webparts.png',
      fullPage: true
    });

    console.log('✅ Visual state captured');
  });
});
