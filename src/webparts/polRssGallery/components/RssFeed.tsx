import * as React from 'react';
import { Spinner, DefaultButton } from '@fluentui/react';
import BannerCarousel from './BannerCarousel';
import CardLayout from './CardLayout';
import ListLayout from './ListLayout';
import styles from './RssFeed.module.scss';

// Extend the styles object with the missing properties to avoid TypeScript errors
// This is a temporary fix until the actual CSS module types are updated
const extendedStyles: any = styles;
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { RssErrorBoundary } from './ErrorBoundary';
import { CacheService } from '../services/cacheService';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { RssSpecialFeedsHandler } from '../services/rssSpecialFeedsHandler';
import { RssDebugUtils } from '../utils/rssDebugUtils';
import { IRssItem } from './IRssItem';

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
  filterByKeywords?: boolean;
  filterKeywords?: string;
  filterMode?: 'include' | 'exclude';
  showCategories?: boolean;
  filterByCategory?: boolean;
  categoryFilterMode?: 'include' | 'exclude';
  themeVariant?: IReadonlyTheme;
}

const RssFeed: React.FC<IRssFeedProps> = (props) => {
  const [items, setItems] = React.useState<IRssItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [retryCount, setRetryCount] = React.useState<number>(0);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const cacheService = React.useMemo(() => CacheService.getInstance(), []);

  // Memoize the category toggle handler to prevent re-creation on each render
  const handleCategoryToggle = React.useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  }, []); // No dependencies needed as it only uses setState callback form

  // Check for debug mode from URL parameters
  const isDebugMode = React.useMemo(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has('rssDebug') || urlParams.has('debugRss');
    } catch {
      return false;
    }
  }, []);

  // Refactor loadFeed to avoid dependency issues
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
      // Use a local variable to prevent closure issues
      const url = props.feedUrl;
      const refreshTime = props.refreshInterval * 60 * 1000;
      
      if (isDebugMode) {
        RssDebugUtils.setDebugMode(true);
        RssDebugUtils.log(`Loading RSS feed: ${url}`);
      }
      
      // Detect if this is a Meltwater feed that might need special handling
      const isMeltwater = RssSpecialFeedsHandler.isMeltwaterFeed(url);
      if (isMeltwater && isDebugMode) {
        RssDebugUtils.log(`Detected Meltwater feed, applying special handling: ${url}`);
      }
      
      // Get feed data from cache or fetch it
      const cachedItems = await cacheService.get<IRssItem[]>(
        url,
        // Use an inline function instead of referencing fetchFeed directly
        async () => {
          const controller = new AbortController();
          // Longer timeout for problematic feeds
          const timeoutMs = isMeltwater ? 30000 : 15000;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          try {
            let response: Response | undefined;
            let usingProxy = false;
            let specialHandling = false;
            
            // Check for authenticated feeds that need special handling
            if (RssSpecialFeedsHandler.isAuthenticatedFeed(url)) {
              try {
                if (isDebugMode) {
                  RssDebugUtils.log(`Using authentication handler for ${url}`);
                }
                
                // Try the auth handler first for feeds with API keys
                response = await RssSpecialFeedsHandler.fetchAuthenticatedFeed(url);
                specialHandling = true;
              } catch (specialError) {
                if (isDebugMode) {
                  RssDebugUtils.warn(`Authentication handler failed: ${specialError instanceof Error ? specialError.message : 'Unknown error'}`);
                }
                // If authentication handling fails, we'll fall back to standard methods
              }
            }
            
            if (!specialHandling || !response) {
              // Import ProxyService dynamically to avoid circular dependencies
              const { ProxyService } = await import('../services/proxyService');
              
              // Enable debug mode for proxy service if needed
              if (isDebugMode) {
                ProxyService.setDebugMode(true);
              }
              
              try {
                // For Meltwater feeds, use the retry mechanism
                if (isMeltwater) {
                  response = await ProxyService.fetch(url, { signal: controller.signal });
                } else {
                  // Standard proxy approach for other feeds
                  response = await ProxyService.fetch(url, { signal: controller.signal });
                }
                usingProxy = true;
              } catch (proxyError) {
                if (isDebugMode) {
                  RssDebugUtils.warn(`Proxy fetch failed: ${proxyError instanceof Error ? proxyError.message : 'Unknown error'}`);
                }
                // Fall back to direct fetch if proxy fails (ignore proxy error)
                response = await fetch(url, { signal: controller.signal });
              }
            }

            if (!response || !response.ok) {
              throw new Error(`HTTP ${response?.status} - ${response?.statusText || 'Error'} ${usingProxy ? '(via proxy)' : specialHandling ? '(via special handler)' : '(direct)'}`);
            }

            const feedContent = await response.text();
            if (!feedContent || feedContent.trim().length === 0) {
              throw new Error('Feed returned empty content');
            }
            
            if (isDebugMode) {
              RssDebugUtils.log(`Feed content length: ${feedContent.length} bytes`);
              // Log first 200 chars to see content start
              RssDebugUtils.log(`Feed content starts with: ${feedContent.substring(0, 200)}`);
            }
            
            // Get pre-processing hints for the feed
            const preprocessingHints = RssSpecialFeedsHandler.getPreProcessingHints(url);
            
            // Use ImprovedFeedParser but pass props directly
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
      
      // Only set items if component is still mounted and URL hasn't changed
      if (props.feedUrl === url) {
        if (isDebugMode) {
          RssDebugUtils.log(`Loaded ${cachedItems?.length || 0} items from feed: ${url}`);
        }
        setItems(cachedItems);
        setRetryCount(0); // Reset retry count on success
        setIsLoading(false);
      }
    } catch (err) {
      // Handle error by setting error state
      const errorMessage = err instanceof Error ? err.message : 'Error loading feed';
      if (isDebugMode) {
        RssDebugUtils.error(`Error loading feed: ${errorMessage}`);
      }
      setError(errorMessage);
      setItems([]);
      setIsLoading(false);
    }
  }, [props.feedUrl, props.refreshInterval, props.fallbackImageUrl, props.maxItems, isDebugMode, cacheService]);

  // Use a ref to store the current version of loadFeed
  const loadFeedRef = React.useRef(loadFeed);
  
  // Keep the ref updated with the latest loadFeed function
  React.useEffect(() => {
    loadFeedRef.current = loadFeed;
  }, [loadFeed]);
  
  // Use the ref in the effect to prevent dependency cycles
  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    // Call the function directly on first render
    loadFeedRef.current();
    
    // Set up auto-refresh interval if enabled
    if (props.autoRefresh && props.refreshInterval > 0) {
      intervalId = setInterval(() => {
        loadFeedRef.current(true); // Force reload on interval
      }, props.refreshInterval * 60 * 1000);
    }

    // Clean up on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [props.autoRefresh, props.refreshInterval]);

  // Handle retries for problematic feeds like Meltwater
  const handleRetry = React.useCallback(() => {
    // Increment retry count
    setRetryCount(prev => prev + 1);
    // Clear cache for this URL and reload with force
    cacheService.delete(props.feedUrl);
    loadFeed(true);
  }, [props.feedUrl, loadFeed, cacheService]);

  // Add debug console if in debug mode and items are loaded
  React.useEffect(() => {
    if (isDebugMode && items && items.length > 0) {
      // Wait for DOM to be ready
      setTimeout(() => {
        const container = document.querySelector('.ms-Fabric') as HTMLElement;
        if (container) {
          RssDebugUtils.createDebugConsole(container);
          RssDebugUtils.logToDebugConsole(`Loaded ${items.length} RSS items from ${props.feedUrl}`);
          
          // Log sample item data
          if (items[0]) {
            RssDebugUtils.logToDebugConsole(`First item: ${items[0].title}`);
            RssDebugUtils.logToDebugConsole(`Image URL: ${items[0].imageUrl || '(none)'}`);
          }
        }
      }, 500);
    }
  }, [isDebugMode, items, props.feedUrl]);
  
  // Filter items based on keywords
  const filteredItems = React.useMemo(() => {
    if (!items) return null;
    
    let result = [...items];
    
    // Apply keyword filtering if enabled
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
    
    // Apply category filtering if enabled
    if (props.filterByCategory && selectedCategories.length > 0) {
      result = result.filter(item => {
        if (!item.categories || item.categories.length === 0) {
          return props.categoryFilterMode === 'exclude'; // Keep if excluding categories
        }
        
        const hasSelectedCategory = item.categories.some(category => 
          selectedCategories.includes(category)
        );
        
        return props.categoryFilterMode === 'include' 
          ? hasSelectedCategory 
          : !hasSelectedCategory;
      });
    }
    
    return result;
  }, [items, props.filterByKeywords, props.filterKeywords, props.filterMode, 
      props.filterByCategory, selectedCategories, props.categoryFilterMode]);
  
  // Extract all unique categories from items
  const allCategories = React.useMemo(() => {
    if (!items) return [];
    
    const categories = new Set<string>();
    items.forEach(item => {
      if (item.categories) {
        item.categories.forEach(category => categories.add(category));
      }
    });
    
    return Array.from(categories).sort();
  }, [items]);

  // Skip rendering until we have items or an error
  if (isLoading && !filteredItems && !error) {
    return <Spinner label="Loading RSS feed..." />;
  }

  // Show error if loading failed
  if (error) {
    // Create more helpful error messages for common problems
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

  // Render categories filter if enabled
  const categoriesFilter = props.showCategories && allCategories.length > 0 ? (
    <div className={extendedStyles.categories}>
      {allCategories.map(category => (
        <div 
          key={category}
          role="button"
          tabIndex={0}
          className={`${extendedStyles.categoryTag} ${
            selectedCategories.includes(category) ? extendedStyles.selected : ''
          }`}
          onClick={() => handleCategoryToggle(category)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCategoryToggle(category);
              e.preventDefault();
            }
          }}
        >
          {category}
        </div>
      ))}
    </div>
  ) : null;
  
  // Choose layout based on props
  const content = (() => {
    // Don't render if no items
    if (!filteredItems || filteredItems.length === 0) {
      return <div className={extendedStyles.noItems}>No items found</div>;
    }
    
    // Add theme variant and other props to component props
    const layoutProps = {
      items: filteredItems,
      showDescription: props.showDescription,
      showPubDate: props.showPubDate,
      fallbackImageUrl: props.fallbackImageUrl,
      forceFallback: props.forceFallbackImage
    };
    
    const bannerProps = {
      ...layoutProps,
      autoscroll: props.autoscroll,
      interval: props.interval
    };
    
    // Wrap the appropriate layout in an error boundary
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
        
      case 'card':
      default:
        return (
          <RssErrorBoundary>
            <CardLayout {...layoutProps} />
          </RssErrorBoundary>
        );
    }
  })();

  // Main output
  return (
    <div className={extendedStyles.rssFeed}>
      {props.webPartTitle && (
        <div className={extendedStyles.webPartTitle}>
          {props.webPartTitle}
        </div>
      )}
      {categoriesFilter}
      {content}
    </div>
  );
};

export default RssFeed;