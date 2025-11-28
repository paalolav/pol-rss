/**
 * GallerySkeleton Component
 *
 * Skeleton loading state for the gallery layout.
 * Matches the gallery grid structure with animated placeholders.
 */
import * as React from 'react';
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
 * GallerySkeleton component
 */
export const GallerySkeleton = ({ count = 8, aspectRatio = '4:3', showTitles = 'below', testId = 'gallery-skeleton' }) => {
    const items = Array.from({ length: count }, (_, i) => i);
    const imageStyle = {
        '--aspect-ratio': aspectRatioValues[aspectRatio]
    };
    return (React.createElement(React.Fragment, null, items.map((index) => (React.createElement("div", { key: index, className: styles.skeletonItem, "aria-hidden": "true", "data-testid": `${testId}-item-${index}` },
        React.createElement("div", { className: styles.skeletonImage, style: imageStyle }),
        showTitles === 'below' && (React.createElement("div", { className: styles.skeletonTitle })))))));
};
export default GallerySkeleton;
//# sourceMappingURL=GallerySkeleton.js.map