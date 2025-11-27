/**
 * Tests for useContainerSize Hook
 * @file tests/hooks/useContainerSize.test.ts
 */

import { renderHook, act } from '@testing-library/react-hooks';
import {
  useContainerSize,
  useBreakpoint,
  useIsAtBreakpoint,
  useColumns,
  ContainerSize
} from '../../src/webparts/polRssGallery/hooks/useContainerSize';

// Mock ResizeObserver
class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private observedElement: Element | null = null;
  private static instances: MockResizeObserver[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.observedElement = element;
    // Get the element's current size from getBoundingClientRect
    const rect = element.getBoundingClientRect();
    this.callback(
      [{
        contentRect: { width: rect.width, height: rect.height } as DOMRectReadOnly,
        target: element,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: []
      }],
      this
    );
  }

  unobserve(): void {
    this.observedElement = null;
  }

  disconnect(): void {
    this.observedElement = null;
    const index = MockResizeObserver.instances.indexOf(this);
    if (index > -1) {
      MockResizeObserver.instances.splice(index, 1);
    }
  }

  // Helper to trigger resize from tests
  static triggerResize(width: number, height: number): void {
    MockResizeObserver.instances.forEach(observer => {
      if (observer.observedElement) {
        observer.callback(
          [{
            contentRect: { width, height } as DOMRectReadOnly,
            target: observer.observedElement,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: []
          }],
          observer
        );
      }
    });
  }

  static clearInstances(): void {
    MockResizeObserver.instances = [];
  }
}

// Setup and teardown
beforeAll(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

beforeEach(() => {
  MockResizeObserver.clearInstances();
});

afterAll(() => {
  // @ts-expect-error - cleaning up mock
  delete global.ResizeObserver;
});

// Helper to create a mock ref
function createMockRef(element: HTMLElement | null = document.createElement('div')) {
  return { current: element } as React.RefObject<HTMLElement>;
}

// Mock getBoundingClientRect
function mockElementSize(element: HTMLElement, width: number, height: number) {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    x: 0,
    y: 0,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    toJSON: () => ({})
  });
}

