/**
 * ResponsiveGrid Component
 *
 * A responsive grid layout that automatically adapts to container width.
 * Uses CSS Grid with auto-fit for flexible column counts.
 *
 * Features:
 * - Auto-fit columns with minimum item width
 * - Configurable max columns
 * - Responsive gap sizing
 * - Container-based responsiveness (not viewport)
 */
import * as React from 'react';
/**
 * Gap size variants
 */
export type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/**
 * Props for the ResponsiveGrid component
 */
export interface IResponsiveGridProps {
    /**
     * Grid items to render
     */
    children: React.ReactNode;
    /**
     * Minimum width for each item in pixels
     * @default 280
     */
    minItemWidth?: number;
    /**
     * Maximum number of columns
     * @default 4
     */
    maxColumns?: number;
    /**
     * Gap size between items
     * @default 'md'
     */
    gap?: GapSize;
    /**
     * Additional CSS class names
     */
    className?: string;
    /**
     * Whether to center items when they don't fill a row
     * @default false
     */
    centerItems?: boolean;
    /**
     * Callback when column count changes
     */
    onColumnsChange?: (columns: number) => void;
    /**
     * Test ID for testing
     */
    testId?: string;
}
/**
 * ResponsiveGrid component that creates a CSS Grid layout with auto-fit columns.
 * Automatically adapts to the container width rather than viewport width.
 */
export declare const ResponsiveGrid: React.FC<IResponsiveGridProps>;
/**
 * Hook to get the grid context information
 * Useful for child components that need to know their grid context
 */
export interface GridContext {
    columns: number;
    containerWidth: number;
    isNarrow: boolean;
}
/**
 * Props for GridItem wrapper component
 */
export interface IGridItemProps {
    /**
     * Content to render inside the grid item
     */
    children: React.ReactNode;
    /**
     * Number of columns this item should span
     * @default 1
     */
    span?: number;
    /**
     * Additional CSS class names
     */
    className?: string;
}
/**
 * GridItem component for items that need special spanning behavior
 */
export declare const GridItem: React.FC<IGridItemProps>;
export default ResponsiveGrid;
//# sourceMappingURL=ResponsiveGrid.d.ts.map