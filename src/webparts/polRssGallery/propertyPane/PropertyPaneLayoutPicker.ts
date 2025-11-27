/**
 * Custom Property Pane Layout Picker Control
 *
 * A visual layout selector with mini previews for each layout option.
 */
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-property-pane';

/**
 * Layout option definition
 */
export interface ILayoutOption {
  key: 'banner' | 'card' | 'list';
  labelKey: string;
  descriptionKey: string;
  icon: string;
}

/**
 * Available layout options
 */
export const layoutOptions: ILayoutOption[] = [
  {
    key: 'banner',
    labelKey: 'LayoutBannerLabel',
    descriptionKey: 'LayoutBannerDescription',
    icon: 'PictureStretch'
  },
  {
    key: 'card',
    labelKey: 'LayoutCardLabel',
    descriptionKey: 'LayoutCardDescription',
    icon: 'GridViewSmall'
  },
  {
    key: 'list',
    labelKey: 'LayoutListLabel',
    descriptionKey: 'LayoutListDescription',
    icon: 'BulletedList'
  }
];

/**
 * Props for the layout picker
 */
export interface IPropertyPaneLayoutPickerProps {
  key: string;
  label: string;
  value: 'banner' | 'card' | 'list';
  options: Array<{ key: string; text: string; description?: string }>;
  onPropertyChange: (propertyPath: string, oldValue: string, newValue: string) => void;
}

/**
 * Custom property pane field for layout selection with visual previews
 */
