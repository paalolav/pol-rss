import * as React from 'react';
interface ICardLayoutProps {
    items: Array<{
        title: string;
        link: string;
        imageUrl?: string;
        description?: string;
        pubDate?: string;
    }>;
    fallbackImageUrl?: string;
    forceFallback?: boolean;
    showDescription?: boolean;
    showPubDate?: boolean;
}
declare const CardLayout: React.FC<ICardLayoutProps>;
export default CardLayout;
//# sourceMappingURL=CardLayout.d.ts.map