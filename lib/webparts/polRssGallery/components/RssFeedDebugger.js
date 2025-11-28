import * as React from 'react';
import { useState } from 'react';
import { DefaultButton, Stack, Text, TextField } from '@fluentui/react';
export const RssFeedDebugger = () => {
    const [testUrl, setTestUrl] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const predefinedUrls = [
        'https://www.vg.no/rss/feed',
        'https://computas.com/aktuelt/feed/',
        'https://e24.no/rss2/'
    ];
    const testFeed = async (url) => {
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
                }
                else {
                    throw new Error(`HTTP ${directResponse.status}`);
                }
            }
            catch (_a) {
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
                }
                else {
                    throw new Error(`Proxy failed: HTTP ${proxyResponse.status}`);
                }
            }
        }
        catch (error) {
            return {
                url,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };
    const runTest = async (url) => {
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
    return (React.createElement(Stack, { tokens: { childrenGap: 16 }, style: { padding: 16, maxWidth: 800 } },
        React.createElement(Text, { variant: "xLarge" }, "RSS Feed Debugger"),
        React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 8 } },
            React.createElement(TextField, { placeholder: "Enter RSS feed URL...", value: testUrl, onChange: (_, value) => setTestUrl(value || ''), style: { flexGrow: 1 } }),
            React.createElement(DefaultButton, { text: "Test URL", disabled: !testUrl || isLoading, onClick: () => runTest(testUrl) })),
        React.createElement(DefaultButton, { text: "Test All Predefined URLs", disabled: isLoading, onClick: runAllTests }),
        isLoading && React.createElement(Text, null, "Testing feeds..."),
        React.createElement(Stack, { tokens: { childrenGap: 8 } },
            React.createElement(Text, { variant: "large" }, "Test Results:"),
            results.map((result, index) => (React.createElement(Stack, { key: index, style: {
                    padding: 12,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    backgroundColor: result.success ? '#f0f8f0' : '#fff0f0'
                } },
                React.createElement(Text, { variant: "medium", style: { fontWeight: 'bold' } }, result.url),
                result.success ? (React.createElement(Stack, null,
                    React.createElement(Text, null,
                        "\u2705 Success via ",
                        result.fetchMethod),
                    React.createElement(Text, null,
                        "Items found: ",
                        result.itemCount),
                    React.createElement(Text, null,
                        "Response size: ",
                        result.responseSize,
                        " bytes"))) : (React.createElement(Text, { style: { color: 'red' } },
                    "\u274C Error: ",
                    result.error))))))));
};
//# sourceMappingURL=RssFeedDebugger.js.map