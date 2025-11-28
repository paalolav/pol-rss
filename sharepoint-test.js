/**
 * Komplett test av RSS feeds med same kode som webdelen brukar
 * Dette skriptet kan køyrast direkte på SharePoint-sida for å simulere webdel-funksjonaliteten
 */

(async function testFeedsWithRealCode() {
  console.log('🔬 Startar fullstendig RSS feed testing med webdel-kode...');
  
  const testUrls = [
    'https://www.vg.no/rss/feed',
    'https://computas.com/aktuelt/feed/',
    'https://e24.no/rss2/'
  ];

  // Simulerer debug-modus
  const isDebugMode = true;
  
  // Mock av cacheService for testing
  const mockCacheService = {
    async get(key, fetchFunction, ttl) {
      console.log(`🗄️ Cache: Kallar fetchFunction for ${key}`);
      return await fetchFunction();
    },
    async set(key, value, ttl) {
      console.log(`🗄️ Cache: Lagrar ${key}`);
    },
    delete(key) {
      console.log(`🗄️ Cache: Slettar ${key}`);
    }
  };

  async function loadFeedLikeWebPart(feedUrl) {
    console.log(`\n🎯 TESTAR FEED SOM WEBDELEN: ${feedUrl}`);
    console.log('='.repeat(60));
    
    try {
      // Simulerer nøyaktig same kode som RssFeed-komponenten
      const url = feedUrl;
      const refreshTime = 5 * 60 * 1000; // 5 min
      
      console.log(`📡 Loading RSS feed: ${url}`);
      
      // Sjekk om det er Meltwater feed (basert på RssSpecialFeedsHandler)
      const isMeltwater = url.toLowerCase().includes('meltwater') || 
                          url.toLowerCase().includes('meltwaterfeed');
      
      if (isMeltwater) {
        console.log(`🔍 Detected Meltwater feed, applying special handling: ${url}`);
      }
      
      // Simulerer cacheService.get() kall
      const cachedItems = await mockCacheService.get(
        url,
        async () => {
          const controller = new AbortController();
          const timeoutMs = isMeltwater ? 30000 : 15000;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          try {
            let response;
            let usingProxy = false;
            let specialHandling = false;
            
            // Sjekk om det treng autentisering (RssSpecialFeedsHandler)
            const needsAuth = url.toLowerCase().includes('meltwater') ||
                             url.toLowerCase().includes('private') ||
                             url.toLowerCase().includes('auth');
            
            if (needsAuth) {
              console.log(`🔐 Using authentication handler for ${url}`);
              // Her ville RssSpecialFeedsHandler.fetchAuthenticatedFeed() vorte kalla
              console.log(`⚠️ Authentication handler would be called here (simulated)`);
            }
            
            if (!specialHandling || !response) {
              try {
                // Prøv direktefetch først
                console.log(`🌐 Attempting direct fetch...`);
                response = await fetch(url, { 
                  signal: controller.signal,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                  }
                });
                
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status} - ${response.statusText || 'Error'} (direct)`);
                }
                
                console.log(`✅ Direct fetch succeeded for ${url}`);
              } catch (directError) {
                console.log(`⚠️ Direct fetch failed: ${directError.message}`);
                
                try {
                  // Prøv proxy (simulerer ProxyService.fetchWithFirstProxy)
                  console.log(`🔄 Trying automatic proxy fallback...`);
                  
                  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                  response = await fetch(proxyUrl, { signal: controller.signal });
                  
                  if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - ${response.statusText || 'Error'} (via proxy)`);
                  }
                  
                  usingProxy = true;
                  console.log(`✅ Automatic proxy fallback succeeded for ${url}`);
                } catch (proxyError) {
                  console.log(`❌ Automatic proxy fallback failed: ${proxyError.message}`);
                  throw directError;
                }
              }
            }

            if (!response || !response.ok) {
              throw new Error(`HTTP ${response?.status} - ${response?.statusText || 'Error'} ${usingProxy ? '(via proxy)' : specialHandling ? '(via special handler)' : '(direct)'}`);
            }

            const feedContent = await response.text();
            if (!feedContent || feedContent.trim().length === 0) {
              throw new Error('Feed returned empty content');
            }
            
            console.log(`📏 Feed content length: ${feedContent.length} bytes`);
            console.log(`📄 Feed content starts with: ${feedContent.substring(0, 200)}...`);
            
            // Simulerer ImprovedFeedParser.parse()
            const items = await parseFeedContent(feedContent, url);
            console.log(`📝 Parsed ${items.length} items from feed`);
            
            return items;
          } finally {
            clearTimeout(timeoutId);
          }
        },
        refreshTime
      );
      
      console.log(`✅ Successfully loaded ${cachedItems?.length || 0} items from feed: ${url}`);
      
      if (cachedItems && cachedItems.length > 0) {
        console.log(`🔍 First item preview:`);
        console.log(`   Title: ${cachedItems[0].title}`);
        console.log(`   Link: ${cachedItems[0].link}`);
        console.log(`   Image: ${cachedItems[0].imageUrl || '(ingen)'}`);
        console.log(`   Description: ${cachedItems[0].description?.substring(0, 100) || '(ingen)'}...`);
      }
      
      return { success: true, items: cachedItems, count: cachedItems?.length || 0 };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading feed';
      console.log(`❌ Error loading feed: ${errorMessage}`);
      
      // Same feilhandtering som i RssFeed-komponenten
      let errorDisplay = errorMessage;
      let retryHint = '';
      
      if (errorMessage.includes('403')) {
        errorDisplay = 'Access denied (403 Forbidden)';
        retryHint = 'This feed may require authentication or have access restrictions.';
      } else if (errorMessage.includes('404')) {
        errorDisplay = 'Feed not found (404 Not Found)';
        retryHint = 'Please verify the feed URL is correct and still active.';
      } else if (errorMessage.includes('CORS')) {
        errorDisplay = 'Cross-origin request blocked';
        retryHint = 'The feed server may block external access. Try enabling a proxy.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
        errorDisplay = 'Request timed out';
        retryHint = 'The feed server may be slow or unresponsive. Try again later.';
      }
      
      console.log(`💡 Error hint: ${retryHint}`);
      
      return { success: false, error: errorDisplay, hint: retryHint };
    }
  }

  // Simplifisert parser som simulerer ImprovedFeedParser
  async function parseFeedContent(content, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      
      // Sjekk for parsing-feil
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }
      
      const items = Array.from(doc.querySelectorAll('item'));
      console.log(`🔍 Found ${items.length} item elements in XML`);
      
      const parsedItems = items.map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Item ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        // Prøv å finne bilete (flere moglege felt)
        let imageUrl = '';
        const enclosure = item.querySelector('enclosure[type*="image"]');
        if (enclosure) {
          imageUrl = enclosure.getAttribute('url') || '';
        }
        
        if (!imageUrl) {
          const mediaContent = item.querySelector('content[medium="image"], content[type*="image"]');
          if (mediaContent) {
            imageUrl = mediaContent.getAttribute('url') || '';
          }
        }
        
        // VG-spesifikke felt
        if (!imageUrl && url.includes('vg.no')) {
          const vgImg = item.querySelector('img, articleImg');
          if (vgImg) {
            imageUrl = vgImg.textContent || vgImg.getAttribute('url') || '';
          }
        }
        
        return {
          title,
          link,
          description,
          imageUrl,
          pubDate,
          categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent)
        };
      });
      
      return parsedItems;
    } catch (error) {
      console.log(`❌ Feed parsing error: ${error.message}`);
      throw error;
    }
  }

  // Test alle feedane
  console.log(`🚀 Startar testing av ${testUrls.length} feeds...\n`);
  
  const results = {};
  
  for (const url of testUrls) {
    const result = await loadFeedLikeWebPart(url);
    results[url] = result;
    
    // Pause mellom testar
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Endeleg samandrag
  console.log(`\n\n📊 ENDELEG RAPPORT:`);
  console.log('='.repeat(80));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [url, result] of Object.entries(results)) {
    if (result.success) {
      successCount++;
      console.log(`\n✅ FUNGERER: ${url}`);
      console.log(`   📊 ${result.count} items lasta`);
    } else {
      failCount++;
      console.log(`\n❌ FEILER: ${url}`);
      console.log(`   🚫 ${result.error}`);
      if (result.hint) {
        console.log(`   💡 ${result.hint}`);
      }
    }
  }
  
  console.log(`\n📈 STATISTIKK:`);
  console.log(`   ✅ Fungerer: ${successCount}/${testUrls.length}`);
  console.log(`   ❌ Feiler: ${failCount}/${testUrls.length}`);
  
  if (failCount > 0) {
    console.log(`\n🔧 FEILSØKINGSSTEG:`);
    console.log(`   1. Sjekk Network-fana i DevTools for detaljerte feilmeldingar`);
    console.log(`   2. Aktiver debug-modus på webdelen (?rssDebug=true)`);
    console.log(`   3. Prøv å køyre testane direkte på SharePoint-sida`);
    console.log(`   4. Sjekk om feedane har endra URL eller autentiseringskrav`);
  }
  
  console.log(`\n🏁 Testing fullført!`);
  
  return results;
})();
