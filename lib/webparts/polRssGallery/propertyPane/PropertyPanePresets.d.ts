/**
 * Custom Property Pane Preset Picker Control
 *
 * Allows users to select from predefined configuration templates.
 */
import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
/**
 * Props for the preset picker
 */
export interface IPropertyPanePresetsProps {
    key: string;
    label: string;
    value: string;
    strings: {
        [key: string]: string;
    };
    onPresetSelect: (presetKey: string) => void;
}
/**
 * Factory function to create the property pane presets picker
 */
export declare function PropertyPanePresets(props: IPropertyPanePresetsProps): IPropertyPaneField<IPropertyPaneCustomFieldProps>;
//# sourceMappingURL=PropertyPanePresets.d.ts.map