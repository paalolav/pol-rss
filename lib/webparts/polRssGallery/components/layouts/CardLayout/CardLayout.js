/**
 * CardLayout Component
 *
 * A responsive grid layout for displaying RSS feed items as cards.
 * Uses ResponsiveGrid for container-based responsive behavior.
 *
 * Features:
 * - Responsive grid layout
 * - Configurable columns and gap
 * - Card hover effects
 * - Lazy loading images
 * - Skeleton loading state
 */
import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ResponsiveGrid } from '../../ResponsiveGrid';
import { FeedItem } from '../../shared/FeedItem';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './CardLayout.module.scss';
/**
 * Card size to minimum width mapping
 */
const cardSizeToMinWidth = {
    sm: 220,
    md: 280,
    lg: 340
};
/**
 * CardLayout component
 */
export const CardLayout = ({ items, columns = 'auto', cardSize = 'md', gap = 'md', fallbackImageUrl, forceFallback = false, hideImages = false, showPubDate = true, showDescription = true, truncateDescription = 150, imageAspectRatio = '16:9', isLoading = false, skeletonCount = 6, onItemClick, className = '', testId = 'card-layout' }) => {
    // Key for forcing re-render when forceFallback changes
    const [layoutKey, setLayoutKey] = useState(0);
    useEffect(() => {
        setLayoutKey(prev => prev + 1);
    }, [forceFallback]);
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
    // Calculate max columns
    const maxColumns = useMemo(() => {
        if (columns === 'auto') {
            return 4;
        }
        return columns;
    }, [columns]);
    // Get min item width
    const minItemWidth = useMemo(() => {
        return cardSizeToMinWidth[cardSize];
    }, [cardSize]);
    // Container classes
    const containerClasses = [
        styles.cardLayout,
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(SkeletonGrid, { count: skeletonCount, type: "card", itemProps: {
                    showDescription
                }, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(NoItemsEmptyState, null)));
    }
    return (React.createElement("div", { className: containerClasses, "data-testid": testId, key: layoutKey },
        React.createElement(ResponsiveGrid, { minItemWidth: minItemWidth, maxColumns: maxColumns, gap: gap, testId: `${testId}-grid` }, items.map((item, index) => (React.createElement(FeedItem, { key: `${item.link}-${index}`, item: item, variant: "card", showImage: !hideImages, showDescription: showDescription, showDate: showPubDate, imageAspectRatio: imageAspectRatio, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onItemClick: handleItemClick, descriptionTruncation: {
                maxChars: truncateDescription,
                maxLines: 3
            }, className: styles.card, testId: `${testId}-item-${index}` }))))));
};
export default React.memo(CardLayout);
//# sourceMappingURL=CardLayout.js.map