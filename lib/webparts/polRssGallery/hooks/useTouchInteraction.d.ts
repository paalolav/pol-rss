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
import { RefObject } from 'react';
export type PointerType = 'mouse' | 'touch' | 'pen' | 'unknown';
export interface SwipeDirection {
    horizontal: 'left' | 'right' | null;
    vertical: 'up' | 'down' | null;
}
export interface SwipeGestureEvent {
    direction: SwipeDirection;
    distance: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
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
/**
 * Detect if the device supports touch input
 */
export declare function detectTouchDevice(): boolean;
/**
 * Detect if the device has a coarse pointer (touch/pen vs mouse)
 */
export declare function detectCoarsePointer(): boolean;
/**
 * Get device orientation
 */
export declare function getOrientation(): 'portrait' | 'landscape';
/**
 * Hook for detecting and handling touch interactions
 */
export declare function useTouchInteraction(options?: TouchInteractionOptions): TouchInteractionResult;
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
export declare function useSwipeGesture(options?: SwipeGestureOptions): SwipeGestureResult;
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
export declare function useTouchRipple(containerRef: RefObject<HTMLElement>, duration?: number): TouchRippleResult;
export default useTouchInteraction;
//# sourceMappingURL=useTouchInteraction.d.ts.map