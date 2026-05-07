import * as React from 'react';
import { useMemo } from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { getImageSrc, safeHref } from './rssUtils';
import { arePropsEqual, useImgErrorHandler, useLayoutRerenderKey } from './useRssLayout';

interface ICardLayoutProps {
  items: Array<{ title: string; link: string; imageUrl?: string; description?: string; pubDate?: string }>;
  fallbackImageUrl?: string;
  forceFallback?: boolean;
  showDescription?: boolean;
  showPubDate?: boolean;
}

const CardLayout: React.FC<ICardLayoutProps> = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription }) => {
  const layoutKey = useLayoutRerenderKey(forceFallback);
  const handleImgError = useImgErrorHandler(fallbackImageUrl);

  const memoizedItems = useMemo(() => items.map((item, index) => {
    const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);

    return (
      <div key={`${item.link}-${index}`} className={styles.card}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.title}
            className={styles.cardImage}
            onError={handleImgError}
            loading="lazy"
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <i className="ms-Icon ms-Icon--Photo2" aria-hidden="true"></i>
          </div>
        )}
        <div className={styles.cardBody}>
          {safeHref(item.link) ? (
            <a href={safeHref(item.link)} className={styles.cardTitle} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          ) : (
            <span className={styles.cardTitle}>{item.title}</span>
          )}
          {showPubDate && item.pubDate && (
            <div className={styles.pubDate}>
              {new Date(item.pubDate).toLocaleDateString()}
            </div>
          )}
          {showDescription && item.description && (
            <div className={styles.cardDescription}>
              {parse(item.description)}
            </div>
          )}
        </div>
      </div>
    );
  }), [items, fallbackImageUrl, forceFallback, showPubDate, showDescription, handleImgError]);

  return (
    <div key={layoutKey} className={styles.cardGrid}>
      {memoizedItems}
    </div>
  );
};

export default React.memo(CardLayout, arePropsEqual);
