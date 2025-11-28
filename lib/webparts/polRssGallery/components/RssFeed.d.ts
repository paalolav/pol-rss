import * as React from 'react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface IRssFeedProps {
    webPartTitle: string;
    feedUrl: string;
    autoRefresh: boolean;
    refreshInterval: number;
    layout: 'banner' | 'card' | 'list' | 'minimal' | 'gallery';
    autoscroll: boolean;
    interval: number;
    showPagination: boolean;
    hideImages: boolean;
    forceFallbackImage: boolean;
    fallbackImageUrl: string;
    showPubDate: boolean;
    showDescription: boolean;
    maxItems: number;
    themeVariant?: IReadonlyTheme;
    galleryColumns?: 'auto' | 2 | 3 | 4;
    galleryTitlePosition?: 'hover' | 'below' | 'none';
    galleryAspectRatio?: '1:1' | '4:3' | '16:9';
    galleryGap?: 'sm' | 'md' | 'lg';
}
declare const RssFeed: React.FC<IRssFeedProps>;
export default RssFeed;
//# sourceMappingURL=RssFeed.d.ts.map