/**
 * Touch Interaction Hook
 *
 * Provides utilities for detecting and handling touch interactions.
 * Supports touch device detection, gesture handling, and pointer type tracking.
 *
 * Features:
 * - Touch device detection
 * - Pointer type tracking (touch vs mouse)
 * - Touch feedback state management
 * - Swipe gesture detection
 *
 * @example
 * ```tsx
 * const { isTouchDevice, pointerType, isPressed } = useTouchInteraction();
 *
 * // Use for conditional touch-specific styling
 * <button className={classNames({ 'touch-active': isPressed })}>
 *   Click me
 * </button>
 * ```
 */

import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

// =============================================================================
// Types
// =============================================================================

export type PointerType = 'mouse' | 'touch' | 'pen' | 'unknown';

export interface SwipeDirection {
  horizontal: 'left' | 'right' | null;
  vertical: 'up' | 'down' | null;
}

export interface SwipeGestureEvent {
  direction: SwipeDirection;
  distance: { x: number; y: number };
  velocity: { x: number; y: number };
}

export interface TouchInteractionOptions {
  /**
   * Minimum distance (in pixels) to register as a swipe
   * @default 50
   */
  swipeThreshold?: number;
  /**
   * Enable swipe gesture detection
   * @default false
   */
  enableSwipe?: boolean;
  /**
   * Callback when a swipe gesture is detected
   */
  onSwipe?: (event: SwipeGestureEvent) => void;
  /**
   * Debounce time for resize/orientation changes in ms
   * @default 100
   */
  debounceMs?: number;
}

export interface TouchInteractionResult {
  /**
   * Whether the device supports touch input
   */
  isTouchDevice: boolean;
  /**
   * Current pointer type (mouse, touch, pen, or unknown)
   */
  pointerType: PointerType;
  /**
   * Whether the element is currently being pressed (touch or mouse down)
   */
  isPressed: boolean;
  /**
   * Whether the device supports coarse pointer (touch/pen)
   */
  hasCoarsePointer: boolean;
  /**
   * Whether the device is in portrait orientation
   */
  isPortrait: boolean;
  /**
   * Handlers to attach to the target element for press detection
   */
  pressHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
  };
}

// =============================================================================
// Utilities
// =============================================================================

/**
 * Detect if the device supports touch input
 */
export function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect if the device has a coarse pointer (touch/pen vs mouse)
 */
export function detectCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Get device orientation
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

// =============================================================================
// Main Hook
// =============================================================================

/**
 * Hook for detecting and handling touch interactions
 */
export function useTouchInteraction(
  options: TouchInteractionOptions = {}
): TouchInteractionResult {
  const { debounceMs = 100 } = options;

  // State
  const [isTouchDevice, setIsTouchDevice] = useState(() => detectTouchDevice());
  const [hasCoarsePointer, setHasCoarsePointer] = useState(() => detectCoarsePointer());
  const [pointerType, setPointerType] = useState<PointerType>('unknown');
  const [isPressed, setIsPressed] = useState(false);
  const [isPortrait, setIsPortrait] = useState(() => getOrientation() === 'portrait');

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update touch device detection on mount and pointer events
  useEffect(() => {
    const handleTouchStart = (): void => {
      setIsTouchDevice(true);
      setPointerType('touch');
    };

    const handlePointerEvent = (e: PointerEvent): void => {
      setPointerType(e.pointerType as PointerType);
      if (e.pointerType === 'touch') {
        setIsTouchDevice(true);
      }
    };

    const updateCoarsePointer = (): void => {
      setHasCoarsePointer(detectCoarsePointer());
    };

    // Media query listener for pointer changes
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const handlePointerQueryChange = (e: MediaQueryListEvent): void => {
      setHasCoarsePointer(e.matches);
    };

    // Listen for touch/pointer events to detect device capability
    window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });
    window.addEventListener('pointerdown', handlePointerEvent, { passive: true });

    // Listen for pointer media query changes
    if (coarsePointerQuery.addEventListener) {
      coarsePointerQuery.addEventListener('change', handlePointerQueryChange);
    } else {
      // Fallback for older browsers
      coarsePointerQuery.addListener(handlePointerQueryChange);
    }

    // Initial detection
    updateCoarsePointer();

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('pointerdown', handlePointerEvent);

      if (coarsePointerQuery.removeEventListener) {
        coarsePointerQuery.removeEventListener('change', handlePointerQueryChange);
      } else {
        coarsePointerQuery.removeListener(handlePointerQueryChange);
      }
    };
  }, []);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = (): void => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setIsPortrait(getOrientation() === 'portrait');
      }, debounceMs);
    };

    window.addEventListener('resize', handleOrientationChange, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debounceMs]);

  // Press handlers for feedback
  const handlePointerDown = useCallback((e: React.PointerEvent): void => {
    setIsPressed(true);
    setPointerType(e.pointerType as PointerType);
  }, []);

  const handlePointerUp = useCallback((): void => {
    setIsPressed(false);
  }, []);

  const handlePointerCancel = useCallback((): void => {
    setIsPressed(false);
  }, []);

  const handlePointerLeave = useCallback((): void => {
    setIsPressed(false);
  }, []);

  const pressHandlers = {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onPointerLeave: handlePointerLeave,
  };

  return {
    isTouchDevice,
    pointerType,
    isPressed,
    hasCoarsePointer,
    isPortrait,
    pressHandlers,
  };
}

