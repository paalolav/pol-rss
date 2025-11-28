/**
 * Custom Property Pane Layout Picker Control
 *
 * A visual layout selector with mini previews for each layout option.
 */
import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
/**
 * Layout types
 */
export type LayoutType = 'banner' | 'card' | 'list' | 'minimal' | 'gallery';
/**
 * Layout option definition
 */
export interface ILayoutOption {
    key: LayoutType;
    labelKey: string;
    descriptionKey: string;
    icon: string;
}
/**
 * Available layout options
 */
export declare const layoutOptions: ILayoutOption[];
/**
 * Props for the layout picker
 */
export interface IPropertyPaneLayoutPickerProps {
    key: string;
    label: string;
    value: LayoutType;
    options: Array<{
        key: string;
        text: string;
        description?: string;
    }>;
    onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => void;
}
/**
 * Factory function to create the property pane layout picker
 */
export declare function PropertyPaneLayoutPicker(props: IPropertyPaneLayoutPickerProps): IPropertyPaneField<IPropertyPaneCustomFieldProps>;
//# sourceMappingURL=PropertyPaneLayoutPicker.d.ts.map