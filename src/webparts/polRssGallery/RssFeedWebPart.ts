import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneToggle, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'RssFeedWebPartStrings';
import RssFeed, { IRssFeedProps } from './components/RssFeed';
import { ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IRssFeedWebPartProps {
  webPartTitle: string;
  feedUrl: string;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'banner' | 'card' | 'list';
  autoscroll: boolean;
  interval: number;
  forceFallbackImage: boolean;
  fallbackImageUrl: string;
  maxItems: number;
  showPubDate: boolean;
  showDescription: boolean;
  filterByKeywords: boolean;
  filterKeywords: string;
  filterMode: 'include' | 'exclude';
  showCategories: boolean;
  filterByCategory: boolean;
  categoryFilterMode: 'include' | 'exclude';
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

  private _handleThemeChanged(args: ThemeChangedEventArgs): void { // <-- NYTT
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
      refreshInterval,
      filterByKeywords,
      filterKeywords,
      filterMode,
      showCategories,
      filterByCategory,
      categoryFilterMode
    } = this.properties;
  
    const element: React.ReactElement<IRssFeedProps> = React.createElement(RssFeed, {
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
      refreshInterval: (refreshInterval || 5) * 60,
      filterByKeywords: filterByKeywords || false,
      filterKeywords: filterKeywords || '',
      filterMode: filterMode || 'include',
      showCategories: showCategories || false,
      filterByCategory: filterByCategory || false,
      categoryFilterMode: categoryFilterMode || 'include',
      themeVariant: this._themeVariant // <-- NY LINJE
    });
  
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'layout' && oldValue !== newValue) {
      this.context.propertyPane.refresh();
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('webPartTitle', {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField('feedUrl', {
                  label: strings.FeedUrlFieldLabel
                }),
                PropertyPaneSlider('maxItems', {
                  label: strings.MaxItemsFieldLabel,
                  min: 1,
                  max: 20,
                  step: 1,
                  value: this.properties.maxItems || 6
                }),
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
                  disabled: !this.properties.autoRefresh
                }),            
                PropertyPaneChoiceGroup('layout', {
                  label: strings.LayoutFieldLabel,
                  options: [
                    { key: 'banner', text: strings.LayoutBannerLabel },
                    { key: 'card', text: strings.LayoutCardLabel },
                    { key: 'list', text: strings.LayoutListLabel }
                  ]
                }),
                PropertyPaneToggle('forceFallbackImage', {
                  label: strings.ForceFallbackFieldLabel,
                  onText: strings.ForceFallbackOnLabel,
                  offText: strings.ForceFallbackOffLabel
                }),
                PropertyPaneTextField('fallbackImageUrl', {
                  label: strings.FallbackUrlFieldLabel,
                  description: strings.FallbackUrlDescription
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
                })
              ]
            },
            ...(this.properties.layout === 'banner' ? [{
              groupName: strings.BannerSettingsGroupName,
              groupFields: [
                PropertyPaneToggle('autoscroll', {
                  label: strings.AutoscrollFieldLabel,
                  onText: strings.AutoscrollOnLabel,
                  offText: strings.AutoscrollOffLabel
                }),
                PropertyPaneSlider('interval', {
                  label: strings.IntervalFieldLabel,
                  min: 3, max: 30, step: 1,
                  disabled: !this.properties.autoscroll
                })
              ]
            }] : []),
            {
              groupName: "Content Filter Settings",
              groupFields: [
                PropertyPaneToggle('filterByKeywords', {
                  label: "Filter items by keywords",
                  onText: "On",
                  offText: "Off"
                }),
                PropertyPaneTextField('filterKeywords', {
                  label: "Filter keywords",
                  description: "Comma-separated list of keywords",
                  disabled: !this.properties.filterByKeywords
                }),
                PropertyPaneChoiceGroup('filterMode', {
                  label: "Filter mode",
                  options: [
                    { key: 'include', text: "Include items containing keywords" },
                    { key: 'exclude', text: "Exclude items containing keywords" }
                  ]
                }),
                PropertyPaneToggle('showCategories', {
                  label: "Show categories",
                  onText: "Show",
                  offText: "Hide"
                }),
                PropertyPaneToggle('filterByCategory', {
                  label: "Enable category filtering",
                  onText: "On",
                  offText: "Off"
                }),
                PropertyPaneChoiceGroup('categoryFilterMode', {
                  label: "Category filter mode",
                  options: [
                    { 
                      key: 'include', 
                      text: "Include selected categories",
                      disabled: !this.properties.filterByCategory 
                    },
                    { 
                      key: 'exclude', 
                      text: "Exclude selected categories",
                      disabled: !this.properties.filterByCategory 
                    }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
