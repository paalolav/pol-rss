# REF-001-TESTING-INFRASTRUCTURE

> **Status:** Completed
> **Priority:** Critical
> **Phase:** 1 - Foundation
> **Estimated Complexity:** Medium
> **Last Updated:** 2025-11-28

## Overview

Set up a comprehensive testing infrastructure using Jest and React Testing Library (RTL) for the SPFx webpart. This includes configuring Jest for TypeScript/SPFx compatibility, creating mock utilities for SharePoint context, and establishing testing patterns.

## Prerequisites

- Node.js >=22.14.0 <23.0.0 (as per package.json)
- Existing SPFx project structure

## Dependencies

- None (foundational task)

## Sub-Tasks

### ST-001-01: Install Testing Dependencies
**Status:** `[x]` Completed
**Test File:** `tests/setup/dependencies.test.ts`

**Description:**
Install and configure Jest, React Testing Library, and related packages compatible with SPFx 1.21.

**Steps:**
1. Add dev dependencies:
   ```bash
   npm install --save-dev jest @types/jest ts-jest @testing-library/react@12 @testing-library/jest-dom @testing-library/user-event@14 identity-obj-proxy jest-environment-jsdom
   ```
   > **Note:** Use @testing-library/react@12 for React 17 compatibility. Version 14+ requires React 18.
2. Verify compatibility with React 17.0.1
3. Ensure no conflicts with existing SPFx build tools

**Acceptance Criteria:**
- [ ] All packages installed without peer dependency conflicts
- [ ] `npm run test` command available
- [ ] No TypeScript errors in test configuration

---

### ST-001-02: Configure Jest for SPFx
**Status:** `[x]` Completed
**Test File:** N/A (configuration task)

**Description:**
Create Jest configuration that works with SPFx's TypeScript setup, module resolution, and CSS modules.

**Steps:**
1. Create `jest.config.js` in project root:
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'jsdom',
     roots: ['<rootDir>/tests'],
     moduleNameMapper: {
       '\\.(css|scss)$': 'identity-obj-proxy',
       '^@microsoft/sp-(.*)$': '<rootDir>/tests/mocks/spMocks.ts'
     },
     setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
     testMatch: ['**/*.test.ts', '**/*.test.tsx'],
     collectCoverageFrom: [
       'src/**/*.{ts,tsx}',
       '!src/**/*.d.ts',
       '!src/**/loc/**'
     ],
     coverageThreshold: {
       global: {
         branches: 70,
         functions: 70,
         lines: 70,
         statements: 70
       }
     }
   };
   ```
2. Update `tsconfig.json` to include test files
3. Add test script to `package.json`

**Acceptance Criteria:**
- [ ] Jest runs without configuration errors
- [ ] TypeScript compilation works for test files
- [ ] CSS/SCSS modules are properly mocked

---

### ST-001-03: Create SPFx Context Mocks
**Status:** `[x]` Completed
**Test File:** `tests/mocks/spfxMocks.test.ts`

**Description:**
Create comprehensive mocks for SPFx context objects including `WebPartContext`, `SPHttpClient`, and `PageContext`.

**Steps:**
1. Create `tests/mocks/spfxMocks.ts`:
   - Mock `WebPartContext` with all required properties
   - Mock `SPHttpClient` with fetch simulation
   - Mock `PageContext` with site/web/user info
2. Create factory functions for easy test setup
3. Document mock usage patterns

**Mock Structure:**
```typescript
export const createMockWebPartContext = (overrides?: Partial<WebPartContext>) => ({
  pageContext: createMockPageContext(),
  spHttpClient: createMockSPHttpClient(),
  httpClient: createMockHttpClient(),
  ...overrides
});
```

**Acceptance Criteria:**
- [ ] All SPFx context types are mockable
- [ ] Mocks are type-safe with TypeScript
- [ ] Factory functions support partial overrides

---

### ST-001-04: Create Test Utilities
**Status:** `[x]` Completed
**Test File:** `tests/utils/testUtils.test.ts`

**Description:**
Create reusable test utilities for rendering components with context, async testing, and common assertions.

**Steps:**
1. Create `tests/utils/testUtils.ts`:
   - Custom render function with providers
   - Async utilities for feed loading
   - Mock RSS feed data generators
2. Create `tests/utils/feedTestData.ts`:
   - Sample RSS 2.0 feed XML
   - Sample Atom feed XML
   - Edge case feed data (malformed, empty, etc.)

**Acceptance Criteria:**
- [ ] Custom render wraps components with required context
- [ ] Feed test data covers all supported formats
- [ ] Utilities are well-documented

---

### ST-001-05: Setup Test Runner Scripts
**Status:** `[x]` Completed
**Test File:** N/A (configuration task)

**Description:**
Configure npm scripts for running tests in various modes (watch, coverage, CI).

**Steps:**
1. Add to `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit"
     }
   }
   ```
2. Configure CI reporter for pipeline integration
3. Add pre-commit hook for test execution (optional)

**Acceptance Criteria:**
- [ ] All test scripts work correctly
- [ ] Coverage reports generate properly
- [ ] CI mode outputs JUnit XML

---

### ST-001-06: Create Component Test Template
**Status:** `[x]` Completed
**Test File:** `tests/components/RssFeed.test.tsx`

**Description:**
Create initial test file for RssFeed component as a template for other component tests.

**Steps:**
1. Create basic render test
2. Create props validation test
3. Create loading state test
4. Create error state test
5. Document testing patterns

**Test Cases:**
```typescript
describe('RssFeed', () => {
  it('renders without crashing');
  it('displays loading state initially');
  it('renders feed items when loaded');
  it('displays error message on fetch failure');
  it('respects maxItems prop');
});
```

**Acceptance Criteria:**
- [ ] Template demonstrates all common test patterns
- [ ] Tests are well-documented with comments
- [ ] Coverage meets threshold

---

### ST-001-07: Create Service Test Template
**Status:** `[x]` Completed
**Test File:** `tests/services/improvedFeedParser.test.ts`

**Description:**
Create initial test file for ImprovedFeedParser service as a template for service tests.

**Steps:**
1. Create parsing success tests for RSS 2.0
2. Create parsing success tests for Atom
3. Create error handling tests
4. Create edge case tests

**Test Cases:**
```typescript
describe('ImprovedFeedParser', () => {
  describe('parseRss', () => {
    it('parses valid RSS 2.0 feed');
    it('parses valid Atom feed');
    it('extracts images from media:thumbnail');
    it('handles missing optional fields');
    it('throws on invalid XML');
  });
});
```

**Acceptance Criteria:**
- [ ] Template covers unit and integration patterns
- [ ] Mocks external dependencies properly
- [ ] Tests are deterministic

---

### ST-001-08: Documentation and Guidelines
**Status:** `[x]` Completed
**Test File:** N/A (documentation task)

**Description:**
Document testing guidelines, patterns, and best practices for the project.

**Steps:**
1. Create `tests/README.md` with:
   - Testing philosophy
   - File naming conventions
   - Mock usage guide
   - Common patterns
2. Add JSDoc comments to test utilities
3. Create example snippets

**Acceptance Criteria:**
- [ ] Documentation is comprehensive
- [ ] Examples are copy-paste ready
- [ ] Guidelines are actionable

---

### ST-001-09: E2E Testing Setup
**Status:** `[x]` Completed
**Test File:** `tests/e2e/rssFeed.local.spec.ts`, `tests/e2e/rssFeed.spo.spec.ts`

**Description:**
Set up Playwright for end-to-end testing of the webpart in SharePoint Workbench.

**Steps:**
1. Install Playwright:
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```
2. Create `playwright.config.ts`:
   ```typescript
   import { defineConfig } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     timeout: 60000,
     use: {
       baseURL: 'https://[tenant].sharepoint.com/_layouts/15/workbench.aspx',
       trace: 'on-first-retry',
     },
     projects: [
       { name: 'chromium', use: { browserName: 'chromium' } },
     ],
   });
   ```
