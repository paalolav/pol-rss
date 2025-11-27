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
 * Gap size to CSS variable mapping
 */
const gapSizes: Record<GapSize, string> = {
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
export const ResponsiveGrid: React.FC<IResponsiveGridProps> = ({
  children,
  minItemWidth = 280,
  maxColumns = 4,
  gap = 'md',
  className = '',
  centerItems = false,
  onColumnsChange,
  testId = 'responsive-grid'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, columns } = useContainerSize(containerRef, { minItemWidth });

  // Notify parent of column changes
  const previousColumns = useRef<number>(columns);
  React.useEffect(() => {
    if (columns !== previousColumns.current) {
      previousColumns.current = columns;
      onColumnsChange?.(columns);
    }
  }, [columns, onColumnsChange]);

  // Calculate effective max columns (can't exceed what container allows)
  const effectiveMaxColumns = Math.min(maxColumns, columns || 1);

  const gridStyle: React.CSSProperties = {
    '--min-item-width': `${minItemWidth}px`,
    '--max-columns': effectiveMaxColumns,
    '--grid-gap': gapSizes[gap]
  } as React.CSSProperties;

  const containerClasses = [
    styles.responsiveGrid,
    centerItems ? styles.centered : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={gridStyle}
      data-testid={testId}
      data-columns={effectiveMaxColumns}
      data-width={width}
    >
      {children}
    </div>
  );
};

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
export const GridItem: React.FC<IGridItemProps> = ({
  children,
  span = 1,
  className = ''
}) => {
  const itemStyle: React.CSSProperties = span > 1 ? {
    gridColumn: `span ${span}`
  } : {};

  return (
    <div
      className={`${styles.gridItem} ${className}`}
      style={itemStyle}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
