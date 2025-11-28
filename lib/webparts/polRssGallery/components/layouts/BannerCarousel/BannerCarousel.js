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
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FeedItem } from '../../shared/FeedItem';
import { BannerSkeleton } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './BannerCarousel.module.scss';
/**
 * Max height presets in pixels (container uses aspect-ratio for dynamic sizing)
 */
const heightPresets = {
    sm: '350px',
    md: '500px',
    lg: '600px',
    auto: 'none'
};
/**
 * BannerCarousel component
 */
export const BannerCarousel = ({ items, autoplay = true, interval = 5, showNavigation = true, showPagination = true, pauseOnHover = true, height = 'md', fallbackImageUrl, forceFallback = false, hideImages = false, showPubDate = true, showDescription = true, isLoading = false, onItemClick, className = '', testId = 'banner-carousel' }) => {
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef(null);
    // Key for forcing re-render when forceFallback changes
    const [carouselKey, setCarouselKey] = useState(0);
    useEffect(() => {
        setCarouselKey(prev => prev + 1);
    }, [forceFallback]);
    // Handle slide change
    const handleSlideChange = useCallback((swiper) => {
        setCurrentSlide(swiper.realIndex + 1);
    }, []);
    // Pause autoplay on focus/hover
    const handlePause = useCallback(() => {
        if (pauseOnHover && (swiperInstance === null || swiperInstance === void 0 ? void 0 : swiperInstance.autoplay)) {
            swiperInstance.autoplay.stop();
            setIsPaused(true);
        }
    }, [pauseOnHover, swiperInstance]);
    const handleResume = useCallback(() => {
        if (pauseOnHover && (swiperInstance === null || swiperInstance === void 0 ? void 0 : swiperInstance.autoplay) && autoplay) {
            swiperInstance.autoplay.start();
            setIsPaused(false);
        }
    }, [pauseOnHover, swiperInstance, autoplay]);
    // Handle item click
    const handleItemClick = useCallback((item, event) => {
        event.preventDefault();
        if (onItemClick) {
            onItemClick(item);
        }
        else {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }, [onItemClick]);
    // Container styles
    const containerStyle = {
        '--banner-height': heightPresets[height],
        '--banner-content-padding-bottom': showPagination && items.length > 1 ? '48px' : '24px'
    };
    // Container classes
    const containerClasses = [
        styles.bannerCarousel,
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (React.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId },
            React.createElement(BannerSkeleton, { height: heightPresets[height], showDescription: showDescription })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (React.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId },
            React.createElement(NoItemsEmptyState, null)));
    }
    const delayMs = interval * 1000;
    const totalSlides = items.length;
    return (React.createElement("div", { ref: containerRef, className: containerClasses, style: containerStyle, "data-testid": testId, onMouseEnter: handlePause, onMouseLeave: handleResume, onFocus: handlePause, onBlur: handleResume, role: "region", "aria-roledescription": "karusell", "aria-label": `Nyhetskarusell, ${totalSlides} lysbilder` },
        React.createElement(Swiper, { key: carouselKey, modules: [Autoplay, Navigation, Pagination, Keyboard, A11y], onSwiper: setSwiperInstance, onSlideChange: handleSlideChange, slidesPerView: 1, spaceBetween: 0, loop: items.length > 1, autoplay: autoplay && items.length > 1 ? {
                delay: delayMs,
                disableOnInteraction: false,
                pauseOnMouseEnter: pauseOnHover
            } : false, navigation: showNavigation && items.length > 1 ? {
                nextEl: `.${styles.navNext}`,
                prevEl: `.${styles.navPrev}`
            } : false, pagination: showPagination && items.length > 1 ? {
                clickable: true,
                el: `.${styles.pagination}`
            } : false, keyboard: {
                enabled: true,
                onlyInViewport: true
            }, a11y: {
                enabled: true,
                prevSlideMessage: 'Forrige lysbilde',
                nextSlideMessage: 'Neste lysbilde',
                firstSlideMessage: 'Dette er første lysbilde',
                lastSlideMessage: 'Dette er siste lysbilde',
                paginationBulletMessage: 'Gå til lysbilde {{index}}'
            }, className: styles.swiper }, items.map((item, index) => (React.createElement(SwiperSlide, { key: `${item.link}-${index}`, className: styles.slide, role: "group", "aria-roledescription": "lysbilde", "aria-label": `${index + 1} av ${totalSlides}: ${item.title}` },
            React.createElement(FeedItem, { item: item, variant: "banner", showImage: !hideImages, showDescription: showDescription, showDate: showPubDate, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onItemClick: handleItemClick, descriptionTruncation: { maxLines: 2, maxChars: 150 }, imageAspectRatio: "auto", testId: `${testId}-item-${index}` }))))),
        showNavigation && items.length > 1 && (React.createElement(React.Fragment, null,
            React.createElement("button", { className: `${styles.navButton} ${styles.navPrev}`, "aria-label": "Forrige lysbilde", "data-testid": `${testId}-prev` },
                React.createElement("span", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })),
            React.createElement("button", { className: `${styles.navButton} ${styles.navNext}`, "aria-label": "Neste lysbilde", "data-testid": `${testId}-next` },
                React.createElement("span", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })))),
        showPagination && items.length > 1 && (React.createElement("div", { className: styles.pagination, "data-testid": `${testId}-pagination` })),
        React.createElement("div", { "aria-live": "polite", "aria-atomic": "true", className: styles.srOnly },
            "Lysbilde ",
            currentSlide,
            " av ",
            totalSlides,
            isPaused && ' (pauset)')));
};
export default React.memo(BannerCarousel);
//# sourceMappingURL=BannerCarousel.js.map