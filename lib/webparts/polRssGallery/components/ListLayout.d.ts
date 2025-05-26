import * as React from 'react';
import { IRssItem } from './IRssItem';
export interface IListLayoutProps {
    items: IRssItem[];
    showPubDate: boolean;
    showDescription: boolean;
    fallbackImageUrl: string;
    forceFallback: boolean;
    showCategories?: boolean;
}
declare const _default: React.NamedExoticComponent<IListLayoutProps>;
export default _default;
//# sourceMappingURL=ListLayout.d.ts.map