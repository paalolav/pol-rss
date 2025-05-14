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
    }>;
    autoscroll: boolean;
    interval: number;
    fallbackImageUrl?: string;
    forceFallback?: boolean;
    showPubDate?: boolean;
    showDescription?: boolean;
}
declare const BannerCarousel: React.FC<IBannerCarouselProps>;
export default BannerCarousel;
//# sourceMappingURL=BannerCarousel.d.ts.map