/**
 * Simple in-memory rate limiting for Azure Functions
 * Note: For production with multiple instances, consider using Azure Cache for Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private enabled: boolean;

  constructor() {
    this.maxRequests = parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10);
    this.windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10) * 1000;
    this.enabled = process.env.ENABLE_RATE_LIMIT !== 'false';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public check(clientId: string): RateLimitResult {
    if (!this.enabled) {
      return { allowed: true, remaining: this.maxRequests, resetAt: 0 };
    }

    const now = Date.now();
    const entry = this.store.get(clientId);

    // Cleanup old entries periodically (every 100 checks)
    if (Math.random() < 0.01) {
      this.cleanup(now);
    }

    if (!entry || now > entry.resetTime) {
      // New window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs
      };
      this.store.set(clientId, newEntry);

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: newEntry.resetTime
      };
    }

    // Existing window
    entry.count++;

    if (entry.count > this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetTime
      };
    }

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetAt: entry.resetTime
    };
  }

  public getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, result.remaining).toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString()
    };
  }

  private cleanup(now: number): void {
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter();
  }
  return rateLimiterInstance;
}

// Reset for testing
export function resetRateLimiter(): void {
  rateLimiterInstance = null;
}

/**
 * Extract client identifier for rate limiting
 * Uses X-Forwarded-For header (common in Azure) or falls back to a default
 */
export function getClientId(request: { headers: Record<string, string | undefined> }): string {
  // Azure Functions often use these headers
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs; take the first (client IP)
    return forwarded.split(',')[0].trim();
  }

  const clientIp = request.headers['x-client-ip'] || request.headers['x-real-ip'];
  if (clientIp) {
    return clientIp;
  }

  // Fallback - this shouldn't happen in production
  return 'unknown-client';
}
