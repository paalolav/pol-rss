/**
 * Online Status Hook
 *
 * Detects network connectivity changes and provides status to components.
 * Includes automatic refresh callback when connection is restored.
 */
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
export declare function useOnlineStatus(options?: UseOnlineStatusOptions): OnlineState;
/**
 * Simple hook that just returns the online status
 */
export declare function useIsOnline(): boolean;
export default useOnlineStatus;
//# sourceMappingURL=useOnlineStatus.d.ts.map