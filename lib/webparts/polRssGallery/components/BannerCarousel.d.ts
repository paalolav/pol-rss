import * as React from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
interface IBannerCarouselProps {
    items: Array<{
        title: string;
        link: string;
        imageUrl?: string;
        pubDate?: string;
        description?: string;
        author?: string;
        categories?: string[];
        feedType?: 'rss' | 'atom';
    }>;
    autoscroll: boolean;
    interval: number;
    fallbackImageUrl?: string;
    forceFallback?: boolean;
    showPubDate?: boolean;
    showDescription?: boolean;
    showCategories?: boolean;
}
declare const BannerCarousel: React.FC<IBannerCarouselProps>;
export default BannerCarousel;
//# sourceMappingURL=BannerCarousel.d.ts.map