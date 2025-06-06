/// <reference types="react" />
export declare function getImageSrc(imageUrl?: string, fallbackImageUrl?: string, forceFallback?: boolean): string;
export declare function imgError(e: React.SyntheticEvent<HTMLImageElement>, fallbackImageUrl?: string): void;
export declare function cleanDescription(raw: string, max?: number): string;
export declare function resolveImageUrl(rawUrl?: string): string | undefined;
export declare function findImage(item: Element): string | undefined;
//# sourceMappingURL=rssUtils.d.ts.map