describe('useContainerSize', () => {
  describe('basic functionality', () => {
    it('should return initial size from getBoundingClientRect', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.width).toBe(800);
      expect(result.current.height).toBe(600);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should return default values when ref is null', () => {
      const ref = createMockRef(null);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should use default width/height options', () => {
      const ref = createMockRef(null);

      const { result } = renderHook(() =>
        useContainerSize(ref, { defaultWidth: 1024, defaultHeight: 768 })
      );

      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
    });

    it('should update on resize', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.width).toBe(800);

      act(() => {
        MockResizeObserver.triggerResize(1200, 800);
      });

      expect(result.current.width).toBe(1200);
      expect(result.current.height).toBe(800);
    });

    it('should disconnect observer on unmount', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { unmount } = renderHook(() => useContainerSize(ref));

      expect(MockResizeObserver['instances'].length).toBe(1);

      unmount();

      expect(MockResizeObserver['instances'].length).toBe(0);
    });
  });

  describe('breakpoint calculation', () => {
    it('should return xs breakpoint for narrow containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 300, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('xs');
    });

    it('should return sm breakpoint for small containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 500, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('sm');
    });

    it('should return md breakpoint for medium containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('md');
    });

    it('should return lg breakpoint for large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1100, 700);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('lg');
    });

    it('should return xl breakpoint for extra large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1300, 800);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('xl');
    });

    it('should return xxl breakpoint for very large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1500, 900);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('xxl');
    });

    it('should update breakpoint on resize', () => {
      const element = document.createElement('div');
      mockElementSize(element, 300, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.breakpoint).toBe('xs');

      act(() => {
        MockResizeObserver.triggerResize(1200, 800);
      });

      expect(result.current.breakpoint).toBe('lg');
    });
  });

  describe('container breakpoint', () => {
    it('should return narrow for small containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 250, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.containerBreakpoint).toBe('narrow');
    });

    it('should return compact for medium-small containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 400, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.containerBreakpoint).toBe('compact');
    });

    it('should return standard for medium containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.containerBreakpoint).toBe('standard');
    });

    it('should return wide for large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1300, 800);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.containerBreakpoint).toBe('wide');
    });

    it('should return fullWidth for very large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1500, 900);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.containerBreakpoint).toBe('fullWidth');
    });
  });

  describe('column calculation', () => {
    it('should return 1 column for narrow containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 250, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.columns).toBe(1);
    });

    it('should return 2 columns for medium containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 600, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.columns).toBe(2);
    });

    it('should return 3 columns for large containers', () => {
      const element = document.createElement('div');
      mockElementSize(element, 900, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.columns).toBe(3);
    });

    it('should cap at 4 columns', () => {
      const element = document.createElement('div');
      mockElementSize(element, 1500, 900);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.columns).toBe(4);
    });

    it('should respect custom minItemWidth', () => {
      const element = document.createElement('div');
      mockElementSize(element, 600, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() =>
        useContainerSize(ref, { minItemWidth: 200 })
      );

      expect(result.current.columns).toBe(3); // 600 / 200 = 3
    });
  });

  describe('isNarrow flag', () => {
    it('should be true for widths below 480px', () => {
      const element = document.createElement('div');
      mockElementSize(element, 400, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.isNarrow).toBe(true);
    });

    it('should be false for widths 480px and above', () => {
      const element = document.createElement('div');
      mockElementSize(element, 500, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.isNarrow).toBe(false);
    });

    it('should update when resizing across 480px boundary', () => {
      const element = document.createElement('div');
      mockElementSize(element, 400, 400);
      const ref = createMockRef(element);

      const { result } = renderHook(() => useContainerSize(ref));

      expect(result.current.isNarrow).toBe(true);

      act(() => {
        MockResizeObserver.triggerResize(600, 400);
      });

      expect(result.current.isNarrow).toBe(false);
    });
  });

  describe('debouncing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce updates when debounceMs is set', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() =>
        useContainerSize(ref, { debounceMs: 100 })
      );

      // Initial size
      expect(result.current.width).toBe(800);

      // Trigger resize
      act(() => {
        MockResizeObserver.triggerResize(1000, 700);
      });

      // Should not update immediately
      expect(result.current.width).toBe(800);

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should update after debounce
      expect(result.current.width).toBe(1000);
    });

    it('should not debounce when debounceMs is 0', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() =>
        useContainerSize(ref, { debounceMs: 0 })
      );

      act(() => {
        MockResizeObserver.triggerResize(1000, 700);
      });

      // Should update immediately
      expect(result.current.width).toBe(1000);
    });

    it('should cancel pending debounced updates on rapid resizes', () => {
      const element = document.createElement('div');
      mockElementSize(element, 800, 600);
      const ref = createMockRef(element);

      const { result } = renderHook(() =>
        useContainerSize(ref, { debounceMs: 100 })
      );

      // Rapid resizes
      act(() => {
        MockResizeObserver.triggerResize(900, 700);
      });
      act(() => {
        jest.advanceTimersByTime(50);
      });
      act(() => {
        MockResizeObserver.triggerResize(1000, 700);
      });
      act(() => {
        jest.advanceTimersByTime(50);
      });
      act(() => {
        MockResizeObserver.triggerResize(1100, 700);
      });

      // Should still be original
      expect(result.current.width).toBe(800);

      // Complete debounce
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should be final value
      expect(result.current.width).toBe(1100);
    });
  });
});

describe('useBreakpoint', () => {
  it('should return current breakpoint', () => {
    const element = document.createElement('div');
    mockElementSize(element, 800, 600);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useBreakpoint(ref));

    expect(result.current).toBe('md');
  });

  it('should update on resize', () => {
    const element = document.createElement('div');
    mockElementSize(element, 400, 400);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useBreakpoint(ref));

    expect(result.current).toBe('xs');

    act(() => {
      MockResizeObserver.triggerResize(1100, 700);
    });

    expect(result.current).toBe('lg');
  });
});

