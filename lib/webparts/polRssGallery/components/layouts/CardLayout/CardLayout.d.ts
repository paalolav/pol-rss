/**
 * CardLayout Component
 *
 * A responsive grid layout for displaying RSS feed items as cards.
 * Uses ResponsiveGrid for container-based responsive behavior.
 *
 * Features:
 * - Responsive grid layout
 * - Configurable columns and gap
 * - Card hover effects
 * - Lazy loading images
 * - Skeleton loading state
 */
import * as React from 'react';
import { IRssItem } from '../../IRssItem';
import { GapSize } from '../../ResponsiveGrid';
import { AspectRatio } from '../../ResponsiveImage';
/**
 * Card size preset
 */
export type CardSize = 'sm' | 'md' | 'lg';
/**
 * Props for CardLayout component
 */
export interface ICardLayoutProps {
    /**
     * RSS feed items to display
     */
    items: IRssItem[];
    /**
     * Number of columns (or 'auto' for responsive)
     * @default 'auto'
     */
    columns?: 2 | 3 | 4 | 'auto';
    /**
     * Card size preset
     * @default 'md'
     */
    cardSize?: CardSize;
    /**
     * Gap between cards
     * @default 'md'
     */
    gap?: GapSize;
    /**
     * Fallback image URL
     */
    fallbackImageUrl?: string;
    /**
     * Whether to force fallback image
     * @default false
     */
    forceFallback?: boolean;
    /**
     * Whether to hide all images
     * @default false
     */
    hideImages?: boolean;
    /**
     * Whether to show publication date
     * @default true
     */
    showPubDate?: boolean;
    /**
     * Whether to show description
     * @default true
     */
    showDescription?: boolean;
    /**
     * Whether to show source/publication name
     * @default false
     */
    showSource?: boolean;
    /**
     * Maximum characters for description truncation
     * @default 150
     */
    truncateDescription?: number;
    /**
     * Image aspect ratio
     * @default '16:9'
     */
    imageAspectRatio?: AspectRatio;
    /**
     * Whether the component is loading
     * @default false
     */
    isLoading?: boolean;
    /**
     * Number of skeleton items to show when loading
     * @default 6
     */
    skeletonCount?: number;
    /**
     * Callback when an item is clicked
     */
    onItemClick?: (item: IRssItem) => void;
    /**
     * Additional CSS class name
     */
    className?: string;
    /**
     * Test ID for testing
     */
    testId?: string;
    /**
     * Whether the theme is inverted (strong background)
     * @default false
     */
    isInverted?: boolean;
}
/**
 * CardLayout component
 */
export declare const CardLayout: React.FC<ICardLayoutProps>;
declare const _default: React.NamedExoticComponent<ICardLayoutProps>;
export default _default;
//# sourceMappingURL=CardLayout.d.ts.map