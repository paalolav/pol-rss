/**
 * URL Validation utilities for CORS Proxy
 */

export interface ValidationResult {
  valid: boolean;
  url?: string;
  error?: string;
}

const BLOCKED_PROTOCOLS = ['file:', 'javascript:', 'data:', 'vbscript:'];
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
const MAX_URL_LENGTH = 2048;

export function validateUrl(urlParam: string | undefined | null): ValidationResult {
  // Check if URL is provided
  if (!urlParam || typeof urlParam !== 'string') {
    return { valid: false, error: 'Missing required parameter: url' };
  }

  const url = urlParam.trim();

  // Check URL length
  if (url.length > MAX_URL_LENGTH) {
    return { valid: false, error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters` };
  }

  // Try to parse the URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Check protocol
  const protocol = parsedUrl.protocol.toLowerCase();
  if (!protocol.startsWith('http')) {
    return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
  }

  if (BLOCKED_PROTOCOLS.includes(protocol)) {
    return { valid: false, error: `Protocol ${protocol} is not allowed` };
  }

  // Check for blocked hosts (prevent SSRF to internal resources)
  const hostname = parsedUrl.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    return { valid: false, error: 'Access to local addresses is not allowed' };
  }

  // Check for private IP ranges (basic SSRF protection)
  if (isPrivateIP(hostname)) {
    return { valid: false, error: 'Access to private IP addresses is not allowed' };
  }

  // Check for metadata endpoints (cloud provider protection)
  if (isMetadataEndpoint(hostname)) {
    return { valid: false, error: 'Access to cloud metadata endpoints is not allowed' };
  }

  return { valid: true, url: parsedUrl.href };
}

function isPrivateIP(hostname: string): boolean {
  // Check for IPv4 private ranges
  const ipv4Patterns = [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,           // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
    /^192\.168\.\d{1,3}\.\d{1,3}$/,               // 192.168.0.0/16
    /^169\.254\.\d{1,3}\.\d{1,3}$/                // Link-local
  ];

  return ipv4Patterns.some(pattern => pattern.test(hostname));
}

function isMetadataEndpoint(hostname: string): boolean {
  // Block common cloud metadata endpoints
  const metadataHosts = [
    '169.254.169.254',           // AWS, Azure, GCP metadata
    'metadata.google.internal',  // GCP
    'metadata.azure.com',        // Azure
    'instance-data'              // AWS
  ];

  return metadataHosts.some(host => hostname.includes(host));
}

export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  // Headers that should not be forwarded
  const blockedHeaders = [
    'host',
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'cookie',
    'set-cookie'
  ];

  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (!blockedHeaders.includes(lowerKey) && typeof value === 'string') {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
