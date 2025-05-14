import * as React from 'react';
import styles from './RssFeed.module.scss';
import parse from 'html-react-parser';
import { getImageSrc, imgError } from './rssUtils';
import { useState, useEffect } from 'react';


interface ICardLayoutProps {
  items: Array<{ title: string; link: string; imageUrl?: string; description?: string; pubDate?: string }>;
  fallbackImageUrl?: string;
  forceFallback?: boolean;
  showDescription?: boolean;
  showPubDate?: boolean;
}

const CardLayout: React.FC<ICardLayoutProps> = ({ items, fallbackImageUrl, forceFallback, showPubDate, showDescription }) => {
  // Add a state to track a unique key for re-rendering
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    // Increment the key whenever forceFallback changes
    setLayoutKey((prevKey) => prevKey + 1);
  }, [forceFallback]);

  return (
    <div key={layoutKey} className={styles.cardGrid}>
      {items.map((item, index) => {
        const imgSrc = getImageSrc(item.imageUrl, fallbackImageUrl, forceFallback);

        return (
          <div key={index} className={styles.card}>
            {imgSrc ? (
              <img src={imgSrc} alt={item.title} className={styles.cardImage} onError={(e) => imgError(e, fallbackImageUrl)} />
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardLayout;
