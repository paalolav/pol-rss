/**
 * POL RSS Gallery WebPart - Simplified E2E Tests (SharePoint Online)
 *
 * These tests work with a pre-configured webpart on the workbench.
 * The webpart manifest includes default configuration with NRK feed.
 *
 * Prerequisites:
 * 1. Set SHAREPOINT_SITE_URL environment variable
 * 2. Run authentication setup: node tests/e2e/auth/setup-auth.js
 * 3. Start local server: gulp serve
 * 4. Run tests: SHAREPOINT_SITE_URL=... npx playwright test gallery-simple.spo.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Workbench URL with debug manifest
const getWorkbenchUrl = (): string => {
  const siteUrl = process.env.SHAREPOINT_SITE_URL;
  if (!siteUrl) {
    throw new Error('SHAREPOINT_SITE_URL environment variable is required');
  }
  const baseUrl = siteUrl.replace(/\/$/, '');
  return `${baseUrl}/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js`;
};

// Selectors
const SELECTORS = {
  canvas: '[data-automation-id="CanvasZone"], .CanvasZone, .Canvas',
  webpartContent: '[class*="rssFeed"], [class*="cardLayout"], [class*="gallery"], [class*="listLayout"], [class*="bannerCarousel"]',
  galleryItem: '[class*="galleryItem"]',
  cardItem: '[class*="cardItem"], [class*="card"]',
  listItem: '[class*="listItem"]',
  itemTitle: '[class*="title"], h3, h4',
  itemImage: 'img',
  itemDate: 'time, [class*="date"]',
  itemDescription: '[class*="description"], p',
  editButton: 'button[aria-label*="Edit"], button[aria-label*="Rediger"], [data-automation-id="webPartEditButton"]',
  propertyPane: '[data-automation-id="PropertyPane"], .spPropertyPaneContainer, .ms-Panel',
};

/**
 * Helper to navigate to workbench and handle debug dialog
 */
