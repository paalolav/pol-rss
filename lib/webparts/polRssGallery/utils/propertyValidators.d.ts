/**
 * Input props for validateAll
 */
interface ValidateAllProps {
    feedUrl?: string;
    webPartTitle?: string;
    fallbackImageUrl?: string;
    filterKeywords?: string;
    maxItems?: number;
    refreshInterval?: number;
    interval?: number;
}
/**
 * Property validators for the RSS Feed web part
 */
export declare const PropertyValidators: {
    feedUrl(value: string): string | undefined;
    fallbackImageUrl(value: string): string | undefined;
    webPartTitle(value: string): string | undefined;
    filterKeywords(value: string): string | undefined;
    itemCount(value: number): string | undefined;
    refreshInterval(value: number): string | undefined;
    carouselInterval(value: number): string | undefined;
    sanitizeText(value: string): string;
    validateAll(props: ValidateAllProps): Record<string, string | undefined>;
    isAllValid(props: ValidateAllProps): boolean;
};
export default PropertyValidators;
//# sourceMappingURL=propertyValidators.d.ts.map