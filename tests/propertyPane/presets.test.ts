/**
 * Tests for Property Pane Presets
 */
import {
  presets,
  getPreset,
  applyPreset,
  detectCurrentPreset,
  IPreset
} from '../../src/webparts/polRssGallery/propertyPane/presets';
import { IRssFeedWebPartProps } from '../../src/webparts/polRssGallery/RssFeedWebPart';

describe('Property Pane Presets', () => {
  // Mock default properties
  const createDefaultProps = (overrides: Partial<IRssFeedWebPartProps> = {}): IRssFeedWebPartProps => ({
    webPartTitle: 'Test Feed',
    feedUrl: 'https://example.com/feed.xml',
    autoRefresh: false,
    refreshInterval: 5,
    layout: 'card',
    autoscroll: false,
    interval: 5,
    forceFallbackImage: false,
    fallbackImageUrl: '',
    maxItems: 6,
    showPubDate: true,
    showDescription: true,
    filterByKeywords: false,
    filterKeywords: '',
    filterMode: 'include',
    showCategories: false,
    filterByCategory: false,
    categoryFilterMode: 'include',
    proxyUrl: '',
    selectedPreset: 'custom',
    ...overrides
  });

  describe('presets array', () => {
    it('should have 4 presets defined', () => {
      expect(presets).toHaveLength(4);
    });

    it('should have news-banner preset', () => {
      const preset = presets.find(p => p.key === 'news-banner');
      expect(preset).toBeDefined();
      expect(preset?.labelKey).toBe('PresetNewsBanner');
      expect(preset?.config.layout).toBe('banner');
      expect(preset?.config.autoscroll).toBe(true);
    });

    it('should have blog-cards preset', () => {
      const preset = presets.find(p => p.key === 'blog-cards');
      expect(preset).toBeDefined();
      expect(preset?.labelKey).toBe('PresetBlogCards');
      expect(preset?.config.layout).toBe('card');
      expect(preset?.config.showDescription).toBe(true);
    });

    it('should have compact-list preset', () => {
      const preset = presets.find(p => p.key === 'compact-list');
      expect(preset).toBeDefined();
      expect(preset?.labelKey).toBe('PresetCompactList');
      expect(preset?.config.layout).toBe('list');
      expect(preset?.config.maxItems).toBe(10);
    });

    it('should have custom preset with empty config', () => {
      const preset = presets.find(p => p.key === 'custom');
      expect(preset).toBeDefined();
      expect(preset?.config).toEqual({});
    });

    it('should have all required keys for each preset', () => {
      presets.forEach(preset => {
        expect(preset.key).toBeDefined();
        expect(preset.labelKey).toBeDefined();
        expect(preset.descriptionKey).toBeDefined();
        expect(preset.config).toBeDefined();
      });
    });
  });

  describe('getPreset', () => {
    it('should return preset by key', () => {
      const preset = getPreset('news-banner');
      expect(preset).toBeDefined();
      expect(preset?.key).toBe('news-banner');
    });

    it('should return undefined for unknown key', () => {
      const preset = getPreset('unknown-preset');
      expect(preset).toBeUndefined();
    });

    it('should return custom preset', () => {
      const preset = getPreset('custom');
      expect(preset).toBeDefined();
      expect(preset?.key).toBe('custom');
    });
  });

  describe('applyPreset', () => {
    it('should return preset config for valid preset', () => {
      const props = createDefaultProps();
      const result = applyPreset(props, 'news-banner');

      expect(result.layout).toBe('banner');
      expect(result.autoscroll).toBe(true);
      expect(result.interval).toBe(5);
      expect(result.maxItems).toBe(5);
    });

    it('should return empty object for custom preset', () => {
      const props = createDefaultProps();
      const result = applyPreset(props, 'custom');

      expect(result).toEqual({});
    });

    it('should return empty object for unknown preset', () => {
      const props = createDefaultProps();
      const result = applyPreset(props, 'unknown');

      expect(result).toEqual({});
    });

    it('should apply blog-cards preset correctly', () => {
      const props = createDefaultProps();
      const result = applyPreset(props, 'blog-cards');

      expect(result.layout).toBe('card');
      expect(result.maxItems).toBe(6);
      expect(result.showDescription).toBe(true);
      expect(result.showPubDate).toBe(true);
      expect(result.showCategories).toBe(true);
    });

    it('should apply compact-list preset correctly', () => {
      const props = createDefaultProps();
      const result = applyPreset(props, 'compact-list');

      expect(result.layout).toBe('list');
      expect(result.maxItems).toBe(10);
      expect(result.showDescription).toBe(false);
      expect(result.showCategories).toBe(false);
    });
  });

  describe('detectCurrentPreset', () => {
    it('should detect news-banner preset', () => {
      const props = createDefaultProps({
        layout: 'banner',
        autoscroll: true,
        interval: 5,
        maxItems: 5,
        showDescription: false,
        showPubDate: true,
        showCategories: false
      });

      const detected = detectCurrentPreset(props);
      expect(detected).toBe('news-banner');
    });

    it('should detect blog-cards preset', () => {
      const props = createDefaultProps({
        layout: 'card',
        maxItems: 6,
        showDescription: true,
        showPubDate: true,
        showCategories: true,
        autoscroll: false
      });

      const detected = detectCurrentPreset(props);
      expect(detected).toBe('blog-cards');
    });

    it('should detect compact-list preset', () => {
      const props = createDefaultProps({
        layout: 'list',
        maxItems: 10,
        showDescription: false,
        showPubDate: true,
        showCategories: false,
        autoscroll: false
      });

      const detected = detectCurrentPreset(props);
      expect(detected).toBe('compact-list');
    });

    it('should return custom when no preset matches', () => {
      const props = createDefaultProps({
        layout: 'card',
        maxItems: 8,
        showDescription: true
      });

      const detected = detectCurrentPreset(props);
      expect(detected).toBe('custom');
    });

    it('should return custom for partial matches', () => {
      const props = createDefaultProps({
        layout: 'banner',
        autoscroll: false, // Different from news-banner preset
        maxItems: 5
      });

      const detected = detectCurrentPreset(props);
      expect(detected).toBe('custom');
    });
  });
});