class PropertyPaneLayoutPickerField implements IPropertyPaneField<IPropertyPaneLayoutPickerProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneCustomFieldProps;

  private _props: IPropertyPaneLayoutPickerProps;
  private _element: HTMLElement | null = null;

  constructor(props: IPropertyPaneLayoutPickerProps) {
    this._props = props;
    this.targetProperty = props.key;

    this.properties = {
      key: props.key,
      onRender: this._onRender.bind(this),
      onDispose: this._onDispose.bind(this)
    };
  }

  /**
   * Render the control
   */
  private _onRender(element: HTMLElement): void {
    this._element = element;

    // Create the control structure
    const optionsHtml = this._props.options.map(option => {
      const iconName = this._getIconForLayout(option.key);
      const previewSvg = this._getPreviewSvg(option.key);
      const isSelected = this._props.value === option.key;

      return `
        <button
          type="button"
          class="ms-PropertyPaneLayoutPicker-option ${isSelected ? 'selected' : ''}"
          data-layout="${option.key}"
          aria-pressed="${isSelected}"
          title="${option.description || option.text}"
        >
          <div class="ms-PropertyPaneLayoutPicker-preview">
            ${previewSvg}
          </div>
          <div class="ms-PropertyPaneLayoutPicker-icon">
            <i class="ms-Icon ms-Icon--${iconName}"></i>
          </div>
          <span class="ms-PropertyPaneLayoutPicker-label">${option.text}</span>
        </button>
      `;
    }).join('');

    element.innerHTML = `
      <div class="ms-PropertyPaneLayoutPicker">
        <label class="ms-PropertyPaneLayoutPicker-fieldLabel">${this._props.label}</label>
        <div class="ms-PropertyPaneLayoutPicker-options" role="radiogroup" aria-label="${this._props.label}">
          ${optionsHtml}
        </div>
      </div>
    `;

    // Add styles
    this._addStyles();

    // Wire up events
    const buttons = element.querySelectorAll('.ms-PropertyPaneLayoutPicker-option');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const layout = target.dataset.layout as 'banner' | 'card' | 'list';
        if (layout && layout !== this._props.value) {
          this._props.onPropertyChange(this._props.key, this._props.value, layout);
          this._updateSelection(layout);
        }
      });

      // Keyboard navigation
      btn.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'ArrowRight' || keyEvent.key === 'ArrowDown') {
          e.preventDefault();
          const next = (btn.nextElementSibling || buttons[0]) as HTMLElement;
          next.focus();
          next.click();
        } else if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (btn.previousElementSibling || buttons[buttons.length - 1]) as HTMLElement;
          prev.focus();
          prev.click();
        }
      });
    });
  }

  /**
   * Clean up
   */
  private _onDispose(): void {
    this._element = null;
  }

  /**
   * Get icon name for layout
   */
  private _getIconForLayout(layoutKey: string): string {
    const icons: Record<string, string> = {
      'banner': 'PictureStretch',
      'card': 'GridViewSmall',
      'list': 'BulletedList'
    };
    return icons[layoutKey] || 'ViewAll';
  }

  /**
   * Get SVG preview for layout
   */
  private _getPreviewSvg(layoutKey: string): string {
    const svgs: Record<string, string> = {
      'banner': `
        <svg viewBox="0 0 60 40" fill="currentColor">
          <rect x="2" y="4" width="56" height="32" rx="2" fill="#f3f2f1" stroke="#d2d0ce" stroke-width="1"/>
          <rect x="6" y="8" width="48" height="20" rx="1" fill="#d2d0ce"/>
          <rect x="6" y="30" width="30" height="3" rx="1" fill="#8a8886"/>
          <circle cx="50" cy="17" r="4" fill="#8a8886"/>
          <circle cx="54" cy="17" r="1.5" fill="#c8c6c4"/>
          <circle cx="46" cy="17" r="1.5" fill="#c8c6c4"/>
        </svg>
      `,
      'card': `
        <svg viewBox="0 0 60 40" fill="currentColor">
          <rect x="2" y="2" width="26" height="17" rx="2" fill="#f3f2f1" stroke="#d2d0ce" stroke-width="1"/>
          <rect x="4" y="4" width="22" height="9" rx="1" fill="#d2d0ce"/>
          <rect x="4" y="14" width="14" height="2" rx="1" fill="#8a8886"/>
          <rect x="32" y="2" width="26" height="17" rx="2" fill="#f3f2f1" stroke="#d2d0ce" stroke-width="1"/>
          <rect x="34" y="4" width="22" height="9" rx="1" fill="#d2d0ce"/>
          <rect x="34" y="14" width="14" height="2" rx="1" fill="#8a8886"/>
          <rect x="2" y="21" width="26" height="17" rx="2" fill="#f3f2f1" stroke="#d2d0ce" stroke-width="1"/>
          <rect x="4" y="23" width="22" height="9" rx="1" fill="#d2d0ce"/>
          <rect x="4" y="33" width="14" height="2" rx="1" fill="#8a8886"/>
          <rect x="32" y="21" width="26" height="17" rx="2" fill="#f3f2f1" stroke="#d2d0ce" stroke-width="1"/>
          <rect x="34" y="23" width="22" height="9" rx="1" fill="#d2d0ce"/>
          <rect x="34" y="33" width="14" height="2" rx="1" fill="#8a8886"/>
        </svg>
      `,
      'list': `
        <svg viewBox="0 0 60 40" fill="currentColor">
          <rect x="2" y="2" width="10" height="10" rx="2" fill="#d2d0ce"/>
          <rect x="15" y="3" width="28" height="3" rx="1" fill="#8a8886"/>
          <rect x="15" y="8" width="40" height="2" rx="1" fill="#c8c6c4"/>
          <rect x="2" y="15" width="10" height="10" rx="2" fill="#d2d0ce"/>
          <rect x="15" y="16" width="28" height="3" rx="1" fill="#8a8886"/>
          <rect x="15" y="21" width="40" height="2" rx="1" fill="#c8c6c4"/>
          <rect x="2" y="28" width="10" height="10" rx="2" fill="#d2d0ce"/>
          <rect x="15" y="29" width="28" height="3" rx="1" fill="#8a8886"/>
          <rect x="15" y="34" width="40" height="2" rx="1" fill="#c8c6c4"/>
        </svg>
      `
    };
    return svgs[layoutKey] || '';
  }

  /**
   * Update selection state
   */
  private _updateSelection(selectedLayout: string): void {
    const buttons = this._element?.querySelectorAll('.ms-PropertyPaneLayoutPicker-option');
    buttons?.forEach(btn => {
      const isSelected = (btn as HTMLElement).dataset.layout === selectedLayout;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  }

  /**
   * Add CSS styles
   */
  private _addStyles(): void {
    const styleId = 'PropertyPaneLayoutPicker-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .ms-PropertyPaneLayoutPicker {
        margin-bottom: 12px;
      }
      .ms-PropertyPaneLayoutPicker-fieldLabel {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #323130;
        margin-bottom: 8px;
      }
      .ms-PropertyPaneLayoutPicker-options {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ms-PropertyPaneLayoutPicker-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px;
        border: 2px solid #d2d0ce;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        transition: all 0.15s ease;
        min-width: 80px;
      }
      .ms-PropertyPaneLayoutPicker-option:hover {
        border-color: #0078d4;
        background: #f3f2f1;
      }
      .ms-PropertyPaneLayoutPicker-option:focus {
        outline: 2px solid #0078d4;
        outline-offset: 2px;
      }
      .ms-PropertyPaneLayoutPicker-option.selected {
        border-color: #0078d4;
        background: #deecf9;
      }
      .ms-PropertyPaneLayoutPicker-preview {
        width: 60px;
        height: 40px;
        color: #323130;
      }
      .ms-PropertyPaneLayoutPicker-preview svg {
        width: 100%;
        height: 100%;
      }
      .ms-PropertyPaneLayoutPicker-option.selected .ms-PropertyPaneLayoutPicker-preview {
        color: #0078d4;
      }
      .ms-PropertyPaneLayoutPicker-icon {
        font-size: 16px;
        color: #605e5c;
      }
      .ms-PropertyPaneLayoutPicker-option.selected .ms-PropertyPaneLayoutPicker-icon {
        color: #0078d4;
      }
      .ms-PropertyPaneLayoutPicker-label {
        font-size: 12px;
        color: #323130;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Factory function to create the property pane layout picker
 */
export function PropertyPaneLayoutPicker(props: IPropertyPaneLayoutPickerProps): IPropertyPaneField<IPropertyPaneLayoutPickerProps> {
  return new PropertyPaneLayoutPickerField(props);
}
