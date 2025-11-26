/**
 * URL Allowlist for CORS Proxy
 * Supports wildcard patterns (e.g., *.nrk.no) and exact domain matching
 */

export class Allowlist {
  private patterns: RegExp[] = [];
  private enabled: boolean;
  private allowAll: boolean = false;

  constructor() {
    this.enabled = process.env.ENABLE_ALLOWLIST === 'true';
    this.parseAllowedDomains();
  }

  private parseAllowedDomains(): void {
    const allowedDomains = process.env.ALLOWED_DOMAINS || '*';

    if (allowedDomains.trim() === '*') {
      this.allowAll = true;
      return;
    }

    const domains = allowedDomains.split(',').map(d => d.trim()).filter(Boolean);

    this.patterns = domains.map(domain => {
      // Convert wildcard pattern to regex
      // *.example.com -> matches any subdomain of example.com
      // example.com -> matches exact domain
      const escaped = domain
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars except *
        .replace(/\*/g, '[a-zA-Z0-9-]+'); // Replace * with subdomain pattern

      return new RegExp(`^(https?://)?${escaped}(/.*)?$`, 'i');
    });
  }

  public isAllowed(url: string): boolean {
    // If allowlist is disabled, allow all
    if (!this.enabled) {
      return true;
    }

    // If allowAll is set (ALLOWED_DOMAINS=*), allow all
    if (this.allowAll) {
      return true;
    }

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Check if hostname matches any pattern
      return this.patterns.some(pattern => {
        return pattern.test(url) || pattern.test(hostname);
      });
    } catch {
      // Invalid URL - block it
      return false;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getPatternCount(): number {
    return this.patterns.length;
  }
}

// Singleton instance
let allowlistInstance: Allowlist | null = null;

export function getAllowlist(): Allowlist {
  if (!allowlistInstance) {
    allowlistInstance = new Allowlist();
  }
  return allowlistInstance;
}

// Reset for testing
export function resetAllowlist(): void {
  allowlistInstance = null;
}
