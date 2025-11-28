/**
 * Custom Property Pane Proxy Configuration Control
 *
 * Provides proxy URL configuration with connection testing.
 */
import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
/**
 * Props for the proxy config control
 */
export interface IPropertyPaneProxyConfigProps {
    key: string;
    label: string;
    description?: string;
    placeholder?: string;
    value: string;
    strings: {
        testConnection: string;
        testing: string;
        success: string;
        failed: string;
        helpLink: string;
    };
    helpUrl?: string;
    onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => void;
}
/**
 * Factory function to create the property pane proxy config control
 */
export declare function PropertyPaneProxyConfig(props: IPropertyPaneProxyConfigProps): IPropertyPaneField<IPropertyPaneCustomFieldProps>;
//# sourceMappingURL=PropertyPaneProxyConfig.d.ts.map