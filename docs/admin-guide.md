# POL RSS Gallery - Administrator Guide

> Version: 1.3.0
> Last Updated: November 2025

This guide covers deployment and configuration of the POL RSS Gallery web part for SharePoint administrators.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [CORS Proxy Setup (Optional)](#cors-proxy-setup-optional)
4. [Tenant Configuration](#tenant-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Security Considerations](#security-considerations)

---

## Prerequisites

### Required

- **SharePoint Online** - Microsoft 365 tenant with SharePoint Online
- **App Catalog** - Access to tenant or site collection app catalog
- **Permissions** - SharePoint Administrator or Site Collection Administrator

### Optional (for CORS Proxy)

- **Azure Subscription** - For deploying the CORS proxy function
- **Azure CLI** - For command-line deployment ([Install Guide](https://docs.microsoft.com/cli/azure/install-azure-cli))

---

## Installation

### Step 1: Download the Package

Download the latest `pol-rss-gallery.sppkg` file from the project releases.

### Step 2: Upload to App Catalog

#### Tenant-Wide Deployment (Recommended)

1. Navigate to your **SharePoint Admin Center**
2. Go to **More features** → **Apps** → **Open** → **App Catalog**
3. If no App Catalog exists, create one first
4. Select **Apps for SharePoint** in the left navigation
5. Click **Upload** and select the `.sppkg` file
6. In the trust dialog:
   - Check **"Make this solution available to all sites in the organization"**
   - Click **Deploy**

#### Site Collection Deployment

1. Navigate to your site collection's App Catalog (if configured)
2. Upload the `.sppkg` file
3. Trust and deploy for that site collection only

### Step 3: Verify Installation

1. Edit any SharePoint page
2. Click **+ Add a web part**
3. Search for "RSS" or "POL RSS Gallery"
4. The web part should appear in the list

---

## CORS Proxy Setup (Optional)

Many RSS feeds require a CORS proxy to load in SharePoint due to browser security restrictions. The POL RSS Gallery works without a proxy for feeds that support CORS, but for maximum compatibility, we recommend deploying the included Azure Function proxy.

### When Do You Need a Proxy?

- **Required**: External feeds (news sites, blogs, aggregators)
- **Not Required**: SharePoint lists, internal feeds with CORS headers

### Deployment Options

#### Option A: Quick Deploy (PowerShell)

```powershell
# Windows
cd CORS-Proxy/scripts
./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-yourorg"
```

#### Option B: Quick Deploy (Bash)

```bash
# Mac/Linux
cd CORS-Proxy/scripts
chmod +x deploy.sh
./deploy.sh -g "rg-rss-proxy" -n "fn-rss-proxy-yourorg"
```

#### Option C: Azure Portal

1. Click the "Deploy to Azure" button (if available) or:
2. Create a new **Function App** in Azure Portal
3. Choose **Consumption plan** for cost-effectiveness
4. Deploy the code from the `CORS-Proxy` folder

### Post-Deployment Configuration

After deploying the proxy:

1. **Get the Function URL**:
   ```
   https://fn-rss-proxy-yourorg.azurewebsites.net/api/proxy
   ```

2. **Get the Function Key**:
   ```bash
   az functionapp keys list \
     --name fn-rss-proxy-yourorg \
     --resource-group rg-rss-proxy \
     --query "functionKeys.default" -o tsv
   ```

3. **Configure Allowed Domains** (recommended for production):
   - Go to Azure Portal → Function App → Configuration
   - Add `ALLOWED_DOMAINS`: `*.nrk.no,*.vg.no,meltwater.com`
   - Set `ENABLE_ALLOWLIST`: `true`

### Proxy Cost Estimation

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| Function App (Consumption) | $0-5 |
| Storage Account | ~$1 |
| Application Insights | $0-3 |
| **Total** | **$1-9/month** |

For detailed proxy documentation, see [CORS-Proxy/README.md](../CORS-Proxy/README.md).

---

## Tenant Configuration

### Recommended Property Pane Defaults

Administrators can pre-configure default values by modifying the web part manifest. However, for most scenarios, page editors configure settings per-instance.

### Network Requirements

Ensure the following domains are accessible from SharePoint:

| Domain | Purpose |
|--------|---------|
| Your RSS feed domains | Feed content |
| Your Azure Function URL | CORS proxy (if deployed) |
| `allorigins.win` | Fallback proxy |
| `corsproxy.io` | Fallback proxy |

### Content Security Policy (CSP)

The web part is designed to work within SharePoint's CSP restrictions:
- Uses DOMPurify for HTML sanitization
- All images lazy-load with `loading="lazy"`
- No inline scripts or external JavaScript

---

## Troubleshooting

### Feed Not Loading

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Failed to fetch feed" | CORS blocked | Deploy and configure the proxy |
| "Invalid feed format" | Non-RSS content | Verify the URL returns RSS/Atom XML |
| No items displayed | Empty feed or filtering | Check feed has items; disable filters |

### CORS Errors

1. **Check if feed supports CORS**:
   ```bash
   curl -I "https://example.com/feed.rss"
   # Look for: Access-Control-Allow-Origin
   ```

2. **Configure proxy in web part**:
   - Edit web part properties
   - Expand "Advanced Settings"
   - Enter your proxy URL

3. **Test proxy health**:
   ```bash
   curl "https://your-proxy.azurewebsites.net/api/health"
   ```

### Performance Issues

| Issue | Solution |
|-------|----------|
| Slow initial load | Normal cold start for Azure Function (~1-2s) |
| High refresh rate | Increase cache duration in property pane |
| Many items | Reduce "Maximum items" setting |

### Debug Mode

For advanced troubleshooting, enable debug mode:

1. Navigate to the page with the web part
2. Add `?rssDebug` or `?debugRss` to the URL
3. A debug console will appear with detailed logging
4. Remove the parameter to disable

---

## Security Considerations

### Content Sanitization

All feed content is sanitized using DOMPurify to prevent XSS attacks. This includes:
- HTML in item descriptions
- URLs in images and links
- RSS/Atom metadata

### SSRF Protection

The CORS proxy blocks requests to:
- Private IP ranges (10.x.x.x, 192.168.x.x, etc.)
- Localhost addresses
- Cloud metadata endpoints
- Internal Azure resources

### Authentication

For enterprise deployments requiring additional security:
1. Enable Azure AD authentication on the proxy
2. Configure function keys for API access
3. Implement domain allowlists

### Best Practices

1. **Enable domain allowlist** in production proxy deployments
2. **Use HTTPS** for all feed URLs
3. **Review feed sources** before allowing in property pane
4. **Monitor proxy usage** via Application Insights
5. **Rotate function keys** periodically

---

## Support

For issues and feature requests:
- Check the [Troubleshooting](#troubleshooting) section above
- Review [docs/SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for security auditing
- Contact your SharePoint administrator

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.3.0 | Nov 2025 | Gallery layout, source display, security hardening |
| 1.2.0 | Jun 2024 | TypeScript strictness, code cleanup |
| 1.1.0 | Mar 2021 | SPFx 1.21 upgrade |
| 1.0.0 | Jan 2021 | Initial release |
