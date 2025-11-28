/**
 * MinimalLayout Component
 *
 * Ultra-compact text-only layout for displaying RSS feed items.
 * Perfect for sidebar (1/3 column) views and narrow spaces.
 *
 * Features:
 * - No images (text-only)
 * - Minimal spacing and padding
 * - Efficient use of vertical space
 * - Clean, professional design
 * - Optimized for narrow columns
 */
import * as React from 'react';
import { useCallback } from 'react';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './MinimalLayout.module.scss';
/**
 * Format date for Norwegian locale
 */
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return '';
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        // Relative time for recent items
        if (diffHours < 1)
            return 'Akkurat nå';
        if (diffHours < 24)
            return `${diffHours} t siden`;
        if (diffDays < 7)
            return `${diffDays} d siden`;
        // Short date format
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
 * Truncate text to a maximum length
 */
const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength)
        return text;
    return text.substring(0, maxLength).trim() + '…';
};
/**
 * MinimalLayout component
 */
export const MinimalLayout = ({ items, showPubDate = true, showDescription = false, showSource = false, truncateDescription = 80, isLoading = false, skeletonCount = 5, onItemClick, className = '', testId = 'minimal-layout' }) => {
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
    // Handle keyboard navigation
    const handleKeyDown = useCallback((item, event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onItemClick) {
                onItemClick(item);
            }
            else {
                window.open(item.link, '_blank', 'noopener,noreferrer');
            }
        }
    }, [onItemClick]);
    // Container classes
    const containerClasses = [
        styles.minimalLayout,
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(SkeletonGrid, { count: skeletonCount, type: "list", itemProps: {
                    showThumbnail: false,
                    showDescription: false
                }, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(NoItemsEmptyState, null)));
    }
    return (React.createElement("nav", { className: containerClasses, "data-testid": testId, role: "navigation", "aria-label": "Nyhetsliste" }, items.map((item, index) => (React.createElement("article", { key: `${item.link}-${index}`, className: styles.minimalItem, "data-testid": `${testId}-item-${index}` },
        React.createElement("a", { href: item.link, className: styles.itemLink, onClick: (e) => handleItemClick(item, e), onKeyDown: (e) => handleKeyDown(item, e), target: "_blank", rel: "noopener noreferrer", "aria-label": item.title },
            React.createElement("h3", { className: styles.itemTitle }, item.title),
            showDescription && item.description && (React.createElement("p", { className: styles.itemDescription }, truncateText(item.description.replace(/<[^>]*>/g, ''), truncateDescription))),
            (showPubDate || showSource) && (React.createElement("div", { className: styles.itemMeta },
                showPubDate && item.pubDate && (React.createElement("time", { className: styles.itemDate, dateTime: item.pubDate }, formatDate(item.pubDate))),
                showSource && item.author && (React.createElement("span", { className: styles.itemSource }, item.author))))))))));
};
export default React.memo(MinimalLayout);
//# sourceMappingURL=MinimalLayout.js.map