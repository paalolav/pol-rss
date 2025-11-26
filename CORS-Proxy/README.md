# POL RSS CORS Proxy

Azure Function CORS proxy for the POL RSS Gallery SPFx WebPart. This proxy enables SharePoint to fetch RSS feeds from external sources that don't support CORS.

## Features

- **CORS Support**: Adds proper CORS headers to enable cross-origin requests
- **URL Allowlist**: Restrict which domains can be fetched (optional)
- **Rate Limiting**: Prevent abuse with configurable request limits
- **Health Endpoint**: Monitor proxy status without authentication
- **Structured Logging**: Application Insights integration for monitoring
- **SSRF Protection**: Blocks requests to internal/private networks
- **Azure AD Authentication**: Optional authentication for enterprise deployments

## Quick Start

### Prerequisites

- Azure subscription
- Azure CLI installed ([Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Node.js 18+ (for building)

### One-Click Deployment

#### Using PowerShell (Windows)

```powershell
cd CORS-Proxy/scripts
./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-contoso"
```

#### Using Bash (Mac/Linux)

```bash
cd CORS-Proxy/scripts
chmod +x deploy.sh
./deploy.sh -g "rg-rss-proxy" -n "fn-rss-proxy-contoso"
```

### Manual Deployment

1. **Create Resource Group** (if needed):
   ```bash
   az group create --name rg-rss-proxy --location norwayeast
   ```

2. **Deploy Infrastructure** (using Bicep):
   ```bash
   az deployment group create \
     --resource-group rg-rss-proxy \
     --template-file infra/main.bicep \
     --parameters functionAppName=fn-rss-proxy-contoso
   ```

3. **Build and Deploy Code**:
   ```bash
   npm install
   npm run build

   # Create deployment package
   zip -r deploy.zip dist host.json package.json package-lock.json

   # Deploy to Azure
   az functionapp deployment source config-zip \
     --resource-group rg-rss-proxy \
     --name fn-rss-proxy-contoso \
     --src deploy.zip
   ```

4. **Get Function Key**:
   ```bash
   az functionapp keys list \
     --name fn-rss-proxy-contoso \
     --resource-group rg-rss-proxy \
     --query "functionKeys.default" -o tsv
   ```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_DOMAINS` | `*` | Comma-separated list of allowed domains. Supports wildcards (e.g., `*.nrk.no,*.vg.no`) |
| `ENABLE_ALLOWLIST` | `false` | Enable domain allowlist validation |
| `ENABLE_RATE_LIMIT` | `true` | Enable rate limiting |
| `RATE_LIMIT_REQUESTS` | `100` | Maximum requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate limit window in seconds |

### Configuring Allowed Domains

To restrict which domains can be fetched through the proxy:

1. Go to Azure Portal → Function App → Configuration
2. Add/modify `ALLOWED_DOMAINS` with comma-separated values:
   ```
   *.nrk.no,*.vg.no,meltwater.com,feeds.feedburner.com
   ```
3. Set `ENABLE_ALLOWLIST` to `true`
4. Save and restart the Function App

### Domain Pattern Examples

| Pattern | Matches |
|---------|---------|
| `*` | All domains (allowlist disabled) |
| `nrk.no` | Exact domain only |
| `*.nrk.no` | Any subdomain of nrk.no |
| `*.rss.nrk.no` | Any subdomain of rss.nrk.no |

## API Reference

### Proxy Endpoint

**GET** `/api/proxy`

Fetches content from a remote URL and returns it with CORS headers.

**Query Parameters:**
- `code` (required): Function key for authentication
- `url` (required): The URL to fetch (URL-encoded)

**Example:**
```
GET /api/proxy?code=YOUR_FUNCTION_KEY&url=https%3A%2F%2Fwww.nrk.no%2Ftoppsaker.rss
```

**Response Headers:**
- `Access-Control-Allow-Origin: *`
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets

**Error Responses:**
| Status | Description |
|--------|-------------|
| 400 | Invalid or missing URL parameter |
| 403 | Domain not in allowlist |
| 429 | Rate limit exceeded |
| 502 | Failed to fetch from upstream |
| 504 | Upstream timeout |

### Health Endpoint

**GET** `/api/health`

Returns proxy status and configuration. No authentication required.

**Example Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-24T12:00:00.000Z",
  "configuration": {
    "allowlistEnabled": true,
    "allowlistPatterns": 5,
    "rateLimitEnabled": true,
    "rateLimitRequests": "100",
    "rateLimitWindowSeconds": "60"
  },
  "uptime": 3600
}
```

## WebPart Configuration

After deploying the proxy, configure the RSS Gallery WebPart to use it:

1. Edit the SharePoint page containing the WebPart
2. Open the WebPart property pane
3. In the "Proxy Settings" section:
   - **Proxy URL**: Enter the proxy endpoint URL (e.g., `https://fn-rss-proxy-contoso.azurewebsites.net/api/proxy`)
   - **Function Key**: Enter the function key from deployment

The WebPart will use your tenant proxy as the primary method, falling back to public proxies only if your proxy is unavailable.

## Monitoring

### Application Insights

The proxy automatically logs to Application Insights when deployed with the templates. View logs in:

1. Azure Portal → Function App → Application Insights
2. Or directly in Application Insights → Logs

### Useful KQL Queries

**Request summary (last 24 hours):**
```kusto
traces
| where timestamp > ago(24h)
| where message contains "REQUEST_"
| summarize count() by tostring(customDimensions.event)
```

**Failed requests:**
```kusto
traces
| where timestamp > ago(24h)
| where customDimensions.event == "UPSTREAM_ERROR" or customDimensions.event == "REQUEST_BLOCKED"
| project timestamp, url=customDimensions.url, reason=customDimensions.reason, error=customDimensions.error
| order by timestamp desc
```

**Rate limit violations:**
```kusto
traces
| where timestamp > ago(24h)
| where customDimensions.event == "RATE_LIMIT_EXCEEDED"
| summarize count() by bin(timestamp, 1h), clientIp=tostring(customDimensions.clientIp)
```

## Cost Estimation

| Resource | Estimated Cost (USD/month) |
|----------|---------------------------|
| Function App (Consumption) | $0 - $5 (first 1M requests free) |
| Storage Account | ~$1 |
| Application Insights | $0 - $3 (based on volume) |
| **Total** | **$1 - $9/month** |

The consumption plan is extremely cost-effective for typical RSS feed usage. You only pay for actual execution time.

## Troubleshooting

### Common Issues

**"Domain not in allowlist" error**
- Verify `ALLOWED_DOMAINS` includes the feed domain
- Check for typos in domain patterns
- Ensure `ENABLE_ALLOWLIST` is set correctly

**"Rate limit exceeded" error**
- Wait for the rate limit window to reset
- Consider increasing `RATE_LIMIT_REQUESTS` if legitimate
- Check for unusual traffic patterns

**Proxy returns HTML instead of XML**
- The target site may be blocking the proxy's User-Agent
- Try adding the feed domain to your allowlist
- Check if the feed URL is correct

**Proxy is slow or times out**
- Check the upstream feed response time
- Consider the consumption plan cold start (~1-2s for first request)
- Monitor Application Insights for performance data

### Testing the Proxy

Test your proxy with curl:

```bash
# Test health endpoint
curl "https://fn-rss-proxy-contoso.azurewebsites.net/api/health"

# Test proxy endpoint
curl "https://fn-rss-proxy-contoso.azurewebsites.net/api/proxy?code=YOUR_KEY&url=https://www.nrk.no/toppsaker.rss"
```

## Security Considerations

1. **Function Key**: Keep your function key secure. Don't commit it to source control.
2. **Allowlist**: Enable domain allowlist in production to prevent proxy abuse.
3. **Rate Limiting**: Keep rate limiting enabled to prevent cost overruns.
4. **HTTPS Only**: The proxy enforces HTTPS for all external requests.
5. **SSRF Protection**: Private IP ranges and cloud metadata endpoints are blocked.

## Optional: Azure AD Authentication

For enterprise deployments requiring stricter access control, enable Azure AD authentication:

1. Create an App Registration in Azure AD
2. Deploy with `enableAadAuth=true` and provide `aadClientId` and `aadTenantId`
3. Configure the WebPart to use AAD authentication (SPFx AadHttpClient)

See the [Bicep template](infra/main.bicep) for parameter details.

## License

MIT License - See the main project repository for details.
