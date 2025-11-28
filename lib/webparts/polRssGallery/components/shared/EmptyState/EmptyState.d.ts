/**
 * EmptyState Component
 *
 * A component for displaying empty states when no content is available.
 * Provides clear messaging and optional action buttons.
 *
 * Features:
 * - Customizable icon
 * - Title and description
 * - Optional action button
 * - Multiple size variants
 * - Accessible design
 */
import * as React from 'react';
/**
 * Size variant for the empty state
 */
export type EmptyStateSize = 'sm' | 'md' | 'lg';
/**
 * Action button configuration
 */
export interface EmptyStateAction {
    /**
     * Button label text
     */
    label: string;
    /**
     * Click handler
     */
    onClick: () => void;
    /**
     * Whether this is the primary action
     * @default true
     */
    primary?: boolean;
}
/**
 * Props for the EmptyState component
 */
export interface IEmptyStateProps {
    /**
     * Icon to display (can be a string emoji, icon component, or null)
     */
    icon?: React.ReactNode;
    /**
     * Title text
     */
    title: string;
    /**
     * Description text
     */
    description?: string;
    /**
     * Primary action button
     */
    action?: EmptyStateAction;
    /**
     * Secondary action button
     */
    secondaryAction?: EmptyStateAction;
    /**
     * Size variant
     * @default 'md'
     */
    size?: EmptyStateSize;
    /**
     * Additional CSS class name
     */
    className?: string;
    /**
     * Test ID for testing
     */
    testId?: string;
}
/**
 * EmptyState component
 */
export declare const EmptyState: React.FC<IEmptyStateProps>;
/**
 * Empty state for when no feed items are available
 */
export interface INoItemsEmptyStateProps {
    /**
     * Callback to refresh the feed
     */
    onRefresh?: () => void;
    /**
     * Custom message
     */
    message?: string;
    /**
     * Test ID for testing
     */
    testId?: string;
}
export declare const NoItemsEmptyState: React.FC<INoItemsEmptyStateProps>;
/**
 * Empty state for when no feed URL is configured
 */
export interface INoFeedConfiguredEmptyStateProps {
    /**
     * Callback to open settings
     */
    onOpenSettings?: () => void;
    /**
     * Test ID for testing
     */
    testId?: string;
}
export declare const NoFeedConfiguredEmptyState: React.FC<INoFeedConfiguredEmptyStateProps>;
/**
 * Empty state for filtered results
 */
export interface IFilteredEmptyStateProps {
    /**
     * Callback to clear filters
     */
    onClearFilters?: () => void;
    /**
     * The active filter value
     */
    filterValue?: string;
    /**
     * Test ID for testing
     */
    testId?: string;
}
export declare const FilteredEmptyState: React.FC<IFilteredEmptyStateProps>;
/**
 * Empty state for offline mode
 */
export interface IOfflineEmptyStateProps {
    /**
     * Callback to retry
     */
    onRetry?: () => void;
    /**
     * Test ID for testing
     */
    testId?: string;
}
export declare const OfflineEmptyState: React.FC<IOfflineEmptyStateProps>;
export default EmptyState;
//# sourceMappingURL=EmptyState.d.ts.map