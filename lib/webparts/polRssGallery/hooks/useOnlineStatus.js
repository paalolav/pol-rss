/**
 * Online Status Hook
 *
 * Detects network connectivity changes and provides status to components.
 * Includes automatic refresh callback when connection is restored.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
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
export function useOnlineStatus(options = {}) {
    const { onOffline, onOnline, onRestore, restoreDelayMs = 1000 } = options;
    const [state, setState] = useState(() => ({
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        wasOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        lastChange: null,
        justRestored: false
    }));
    const restoreTimerRef = useRef(null);
    const justRestoredTimerRef = useRef(null);
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
export function useIsOnline() {
    const { isOnline } = useOnlineStatus();
    return isOnline;
}
export default useOnlineStatus;
//# sourceMappingURL=useOnlineStatus.js.map