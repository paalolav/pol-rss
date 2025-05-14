import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import BannerCarousel from './BannerCarousel';
import CardLayout from './CardLayout';
import ListLayout from './ListLayout';
import { cleanDescription, resolveImageUrl, findImage} from './rssUtils';
import * as strings from 'RssFeedWebPartStrings';
import styles from './RssFeed.module.scss';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

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

const rssCache: { [url: string]: { timestamp: number; items: IRssItem[] } } = {};

const RssFeed: React.FC<IRssFeedProps> = (props) => {
  const [items, setItems] = React.useState<IRssItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFeed = (now: number) => {
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

  const loadFeed = (forceReload: boolean = false) => {
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
    let intervalId: ReturnType<typeof setInterval> | undefined;

    loadFeed();

    if (props.autoRefresh && props.refreshInterval > 0) {
      intervalId = setInterval(() => {
      loadFeed(true);
      },
        props.refreshInterval * 60 * 1000);
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
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <DefaultButton text={strings.RetryButtonText} onClick={handleRetry} />
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

  const renderLayout = () => {
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

  return (
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
};


export default RssFeed;
