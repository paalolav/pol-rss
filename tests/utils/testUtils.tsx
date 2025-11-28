/**
 * Test Utilities
 *
 * Reusable utilities for testing RSS Feed webpart components and services.
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { createMockWebPartContext, MockWebPartContext } from '../mocks/spfxMocks';

// Context type for RSS Feed components
export interface RssFeedTestContext {
  webPartContext: MockWebPartContext;
  feedUrl: string;
}

// Default test context
export const createTestContext = (overrides?: Partial<RssFeedTestContext>): RssFeedTestContext => ({
  webPartContext: createMockWebPartContext(),
  feedUrl: 'https://example.com/feed.rss',
  ...overrides,
});

// Provider wrapper for tests
interface TestProviderProps {
  children: ReactNode;
  context?: RssFeedTestContext;
}

const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  // Add any context providers here (e.g., ThemeProvider, ContextProvider)
  return <>{children}</>;
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  context?: RssFeedTestContext;
}

export const renderWithContext = (
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult & { context: RssFeedTestContext } => {
  const context = options?.context || createTestContext();

  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <TestProvider context={context}>{children}</TestProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    context,
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithContext as render };

/**
 * Wait for async updates to complete
 */
export const waitForAsync = (ms: number = 0): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a deferred promise for testing async operations
 */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

export const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

/**
 * Mock fetch implementation for testing
 */
export const createMockFetch = (responses: Map<string, unknown> | Record<string, unknown>) => {
  const responseMap = responses instanceof Map ? responses : new Map(Object.entries(responses));

  return jest.fn().mockImplementation((url: string) => {
    const response = responseMap.get(url);

    if (response === undefined) {
      return Promise.reject(new Error(`No mock response for: ${url}`));
    }

    if (response instanceof Error) {
      return Promise.reject(response);
    }

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(typeof response === 'string' ? response : JSON.stringify(response)),
    });
  });
};

/**
 * Helper to simulate user typing with delay
 */
export const typeWithDelay = async (
  element: HTMLElement,
  text: string,
  delay: number = 50
): Promise<void> => {
  const { fireEvent } = await import('@testing-library/react');

  for (const char of text) {
    fireEvent.change(element, { target: { value: (element as HTMLInputElement).value + char } });
    await waitForAsync(delay);
  }
};

/**
 * Assert that an element has specific CSS properties
 */
export const expectStyle = (
  element: HTMLElement,
  styles: Record<string, string>
): void => {
  const computedStyle = window.getComputedStyle(element);

  Object.entries(styles).forEach(([property, value]) => {
    expect(computedStyle.getPropertyValue(property)).toBe(value);
  });
};

/**
 * Create a mock event
 */
export const createMockEvent = <T extends Event>(
  type: string,
  properties?: Partial<T>
): Partial<T> => ({
  type,
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...properties,
} as Partial<T>);

/**
 * Format date for comparison in tests
 */
export const formatTestDate = (date: Date): string =>
  date.toISOString().split('T')[0];

/**
 * Generate array of mock items
 */
export const generateMockItems = <T>(
  count: number,
  factory: (index: number) => T
): T[] => Array.from({ length: count }, (_, i) => factory(i));
