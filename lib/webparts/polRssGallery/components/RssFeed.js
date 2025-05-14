import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import BannerCarousel from './BannerCarousel';
import CardLayout from './CardLayout';
import ListLayout from './ListLayout';
import { cleanDescription, resolveImageUrl, findImage } from './rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import styles from './RssFeed.module.scss';
const rssCache = {};
const RssFeed = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const [items, setItems] = React.useState(null);
    const [error, setError] = React.useState(null);
    const fetchFeed = (now) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        fetch(props.feedUrl, { signal: controller.signal })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return response.text();
        })
            .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, 'application/xml');
            if (xml.querySelector('parsererror')) {
                throw new Error(strings.ErrorParsingFeed);
            }
            const rssItems = [];
            xml.querySelectorAll('item').forEach(itemNode => {
                const titleNode = itemNode.querySelector('title');
                const linkNode = itemNode.querySelector('link');
                const dateNode = itemNode.querySelector('pubDate');
                const descNode = itemNode.querySelector('description');
                const rawImageUrl = findImage(itemNode);
                const finalImageUrl = rawImageUrl ? resolveImageUrl(rawImageUrl) : props.fallbackImageUrl;
                const cleanedDescription = cleanDescription((descNode === null || descNode === void 0 ? void 0 : descNode.textContent) || '');
                rssItems.push({
                    title: (titleNode === null || titleNode === void 0 ? void 0 : titleNode.textContent) || '',
                    link: (linkNode === null || linkNode === void 0 ? void 0 : linkNode.textContent) || '',
                    pubDate: (dateNode === null || dateNode === void 0 ? void 0 : dateNode.textContent) || '',
                    description: cleanedDescription,
                    imageUrl: finalImageUrl,
                });
            });
            rssCache[props.feedUrl] = { timestamp: now, items: rssItems }; // Cache feed
            setItems(rssItems);
        })
            .catch(err => {
            console.error('RSS fetch error', err);
            setError(err.message || strings.ErrorLoadingFeed);
            setItems([]);
        })
            .finally(() => {
            clearTimeout(timeoutId);
        });
    };
    const loadFeed = (forceReload = false) => {
        if (!props.feedUrl) {
            setItems([]);
            return;
        }
        setError(null);
        const cached = rssCache[props.feedUrl];
        const now = Date.now();
        const maxAge = props.refreshInterval * 60 * 1000;
        const isCacheFresh = cached && (now - cached.timestamp < maxAge);
        if (isCacheFresh && !forceReload) {
            setItems(cached.items);
            return;
        }
        setItems(null);
        fetchFeed(now);
    };
    React.useEffect(() => {
        let intervalId;
        loadFeed();
        if (props.autoRefresh && props.refreshInterval > 0) {
            intervalId = setInterval(() => {
                loadFeed(true);
            }, props.refreshInterval * 60 * 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [props.feedUrl, props.forceFallbackImage, props.fallbackImageUrl, props.autoRefresh, props.refreshInterval]);
    const handleRetry = () => {
        loadFeed();
    };
    if (error) {
        return (React.createElement("div", { className: styles.error },
            React.createElement("p", null, error),
            React.createElement(DefaultButton, { text: strings.RetryButtonText, onClick: handleRetry })));
    }
    if (items === null) {
        return React.createElement(Spinner, { label: strings.LoadingMessage });
    }
    if (items.length === 0) {
        return React.createElement("div", { className: styles.noItems }, strings.NoItemsMessage);
    }
    const limitedItems = items.slice(0, props.maxItems);
    const renderLayout = () => {
        switch (props.layout) {
            case 'banner':
                return (React.createElement(BannerCarousel, { items: limitedItems, autoscroll: props.autoscroll, interval: props.interval, fallbackImageUrl: props.fallbackImageUrl, forceFallback: props.forceFallbackImage, showPubDate: props.showPubDate, showDescription: props.showDescription }));
            case 'card':
                return (React.createElement(CardLayout, { items: limitedItems, fallbackImageUrl: props.fallbackImageUrl, forceFallback: props.forceFallbackImage, showPubDate: props.showPubDate, showDescription: props.showDescription }));
            case 'list':
            default:
                return (React.createElement(ListLayout, { items: limitedItems, fallbackImageUrl: props.fallbackImageUrl, forceFallback: props.forceFallbackImage, showPubDate: props.showPubDate, showDescription: props.showDescription }));
        }
    };
    return (React.createElement("div", { className: styles.webpart, style: { fontFamily: (_d = (_c = (_b = (_a = props.themeVariant) === null || _a === void 0 ? void 0 : _a.fonts) === null || _b === void 0 ? void 0 : _b.medium) === null || _c === void 0 ? void 0 : _c.fontFamily) !== null && _d !== void 0 ? _d : '"Segoe UI", sans-serif' } },
        props.webPartTitle && (React.createElement("h2", { className: styles.webPartHeader, style: {
                fontFamily: (_h = (_g = (_f = (_e = props.themeVariant) === null || _e === void 0 ? void 0 : _e.fonts) === null || _f === void 0 ? void 0 : _f.medium) === null || _g === void 0 ? void 0 : _g.fontFamily) !== null && _h !== void 0 ? _h : '"Segoe UI", sans-serif',
                fontSize: (_m = (_l = (_k = (_j = props.themeVariant) === null || _j === void 0 ? void 0 : _j.fonts) === null || _k === void 0 ? void 0 : _k.xLarge) === null || _l === void 0 ? void 0 : _l.fontSize) !== null && _m !== void 0 ? _m : '24px'
            } }, props.webPartTitle)),
        renderLayout()));
};
export default RssFeed;
//# sourceMappingURL=RssFeed.js.map