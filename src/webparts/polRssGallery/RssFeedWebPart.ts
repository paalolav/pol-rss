import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneChoiceGroup,
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
  PropertyPaneProxyConfig,
  isFieldDisabled
} from './propertyPane';

export interface IRssFeedWebPartProps {
  webPartTitle: string;
  feedUrl: string;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'banner' | 'card' | 'list' | 'minimal' | 'gallery';
  autoscroll: boolean;
  interval: number;
  showPagination: boolean;
  forceFallbackImage: boolean;
  fallbackImageUrl: string;
  maxItems: number;
  showPubDate: boolean;
  showDescription: boolean;
  showSource: boolean;
  proxyUrl: string;
  // Gallery-specific properties
  galleryColumns: 'auto' | 2 | 3 | 4;
  galleryTitlePosition: 'hover' | 'below' | 'none';
  galleryAspectRatio: '1:1' | '4:3' | '16:9';
  galleryGap: 'sm' | 'md' | 'lg';
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
      showPagination,
      forceFallbackImage,
      fallbackImageUrl,
      maxItems,
      showPubDate,
      showDescription,
      showSource,
      autoRefresh,
      refreshInterval,
      galleryColumns,
      galleryTitlePosition,
      galleryAspectRatio,
      galleryGap
    } = this.properties;

    // Minimal layout always hides images
    const hideImages = layout === 'minimal';

    const element: React.ReactElement<IRssFeedProps> = React.createElement(RssFeed, {
      webPartTitle,
      feedUrl,
      layout,
      autoscroll,
      interval,
      showPagination: showPagination !== false, // default true
      hideImages,
      forceFallbackImage,
      fallbackImageUrl,
      maxItems,
      showPubDate,
      showDescription,
      showSource,
      autoRefresh,
      refreshInterval: (refreshInterval || 5) * 60,
      themeVariant: this._themeVariant,
      // Gallery-specific props
      galleryColumns: galleryColumns || 'auto',
      galleryTitlePosition: galleryTitlePosition || 'below',
      galleryAspectRatio: galleryAspectRatio || '4:3',
      galleryGap: galleryGap || 'md'
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Build property groups
    const groups: IPropertyPaneGroup[] = [
      // Layout Settings Group
      {
        groupName: strings.LayoutGroupName,
        isCollapsed: false,
        groupFields: [
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
              { key: 'card', text: strings.LayoutCardLabel, description: strings.LayoutCardDescription },
              { key: 'list', text: strings.LayoutListLabel, description: strings.LayoutListDescription },
              { key: 'minimal', text: strings.LayoutMinimalLabel, description: strings.LayoutMinimalDescription },
              { key: 'banner', text: strings.LayoutBannerLabel, description: strings.LayoutBannerDescription },
              { key: 'gallery', text: strings.LayoutGalleryLabel, description: strings.LayoutGalleryDescription }
            ],
            onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => {
              this.properties.layout = newValue as 'banner' | 'card' | 'list' | 'minimal' | 'gallery';
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
          PropertyPaneToggle('showSource', {
            label: strings.ShowSourceFieldLabel,
            onText: strings.ShowSourceOnLabel,
            offText: strings.ShowSourceOffLabel
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
          }),
          PropertyPaneToggle('showPagination', {
            label: strings.ShowPaginationFieldLabel,
            onText: strings.ShowPaginationOnLabel,
            offText: strings.ShowPaginationOffLabel
          })
        ]
      });
    }

    // Gallery Settings Group (only shown for gallery layout)
    if (this.properties.layout === 'gallery') {
      groups.push({
        groupName: strings.GallerySettingsGroupName,
        isCollapsed: false,
        groupFields: [
          PropertyPaneDropdown('galleryColumns', {
            label: strings.GalleryColumnsLabel,
            options: [
              { key: 'auto', text: strings.GalleryColumnsAuto },
              { key: 2, text: '2' },
              { key: 3, text: '3' },
              { key: 4, text: '4' }
            ],
            selectedKey: this.properties.galleryColumns || 'auto'
          }),
          PropertyPaneChoiceGroup('galleryTitlePosition', {
            label: strings.GalleryTitlePositionLabel,
            options: [
              { key: 'hover', text: strings.GalleryTitleHover },
              { key: 'below', text: strings.GalleryTitleBelow },
              { key: 'none', text: strings.GalleryTitleNone }
            ]
          }),
          PropertyPaneDropdown('galleryAspectRatio', {
            label: strings.GalleryAspectRatioLabel,
            options: [
              { key: '1:1', text: strings.AspectRatio1x1 },
              { key: '4:3', text: strings.AspectRatio4x3 },
              { key: '16:9', text: strings.AspectRatio16x9 }
            ],
            selectedKey: this.properties.galleryAspectRatio || '4:3'
          }),
          PropertyPaneDropdown('galleryGap', {
            label: strings.GalleryGapLabel,
            options: [
              { key: 'sm', text: strings.GapSmall },
              { key: 'md', text: strings.GapMedium },
              { key: 'lg', text: strings.GapLarge }
            ],
            selectedKey: this.properties.galleryGap || 'md'
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
          helpUrl: 'https://github.com/paalolav/pol-rss/blob/main/docs/PROXY_SETUP.md',
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
