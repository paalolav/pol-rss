# REF-004-ERROR-HANDLING

> **Status:** Not Started
> **Priority:** High
> **Phase:** 2 - Core Reliability
> **Estimated Complexity:** Medium

## Overview

Implement comprehensive error handling throughout the webpart with user-friendly error messages, intelligent retry mechanisms, and proper error recovery. Users should always understand what went wrong and have actionable options.

## Prerequisites

- REF-001-TESTING-INFRASTRUCTURE
- REF-002-AZURE-PROXY (for proxy error handling)

## Dependencies

- REF-001-TESTING-INFRASTRUCTURE
- REF-002-AZURE-PROXY

## Error Categories

| Category | Examples | User Impact |
|----------|----------|-------------|
| Network | CORS, timeout, DNS | Cannot load feed |
| Parsing | Invalid XML, unknown format | Partial or no content |
| Configuration | Invalid URL, missing settings | Webpart unusable |
| Runtime | Component crash, memory | Webpart broken |

## Sub-Tasks

### ST-004-01: Define Error Types and Codes
**Status:** `[ ]` Not Started
**Test File:** `tests/utils/errorTypes.test.ts`

**Description:**
Create comprehensive error type system with codes and messages.

**Steps:**
1. Define error categories
2. Create error code enum
3. Define error interfaces
4. Create error factory functions
5. Add localization support

**Error Type System:**
```typescript
export enum RssErrorCode {
  // Network errors (1xx)
  NETWORK_CORS_BLOCKED = 101,
  NETWORK_TIMEOUT = 102,
  NETWORK_DNS_FAILED = 103,
  NETWORK_OFFLINE = 104,
  NETWORK_PROXY_FAILED = 105,

  // Parsing errors (2xx)
  PARSE_INVALID_XML = 201,
  PARSE_UNKNOWN_FORMAT = 202,
  PARSE_EMPTY_FEED = 203,
  PARSE_MISSING_ITEMS = 204,

  // Configuration errors (3xx)
  CONFIG_INVALID_URL = 301,
  CONFIG_MISSING_URL = 302,
  CONFIG_PROXY_MISSING = 303,

  // Runtime errors (4xx)
  RUNTIME_COMPONENT_CRASH = 401,
  RUNTIME_MEMORY_EXCEEDED = 402
}

export interface RssError {
  code: RssErrorCode;
  message: string;
  userMessage: string;
  recoverable: boolean;
  retryable: boolean;
  details?: unknown;
}
```

**Acceptance Criteria:**
- [ ] All error types defined
- [ ] Error codes are unique and logical
- [ ] User messages are helpful
- [ ] Localization supported

---

### ST-004-02: Implement Error Boundary Enhancement
**Status:** `[ ]` Not Started
**Test File:** `tests/components/ErrorBoundary.test.tsx`

**Description:**
Enhance existing ErrorBoundary with better recovery and reporting.

**Steps:**
1. Add error categorization
2. Implement recovery strategies per error type
3. Add retry button with backoff
4. Add "report issue" option
5. Show relevant help based on error

**Enhanced Error Boundary:**
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: RssError | null;
  retryCount: number;
  lastRetry: Date | null;
}

class EnhancedErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState;
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
  handleRetry: () => void;
  handleReset: () => void;
  render(): ReactNode;
}
```

**Acceptance Criteria:**
- [ ] Crashes caught and displayed nicely
- [ ] Retry mechanism works
- [ ] Error context preserved
- [ ] Child components can trigger recovery

---

### ST-004-03: Create User-Friendly Error Messages
**Status:** `[ ]` Not Started
**Test File:** `tests/components/ErrorDisplay.test.tsx`

**Description:**
Create error display component with helpful, non-technical messages.

**Steps:**
1. Create ErrorDisplay component
2. Map error codes to user messages
3. Add localization for nb-no, nn-no
4. Include actionable suggestions
5. Add visual error states

**Error Message Examples:**
```typescript
const errorMessages: Record<RssErrorCode, ErrorMessage> = {
  [RssErrorCode.NETWORK_CORS_BLOCKED]: {
    title: 'Unable to access feed',
    message: 'The feed source is blocking access. Try configuring a proxy URL in the webpart settings.',
    icon: 'BlockedSite',
    actions: ['Configure Proxy', 'Try Again']
  },
  [RssErrorCode.NETWORK_TIMEOUT]: {
    title: 'Feed took too long to load',
    message: 'The feed source is slow or unavailable. We\'ll try again automatically.',
    icon: 'Clock',
    actions: ['Try Again Now']
  }
};
```

**Acceptance Criteria:**
- [ ] Messages are non-technical
- [ ] Actions are clearly presented
- [ ] Icons indicate error type
- [ ] Localized for all languages

---

### ST-004-04: Implement Retry Mechanism
**Status:** `[ ]` Not Started
**Test File:** `tests/services/retryService.test.ts`

**Description:**
Create intelligent retry mechanism with exponential backoff.

**Steps:**
1. Create RetryService
2. Implement exponential backoff
3. Add jitter to prevent thundering herd
4. Track retry history
5. Know when to stop retrying

**Retry Configuration:**
```typescript
interface RetryConfig {
  maxRetries: number;        // Default: 3
  initialDelay: number;      // Default: 1000ms
  maxDelay: number;          // Default: 30000ms
  backoffMultiplier: number; // Default: 2
  jitterFactor: number;      // Default: 0.1
  retryableErrors: RssErrorCode[];
}

