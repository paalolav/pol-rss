import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './RssFeed.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';
const BannerCarousel = ({ items, autoscroll, interval, fallbackImageUrl, forceFallback, showPubDate, showDescription, showCategories }) => {
    const delayMs = interval * 1000;
    // Add a state to track a unique key for re-rendering
    const [carouselKey, setCarouselKey] = useState(0);
    useEffect(() => {
        // Increment the key whenever forceFallback changes
        setCarouselKey((prevKey) => prevKey + 1);
    }, [forceFallback]);
    return (React.createElement(Swiper, { key: carouselKey, modules: [Autoplay], autoplay: autoscroll ? { delay: delayMs, disableOnInteraction: false } : false, loop: autoscroll, slidesPerView: 1, spaceBetween: 0 }, items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);
        return (React.createElement(SwiperSlide, { key: index, className: styles.bannerSlide },
            imgSrc ? (React.createElement("img", { src: imgSrc, alt: item.title, className: styles.bannerImage, onError: (e) => imgError(e, fallbackImageUrl) })) : (React.createElement("div", { className: styles.bannerImagePlaceholder },
                React.createElement("i", { className: "ms-Icon ms-Icon--Photo2", "aria-hidden": "true" }))),
            React.createElement("div", { className: styles.bannerCaption },
                React.createElement("a", { href: item.link, className: styles.bannerTitle, target: "_blank", rel: "noopener noreferrer" }, item.title),
                showPubDate && item.pubDate && (React.createElement("div", { className: styles.bannerPubDate }, new Date(item.pubDate).toLocaleDateString())),
                showDescription && item.description && (React.createElement("div", { className: styles.bannerDescription }, parse(item.description))),
                showCategories && item.categories && item.categories.length > 0 && (React.createElement("div", { className: styles.bannerCategories }, item.categories.map((category, idx) => (React.createElement("span", { key: `${category}-${idx}`, className: styles.bannerCategoryBadge }, category))))))));
    })));
};
export default BannerCarousel;
//# sourceMappingURL=BannerCarousel.js.map