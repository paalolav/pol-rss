import * as React from 'react';
import { IRssItem } from './IRssItem';
export interface IListLayoutProps {
    items: IRssItem[];
    showPubDate: boolean;
    showDescription: boolean;
    fallbackImageUrl: string;
    forceFallback: boolean;
}
declare const ListLayout: React.FC<IListLayoutProps>;
export default ListLayout;
//# sourceMappingURL=ListLayout.d.ts.map