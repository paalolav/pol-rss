import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import BannerCarousel from './BannerCarousel';
import CardLayout from './CardLayout';
import ListLayout from './ListLayout';
import { cleanDescription, resolveImageUrl, findImage } from './rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import styles from './RssFeed.module.scss';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { RssErrorBoundary } from './ErrorBoundary';
import { CacheService } from '../services/cacheService';

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

  const fetchFeed = async (): Promise<IRssItem[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(props.feedUrl, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
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
      setItems([]);
      setError(null);
      return;
    }

    try {
      setError(null);
      const cachedItems = await cacheService.get<IRssItem[]>(
        props.feedUrl,
        fetchFeed,
        props.refreshInterval * 60 * 1000
      );
      setItems(cachedItems);
    } catch (err) {
      console.error('Failed to load RSS feed:', err);
      setError(err instanceof Error ? err.message : strings.ErrorLoadingFeed);
      setItems([]);
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
      <div className={styles.error}>
        <p>{error}</p>
        <DefaultButton 
          text={strings.RetryButtonText} 
          onClick={() => loadFeed(true)}
        />
      </div>
    );
  }

  if (items === null) {
    return <Spinner label={strings.LoadingMessage} />;
  }

  if (items.length === 0) {
    return <div className={styles.noItems}>{strings.NoItemsMessage}</div>;
  }

  const limitedItems = items.slice(0, props.maxItems);

  const renderLayout = (): React.ReactNode => {
    switch (props.layout) {
      case 'banner':
        return (
          <BannerCarousel 
            items={limitedItems} 
            autoscroll={props.autoscroll}
            interval={props.interval}
            fallbackImageUrl={props.fallbackImageUrl}
            forceFallback={props.forceFallbackImage}
            showPubDate={props.showPubDate}
            showDescription={props.showDescription}
          />
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

  const content = (
    <div 
      className={styles.webpart}
      style={{ fontFamily: props.themeVariant?.fonts?.medium?.fontFamily ?? '"Segoe UI", sans-serif' }}
    >
      {props.webPartTitle && (
        <h2
          className={styles.webPartHeader}
          style={{
            fontFamily: props.themeVariant?.fonts?.medium?.fontFamily ?? '"Segoe UI", sans-serif',
            fontSize: props.themeVariant?.fonts?.xLarge?.fontSize ?? '24px'
          }}
        >
          {props.webPartTitle}
        </h2>
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
