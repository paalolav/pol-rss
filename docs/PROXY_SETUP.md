# CORS Proxy Setup Guide

> **Version:** 1.3.0
> **Last Updated:** November 2025

This guide explains how to deploy and configure the Azure Function CORS proxy for the POL RSS Gallery web part.

## Table of Contents

1. [When Do You Need a Proxy?](#when-do-you-need-a-proxy)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [Detailed Deployment](#detailed-deployment)
5. [Configuration Options](#configuration-options)
6. [WebPart Configuration](#webpart-configuration)
7. [Security Hardening](#security-hardening)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimation](#cost-estimation)

---

## When Do You Need a Proxy?

### Required For

- **External RSS feeds** (news sites, blogs, aggregators like NRK, VG, E24)
- **Meltwater/Retriever feeds** (require authentication headers)
- **Any feed that doesn't send CORS headers**

### Not Required For

- SharePoint lists with RSS views
- Internal feeds that include `Access-Control-Allow-Origin: *` header
- Feeds from servers you control

### How to Check

```bash
curl -I "https://example.com/feed.rss" | grep -i "access-control"
```

If you see `access-control-allow-origin: *`, the feed works without a proxy.

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  SPFx WebPart   │────>│  Azure Function      │────>│  RSS Feed       │
│  (SharePoint)   │<────│  CORS Proxy          │<────│  (External)     │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ URL Allowlist│
                        │ Rate Limiting│
                        │ SSRF Protection│
                        └──────────────┘
```

The proxy:
1. Receives requests from your SharePoint site
2. Validates the target URL against an allowlist
3. Fetches the RSS feed server-side (bypassing CORS)
4. Returns the feed with appropriate CORS headers

---

## Quick Start

### Option A: Azure CLI (Recommended)

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name rg-rss-proxy --location westeurope

# 3. Deploy using Bicep template
az deployment group create \
  --resource-group rg-rss-proxy \
  --template-file CORS-Proxy/main.bicep \
  --parameters functionAppName=fn-rss-proxy-yourorg

# 4. Get the function URL
az functionapp show \
  --name fn-rss-proxy-yourorg \
  --resource-group rg-rss-proxy \
  --query "defaultHostName" -o tsv
```

### Option B: PowerShell

```powershell
# Windows
cd CORS-Proxy/scripts
./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-yourorg"
```

### Option C: Bash

```bash
# Mac/Linux
cd CORS-Proxy/scripts
chmod +x deploy.sh
./deploy.sh -g "rg-rss-proxy" -n "fn-rss-proxy-yourorg"
```

---

## Detailed Deployment

### Prerequisites

- Azure subscription
- Azure CLI installed ([Install Guide](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Contributor permissions on the subscription

### Step 1: Clone the Repository

```bash
git clone https://github.com/paalolav/pol-rss.git
cd pol-rss
```

### Step 2: Deploy the Function App

Using the Bicep template (recommended):

```bash
# Create resource group
az group create \
  --name rg-rss-proxy \
  --location westeurope

# Deploy with domain allowlist
az deployment group create \
  --resource-group rg-rss-proxy \
  --template-file CORS-Proxy/main.bicep \
  --parameters \
    functionAppName=fn-rss-proxy-yourorg \
    allowedDomains="*.nrk.no,*.vg.no,*.e24.no,meltwater.com" \
    enableAllowlist=true
```

Or using the ARM template:

```bash
az deployment group create \
  --resource-group rg-rss-proxy \
  --template-file CORS-Proxy/azuredeploy.json \
  --parameters functionAppName=fn-rss-proxy-yourorg
```

### Step 3: Deploy the Function Code

```bash
# Navigate to proxy folder
cd CORS-Proxy

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy to Azure
func azure functionapp publish fn-rss-proxy-yourorg
```

### Step 4: Get the Function Key

```bash
az functionapp keys list \
  --name fn-rss-proxy-yourorg \
  --resource-group rg-rss-proxy \
  --query "functionKeys.default" -o tsv
```

### Step 5: Test the Proxy

```bash
# Health check
curl "https://fn-rss-proxy-yourorg.azurewebsites.net/api/health"

# Test feed fetch (replace with your function key)
curl "https://fn-rss-proxy-yourorg.azurewebsites.net/api/proxy?url=https://www.nrk.no/toppsaker.rss&code=YOUR_FUNCTION_KEY"
```

---

## Configuration Options

### Environment Variables

Configure these in Azure Portal → Function App → Configuration → Application Settings:

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_DOMAINS` | `*` | Comma-separated domains (supports wildcards) |
| `ENABLE_ALLOWLIST` | `false` | Enable domain restriction |
| `RATE_LIMIT_REQUESTS` | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate limit window |
| `REQUEST_TIMEOUT_MS` | `30000` | Upstream request timeout |

### Domain Allowlist Examples

```bash
# Allow all (not recommended for production)
ALLOWED_DOMAINS="*"

# Norwegian news sites only
ALLOWED_DOMAINS="*.nrk.no,*.vg.no,*.e24.no,*.tv2.no,*.dagbladet.no"

# Specific domains
ALLOWED_DOMAINS="www.nrk.no,feeds.vg.no,meltwater.com"

# Wildcard subdomains
ALLOWED_DOMAINS="*.nrk.no"  # Allows www.nrk.no, sport.nrk.no, etc.
```

---

## WebPart Configuration

After deploying the proxy, configure it in the web part:

1. **Edit the page** containing the RSS web part
2. **Click the web part** to open property pane
3. **Expand "Advanced Settings"**
4. **Enter the Proxy URL**:
   ```
   https://fn-rss-proxy-yourorg.azurewebsites.net/api/proxy?code=YOUR_FUNCTION_KEY
   ```
5. **Click "Test Connection"** to verify

### Proxy URL Format

```
https://<function-name>.azurewebsites.net/api/proxy?code=<function-key>
```

The web part will automatically append `&url=<feed-url>` when making requests.

---

## Security Hardening

### 1. Enable Domain Allowlist

```bash
az functionapp config appsettings set \
  --name fn-rss-proxy-yourorg \
  --resource-group rg-rss-proxy \
  --settings ENABLE_ALLOWLIST=true ALLOWED_DOMAINS="*.nrk.no,*.vg.no"
```

### 2. Enable Azure AD Authentication (Optional)

For enterprise deployments:

```bash
# Create app registration
az ad app create \
  --display-name "RSS Proxy - YourOrg" \
  --sign-in-audience AzureADMyOrg

# Configure Function App authentication in Azure Portal
# Settings → Authentication → Add identity provider → Microsoft
```

### 3. Restrict CORS Origins

By default, the proxy allows all origins. To restrict:

```bash
az functionapp cors add \
  --name fn-rss-proxy-yourorg \
  --resource-group rg-rss-proxy \
  --allowed-origins "https://yourorg.sharepoint.com"
```

### 4. SSRF Protection

The proxy automatically blocks:
- Private IP ranges (10.x.x.x, 172.16.x.x, 192.168.x.x)
- Localhost (127.0.0.1, ::1)
- Cloud metadata endpoints (169.254.169.254)
- Internal Azure resources

---

## Monitoring

### Application Insights

The deployment includes Application Insights. View metrics in Azure Portal:

1. Navigate to your Function App
2. Click **Application Insights** in the left menu
3. View **Live Metrics**, **Failures**, **Performance**

### Useful KQL Queries

```kusto
// Requests per domain
requests
| where name == "proxy"
| extend domain = tostring(parse_url(customDimensions.targetUrl).Host)
| summarize count() by domain
| order by count_ desc

// Error rate
requests
| where name == "proxy"
| summarize
    total = count(),
    errors = countif(resultCode >= 400)
| extend errorRate = round(100.0 * errors / total, 2)

// Rate limited requests
requests
| where resultCode == 429
| summarize count() by bin(timestamp, 1h)
```

---

## Troubleshooting

### "Failed to fetch feed"

1. **Check proxy URL** is correct in web part settings
2. **Test proxy health**: `curl https://your-proxy/api/health`
3. **Check function logs** in Azure Portal → Monitor → Logs

### "403 Forbidden"

- Domain not in allowlist
- Add the domain to `ALLOWED_DOMAINS` setting

### "429 Too Many Requests"

- Rate limit exceeded
- Increase `RATE_LIMIT_REQUESTS` or wait for window to reset

### "502 Bad Gateway"

- Upstream feed server error
- Check if the feed URL works directly in browser
- Increase `REQUEST_TIMEOUT_MS` for slow feeds

### Debug Mode

Enable detailed logging in the web part:

1. Add `?rssDebug` to page URL
2. Debug console shows request/response details
3. Check browser Network tab for actual requests

---

## Cost Estimation

The proxy uses Azure Consumption plan for minimal cost:

| Resource | Estimated Cost (USD/month) |
|----------|---------------------------|
| Function App (Consumption) | $0 - $5 (first 1M requests free) |
| Storage Account | ~$1 |
| Application Insights | $0 - $3 (based on volume) |
| **Total** | **$1 - $9/month** |

### Cost Optimization Tips

1. **Use Consumption plan** (included in template)
2. **Enable caching** in web part to reduce requests
3. **Set appropriate cache TTL** (default 5 minutes)
4. **Monitor usage** in Application Insights

---

## Resources

- [POL RSS Gallery Documentation](./README.md)
- [Admin Guide](./admin-guide.md)
- [Security Checklist](./SECURITY_CHECKLIST.md)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)

---

## Support

For issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Application Insights logs
3. Open an issue on [GitHub](https://github.com/paalolav/pol-rss/issues)
