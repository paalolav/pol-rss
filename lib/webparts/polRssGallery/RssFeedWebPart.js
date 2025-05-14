import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneToggle, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'RssFeedWebPartStrings';
import RssFeed from './components/RssFeed';
import { ThemeProvider } from '@microsoft/sp-component-base'; // <-- NYTT
export default class RssFeedWebPart extends BaseClientSideWebPart {
    async onInit() {
        this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
        this._themeVariant = this._themeProvider.tryGetTheme();
        this._themeProvider.themeChangedEvent.add(this, this._handleThemeChanged.bind(this));
        return super.onInit();
    }
    _handleThemeChanged(args) {
        this._themeVariant = args.theme;
        this.render();
    }
    render() {
        const { webPartTitle, feedUrl, layout, autoscroll, interval, forceFallbackImage, fallbackImageUrl, maxItems, showPubDate, showDescription, autoRefresh, refreshInterval } = this.properties;
        const element = React.createElement(RssFeed, {
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
            themeVariant: this._themeVariant // <-- NY LINJE
        });
        ReactDom.render(element, this.domElement);
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
        super.onDispose();
    }
    onPropertyPaneFieldChanged(propertyPath, oldValue, newValue) {
        if (propertyPath === 'layout' && oldValue !== newValue) {
            this.context.propertyPane.refresh();
        }
        super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
    getPropertyPaneConfiguration() {
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
                            }] : [])
                    ]
                }
            ]
        };
    }
}
//# sourceMappingURL=RssFeedWebPart.js.map