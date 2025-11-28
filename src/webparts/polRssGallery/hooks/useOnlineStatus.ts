/**
 * Online Status Hook
 *
 * Detects network connectivity changes and provides status to components.
 * Includes automatic refresh callback when connection is restored.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Online status state
 */
export interface OnlineState {
  /** Whether browser is currently online */
  isOnline: boolean;
  /** Whether browser was previously online (for detecting restoration) */
  wasOnline: boolean;
  /** Timestamp of last status change */
  lastChange: Date | null;
  /** Whether connection was just restored */
  justRestored: boolean;
}

/**
 * Options for useOnlineStatus hook
 */
export interface UseOnlineStatusOptions {
  /** Callback when going offline */
  onOffline?: () => void;
  /** Callback when coming back online */
  onOnline?: () => void;
  /** Callback to execute when connection is restored (after delay) */
  onRestore?: () => void;
  /** Delay before calling onRestore (default: 1000ms) */
  restoreDelayMs?: number;
}

/**
 * Hook to detect and react to online/offline status changes
 *
 * @param options - Configuration options
 * @returns Online status state
 *
 * @example
 * ```tsx
 * const { isOnline, justRestored } = useOnlineStatus({
 *   onRestore: () => refetchFeed(),
 * });
 *
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 * ```
 */
export function useOnlineStatus(options: UseOnlineStatusOptions = {}): OnlineState {
  const {
    onOffline,
    onOnline,
    onRestore,
    restoreDelayMs = 1000
  } = options;

  const [state, setState] = useState<OnlineState>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChange: null,
    justRestored: false
  }));

  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justRestoredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOnline = useCallback(() => {
    setState(prev => ({
      isOnline: true,
      wasOnline: prev.isOnline,
      lastChange: new Date(),
      justRestored: !prev.isOnline // Only true if was offline
    }));

    if (onOnline) {
      onOnline();
    }

    // Schedule restore callback after delay (to allow network to stabilize)
    if (onRestore) {
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
      }
      restoreTimerRef.current = setTimeout(() => {
        onRestore();
        restoreTimerRef.current = null;
      }, restoreDelayMs);
    }

    // Clear justRestored flag after a short delay
    if (justRestoredTimerRef.current) {
      clearTimeout(justRestoredTimerRef.current);
    }
    justRestoredTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, justRestored: false }));
      justRestoredTimerRef.current = null;
    }, 3000);
  }, [onOnline, onRestore, restoreDelayMs]);

  const handleOffline = useCallback(() => {
    // Cancel any pending restore callback
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }

    setState(prev => ({
      isOnline: false,
      wasOnline: prev.isOnline,
      lastChange: new Date(),
      justRestored: false
    }));

    if (onOffline) {
      onOffline();
    }
  }, [onOffline]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      // Cleanup timers
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
      }
      if (justRestoredTimerRef.current) {
        clearTimeout(justRestoredTimerRef.current);
      }
    };
  }, [handleOnline, handleOffline]);

  return state;
}

/**
 * Simple hook that just returns the online status
 */
export function useIsOnline(): boolean {
  const { isOnline } = useOnlineStatus();
  return isOnline;
}

export default useOnlineStatus;
