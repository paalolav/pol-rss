import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './RssFeed.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';

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

const BannerCarousel: React.FC<IBannerCarouselProps> = ({ items, autoscroll, interval, fallbackImageUrl, forceFallback, showPubDate, showDescription, showCategories }) => {
  const delayMs = interval * 1000;

  // Add a state to track a unique key for re-rendering
  const [carouselKey, setCarouselKey] = useState(0);

  useEffect(() => {
    // Increment the key whenever forceFallback changes
    setCarouselKey((prevKey) => prevKey + 1);
  }, [forceFallback]);

  return (
    <Swiper 
      key={carouselKey} // Use the unique key to force re-render
      modules={[Autoplay]}
      autoplay={autoscroll ? { delay: delayMs, disableOnInteraction: false } : false}
      loop={autoscroll}
      slidesPerView={1}
      spaceBetween={0}
    >
      {items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);

        return (
          <SwiperSlide key={index} className={styles.bannerSlide}>
            {imgSrc ? (
              <img src={imgSrc} alt={item.title} className={styles.bannerImage} onError={(e) => imgError(e, fallbackImageUrl)} />
            ) : (
              <div className={styles.bannerImagePlaceholder}>
                <i className="ms-Icon ms-Icon--Photo2" aria-hidden="true"></i>
              </div>
            )}
            <div className={styles.bannerCaption}>
              <a href={item.link} className={styles.bannerTitle} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              {showPubDate && item.pubDate && (
                <div className={styles.bannerPubDate}>
                  {new Date(item.pubDate).toLocaleDateString()}
                </div>
              )}
              {showDescription && item.description && (
                <div className={styles.bannerDescription}>
                  {parse(item.description)}
                </div>
              )}
              {showCategories && item.categories && item.categories.length > 0 && (
                <div className={styles.bannerCategories}>
                  {item.categories.map((category, idx) => (
                    <span key={`${category}-${idx}`} className={styles.bannerCategoryBadge}>
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default BannerCarousel;
