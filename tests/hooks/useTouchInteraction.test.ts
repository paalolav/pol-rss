/**
 * Tests for useTouchInteraction hook
 *
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks';
import {
  useTouchInteraction,
  useSwipeGesture,
  useTouchRipple,
  detectTouchDevice,
  detectCoarsePointer,
  getOrientation,
  PointerType,
  SwipeGestureEvent,
} from '../../src/webparts/polRssGallery/hooks/useTouchInteraction';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('useTouchInteraction', () => {
  // Save original values
  const originalOntouchstart = (window as unknown as { ontouchstart?: unknown }).ontouchstart;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  beforeEach(() => {
    // Reset window properties
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false),
    });
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });
    // Reset touch detection properties
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original values
    if (originalOntouchstart !== undefined) {
      (window as unknown as { ontouchstart?: unknown }).ontouchstart = originalOntouchstart;
    } else {
      delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
    }
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: originalMaxTouchPoints,
    });
  });

  describe('detectTouchDevice', () => {
    it('returns false when no touch support', () => {
      // Already reset in beforeEach
      expect(detectTouchDevice()).toBe(false);
    });

    it('returns true when ontouchstart exists', () => {
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: {},
      });
      expect(detectTouchDevice()).toBe(true);
      // Clean up immediately
      delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
    });

    it('returns true when maxTouchPoints > 0', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 5,
      });
      expect(detectTouchDevice()).toBe(true);
      // Clean up immediately
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 0,
      });
    });
  });

  describe('detectCoarsePointer', () => {
    it('returns false for fine pointer (mouse)', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(false),
      });
      expect(detectCoarsePointer()).toBe(false);
    });

    it('returns true for coarse pointer (touch)', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(true),
      });
      expect(detectCoarsePointer()).toBe(true);
    });
  });

  describe('getOrientation', () => {
    it('returns portrait when height > width', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 800 });
      expect(getOrientation()).toBe('portrait');
    });

    it('returns landscape when width > height', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 400 });
      expect(getOrientation()).toBe('landscape');
    });
  });

  describe('useTouchInteraction hook', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useTouchInteraction());

      expect(result.current.isTouchDevice).toBe(false);
      expect(result.current.pointerType).toBe('unknown');
      expect(result.current.isPressed).toBe(false);
      expect(result.current.hasCoarsePointer).toBe(false);
      expect(result.current.pressHandlers).toBeDefined();
    });

    it('provides press handlers', () => {
      const { result } = renderHook(() => useTouchInteraction());

      expect(result.current.pressHandlers.onPointerDown).toBeInstanceOf(Function);
      expect(result.current.pressHandlers.onPointerUp).toBeInstanceOf(Function);
      expect(result.current.pressHandlers.onPointerCancel).toBeInstanceOf(Function);
      expect(result.current.pressHandlers.onPointerLeave).toBeInstanceOf(Function);
    });

    it('sets isPressed to true on pointer down', () => {
      const { result } = renderHook(() => useTouchInteraction());

      act(() => {
        const mockEvent = {
          pointerType: 'touch' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockEvent);
      });

      expect(result.current.isPressed).toBe(true);
      expect(result.current.pointerType).toBe('touch');
    });

    it('sets isPressed to false on pointer up', () => {
      const { result } = renderHook(() => useTouchInteraction());

      act(() => {
        const mockEvent = {
          pointerType: 'touch' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockEvent);
      });

      expect(result.current.isPressed).toBe(true);

      act(() => {
        result.current.pressHandlers.onPointerUp({} as React.PointerEvent);
      });

      expect(result.current.isPressed).toBe(false);
    });

    it('sets isPressed to false on pointer cancel', () => {
      const { result } = renderHook(() => useTouchInteraction());

      act(() => {
        const mockEvent = {
          pointerType: 'touch' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockEvent);
      });

      act(() => {
        result.current.pressHandlers.onPointerCancel({} as React.PointerEvent);
      });

      expect(result.current.isPressed).toBe(false);
    });

    it('sets isPressed to false on pointer leave', () => {
      const { result } = renderHook(() => useTouchInteraction());

      act(() => {
        const mockEvent = {
          pointerType: 'touch' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockEvent);
      });

      act(() => {
        result.current.pressHandlers.onPointerLeave({} as React.PointerEvent);
      });

      expect(result.current.isPressed).toBe(false);
    });

    it('tracks pointer type correctly', () => {
      const { result } = renderHook(() => useTouchInteraction());

      act(() => {
        const mockTouchEvent = {
          pointerType: 'touch' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockTouchEvent);
      });
      expect(result.current.pointerType).toBe('touch');

      act(() => {
        result.current.pressHandlers.onPointerUp({} as React.PointerEvent);
      });

      act(() => {
        const mockMouseEvent = {
          pointerType: 'mouse' as PointerType,
        } as React.PointerEvent;
        result.current.pressHandlers.onPointerDown(mockMouseEvent);
      });
      expect(result.current.pointerType).toBe('mouse');
    });

    it('detects portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 800 });

      const { result } = renderHook(() => useTouchInteraction());
      expect(result.current.isPortrait).toBe(true);
    });

    it('detects landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 400 });

      const { result } = renderHook(() => useTouchInteraction());
      expect(result.current.isPortrait).toBe(false);
    });
  });
});

describe('useSwipeGesture', () => {
  const createTouchEvent = (clientX: number, clientY: number) => ({
    touches: [{ clientX, clientY }],
    preventDefault: jest.fn(),
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSwipeGesture());

    expect(result.current.isSwiping).toBe(false);
    expect(result.current.swipeDirection).toBeNull();
    expect(result.current.handlers).toBeDefined();
  });

  it('provides touch handlers', () => {
    const { result } = renderHook(() => useSwipeGesture());

    expect(result.current.handlers.onTouchStart).toBeInstanceOf(Function);
    expect(result.current.handlers.onTouchMove).toBeInstanceOf(Function);
    expect(result.current.handlers.onTouchEnd).toBeInstanceOf(Function);
    expect(result.current.handlers.onTouchCancel).toBeInstanceOf(Function);
  });

  it('sets isSwiping to true on touch start', () => {
    const { result } = renderHook(() => useSwipeGesture());

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    expect(result.current.isSwiping).toBe(true);
  });

  it('calls onSwipeStart callback', () => {
    const onSwipeStart = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeStart }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    expect(onSwipeStart).toHaveBeenCalled();
  });

  it('detects right swipe direction', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 50, onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(200, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: expect.objectContaining({ horizontal: 'right' }),
      })
    );
  });

  it('detects left swipe direction', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 50, onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(200, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: expect.objectContaining({ horizontal: 'left' }),
      })
    );
  });

  it('detects down swipe direction', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 50, onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(100, 200) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: expect.objectContaining({ vertical: 'down' }),
      })
    );
  });

  it('detects up swipe direction', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 50, onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 200) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: expect.objectContaining({ vertical: 'up' }),
      })
    );
  });

  it('does not trigger onSwipe when below threshold', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 100, onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(120, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('calls onSwipeEnd callback', () => {
    const onSwipeEnd = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeEnd }));

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipeEnd).toHaveBeenCalled();
  });

  it('resets state on touch cancel', () => {
    const { result } = renderHook(() => useSwipeGesture());

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    expect(result.current.isSwiping).toBe(true);

    act(() => {
      result.current.handlers.onTouchCancel({} as unknown as React.TouchEvent);
    });

    expect(result.current.isSwiping).toBe(false);
    expect(result.current.swipeDirection).toBeNull();
  });

  it('calculates velocity correctly', () => {
    const onSwipe = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ threshold: 50, onSwipe }));

    // Mock Date.now to control timing
    const originalDateNow = Date.now;
    let time = 1000;
    Date.now = jest.fn(() => time);

    act(() => {
      result.current.handlers.onTouchStart(
        createTouchEvent(100, 100) as unknown as React.TouchEvent
      );
    });

    // Advance time by 100ms
    time = 1100;

    act(() => {
      result.current.handlers.onTouchMove(
        createTouchEvent(200, 100) as unknown as React.TouchEvent
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd({
        preventDefault: jest.fn(),
      } as unknown as React.TouchEvent);
    });

    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({
        velocity: expect.objectContaining({
          x: expect.any(Number),
        }),
        distance: expect.objectContaining({
          x: 100,
          y: 0,
        }),
      })
    );

    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('prevents default when configured', () => {
    const { result } = renderHook(() => useSwipeGesture({ preventDefault: true }));
    const mockEvent = createTouchEvent(100, 100);

    act(() => {
      result.current.handlers.onTouchStart(mockEvent as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchMove(mockEvent as unknown as React.TouchEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});

describe('useTouchRipple', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with empty ripples array', () => {
    const containerRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    expect(result.current.ripples).toEqual([]);
  });

  it('provides createRipple and clearRipples functions', () => {
    const containerRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    expect(result.current.createRipple).toBeInstanceOf(Function);
    expect(result.current.clearRipples).toBeInstanceOf(Function);
  });

  it('creates a ripple on pointer event', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    const containerRef = { current: container };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    act(() => {
      const mockEvent = {
        clientX: 50,
        clientY: 50,
      } as React.PointerEvent;
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(1);
    expect(result.current.ripples[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        position: { x: 50, y: 50 },
      })
    );
  });

  it('creates a ripple on touch event', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    const containerRef = { current: container };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    act(() => {
      const mockEvent = {
        touches: [{ clientX: 50, clientY: 50 }],
      } as unknown as React.TouchEvent;
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(1);
    expect(result.current.ripples[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        position: { x: 50, y: 50 },
      })
    );
  });

  it('removes ripple after duration', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    const containerRef = { current: container };
    const duration = 600;
    const { result } = renderHook(() => useTouchRipple(containerRef, duration));

    act(() => {
      const mockEvent = {
        clientX: 50,
        clientY: 50,
      } as React.PointerEvent;
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(duration);
    });

    expect(result.current.ripples).toHaveLength(0);
  });

  it('clears all ripples', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    const containerRef = { current: container };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    act(() => {
      const mockEvent = {
        clientX: 50,
        clientY: 50,
      } as React.PointerEvent;
      result.current.createRipple(mockEvent);
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(2);

    act(() => {
      result.current.clearRipples();
    });

    expect(result.current.ripples).toHaveLength(0);
  });

  it('handles null container ref gracefully', () => {
    const containerRef = { current: null };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    act(() => {
      const mockEvent = {
        clientX: 50,
        clientY: 50,
      } as React.PointerEvent;
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toEqual([]);
  });

  it('creates multiple ripples with unique IDs', () => {
    const container = document.createElement('div');
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    const containerRef = { current: container };
    const { result } = renderHook(() => useTouchRipple(containerRef));

    act(() => {
      const mockEvent1 = { clientX: 25, clientY: 25 } as React.PointerEvent;
      const mockEvent2 = { clientX: 75, clientY: 75 } as React.PointerEvent;
      result.current.createRipple(mockEvent1);
      result.current.createRipple(mockEvent2);
    });

    expect(result.current.ripples).toHaveLength(2);
    expect(result.current.ripples[0].id).not.toBe(result.current.ripples[1].id);
    expect(result.current.ripples[0].position).toEqual({ x: 25, y: 25 });
    expect(result.current.ripples[1].position).toEqual({ x: 75, y: 75 });
  });
});
