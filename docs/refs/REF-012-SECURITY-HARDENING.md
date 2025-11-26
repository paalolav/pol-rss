# REF-012: Security Hardening

## Overview
Implement comprehensive security measures to protect against XSS, SSRF, and other vulnerabilities when rendering RSS content from external sources.

## Priority
**CRITICAL** - Must be implemented before production deployment

## Dependencies
- REF-002 (Azure Proxy) - URL validation at proxy level
- REF-003 (Feed Parser) - Content sanitization during parsing

## Sub-Tasks

### ST-012-01: Implement DOMPurify Content Sanitization
**Status:** [ ] Not Started
**Complexity:** Medium
**Tests:** `tests/services/sanitizer.test.ts`

**Description:**
Install and configure DOMPurify to sanitize all HTML content from RSS feeds before rendering.

**Requirements:**
- Install DOMPurify package with TypeScript types
- Create `ContentSanitizer` service class
- Configure allowed HTML tags whitelist
- Configure allowed attributes whitelist
- Strip dangerous protocols (javascript:, data:, vbscript:)
- Handle CDATA content properly
- Preserve safe inline styles (optional, configurable)

**Implementation:**
```typescript
// src/webparts/polRssGallery/services/contentSanitizer.ts
import DOMPurify from 'dompurify';

export interface ISanitizerConfig {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowStyles?: boolean;
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const DEFAULT_ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'width', 'height',
  'target', 'rel', 'class',
];

export class ContentSanitizer {
  private config: ISanitizerConfig;

  constructor(config?: ISanitizerConfig) {
    this.config = config || {};
  }

  public sanitize(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: this.config.allowedTags || DEFAULT_ALLOWED_TAGS,
      ALLOWED_ATTR: this.config.allowedAttributes || DEFAULT_ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
  }

  public sanitizeText(text: string): string {
    // For plain text, escape HTML entities
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
```

**Acceptance Criteria:**
- [ ] DOMPurify installed and configured
- [ ] All HTML content sanitized before React rendering
- [ ] Script tags and event handlers removed
- [ ] Dangerous URI schemes blocked
- [ ] Unit tests cover XSS attack vectors
- [ ] Performance impact < 5ms per item

---

### ST-012-02: Add CSP-Compliant Rendering
**Status:** [ ] Not Started
**Complexity:** Medium
**Tests:** `tests/services/cspRenderer.test.ts`

**Description:**
Ensure all rendering is compatible with SharePoint's Content Security Policy.

**Requirements:**
- Avoid inline styles where possible (use CSS classes)
- Use CSS-in-JS solutions that work with CSP
- No eval() or new Function()
- No inline event handlers
- Dynamic content uses React's safe rendering

**Implementation:**
```typescript
// src/webparts/polRssGallery/utils/cspCompliance.ts

export const validateCspCompliance = {
  // Check if string contains potentially dangerous patterns
  hasDangerousContent(content: string): boolean {
    const dangerousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /on\w+\s*=/i,  // onclick, onerror, etc.
      /<script/i,
      /expression\s*\(/i,  // CSS expression
    ];
    return dangerousPatterns.some(p => p.test(content));
  },

  // Safe URL validation
  isSafeUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  // Safe image URL (additional checks)
  isSafeImageUrl(url: string): boolean {
    if (!this.isSafeUrl(url)) return false;
    // Could add additional checks like allowed domains
    return true;
  },
};
```

**Acceptance Criteria:**
- [ ] No CSP violations in browser console
- [ ] Works with strictest SharePoint CSP settings
- [ ] All dynamic styles use CSS classes or CSS variables
- [ ] No runtime code generation

---

### ST-012-03: URL Validation and SSRF Prevention
**Status:** [ ] Not Started
**Complexity:** High
**Tests:** `tests/services/urlValidator.test.ts`

**Description:**
Implement URL validation to prevent Server-Side Request Forgery (SSRF) attacks through the Azure proxy.

**Requirements:**
- Validate URLs before sending to proxy
- Block internal/private IP ranges
- Block localhost and loopback addresses
- Implement domain allowlist (optional)
- Validate URL schemes (http/https only)
- Handle URL redirects safely

