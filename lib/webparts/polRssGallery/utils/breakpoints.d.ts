/**
 * Responsive Breakpoints System
 *
 * Provides consistent breakpoint constants and utilities for responsive design.
 * Aligned with SharePoint's responsive grid and common device sizes.
 *
 * SharePoint Layout Context:
 * - Full-width section: 100% container width
 * - 1-column section: ~768px max
 * - 2-column section: ~384px per column
 * - 3-column section: ~256px per column
 */
/**
 * Breakpoint values in pixels
 */
export declare const breakpoints: {
    readonly xs: 320;
    readonly sm: 480;
    readonly md: 768;
    readonly lg: 1024;
    readonly xl: 1280;
    readonly xxl: 1440;
};
/**
 * Breakpoint name type
 */
export type BreakpointName = keyof typeof breakpoints;
/**
 * Array of breakpoint names in ascending order
 */
export declare const breakpointNames: BreakpointName[];
/**
 * Get the current breakpoint name based on width
 * @param width - Width in pixels
 * @returns The current breakpoint name
 */
export declare function getBreakpoint(width: number): BreakpointName;
/**
 * Check if the current width is at or above a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is at or above the breakpoint
 */
export declare function isAtBreakpoint(width: number, breakpoint: BreakpointName): boolean;
/**
 * Check if the current width is below a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is below the breakpoint
 */
export declare function isBelowBreakpoint(width: number, breakpoint: BreakpointName): boolean;
/**
 * Check if the current width is between two breakpoints (inclusive start, exclusive end)
 * @param width - Width in pixels
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns True if width is between the breakpoints
 */
export declare function isBetweenBreakpoints(width: number, start: BreakpointName, end: BreakpointName): boolean;
/**
 * Get the media query string for a minimum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
export declare function minWidth(breakpoint: BreakpointName): string;
/**
 * Get the media query string for a maximum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
export declare function maxWidth(breakpoint: BreakpointName): string;
/**
 * Get the media query string for a width range between breakpoints
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns CSS media query string
 */
export declare function betweenWidths(start: BreakpointName, end: BreakpointName): string;
/**
 * Responsive value type - maps breakpoints to values
 */
export type ResponsiveValue<T> = Partial<Record<BreakpointName, T>> & {
    base: T;
};
/**
 * Get the appropriate value for the current width from a responsive value object
 * @param width - Width in pixels
 * @param values - Responsive value object with breakpoint-specific values
 * @returns The value for the current breakpoint
 */
export declare function getResponsiveValue<T>(width: number, values: ResponsiveValue<T>): T;
/**
 * Container breakpoints for SharePoint column layouts
 * These are the approximate widths available in different section layouts
 */
export declare const containerBreakpoints: {
    readonly narrow: 256;
    readonly compact: 384;
    readonly standard: 768;
    readonly wide: 1200;
    readonly fullWidth: 1440;
};
export type ContainerBreakpointName = keyof typeof containerBreakpoints;
/**
 * Get the container breakpoint name based on width
 * Useful for adapting layout based on the webpart container size, not viewport
 * @param width - Container width in pixels
 * @returns The container breakpoint name
 */
export declare function getContainerBreakpoint(width: number): ContainerBreakpointName;
/**
 * Recommended number of columns for card layouts based on container width
 * @param width - Container width in pixels
 * @param minItemWidth - Minimum item width (default: 280px)
 * @returns Recommended number of columns
 */
export declare function getRecommendedColumns(width: number, minItemWidth?: number): number;
/**
 * Check if the layout should be considered "mobile" based on container width
 * @param width - Container width in pixels
 * @returns True if mobile layout should be used
 */
export declare function isMobileLayout(width: number): boolean;
/**
 * Check if the layout should be considered "tablet" based on container width
 * @param width - Container width in pixels
 * @returns True if tablet layout should be used
 */
export declare function isTabletLayout(width: number): boolean;
/**
 * Check if the layout should be considered "desktop" based on container width
 * @param width - Container width in pixels
 * @returns True if desktop layout should be used
 */
export declare function isDesktopLayout(width: number): boolean;
//# sourceMappingURL=breakpoints.d.ts.map