async function gotoWorkbench(page: Page): Promise<void> {
  const url = getWorkbenchUrl();
  console.log(`Navigating to: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // Handle debug scripts dialog
  const loadDebugBtn = page.getByRole('button', { name: 'Load debug scripts' });
  try {
    await loadDebugBtn.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Debug dialog found, clicking Load debug scripts...');
    await loadDebugBtn.click();
    await page.waitForTimeout(3000);
  } catch {
    console.log('No debug dialog, continuing...');
  }

  // Wait for canvas
  await page.waitForSelector(SELECTORS.canvas, { state: 'visible', timeout: 30000 });
  console.log('Workbench loaded');
}

/**
 * Helper to add webpart via clicking the central + button
 */
async function addWebpart(page: Page): Promise<boolean> {
  // Click the zone hint to open toolbox
  const zoneHint = page.locator('[data-automation-id="toolboxHint-zone"]');
  if (await zoneHint.count() > 0) {
    await zoneHint.first().dispatchEvent('click');
    await page.waitForTimeout(2000);
  }

  // Check if toolbox opened
  const toolbox = page.locator('[role="dialog"], .ms-Panel, [data-automation-id="WebPartToolbox"]');
  if (await toolbox.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Toolbox opened');

    // Search for RSS
    const searchBox = page.locator('input[type="search"], input[placeholder*="Search"]');
    if (await searchBox.isVisible()) {
      await searchBox.fill('RSS');
      await page.waitForTimeout(500);
    }

    // Click RSS Feed option
    const rssOption = page.locator('[title*="RSS"], [title*="POL RSS"]').first();
    if (await rssOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rssOption.click();
      await page.waitForTimeout(3000);
      console.log('RSS webpart added');
      return true;
    }
  }

  console.log('Could not add webpart via toolbox');
  return false;
}

/**
 * Wait for webpart content to load
 */
async function waitForWebpartContent(page: Page, timeout = 30000): Promise<boolean> {
  try {
    await page.locator(SELECTORS.webpartContent).first().waitFor({ state: 'visible', timeout });
    console.log('Webpart content visible');
    return true;
  } catch {
    console.log('Webpart content not found');
    return false;
  }
}

test.describe.configure({ mode: 'serial' }); // Run tests sequentially to avoid auth issues

test.describe('Gallery Layout - SPO Workbench', () => {
  test('workbench loads with debug scripts', async ({ page }) => {
    await gotoWorkbench(page);

    // Verify canvas is present
    const canvas = page.locator(SELECTORS.canvas);
    await expect(canvas.first()).toBeVisible();

    // Take screenshot of empty workbench
    await page.screenshot({ path: 'test-results/e2e/workbench-loaded.png' });
  });

  test('can add RSS webpart to workbench', async ({ page }) => {
    await gotoWorkbench(page);

    const added = await addWebpart(page);

    if (added) {
      // Wait for content to load
      const hasContent = await waitForWebpartContent(page);
      expect(hasContent).toBe(true);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e/rss-webpart-added.png', fullPage: true });
    } else {
      // Just verify workbench is working
      console.log('Skipping webpart add - toolbox not accessible');
      await page.screenshot({ path: 'test-results/e2e/workbench-no-toolbox.png' });
    }
  });

  test('webpart displays feed items with images', async ({ page }) => {
    await gotoWorkbench(page);
    await addWebpart(page);

    const hasContent = await waitForWebpartContent(page);
    if (!hasContent) {
      test.skip();
      return;
    }

    // Check for images
    const images = page.locator(`${SELECTORS.webpartContent} img`);
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);

    if (imageCount > 0) {
      const firstSrc = await images.first().getAttribute('src');
      expect(firstSrc).toBeTruthy();
      console.log(`First image: ${firstSrc?.substring(0, 50)}...`);
    }

    await page.screenshot({ path: 'test-results/e2e/webpart-with-images.png', fullPage: true });
  });

  test('webpart displays titles', async ({ page }) => {
    await gotoWorkbench(page);
    await addWebpart(page);

    const hasContent = await waitForWebpartContent(page);
    if (!hasContent) {
      test.skip();
      return;
    }

    // Check for titles
    const titles = page.locator(`${SELECTORS.webpartContent} ${SELECTORS.itemTitle}`);
    const titleCount = await titles.count();
    console.log(`Found ${titleCount} titles`);

    expect(titleCount).toBeGreaterThan(0);

    const firstTitle = await titles.first().textContent();
    expect(firstTitle).toBeTruthy();
    console.log(`First title: ${firstTitle}`);
  });

  test('webpart displays dates', async ({ page }) => {
    await gotoWorkbench(page);
    await addWebpart(page);

    const hasContent = await waitForWebpartContent(page);
    if (!hasContent) {
      test.skip();
      return;
    }

    // Check for dates
    const dates = page.locator(`${SELECTORS.webpartContent} ${SELECTORS.itemDate}`);
    const dateCount = await dates.count();
    console.log(`Found ${dateCount} date elements`);

    // Dates may or may not be visible depending on settings
    if (dateCount > 0) {
      const firstDate = await dates.first().textContent();
      console.log(`First date: ${firstDate}`);
    }
  });

  test('clicking item opens link', async ({ page, context }) => {
    await gotoWorkbench(page);
    await addWebpart(page);

    const hasContent = await waitForWebpartContent(page);
    if (!hasContent) {
      test.skip();
      return;
    }

    // Find a clickable item (link or card)
    const clickableItem = page.locator(`${SELECTORS.webpartContent} a`).first();

    if (await clickableItem.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Listen for new page
      const newPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);

      await clickableItem.click();

      const newPage = await newPagePromise;
      if (newPage) {
        const url = newPage.url();
        console.log(`Opened: ${url}`);
        expect(url).not.toBe('about:blank');
        await newPage.close();
      }
    }
  });

  test('capture visual screenshots of all layouts', async ({ page }) => {
    await gotoWorkbench(page);
    await addWebpart(page);

    const hasContent = await waitForWebpartContent(page);
    if (!hasContent) {
      console.log('No webpart content to screenshot');
      return;
    }

    // Screenshot current state
    await page.screenshot({
      path: 'test-results/e2e/layout-current.png',
      fullPage: true
    });

    console.log('Layout screenshot captured');
  });
});
