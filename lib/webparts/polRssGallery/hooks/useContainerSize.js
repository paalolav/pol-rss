/**
 * useContainerSize Hook
 *
 * A React hook that observes and returns the size of a container element.
 * Uses ResizeObserver for efficient, frame-rate-limited size updates.
 *
 * This hook is essential for container-query-like behavior in React,
 * allowing components to adapt based on their container size rather
 * than the viewport size - critical for SharePoint webparts that can
 * appear in different column layouts.
 */
import { useState, useEffect, useCallback } from 'react';
import { getBreakpoint, getContainerBreakpoint, getRecommendedColumns } from '../utils/breakpoints';
const defaultOptions = {
    minItemWidth: 280,
    debounceMs: 0,
    defaultWidth: 0,
    defaultHeight: 0
};
/**
 * Hook to observe and react to container size changes
 *
 * @param containerRef - React ref to the container element to observe
 * @param options - Configuration options
 * @returns ContainerSize object with current dimensions and breakpoint info
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { width, breakpoint, columns, isNarrow } = useContainerSize(containerRef);
 *
 * return (
 *   <div ref={containerRef}>
 *     <div className={isNarrow ? styles.compact : styles.wide}>
 *       <Grid columns={columns}>
 *         {items.map(item => <Item key={item.id} {...item} />)}
 *       </Grid>
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useContainerSize(containerRef, options = {}) {
    const opts = { ...defaultOptions, ...options };
    const calculateSize = useCallback((width, height) => {
        return {
            width,
            height,
            breakpoint: getBreakpoint(width),
            containerBreakpoint: getContainerBreakpoint(width),
            columns: getRecommendedColumns(width, opts.minItemWidth),
            isNarrow: width < 480,
            isInitialized: true
        };
    }, [opts.minItemWidth]);
    const [size, setSize] = useState(() => calculateSize(opts.defaultWidth, opts.defaultHeight));
    useEffect(() => {
        const element = containerRef.current;
        if (!element)
            return;
        // Initial measurement
        const rect = element.getBoundingClientRect();
        setSize(calculateSize(rect.width, rect.height));
        // Set up ResizeObserver
        let timeoutId = null;
        const handleResize = (entries) => {
            const entry = entries[0];
            if (!entry)
                return;
            const { width, height } = entry.contentRect;
            if (opts.debounceMs > 0) {
                if (timeoutId)
                    clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    setSize(calculateSize(width, height));
                }, opts.debounceMs);
            }
            else {
                setSize(calculateSize(width, height));
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(element);
        return () => {
            observer.disconnect();
            if (timeoutId)
                clearTimeout(timeoutId);
        };
    }, [containerRef, calculateSize, opts.debounceMs]);
    return size;
}
/**
 * Simplified hook that returns just the current breakpoint
 *
 * @param containerRef - React ref to the container element
 * @returns Current breakpoint name
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const breakpoint = useBreakpoint(containerRef);
 *
 * return (
 *   <div ref={containerRef} className={styles[breakpoint]}>
 *     Content that styles differently per breakpoint
 *   </div>
 * );
 * ```
 */
export function useBreakpoint(containerRef) {
    const { breakpoint } = useContainerSize(containerRef);
    return breakpoint;
}
/**
 * Hook that returns whether we're at or above a specific breakpoint
 *
 * @param containerRef - React ref to the container element
 * @param targetBreakpoint - The breakpoint to check against
 * @returns True if container width is at or above the target breakpoint
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const isDesktop = useIsAtBreakpoint(containerRef, 'lg');
 *
 * return (
 *   <div ref={containerRef}>
 *     {isDesktop ? <DesktopLayout /> : <MobileLayout />}
 *   </div>
 * );
 * ```
 */
export function useIsAtBreakpoint(containerRef, targetBreakpoint) {
    const { breakpoint, isInitialized } = useContainerSize(containerRef);
    if (!isInitialized)
        return false;
    const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpointOrder.indexOf(breakpoint);
    const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
    return currentIndex >= targetIndex;
}
/**
 * Hook that returns the number of columns for a grid layout
 *
 * @param containerRef - React ref to the container element
 * @param minItemWidth - Minimum width per item (default: 280)
 * @returns Recommended number of columns (1-4)
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const columns = useColumns(containerRef, 300);
 *
 * return (
 *   <div ref={containerRef}>
 *     <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
 *       {items.map(item => <Card key={item.id} {...item} />)}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useColumns(containerRef, minItemWidth = 280) {
    const { columns } = useContainerSize(containerRef, { minItemWidth });
    return columns;
}
export default useContainerSize;
//# sourceMappingURL=useContainerSize.js.map