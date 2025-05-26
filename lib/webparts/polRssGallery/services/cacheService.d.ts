interface CacheConfig {
    maxSize: number;
    defaultStaleAfter: number;
    maxAge: number;
}
export declare class CacheService {
    private static instance;
    private cache;
    private config;
    private constructor();
    static getInstance(): CacheService;
    get<T>(key: string, fetchFn: () => Promise<T>, staleAfter?: number): Promise<T>;
    private backgroundRefresh;
    private fetchAndCache;
    private cleanup;
    clear(): void;
    /**
     * Delete a specific key from the cache
     * @param key The cache key to remove
     */
    delete(key: string): boolean;
    setConfig(config: Partial<CacheConfig>): void;
}
export {};
//# sourceMappingURL=cacheService.d.ts.map