**Implementation:**
```typescript
// src/webparts/polRssGallery/services/urlValidator.ts

export interface IUrlValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export class UrlValidator {
  private blockedPatterns: RegExp[] = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,  // Link-local
    /^0\./,
    /^\[::1\]/,     // IPv6 localhost
    /^\[fc/i,       // IPv6 private
    /^\[fd/i,       // IPv6 private
  ];

  public validate(url: string): IUrlValidationResult {
    // Check for empty/null
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required' };
    }

    // Parse URL
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Check protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Only HTTP(S) URLs allowed' };
    }

    // Check for blocked hostnames/IPs
    const hostname = parsed.hostname.toLowerCase();
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(hostname)) {
        return { isValid: false, error: 'Internal addresses not allowed' };
      }
    }

    // Block numeric IPs (optional, stricter)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      // Could allow specific IP ranges if needed
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.href,
    };
  }

  public validateFeedUrl(url: string): IUrlValidationResult {
    const result = this.validate(url);
    if (!result.isValid) return result;

    // Additional feed-specific validation could go here
    // e.g., checking for known feed URL patterns

    return result;
  }
}
```

**Azure Function Validation (server-side):**
```typescript
// azure-proxy/ValidateFeedUrl/index.ts
// Add to Azure Function for double validation

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254',  // AWS metadata
  'metadata.google.internal',  // GCP metadata
]);

function isBlockedHost(hostname: string): boolean {
  if (BLOCKED_HOSTS.has(hostname.toLowerCase())) return true;

  // Check private IP ranges
  const ipMatch = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipMatch) {
    const [, a, b] = ipMatch.map(Number);
    if (a === 10) return true;  // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12
    if (a === 192 && b === 168) return true;  // 192.168.0.0/16
    if (a === 127) return true;  // Loopback
  }

  return false;
}
```

**Acceptance Criteria:**
- [ ] Client-side URL validation before proxy call
- [ ] Server-side validation in Azure Function
- [ ] Private IP ranges blocked
- [ ] Cloud metadata endpoints blocked
- [ ] Only HTTP(S) schemes allowed
- [ ] Comprehensive test coverage for edge cases

---

### ST-012-04: Optional Proxy Authentication
**Status:** [ ] Not Started
**Complexity:** High
**Tests:** `tests/services/proxyAuth.test.ts`

**Description:**
Add optional Azure AD authentication for the CORS proxy to prevent unauthorized usage.

**Requirements:**
- Azure AD app registration for proxy
- Bearer token authentication
- Token caching and refresh
- Graceful fallback if auth disabled
- Clear documentation for setup

**Implementation:**
```typescript
// src/webparts/polRssGallery/services/proxyAuthService.ts
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProxyAuthConfig {
  enabled: boolean;
  clientId?: string;  // Azure AD App Client ID
}

export class ProxyAuthService {
  private context: WebPartContext;
  private aadClient: AadHttpClient | null = null;
  private config: IProxyAuthConfig;

  constructor(context: WebPartContext, config: IProxyAuthConfig) {
    this.context = context;
    this.config = config;
  }

  public async initialize(): Promise<void> {
    if (!this.config.enabled || !this.config.clientId) {
      return;
    }

    this.aadClient = await this.context.aadHttpClientFactory
      .getClient(this.config.clientId);
  }

  public async fetchWithAuth(url: string): Promise<Response> {
    if (this.aadClient) {
      const response = await this.aadClient.get(
        url,
        AadHttpClient.configurations.v1
      );
      return response as unknown as Response;
    }

    // Fallback to regular fetch if auth not enabled
    return fetch(url);
  }
}
```

**Acceptance Criteria:**
- [ ] AAD authentication works when enabled
- [ ] Token automatically refreshed
- [ ] Works without auth when disabled
- [ ] Setup documented in README
- [ ] Error handling for auth failures

---

### ST-012-05: Input Validation for Property Pane
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** `tests/webpart/propertyValidation.test.ts`

**Description:**
Validate all user inputs in the property pane to prevent injection attacks.

**Requirements:**
- Validate feed URLs
- Sanitize custom CSS input (if allowed)
- Validate numeric inputs (item count, etc.)
- Prevent script injection through configuration

**Implementation:**
```typescript
// src/webparts/polRssGallery/utils/propertyValidators.ts

export const PropertyValidators = {
  feedUrl(value: string): string | undefined {
    if (!value) return 'Feed URL is required';

    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'Only HTTP(S) URLs are allowed';
      }
    } catch {
      return 'Invalid URL format';
    }

    return undefined;  // Valid
  },

  itemCount(value: number): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a number';
    }
    if (value < 1 || value > 100) {
      return 'Must be between 1 and 100';
    }
    return undefined;
  },

  refreshInterval(value: number): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a number';
    }
    if (value < 1 || value > 1440) {  // 1 min to 24 hours
      return 'Must be between 1 and 1440 minutes';
    }
    return undefined;
  },

  // Prevent XSS in text inputs
  sanitizeText(value: string): string {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
};
```

