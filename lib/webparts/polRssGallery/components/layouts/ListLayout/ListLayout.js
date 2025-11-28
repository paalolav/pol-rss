/**
 * ListLayout Component
 *
 * A vertical list layout for displaying RSS feed items.
 * Includes thumbnail positioning options and compact mode.
 *
 * Features:
 * - Thumbnail position (left, right, none)
 * - Thumbnail size options
 * - Compact mode
 * - Dividers between items
 * - Skeleton loading state
 */
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FeedItem } from '../../shared/FeedItem';
import { SkeletonGrid } from '../../shared/Skeleton';
import { NoItemsEmptyState } from '../../shared/EmptyState';
import styles from './ListLayout.module.scss';
/**
 * Thumbnail size to aspect ratio mapping
 */
const thumbnailSizeToAspectRatio = {
    sm: '1:1',
    md: '4:3',
    lg: '16:9'
};
/**
 * ListLayout component
 */
export const ListLayout = ({ items, thumbnailPosition = 'left', thumbnailSize = 'md', compact = false, showDividers = true, fallbackImageUrl, forceFallback = false, hideImages = false, showPubDate = true, showDescription = true, truncateDescription = 200, isLoading = false, skeletonCount = 5, onItemClick, className = '', testId = 'list-layout' }) => {
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
    // Cast styles to allow dynamic access
    const stylesAny = styles;
    // Thumbnail position class mapping
    const thumbnailPositionClasses = {
        left: stylesAny.thumbnailLeft || '',
        right: stylesAny.thumbnailRight || '',
        none: ''
    };
    // Thumbnail size class mapping
    const thumbnailSizeClasses = {
        sm: stylesAny.thumbnailSizeSm || '',
        md: stylesAny.thumbnailSizeMd || '',
        lg: stylesAny.thumbnailSizeLg || ''
    };
    // Container classes
    const containerClasses = [
        styles.listLayout,
        compact ? (stylesAny.compact || '') : '',
        showDividers ? styles.withDividers : '',
        thumbnailPositionClasses[thumbnailPosition],
        thumbnailSizeClasses[thumbnailSize],
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(SkeletonGrid, { count: skeletonCount, type: "list", itemProps: {
                    showThumbnail: thumbnailPosition !== 'none',
                    showDescription
                }, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (React.createElement("div", { className: containerClasses, "data-testid": testId },
            React.createElement(NoItemsEmptyState, null)));
    }
    return (React.createElement("div", { className: containerClasses, "data-testid": testId, key: layoutKey, role: "list", "aria-label": "Nyhetsliste" }, items.map((item, index) => (React.createElement("div", { key: `${item.link}-${index}`, className: styles.listItem, role: "listitem" },
        React.createElement(FeedItem, { item: item, variant: "list", showImage: !hideImages && thumbnailPosition !== 'none', showDescription: showDescription, showDate: showPubDate, imageAspectRatio: thumbnailSizeToAspectRatio[thumbnailSize], fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onItemClick: handleItemClick, descriptionTruncation: {
                maxChars: truncateDescription,
                maxLines: compact ? 2 : 3
            }, testId: `${testId}-item-${index}` }))))));
};
export default React.memo(ListLayout);
//# sourceMappingURL=ListLayout.js.map