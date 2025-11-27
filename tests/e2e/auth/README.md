# SharePoint Authentication for E2E Tests

This directory contains authentication utilities for running Playwright E2E tests against SharePoint Online.

## Quick Start

### 1. Local Development (Interactive Login)

For local development, you can use interactive login which will open a browser for you to sign in:

```bash
# Set your SharePoint site URL
export SHAREPOINT_SITE_URL="https://yourtenant.sharepoint.com/sites/yoursite"

# Run the auth setup script
npx ts-node tests/e2e/auth/sharepoint-auth.ts
```

This will:
1. Open a browser window
2. Navigate to your SharePoint site
3. Wait for you to complete login (including MFA if required)
4. Save the authentication state to `.auth/user.json`

### 2. Running Tests

After authentication:

```bash
# Run SharePoint E2E tests
npm run test:e2e:spo

# Or run all E2E tests
npm run test:e2e
```

## Authentication Methods

### Interactive Login (Recommended for Local Dev)

Best for local development when you need to handle MFA or complex login flows.

```bash
SHAREPOINT_SITE_URL=https://tenant.sharepoint.com/sites/dev npx ts-node tests/e2e/auth/sharepoint-auth.ts
```

### Pre-filled Username

You can provide a username to speed up the login process:

```bash
SHAREPOINT_SITE_URL=https://tenant.sharepoint.com/sites/dev \
SHAREPOINT_USERNAME=user@tenant.onmicrosoft.com \
npx ts-node tests/e2e/auth/sharepoint-auth.ts
```

## CI/CD Pipeline Setup

For CI/CD pipelines, you have two options:

### Option 1: Committed Auth State (Not Recommended)

Generate auth state locally and commit `.auth/user.json` (encrypted).

### Option 2: Pipeline Secret

Store the auth state as a pipeline secret and inject it during test runs.

```yaml
# Azure DevOps example
steps:
  - script: |
      mkdir -p tests/e2e/auth/.auth
      echo '$(SHAREPOINT_AUTH_STATE)' > tests/e2e/auth/.auth/user.json
    displayName: 'Setup SharePoint Auth'

  - script: npm run test:e2e:spo
    displayName: 'Run E2E Tests'
```

### Option 3: Service Principal (Advanced)

For fully automated testing, configure a service principal with appropriate permissions.

## Files

- `sharepoint-auth.ts` - Authentication helper utilities
- `.auth/user.json` - Stored authentication state (gitignored)
- `README.md` - This file

## Troubleshooting

### Auth state expired

Re-run the interactive login:

```bash
SHAREPOINT_SITE_URL=https://tenant.sharepoint.com npx ts-node tests/e2e/auth/sharepoint-auth.ts
```

### Tests failing with 401/403

1. Check if auth state exists: `ls -la tests/e2e/auth/.auth/`
2. Clear and regenerate auth: Delete `.auth/user.json` and re-run login
3. Verify you have access to the SharePoint site

### MFA prompts during tests

The stored auth state should include MFA tokens. If you're prompted for MFA:
1. Clear auth state
2. Re-run interactive login
3. Complete MFA
4. Auth state will include MFA cookies
