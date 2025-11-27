# POL RSS Gallery - Testing Guide

This document describes the testing infrastructure, patterns, and guidelines for the POL RSS Gallery webpart.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library (RTL)**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions

## Directory Structure

```
tests/
├── setup/
│   └── setupTests.ts       # Jest configuration and global mocks
├── mocks/
│   └── spfxMocks.ts        # SharePoint Framework mock implementations
├── utils/
│   ├── testUtils.tsx       # Custom render functions and helpers
│   └── feedTestData.ts     # Sample RSS/Atom feed XML for parser tests
├── fixtures/               # (To be added) Test fixture files
│   └── feeds/              # Sample feed XML files
├── components/             # Component tests
│   └── *.test.tsx
├── services/               # Service tests
│   └── *.test.ts
└── README.md               # This file
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (with JUnit output)
npm run test:ci
```

## Writing Tests

### Component Tests

Use React Testing Library for component tests. Focus on testing user behavior, not implementation details.

```tsx
import { render, screen, fireEvent } from '../utils/testUtils';
import { RssFeed } from '../../src/webparts/polRssGallery/components/RssFeed';
import { createMockRssItems } from '../utils/feedTestData';

describe('RssFeed', () => {
  it('renders feed items', async () => {
    const items = createMockRssItems(3);

    render(<RssFeed items={items} layout="card" />);

    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    expect(screen.getByText('Test Article 3')).toBeInTheDocument();
  });

  it('handles click on item', async () => {
    const items = createMockRssItems(1);
    const handleClick = jest.fn();

    render(<RssFeed items={items} onItemClick={handleClick} />);

    fireEvent.click(screen.getByText('Test Article 1'));

    expect(handleClick).toHaveBeenCalledWith(items[0]);
  });
});
```

### Service Tests

Test services in isolation using mocks for external dependencies.

```typescript
import { ImprovedFeedParser } from '../../src/webparts/polRssGallery/services/improvedFeedParser';
import { rss2StandardXml, expectedRss2StandardParsed } from '../utils/feedTestData';

describe('ImprovedFeedParser', () => {
  let parser: ImprovedFeedParser;

  beforeEach(() => {
    parser = new ImprovedFeedParser();
  });

  it('parses RSS 2.0 feed correctly', () => {
    const result = parser.parse(rss2StandardXml);

    expect(result.title).toBe(expectedRss2StandardParsed.title);
    expect(result.items).toHaveLength(expectedRss2StandardParsed.itemCount);
  });

  it('throws on invalid XML', () => {
    expect(() => parser.parse('not xml')).toThrow();
  });
});
```

### Using SPFx Mocks

Use the provided mocks for SharePoint context objects.

```typescript
import { createMockWebPartContext, createMockSPHttpClient } from '../mocks/spfxMocks';

describe('ProxyService', () => {
  it('fetches feed through SPHttpClient', async () => {
    const mockResponse = createMockResponse(rss2StandardXml);
    const mockHttpClient = createMockSPHttpClient(mockResponse);
    const context = createMockWebPartContext({ httpClient: mockHttpClient });

    const service = new ProxyService(context);
    const result = await service.fetch('https://example.com/feed.rss');

    expect(mockHttpClient.fetch).toHaveBeenCalled();
    expect(result).toBe(rss2StandardXml);
  });
});
```

## Testing Guidelines

### Do

- ✅ Test user-visible behavior
- ✅ Use semantic queries (getByRole, getByLabelText, getByText)
- ✅ Test accessibility (roles, labels, keyboard navigation)
- ✅ Use async/await for asynchronous operations
- ✅ Clean up after tests (RTL does this automatically)
- ✅ Use descriptive test names that explain the expected behavior

### Don't

- ❌ Test implementation details (state, props, internal methods)
- ❌ Use querySelector or container queries when possible
- ❌ Rely on snapshot tests alone for complex components
- ❌ Write tests that depend on each other
- ❌ Mock what you don't have to mock

### Query Priority

Prefer queries in this order (most to least preferred):

1. `getByRole` - accessible by everyone
2. `getByLabelText` - good for form fields
3. `getByPlaceholderText` - if no label available
4. `getByText` - for non-interactive elements
5. `getByTestId` - last resort

### Async Testing

Always await async operations:

