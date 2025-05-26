import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
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
    private _themeProvider;
    private _themeVariant;
    onInit(): Promise<void>;
    private _handleThemeChanged;
    render(): void;
    protected onDispose(): void;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=RssFeedWebPart.d.ts.map