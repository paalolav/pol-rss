/**
 * SharePoint Authentication Setup Script
 * Run this to authenticate before running E2E tests
 *
 * Usage:
 *   SHAREPOINT_SITE_URL=https://tenant.sharepoint.com/sites/site node tests/e2e/auth/setup-auth.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const AUTH_STORAGE_PATH = path.join(__dirname, '.auth', 'user.json');

async function setupAuth() {
  const siteUrl = process.env.SHAREPOINT_SITE_URL;

  if (!siteUrl) {
    console.error('Error: SHAREPOINT_SITE_URL environment variable is required');
    console.error('Usage: SHAREPOINT_SITE_URL=https://tenant.sharepoint.com/sites/site node tests/e2e/auth/setup-auth.js');
    process.exit(1);
  }

  console.log('Starting SharePoint authentication setup...');
  console.log(`Site URL: ${siteUrl}`);

  // Ensure .auth directory exists
  const authDir = path.dirname(AUTH_STORAGE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false, // Must be visible for login
    slowMo: 50,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    console.log('\nNavigating to SharePoint...');
    await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('\n========================================');
    console.log('Please complete the login in the browser.');
    console.log('Include MFA if prompted.');
    console.log('The script will continue once you reach SharePoint.');
    console.log('========================================\n');

    // Wait for SharePoint to fully load (look for common SP elements)
    await page.waitForSelector(
      '[data-automationid="SiteHeader"], #spSiteHeader, .SPCanvas, [data-automation-id="CanvasZone"]',
      { timeout: 300000 } // 5 minutes for login
    );

    console.log('Login successful! Saving authentication state...');

    // Save auth state
    await context.storageState({ path: AUTH_STORAGE_PATH });

    console.log(`\nAuthentication saved to: ${AUTH_STORAGE_PATH}`);
    console.log('\nYou can now run E2E tests with:');
    console.log(`  SHAREPOINT_SITE_URL="${siteUrl}" npm run test:e2e:spo`);

  } catch (error) {
    console.error('\nAuthentication failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

setupAuth();
