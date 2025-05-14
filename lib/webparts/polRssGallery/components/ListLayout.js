import * as React from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';
import { useState, useEffect } from 'react';
const ListLayout = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription }) => {
    // Add a state to track a unique key for re-rendering
    const [layoutKey, setLayoutKey] = useState(0);
    useEffect(() => {
        // Increment the key whenever forceFallback changes
        setLayoutKey((prevKey) => prevKey + 1);
    }, [forceFallback]);
    return (React.createElement("div", { key: layoutKey, className: styles.listLayout }, items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);
        return (React.createElement("div", { key: index, className: styles.listItem },
            imgSrc ? (React.createElement("img", { src: imgSrc, alt: item.title, className: styles.thumbnail, onError: (e) => imgError(e, fallbackImageUrl) })) : (React.createElement("div", { className: styles.cardImagePlaceholder },
                React.createElement("i", { className: "ms-Icon ms-Icon--Photo2", "aria-hidden": "true" }))),
            React.createElement("div", { className: styles.content },
                React.createElement("a", { href: item.link, className: styles.title, target: "_blank", rel: "noopener noreferrer" }, item.title),
                showPubDate && item.pubDate && (React.createElement("div", { className: styles.pubDate }, new Date(item.pubDate).toLocaleDateString())),
                showDescription && item.description && (React.createElement("div", { className: styles.description }, parse(item.description))))));
    })));
};
export default ListLayout;
//# sourceMappingURL=ListLayout.js.map