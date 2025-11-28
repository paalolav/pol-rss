/**
 * Browser test for RSS feeds - kan køyrast direkte i nettlesarkonsollen på SharePoint-sida
 * Kopier og lim inn dette scriptet i nettlesarkonsollen for å teste feedane
 */

(async function testFeeds() {
  console.log('🔍 Startar RSS feed testing...');
  
  const testUrls = [
    'https://www.vg.no/rss/feed',
    'https://computas.com/aktuelt/feed/',
    'https://e24.no/rss2/'
  ];

  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
  ];

  async function testFeedDirect(url) {
    console.log(`\n📡 Testar direktefetch: ${url}`);
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      
      const content = await response.text();
      const itemCount = (content.match(/<item>/gi) || []).length;
      
      console.log(`✅ Direktefetch fungerte! ${itemCount} items funnet`);
      console.log(`📏 Respons-storleik: ${content.length} bytes`);
      return { success: true, method: 'direct', itemCount, size: content.length };
    } catch (error) {
      console.log(`❌ Direktefetch feila: ${error.message}`);
      return { success: false, method: 'direct', error: error.message };
    }
  }

  async function testFeedWithProxy(url, proxyUrl) {
    console.log(`\n🔄 Testar via proxy: ${proxyUrl}`);
    try {
      const fullUrl = proxyUrl + encodeURIComponent(url);
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      
      const content = await response.text();
      const itemCount = (content.match(/<item>/gi) || []).length;
      
      console.log(`✅ Proxy fungerte! ${itemCount} items funnet`);
      console.log(`📏 Respons-storleik: ${content.length} bytes`);
      return { success: true, method: `proxy: ${proxyUrl}`, itemCount, size: content.length };
    } catch (error) {
      console.log(`❌ Proxy feila: ${error.message}`);
      return { success: false, method: `proxy: ${proxyUrl}`, error: error.message };
    }
  }

  async function testFeedWithSharePointHttpClient(url) {
    console.log(`\n🌐 Testar via SharePoint HttpClient...`);
    try {
      // Prøv å bruke SharePoint HttpClient hvis tilgjengeleg
      if (window.sp && window.sp.spHttpClient) {
        const response = await window.sp.spHttpClient.get(url, window.sp.spHttpClient.configurations.v1);
        const content = await response.text();
        const itemCount = (content.match(/<item>/gi) || []).length;
        
        console.log(`✅ SharePoint HttpClient fungerte! ${itemCount} items funnet`);
        return { success: true, method: 'SharePoint HttpClient', itemCount, size: content.length };
      } else {
        console.log(`⚠️ SharePoint HttpClient ikkje tilgjengeleg`);
        return { success: false, method: 'SharePoint HttpClient', error: 'Not available' };
      }
    } catch (error) {
      console.log(`❌ SharePoint HttpClient feila: ${error.message}`);
      return { success: false, method: 'SharePoint HttpClient', error: error.message };
    }
  }

  async function testSingleFeed(url) {
    console.log(`\n\n🔎 TESTAR FEED: ${url}`);
    console.log('='.repeat(50));
    
    const results = [];
    
    // Test direct fetch
    const directResult = await testFeedDirect(url);
    results.push(directResult);
    
    // Test SharePoint HttpClient
    const spResult = await testFeedWithSharePointHttpClient(url);
    results.push(spResult);
    
    // Test proxies only if direct failed
    if (!directResult.success) {
      for (const proxy of proxies) {
        const proxyResult = await testFeedWithProxy(url, proxy);
        results.push(proxyResult);
        
        // Stop if we found a working proxy
        if (proxyResult.success) break;
      }
    }
    
    // Summary
    const successfulMethods = results.filter(r => r.success);
    console.log(`\n📊 RESULTAT for ${url}:`);
    console.log(`   Fungerer: ${successfulMethods.length > 0 ? '✅ JA' : '❌ NEI'}`);
    
    if (successfulMethods.length > 0) {
      successfulMethods.forEach(method => {
        console.log(`   - ${method.method}: ${method.itemCount} items, ${method.size} bytes`);
      });
    } else {
      console.log(`   Alle metodar feila:`);
      results.forEach(result => {
        if (!result.success) {
          console.log(`   - ${result.method}: ${result.error}`);
        }
      });
    }
    
    return results;
  }

  // Test alle feedane
  const allResults = {};
  
  for (const url of testUrls) {
    allResults[url] = await testSingleFeed(url);
    
    // Lite pause mellom testar
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Samandrag
  console.log(`\n\n📋 ENDELEG SAMANDRAG:`);
  console.log('='.repeat(60));
  
  for (const [url, results] of Object.entries(allResults)) {
    const successfulResults = results.filter(r => r.success);
    const status = successfulResults.length > 0 ? '✅ FUNGERER' : '❌ FEILER';
    console.log(`\n${status}: ${url}`);
    
    if (successfulResults.length > 0) {
      successfulResults.forEach(result => {
        console.log(`  └─ ${result.method}: ${result.itemCount} items`);
      });
    } else {
      console.log(`  └─ Alle metodar feila`);
    }
  }
  
  console.log(`\n🏁 Testing fullført!`);
  console.log(`💡 Tip: Sjekk Network-fana i DevTools for detaljerte feilmeldingar`);
})();
