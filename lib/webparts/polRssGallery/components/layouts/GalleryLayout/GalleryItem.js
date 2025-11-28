/**
 * GalleryItem Component
 *
 * Individual gallery item with image, hover effects, and title display options.
 * Designed for image-first display with minimal text.
 *
 * Features:
 * - Configurable title display (hover, below, none)
 * - Smooth hover animations
 * - Keyboard accessible
 * - Touch-friendly
 */
import * as React from 'react';
import { useCallback } from 'react';
import styles from './GalleryLayout.module.scss';
/**
 * Aspect ratio CSS values
 */
const aspectRatioValues = {
    '1:1': '1/1',
    '4:3': '4/3',
    '16:9': '16/9'
};
/**
 * Title position CSS class mapping
 */
const titlePositionClasses = {
    hover: 'title-hover',
    below: 'title-below',
    none: 'title-none'
};
/**
 * Format date for display
 */
const formatDate = (dateString) => {
    if (!dateString)
        return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return '';
        return date.toLocaleDateString('nb-NO', {
            day: 'numeric',
            month: 'short'
        });
    }
    catch (_a) {
        return '';
    }
};
/**
 * GalleryItem component
 */
export const GalleryItem = ({ item, showTitle, aspectRatio, fallbackImageUrl, forceFallback = false, onClick, className = '', testId = 'gallery-item' }) => {
    // Get image URL with fallback - if forceFallback is true, use fallbackImageUrl
    const imageUrl = forceFallback && fallbackImageUrl
        ? fallbackImageUrl
        : (item.imageUrl || fallbackImageUrl);
    // Handle click
    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(item);
        }
        else if (item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }, [item, onClick]);
    // Handle keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }, [handleClick]);
    // Build class names - use type assertion to satisfy TypeScript
    const titleClass = titlePositionClasses[showTitle];
    const itemClasses = [
        styles.galleryItem,
        styles[titleClass],
        className
    ].filter(Boolean).join(' ');
    // CSS custom properties for aspect ratio
    const imageWrapperStyle = {
        '--aspect-ratio': aspectRatioValues[aspectRatio]
    };
    return (React.createElement("article", { className: itemClasses, onClick: handleClick, onKeyDown: handleKeyDown, tabIndex: 0, role: "link", "aria-label": item.title, "data-testid": testId },
        React.createElement("div", { className: styles.imageWrapper, style: imageWrapperStyle },
            imageUrl ? (React.createElement("img", { src: imageUrl, alt: item.title, loading: "lazy", className: styles.image, "data-testid": `${testId}-image` })) : (React.createElement("div", { className: styles.noImage, "aria-hidden": "true", "data-testid": `${testId}-no-image` },
                React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1", className: styles.noImageIcon },
                    React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                    React.createElement("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                    React.createElement("polyline", { points: "21 15 16 10 5 21" })))),
            showTitle === 'hover' && (React.createElement("div", { className: styles.hoverOverlay, "data-testid": `${testId}-hover-overlay` },
                React.createElement("h3", { className: styles.title }, item.title),
                item.pubDate && (React.createElement("time", { className: styles.date, dateTime: item.pubDate }, formatDate(item.pubDate)))))),
        showTitle === 'below' && (React.createElement("div", { className: styles.titleBelow, "data-testid": `${testId}-title-below` },
            React.createElement("h3", { className: styles.title }, item.title)))));
};
export default GalleryItem;
//# sourceMappingURL=GalleryItem.js.map