// =============================================================================
// Swipe Gesture Hook
// =============================================================================

export interface SwipeGestureOptions {
  /**
   * Minimum distance to register as a swipe (in pixels)
   * @default 50
   */
  threshold?: number;
  /**
   * Whether to prevent default on touch events
   * @default false
   */
  preventDefault?: boolean;
  /**
   * Callback when a swipe is detected
   */
  onSwipe?: (event: SwipeGestureEvent) => void;
  /**
   * Callback when swipe starts
   */
  onSwipeStart?: () => void;
  /**
   * Callback when swipe ends (regardless of threshold)
   */
  onSwipeEnd?: () => void;
}

export interface SwipeGestureResult {
  /**
   * Ref to attach to the target element
   */
  ref: RefObject<HTMLElement>;
  /**
   * Whether a swipe gesture is in progress
   */
  isSwiping: boolean;
  /**
   * Current swipe direction (if swiping)
   */
  swipeDirection: SwipeDirection | null;
  /**
   * Handlers to attach to the target element
   */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
}

/**
 * Hook for detecting swipe gestures
 */
export function useSwipeGesture(options: SwipeGestureOptions = {}): SwipeGestureResult {
  const { threshold = 50, preventDefault = false, onSwipe, onSwipeStart, onSwipeEnd } = options;

  const ref = useRef<HTMLElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);

  // Track touch state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchCurrentRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
      setIsSwiping(true);
      onSwipeStart?.();
    },
    [onSwipeStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent): void => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      touchCurrentRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      if (preventDefault) {
        e.preventDefault();
      }

      // Calculate direction during swipe
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      const horizontal: 'left' | 'right' | null =
        Math.abs(deltaX) > threshold / 2 ? (deltaX > 0 ? 'right' : 'left') : null;
      const vertical: 'up' | 'down' | null =
        Math.abs(deltaY) > threshold / 2 ? (deltaY > 0 ? 'down' : 'up') : null;

      setSwipeDirection({ horizontal, vertical });
    },
    [preventDefault, threshold]
  );

  const handleTouchEnd = useCallback(
    (_e: React.TouchEvent): void => {
      if (!touchStartRef.current || !touchCurrentRef.current) {
        setIsSwiping(false);
        setSwipeDirection(null);
        onSwipeEnd?.();
        return;
      }

      const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
      const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      // Calculate direction
      const horizontal: 'left' | 'right' | null =
        Math.abs(deltaX) >= threshold ? (deltaX > 0 ? 'right' : 'left') : null;
      const vertical: 'up' | 'down' | null =
        Math.abs(deltaY) >= threshold ? (deltaY > 0 ? 'down' : 'up') : null;

      // Only fire callback if threshold was met
      if (horizontal || vertical) {
        const velocity = {
          x: duration > 0 ? Math.abs(deltaX) / duration : 0,
          y: duration > 0 ? Math.abs(deltaY) / duration : 0,
        };

        onSwipe?.({
          direction: { horizontal, vertical },
          distance: { x: deltaX, y: deltaY },
          velocity,
        });
      }

      // Reset state
      touchStartRef.current = null;
      touchCurrentRef.current = null;
      setIsSwiping(false);
      setSwipeDirection(null);
      onSwipeEnd?.();
    },
    [threshold, onSwipe, onSwipeEnd]
  );

  const handleTouchCancel = useCallback((): void => {
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    setIsSwiping(false);
    setSwipeDirection(null);
    onSwipeEnd?.();
  }, [onSwipeEnd]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  return {
    ref,
    isSwiping,
    swipeDirection,
    handlers,
  };
}

// =============================================================================
// Touch Ripple Hook
// =============================================================================

export interface RipplePosition {
  x: number;
  y: number;
}

export interface RippleEffect {
  id: number;
  position: RipplePosition;
}

export interface TouchRippleResult {
  /**
   * Active ripple effects
   */
  ripples: RippleEffect[];
  /**
   * Handler to create a new ripple
   */
  createRipple: (e: React.PointerEvent | React.TouchEvent) => void;
  /**
   * Handler to clear all ripples
   */
  clearRipples: () => void;
}

/**
 * Hook for creating touch ripple effects
 */
export function useTouchRipple(
  containerRef: RefObject<HTMLElement>,
  duration: number = 600
): TouchRippleResult {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const nextIdRef = useRef(0);

  const createRipple = useCallback(
    (e: React.PointerEvent | React.TouchEvent): void => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ('touches' in e) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const id = nextIdRef.current++;
      const ripple: RippleEffect = { id, position: { x, y } };

      setRipples((prev) => [...prev, ripple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, duration);
    },
    [containerRef, duration]
  );

  const clearRipples = useCallback((): void => {
    setRipples([]);
  }, []);

  return {
    ripples,
    createRipple,
    clearRipples,
  };
}

export default useTouchInteraction;
