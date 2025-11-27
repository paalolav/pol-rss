/**
 * SharePoint Online Authentication Helper for Playwright E2E Tests
 *
 * This module provides authentication utilities for testing against SharePoint Online.
 * It supports multiple authentication methods:
 * 1. Interactive login (for local development)
 * 2. Stored credentials (for CI/CD pipelines)
 * 3. Service principal (for automated testing)
 */

import { chromium, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Authentication storage path
const AUTH_STORAGE_PATH = path.join(__dirname, '.auth', 'user.json');

/**
 * Configuration for SharePoint authentication
 */
export interface SharePointAuthConfig {
  /** SharePoint site URL (e.g., https://contoso.sharepoint.com/sites/dev) */
  siteUrl: string;
  /** Username for authentication (optional - will prompt if not provided) */
  username?: string;
  /** Password for authentication (optional - will prompt if not provided) */
  password?: string;
  /** Use stored authentication state if available */
  useStoredAuth?: boolean;
}

/**
 * Check if stored authentication is available and valid
 */
export function hasStoredAuth(): boolean {
  if (!fs.existsSync(AUTH_STORAGE_PATH)) {
    return false;
  }

  try {
    const authData = JSON.parse(fs.readFileSync(AUTH_STORAGE_PATH, 'utf-8'));
    // Check if cookies exist and are not expired
    const cookies = authData.cookies || [];
    const now = Date.now() / 1000;

    // Check for SharePoint auth cookies
    const spCookies = cookies.filter(
      (c: { name: string; expires: number }) =>
        c.name.includes('FedAuth') || c.name.includes('rtFa')
    );

    if (spCookies.length === 0) {
      return false;
    }

    // Check if any auth cookie is expired
    const hasValidCookie = spCookies.some(
      (c: { expires: number }) => c.expires === -1 || c.expires > now
    );

    return hasValidCookie;
  } catch {
    return false;
  }
}

/**
 * Perform interactive login to SharePoint Online
 * This will open a browser window for the user to log in manually.
 * The authentication state will be saved for future use.
 */
export async function performInteractiveLogin(
  config: SharePointAuthConfig
): Promise<void> {
  console.log('Starting interactive SharePoint login...');
  console.log(`Site URL: ${config.siteUrl}`);

  const browser = await chromium.launch({
    headless: false, // Must be visible for interactive login
    slowMo: 100,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to SharePoint site
    await page.goto(config.siteUrl, { waitUntil: 'networkidle' });

    // If username is provided, try to fill it in
    if (config.username) {
      const emailInput = page.locator('input[type="email"], input[name="loginfmt"]');
      if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await emailInput.fill(config.username);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForTimeout(2000);
      }
    }

    // Wait for user to complete login
    console.log('\n========================================');
    console.log('Please complete the login in the browser window.');
    console.log('The script will continue once you reach SharePoint.');
    console.log('========================================\n');

    // Wait for SharePoint to load (look for typical SharePoint elements)
    await page.waitForSelector(
      '[data-automationid="SiteHeader"], #spSiteHeader, .SPCanvas',
      { timeout: 300000 } // 5 minute timeout for login
    );

    console.log('Login successful! Saving authentication state...');

    // Save authentication state
    await context.storageState({ path: AUTH_STORAGE_PATH });

    console.log(`Authentication state saved to: ${AUTH_STORAGE_PATH}`);
  } finally {
    await browser.close();
  }
}

/**
 * Create an authenticated browser context for SharePoint
 * Uses stored authentication if available, otherwise performs interactive login
 */
export async function createAuthenticatedContext(
  config: SharePointAuthConfig
): Promise<{ context: BrowserContext; page: Page }> {
  // Check for stored auth if enabled
  if (config.useStoredAuth !== false && hasStoredAuth()) {
    console.log('Using stored authentication state...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      storageState: AUTH_STORAGE_PATH,
    });
    const page = await context.newPage();
    return { context, page };
  }

  // Perform interactive login if no stored auth
  await performInteractiveLogin(config);

  // Create new context with saved auth
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: AUTH_STORAGE_PATH,
  });
  const page = await context.newPage();
  return { context, page };
}

/**
 * Clear stored authentication
 */
export function clearStoredAuth(): void {
  if (fs.existsSync(AUTH_STORAGE_PATH)) {
    fs.unlinkSync(AUTH_STORAGE_PATH);
    console.log('Stored authentication cleared.');
  }
}

/**
 * Setup script for generating authentication state
 * Run this before CI/CD pipeline tests:
 *   npx ts-node tests/e2e/auth/sharepoint-auth.ts
 */
if (require.main === module) {
  const siteUrl = process.env.SHAREPOINT_SITE_URL;

  if (!siteUrl) {
    console.error('Error: SHAREPOINT_SITE_URL environment variable is required');
    console.error('Usage: SHAREPOINT_SITE_URL=https://tenant.sharepoint.com/sites/dev npx ts-node tests/e2e/auth/sharepoint-auth.ts');
    process.exit(1);
  }

  performInteractiveLogin({
    siteUrl,
    username: process.env.SHAREPOINT_USERNAME,
    useStoredAuth: false, // Force new login
  })
    .then(() => {
      console.log('\nAuthentication setup complete!');
      console.log('You can now run SharePoint E2E tests.');
    })
    .catch((error) => {
      console.error('Authentication failed:', error);
      process.exit(1);
    });
}
