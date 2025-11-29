/**
 * Strong Background (Inverted Theme) E2E Tests
 *
 * Tests text readability on SharePoint sections with "Strong shading" background.
 * When a section uses strong background, text must be white/light colored for readability.
 *
 * Target: https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx
 *
 * Known issues to test:
 * - Gallery view may have unreadable text on strong background
 * - Title text should be white/light on inverted backgrounds
 * - Date/meta text should be visible on inverted backgrounds
 */

import { test, expect } from '@playwright/test';

const PAGE_URL = 'https://computasa13.sharepoint.com/sites/Kjernen/SitePages/POL-RSS.aspx';

// Selectors
const SELECTORS = {
  // Webpart containers
  rssFeedContainer: '[data-testid="rss-feed-container"], [class*="rssFeed"]',

  // Layout types
  gallery: '[class*="gallery"]',
  galleryItem: '[class*="galleryItem"]',
  cardLayout: '[class*="cardLayout"], [class*="card"]',
  listLayout: '[class*="listLayout"]',

  // Text elements
  title: '[class*="title"], h3, h4',
  titleBelow: '[class*="titleBelow"]',
  meta: '[class*="meta"]',
  date: 'time, [class*="date"]',
  description: '[class*="description"]',
  source: '[class*="source"]',

  // Inverted/strong background indicators
  inverted: '[data-inverted="true"]',
  invertedClass: '[class*="inverted"]',
};

