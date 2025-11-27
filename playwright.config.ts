import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for POL RSS Gallery WebPart E2E tests.
 *
 * @see https://playwright.dev/docs/test-configuration
 *
 * Usage:
 * 1. For local workbench testing:
 *    - Start local server: gulp serve
 *    - Run tests: npm run test:e2e
 *
 * 2. For SharePoint Online testing:
 *    - Set SHAREPOINT_SITE_URL environment variable
 *    - Configure authentication (see tests/e2e/auth/README.md)
 *    - Run tests: npm run test:e2e:spo
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['junit', { outputFile: 'test-results/e2e-results.xml' }] as const] : []),
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/e2e',

  // Shared settings for all the projects below
  use: {
    // Base URL for local workbench
    baseURL: process.env.SHAREPOINT_SITE_URL || 'https://localhost:4321',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'on-first-retry',

    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,
  },

  // Timeout for each test
  timeout: 60000,

  // Timeout for expect assertions
  expect: {
    timeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    // Local workbench testing (no auth required)
    {
      name: 'local-workbench',
      testMatch: /.*\.local\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://localhost:4321',
      },
    },

    // SharePoint Online testing (requires auth)
    {
      name: 'sharepoint-chromium',
      testMatch: /.*\.spo\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Storage state for authenticated session
        storageState: 'tests/e2e/auth/.auth/user.json',
      },
    },

    // Mobile viewport testing
    {
      name: 'mobile-chrome',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
      },
    },

    // Tablet viewport testing
    {
      name: 'tablet-safari',
      testMatch: /.*\.tablet\.spec\.ts/,
      use: {
        ...devices['iPad (gen 7)'],
      },
    },
  ],

  // Run local dev server before starting the tests (optional)
  // Uncomment if you want Playwright to start gulp serve automatically
  // webServer: {
  //   command: 'gulp serve',
  //   url: 'https://localhost:4321',
  //   reuseExistingServer: !process.env.CI,
  //   ignoreHTTPSErrors: true,
  //   timeout: 120000,
  // },
});