3. Create authentication helper for SharePoint
4. Create basic E2E test scenarios

**E2E Test Cases:**
```typescript
// tests/e2e/rssFeed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('RSS Feed WebPart', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to workbench and add webpart
    await page.goto('/');
    // Authentication handled by persistent context
  });

  test('loads feed and displays items', async ({ page }) => {
    // Configure feed URL in property pane
    // Verify items render
    // Check images load
  });

  test('handles feed errors gracefully', async ({ page }) => {
    // Configure invalid URL
    // Verify error message displayed
  });

  test('carousel navigation works', async ({ page }) => {
    // Select carousel layout
    // Click next/prev buttons
    // Verify items change
  });
});
```

**Note:** E2E tests require:
- SharePoint Workbench access
- Authentication configuration (AAD app or persistent login)
- CI/CD pipeline with SharePoint access

**Acceptance Criteria:**
- [ ] Playwright configured and running
- [ ] Authentication to SharePoint works
- [ ] Basic smoke tests pass
- [ ] Tests run in CI pipeline (optional)

---

## Test Coverage Goals

| Category | Target |
|----------|--------|
| Statements | 70% |
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

## Files to Create

```
tests/
├── setup/
│   ├── setupTests.ts
│   └── dependencies.test.ts
├── mocks/
│   ├── spfxMocks.ts
│   └── spfxMocks.test.ts
├── utils/
│   ├── testUtils.ts
│   ├── testUtils.test.ts
│   └── feedTestData.ts
├── components/
│   └── RssFeed.test.tsx
├── services/
│   └── improvedFeedParser.test.ts
└── README.md
```

## Notes

- SPFx 1.21 uses React 17, ensure RTL version compatibility
- Identity-obj-proxy handles CSS module mocking
- Consider snapshot testing for layout components (Phase 3)

## Related Tasks

- **REF-003-FEED-PARSER:** Will add comprehensive parser tests
- **REF-004-ERROR-HANDLING:** Will add error scenario tests
- **REF-007-LAYOUT-COMPONENTS:** Will add component snapshot tests
