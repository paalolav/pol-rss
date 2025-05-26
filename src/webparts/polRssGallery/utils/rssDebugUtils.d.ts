import { IRssItem } from '../components/IRssItem';

export declare class RssDebugUtils {
  static setDebugMode(enable: boolean): void;
  static isDebugEnabled(): boolean;
  static elementToDebugString(element: Element, maxDepth?: number, includeContent?: boolean): string;
  static debugRssItem(item: Element): string;
  static analyzeRssFeed(items: IRssItem[], feedUrl: string): string;
  static createDebugConsole(container: HTMLElement): void;
  static logToDebugConsole(message: string): void;
}
