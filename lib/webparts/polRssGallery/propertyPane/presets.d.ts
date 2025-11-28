/**
 * Property Pane Preset Templates
 *
 * Predefined configurations for common use cases.
 */
import { IRssFeedWebPartProps } from '../RssFeedWebPart';
/**
 * Preset template definition
 */
export interface IPreset {
    key: string;
    labelKey: string;
    descriptionKey: string;
    config: Partial<IRssFeedWebPartProps>;
}
/**
 * Available preset templates
 */
export declare const presets: IPreset[];
/**
 * Get preset by key
 */
export declare function getPreset(key: string): IPreset | undefined;
/**
 * Apply preset configuration to properties
 */
export declare function applyPreset(currentProps: IRssFeedWebPartProps, presetKey: string): Partial<IRssFeedWebPartProps>;
/**
 * Detect which preset matches the current configuration (if any)
 */
export declare function detectCurrentPreset(props: IRssFeedWebPartProps): string;
//# sourceMappingURL=presets.d.ts.map