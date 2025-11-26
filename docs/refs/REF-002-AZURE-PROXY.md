# REF-002-AZURE-PROXY

> **Status:** Completed
> **Priority:** Critical
> **Phase:** 1 - Foundation
> **Estimated Complexity:** High
> **Completed:** 2025-11-26

## Overview

Refactor and enhance the existing Azure Function CORS proxy to provide reliable, cost-effective, and easily deployable proxy service for each tenant. The proxy must handle RSS feed fetching while bypassing CORS restrictions in SharePoint Online.

## Prerequisites

- Azure subscription (Consumption plan for cost-effectiveness)
- Azure CLI or Azure Portal access
- Basic PowerShell/Bash knowledge for deployment

## Dependencies

- None (foundational task)

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  SPFx WebPart   │────>│  Azure Function      │────>│  RSS Feed       │
│  (SharePoint)   │<────│  CORS Proxy          │<────│  (External)     │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ URL Allowlist│
                        │ (App Config) │
                        └──────────────┘
```

## Sub-Tasks

### ST-002-01: Analyze Current CORS-Proxy Implementation
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Review existing CORS-Proxy Azure Function code and identify improvements needed.

**Steps:**
1. Review `CORS-Proxy/HttpProxy/` function code
2. Document current capabilities and limitations
3. Identify security concerns
4. Plan refactoring approach

**Current Issues to Address:**
- No URL validation/allowlist
- No rate limiting
- Basic error handling
- No logging/monitoring
- Manual deployment process

**Acceptance Criteria:**
- [ ] Current implementation fully documented
- [ ] Gap analysis completed
- [ ] Refactoring plan created

---

### ST-002-02: Implement Enhanced Proxy Function
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Rewrite Azure Function with improved security, error handling, and performance.

**Steps:**
1. Create new function with TypeScript
2. Implement request validation
3. Add URL allowlist support (configurable)
4. Add proper CORS headers
5. Implement timeout handling
6. Add request/response logging

**Function Structure:**
```typescript
// index.ts
export default async function (context: Context, req: HttpRequest): Promise<void> {
  // 1. Validate request
  // 2. Check URL against allowlist (if enabled)
  // 3. Fetch remote content
  // 4. Add CORS headers
  // 5. Return response
}
```

**Acceptance Criteria:**
- [ ] Function handles GET requests for RSS URLs
- [ ] Proper error responses (400, 403, 500, 502)
- [ ] CORS headers correctly set
- [ ] Timeout prevents hanging requests

---

### ST-002-03: Implement URL Allowlist
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Add configurable URL allowlist to prevent proxy abuse.

**Steps:**
1. Create allowlist configuration in App Settings
2. Support wildcard patterns (e.g., `*.nrk.no`)
3. Add bypass option for development
4. Log blocked requests

**Configuration Example:**
```json
{
  "ALLOWED_DOMAINS": "*.nrk.no,*.vg.no,meltwater.com,*",
  "ENABLE_ALLOWLIST": "true"
}
```

**Acceptance Criteria:**
- [ ] Allowlist blocks unauthorized domains
- [ ] Wildcards work correctly
- [ ] Easy to configure per tenant
- [ ] Blocked requests return 403

---

### ST-002-04: Add Rate Limiting
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Implement rate limiting to prevent abuse and control costs.

**Steps:**
1. Use Azure Functions built-in rate limiting or implement custom
2. Configure limits per IP/tenant
3. Return 429 Too Many Requests when exceeded
4. Add rate limit headers to responses

**Configuration:**
```json
{
  "RATE_LIMIT_REQUESTS": "100",
  "RATE_LIMIT_WINDOW_SECONDS": "60"
}
```

**Acceptance Criteria:**
- [ ] Rate limiting prevents abuse
- [ ] Clear error message on limit exceeded
- [ ] Configurable limits
- [ ] Headers indicate remaining quota

---

### ST-002-05: Create ARM Template for One-Click Deployment
**Status:** `[x]` Completed
**Test File:** N/A (infrastructure task)

**Description:**
Create Azure Resource Manager (ARM) template for automated deployment.

**Steps:**
1. Create `azuredeploy.json` ARM template
2. Include Function App (Consumption plan)
3. Include Storage Account (minimal)
4. Include Application Insights (optional)
5. Parameterize all configurable values

**ARM Template Parameters:**
```json
{
  "parameters": {
    "functionAppName": { "type": "string" },
    "allowedDomains": { "type": "string", "defaultValue": "*" },
    "enableAllowlist": { "type": "bool", "defaultValue": false },
    "location": { "type": "string", "defaultValue": "[resourceGroup().location]" }
  }
}
```

**Acceptance Criteria:**
- [ ] One-click deployment works from Azure Portal
- [ ] All settings configurable via parameters
- [ ] Consumption plan for cost efficiency
- [ ] Deployment completes in < 5 minutes

---

### ST-002-06: Create Bicep Template (Modern Alternative)
**Status:** `[x]` Completed
**Test File:** N/A (infrastructure task)

**Description:**
Create Bicep template as a modern alternative to ARM templates. Bicep offers cleaner syntax and better tooling.

**Steps:**
1. Create `main.bicep` file
2. Define all resources with parameters
3. Add output for function URL
4. Create `bicepconfig.json` for linting

**Bicep Template:**
```bicep
// main.bicep
@description('Name of the Function App')
param functionAppName string

