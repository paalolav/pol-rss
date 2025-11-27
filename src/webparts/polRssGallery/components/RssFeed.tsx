import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import { BannerCarousel } from './layouts/BannerCarousel';
import { CardLayout } from './layouts/CardLayout';
import { ListLayout } from './layouts/ListLayout';
import { MinimalLayout } from './layouts/MinimalLayout';
import styles from './RssFeed.module.scss';

const extendedStyles: any = styles;
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { RssErrorBoundary } from './ErrorBoundary';
import { CacheService } from '../services/cacheService';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { RssSpecialFeedsHandler } from '../services/rssSpecialFeedsHandler';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { decodeResponseText } from '../services/encodingUtils';
import { IRssItem } from './IRssItem';

export interface IRssFeedProps {
  webPartTitle: string;
  feedUrl: string;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'banner' | 'card' | 'list' | 'minimal';
  autoscroll: boolean;
  interval: number;
  hideImages: boolean;
  forceFallbackImage: boolean;
  fallbackImageUrl: string;
  showPubDate: boolean;
  showDescription: boolean;
  maxItems: number;
  filterByKeywords?: boolean;
  filterKeywords?: string;
  filterMode?: 'include' | 'exclude';
  filterByCategory?: boolean;
  categoryFilterMode?: 'include' | 'exclude';
  themeVariant?: IReadonlyTheme;
}

