/**
 * BannerCarousel Component
 *
 * A carousel/banner layout for displaying RSS feed items as slides.
 * Uses Swiper for carousel functionality with enhanced accessibility.
 *
 * Features:
 * - Keyboard navigation
 * - Screen reader support with live region
 * - Pause on hover/focus
 * - Touch swipe gestures
 * - Configurable autoplay
 * - Custom navigation controls
 */
import * as React from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IRssItem } from '../../IRssItem';
/**
 * Banner height preset
 */
export type BannerHeight = 'sm' | 'md' | 'lg' | 'auto';
/**
 * Props for BannerCarousel component
 */
export interface IBannerCarouselProps {
    /**
     * RSS feed items to display
     */
    items: IRssItem[];
    /**
     * Whether to enable autoplay
     * @default true
     */
    autoplay?: boolean;
    /**
     * Autoplay interval in seconds
     * @default 5
     */
    interval?: number;
    /**
     * Whether to show navigation arrows
     * @default true
     */
    showNavigation?: boolean;
    /**
     * Whether to show pagination dots
     * @default true
     */
    showPagination?: boolean;
    /**
     * Whether to pause on hover
     * @default true
     */
    pauseOnHover?: boolean;
    /**
     * Banner height preset
     * @default 'md'
     */
    height?: BannerHeight;
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
     * Whether the component is loading
     * @default false
     */
    isLoading?: boolean;
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
}
/**
 * BannerCarousel component
 */
export declare const BannerCarousel: React.FC<IBannerCarouselProps>;
declare const _default: React.NamedExoticComponent<IBannerCarouselProps>;
export default _default;
//# sourceMappingURL=BannerCarousel.d.ts.map