```typescript
// Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Or with findBy (combines getBy + waitFor)
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

## Test Data

Use the provided test data utilities in `tests/utils/feedTestData.ts`:

```typescript
import {
  rss2StandardXml,        // Standard RSS 2.0 feed
  rss2WithMediaXml,       // RSS with media elements
  atom1StandardXml,       // Atom 1.0 feed
  createMockRssItems,     // Generate mock items
  createMockRssItem,      // Single mock item with overrides
} from '../utils/feedTestData';
```

## Coverage Requirements

Target coverage: **70%** for all metrics.

| Metric | Target |
|--------|--------|
| Statements | 70% |
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

View coverage report after running `npm run test:coverage`:

```
open coverage/lcov-report/index.html
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- --testPathPattern="RssFeed.test"
```

### Run Tests Matching Description

```bash
npm test -- --testNamePattern="renders feed items"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--watchAll=false"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Troubleshooting

### "Cannot find module" errors

Make sure the module paths in `jest.config.js` match your project structure.

### SPFx-specific errors

SPFx modules are mocked in `tests/mocks/spfxMocks.ts`. If you see errors related to `@microsoft/sp-*` packages, add the necessary mocks.

### CSS Module errors

CSS modules are mocked with `identity-obj-proxy`. If you need actual class names, update the mock configuration.

### React 17 compatibility

This project uses React 17. Ensure all testing library packages are compatible versions.

---

## E2E Testing with Playwright

In addition to unit tests, this project includes end-to-end (E2E) tests using Playwright for testing the webpart in a real browser environment.

### E2E Directory Structure

```
tests/e2e/
├── auth/
│   ├── sharepoint-auth.ts    # SharePoint authentication helper
│   ├── README.md             # Auth setup instructions
│   └── .auth/                # Stored auth state (gitignored)
├── fixtures/
│   └── index.ts              # Playwright fixtures and page objects
├── rssFeed.local.spec.ts     # Local workbench tests
└── rssFeed.spo.spec.ts       # SharePoint Online tests
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run only local workbench tests (no auth required)
npm run test:e2e:local

# Run SharePoint Online tests (requires auth setup)
npm run test:e2e:spo

# Run E2E tests with Playwright UI (interactive mode)
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

### Prerequisites for Local Workbench Tests

1. Start the local development server:
   ```bash
   gulp serve
   ```

2. Run tests:
   ```bash
   npm run test:e2e:local
   ```

### Prerequisites for SharePoint Online Tests

1. Set environment variable:
   ```bash
   export SHAREPOINT_SITE_URL="https://yourtenant.sharepoint.com/sites/yoursite"
   ```

2. Run authentication setup (interactive login):
   ```bash
   npx ts-node tests/e2e/auth/sharepoint-auth.ts
   ```

3. Run tests:
   ```bash
   npm run test:e2e:spo
   ```

### E2E Test Fixtures

Use the provided fixtures for consistent test setup:

```typescript
import { test, expect, WorkbenchPage, RssFeedWebPart } from './fixtures';

test.describe('My E2E Tests', () => {
  let workbench: WorkbenchPage;

  test.beforeEach(async ({ page }) => {
    workbench = new WorkbenchPage(page);
    await workbench.gotoLocal();
  });

  test('adds webpart and configures feed', async () => {
    const webpart = await workbench.addRssFeedWebPart();
    await workbench.openPropertyPane(webpart);
    await workbench.setFeedUrl('https://www.nrk.no/toppsaker.rss');
    await webpart.waitForLoad();

    const hasItems = await webpart.hasFeedItems();
    expect(hasItems).toBe(true);
  });
});
```

### E2E Test Types

| Test File Pattern | Project | Description |
|-------------------|---------|-------------|
| `*.local.spec.ts` | local-workbench | Local dev server tests |
| `*.spo.spec.ts` | sharepoint-chromium | SharePoint Online tests |
| `*.mobile.spec.ts` | mobile-chrome | Mobile viewport tests |
| `*.tablet.spec.ts` | tablet-safari | Tablet viewport tests |

### Debugging E2E Tests

```bash
# Run with headed browser (visible)
npx playwright test --headed

# Run with debugger
npx playwright test --debug

# Run specific test file
npx playwright test rssFeed.local.spec.ts

# Generate test code interactively
npx playwright codegen https://localhost:4321/workbench.html
```

### CI/CD Integration

For CI pipelines, configure authentication state as a secret and inject it before tests:

```yaml
# Example Azure DevOps pipeline
- script: |
    mkdir -p tests/e2e/auth/.auth
    echo '$(SHAREPOINT_AUTH_STATE)' > tests/e2e/auth/.auth/user.json
  displayName: 'Setup SharePoint Auth'

- script: npm run test:e2e:spo
  displayName: 'Run E2E Tests'
```
