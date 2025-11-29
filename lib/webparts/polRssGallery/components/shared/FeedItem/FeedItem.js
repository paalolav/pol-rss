/**
 * FeedItem Component
 *
 * A shared component used by all layout types (card, list, banner).
 * Provides consistent rendering of RSS feed items with configurable display options.
 *
 * Features:
 * - Multiple variant styles (card, list, banner)
 * - Configurable visibility for each element
 * - Accessible markup with proper semantics
 * - Hover/focus states
 * - Integration with ResponsiveImage for lazy loading
 */
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { ResponsiveImage, ImagePlaceholder } from '../../ResponsiveImage';
import { sanitizer } from '../../../services/contentSanitizer';
import styles from './FeedItem.module.scss';
/**
 * Format a date string to a localized format
 */
const formatDate = (dateString, locale = 'nb-NO') => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    catch (_a) {
        return dateString;
    }
};
/**
 * Truncate text to a maximum number of characters
 */
const truncateText = (text, maxChars) => {
    if (!maxChars || text.length <= maxChars) {
        return text;
    }
    return text.slice(0, maxChars).trim() + '…';
};
/**
 * Strip HTML tags from text
 */
const stripHtml = (html) => {
    // Use sanitizer to clean HTML first, then strip tags
    const cleaned = sanitizer.sanitize(html);
    const temp = document.createElement('div');
    temp.innerHTML = cleaned;
    return temp.textContent || temp.innerText || '';
};
/**
 * FeedItem component for rendering RSS feed items
 */
export const FeedItem = ({ item, variant, showImage = true, showDescription = true, showDate = true, showCategories = false, showSource = false, imageAspectRatio = '16:9', fallbackImageUrl, forceFallback = false, onItemClick, descriptionTruncation, titleTruncation, className = '', testId = 'feed-item', locale = 'nb-NO', imageAsLink = true, isInverted = false }) => {
    const handleClick = useCallback((event) => {
        if (onItemClick) {
            onItemClick(item, event);
        }
    }, [item, onItemClick]);
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onItemClick) {
                onItemClick(item, event);
            }
            else {
                window.open(item.link, '_blank', 'noopener,noreferrer');
            }
        }
    }, [item, onItemClick]);
    // Process description
    const processedDescription = useMemo(() => {
        if (!item.description)
            return '';
        const plainText = stripHtml(item.description);
        return truncateText(plainText, descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxChars);
    }, [item.description, descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxChars]);
    // Process title
    const processedTitle = useMemo(() => {
        return truncateText(item.title, titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxChars);
    }, [item.title, titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxChars]);
    // Format date
    const formattedDate = useMemo(() => {
        return item.pubDate ? formatDate(item.pubDate, locale) : '';
    }, [item.pubDate, locale]);
    // Generate unique key for categories
    const getCategoryKey = useCallback((category, index) => {
        return `${item.link}-category-${index}`;
    }, [item.link]);
    // Container classes
    const containerClasses = [
        styles.feedItem,
        styles[variant],
        isInverted ? styles.inverted : '',
        className
    ].filter(Boolean).join(' ');
    // Description style for line clamping
    const descriptionStyle = (descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxLines) ? {
        WebkitLineClamp: descriptionTruncation.maxLines,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } : {};
    // Title style for line clamping
    const titleStyle = (titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxLines) ? {
        WebkitLineClamp: titleTruncation.maxLines,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } : {};
    // Render image section
    const renderImage = () => {
        if (!showImage)
            return null;
        // Determine which image to use
        const useForced = forceFallback && fallbackImageUrl;
        const imageSrc = useForced ? fallbackImageUrl : item.imageUrl;
        const imageContent = imageSrc ? (React.createElement(ResponsiveImage, { src: imageSrc, alt: item.title, aspectRatio: imageAspectRatio, fallbackSrc: fallbackImageUrl, className: styles.image, testId: `${testId}-image` })) : fallbackImageUrl ? (React.createElement(ResponsiveImage, { src: fallbackImageUrl, alt: item.title, aspectRatio: imageAspectRatio, className: styles.image, testId: `${testId}-image` })) : (React.createElement(ImagePlaceholder, { alt: item.title, aspectRatio: imageAspectRatio, icon: React.createElement("span", { className: "ms-Icon ms-Icon--Photo2", "aria-hidden": "true" }), testId: `${testId}-placeholder` }));
        if (imageAsLink) {
            return (React.createElement("a", { href: item.link, className: styles.imageLink, target: "_blank", rel: "noopener noreferrer", tabIndex: -1, "aria-hidden": "true" }, imageContent));
        }
        return (React.createElement("div", { className: styles.imageWrapper }, imageContent));
    };
    return (React.createElement("article", { className: containerClasses, "data-testid": testId, "data-variant": variant, onClick: onItemClick ? handleClick : undefined, onKeyDown: onItemClick ? handleKeyDown : undefined, tabIndex: onItemClick ? 0 : undefined, role: onItemClick ? 'button' : undefined },
        renderImage(),
        React.createElement("div", { className: styles.content },
            React.createElement("h3", { className: styles.title, style: titleStyle },
                React.createElement("a", { href: item.link, className: styles.titleLink, target: "_blank", rel: "noopener noreferrer" }, processedTitle)),
            (showDate || showSource) && (React.createElement("div", { className: styles.meta },
                showDate && formattedDate && (React.createElement("time", { className: styles.date, dateTime: item.pubDate }, formattedDate)),
                showSource && item.author && (React.createElement("span", { className: styles.source }, item.author)))),
            showDescription && processedDescription && (React.createElement("p", { className: styles.description, style: descriptionStyle }, processedDescription)),
            showCategories && item.categories && item.categories.length > 0 && (React.createElement("div", { className: styles.categories }, item.categories.map((category, index) => (React.createElement("span", { key: getCategoryKey(category, index), className: styles.category }, category))))))));
};
export default React.memo(FeedItem);
//# sourceMappingURL=FeedItem.js.map