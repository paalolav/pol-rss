# RSS Feed Tester Documentation

This document explains how to use the new RSS feed testing tools to diagnose and fix issues with problematic feeds.

## Introduction

The RSS Feed Tester provides tools for testing and debugging RSS feeds that have specific formatting issues or require authentication. It's particularly useful for:

1. Testing feeds that return 403 errors (like Meltwater)
2. Testing feeds that have non-standard XML formatting (like Nettavisen)
3. Debugging feeds that only show one item
4. Understanding why images aren't appearing in feeds

## How to Use

### In Development Mode

When developing or testing the RSS feed web part, you can enable debug mode by adding `?rssDebug=1` to your SharePoint page URL. This will:

1. Show a debug console with feed parsing information
2. Log detailed diagnostics to browser console
3. Show more verbose error messages

### Using the Test Harness

The test harness provides programmatic ways to test feeds:

1. Open your SharePoint page with the RSS feed web part
2. Open browser developer tools (F12)
3. In the console, run one of the following commands:

```javascript
// Test a specific feed URL
testRssFeed('https://www.nettavisen.no/rss/nyheter').then(result => console.log(result));

// Run tests on all common problematic feeds
runRssTests().then(results => console.log(results));
```

### Test Results Interpretation

The test harness returns a result object with:

- `success`: Whether the feed was successfully parsed
- `itemCount`: Number of items found in the feed
- `error`: Error message if the feed failed to parse
- `firstItem`: Information about the first item in the feed, including whether it has an image

## Troubleshooting Common Issues

### Feed Returns 403 Forbidden

This usually happens with authenticated feeds like Meltwater. Make sure:

1. The feed URL includes any required API keys
2. The RssSpecialFeedsHandler service has specific handling for this domain
3. The authentication parameters are correctly extracted

### Feed Only Shows One Item

This can happen when:

1. The feed has non-standard formatting (like Nettavisen)
2. XML tags are unclosed or malformed
3. Required namespaces are missing

Enable debug mode to see the detailed XML parsing errors.

### Images Not Appearing

The feed parser uses multiple strategies to find images. If images aren't showing:

1. Check if the image URL is correctly extracted (check debug console)
2. Verify if the image URL is valid and accessible
3. Ensure the feed includes image elements that our parser can recognize

## Adding Support for New Problematic Feeds

To add support for a new feed with special requirements:

1. Add the domain to the RssSpecialFeedsHandler.hasKnownFormatIssues method
2. Add appropriate preprocessing hints in getPreProcessingHints
3. If authentication is needed, add logic to isAuthenticatedFeed and fetchAuthenticatedFeed
4. Test the changes using the test harness

## Debugging with Network Traffic

When troubleshooting feed issues, it's helpful to examine the network traffic:

1. Open browser developer tools (F12)
2. Go to the Network tab
3. Look for requests to your RSS feed URL or to the proxy endpoints
4. Examine the response to see the raw feed content

This can help identify if the issue is with the feed itself or with our parser.
