/**
 * RSS Debug Utilities
 * This file provides functions for debugging RSS feed processing
 */

import { IRssItem } from '../components/IRssItem';

/**
 * RSS Debug class with utilities to help diagnose RSS feed issues
 */
export class RssDebugUtils {
  private static isDebugMode = false;

  /**
   * Enable or disable debug mode globally
   * @param enable Whether to enable debug mode
   */
  public static setDebugMode(enable: boolean): void {
    this.isDebugMode = enable;
  }

  /**
   * Check if debug mode is enabled
   */
  public static isDebugEnabled(): boolean {
    return this.isDebugMode;
  }

  /**
   * Log a message if debug mode is enabled
   * @param message The message to log
   */
  public static log(message: string): void {
    if (this.isDebugMode) {
      // Using void to satisfy linting rules while keeping the functionality
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  /**
   * Log a warning if debug mode is enabled
   * @param warning The warning message to log
   */
  public static warn(warning: string): void {
    if (this.isDebugMode) {
      // eslint-disable-next-line no-console
      console.warn(warning);
    }
  }

  /**
   * Log an error if debug mode is enabled
   * @param error The error message to log
   */
  public static error(error: string): void {
    if (this.isDebugMode) {
      console.error(error);
    }
  }

  /**
   * Convert a DOM Element to a readable debug string
   * @param element The DOM element to analyze
   * @param maxDepth Maximum depth to recurse
   * @param includeContent Whether to include element content
   */
  public static elementToDebugString(element: Element, maxDepth: number = 2, includeContent: boolean = false): string {
    let output = '';
    
    try {
      // Start with the tag name
      const tagName = element.tagName || element.nodeName;
      output += `<${tagName.toLowerCase()}`;
      
      // Add attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        output += ` ${attr.name}="${attr.value}"`;
      }
      
      output += '>';
      
      // Add content if requested
      if (includeContent && element.textContent) {
        let content = element.textContent.trim();
        if (content.length > 100) {
          content = content.substring(0, 97) + '...';
        }
        output += content;
      }
      
      // Add child elements if not at max depth
      if (maxDepth > 0) {
        const children = element.children;
        if (children.length > 0) {
          output += '\n  Children:';
          for (let i = 0; i < Math.min(children.length, 5); i++) {
            const childDebug = this.elementToDebugString(
              children[i], 
              maxDepth - 1, 
              includeContent
            ).split('\n').map(line => '  ' + line).join('\n');
            output += '\n' + childDebug;
          }
          
          if (children.length > 5) {
            output += `\n  ... and ${children.length - 5} more children`;
          }
        }
      }
      
      output += `</${tagName.toLowerCase()}>`;
    } catch (error) {
      output += `\nError analyzing element: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    
    return output;
  }

  /**
   * Generate a debug log for an RSS item
   * @param item The DOM element representing an RSS item
   */
  public static debugRssItem(item: Element): string {
    if (!item) return 'No item provided';
    
    let debug = '';
    
    try {
      // Log tag names
      debug += 'Item tag name: ' + item.tagName + '\n';
      
      // Count and list direct children
      const children = item.childNodes;
      const childElements = Array.from(children).filter(node => node.nodeType === 1);
      
      debug += `Child elements (${childElements.length}):\n`;
      childElements.forEach((child: Node) => {
        const element = child as Element;
        debug += `- ${element.nodeName}: ${element.textContent?.substring(0, 50) || '(empty)'}\n`;
      });
      
      // Look for media tags specifically
      const mediaElements = Array.from(item.getElementsByTagName('*'))
        .filter(el => el.nodeName.toLowerCase().includes('media') || 
                      el.nodeName.toLowerCase().includes('thumbnail'));
      
      debug += `Media elements (${mediaElements.length}):\n`;
      mediaElements.forEach(el => {
        debug += `- ${el.nodeName}: `;
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          debug += `${attr.name}="${attr.value}" `;
        }
        debug += '\n';
      });
      
      // Look for image URLs in attributes
      const allElements = Array.from(item.getElementsByTagName('*'));
      const potentialImageUrls: string[] = [];
      
      for (const el of allElements) {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          if (attr.value && (
              attr.value.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ||
              attr.value.includes('image') || 
              attr.name.includes('image') ||
              attr.name === 'url' ||
              attr.name === 'href'
          )) {
            potentialImageUrls.push(`${el.nodeName}.${attr.name}: ${attr.value.substring(0, 100)}`);
          }
        }
      }
      
      if (potentialImageUrls.length > 0) {
        debug += `Potential image URLs (${potentialImageUrls.length}):\n`;
        potentialImageUrls.forEach(url => debug += `- ${url}\n`);
      }
      
      return debug;
    } catch (error) {
      return `Error analyzing RSS item: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  /**
   * Analyze a processed RSS feed for issues
   * @param items The processed RSS items
   * @param feedUrl The original feed URL
   */
  public static analyzeRssFeed(items: IRssItem[], feedUrl: string): string {
    if (!items || items.length === 0) {
      return `No items found in feed: ${feedUrl}`;
    }
    
    let debug = `Feed analysis for: ${feedUrl}\n`;
    debug += `Total items: ${items.length}\n`;
    
    // Count items with and without images
    const withImages = items.filter(item => !!item.imageUrl).length;
    const withoutImages = items.length - withImages;
    
    debug += `Items with images: ${withImages}\n`;
    debug += `Items without images: ${withoutImages}\n\n`;
    
    // Show sample items
    debug += 'Sample items:\n';
    const sampleSize = Math.min(3, items.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const item = items[i];
      debug += `\nItem #${i + 1}:\n`;
      debug += `- Title: ${item.title}\n`;
      debug += `- Image: ${item.imageUrl || '(none)'}\n`;
      debug += `- Description: ${item.description ? item.description.substring(0, 100) + '...' : '(none)'}\n`;
    }
    
    return debug;
  }
  
  /**
   * Create a debug console
   * Only appears when debug mode is enabled
   */
  public static createDebugConsole(container: HTMLElement): void {
    if (!this.isDebugMode) return;
    
    const consoleDiv = document.createElement('div');
    consoleDiv.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 400px; 
      height: 300px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      overflow: auto;
      z-index: 9999;
      border: 1px solid #333;
    `;
    consoleDiv.id = 'rss-debug-console';
    
    const titleBar = document.createElement('div');
    titleBar.textContent = 'RSS Debug Console';
    titleBar.style.cssText = `
      font-weight: bold;
      padding-bottom: 5px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 8px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 2px 5px;
      background: #333;
      color: white;
      border: none;
      cursor: pointer;
    `;
    closeButton.onclick = () => {
      consoleDiv.remove();
    };
    
    const logContainer = document.createElement('div');
    logContainer.id = 'rss-debug-logs';
    logContainer.style.cssText = `
      height: calc(100% - 30px);
      overflow: auto;
      word-wrap: break-word;
    `;
    
    titleBar.appendChild(closeButton);
    consoleDiv.appendChild(titleBar);
    consoleDiv.appendChild(logContainer);
    container.appendChild(consoleDiv);
  }
  
  /**
   * Log a message to the debug console
   * @param message The message to log
   */
  public static logToDebugConsole(message: string): void {
    if (!this.isDebugMode) return;
    
    const logContainer = document.getElementById('rss-debug-logs');
    if (!logContainer) return;
    
    const logEntry = document.createElement('div');
    logEntry.style.cssText = `
      margin-bottom: 4px;
      border-bottom: 1px dotted #333;
      padding-bottom: 4px;
    `;
    
    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `<span style="color:#aaa">[${timestamp}]</span> ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}
