# Pre-Deployment Security Checklist

> Version: 1.3.0
> Last Updated: 2025-11-26
> Reference: REF-012-SECURITY-HARDENING

This checklist must be completed before any production deployment of the POL RSS Gallery web part.

---

## Content Security

### XSS Prevention

- [ ] **DOMPurify sanitizes all RSS content**
  - Verify `ContentSanitizer` is used in all layout components
  - Files: `BannerCarousel.tsx`, `CardLayout.tsx`, `ListLayout.tsx`

- [ ] **Script tags removed from content**
  - Run test: `npm test -- --testPathPattern="contentSanitizer"`
  - All XSS vector tests must pass

- [ ] **Event handlers stripped**
  - Confirm `onclick`, `onerror`, `onload`, etc. are blocked
  - Review DOMPurify FORBIDDEN_ATTR configuration

- [ ] **javascript: URLs blocked**
  - Verify `ContentSanitizer.sanitizeUrl()` blocks dangerous protocols
  - Test with: `javascript:alert(1)`, `vbscript:alert(1)`

- [ ] **data: URLs handled appropriately**
  - Only `data:image/*` allowed for images
  - `data:text/html` and similar are blocked

---

## Network Security

### SSRF Prevention

- [ ] **SSRF protection in URL validator**
  - Run test: `npm test -- --testPathPattern="urlValidator"`
  - All SSRF vector tests must pass

- [ ] **Private IPs blocked**
  - `10.0.0.0/8` (Class A)
  - `172.16.0.0/12` (Class B)
  - `192.168.0.0/16` (Class C)
  - `127.0.0.0/8` (Loopback)
  - `169.254.0.0/16` (Link-local)

- [ ] **Cloud metadata endpoints blocked**
  - `169.254.169.254` (AWS/Azure metadata)
  - `metadata.google.internal` (GCP metadata)

- [ ] **Only HTTPS feeds in production** (recommended)
  - HTTP feeds should show a warning to users
  - Consider enforcing HTTPS-only in production

### Azure Proxy Security (if deployed)

- [ ] **Rate limiting configured**
  - Verify `RATE_LIMIT_REQUESTS` setting in Azure Function

- [ ] **Domain allowlist configured** (optional)
  - Review `ALLOWED_DOMAINS` app setting

- [ ] **URL validation on proxy**
  - Server-side validation mirrors client-side

---

## Authentication (if Azure AD enabled)

- [ ] **Azure AD app configured correctly**
  - App registration exists with correct permissions

- [ ] **API permissions minimized**
  - Only required permissions granted

- [ ] **Token validation on server-side**
  - Azure Function validates bearer tokens

---

## SharePoint Integration

### CSP Compliance

- [ ] **Works with SharePoint CSP settings**
  - Test in SharePoint Online with strict CSP

- [ ] **No inline scripts**
  - All JavaScript in bundled files only

- [ ] **No eval() usage**
  - Search codebase: `grep -r "eval(" src/`
  - Should return no results

- [ ] **No inline event handlers**
  - Search: `grep -r "on[a-z]*=" src/`
  - Only React synthetic events allowed

### Permissions

- [ ] **Permissions follow least-privilege**
  - Review `package-solution.json` for API permissions
  - Only request necessary permissions

---

## Data Handling

### Local Storage

- [ ] **No sensitive data in local storage**
  - Cache only contains feed data (public content)
  - No API keys or tokens stored client-side

- [ ] **Cache doesn't store user data**
  - Review `CacheService` implementation

### Error Messages

- [ ] **Error messages don't leak system info**
  - No stack traces shown to users
  - No internal URLs or paths exposed

---

## Dependency Security

### NPM Audit

- [ ] **npm audit shows no high/critical vulnerabilities**
  ```bash
  npm audit --audit-level=high
  ```

- [ ] **Dependencies from trusted sources**
  - Review new dependencies for reputation
  - Check npm download counts and maintenance status

- [ ] **Lock file committed**
  - `package-lock.json` is in version control
  - Use `npm ci` for installs

### Unused Dependencies

- [ ] **No unused dependencies**
  - Run: `npx depcheck`
  - Remove any unused packages

---

## Testing Requirements

### Security Tests

- [ ] **All security tests pass**
  ```bash
  npm test -- --testPathPattern="(contentSanitizer|urlValidator|cspCompliance|propertyValidators)"
  ```

- [ ] **Test coverage adequate**
  - Security-critical code should have >80% coverage

### Manual Testing

- [ ] **Test with malicious feed content**
  - Create test feed with XSS payloads
  - Verify all payloads are sanitized

- [ ] **Test property pane inputs**
  - Try injecting scripts through URL fields
  - Try HTML in title and keywords

---

## Build and Deployment

### Build Verification

- [ ] **Production build succeeds**
  ```bash
  gulp bundle --ship
  gulp package-solution --ship
  ```

- [ ] **No build warnings about security**
  - Review webpack output for security warnings

### Deployment

- [ ] **Deployed to App Catalog (not CDN)**
  - Internal assets recommended for enterprise

- [ ] **Site Collection Admins reviewed permissions**
  - Understand what APIs are requested

---

## Documentation

- [ ] **Security documentation updated**
  - This checklist is current

- [ ] **Admin documentation includes security notes**
  - Users informed about external feed risks

- [ ] **Changelog includes security fixes**
  - Any security-related changes documented

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Security Reviewer | | | |
| Approver | | | |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-26 | Initial security checklist |
