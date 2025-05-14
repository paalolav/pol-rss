import * as React from 'react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface IRssFeedProps {
    webPartTitle: string;
    feedUrl: string;
    autoRefresh: boolean;
    refreshInterval: number;
    layout: 'banner' | 'card' | 'list';
    autoscroll: boolean;
    interval: number;
    forceFallbackImage: boolean;
    fallbackImageUrl: string;
    showPubDate: boolean;
    showDescription: boolean;
    maxItems: number;
    themeVariant?: IReadonlyTheme;
}
declare const RssFeed: React.FC<IRssFeedProps>;
export default RssFeed;
//# sourceMappingURL=RssFeed.d.ts.map