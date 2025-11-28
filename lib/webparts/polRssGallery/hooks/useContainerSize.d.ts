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
import { RefObject } from 'react';
import { BreakpointName, ContainerBreakpointName } from '../utils/breakpoints';
/**
 * Container size information returned by the hook
 */
export interface ContainerSize {
    /** Container width in pixels */
    width: number;
    /** Container height in pixels */
    height: number;
    /** Current viewport-style breakpoint based on width */
    breakpoint: BreakpointName;
    /** Current container breakpoint (for SharePoint column layouts) */
    containerBreakpoint: ContainerBreakpointName;
    /** Recommended number of columns for grid layouts */
    columns: number;
    /** Whether the container is considered narrow (< 480px) */
    isNarrow: boolean;
    /** Whether the size is currently being measured */
    isInitialized: boolean;
}
/**
 * Options for the useContainerSize hook
 */
export interface UseContainerSizeOptions {
    /**
     * Minimum item width for calculating recommended columns
     * @default 280
     */
    minItemWidth?: number;
    /**
     * Debounce delay in ms for size updates
     * Set to 0 for immediate updates
     * @default 0
     */
    debounceMs?: number;
    /**
     * Default width to use before measurement (for SSR/initial render)
     * @default 0
     */
    defaultWidth?: number;
    /**
     * Default height to use before measurement
     * @default 0
     */
    defaultHeight?: number;
}
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
export declare function useContainerSize(containerRef: RefObject<HTMLElement>, options?: UseContainerSizeOptions): ContainerSize;
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
export declare function useBreakpoint(containerRef: RefObject<HTMLElement>): BreakpointName;
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
export declare function useIsAtBreakpoint(containerRef: RefObject<HTMLElement>, targetBreakpoint: BreakpointName): boolean;
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
export declare function useColumns(containerRef: RefObject<HTMLElement>, minItemWidth?: number): number;
export default useContainerSize;
//# sourceMappingURL=useContainerSize.d.ts.map