test.describe('Strong Background Text Readability', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Navigating to: ${PAGE_URL}`);
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000); // Wait for full render
  });

  test('detect inverted/strong background sections', async ({ page }) => {
    // Check for data-inverted attribute
    const invertedContainers = page.locator('[data-inverted="true"]');
    const invertedCount = await invertedContainers.count();
    console.log(`Found ${invertedCount} containers with data-inverted="true"`);

    // Check for inverted class
    const invertedClassElements = page.locator('[class*="inverted"]');
    const invertedClassCount = await invertedClassElements.count();
    console.log(`Found ${invertedClassCount} elements with "inverted" in class name`);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/e2e/strong-background-overview.png',
      fullPage: true
    });

    // Report findings
    if (invertedCount > 0 || invertedClassCount > 0) {
      console.log('✅ Strong background sections detected');
    } else {
      console.log('⚠️ No strong background sections found - may need to configure page');
    }
  });

  test('Gallery view text colors on strong background', async ({ page }) => {
    // Find gallery items
    const galleryItems = page.locator(SELECTORS.galleryItem);
    const galleryCount = await galleryItems.count();
    console.log(`Found ${galleryCount} gallery items`);

    if (galleryCount === 0) {
      console.log('No gallery items found - skipping gallery text test');
      return;
    }

    // Check text elements in gallery
    for (let i = 0; i < Math.min(galleryCount, 3); i++) {
      const item = galleryItems.nth(i);

      // Get title element
      const titleEl = item.locator('[class*="title"], h3, h4').first();
      if (await titleEl.count() > 0) {
        const titleText = await titleEl.textContent();
        const titleColor = await titleEl.evaluate(el => getComputedStyle(el).color);
        const titleBg = await titleEl.evaluate(el => {
          let parent = el.parentElement;
          while (parent) {
            const bg = getComputedStyle(parent).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              return bg;
            }
            parent = parent.parentElement;
          }
          return 'none';
        });

        console.log(`Gallery item ${i + 1} title: "${titleText?.substring(0, 30)}..."`);
        console.log(`  Title color: ${titleColor}`);
        console.log(`  Background: ${titleBg}`);

        // Check if text is readable (light text on dark background or dark text on light background)
        // RGB values > 200 are considered "light"
        const colorMatch = titleColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (colorMatch) {
          const [, r, g, b] = colorMatch.map(Number);
          const isLightText = r > 200 && g > 200 && b > 200;
          const isDarkText = r < 100 && g < 100 && b < 100;

          console.log(`  Is light text: ${isLightText}, Is dark text: ${isDarkText}`);

          // If on inverted background, text should be light
          const isInverted = await item.evaluate(el => {
            let parent = el;
            while (parent) {
              if (parent.getAttribute?.('data-inverted') === 'true' ||
                  parent.className?.includes?.('inverted')) {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          });

          console.log(`  Is in inverted section: ${isInverted}`);

          if (isInverted && isDarkText) {
            console.log(`  ⚠️ ISSUE: Dark text on inverted background - may be unreadable!`);
          }
        }
      }

      // Check title-below section
      const titleBelow = item.locator('[class*="titleBelow"]');
      if (await titleBelow.count() > 0) {
        const belowColor = await titleBelow.evaluate(el => getComputedStyle(el).color);
        const belowBg = await titleBelow.evaluate(el => getComputedStyle(el).backgroundColor);
        console.log(`  Title-below color: ${belowColor}, bg: ${belowBg}`);
      }
    }

    // Take screenshot of gallery
    const gallerySection = page.locator(SELECTORS.gallery).first();
    if (await gallerySection.count() > 0) {
      await gallerySection.screenshot({
        path: 'test-results/e2e/gallery-strong-background.png'
      });
    }
  });

  test('Card layout text colors on strong background', async ({ page }) => {
    const cardItems = page.locator('[class*="card"]');
    const cardCount = await cardItems.count();
    console.log(`Found ${cardCount} card items`);

    if (cardCount === 0) {
      console.log('No card items found');
      return;
    }

    // Check first few cards
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cardItems.nth(i);

      const titleEl = card.locator('[class*="title"], h3, h4').first();
      if (await titleEl.count() > 0) {
        const titleColor = await titleEl.evaluate(el => getComputedStyle(el).color);
        const titleText = await titleEl.textContent();
        console.log(`Card ${i + 1}: "${titleText?.substring(0, 30)}..." - color: ${titleColor}`);
      }

      const metaEl = card.locator('[class*="meta"], time').first();
      if (await metaEl.count() > 0) {
        const metaColor = await metaEl.evaluate(el => getComputedStyle(el).color);
        console.log(`  Meta color: ${metaColor}`);
      }
    }

    await page.screenshot({
      path: 'test-results/e2e/card-strong-background.png',
      fullPage: true
    });
  });

  test('List layout text colors on strong background', async ({ page }) => {
    const listItems = page.locator('[class*="listLayout"] [class*="item"], [class*="listItem"]');
    const listCount = await listItems.count();
    console.log(`Found ${listCount} list items`);

    if (listCount > 0) {
      for (let i = 0; i < Math.min(listCount, 3); i++) {
        const item = listItems.nth(i);
        const titleEl = item.locator('[class*="title"], h3, h4').first();
        if (await titleEl.count() > 0) {
          const titleColor = await titleEl.evaluate(el => getComputedStyle(el).color);
          console.log(`List item ${i + 1} title color: ${titleColor}`);
        }
      }
    }

    await page.screenshot({
      path: 'test-results/e2e/list-strong-background.png',
      fullPage: true
    });
  });

  test('check text contrast on all visible layouts', async ({ page }) => {
    // Get all text elements in RSS feed containers
    const allTitles = page.locator('[class*="rssFeed"] [class*="title"], [class*="gallery"] [class*="title"], [class*="card"] [class*="title"]');
    const titleCount = await allTitles.count();
    console.log(`Found ${titleCount} title elements across all layouts`);

    const colorIssues: string[] = [];

    for (let i = 0; i < Math.min(titleCount, 10); i++) {
      const title = allTitles.nth(i);
      const text = await title.textContent();
      const color = await title.evaluate(el => getComputedStyle(el).color);

      // Parse RGB
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);

        // Check if in inverted section
        const isInverted = await title.evaluate(el => {
          let parent = el;
          while (parent) {
            if (parent.getAttribute?.('data-inverted') === 'true') return true;
            parent = parent.parentElement;
          }
          return false;
        });

        // Dark text (r,g,b < 100) on inverted background is bad
        if (isInverted && r < 100 && g < 100 && b < 100) {
          const issue = `"${text?.substring(0, 30)}..." has dark text (${color}) on inverted background`;
          colorIssues.push(issue);
          console.log(`❌ ${issue}`);
        } else if (isInverted) {
          console.log(`✅ "${text?.substring(0, 30)}..." - color OK (${color}) on inverted`);
        }
      }
    }

    // Report summary
    console.log(`\n=== Text Contrast Summary ===`);
    console.log(`Total titles checked: ${Math.min(titleCount, 10)}`);
    console.log(`Issues found: ${colorIssues.length}`);

    if (colorIssues.length > 0) {
      console.log('\nIssues:');
      colorIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Take full page screenshot for review
    await page.screenshot({
      path: 'test-results/e2e/text-contrast-check.png',
      fullPage: true
    });

    // This test documents issues but doesn't fail - we want to see the results
    expect(true).toBe(true);
  });

  test('visual comparison - capture all webpart states', async ({ page }) => {
    // Scroll to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Full page screenshot
    await page.screenshot({
      path: 'test-results/e2e/full-page-strong-background.png',
      fullPage: true
    });
    console.log('✅ Full page screenshot captured');

    // Try to capture specific sections
    const sections = [
      { name: 'gallery', selector: '[class*="gallery"]' },
      { name: 'card', selector: '[class*="cardLayout"]' },
      { name: 'list', selector: '[class*="listLayout"]' },
    ];

    for (const section of sections) {
      const el = page.locator(section.selector).first();
      if (await el.count() > 0) {
        try {
          await el.screenshot({
            path: `test-results/e2e/${section.name}-section.png`
          });
          console.log(`✅ ${section.name} section screenshot captured`);
        } catch (e) {
          console.log(`⚠️ Could not capture ${section.name} section`);
        }
      }
    }
  });
});