**Acceptance Criteria:**
- [ ] All property pane inputs validated
- [ ] Invalid URLs rejected with clear message
- [ ] Numeric bounds enforced
- [ ] No script injection possible through config

---

### ST-012-06: Security Audit Checklist
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** N/A (Documentation)

**Description:**
Create a security audit checklist for pre-deployment review.

**Checklist:**
```markdown
## Pre-Deployment Security Checklist

### Content Security
- [ ] DOMPurify sanitizes all RSS content
- [ ] Script tags removed from content
- [ ] Event handlers stripped (onclick, onerror, etc.)
- [ ] javascript: URLs blocked
- [ ] data: URLs handled appropriately

### Network Security
- [ ] Only HTTPS feeds in production
- [ ] SSRF protection on proxy
- [ ] Private IPs blocked
- [ ] Cloud metadata endpoints blocked
- [ ] Rate limiting configured on Azure Function

### Authentication (if enabled)
- [ ] Azure AD app configured correctly
- [ ] API permissions minimized
- [ ] Token validation on server-side

### SharePoint Integration
- [ ] Works with CSP settings
- [ ] No inline scripts
- [ ] No eval() usage
- [ ] Permissions follow least-privilege

### Data Handling
- [ ] No sensitive data in local storage
- [ ] Cache encrypted if storing user data
- [ ] Error messages don't leak system info

### Dependency Security
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] Dependencies from trusted sources
- [ ] Lock file committed
```

**Acceptance Criteria:**
- [ ] Checklist created in docs/
- [ ] All items verified before release
- [ ] Part of release process

---

### ST-012-07: Dependency Security Audit
**Status:** [ ] Not Started
**Complexity:** Low
**Tests:** N/A (Process)

**Description:**
Audit and secure npm dependencies.

**Tasks:**
1. Run `npm audit` and fix vulnerabilities
2. Remove unused dependencies (comlink)
3. Lock dependency versions
4. Set up automated security scanning

**Commands:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Check for outdated packages
npm outdated

# Remove unused packages
npm uninstall comlink
```

**package.json additions:**
```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:check": "npm audit && npm outdated"
  }
}
```

**Acceptance Criteria:**
- [ ] No high/critical vulnerabilities
- [ ] Unused dependencies removed
- [ ] Package-lock.json committed
- [ ] Security audit in CI pipeline

---

## Testing Strategy

### Unit Tests
- `tests/services/sanitizer.test.ts` - XSS prevention tests
- `tests/services/urlValidator.test.ts` - SSRF prevention tests
- `tests/services/cspRenderer.test.ts` - CSP compliance tests
- `tests/webpart/propertyValidation.test.ts` - Input validation tests

### XSS Test Vectors
```typescript
// tests/fixtures/xssVectors.ts
export const xssVectors = [
  '<script>alert("xss")</script>',
  '<img src="x" onerror="alert(1)">',
  '<a href="javascript:alert(1)">click</a>',
  '<div onmouseover="alert(1)">hover</div>',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<svg onload="alert(1)">',
  '<body onload="alert(1)">',
  '<input onfocus="alert(1)" autofocus>',
  '<marquee onstart="alert(1)">',
  '<video><source onerror="alert(1)">',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  '<math><maction actiontype="statusline#http://evil">CLICKME</maction></math>',
  '<a href="data:text/html,<script>alert(1)</script>">click</a>',
];
```

### SSRF Test Vectors
```typescript
// tests/fixtures/ssrfVectors.ts
export const ssrfVectors = [
  'http://localhost/admin',
  'http://127.0.0.1/etc/passwd',
  'http://192.168.1.1/router',
  'http://10.0.0.1/internal',
  'http://169.254.169.254/latest/meta-data/',  // AWS
  'http://metadata.google.internal/',  // GCP
  'http://[::1]/admin',
  'http://0.0.0.0/',
  'http://127.1/',  // Shortened localhost
  'http://2130706433/',  // Decimal IP for 127.0.0.1
];
```

## Dependencies
- `dompurify`: ^3.0.0
- `@types/dompurify`: ^3.0.0

## Notes
- Security is not optional - all sub-tasks are required
- Consider security review by Microsoft before app store submission
- Keep up with OWASP guidelines and SharePoint security bulletins
