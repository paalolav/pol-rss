import * as React from 'react';
import { useMemo } from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { IRssItem } from './IRssItem';
import { getImageSrc } from './rssUtils';
import { arePropsEqual, useImgErrorHandler, useLayoutRerenderKey } from './useRssLayout';

export interface IListLayoutProps {
  items: IRssItem[];
  showPubDate: boolean;
  showDescription: boolean;
  fallbackImageUrl: string;
  forceFallback: boolean;
}

const ListLayout: React.FC<IListLayoutProps> = ({
  items,
  fallbackImageUrl,
  forceFallback,
  showPubDate,
  showDescription
}) => {
  const layoutKey = useLayoutRerenderKey(forceFallback);
  const handleImgError = useImgErrorHandler(fallbackImageUrl);

  const memoizedItems = useMemo(() => items.map((item, index) => {
    const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);

    return (
      <div key={`${item.link}-${index}`} className={styles.listItem}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.title}
            className={styles.thumbnail}
            onError={handleImgError}
            loading="lazy"
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <i className="ms-Icon ms-Icon--Photo2" aria-hidden="true"></i>
          </div>
        )}
        <div className={styles.content}>
          <a 
            href={item.link} 
            className={styles.title} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {item.title}
          </a>
          {showPubDate && item.pubDate && (
            <div className={styles.pubDate}>
              {new Date(item.pubDate).toLocaleDateString()}
            </div>
          )}
          {showDescription && item.description && (
            <div className={styles.description}>
              {parse(item.description)}
            </div>
          )}
        </div>
      </div>
    );
  }), [items, fallbackImageUrl, forceFallback, showPubDate, showDescription, handleImgError]);

  return (
    <div key={layoutKey} className={styles.listLayout}>
      {memoizedItems}
    </div>
  );
};

export default React.memo(ListLayout, arePropsEqual);
