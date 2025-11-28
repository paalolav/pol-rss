/**
 * Conditional Field Logic
 *
 * Determines which property pane fields should be shown based on
 * the current property values.
 */
import { IRssFeedWebPartProps } from '../RssFeedWebPart';
/**
 * Check if a property field should be visible based on dependencies
 */
export declare function shouldShowField(fieldKey: keyof IRssFeedWebPartProps | string, properties: IRssFeedWebPartProps): boolean;
/**
 * Check if a property group should be shown based on layout
 */
export declare function shouldShowGroup(groupKey: string, properties: IRssFeedWebPartProps): boolean;
/**
 * Check if a field should be disabled
 */
export declare function isFieldDisabled(fieldKey: keyof IRssFeedWebPartProps | string, properties: IRssFeedWebPartProps): boolean;
/**
 * Get all fields that depend on a specific property
 */
export declare function getDependentFields(propertyKey: keyof IRssFeedWebPartProps): string[];
//# sourceMappingURL=conditionalFields.d.ts.map