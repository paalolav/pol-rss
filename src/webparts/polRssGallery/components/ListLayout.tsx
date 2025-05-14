import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { IRssItem } from './IRssItem';
import { getImageSrc, imgError } from './rssUtils';

export interface IListLayoutProps {
  items: IRssItem[];
  showPubDate: boolean;
  showDescription: boolean;
  fallbackImageUrl: string;
  forceFallback: boolean;
}

const arePropsEqual = (prevProps: IListLayoutProps, nextProps: IListLayoutProps): boolean => {
  return (
    prevProps.forceFallback === nextProps.forceFallback &&
    prevProps.fallbackImageUrl === nextProps.fallbackImageUrl &&
    prevProps.showDescription === nextProps.showDescription &&
    prevProps.showPubDate === nextProps.showPubDate &&
    prevProps.items.length === nextProps.items.length &&
    prevProps.items.every((item, index) => 
      item.title === nextProps.items[index].title &&
      item.link === nextProps.items[index].link &&
      item.imageUrl === nextProps.items[index].imageUrl
    )
  );
};

const ListLayout: React.FC<IListLayoutProps> = ({ 
  items, 
  fallbackImageUrl, 
  forceFallback, 
  showPubDate, 
  showDescription 
}) => {
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    setLayoutKey((prevKey) => prevKey + 1);
  }, [forceFallback]);

  const handleImgError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    imgError(e, fallbackImageUrl);
  }, [fallbackImageUrl]);

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
