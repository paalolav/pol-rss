/**
 * MinimalLayout Component
 *
 * Ultra-compact text-only layout for displaying RSS feed items.
 * Perfect for sidebar (1/3 column) views and narrow spaces.
 *
 * Features:
 * - No images (text-only)
 * - Minimal spacing and padding
 * - Efficient use of vertical space
 * - Clean, professional design
 * - Optimized for narrow columns
 */
import * as React from 'react';
import { IRssItem } from '../../IRssItem';
/**
 * Props for MinimalLayout component
 */
export interface IMinimalLayoutProps {
    /**
     * RSS feed items to display
     */
    items: IRssItem[];
    /**
     * Whether to show publication date
     * @default true
     */
    showPubDate?: boolean;
    /**
     * Whether to show description
     * @default false - minimal layout typically hides description for compactness
     */
    showDescription?: boolean;
    /**
     * Whether to show source/publication name
     * @default false
     */
    showSource?: boolean;
    /**
     * Maximum characters for description truncation
     * @default 80
     */
    truncateDescription?: number;
    /**
     * Whether the component is loading
     * @default false
     */
    isLoading?: boolean;
    /**
     * Number of skeleton items to show when loading
     * @default 5
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
 * MinimalLayout component
 */
export declare const MinimalLayout: React.FC<IMinimalLayoutProps>;
declare const _default: React.NamedExoticComponent<IMinimalLayoutProps>;
export default _default;
//# sourceMappingURL=MinimalLayout.d.ts.map