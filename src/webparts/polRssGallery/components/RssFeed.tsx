import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import CardLayout from './CardLayout';
import ListLayout from './ListLayout';
import { cleanDescription, resolveImageUrl, findImage } from './rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import styles from './RssFeed.module.scss';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { RssErrorBoundary } from './ErrorBoundary';
import { CacheService } from '../services/cacheService';

const BannerCarousel = React.lazy(() =>
  import(/* webpackChunkName: 'rss-banner-carousel' */ './BannerCarousel')
);

export interface IRssFeedProps {
  webPartTitle: string;
  feedUrl: string;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'banner' | 'card' | 'list';
  autoscroll: boolean;
  interval: number;
  forceFallbackImage: boolean;
  fallbackImageUrl: string;
  showPubDate: boolean;
  showDescription: boolean;
  maxItems: number;
  themeVariant?: IReadonlyTheme;
}

interface IRssItem {
  title: string;
  link: string;
  pubDate?: string;
  imageUrl?: string;
  description?: string;
}

const RssFeed: React.FC<IRssFeedProps> = (props) => {
  const [items, setItems] = React.useState<IRssItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const cacheService = React.useMemo(() => CacheService.getInstance(), []);
  const abortRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const fetchFeed = async (): Promise<IRssItem[]> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);

    try {
      let response: Response;
      try {
        response = await fetch(props.feedUrl, { signal: controller.signal });
      } catch (e) {
        if (timedOut) throw new Error(strings.ErrorFeedTimeout);
        if ((e as Error).name === 'AbortError') throw e;
        throw new Error(strings.ErrorFeedNetwork);
      }

      if (!response.ok) {
        throw new Error(response.status >= 500 ? strings.ErrorFeedServer : strings.ErrorFeedNotFound);
      }

      const str = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, 'application/xml');

      if (xml.querySelector('parsererror')) {
        throw new Error(strings.ErrorParsingFeed);
      }

      const rssItems: IRssItem[] = [];

      xml.querySelectorAll('item').forEach(itemNode => {
        const titleNode = itemNode.querySelector('title');
        const linkNode = itemNode.querySelector('link');
        const dateNode = itemNode.querySelector('pubDate');
        const descNode = itemNode.querySelector('description');
        const rawImageUrl = findImage(itemNode);
        const finalImageUrl = rawImageUrl ? resolveImageUrl(rawImageUrl) : props.fallbackImageUrl;
        const cleanedDescription = cleanDescription(descNode?.textContent || '');

        rssItems.push({
          title: titleNode?.textContent || '',
          link: linkNode?.textContent || '',
          pubDate: dateNode?.textContent || '',
          description: cleanedDescription,
          imageUrl: finalImageUrl,
        });
      });

      return rssItems;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const loadFeed = async (_forceReload: boolean = false): Promise<void> => {
    if (!props.feedUrl) {
      if (mountedRef.current) {
        setItems([]);
        setError(null);
      }
      return;
    }

    try {
      if (mountedRef.current) setError(null);
      const cachedItems = await cacheService.get<IRssItem[]>(
        props.feedUrl,
        fetchFeed,
        props.refreshInterval * 60 * 1000
      );
      if (mountedRef.current) setItems(cachedItems);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      console.error('Failed to load RSS feed:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : strings.ErrorLoadingFeed);
        setItems([]);
      }
    }
  };

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

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

  if (error) {
    return (
      <div className={styles.error} role="alert" aria-live="assertive">
        <p>{error}</p>
        <DefaultButton
          text={strings.RetryButtonText}
          onClick={() => loadFeed(true)}
        />
      </div>
    );
  }

  if (items === null) {
    return <Spinner label={strings.LoadingMessage} ariaLive="polite" />;
  }

  if (items.length === 0) {
    return <div className={styles.noItems} role="status" aria-live="polite">{strings.NoItemsMessage}</div>;
  }

  const limitedItems = items.slice(0, props.maxItems);

  const renderLayout = (): React.ReactNode => {
    switch (props.layout) {
      case 'banner':
        return (
          <React.Suspense fallback={<Spinner label={strings.LoadingMessage} ariaLive="polite" />}>
            <BannerCarousel
              items={limitedItems}
              autoscroll={props.autoscroll}
              interval={props.interval}
              fallbackImageUrl={props.fallbackImageUrl}
              forceFallback={props.forceFallbackImage}
              showPubDate={props.showPubDate}
              showDescription={props.showDescription}
            />
          </React.Suspense>
        );
      case 'card':
        return (
          <CardLayout 
            items={limitedItems}
            fallbackImageUrl={props.fallbackImageUrl}
            forceFallback={props.forceFallbackImage}
            showPubDate={props.showPubDate}
            showDescription={props.showDescription}
          />
        );
      case 'list':
      default:
        return (
          <ListLayout
            items={limitedItems}
            fallbackImageUrl={props.fallbackImageUrl}
            forceFallback={props.forceFallbackImage}
            showPubDate={props.showPubDate}
            showDescription={props.showDescription}
          />
        );
    }
  };

  const themeVars = {
    '--rss-font-family': props.themeVariant?.fonts?.medium?.fontFamily ?? '"Segoe UI", sans-serif',
    '--rss-header-font-size': props.themeVariant?.fonts?.xLarge?.fontSize ?? '24px'
  } as React.CSSProperties;

  const content = (
    <div className={styles.webpart} style={themeVars}>
      {props.webPartTitle && (
        <h2 className={styles.webPartHeader}>{props.webPartTitle}</h2>
      )}
      {renderLayout()}
    </div>
  );

  return (
    <RssErrorBoundary>
      {content}
    </RssErrorBoundary>
  );
};

export default RssFeed;
