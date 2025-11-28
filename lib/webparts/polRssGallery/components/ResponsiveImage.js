/**
 * ResponsiveImage Component
 *
 * A responsive image component with:
 * - Native lazy loading
 * - Aspect ratio preservation
 * - Loading skeleton
 * - Error fallback
 * - Alt text requirements
 */
import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './ResponsiveImage.module.scss';
/**
 * Aspect ratio to padding-bottom percentage mapping
 */
const aspectRatioToPadding = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:2': '66.67%',
    '21:9': '42.86%'
};
/**
 * ResponsiveImage component with lazy loading and fallbacks
 */
export const ResponsiveImage = ({ src, alt, aspectRatio = '16:9', loading = 'lazy', fallbackSrc, objectFit = 'cover', className = '', width, height, onLoad, onError, testId = 'responsive-image', showSkeleton = true, fadeIn = true }) => {
    const [state, setState] = useState('loading');
    const [currentSrc, setCurrentSrc] = useState(src);
    const imgRef = useRef(null);
    // Reset state when src changes
    useEffect(() => {
        setState('loading');
        setCurrentSrc(src);
    }, [src]);
    const handleLoad = useCallback(() => {
        setState('loaded');
        onLoad === null || onLoad === void 0 ? void 0 : onLoad();
    }, [onLoad]);
    const handleError = useCallback(() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            // Try fallback image
            setCurrentSrc(fallbackSrc);
            setState('loading');
        }
        else {
            setState('error');
            onError === null || onError === void 0 ? void 0 : onError(new Error(`Failed to load image: ${src}`));
        }
    }, [fallbackSrc, currentSrc, src, onError]);
    // Check if image is already cached
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            handleLoad();
        }
    }, [handleLoad]);
    const containerStyle = aspectRatio !== 'auto' ? {
        paddingBottom: aspectRatioToPadding[aspectRatio]
    } : {};
    const imageStyle = {
        objectFit
    };
    const containerClasses = [
        styles.imageContainer,
        aspectRatio !== 'auto' ? styles.hasAspectRatio : '',
        className
    ].filter(Boolean).join(' ');
    const imageClasses = [
        styles.image,
        state === 'loaded' && fadeIn ? styles.fadeIn : '',
        state === 'loaded' ? styles.loaded : ''
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId, "data-state": state, "data-aspect": aspectRatio },
        showSkeleton && state === 'loading' && (React.createElement("div", { className: styles.skeleton, "data-testid": `${testId}-skeleton`, "aria-hidden": "true" })),
        state === 'error' && (React.createElement("div", { className: styles.error, "data-testid": `${testId}-error`, role: "img", "aria-label": alt },
            React.createElement("span", { className: styles.errorIcon, "aria-hidden": "true" }, "\uD83D\uDCF7"),
            React.createElement("span", { className: styles.errorText }, "Image unavailable"))),
        state !== 'error' && (React.createElement("img", { ref: imgRef, src: currentSrc, alt: alt, loading: loading, width: width, height: height, style: imageStyle, className: imageClasses, onLoad: handleLoad, onError: handleError, "data-testid": `${testId}-img` }))));
};
/**
 * Placeholder component for missing images
 */
export const ImagePlaceholder = ({ alt, aspectRatio = '16:9', icon = '📰', className = '', testId = 'image-placeholder' }) => {
    const containerStyle = aspectRatio !== 'auto' ? {
        paddingBottom: aspectRatioToPadding[aspectRatio]
    } : {};
    return (React.createElement("div", { className: `${styles.imageContainer} ${styles.placeholder} ${className}`, style: containerStyle, "data-testid": testId, role: "img", "aria-label": alt },
        React.createElement("div", { className: styles.placeholderContent },
            React.createElement("span", { className: styles.placeholderIcon, "aria-hidden": "true" }, icon))));
};
export default ResponsiveImage;
//# sourceMappingURL=ResponsiveImage.js.map