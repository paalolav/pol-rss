/**
 * Strong Background Tests (TDD)
 *
 * Tests for SharePoint strong background color support (fourth background option).
 * When a section uses a strong background, text should be inverted (white on dark).
 *
 * These tests should FAIL first, then we implement the feature.
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the actual component to test
import RssFeed from '../../src/webparts/polRssGallery/components/RssFeed';

// Mock the lazy-loaded layout components
jest.mock('../../src/webparts/polRssGallery/components/layouts/BannerCarousel', () => ({
  BannerCarousel: ({ isInverted }: { isInverted?: boolean }) => (
    <div data-testid="banner-layout" data-inverted={isInverted}>
      Banner Layout
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/CardLayout', () => ({
  CardLayout: ({ isInverted }: { isInverted?: boolean }) => (
    <div data-testid="card-layout" data-inverted={isInverted}>
      Card Layout
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/ListLayout', () => ({
  ListLayout: ({ isInverted }: { isInverted?: boolean }) => (
    <div data-testid="list-layout" data-inverted={isInverted}>
      List Layout
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/MinimalLayout', () => ({
  MinimalLayout: ({ isInverted }: { isInverted?: boolean }) => (
    <div data-testid="minimal-layout" data-inverted={isInverted}>
      Minimal Layout
    </div>
  ),
}));

jest.mock('../../src/webparts/polRssGallery/components/layouts/GalleryLayout', () => ({
  GalleryLayout: ({ isInverted }: { isInverted?: boolean }) => (
    <div data-testid="gallery-layout" data-inverted={isInverted}>
      Gallery Layout
    </div>
  ),
}));

// Mock services
jest.mock('../../src/webparts/polRssGallery/services/cacheService', () => ({
  CacheService: {
    getInstance: () => ({
      get: jest.fn().mockResolvedValue([
        {
          title: 'Test Item',
          link: 'https://example.com/test',
          pubDate: '2024-01-01',
          description: 'Test description',
        },
      ]),
      delete: jest.fn(),
    }),
  },
}));

// Create mock theme objects
const normalTheme = {
  isInverted: false,
  semanticColors: {
    bodyText: '#333333',
    bodyBackground: '#ffffff',
    link: '#0078d4',
  },
};

const invertedTheme = {
  isInverted: true,
  semanticColors: {
    bodyText: '#ffffff',
    bodyBackground: '#0078d4',
    link: '#c7e0f4',
  },
};

const defaultProps = {
  webPartTitle: 'Test Feed',
  feedUrl: 'https://example.com/feed.rss',
  autoRefresh: false,
  refreshInterval: 5,
  layout: 'card' as const,
  autoscroll: false,
  interval: 5,
  showPagination: true,
  hideImages: false,
  forceFallbackImage: false,
  fallbackImageUrl: '',
  showPubDate: true,
  showDescription: true,
  maxItems: 10,
};

describe('Strong Background Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RssFeed container data-inverted attribute', () => {
    it('should add data-inverted="true" to container when themeVariant.isInverted is true', async () => {
      render(
        <RssFeed {...defaultProps} themeVariant={invertedTheme as any} />
      );

      // Wait for async loading and find the feed container
      const feedContainer = await screen.findByTestId('rss-feed-container', {}, { timeout: 3000 });
      expect(feedContainer).toHaveAttribute('data-inverted', 'true');
    });

    it('should add data-inverted="false" when themeVariant.isInverted is false', async () => {
      render(
        <RssFeed {...defaultProps} themeVariant={normalTheme as any} />
      );

      const feedContainer = await screen.findByTestId('rss-feed-container', {}, { timeout: 3000 });
      expect(feedContainer).toHaveAttribute('data-inverted', 'false');
    });

    it('should add data-inverted="false" when themeVariant is undefined', async () => {
      render(
        <RssFeed {...defaultProps} themeVariant={undefined} />
      );

      const feedContainer = await screen.findByTestId('rss-feed-container', {}, { timeout: 3000 });
      expect(feedContainer).toHaveAttribute('data-inverted', 'false');
    });
  });

  describe('Layout components receive isInverted prop', () => {
    it('should pass isInverted=true to CardLayout when theme is inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="card"
          themeVariant={invertedTheme as any}
        />
      );

      const layout = await screen.findByTestId('card-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'true');
    });

    it('should pass isInverted=true to ListLayout when theme is inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="list"
          themeVariant={invertedTheme as any}
        />
      );

      const layout = await screen.findByTestId('list-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'true');
    });

    it('should pass isInverted=true to MinimalLayout when theme is inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="minimal"
          themeVariant={invertedTheme as any}
        />
      );

      const layout = await screen.findByTestId('minimal-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'true');
    });

    it('should pass isInverted=true to GalleryLayout when theme is inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="gallery"
          themeVariant={invertedTheme as any}
        />
      );

      const layout = await screen.findByTestId('gallery-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'true');
    });

    it('should pass isInverted=true to BannerCarousel when theme is inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="banner"
          themeVariant={invertedTheme as any}
        />
      );

      const layout = await screen.findByTestId('banner-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'true');
    });
  });

  describe('Layout components with isInverted=false', () => {
    it('should pass isInverted=false to CardLayout when theme is normal', async () => {
      render(
        <RssFeed
          {...defaultProps}
          layout="card"
          themeVariant={normalTheme as any}
        />
      );

      const layout = await screen.findByTestId('card-layout', {}, { timeout: 3000 });
      expect(layout).toHaveAttribute('data-inverted', 'false');
    });
  });

  describe('Web part title with inverted theme', () => {
    it('should render title with proper styling when inverted', async () => {
      render(
        <RssFeed
          {...defaultProps}
          webPartTitle="Inverted Title"
          themeVariant={invertedTheme as any}
        />
      );

      // Find container with data-inverted="true"
      const feedContainer = await screen.findByTestId('rss-feed-container', {}, { timeout: 3000 });
      expect(feedContainer).toHaveAttribute('data-inverted', 'true');

      // Title should be rendered inside the inverted container
      const title = await screen.findByText('Inverted Title');
      expect(feedContainer).toContainElement(title);
    });
  });
});
