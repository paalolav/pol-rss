/**
 * Playwright Test Fixtures for POL RSS Gallery WebPart
 *
 * Custom fixtures extend Playwright's test object with:
 * - Pre-configured workbench page
 * - WebPart configuration helpers
 * - Common test utilities
 */

import { test as base, expect, Page, Locator } from '@playwright/test';

/**
 * RSS Feed WebPart page object model
 */
export class RssFeedWebPart {
  readonly page: Page;
  readonly container: Locator;
  readonly propertyPane: Locator;
  readonly feedItems: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    // WebPart container - adjust selector based on actual rendered HTML
    this.container = page.locator('[data-automation-id="RssFeedWebPart"], .rssFeedWebPart');
    this.propertyPane = page.locator('.spPropertyPaneContainer, [data-automation-id="PropertyPane"]');
    this.feedItems = this.container.locator('[data-testid="feed-item"], .feedItem, article');
    this.errorMessage = this.container.locator('[data-testid="error-message"], .error, [role="alert"]');
    this.loadingSpinner = this.container.locator('[data-testid="loading"], .loading, .spinner');
  }

  /**
   * Wait for the webpart to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
    // Wait for loading to complete
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {
      // Loading spinner might not appear if data is cached
    });
  }

  /**
   * Check if the webpart is displaying feed items
   */
  async hasFeedItems(): Promise<boolean> {
    const count = await this.feedItems.count();
    return count > 0;
  }

  /**
   * Get the number of visible feed items
   */
  async getFeedItemCount(): Promise<number> {
    return await this.feedItems.count();
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get the error message text
   */
  async getErrorText(): Promise<string | null> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingSpinner.isVisible();
  }

  /**
   * Click on a specific feed item by index
   */
  async clickFeedItem(index: number): Promise<void> {
    await this.feedItems.nth(index).click();
  }

  /**
   * Get feed item title by index
   */
  async getFeedItemTitle(index: number): Promise<string | null> {
    const item = this.feedItems.nth(index);
    const title = item.locator('h2, h3, .title, [data-testid="item-title"]');
    return await title.textContent();
  }
}

/**
 * SharePoint Workbench page object model
 */
export class WorkbenchPage {
  readonly page: Page;
  readonly addWebPartButton: Locator;
  readonly webPartGallery: Locator;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addWebPartButton = page.locator('[data-automation-id="addWebPartBtn"], .addWebPartBtn, button:has-text("Add")');
    this.webPartGallery = page.locator('[data-automation-id="WebPartGallery"], .webPartGallery');
    this.canvas = page.locator('.CanvasZone, [data-automation-id="CanvasZone"], .SPCanvas');
  }

  /**
   * Navigate to the workbench
   */
  async goto(path: string = '/_layouts/15/workbench.aspx'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to local workbench
   */
  async gotoLocal(): Promise<void> {
    await this.page.goto('/workbench.html');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add the RSS Feed webpart to the canvas
   */
  async addRssFeedWebPart(): Promise<RssFeedWebPart> {
    // Click add button
    await this.addWebPartButton.click();

    // Wait for gallery and search for RSS Feed
    await this.webPartGallery.waitFor({ state: 'visible' });

    // Search for the webpart
    const searchInput = this.page.locator('[data-automation-id="searchBox"], input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('RSS');
      await this.page.waitForTimeout(500);
    }

    // Click on RSS Feed webpart
    const rssFeedOption = this.page.locator('[data-automation-id*="RssFeed"], [title*="RSS"], button:has-text("RSS Feed")');
    await rssFeedOption.first().click();

    // Wait for webpart to be added
    await this.page.waitForTimeout(1000);

    return new RssFeedWebPart(this.page);
  }

  /**
   * Get the RSS Feed webpart if already on page
   */
  getRssFeedWebPart(): RssFeedWebPart {
    return new RssFeedWebPart(this.page);
  }

  /**
   * Open the property pane for a webpart
   */
  async openPropertyPane(webpart: RssFeedWebPart): Promise<void> {
    // Click on webpart to select it
    await webpart.container.click();

    // Click edit/configure button
    const editButton = this.page.locator('[data-automation-id="editWebPartBtn"], button[aria-label*="Edit"], button:has-text("Edit")');
    await editButton.click();

    // Wait for property pane
    await webpart.propertyPane.waitFor({ state: 'visible' });
  }

  /**
   * Set feed URL in property pane
   */
  async setFeedUrl(url: string): Promise<void> {
    const feedUrlInput = this.page.locator('[data-automation-id="feedUrl"], input[name*="feedUrl"], input[aria-label*="Feed URL"]');
    await feedUrlInput.fill(url);
    await feedUrlInput.blur();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select layout in property pane
   */
  async selectLayout(layout: 'banner' | 'card' | 'list'): Promise<void> {
    const layoutOption = this.page.locator(`[data-automation-id="layout-${layout}"], button:has-text("${layout}")`, { hasText: new RegExp(layout, 'i') });
    await layoutOption.click();
  }
}

/**
 * Extended test fixture with workbench and webpart helpers
 */
interface RssFeedFixtures {
  workbench: WorkbenchPage;
  rssFeedWebPart: RssFeedWebPart;
}

/**
 * Extended test object with custom fixtures
 */
export const test = base.extend<RssFeedFixtures>({
  workbench: async ({ page }, use) => {
    const workbench = new WorkbenchPage(page);
    await use(workbench);
  },

  rssFeedWebPart: async ({ page }, use) => {
    const webpart = new RssFeedWebPart(page);
    await use(webpart);
  },
});

export { expect };