describe('useIsAtBreakpoint', () => {
  it('should return true when at or above target breakpoint', () => {
    const element = document.createElement('div');
    mockElementSize(element, 1100, 700); // lg breakpoint
    const ref = createMockRef(element);

    const { result: mdResult } = renderHook(() => useIsAtBreakpoint(ref, 'md'));
    const { result: lgResult } = renderHook(() => useIsAtBreakpoint(ref, 'lg'));

    expect(mdResult.current).toBe(true);
    expect(lgResult.current).toBe(true);
  });

  it('should return false when below target breakpoint', () => {
    const element = document.createElement('div');
    mockElementSize(element, 600, 400); // sm breakpoint
    const ref = createMockRef(element);

    const { result: lgResult } = renderHook(() => useIsAtBreakpoint(ref, 'lg'));
    const { result: mdResult } = renderHook(() => useIsAtBreakpoint(ref, 'md'));

    expect(lgResult.current).toBe(false);
    expect(mdResult.current).toBe(false);
  });

  it('should return false when not initialized', () => {
    const ref = createMockRef(null);

    const { result } = renderHook(() => useIsAtBreakpoint(ref, 'md'));

    expect(result.current).toBe(false);
  });

  it('should update on resize', () => {
    const element = document.createElement('div');
    mockElementSize(element, 600, 400);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useIsAtBreakpoint(ref, 'lg'));

    expect(result.current).toBe(false);

    act(() => {
      MockResizeObserver.triggerResize(1200, 700);
    });

    expect(result.current).toBe(true);
  });
});

describe('useColumns', () => {
  it('should return recommended columns based on container width', () => {
    const element = document.createElement('div');
    mockElementSize(element, 600, 400);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useColumns(ref));

    expect(result.current).toBe(2); // 600 / 280 = 2
  });

  it('should respect custom minItemWidth', () => {
    const element = document.createElement('div');
    mockElementSize(element, 600, 400);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useColumns(ref, 150));

    expect(result.current).toBe(4); // 600 / 150 = 4, capped at 4
  });

  it('should update on resize', () => {
    const element = document.createElement('div');
    mockElementSize(element, 300, 400);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useColumns(ref));

    expect(result.current).toBe(1);

    act(() => {
      MockResizeObserver.triggerResize(1200, 700);
    });

    expect(result.current).toBe(4);
  });
});

describe('edge cases', () => {
  it('should handle ref changing to null', () => {
    const element = document.createElement('div');
    mockElementSize(element, 800, 600);
    const ref = { current: element as HTMLElement | null };

    const { result, rerender } = renderHook(() => useContainerSize(ref));

    expect(result.current.width).toBe(800);

    ref.current = null;
    rerender();

    // Should retain last known size
    expect(result.current.width).toBe(800);
  });

  it('should handle very small dimensions', () => {
    const element = document.createElement('div');
    mockElementSize(element, 10, 10);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useContainerSize(ref));

    expect(result.current.width).toBe(10);
    expect(result.current.columns).toBe(1);
    expect(result.current.isNarrow).toBe(true);
    expect(result.current.breakpoint).toBe('xs');
  });

  it('should handle very large dimensions', () => {
    const element = document.createElement('div');
    mockElementSize(element, 5000, 3000);
    const ref = createMockRef(element);

    const { result } = renderHook(() => useContainerSize(ref));

    expect(result.current.width).toBe(5000);
    expect(result.current.columns).toBe(4); // Capped at 4
    expect(result.current.breakpoint).toBe('xxl');
  });

  it('should clean up on unmount even with debounce pending', () => {
    jest.useFakeTimers();

    const element = document.createElement('div');
    mockElementSize(element, 800, 600);
    const ref = createMockRef(element);

    const { unmount } = renderHook(() =>
      useContainerSize(ref, { debounceMs: 100 })
    );

    act(() => {
      MockResizeObserver.triggerResize(1000, 700);
    });

    // Unmount while debounce is pending
    unmount();

    // Should not throw when timer fires
    expect(() => {
      jest.advanceTimersByTime(100);
    }).not.toThrow();

    jest.useRealTimers();
  });
});
