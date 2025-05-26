import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';

interface ICardLayoutProps {
  items: Array<{ 
    title: string; 
    link: string; 
    imageUrl?: string; 
    description?: string; 
    pubDate?: string;
    author?: string;
    categories?: string[];
    feedType?: 'rss' | 'atom';
  }>;
  fallbackImageUrl?: string;
  forceFallback?: boolean;
  showDescription?: boolean;
  showPubDate?: boolean;
  showCategories?: boolean;
}

const arePropsEqual = (prevProps: ICardLayoutProps, nextProps: ICardLayoutProps): boolean => {
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

const CardLayout: React.FC<ICardLayoutProps> = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription, showCategories }) => {
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
          <a href={item.link} className={styles.cardTitle} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
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
          {showCategories && item.categories && item.categories.length > 0 && (
            <div className={styles.itemCategories}>
              {item.categories.map((category, idx) => (
                <span key={`${category}-${idx}`} className={styles.categoryBadge}>
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }), [items, fallbackImageUrl, forceFallback, showPubDate, showDescription, showCategories, handleImgError]);

  return (
    <div key={layoutKey} className={styles.cardGrid}>
      {memoizedItems}
    </div>
  );
};

export default React.memo(CardLayout, arePropsEqual);
