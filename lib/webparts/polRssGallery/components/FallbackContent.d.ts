import * as React from 'react';
import { RssError } from '../errors/errorTypes';
import { IRssItem } from './IRssItem';
/**
 * Props for FallbackContent component
 */
export interface IFallbackContentProps {
    /** Current error (if any) */
    error?: RssError | null;
    /** Cached items to display */
    cachedItems?: IRssItem[];
    /** When the cached content was last fetched */
    lastFetched?: Date | null;
    /** Whether currently loading */
    isLoading?: boolean;
    /** Callback to retry loading */
    onRetry?: () => void;
    /** Callback to open settings */
    onOpenSettings?: () => void;
    /** Whether the feed URL is configured */
    hasUrl?: boolean;
}
/**
 * FallbackContent Component
 *
 * Displays meaningful content when the primary feed cannot be loaded.
 * Shows cached content if available, skeleton loaders while loading,
 * or helpful empty states with configuration guidance.
 *
 * Priority:
 * 1. Cached content with "last updated X ago" notice
 * 2. Skeleton loader with error message
 * 3. Empty state with configuration help
 */
export declare const FallbackContent: React.FC<IFallbackContentProps>;
/**
 * Skeleton loader for feed items
 */
export declare const FeedSkeleton: React.FC<{
    count?: number;
}>;
export default FallbackContent;
//# sourceMappingURL=FallbackContent.d.ts.map