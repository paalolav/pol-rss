import * as React from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { IRssItem } from './IRssItem';
import { getImageSrc, imgError } from './rssUtils';
import { useState, useEffect } from 'react';

export interface IListLayoutProps {
  items: IRssItem[];
  showPubDate: boolean;
  showDescription: boolean;
  fallbackImageUrl: string;
  forceFallback: boolean;
}

const ListLayout: React.FC<IListLayoutProps> = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription }) => {
  // Add a state to track a unique key for re-rendering
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    // Increment the key whenever forceFallback changes
    setLayoutKey((prevKey) => prevKey + 1);
  }, [forceFallback]);

  return (
    <div key={layoutKey} className={styles.listLayout}>
      {items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);

        return (
          <div key={index} className={styles.listItem}>
            {imgSrc ? (
              <img src={imgSrc} alt={item.title} className={styles.thumbnail} onError={(e) => imgError(e, fallbackImageUrl)} />
            ) : (
              <div className={styles.cardImagePlaceholder}>
                <i className="ms-Icon ms-Icon--Photo2" aria-hidden="true"></i>
              </div>
            )}
            <div className={styles.content}>
              <a href={item.link} className={styles.title} target="_blank" rel="noopener noreferrer">
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
      })}
    </div>
  );
};

export default ListLayout;