@description('Location for resources')
param location string = resourceGroup().location

@description('Allowed domains (comma-separated, supports wildcards)')
param allowedDomains string = '*'

@description('Enable domain allowlist')
param enableAllowlist bool = false

@description('Enable Azure AD authentication')
param enableAadAuth bool = false

@description('Azure AD Client ID (required if enableAadAuth is true)')
param aadClientId string = ''

var storageAccountName = 'st${uniqueString(resourceGroup().id)}'
var hostingPlanName = '${functionAppName}-plan'
var appInsightsName = '${functionAppName}-insights'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource hostingPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~20' }
        { name: 'AzureWebJobsStorage', value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}' }
        { name: 'APPINSIGHTS_INSTRUMENTATIONKEY', value: appInsights.properties.InstrumentationKey }
        { name: 'ALLOWED_DOMAINS', value: allowedDomains }
        { name: 'ENABLE_ALLOWLIST', value: string(enableAllowlist) }
        { name: 'ENABLE_AAD_AUTH', value: string(enableAadAuth) }
        { name: 'AAD_CLIENT_ID', value: aadClientId }
      ]
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
    }
  }
}

output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output functionAppName string = functionApp.name
```

**Deployment:**
```bash
# Using Azure CLI
az deployment group create \
  --resource-group rg-rss-proxy \
  --template-file main.bicep \
  --parameters functionAppName=fn-rss-proxy-contoso

# Using PowerShell
New-AzResourceGroupDeployment `
  -ResourceGroupName rg-rss-proxy `
  -TemplateFile main.bicep `
  -functionAppName fn-rss-proxy-contoso
```

**Acceptance Criteria:**
- [ ] Bicep template deploys successfully
- [ ] All ARM template features available in Bicep
- [ ] Linting passes with bicepconfig.json
- [ ] README documents both ARM and Bicep options

---

### ST-002-07: Create Deployment Scripts
**Status:** `[x]` Completed
**Test File:** N/A (infrastructure task)

**Description:**
Create PowerShell and Bash scripts for CLI deployment.

**Steps:**
1. Create `deploy.ps1` (PowerShell)
2. Create `deploy.sh` (Bash)
3. Support parameter input
4. Validate prerequisites (Azure CLI, subscription)
5. Output function URL after deployment

**Script Usage:**
```powershell
./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-contoso" -AllowedDomains "*.contoso.com"
```

**Acceptance Criteria:**
- [ ] Scripts work on Windows (PowerShell) and Mac/Linux (Bash)
- [ ] Clear error messages for missing prerequisites
- [ ] Output includes function URL for webpart configuration

---

### ST-002-07b: Update ProxyService in WebPart
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Update the webpart's ProxyService to use tenant's Azure Function as primary proxy.

**Steps:**
1. Add `proxyUrl` property to webpart configuration
2. Update ProxyService to use configured proxy first
3. Keep fallback proxies for backward compatibility
4. Add connection test on configuration

**Updated Proxy Chain:**
```
1. Configured Azure Function proxy (primary)
2. AllOrigins.win (fallback 1)
3. CorsProxy.io (fallback 2)
4. Direct fetch (last resort)
```

**Acceptance Criteria:**
- [ ] Webpart uses configured proxy URL
- [ ] Fallback chain still works
- [ ] Property pane has proxy URL field
- [ ] Connection test validates proxy

---

### ST-002-08: Add Health Check Endpoint
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyService.test.ts`

**Description:**
Add health check endpoint to Azure Function for monitoring.

**Steps:**
1. Create `/api/health` endpoint
2. Return status, version, and configuration summary
3. Use for webpart connection validation

**Health Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "allowlistEnabled": true,
  "timestamp": "2025-11-24T12:00:00Z"
}
```

**Acceptance Criteria:**
- [ ] Health endpoint returns quickly (< 100ms)
- [ ] No authentication required for health check
- [ ] Response includes useful diagnostics

