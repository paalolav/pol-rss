import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import fetch, { Response as FetchResponse } from 'node-fetch';
import { validateUrl, sanitizeHeaders } from '../utils/validation';
import { getAllowlist } from '../utils/allowlist';
import { getRateLimiter, getClientId } from '../utils/rateLimit';
import { Logger } from '../utils/logging';

const PROXY_VERSION = '1.0.0';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB

// CORS headers for all responses
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
  'X-Proxy-Version': PROXY_VERSION
};

async function httpProxy(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const logger = new Logger(context);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders
    };
  }

  // Extract client IP for rate limiting
  const headers: Record<string, string | undefined> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const clientId = getClientId({ headers });

  // Check rate limit
  const rateLimiter = getRateLimiter();
  const rateLimitResult = rateLimiter.check(clientId);

  if (!rateLimitResult.allowed) {
    logger.rateLimitExceeded(clientId);
    return {
      status: 429,
      headers: {
        ...corsHeaders,
        ...rateLimiter.getRateLimitHeaders(rateLimitResult),
        'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString()
      },
      jsonBody: {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      }
    };
  }

  // Get URL parameter
  const urlParam = request.query.get('url');
  logger.requestReceived(urlParam || 'no-url', clientId);

  // Validate URL
  const validation = validateUrl(urlParam);
  if (!validation.valid) {
    logger.requestBlocked(urlParam || 'no-url', validation.error || 'Invalid URL');
    return {
      status: 400,
      headers: {
        ...corsHeaders,
        ...rateLimiter.getRateLimitHeaders(rateLimitResult)
      },
      jsonBody: {
        error: 'Bad Request',
        message: validation.error
      }
    };
  }

  const targetUrl = validation.url!;

  // Check allowlist
  const allowlist = getAllowlist();
  if (!allowlist.isAllowed(targetUrl)) {
    logger.requestBlocked(targetUrl, 'Domain not in allowlist');
    return {
      status: 403,
      headers: {
        ...corsHeaders,
        ...rateLimiter.getRateLimitHeaders(rateLimitResult)
      },
      jsonBody: {
        error: 'Forbidden',
        message: 'This domain is not allowed. Contact your administrator to add it to the allowlist.'
      }
    };
  }

  // Prepare request headers
  const forwardHeaders: Record<string, string> = {
    'User-Agent': 'POL-RSS-Proxy/1.0 (Azure Function)',
    'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml, application/json, */*'
  };

  // Forward certain headers from original request
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    forwardHeaders['Authorization'] = authHeader;
  }

  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    forwardHeaders['X-API-Key'] = apiKeyHeader;
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    // Fetch the target URL
    let response: FetchResponse;
    try {
      response = await fetch(targetUrl, {
        method: 'GET',
        headers: forwardHeaders,
        signal: controller.signal,
        redirect: 'follow'
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Check response size (from Content-Length if available)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      logger.requestBlocked(targetUrl, 'Response too large');
      return {
        status: 502,
        headers: {
          ...corsHeaders,
          ...rateLimiter.getRateLimitHeaders(rateLimitResult)
        },
        jsonBody: {
          error: 'Bad Gateway',
          message: 'Response from upstream server is too large'
        }
      };
    }

    // Get response body
    const body = await response.text();

    // Check actual body size
    if (body.length > MAX_RESPONSE_SIZE) {
      logger.requestBlocked(targetUrl, 'Response body too large');
      return {
        status: 502,
        headers: {
          ...corsHeaders,
          ...rateLimiter.getRateLimitHeaders(rateLimitResult)
        },
        jsonBody: {
          error: 'Bad Gateway',
          message: 'Response from upstream server is too large'
        }
      };
    }

    // Forward response headers (sanitized)
    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      ...rateLimiter.getRateLimitHeaders(rateLimitResult)
    };

    // Preserve content type from upstream
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders['Content-Type'] = contentType;
    }

    // Add cache headers
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      responseHeaders['Cache-Control'] = cacheControl;
    }

    const etag = response.headers.get('etag');
    if (etag) {
      responseHeaders['ETag'] = etag;
    }

    const lastModified = response.headers.get('last-modified');
    if (lastModified) {
      responseHeaders['Last-Modified'] = lastModified;
    }

    logger.requestCompleted(targetUrl, response.status);

    return {
      status: response.status,
      headers: responseHeaders,
      body: body
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle timeout
    if (errorMessage.includes('aborted')) {
      logger.upstreamError(targetUrl, 504, 'Request timeout');
      return {
        status: 504,
        headers: {
          ...corsHeaders,
          ...rateLimiter.getRateLimitHeaders(rateLimitResult)
        },
        jsonBody: {
          error: 'Gateway Timeout',
          message: 'The upstream server did not respond in time'
        }
      };
    }

    // Handle other errors
    logger.upstreamError(targetUrl, 502, errorMessage);
    return {
      status: 502,
      headers: {
        ...corsHeaders,
        ...rateLimiter.getRateLimitHeaders(rateLimitResult)
      },
      jsonBody: {
        error: 'Bad Gateway',
        message: `Failed to fetch from upstream: ${errorMessage}`
      }
    };
  }
}

// Register the function
app.http('HttpProxy', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'function',
  route: 'proxy',
  handler: httpProxy
});

export default httpProxy;
