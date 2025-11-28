/**
 * Skeleton Loading Components
 *
 * A set of skeleton loading components for displaying loading states.
 * Includes base Skeleton component and layout-specific variants.
 *
 * Features:
 * - Multiple animation styles (pulse, wave, none)
 * - Multiple shape variants (text, rectangular, circular)
 * - Layout-specific skeletons (card, list, banner)
 * - Reduced motion support
 * - Accessible (hidden from screen readers)
 */
import * as React from 'react';
import styles from './Skeleton.module.scss';
/**
 * Base Skeleton component
 */
export const Skeleton = ({ variant = 'text', width, height, animation = 'wave', className = '', testId = 'skeleton' }) => {
    const style = {
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height && { height: typeof height === 'number' ? `${height}px` : height })
    };
    const classes = [
        styles.skeleton,
        styles[variant],
        styles[animation],
        className
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, style: style, "aria-hidden": "true", "data-testid": testId }));
};
/**
 * Skeleton for card layout items
 */
export const CardSkeleton = ({ showDescription = true, showCategories = false, animation = 'wave', className = '', testId = 'card-skeleton' }) => {
    return (React.createElement("div", { className: `${styles.cardSkeleton} ${className}`, "data-testid": testId, "aria-hidden": "true" },
        React.createElement(Skeleton, { variant: "rectangular", height: 180, animation: animation, testId: `${testId}-image` }),
        React.createElement("div", { className: styles.cardContent },
            React.createElement(Skeleton, { variant: "text", width: "90%", height: 20, animation: animation, testId: `${testId}-title` }),
            React.createElement(Skeleton, { variant: "text", width: "40%", height: 14, animation: animation, testId: `${testId}-date` }),
            showDescription && (React.createElement("div", { className: styles.descriptionLines },
                React.createElement(Skeleton, { variant: "text", width: "100%", height: 14, animation: animation }),
                React.createElement(Skeleton, { variant: "text", width: "85%", height: 14, animation: animation }),
                React.createElement(Skeleton, { variant: "text", width: "70%", height: 14, animation: animation }))),
            showCategories && (React.createElement("div", { className: styles.categoriesRow },
                React.createElement(Skeleton, { variant: "rectangular", width: 60, height: 24, animation: animation, className: styles.categoryPill }),
                React.createElement(Skeleton, { variant: "rectangular", width: 80, height: 24, animation: animation, className: styles.categoryPill }))))));
};
/**
 * Skeleton for list layout items
 */
export const ListSkeleton = ({ showThumbnail = true, showDescription = true, showCategories = false, animation = 'wave', className = '', testId = 'list-skeleton' }) => {
    return (React.createElement("div", { className: `${styles.listSkeleton} ${className}`, "data-testid": testId, "aria-hidden": "true" },
        showThumbnail && (React.createElement(Skeleton, { variant: "rectangular", width: 120, height: 80, animation: animation, className: styles.thumbnail, testId: `${testId}-thumbnail` })),
        React.createElement("div", { className: styles.listContent },
            React.createElement(Skeleton, { variant: "text", width: "70%", height: 18, animation: animation, testId: `${testId}-title` }),
            React.createElement(Skeleton, { variant: "text", width: "25%", height: 14, animation: animation, testId: `${testId}-date` }),
            showDescription && (React.createElement("div", { className: styles.descriptionLines },
                React.createElement(Skeleton, { variant: "text", width: "100%", height: 14, animation: animation }),
                React.createElement(Skeleton, { variant: "text", width: "90%", height: 14, animation: animation }))),
            showCategories && (React.createElement("div", { className: styles.categoriesRow },
                React.createElement(Skeleton, { variant: "rectangular", width: 50, height: 20, animation: animation, className: styles.categoryPill }),
                React.createElement(Skeleton, { variant: "rectangular", width: 70, height: 20, animation: animation, className: styles.categoryPill }))))));
};
/**
 * Skeleton for banner/carousel layout
 */
export const BannerSkeleton = ({ showDescription = true, showCategories = false, animation = 'wave', height = 300, className = '', testId = 'banner-skeleton' }) => {
    return (React.createElement("div", { className: `${styles.bannerSkeleton} ${className}`, style: { height: typeof height === 'number' ? `${height}px` : height }, "data-testid": testId, "aria-hidden": "true" },
        React.createElement(Skeleton, { variant: "rectangular", width: "100%", height: "100%", animation: animation, className: styles.bannerBackground, testId: `${testId}-background` }),
        React.createElement("div", { className: styles.bannerContent },
            React.createElement(Skeleton, { variant: "text", width: "60%", height: 28, animation: animation, className: styles.bannerTitle, testId: `${testId}-title` }),
            React.createElement(Skeleton, { variant: "text", width: "20%", height: 16, animation: animation, testId: `${testId}-date` }),
            showDescription && (React.createElement("div", { className: styles.descriptionLines },
                React.createElement(Skeleton, { variant: "text", width: "80%", height: 16, animation: animation }),
                React.createElement(Skeleton, { variant: "text", width: "60%", height: 16, animation: animation }))),
            showCategories && (React.createElement("div", { className: styles.categoriesRow },
                React.createElement(Skeleton, { variant: "rectangular", width: 70, height: 24, animation: animation, className: styles.categoryPill }),
                React.createElement(Skeleton, { variant: "rectangular", width: 90, height: 24, animation: animation, className: styles.categoryPill }))))));
};
/**
 * Grid of skeleton items for loading states
 */
export const SkeletonGrid = ({ count = 6, type = 'card', animation = 'wave', itemProps = {}, className = '', testId = 'skeleton-grid' }) => {
    const items = Array.from({ length: count }, (_, index) => index);
    const renderSkeleton = (index) => {
        const key = `skeleton-${index}`;
        const itemTestId = `${testId}-item-${index}`;
        switch (type) {
            case 'list':
                return (React.createElement(ListSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
            case 'banner':
                return (React.createElement(BannerSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
            case 'card':
            default:
                return (React.createElement(CardSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
        }
    };
    const gridClass = type === 'list' ? styles.listGrid : styles.cardGrid;
    return (React.createElement("div", { className: `${gridClass} ${className}`, "data-testid": testId, "aria-busy": "true", "aria-label": "Loading content" }, items.map(renderSkeleton)));
};
export default Skeleton;
//# sourceMappingURL=Skeleton.js.map