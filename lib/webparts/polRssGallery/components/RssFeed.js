import * as React from 'react';
import { Spinner, DefaultButton, Shimmer, ShimmerElementType } from '@fluentui/react';
import styles from './RssFeed.module.scss';
// Lazy load layout components for code splitting - each becomes a separate chunk
const BannerCarousel = React.lazy(() => import(/* webpackChunkName: "layout-banner" */ './layouts/BannerCarousel')
    .then(module => ({ default: module.BannerCarousel })));
const CardLayout = React.lazy(() => import(/* webpackChunkName: "layout-card" */ './layouts/CardLayout')
    .then(module => ({ default: module.CardLayout })));
const ListLayout = React.lazy(() => import(/* webpackChunkName: "layout-list" */ './layouts/ListLayout')
    .then(module => ({ default: module.ListLayout })));
const MinimalLayout = React.lazy(() => import(/* webpackChunkName: "layout-minimal" */ './layouts/MinimalLayout')
    .then(module => ({ default: module.MinimalLayout })));
const GalleryLayout = React.lazy(() => import(/* webpackChunkName: "layout-gallery" */ './layouts/GalleryLayout')
    .then(module => ({ default: module.GalleryLayout })));
// Fallback component for lazy loading
const LayoutFallback = () => (React.createElement("div", { className: styles.layoutFallback },
    React.createElement(Shimmer, { shimmerElements: [
            { type: ShimmerElementType.line, height: 200 },
            { type: ShimmerElementType.gap, height: 16 },
            { type: ShimmerElementType.line, height: 24, width: '60%' },
            { type: ShimmerElementType.gap, height: 8 },
            { type: ShimmerElementType.line, height: 16, width: '80%' },
        ] })));
