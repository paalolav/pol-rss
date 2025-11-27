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
import { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { IRssItem } from '../../IRssItem';
import { FeedItem } from '../../shared/FeedItem';
import { BannerSkeleton } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './BannerCarousel.module.scss';

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
 * Height presets in pixels
 */
const heightPresets: Record<BannerHeight, string> = {
  sm: '250px',
  md: '350px',
  lg: '450px',
  auto: 'auto'
};

/**
 * BannerCarousel component
 */
export const BannerCarousel: React.FC<IBannerCarouselProps> = ({
  items,
  autoplay = true,
  interval = 5,
  showNavigation = true,
  showPagination = true,
  pauseOnHover = true,
  height = 'md',
  fallbackImageUrl,
  forceFallback = false,
  hideImages = false,
  showPubDate = true,
  showDescription = true,
  isLoading = false,
  onItemClick,
  className = '',
  testId = 'banner-carousel'
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Key for forcing re-render when forceFallback changes
  const [carouselKey, setCarouselKey] = useState(0);
  useEffect(() => {
    setCarouselKey(prev => prev + 1);
  }, [forceFallback]);

  // Handle slide change
  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setCurrentSlide(swiper.realIndex + 1);
  }, []);

  // Pause autoplay on focus/hover
  const handlePause = useCallback(() => {
    if (pauseOnHover && swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
      setIsPaused(true);
    }
  }, [pauseOnHover, swiperInstance]);

  const handleResume = useCallback(() => {
    if (pauseOnHover && swiperInstance?.autoplay && autoplay) {
      swiperInstance.autoplay.start();
      setIsPaused(false);
    }
  }, [pauseOnHover, swiperInstance, autoplay]);

  // Handle item click
  const handleItemClick = useCallback((item: IRssItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    '--banner-height': heightPresets[height]
  } as React.CSSProperties;

  // Container classes
  const containerClasses = [
    styles.bannerCarousel,
    className
  ].filter(Boolean).join(' ');

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses} style={containerStyle} data-testid={testId}>
        <BannerSkeleton
          height={heightPresets[height]}
          showDescription={showDescription}
        />
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={containerClasses} style={containerStyle} data-testid={testId}>
        <NoItemsEmptyState />
      </div>
    );
  }

  const delayMs = interval * 1000;
  const totalSlides = items.length;

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      data-testid={testId}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      role="region"
      aria-roledescription="karusell"
      aria-label={`Nyhetskarusell, ${totalSlides} lysbilder`}
    >
      <Swiper
        key={carouselKey}
        modules={[Autoplay, Navigation, Pagination, Keyboard, A11y]}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        slidesPerView={1}
        spaceBetween={0}
        loop={items.length > 1}
        autoplay={autoplay && items.length > 1 ? {
          delay: delayMs,
          disableOnInteraction: false,
          pauseOnMouseEnter: pauseOnHover
        } : false}
        navigation={showNavigation && items.length > 1 ? {
          nextEl: `.${styles.navNext}`,
          prevEl: `.${styles.navPrev}`
        } : false}
        pagination={showPagination && items.length > 1 ? {
          clickable: true,
          el: `.${styles.pagination}`
        } : false}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Forrige lysbilde',
          nextSlideMessage: 'Neste lysbilde',
          firstSlideMessage: 'Dette er første lysbilde',
          lastSlideMessage: 'Dette er siste lysbilde',
          paginationBulletMessage: 'Gå til lysbilde {{index}}'
        }}
        className={styles.swiper}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={`${item.link}-${index}`}
            className={styles.slide}
            role="group"
            aria-roledescription="lysbilde"
            aria-label={`${index + 1} av ${totalSlides}: ${item.title}`}
          >
            <FeedItem
              item={item}
              variant="banner"
              showImage={!hideImages}
              showDescription={showDescription}
              showDate={showPubDate}
              fallbackImageUrl={fallbackImageUrl}
              onItemClick={handleItemClick}
              descriptionTruncation={{ maxLines: 2, maxChars: 150 }}
              testId={`${testId}-item-${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      {showNavigation && items.length > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.navPrev}`}
            aria-label="Forrige lysbilde"
            data-testid={`${testId}-prev`}
          >
            <span className="ms-Icon ms-Icon--ChevronLeft" aria-hidden="true" />
          </button>
          <button
            className={`${styles.navButton} ${styles.navNext}`}
            aria-label="Neste lysbilde"
            data-testid={`${testId}-next`}
          >
            <span className="ms-Icon ms-Icon--ChevronRight" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {showPagination && items.length > 1 && (
        <div className={styles.pagination} data-testid={`${testId}-pagination`} />
      )}

      {/* Live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        Lysbilde {currentSlide} av {totalSlides}
        {isPaused && ' (pauset)'}
      </div>

      {/* Pause indicator */}
      {isPaused && autoplay && (
        <div
          className={styles.pauseIndicator}
          aria-hidden="true"
          data-testid={`${testId}-pause-indicator`}
        >
          <span className="ms-Icon ms-Icon--Pause" />
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
