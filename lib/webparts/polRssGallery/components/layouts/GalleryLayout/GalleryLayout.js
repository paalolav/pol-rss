/**
 * GalleryLayout Component
 *
 * A masonry-style image grid layout for RSS feed items.
 * Images are the hero - titles shown on hover or below.
 *
 * Features:
 * - Responsive grid with configurable columns
 * - Container query-based responsiveness
 * - Hover effects with title overlay
 * - Lazy loading images
 * - Skeleton loading state
 * - Empty state for items without images
 */
import * as React from 'react';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import { GalleryItem } from './GalleryItem';
import { GallerySkeleton } from './GallerySkeleton';
import styles from './GalleryLayout.module.scss';
/**
 * Gap size CSS values
 */
const gapValues = {
    sm: '8px',
    md: '16px',
    lg: '24px'
};
/**
 * GalleryLayout component
 */
export const GalleryLayout = ({ items, columns = 'auto', gap = 'md', showTitles = 'below', aspectRatio = '4:3', fallbackImageUrl, forceFallback = false, filterNoImages = true, showDate = true, showDescription = false, showSource = false, isLoading = false, skeletonCount = 8, onItemClick, className = '', testId = 'gallery-layout', isInverted = false }) => {
    // Key for forcing re-render when forceFallback changes
    const [layoutKey, setLayoutKey] = useState(0);
    useEffect(() => {
        setLayoutKey(prev => prev + 1);
    }, [forceFallback]);
    // Filter items - either filter out those without images, or include all
    const displayItems = useMemo(() => {
        if (!items)
            return [];
        // If force fallback is on or we have a fallback URL, show all items
        if (forceFallback || !filterNoImages) {
            return items;
        }
        // Otherwise filter to only items with images or fallback available
        return items.filter(item => item.imageUrl || fallbackImageUrl);
    }, [items, forceFallback, filterNoImages, fallbackImageUrl]);
    // Handle item click
    const handleItemClick = useCallback((item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    }, [onItemClick]);
    // CSS custom properties for grid
    const gridStyle = {
        '--gallery-columns': columns === 'auto' ? 'auto-fill' : columns,
        '--gallery-gap': gapValues[gap]
    };
    // Container classes
    const containerClasses = [
        styles.gallery,
        columns !== 'auto' ? styles[`columns-${columns}`] : '',
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (React.createElement("div", { className: containerClasses, style: gridStyle, "data-testid": testId },
            React.createElement(GallerySkeleton, { count: skeletonCount, aspectRatio: aspectRatio, showTitles: showTitles, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!displayItems || displayItems.length === 0) {
        return (React.createElement("div", { className: className, "data-testid": testId },
            React.createElement(NoItemsEmptyState, null)));
    }
    return (React.createElement("div", { className: containerClasses, style: gridStyle, "data-testid": testId, key: layoutKey }, displayItems.map((item, index) => (React.createElement(GalleryItem, { key: `${item.link}-${index}`, item: item, showTitle: showTitles, aspectRatio: aspectRatio, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, showDate: showDate, showDescription: showDescription, showSource: showSource, onClick: onItemClick ? handleItemClick : undefined, testId: `${testId}-item-${index}`, isInverted: isInverted })))));
};
export default React.memo(GalleryLayout);
//# sourceMappingURL=GalleryLayout.js.map