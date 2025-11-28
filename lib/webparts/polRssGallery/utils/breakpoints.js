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
export const breakpoints = {
    xs: 320, // Small phones
    sm: 480, // Phones
    md: 768, // Tablets / SharePoint 1-column max
    lg: 1024, // Small laptops
    xl: 1280, // Desktops
    xxl: 1440 // Large desktops
};
/**
 * Array of breakpoint names in ascending order
 */
export const breakpointNames = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
/**
 * Get the current breakpoint name based on width
 * @param width - Width in pixels
 * @returns The current breakpoint name
 */
export function getBreakpoint(width) {
    if (width < breakpoints.sm)
        return 'xs';
    if (width < breakpoints.md)
        return 'sm';
    if (width < breakpoints.lg)
        return 'md';
    if (width < breakpoints.xl)
        return 'lg';
    if (width < breakpoints.xxl)
        return 'xl';
    return 'xxl';
}
/**
 * Check if the current width is at or above a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is at or above the breakpoint
 */
export function isAtBreakpoint(width, breakpoint) {
    return width >= breakpoints[breakpoint];
}
/**
 * Check if the current width is below a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is below the breakpoint
 */
export function isBelowBreakpoint(width, breakpoint) {
    return width < breakpoints[breakpoint];
}
/**
 * Check if the current width is between two breakpoints (inclusive start, exclusive end)
 * @param width - Width in pixels
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns True if width is between the breakpoints
 */
export function isBetweenBreakpoints(width, start, end) {
    return width >= breakpoints[start] && width < breakpoints[end];
}
/**
 * Get the media query string for a minimum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
export function minWidth(breakpoint) {
    return `(min-width: ${breakpoints[breakpoint]}px)`;
}
/**
 * Get the media query string for a maximum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
export function maxWidth(breakpoint) {
    return `(max-width: ${breakpoints[breakpoint] - 1}px)`;
}
/**
 * Get the media query string for a width range between breakpoints
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns CSS media query string
 */
export function betweenWidths(start, end) {
    return `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end] - 1}px)`;
}
/**
 * Get the appropriate value for the current width from a responsive value object
 * @param width - Width in pixels
 * @param values - Responsive value object with breakpoint-specific values
 * @returns The value for the current breakpoint
 */
export function getResponsiveValue(width, values) {
    // Start from the highest breakpoint and work down
    const orderedBreakpoints = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    for (const bp of orderedBreakpoints) {
        if (width >= breakpoints[bp] && values[bp] !== undefined) {
            return values[bp];
        }
    }
    return values.base;
}
/**
 * Container breakpoints for SharePoint column layouts
 * These are the approximate widths available in different section layouts
 */
export const containerBreakpoints = {
    narrow: 256, // 3-column section
    compact: 384, // 2-column section
    standard: 768, // 1-column section
    wide: 1200, // Full-width (not max)
    fullWidth: 1440 // Full-width section on large screens
};
/**
 * Get the container breakpoint name based on width
 * Useful for adapting layout based on the webpart container size, not viewport
 * @param width - Container width in pixels
 * @returns The container breakpoint name
 */
export function getContainerBreakpoint(width) {
    if (width < containerBreakpoints.compact)
        return 'narrow';
    if (width < containerBreakpoints.standard)
        return 'compact';
    if (width < containerBreakpoints.wide)
        return 'standard';
    if (width < containerBreakpoints.fullWidth)
        return 'wide';
    return 'fullWidth';
}
/**
 * Recommended number of columns for card layouts based on container width
 * @param width - Container width in pixels
 * @param minItemWidth - Minimum item width (default: 280px)
 * @returns Recommended number of columns
 */
export function getRecommendedColumns(width, minItemWidth = 280) {
    const maxColumns = Math.floor(width / minItemWidth);
    return Math.max(1, Math.min(maxColumns, 4));
}
/**
 * Check if the layout should be considered "mobile" based on container width
 * @param width - Container width in pixels
 * @returns True if mobile layout should be used
 */
export function isMobileLayout(width) {
    return width < breakpoints.sm;
}
/**
 * Check if the layout should be considered "tablet" based on container width
 * @param width - Container width in pixels
 * @returns True if tablet layout should be used
 */
export function isTabletLayout(width) {
    return width >= breakpoints.sm && width < breakpoints.lg;
}
/**
 * Check if the layout should be considered "desktop" based on container width
 * @param width - Container width in pixels
 * @returns True if desktop layout should be used
 */
export function isDesktopLayout(width) {
    return width >= breakpoints.lg;
}
//# sourceMappingURL=breakpoints.js.map