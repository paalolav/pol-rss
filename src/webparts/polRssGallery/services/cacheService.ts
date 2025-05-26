interface CacheItem<T> {
  data: T;
  timestamp: number;
  staleAfter: number;
}

interface CacheConfig {
  maxSize: number;  // Maximum number of items in cache
  defaultStaleAfter: number;  // Default time in milliseconds after which data is considered stale
  maxAge: number;  // Maximum age in milliseconds before item is removed from cache
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private config: CacheConfig;

  private constructor() {
    this.cache = new Map();
    this.config = {
      maxSize: 100,
      defaultStaleAfter: 5 * 60 * 1000, // 5 minutes
      maxAge: 60 * 60 * 1000 // 1 hour
    };
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    staleAfter: number = this.config.defaultStaleAfter
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // If we have cached data
    if (cached) {
      const age = now - cached.timestamp;
      
      // If data is not stale, return it immediately
      if (age < cached.staleAfter) {
        return cached.data as T;
      }

      // If data is stale but not expired, trigger background refresh and return stale data
      if (age < this.config.maxAge) {
        this.backgroundRefresh(key, fetchFn, staleAfter);
        return cached.data as T;
      }
    }

    // If no cache or data is expired, fetch fresh data
    return this.fetchAndCache(key, fetchFn, staleAfter);
  }

  private async backgroundRefresh<T>(
    key: string,
    fetchFn: () => Promise<T>,
    staleAfter: number
  ): Promise<void> {
    try {
      await this.fetchAndCache(key, fetchFn, staleAfter);
    } catch (error) {
      console.error(`Background refresh failed for key ${key}:`, error);
    }
  }

  private async fetchAndCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    staleAfter: number
  ): Promise<T> {
    const data = await fetchFn();
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleAfter
    });

    this.cleanup();
    return data;
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Remove expired items
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.maxAge) {
        this.cache.delete(key);
      }
    }

    // If still over size limit, remove oldest items
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.length - this.config.maxSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  public clear(): void {
    this.cache.clear();
  }

  /**
   * Delete a specific key from the cache
   * @param key The cache key to remove
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }
}