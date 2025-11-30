/**
 * Jest Setup File
 *
 * This file runs before all tests to configure the testing environment.
 * It sets up React Testing Library, mocks browser APIs, and configures
 * SPFx-specific mocks.
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for jsdom environment
// Required for encoding detection in feed parsing
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// Polyfill structuredClone for Node.js < 17 or jsdom environment
// Required for fake-indexeddb and other browser APIs
if (typeof structuredClone === 'undefined') {
  (global as unknown as { structuredClone: typeof structuredClone }).structuredClone = <T>(obj: T): T => {
    if (obj === undefined) return undefined as T;
    return JSON.parse(JSON.stringify(obj));
  };
}

// Mock window.matchMedia (required for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (required for container queries)
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock IntersectionObserver (required for lazy loading)
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IndexedDB (basic mock for caching tests)
// NOTE: For tests that need full IndexedDB functionality (like indexedDbCache.test.ts),
// use 'fake-indexeddb/auto' import at the top of the test file - it will override this.
const indexedDBMock = {
  open: jest.fn().mockReturnValue({
    result: {
      createObjectStore: jest.fn(),
      transaction: jest.fn().mockReturnValue({
        objectStore: jest.fn().mockReturnValue({
          get: jest.fn(),
          put: jest.fn(),
          delete: jest.fn(),
        }),
      }),
    },
    onerror: null,
    onsuccess: null,
    onupgradeneeded: null,
  }),
  deleteDatabase: jest.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDBMock,
  configurable: true,
  writable: true,
});

// Suppress console.error and console.warn in tests (optional)
// Uncomment if you want cleaner test output
// const originalError = console.error;
// const originalWarn = console.warn;
// beforeAll(() => {
//   console.error = jest.fn();
//   console.warn = jest.fn();
// });
// afterAll(() => {
//   console.error = originalError;
//   console.warn = originalWarn;
// });

// Global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Extend Jest matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
  function flushPromises(): Promise<void>;
}

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
