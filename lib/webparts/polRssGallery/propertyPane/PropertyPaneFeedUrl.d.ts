/**
 * Custom Property Pane Feed URL Control
 *
 * A text field with real-time URL validation and feed testing capabilities.
 */
import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
/**
 * Validation result for display
 */
export interface IFeedValidationResult {
    status: 'idle' | 'validating' | 'valid' | 'warning' | 'invalid';
    message?: string;
    feedTitle?: string;
    itemCount?: number;
    format?: string;
}
/**
 * Props for the feed URL field
 */
export interface IPropertyPaneFeedUrlProps {
    key: string;
    label: string;
    description?: string;
    placeholder?: string;
    value: string;
    onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => void;
    onValidationChange?: (result: IFeedValidationResult) => void;
    proxyUrl?: string;
}
/**
 * Factory function to create the property pane feed URL field
 */
export declare function PropertyPaneFeedUrl(props: IPropertyPaneFeedUrlProps): IPropertyPaneField<IPropertyPaneCustomFieldProps>;
//# sourceMappingURL=PropertyPaneFeedUrl.d.ts.map