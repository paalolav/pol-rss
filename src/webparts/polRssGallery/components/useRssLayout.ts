import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import { imgError } from './rssUtils';

interface IRssLayoutBaseProps {
  items: Array<{ title: string; link: string; imageUrl?: string }>;
  fallbackImageUrl?: string;
  forceFallback?: boolean;
  showDescription?: boolean;
  showPubDate?: boolean;
}

export function useLayoutRerenderKey(forceFallback?: boolean): number {
  const [layoutKey, setLayoutKey] = useState(0);
  useEffect(() => {
    setLayoutKey(prev => prev + 1);
  }, [forceFallback]);
  return layoutKey;
}

export function useImgErrorHandler(fallbackImageUrl?: string): (e: React.SyntheticEvent<HTMLImageElement>) => void {
  return useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    imgError(e, fallbackImageUrl);
  }, [fallbackImageUrl]);
}

export function arePropsEqual<T extends IRssLayoutBaseProps>(prev: T, next: T): boolean {
  return (
    prev.forceFallback === next.forceFallback &&
    prev.fallbackImageUrl === next.fallbackImageUrl &&
    prev.showDescription === next.showDescription &&
    prev.showPubDate === next.showPubDate &&
    prev.items.length === next.items.length &&
    prev.items.every((item, index) =>
      item.title === next.items[index].title &&
      item.link === next.items[index].link &&
      item.imageUrl === next.items[index].imageUrl
    )
  );
}
