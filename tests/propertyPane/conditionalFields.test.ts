/**
 * Tests for Property Pane Conditional Fields
 */
import {
  shouldShowField,
  shouldShowGroup,
  isFieldDisabled,
  getDependentFields
} from '../../src/webparts/polRssGallery/propertyPane/conditionalFields';
import { IRssFeedWebPartProps } from '../../src/webparts/polRssGallery/RssFeedWebPart';

describe('Property Pane Conditional Fields', () => {
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

  describe('shouldShowField', () => {
    describe('carousel fields', () => {
      it('should show autoscroll only for banner layout', () => {
        expect(shouldShowField('autoscroll', createDefaultProps({ layout: 'banner' }))).toBe(true);
        expect(shouldShowField('autoscroll', createDefaultProps({ layout: 'card' }))).toBe(false);
        expect(shouldShowField('autoscroll', createDefaultProps({ layout: 'list' }))).toBe(false);
      });

      it('should show interval only for banner layout with autoscroll enabled', () => {
        expect(shouldShowField('interval', createDefaultProps({ layout: 'banner', autoscroll: true }))).toBe(true);
        expect(shouldShowField('interval', createDefaultProps({ layout: 'banner', autoscroll: false }))).toBe(false);
        expect(shouldShowField('interval', createDefaultProps({ layout: 'card', autoscroll: true }))).toBe(false);
      });
    });

    describe('filter fields', () => {
      it('should show filterKeywords only when filterByKeywords is enabled', () => {
        expect(shouldShowField('filterKeywords', createDefaultProps({ filterByKeywords: true }))).toBe(true);
        expect(shouldShowField('filterKeywords', createDefaultProps({ filterByKeywords: false }))).toBe(false);
      });

      it('should show filterMode only when filterByKeywords is enabled', () => {
        expect(shouldShowField('filterMode', createDefaultProps({ filterByKeywords: true }))).toBe(true);
        expect(shouldShowField('filterMode', createDefaultProps({ filterByKeywords: false }))).toBe(false);
      });

      it('should show categoryFilterMode only when filterByCategory is enabled', () => {
        expect(shouldShowField('categoryFilterMode', createDefaultProps({ filterByCategory: true }))).toBe(true);
        expect(shouldShowField('categoryFilterMode', createDefaultProps({ filterByCategory: false }))).toBe(false);
      });
    });

    describe('image fields', () => {
      it('should show fallbackImageUrl only when forceFallbackImage is enabled', () => {
        expect(shouldShowField('fallbackImageUrl', createDefaultProps({ forceFallbackImage: true }))).toBe(true);
        expect(shouldShowField('fallbackImageUrl', createDefaultProps({ forceFallbackImage: false }))).toBe(false);
      });
    });

    describe('refresh fields', () => {
      it('should show refreshInterval only when autoRefresh is enabled', () => {
        expect(shouldShowField('refreshInterval', createDefaultProps({ autoRefresh: true }))).toBe(true);
        expect(shouldShowField('refreshInterval', createDefaultProps({ autoRefresh: false }))).toBe(false);
      });
    });

    describe('fields without rules', () => {
      it('should always show fields without conditional rules', () => {
        expect(shouldShowField('webPartTitle', createDefaultProps())).toBe(true);
        expect(shouldShowField('feedUrl', createDefaultProps())).toBe(true);
        expect(shouldShowField('maxItems', createDefaultProps())).toBe(true);
        expect(shouldShowField('showPubDate', createDefaultProps())).toBe(true);
        expect(shouldShowField('unknownField', createDefaultProps())).toBe(true);
      });
    });
  });

  describe('shouldShowGroup', () => {
    it('should show bannerSettings group only for banner layout', () => {
      expect(shouldShowGroup('bannerSettings', createDefaultProps({ layout: 'banner' }))).toBe(true);
      expect(shouldShowGroup('bannerSettings', createDefaultProps({ layout: 'card' }))).toBe(false);
      expect(shouldShowGroup('bannerSettings', createDefaultProps({ layout: 'list' }))).toBe(false);
    });

    it('should always show groups without conditional rules', () => {
      expect(shouldShowGroup('basicSettings', createDefaultProps())).toBe(true);
      expect(shouldShowGroup('displaySettings', createDefaultProps())).toBe(true);
      expect(shouldShowGroup('unknownGroup', createDefaultProps())).toBe(true);
    });
  });

  describe('isFieldDisabled', () => {
    describe('interval field', () => {
      it('should be disabled when layout is not banner', () => {
        expect(isFieldDisabled('interval', createDefaultProps({ layout: 'card' }))).toBe(true);
        expect(isFieldDisabled('interval', createDefaultProps({ layout: 'list' }))).toBe(true);
      });

      it('should be disabled when autoscroll is off for banner', () => {
        expect(isFieldDisabled('interval', createDefaultProps({ layout: 'banner', autoscroll: false }))).toBe(true);
      });

      it('should be enabled when layout is banner and autoscroll is on', () => {
        expect(isFieldDisabled('interval', createDefaultProps({ layout: 'banner', autoscroll: true }))).toBe(false);
      });
    });

    describe('refreshInterval field', () => {
      it('should be disabled when autoRefresh is off', () => {
        expect(isFieldDisabled('refreshInterval', createDefaultProps({ autoRefresh: false }))).toBe(true);
      });

      it('should be enabled when autoRefresh is on', () => {
        expect(isFieldDisabled('refreshInterval', createDefaultProps({ autoRefresh: true }))).toBe(false);
      });
    });

    describe('filterKeywords field', () => {
      it('should be disabled when filterByKeywords is off', () => {
        expect(isFieldDisabled('filterKeywords', createDefaultProps({ filterByKeywords: false }))).toBe(true);
      });

      it('should be enabled when filterByKeywords is on', () => {
        expect(isFieldDisabled('filterKeywords', createDefaultProps({ filterByKeywords: true }))).toBe(false);
      });
    });

    describe('filterMode field', () => {
      it('should be disabled when filterByKeywords is off', () => {
        expect(isFieldDisabled('filterMode', createDefaultProps({ filterByKeywords: false }))).toBe(true);
      });

      it('should be enabled when filterByKeywords is on', () => {
        expect(isFieldDisabled('filterMode', createDefaultProps({ filterByKeywords: true }))).toBe(false);
      });
    });

    describe('categoryFilterMode field', () => {
      it('should be disabled when filterByCategory is off', () => {
        expect(isFieldDisabled('categoryFilterMode', createDefaultProps({ filterByCategory: false }))).toBe(true);
      });

      it('should be enabled when filterByCategory is on', () => {
        expect(isFieldDisabled('categoryFilterMode', createDefaultProps({ filterByCategory: true }))).toBe(false);
      });
    });

    describe('fallbackImageUrl field', () => {
      it('should be disabled when forceFallbackImage is off', () => {
        expect(isFieldDisabled('fallbackImageUrl', createDefaultProps({ forceFallbackImage: false }))).toBe(true);
      });

      it('should be enabled when forceFallbackImage is on', () => {
        expect(isFieldDisabled('fallbackImageUrl', createDefaultProps({ forceFallbackImage: true }))).toBe(false);
      });
    });

    describe('fields without disabled rules', () => {
      it('should never be disabled for fields without rules', () => {
        expect(isFieldDisabled('webPartTitle', createDefaultProps())).toBe(false);
        expect(isFieldDisabled('feedUrl', createDefaultProps())).toBe(false);
        expect(isFieldDisabled('maxItems', createDefaultProps())).toBe(false);
        expect(isFieldDisabled('unknownField', createDefaultProps())).toBe(false);
      });
    });
  });

  describe('getDependentFields', () => {
    it('should return dependent fields for layout', () => {
      const deps = getDependentFields('layout');
      expect(deps).toContain('autoscroll');
      expect(deps).toContain('interval');
    });

    it('should return dependent fields for autoscroll', () => {
      const deps = getDependentFields('autoscroll');
      expect(deps).toContain('interval');
    });

    it('should return dependent fields for autoRefresh', () => {
      const deps = getDependentFields('autoRefresh');
      expect(deps).toContain('refreshInterval');
    });

    it('should return dependent fields for filterByKeywords', () => {
      const deps = getDependentFields('filterByKeywords');
      expect(deps).toContain('filterKeywords');
      expect(deps).toContain('filterMode');
    });

    it('should return dependent fields for filterByCategory', () => {
      const deps = getDependentFields('filterByCategory');
      expect(deps).toContain('categoryFilterMode');
    });

    it('should return dependent fields for forceFallbackImage', () => {
      const deps = getDependentFields('forceFallbackImage');
      expect(deps).toContain('fallbackImageUrl');
    });

    it('should return empty array for fields without dependents', () => {
      expect(getDependentFields('webPartTitle')).toEqual([]);
      expect(getDependentFields('maxItems')).toEqual([]);
      expect(getDependentFields('unknownField' as keyof IRssFeedWebPartProps)).toEqual([]);
    });
  });
});
