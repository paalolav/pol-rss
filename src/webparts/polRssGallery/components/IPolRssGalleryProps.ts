export type LayoutType = 'banner' | 'list' | 'cards';

export interface IPolRssGalleryProps {
  webPartTitle?: string;
  feedUrl: string;
  maxItems: number;
  showDate: boolean;
  showDescription: boolean;
  fallbackImageUrl?: string;
  layout: LayoutType;
  loadImages: boolean;
  autoSlide: boolean;
  slideInterval: number;
  useFallbackImageAlways: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}