const RssFeed: React.FC<IRssFeedProps> = (props) => {
  const [items, setItems] = React.useState<IRssItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [retryCount, setRetryCount] = React.useState<number>(0);
  const cacheService = React.useMemo(() => CacheService.getInstance(), []);

  const isDebugMode = React.useMemo(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has('rssDebug') || urlParams.has('debugRss');
    } catch {
      return false;
    }
  }, []);

  const loadFeed = React.useCallback(async (_forceReload: boolean = false): Promise<void> => {
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
      const cachedItems = await cacheService.get<IRssItem[]>(
        url,
        async () => {
          const controller = new AbortController();
          const timeoutMs = isMeltwater ? 30000 : 15000;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          try {
            let response: Response | undefined;
            let usingProxy = false;
            let specialHandling = false;
            
            if (RssSpecialFeedsHandler.isAuthenticatedFeed(url)) {
              try {
                if (isDebugMode) {
                  RssDebugUtils.log(`Using authentication handler for ${url}`);
                }
                
                response = await RssSpecialFeedsHandler.fetchAuthenticatedFeed(url);
                specialHandling = true;
              } catch (specialError) {
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
              } catch (directError) {
                if (isDebugMode) {
                  RssDebugUtils.warn(`Direct fetch failed: ${directError instanceof Error ? directError.message : 'Unknown error'}`);
                }
                
                try {
                  response = await ProxyService.fetchWithFirstProxy(url, { signal: controller.signal });
                  usingProxy = true;
                  
                  if (isDebugMode) {
                    RssDebugUtils.log(`Automatic proxy fallback succeeded for ${url}`);
                  }
                } catch (proxyError) {
                  if (isDebugMode) {
                    RssDebugUtils.warn(`Automatic proxy fallback failed: ${proxyError instanceof Error ? proxyError.message : 'Unknown error'}`);
                  }
                  
                  throw directError;
                }
              }
            }

            if (!response || !response.ok) {
              throw new Error(`HTTP ${response?.status} - ${response?.statusText || 'Error'} ${usingProxy ? '(via proxy)' : specialHandling ? '(via special handler)' : '(direct)'}`);
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
          } finally {
            clearTimeout(timeoutId);
          }
        },
        refreshTime
      );
      
      if (props.feedUrl === url) {
        if (isDebugMode) {
          RssDebugUtils.log(`Loaded ${cachedItems?.length || 0} items from feed: ${url}`);
        }
        setItems(cachedItems);
        setRetryCount(0);
        setIsLoading(false);
      }
    } catch (err) {
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
    let intervalId: ReturnType<typeof setInterval> | undefined;

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
        const container = document.querySelector('.ms-Fabric') as HTMLElement;
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
      loadFeed(true);
    }
  }, [props.feedUrl]);
  
  const filteredItems = React.useMemo(() => {
    if (!items) return null;
    
    let result = [...items];
    
    if (props.filterByKeywords && props.filterKeywords) {
      const keywords = props.filterKeywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
      
      if (keywords.length > 0) {
        result = result.filter(item => {
          const text = [item.title, item.description].filter(Boolean).join(' ').toLowerCase();
          const matchesKeyword = keywords.some(keyword => text.includes(keyword));
          return props.filterMode === 'include' ? matchesKeyword : !matchesKeyword;
        });
      }
    }
    
    return result;
  }, [items, props.filterByKeywords, props.filterKeywords, props.filterMode]);

  if (isLoading && !filteredItems && !error) {
  return (
    <div className={extendedStyles.loading}>
      <Spinner label="Loading RSS feed..." />
    </div>
  );
}

  if (error) {
    let errorDisplay = error;
    let retryHint = '';
    
    if (error.includes('403')) {
      errorDisplay = 'Access denied (403 Forbidden)';
      retryHint = RssSpecialFeedsHandler.isMeltwaterFeed(props.feedUrl)
        ? 'This Meltwater feed may require updated authentication.'
        : 'This feed may require authentication or have access restrictions.';
    } else if (error.includes('404')) {
      errorDisplay = 'Feed not found (404 Not Found)';
      retryHint = 'Please verify the feed URL is correct and still active.';
    } else if (error.includes('CORS')) {
      errorDisplay = 'Cross-origin request blocked';
      retryHint = 'The feed server may block external access. Try enabling a proxy.';
    } else if (error.includes('timeout') || error.includes('aborted')) {
      errorDisplay = 'Request timed out';
      retryHint = 'The feed server may be slow or unresponsive. Try again later.';
    } else if (error.includes('TOO_MANY_REDIRECTS') || error.includes('ERR_TOO_MANY_REDIRECTS')) {
      errorDisplay = 'Too many redirects';
      retryHint = 'The feed URL is causing a redirect loop. Try accessing the feed directly or contacting the feed provider.';
    }
    
    return (
      <div className={extendedStyles.error}>
        <div>Error loading feed</div>
        <div className={extendedStyles.errorDetails}>{errorDisplay}</div>
        {retryHint && <div className={extendedStyles.errorHint}>{retryHint}</div>}
        <DefaultButton 
          onClick={handleRetry}
          text={`Try Again${retryCount > 0 ? ` (${retryCount})` : ''}`}
          className={extendedStyles.tryAgainButton}
        />
      </div>
    );
  }

  // Categories filter removed - feature was not working properly
  
  const content = (() => {
    if (!filteredItems || filteredItems.length === 0) {
      return <div className={extendedStyles.noItems}>No items found</div>;
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
      interval: props.interval
    };
    
    switch (props.layout) {
      case 'banner':
        return (
          <RssErrorBoundary>
            <BannerCarousel {...bannerProps} />
          </RssErrorBoundary>
        );
      
      case 'list':
        return (
          <RssErrorBoundary>
            <ListLayout {...layoutProps} />
          </RssErrorBoundary>
        );

      case 'minimal':
        return (
          <RssErrorBoundary>
            <MinimalLayout
              items={filteredItems}
              showPubDate={props.showPubDate}
              showDescription={props.showDescription}
              truncateDescription={100}
              isLoading={isLoading}
            />
          </RssErrorBoundary>
        );

      case 'card':
      default:
        return (
          <RssErrorBoundary>
            <CardLayout {...layoutProps} />
          </RssErrorBoundary>
        );
    }
  })();

  return (
    <div className={extendedStyles.rssFeed}>
      {props.webPartTitle && (
        <div className={extendedStyles.webPartTitle}>
          {props.webPartTitle}
        </div>
      )}
      {content}
    </div>
  );
};

export default RssFeed;