---

### ST-002-09: Add Monitoring and Logging
**Status:** `[x]` Completed
**Test File:** N/A (infrastructure task)

**Description:**
Configure Application Insights for monitoring and create log queries.

**Steps:**
1. Enable Application Insights in ARM template
2. Add structured logging in function
3. Create sample KQL queries for common scenarios
4. Document monitoring setup

**Log Events:**
- Request received (URL, IP, timestamp)
- Request blocked (reason)
- Upstream error (status, message)
- Request completed (duration, status)

**Acceptance Criteria:**
- [ ] All requests logged with correlation ID
- [ ] Errors include stack traces
- [ ] Sample queries documented
- [ ] Dashboard template provided

---

### ST-002-10: Create Admin Documentation
**Status:** `[x]` Completed
**Test File:** N/A (documentation task)

**Description:**
Create comprehensive deployment and configuration guide for tenant admins.

**Steps:**
1. Write deployment guide with screenshots
2. Document configuration options
3. Include troubleshooting section
4. Add cost estimation guide

**Documentation Sections:**
1. Prerequisites
2. Deployment Options (Portal/CLI)
3. Configuration Reference
4. Webpart Configuration
5. Monitoring Setup
6. Troubleshooting
7. Cost Optimization

**Acceptance Criteria:**
- [ ] Non-technical admin can deploy using guide
- [ ] All configuration options documented
- [ ] Cost estimates included
- [ ] Troubleshooting covers common issues

---

## Cost Estimation

| Resource | Estimated Cost (USD/month) |
|----------|---------------------------|
| Function App (Consumption) | $0 - $5 (first 1M requests free) |
| Storage Account | ~$1 |
| Application Insights | $0 - $3 (based on volume) |
| **Total** | **$1 - $9/month** |

## Files to Create/Modify

```
CORS-Proxy/
├── HttpProxy/
│   ├── index.ts           # Main function
│   ├── function.json      # Function config
│   └── utils/
│       ├── validation.ts  # URL validation
│       ├── allowlist.ts   # Allowlist logic
│       └── logging.ts     # Structured logging
├── health/
│   ├── index.ts           # Health check function
│   └── function.json
├── host.json              # Host configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── azuredeploy.json       # ARM template
├── azuredeploy.parameters.json
├── deploy.ps1             # PowerShell script
├── deploy.sh              # Bash script
└── README.md              # Admin guide

src/webparts/polRssGallery/
├── services/
│   └── proxyService.ts    # Updated proxy service
```

---

### ST-002-11: Optional Azure AD Authentication
**Status:** `[x]` Completed
**Test File:** `tests/services/proxyAuth.test.ts`

**Description:**
Add optional Azure AD authentication to prevent unauthorized proxy usage. This is recommended for enterprise deployments.

**Steps:**
1. Create Azure AD app registration for proxy
2. Configure Function App authentication
3. Update webpart to acquire and send tokens
4. Add fallback for unauthenticated mode

**Azure AD App Setup:**
```bash
# Create app registration
az ad app create \
  --display-name "RSS Proxy - Contoso" \
  --sign-in-audience AzureADMyOrg \
  --web-redirect-uris "https://fn-rss-proxy-contoso.azurewebsites.net/.auth/login/aad/callback"

# Create service principal
az ad sp create --id <app-id>
```

**Function Configuration:**
```json
// host.json authentication settings
{
  "extensions": {
    "http": {
      "routePrefix": "api"
    }
  }
}
```

**WebPart Token Acquisition:**
```typescript
// Using AadHttpClient from SPFx
const aadClient = await this.context.aadHttpClientFactory.getClient(clientId);
const response = await aadClient.get(proxyUrl, AadHttpClient.configurations.v1);
```

**Acceptance Criteria:**
- [ ] AAD authentication works when enabled
- [ ] Tokens automatically refreshed by SPFx
- [ ] Fallback to unauthenticated mode when disabled
- [ ] Setup documented with screenshots

---

## Security Considerations

1. **URL Allowlist**: Prevents proxy from being used to access arbitrary URLs
2. **Rate Limiting**: Prevents abuse and cost overruns
3. **No Credentials Storage**: Proxy doesn't store any secrets
4. **HTTPS Only**: All communication over TLS
5. **Input Validation**: Sanitize all incoming URLs
6. **Azure AD Authentication** (Optional): Prevents unauthorized access to proxy

## Related Tasks

- **REF-004-ERROR-HANDLING:** Proxy errors need proper handling in webpart
- **REF-008-PROPERTY-PANE:** Proxy URL configuration in property pane