const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const delay = Math.min(
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
    config.maxDelay
  );
  const jitter = delay * config.jitterFactor * Math.random();
  return delay + jitter;
};
```

**Acceptance Criteria:**
- [ ] Retries respect backoff
- [ ] Non-retryable errors don't retry
- [ ] Retry state visible to user
- [ ] Maximum retries enforced

---

### ST-004-05: Add Offline Detection
**Status:** `[ ]` Not Started
**Test File:** `tests/hooks/useOnlineStatus.test.ts`

**Description:**
Detect offline state and show appropriate UI.

**Steps:**
1. Create useOnlineStatus hook
2. Listen to navigator.onLine changes
3. Show offline banner when disconnected
4. Cache last successful content
5. Auto-refresh when back online

**Offline Hook:**
```typescript
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

**Acceptance Criteria:**
- [ ] Offline state detected immediately
- [ ] Clear offline indicator shown
- [ ] Cached content displayed if available
- [ ] Auto-refresh when online

---

### ST-004-06: Implement Error Logging
**Status:** `[ ]` Not Started
**Test File:** `tests/services/errorLogger.test.ts`

**Description:**
Create error logging service for debugging and monitoring.

**Steps:**
1. Create ErrorLogger service
2. Log to browser console (dev mode)
3. Optional: Log to Application Insights
4. Include context information
5. Respect user privacy

**Error Log Structure:**
```typescript
interface ErrorLog {
  timestamp: Date;
  code: RssErrorCode;
  message: string;
  feedUrl: string;
  stack?: string;
  context: {
    webPartId: string;
    pageUrl: string;
    userAgent: string;
  };
}

class ErrorLogger {
  log(error: RssError, context: ErrorContext): void;
  getRecentErrors(): ErrorLog[];
  clearLogs(): void;
}
```

**Acceptance Criteria:**
- [ ] Errors logged with full context
- [ ] PII not logged
- [ ] Log accessible for debugging
- [ ] Log rotation/cleanup implemented

---

### ST-004-07: Create Feed Validation UI
**Status:** `[ ]` Not Started
**Test File:** `tests/components/FeedValidator.test.tsx`

**Description:**
Add feed URL validation with real-time feedback in property pane.

**Steps:**
1. Create FeedValidator component
2. Validate URL format
3. Test feed accessibility
4. Show validation results
5. Suggest fixes for common issues

**Validation States:**
```typescript
type ValidationState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'valid'; feedTitle: string; itemCount: number }
  | { status: 'invalid'; error: RssError };
```

**Acceptance Criteria:**
- [ ] URL format validated immediately
- [ ] Feed tested on blur/submit
- [ ] Clear success/error indicators
- [ ] Suggestions for fixing issues

---

### ST-004-08: Add Fallback Content
**Status:** `[ ]` Not Started
**Test File:** `tests/components/FallbackContent.test.tsx`

**Description:**
Show meaningful content when feed cannot be loaded.

**Steps:**
1. Create FallbackContent component
2. Show cached content if available
3. Show placeholder skeleton
4. Add "last updated" timestamp
5. Clear indication of stale data

**Fallback Priority:**
```
1. Cached content with "last updated X ago" notice
2. Skeleton loader with error message
3. Empty state with configuration help
```

**Acceptance Criteria:**
- [ ] Cached content shown when available
- [ ] Clear staleness indication
- [ ] Graceful degradation
- [ ] Always shows something useful

---

## Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Feed Fetch Request                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Check Online    │
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
         [Online]                        [Offline]
              │                               │
              ▼                               ▼
    ┌─────────────────┐              ┌─────────────────┐
    │ Fetch via Proxy │              │ Show Cached or  │
    └─────────────────┘              │ Offline Message │
              │                       └─────────────────┘
              ▼
    ┌─────────────────┐
    │ Parse Response  │
    └─────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[Success]           [Error]
    │                   │
    ▼                   ▼
┌─────────┐     ┌─────────────────┐
│ Display │     │ Categorize Error│
│ Content │     └─────────────────┘
└─────────┘             │
                        ▼
              ┌─────────────────┐
              │ Retryable?      │
              └─────────────────┘
                   │         │
              [Yes]│         │[No]
                   ▼         ▼
          ┌──────────┐  ┌──────────────┐
          │ Schedule │  │ Show Error   │
          │ Retry    │  │ + Fallback   │
          └──────────┘  └──────────────┘
```

## Files to Create/Modify

```
src/webparts/polRssGallery/
├── errors/
│   ├── errorTypes.ts       # Error definitions
│   ├── errorMessages.ts    # User-friendly messages
│   ├── ErrorLogger.ts      # Logging service
│   └── RetryService.ts     # Retry logic
├── components/
│   ├── ErrorBoundary.tsx   # Enhanced (modify)
│   ├── ErrorDisplay.tsx    # New: error UI
│   ├── FeedValidator.tsx   # New: validation UI
│   ├── FallbackContent.tsx # New: fallback UI
│   └── OfflineBanner.tsx   # New: offline indicator
├── hooks/
│   └── useOnlineStatus.ts  # New: online detection
└── loc/
    ├── en-us.js            # Add error messages
    ├── nb-no.js            # Add error messages
    └── nn-no.js            # Add error messages
```

## Related Tasks

- **REF-002-AZURE-PROXY:** Proxy-specific error handling
- **REF-003-FEED-PARSER:** Parser error handling
- **REF-005-CACHING-PERFORMANCE:** Cached fallback content
- **REF-008-PROPERTY-PANE:** Feed validation in settings
