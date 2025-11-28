import * as React from 'react';
import { useState } from 'react';
import { DefaultButton, Stack, Text, TextField } from '@fluentui/react';

interface IFeedTestResult {
  url: string;
  success: boolean;
  error?: string;
  itemCount?: number;
  fetchMethod?: string;
  responseSize?: number;
}

export const RssFeedDebugger: React.FC = () => {
  const [testUrl, setTestUrl] = useState<string>('');
  const [results, setResults] = useState<IFeedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const predefinedUrls = [
    'https://www.vg.no/rss/feed',
    'https://computas.com/aktuelt/feed/',
    'https://e24.no/rss2/'
  ];

  const testFeed = async (url: string): Promise<IFeedTestResult> => {
    try {
      // First try direct fetch
      try {
        const directResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 SharePoint RSS Reader'
          }
        });
        
        if (directResponse.ok) {
          const content = await directResponse.text();
          const itemCount = (content.match(/<item>/g) || []).length;
          return {
            url,
            success: true,
            fetchMethod: 'direct',
            responseSize: content.length,
            itemCount
          };
        } else {
          throw new Error(`HTTP ${directResponse.status}`);
        }
      } catch {
        // Try with proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        
        if (proxyResponse.ok) {
          const content = await proxyResponse.text();
          const itemCount = (content.match(/<item>/g) || []).length;
          return {
            url,
            success: true,
            fetchMethod: 'proxy (allorigins)',
            responseSize: content.length,
            itemCount
          };
        } else {
          throw new Error(`Proxy failed: HTTP ${proxyResponse.status}`);
        }
      }
    } catch (error) {
      return {
        url,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runTest = async (url: string) => {
    setIsLoading(true);
    const result = await testFeed(url);
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    setIsLoading(false);
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults([]);
    
    for (const url of predefinedUrls) {
      const result = await testFeed(url);
      setResults(prev => [...prev, result]);
    }
    
    setIsLoading(false);
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} style={{ padding: 16, maxWidth: 800 }}>
      <Text variant="xLarge">RSS Feed Debugger</Text>
      
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <TextField 
          placeholder="Enter RSS feed URL..."
          value={testUrl}
          onChange={(_, value) => setTestUrl(value || '')}
          style={{ flexGrow: 1 }}
        />
        <DefaultButton 
          text="Test URL" 
          disabled={!testUrl || isLoading}
          onClick={() => runTest(testUrl)}
        />
      </Stack>
      
      <DefaultButton 
        text="Test All Predefined URLs" 
        disabled={isLoading}
        onClick={runAllTests}
      />
      
      {isLoading && <Text>Testing feeds...</Text>}
      
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="large">Test Results:</Text>
        {results.map((result, index) => (
          <Stack 
            key={index} 
            style={{ 
              padding: 12, 
              border: '1px solid #ccc', 
              borderRadius: 4,
              backgroundColor: result.success ? '#f0f8f0' : '#fff0f0'
            }}
          >
            <Text variant="medium" style={{ fontWeight: 'bold' }}>
              {result.url}
            </Text>
            {result.success ? (
              <Stack>
                <Text>✅ Success via {result.fetchMethod}</Text>
                <Text>Items found: {result.itemCount}</Text>
                <Text>Response size: {result.responseSize} bytes</Text>
              </Stack>
            ) : (
              <Text style={{ color: 'red' }}>❌ Error: {result.error}</Text>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
