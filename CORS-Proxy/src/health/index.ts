import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllowlist } from '../utils/allowlist';
import { getRateLimiter } from '../utils/rateLimit';

const PROXY_VERSION = '1.0.0';

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  configuration: {
    allowlistEnabled: boolean;
    allowlistPatterns: number;
    rateLimitEnabled: boolean;
    rateLimitRequests: string;
    rateLimitWindowSeconds: string;
  };
  uptime: number;
}

const startTime = Date.now();

async function healthCheck(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const allowlist = getAllowlist();
  const rateLimiter = getRateLimiter();

  const health: HealthResponse = {
    status: 'healthy',
    version: PROXY_VERSION,
    timestamp: new Date().toISOString(),
    configuration: {
      allowlistEnabled: allowlist.isEnabled(),
      allowlistPatterns: allowlist.getPatternCount(),
      rateLimitEnabled: rateLimiter.isEnabled(),
      rateLimitRequests: process.env.RATE_LIMIT_REQUESTS || '100',
      rateLimitWindowSeconds: process.env.RATE_LIMIT_WINDOW_SECONDS || '60'
    },
    uptime: Math.floor((Date.now() - startTime) / 1000)
  };

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    },
    jsonBody: health
  };
}

// Register the function - no auth required for health check
app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck
});

export default healthCheck;
