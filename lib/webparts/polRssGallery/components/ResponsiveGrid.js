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
import { useRef } from 'react';
import { useContainerSize } from '../hooks/useContainerSize';
import styles from './ResponsiveGrid.module.scss';
/**
 * Gap size to CSS variable mapping
 */
const gapSizes = {
    none: '0',
    xs: 'var(--gap-xs, 4px)',
    sm: 'var(--gap-sm, 8px)',
    md: 'var(--gap-md, 16px)',
    lg: 'var(--gap-lg, 24px)',
    xl: 'var(--gap-xl, 32px)'
};
/**
 * ResponsiveGrid component that creates a CSS Grid layout with auto-fit columns.
 * Automatically adapts to the container width rather than viewport width.
 */
export const ResponsiveGrid = ({ children, minItemWidth = 280, maxColumns = 4, gap = 'md', className = '', centerItems = false, onColumnsChange, testId = 'responsive-grid' }) => {
    const containerRef = useRef(null);
    const { width, columns } = useContainerSize(containerRef, { minItemWidth });
    // Notify parent of column changes
    const previousColumns = useRef(columns);
    React.useEffect(() => {
        if (columns !== previousColumns.current) {
            previousColumns.current = columns;
            onColumnsChange === null || onColumnsChange === void 0 ? void 0 : onColumnsChange(columns);
        }
    }, [columns, onColumnsChange]);
    // Calculate effective max columns (can't exceed what container allows)
    const effectiveMaxColumns = Math.min(maxColumns, columns || 1);
    const gridStyle = {
        '--min-item-width': `${minItemWidth}px`,
        '--max-columns': effectiveMaxColumns,
        '--grid-gap': gapSizes[gap]
    };
    const containerClasses = [
        styles.responsiveGrid,
        centerItems ? styles.centered : '',
        className
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { ref: containerRef, className: containerClasses, style: gridStyle, "data-testid": testId, "data-columns": effectiveMaxColumns, "data-width": width }, children));
};
/**
 * GridItem component for items that need special spanning behavior
 */
export const GridItem = ({ children, span = 1, className = '' }) => {
    const itemStyle = span > 1 ? {
        gridColumn: `span ${span}`
    } : {};
    return (React.createElement("div", { className: `${styles.gridItem} ${className}`, style: itemStyle }, children));
};
export default ResponsiveGrid;
//# sourceMappingURL=ResponsiveGrid.js.map