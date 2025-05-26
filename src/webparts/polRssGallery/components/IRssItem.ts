export interface IRssItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  categories?: string[];
  feedType?: 'rss' | 'atom';
}