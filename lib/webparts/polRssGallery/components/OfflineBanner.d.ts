import * as React from 'react';
/**
 * Props for OfflineBanner component
 */
export interface IOfflineBannerProps {
    /** Whether to show the banner (true = offline) */
    isOffline: boolean;
    /** Whether showing cached content */
    showingCached?: boolean;
    /** Last successful fetch time */
    lastFetched?: Date | null;
}
/**
 * OfflineBanner Component
 *
 * Displays a banner when the user is offline, optionally showing
 * information about cached content being displayed.
 */
export declare const OfflineBanner: React.FC<IOfflineBannerProps>;
export default OfflineBanner;
//# sourceMappingURL=OfflineBanner.d.ts.map