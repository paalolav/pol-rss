import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  IPropertyPaneGroup
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'RssFeedWebPartStrings';
import RssFeed, { IRssFeedProps } from './components/RssFeed';
import { ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
  PropertyPaneFeedUrl,
  PropertyPaneLayoutPicker,
  PropertyPanePresets,
  PropertyPaneProxyConfig,
  applyPreset,
  detectCurrentPreset,
  isFieldDisabled
} from './propertyPane';

export interface IRssFeedWebPartProps {
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
  maxItems: number;
  showPubDate: boolean;
  showDescription: boolean;
  proxyUrl: string;
  selectedPreset: string;
}

export default class RssFeedWebPart extends BaseClientSideWebPart<IRssFeedWebPartProps> {
  private _themeProvider!: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  public async onInit(): Promise<void> {
    // Initialize theme provider
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChanged.bind(this));

    // Initialize the proxy service with SharePoint HttpClient
    import('./services/proxyService').then(module => {
      const ProxyService = module.ProxyService;
      ProxyService.init(this.context.httpClient);
    });

    return super.onInit();
  }

  private _handleThemeChanged(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public render(): void {
    const {
      webPartTitle,
      feedUrl,
      layout,
      autoscroll,
      interval,
      forceFallbackImage,
      fallbackImageUrl,
      maxItems,
      showPubDate,
      showDescription,
      autoRefresh,
      refreshInterval
    } = this.properties;

    // Minimal layout always hides images
    const hideImages = layout === 'minimal';

    const element: React.ReactElement<IRssFeedProps> = React.createElement(RssFeed, {
      webPartTitle,
      feedUrl,
      layout,
      autoscroll,
      interval,
      hideImages,
      forceFallbackImage,
      fallbackImageUrl,
      maxItems,
      showPubDate,
      showDescription,
      autoRefresh,
      refreshInterval: (refreshInterval || 5) * 60,
      themeVariant: this._themeVariant
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    // Handle preset selection
    if (propertyPath === 'selectedPreset' && oldValue !== newValue) {
      const presetConfig = applyPreset(this.properties, newValue as string);
      Object.keys(presetConfig).forEach(key => {
        (this.properties as unknown as Record<string, unknown>)[key] = (presetConfig as unknown as Record<string, unknown>)[key];
      });
      this.context.propertyPane.refresh();
    }

    // Refresh property pane when layout changes (shows/hides banner settings)
    if (propertyPath === 'layout' && oldValue !== newValue) {
      this.context.propertyPane.refresh();
    }

    // Refresh when toggles change that affect conditional fields
    const toggleFields = ['autoRefresh', 'forceFallbackImage', 'autoscroll'];
    if (toggleFields.includes(propertyPath) && oldValue !== newValue) {
      this.context.propertyPane.refresh();
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  /**
   * Get all localized strings for property pane controls
   */
  private _getLocalizedStrings(): Record<string, string> {
    return {
      PresetNewsBanner: strings.PresetNewsBanner,
      PresetNewsBannerDescription: strings.PresetNewsBannerDescription,
      PresetBlogCards: strings.PresetBlogCards,
      PresetBlogCardsDescription: strings.PresetBlogCardsDescription,
      PresetCompactList: strings.PresetCompactList,
      PresetCompactListDescription: strings.PresetCompactListDescription,
      PresetCustom: strings.PresetCustom,
      PresetCustomDescription: strings.PresetCustomDescription
    };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Detect current preset based on properties
    const currentPreset = detectCurrentPreset(this.properties);

    // Build property groups
    const groups: IPropertyPaneGroup[] = [
      // Basic Settings Group
      {
        groupName: strings.BasicGroupName,
        isCollapsed: false,
        groupFields: [
          PropertyPanePresets({
            key: 'selectedPreset',
            label: strings.PresetsFieldLabel,
            value: currentPreset,
            strings: this._getLocalizedStrings(),
            onPresetSelect: (presetKey: string) => {
              this.properties.selectedPreset = presetKey;
              this.onPropertyPaneFieldChanged('selectedPreset', currentPreset, presetKey);
              this.render(); // Trigger immediate re-render for custom controls
            }
          }),
          PropertyPaneTextField('webPartTitle', {
            label: strings.TitleFieldLabel
          }),
          PropertyPaneFeedUrl({
            key: 'feedUrl',
            label: strings.FeedUrlFieldLabel,
            description: strings.FeedUrlDescription,
            placeholder: strings.FeedUrlPlaceholder,
            value: this.properties.feedUrl || '',
            proxyUrl: this.properties.proxyUrl,
            onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => {
              this.properties.feedUrl = newValue;
              this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
              this.render(); // Trigger immediate re-render for custom controls
            }
          }),
          PropertyPaneLayoutPicker({
            key: 'layout',
            label: strings.LayoutFieldLabel,
            value: this.properties.layout || 'card',
            options: [
              { key: 'banner', text: strings.LayoutBannerLabel, description: strings.LayoutBannerDescription },
              { key: 'card', text: strings.LayoutCardLabel, description: strings.LayoutCardDescription },
              { key: 'list', text: strings.LayoutListLabel, description: strings.LayoutListDescription },
              { key: 'minimal', text: strings.LayoutMinimalLabel, description: strings.LayoutMinimalDescription }
            ],
            onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => {
              this.properties.layout = newValue as 'banner' | 'card' | 'list' | 'minimal';
              this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
              this.render(); // Trigger immediate re-render for custom controls
            }
          })
        ]
      },

      // Display Settings Group
      {
        groupName: strings.DisplayGroupName,
        isCollapsed: false,
        groupFields: [
          PropertyPaneSlider('maxItems', {
            label: strings.MaxItemsFieldLabel,
            min: 1,
            max: 20,
            step: 1,
            value: this.properties.maxItems || 6
          }),
          PropertyPaneToggle('showPubDate', {
            label: strings.ShowPubDateFieldLabel,
            onText: strings.ShowPubDateOnLabel,
            offText: strings.ShowPubDateOffLabel
          }),
          PropertyPaneToggle('showDescription', {
            label: strings.ShowDescriptionFieldLabel,
            onText: strings.ShowDescriptionOnLabel,
            offText: strings.ShowDescriptionOffLabel
          }),
        ]
      },

      // Images Group (only for layouts with images)
      {
        groupName: strings.ImagesGroupName,
        isCollapsed: false,
        groupFields: [
          PropertyPaneToggle('forceFallbackImage', {
            label: strings.ForceFallbackFieldLabel,
            onText: strings.ForceFallbackOnLabel,
            offText: strings.ForceFallbackOffLabel,
            disabled: this.properties.layout === 'minimal'
          }),
          PropertyPaneTextField('fallbackImageUrl', {
            label: strings.FallbackUrlFieldLabel,
            description: strings.FallbackUrlDescription,
            disabled: this.properties.layout === 'minimal' || isFieldDisabled('fallbackImageUrl', this.properties)
          })
        ]
      }
    ];

    // Banner Settings Group (only shown for banner layout)
    if (this.properties.layout === 'banner') {
      groups.push({
        groupName: strings.BannerSettingsGroupName,
        isCollapsed: false,
        groupFields: [
          PropertyPaneToggle('autoscroll', {
            label: strings.AutoscrollFieldLabel,
            onText: strings.AutoscrollOnLabel,
            offText: strings.AutoscrollOffLabel
          }),
          PropertyPaneSlider('interval', {
            label: strings.IntervalFieldLabel,
            min: 3,
            max: 30,
            step: 1,
            disabled: isFieldDisabled('interval', this.properties)
          })
        ]
      });
    }

    // Advanced Settings Group
    groups.push({
      groupName: strings.AdvancedGroupName,
      isCollapsed: false,
      groupFields: [
        PropertyPaneToggle('autoRefresh', {
          label: strings.AutoRefreshFieldLabel,
          onText: strings.AutoRefreshOnLabel,
          offText: strings.AutoRefreshOffLabel
        }),
        PropertyPaneSlider('refreshInterval', {
          label: strings.RefreshIntervalFieldLabel,
          min: 1,
          max: 360,
          step: 1,
          value: this.properties.refreshInterval || 5,
          disabled: isFieldDisabled('refreshInterval', this.properties)
        }),
        PropertyPaneProxyConfig({
          key: 'proxyUrl',
          label: strings.ProxyUrlFieldLabel,
          description: strings.ProxyUrlDescription,
          placeholder: strings.ProxyUrlPlaceholder,
          value: this.properties.proxyUrl || '',
          strings: {
            testConnection: strings.TestConnectionLabel,
            testing: strings.TestingConnectionLabel,
            success: strings.ConnectionSuccessLabel,
            failed: strings.ConnectionFailedLabel,
            helpLink: strings.ProxyHelpLinkText
          },
          helpUrl: 'https://github.com/pnp/sp-dev-fx-webparts/wiki/RSS-Feed-WebPart-Proxy-Setup',
          onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => {
            this.properties.proxyUrl = newValue;
            this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
            this.render(); // Trigger immediate re-render for custom controls
          }
        })
      ]
    });

    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups
        }
      ]
    };
  }
}
