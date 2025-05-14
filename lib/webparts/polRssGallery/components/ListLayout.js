import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';
const arePropsEqual = (prevProps, nextProps) => {
    return (prevProps.forceFallback === nextProps.forceFallback &&
        prevProps.fallbackImageUrl === nextProps.fallbackImageUrl &&
        prevProps.showDescription === nextProps.showDescription &&
        prevProps.showPubDate === nextProps.showPubDate &&
        prevProps.items.length === nextProps.items.length &&
        prevProps.items.every((item, index) => item.title === nextProps.items[index].title &&
            item.link === nextProps.items[index].link &&
            item.imageUrl === nextProps.items[index].imageUrl));
};
const ListLayout = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription }) => {
    const [layoutKey, setLayoutKey] = useState(0);
    useEffect(() => {
        setLayoutKey((prevKey) => prevKey + 1);
    }, [forceFallback]);
    const handleImgError = useCallback((e) => {
        imgError(e, fallbackImageUrl);
    }, [fallbackImageUrl]);
    const memoizedItems = useMemo(() => items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);
        return (React.createElement("div", { key: `${item.link}-${index}`, className: styles.listItem },
            imgSrc ? (React.createElement("img", { src: imgSrc, alt: item.title, className: styles.thumbnail, onError: handleImgError, loading: "lazy" })) : (React.createElement("div", { className: styles.cardImagePlaceholder },
                React.createElement("i", { className: "ms-Icon ms-Icon--Photo2", "aria-hidden": "true" }))),
            React.createElement("div", { className: styles.content },
                React.createElement("a", { href: item.link, className: styles.title, target: "_blank", rel: "noopener noreferrer" }, item.title),
                showPubDate && item.pubDate && (React.createElement("div", { className: styles.pubDate }, new Date(item.pubDate).toLocaleDateString())),
                showDescription && item.description && (React.createElement("div", { className: styles.description }, parse(item.description))))));
    }), [items, fallbackImageUrl, forceFallback, showPubDate, showDescription, handleImgError]);
    return (React.createElement("div", { key: layoutKey, className: styles.listLayout }, memoizedItems));
};
export default React.memo(ListLayout, arePropsEqual);
//# sourceMappingURL=ListLayout.js.map