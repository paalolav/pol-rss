import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
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
    galleryColumns: 'auto' | 2 | 3 | 4;
    galleryTitlePosition: 'hover' | 'below' | 'none';
    galleryAspectRatio: '1:1' | '4:3' | '16:9';
    galleryGap: 'sm' | 'md' | 'lg';
    skipDirectFetch: boolean;
}
export default class RssFeedWebPart extends BaseClientSideWebPart<IRssFeedWebPartProps> {
    private _themeProvider;
    private _themeVariant;
    onInit(): Promise<void>;
    private _handleThemeChanged;
    render(): void;
    protected onDispose(): void;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=RssFeedWebPart.d.ts.map