const extendedStyles = styles;
import { RssErrorBoundary } from './ErrorBoundary';
import { CacheService } from '../services/cacheService';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { RssSpecialFeedsHandler } from '../services/rssSpecialFeedsHandler';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { decodeResponseText } from '../services/encodingUtils';
const RssFeed = (props) => {
    const [items, setItems] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [retryCount, setRetryCount] = React.useState(0);
    const cacheService = React.useMemo(() => CacheService.getInstance(), []);
    const isDebugMode = React.useMemo(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.has('rssDebug') || urlParams.has('debugRss');
        }
        catch (_a) {
            return false;
        }
    }, []);
    const loadFeed = React.useCallback(async (_forceReload = false) => {
        if (!props.feedUrl) {
            setItems([]);
            setError(null);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const url = props.feedUrl;
            const refreshTime = props.refreshInterval * 60 * 1000;
            if (isDebugMode) {
                RssDebugUtils.setDebugMode(true);
                RssDebugUtils.log(`Loading RSS feed: ${url}`);
            }
            const isMeltwater = RssSpecialFeedsHandler.isMeltwaterFeed(url);
            if (isMeltwater && isDebugMode) {
                RssDebugUtils.log(`Detected Meltwater feed, applying special handling: ${url}`);
            }
            // Get feed data from cache or fetch it
            const cachedItems = await cacheService.get(url, async () => {
                const controller = new AbortController();
                const timeoutMs = isMeltwater ? 30000 : 15000;
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    let response;
                    let usingProxy = false;
                    let specialHandling = false;
                    if (RssSpecialFeedsHandler.isAuthenticatedFeed(url)) {
                        try {
                            if (isDebugMode) {
                                RssDebugUtils.log(`Using authentication handler for ${url}`);
                            }
                            response = await RssSpecialFeedsHandler.fetchAuthenticatedFeed(url);
                            specialHandling = true;
                        }
                        catch (specialError) {
                            if (isDebugMode) {
                                RssDebugUtils.warn(`Authentication handler failed: ${specialError instanceof Error ? specialError.message : 'Unknown error'}`);
                            }
                        }
                    }
                    if (!specialHandling || !response) {
                        const { ProxyService } = await import('../services/proxyService');
                        if (isDebugMode) {
                            ProxyService.setDebugMode(true);
                        }
                        try {
                            response = await fetch(url, { signal: controller.signal });
                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status} - ${response.statusText || 'Error'} (direct)`);
                            }
                            if (isDebugMode) {
                                RssDebugUtils.log(`Direct fetch succeeded for ${url}`);
                            }
                        }
                        catch (directError) {
                            if (isDebugMode) {
                                RssDebugUtils.warn(`Direct fetch failed: ${directError instanceof Error ? directError.message : 'Unknown error'}`);
                            }
                            try {
                                response = await ProxyService.fetchWithFirstProxy(url, { signal: controller.signal });
                                usingProxy = true;
                                if (isDebugMode) {
                                    RssDebugUtils.log(`Automatic proxy fallback succeeded for ${url}`);
                                }
                            }
                            catch (proxyError) {
                                if (isDebugMode) {
                                    RssDebugUtils.warn(`Automatic proxy fallback failed: ${proxyError instanceof Error ? proxyError.message : 'Unknown error'}`);
                                }
                                throw directError;
                            }
                        }
                    }
                    if (!response || !response.ok) {
                        throw new Error(`HTTP ${response === null || response === void 0 ? void 0 : response.status} - ${(response === null || response === void 0 ? void 0 : response.statusText) || 'Error'} ${usingProxy ? '(via proxy)' : specialHandling ? '(via special handler)' : '(direct)'}`);
                    }
                    // Use encoding-aware text decoder for proper ISO-8859-1 support (Norwegian chars)
                    const feedContent = await decodeResponseText(response);
                    if (!feedContent || feedContent.trim().length === 0) {
                        throw new Error('Feed returned empty content');
                    }
                    if (isDebugMode) {
                        RssDebugUtils.log(`Feed content length: ${feedContent.length} characters`);
                        RssDebugUtils.log(`Feed content starts with: ${feedContent.substring(0, 200)}`);
                    }
                    const preprocessingHints = RssSpecialFeedsHandler.getPreProcessingHints(url);
                    return ImprovedFeedParser.parse(feedContent, {
                        fallbackImageUrl: props.fallbackImageUrl,
                        maxItems: props.maxItems,
                        enableDebug: isDebugMode,
                        preprocessingHints: preprocessingHints
                    });
                }
                finally {
                    clearTimeout(timeoutId);
                }
            }, refreshTime);
            if (props.feedUrl === url) {
                if (isDebugMode) {
                    RssDebugUtils.log(`Loaded ${(cachedItems === null || cachedItems === void 0 ? void 0 : cachedItems.length) || 0} items from feed: ${url}`);
                }
                setItems(cachedItems);
                setRetryCount(0);
                setIsLoading(false);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error loading feed';
            if (isDebugMode) {
                RssDebugUtils.error(`Error loading feed: ${errorMessage}`);
            }
            setError(errorMessage);
            setItems([]);
            setIsLoading(false);
        }
    }, [props.feedUrl, props.refreshInterval, props.fallbackImageUrl, props.maxItems, isDebugMode, cacheService]);
    const loadFeedRef = React.useRef(loadFeed);
    React.useEffect(() => {
        loadFeedRef.current = loadFeed;
    }, [loadFeed]);
    React.useEffect(() => {
        let intervalId;
        loadFeedRef.current();
        if (props.autoRefresh && props.refreshInterval > 0) {
            intervalId = setInterval(() => {
                loadFeedRef.current(true);
            }, props.refreshInterval * 60 * 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [props.autoRefresh, props.refreshInterval]);
    const handleRetry = React.useCallback(() => {
        setRetryCount(prev => prev + 1);
        cacheService.delete(props.feedUrl);
        loadFeed(true);
    }, [props.feedUrl, loadFeed, cacheService]);
    React.useEffect(() => {
        if (isDebugMode && items && items.length > 0) {
            setTimeout(() => {
                const container = document.querySelector('.ms-Fabric');
                if (container) {
                    RssDebugUtils.createDebugConsole(container);
                    RssDebugUtils.logToDebugConsole(`Loaded ${items.length} RSS items from ${props.feedUrl}`);
                    if (items[0]) {
                        RssDebugUtils.logToDebugConsole(`First item: ${items[0].title}`);
                        RssDebugUtils.logToDebugConsole(`Image URL: ${items[0].imageUrl || '(none)'}`);
                    }
                }
            }, 500);
        }
    }, [isDebugMode, items, props.feedUrl]);
    React.useEffect(() => {
        if (props.feedUrl) {
            cacheService.delete(props.feedUrl);
            setRetryCount(0);
            loadFeedRef.current(true);
        }
    }, [props.feedUrl, props.maxItems, props.fallbackImageUrl, props.forceFallbackImage, cacheService]);
    // Items are used directly without filtering (filter feature removed)
    const filteredItems = items;
    if (isLoading && !filteredItems && !error) {
        return (React.createElement("div", { className: extendedStyles.loading },
            React.createElement(Spinner, { label: "Loading RSS feed..." })));
    }
    if (error) {
        let errorDisplay = error;
        let retryHint = '';
        if (error.includes('403')) {
            errorDisplay = 'Access denied (403 Forbidden)';
            retryHint = RssSpecialFeedsHandler.isMeltwaterFeed(props.feedUrl)
                ? 'This Meltwater feed may require updated authentication.'
                : 'This feed may require authentication or have access restrictions.';
        }
        else if (error.includes('404')) {
            errorDisplay = 'Feed not found (404 Not Found)';
            retryHint = 'Please verify the feed URL is correct and still active.';
        }
        else if (error.includes('CORS')) {
            errorDisplay = 'Cross-origin request blocked';
            retryHint = 'The feed server may block external access. Try enabling a proxy.';
        }
        else if (error.includes('timeout') || error.includes('aborted')) {
            errorDisplay = 'Request timed out';
            retryHint = 'The feed server may be slow or unresponsive. Try again later.';
        }
        else if (error.includes('TOO_MANY_REDIRECTS') || error.includes('ERR_TOO_MANY_REDIRECTS')) {
            errorDisplay = 'Too many redirects';
            retryHint = 'The feed URL is causing a redirect loop. Try accessing the feed directly or contacting the feed provider.';
        }
        return (React.createElement("div", { className: extendedStyles.error },
            React.createElement("div", null, "Error loading feed"),
            React.createElement("div", { className: extendedStyles.errorDetails }, errorDisplay),
            retryHint && React.createElement("div", { className: extendedStyles.errorHint }, retryHint),
            React.createElement(DefaultButton, { onClick: handleRetry, text: `Try Again${retryCount > 0 ? ` (${retryCount})` : ''}`, className: extendedStyles.tryAgainButton })));
    }
    // Categories filter removed - feature was not working properly
    const content = (() => {
        if (!filteredItems || filteredItems.length === 0) {
            return React.createElement("div", { className: extendedStyles.noItems }, "No items found");
        }
        const layoutProps = {
            items: filteredItems,
            showDescription: props.showDescription,
            showPubDate: props.showPubDate,
            fallbackImageUrl: props.fallbackImageUrl,
            forceFallback: props.forceFallbackImage,
            hideImages: props.hideImages
        };
        const bannerProps = {
            ...layoutProps,
            autoplay: props.autoscroll,
            interval: props.interval,
            showPagination: props.showPagination
        };
        switch (props.layout) {
            case 'banner':
                return (React.createElement(RssErrorBoundary, null,
                    React.createElement(React.Suspense, { fallback: React.createElement(LayoutFallback, null) },
                        React.createElement(BannerCarousel, { ...bannerProps }))));
            case 'list':
                return (React.createElement(RssErrorBoundary, null,
                    React.createElement(React.Suspense, { fallback: React.createElement(LayoutFallback, null) },
                        React.createElement(ListLayout, { ...layoutProps }))));
            case 'minimal':
                return (React.createElement(RssErrorBoundary, null,
                    React.createElement(React.Suspense, { fallback: React.createElement(LayoutFallback, null) },
                        React.createElement(MinimalLayout, { items: filteredItems, showPubDate: props.showPubDate, showDescription: props.showDescription, truncateDescription: 100, isLoading: isLoading }))));
            case 'gallery':
                return (React.createElement(RssErrorBoundary, null,
                    React.createElement(React.Suspense, { fallback: React.createElement(LayoutFallback, null) },
                        React.createElement(GalleryLayout, { items: filteredItems, columns: props.galleryColumns || 'auto', gap: props.galleryGap || 'md', showTitles: props.galleryTitlePosition || 'below', aspectRatio: props.galleryAspectRatio || '4:3', fallbackImageUrl: props.fallbackImageUrl, forceFallback: props.forceFallbackImage, isLoading: isLoading }))));
            case 'card':
            default:
                return (React.createElement(RssErrorBoundary, null,
                    React.createElement(React.Suspense, { fallback: React.createElement(LayoutFallback, null) },
                        React.createElement(CardLayout, { ...layoutProps }))));
        }
    })();
    return (React.createElement("div", { className: extendedStyles.rssFeed },
        props.webPartTitle && (React.createElement("div", { className: extendedStyles.webPartTitle }, props.webPartTitle)),
        content));
};
export default RssFeed;
//# sourceMappingURL=RssFeed.js.map