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
import { useState, useEffect, useCallback, useRef } from 'react';
// =============================================================================
// Utilities
// =============================================================================
/**
 * Detect if the device supports touch input
 */
export function detectTouchDevice() {
    if (typeof window === 'undefined')
        return false;
    return ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is IE-specific
        navigator.msMaxTouchPoints > 0);
}
/**
 * Detect if the device has a coarse pointer (touch/pen vs mouse)
 */
export function detectCoarsePointer() {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia('(pointer: coarse)').matches;
}
/**
 * Get device orientation
 */
export function getOrientation() {
    if (typeof window === 'undefined')
        return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}
// =============================================================================
// Main Hook
// =============================================================================
/**
 * Hook for detecting and handling touch interactions
 */
export function useTouchInteraction(options = {}) {
    const { debounceMs = 100 } = options;
    // State
    const [isTouchDevice, setIsTouchDevice] = useState(() => detectTouchDevice());
    const [hasCoarsePointer, setHasCoarsePointer] = useState(() => detectCoarsePointer());
    const [pointerType, setPointerType] = useState('unknown');
    const [isPressed, setIsPressed] = useState(false);
    const [isPortrait, setIsPortrait] = useState(() => getOrientation() === 'portrait');
    // Debounce timer ref
    const debounceTimerRef = useRef(null);
    // Update touch device detection on mount and pointer events
    useEffect(() => {
        const handleTouchStart = () => {
            setIsTouchDevice(true);
            setPointerType('touch');
        };
        const handlePointerEvent = (e) => {
            setPointerType(e.pointerType);
            if (e.pointerType === 'touch') {
                setIsTouchDevice(true);
            }
        };
        const updateCoarsePointer = () => {
            setHasCoarsePointer(detectCoarsePointer());
        };
        // Media query listener for pointer changes
        const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
        const handlePointerQueryChange = (e) => {
            setHasCoarsePointer(e.matches);
        };
        // Listen for touch/pointer events to detect device capability
        window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });
        window.addEventListener('pointerdown', handlePointerEvent, { passive: true });
        // Listen for pointer media query changes
        if (coarsePointerQuery.addEventListener) {
            coarsePointerQuery.addEventListener('change', handlePointerQueryChange);
        }
        else {
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
            }
            else {
                coarsePointerQuery.removeListener(handlePointerQueryChange);
            }
        };
    }, []);
    // Handle orientation changes
    useEffect(() => {
        const handleOrientationChange = () => {
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
    const handlePointerDown = useCallback((e) => {
        setIsPressed(true);
        setPointerType(e.pointerType);
    }, []);
    const handlePointerUp = useCallback(() => {
        setIsPressed(false);
    }, []);
    const handlePointerCancel = useCallback(() => {
        setIsPressed(false);
    }, []);
    const handlePointerLeave = useCallback(() => {
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
/**
 * Hook for detecting swipe gestures
 */
export function useSwipeGesture(options = {}) {
    const { threshold = 50, preventDefault = false, onSwipe, onSwipeStart, onSwipeEnd } = options;
    const ref = useRef(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);
    // Track touch state
    const touchStartRef = useRef(null);
    const touchCurrentRef = useRef(null);
    const handleTouchStart = useCallback((e) => {
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
        onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();
    }, [onSwipeStart]);
    const handleTouchMove = useCallback((e) => {
        if (!touchStartRef.current)
            return;
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
        const horizontal = Math.abs(deltaX) > threshold / 2 ? (deltaX > 0 ? 'right' : 'left') : null;
        const vertical = Math.abs(deltaY) > threshold / 2 ? (deltaY > 0 ? 'down' : 'up') : null;
        setSwipeDirection({ horizontal, vertical });
    }, [preventDefault, threshold]);
    const handleTouchEnd = useCallback((_e) => {
        if (!touchStartRef.current || !touchCurrentRef.current) {
            setIsSwiping(false);
            setSwipeDirection(null);
            onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
            return;
        }
        const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
        const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
        const duration = Date.now() - touchStartRef.current.time;
        // Calculate direction
        const horizontal = Math.abs(deltaX) >= threshold ? (deltaX > 0 ? 'right' : 'left') : null;
        const vertical = Math.abs(deltaY) >= threshold ? (deltaY > 0 ? 'down' : 'up') : null;
        // Only fire callback if threshold was met
        if (horizontal || vertical) {
            const velocity = {
                x: duration > 0 ? Math.abs(deltaX) / duration : 0,
                y: duration > 0 ? Math.abs(deltaY) / duration : 0,
            };
            onSwipe === null || onSwipe === void 0 ? void 0 : onSwipe({
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
        onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
    }, [threshold, onSwipe, onSwipeEnd]);
    const handleTouchCancel = useCallback(() => {
        touchStartRef.current = null;
        touchCurrentRef.current = null;
        setIsSwiping(false);
        setSwipeDirection(null);
        onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
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
/**
 * Hook for creating touch ripple effects
 */
export function useTouchRipple(containerRef, duration = 600) {
    const [ripples, setRipples] = useState([]);
    const nextIdRef = useRef(0);
    const createRipple = useCallback((e) => {
        const container = containerRef.current;
        if (!container)
            return;
        const rect = container.getBoundingClientRect();
        let clientX;
        let clientY;
        if ('touches' in e) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const id = nextIdRef.current++;
        const ripple = { id, position: { x, y } };
        setRipples((prev) => [...prev, ripple]);
        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, duration);
    }, [containerRef, duration]);
    const clearRipples = useCallback(() => {
        setRipples([]);
    }, []);
    return {
        ripples,
        createRipple,
        clearRipples,
    };
}
export default useTouchInteraction;
//# sourceMappingURL=useTouchInteraction.js.map