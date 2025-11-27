/**
 * Custom Property Pane Preset Picker Control
 *
 * Allows users to select from predefined configuration templates.
 */
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-property-pane';
import { presets } from './presets';

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
 * Custom property pane field for preset selection
 */
class PropertyPanePresetsField implements IPropertyPaneField<IPropertyPanePresetsProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneCustomFieldProps;

  private _props: IPropertyPanePresetsProps;
  private _element: HTMLElement | null = null;

  constructor(props: IPropertyPanePresetsProps) {
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

    const presetsHtml = presets.map(preset => {
      const isSelected = this._props.value === preset.key;
      const label = this._props.strings[preset.labelKey] || preset.key;
      const description = this._props.strings[preset.descriptionKey] || '';

      return `
        <button
          type="button"
          class="ms-PropertyPanePresets-option ${isSelected ? 'selected' : ''}"
          data-preset="${preset.key}"
          aria-pressed="${isSelected}"
        >
          <span class="ms-PropertyPanePresets-icon">${this._getPresetIcon(preset.key)}</span>
          <div class="ms-PropertyPanePresets-content">
            <span class="ms-PropertyPanePresets-label">${this._escapeHtml(label)}</span>
            <span class="ms-PropertyPanePresets-description">${this._escapeHtml(description)}</span>
          </div>
          ${isSelected ? '<i class="ms-Icon ms-Icon--CheckMark ms-PropertyPanePresets-check"></i>' : ''}
        </button>
      `;
    }).join('');

    element.innerHTML = `
      <div class="ms-PropertyPanePresets">
        <label class="ms-PropertyPanePresets-fieldLabel">${this._props.label}</label>
        <div class="ms-PropertyPanePresets-options">
          ${presetsHtml}
        </div>
      </div>
    `;

    // Add styles
    this._addStyles();

    // Wire up events
    const buttons = element.querySelectorAll('.ms-PropertyPanePresets-option');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = (btn as HTMLElement).dataset.preset;
        if (presetKey && presetKey !== this._props.value) {
          this._props.onPresetSelect(presetKey);
          this._updateSelection(presetKey);
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
   * Get icon for preset
   */
  private _getPresetIcon(presetKey: string): string {
    const icons: Record<string, string> = {
      'news-banner': '<i class="ms-Icon ms-Icon--PictureStretch"></i>',
      'blog-cards': '<i class="ms-Icon ms-Icon--GridViewSmall"></i>',
      'compact-list': '<i class="ms-Icon ms-Icon--BulletedList"></i>',
      'custom': '<i class="ms-Icon ms-Icon--Settings"></i>'
    };
    return icons[presetKey] || '<i class="ms-Icon ms-Icon--ViewAll"></i>';
  }

  /**
   * Escape HTML entities
   */
  private _escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Update selection state
   */
  private _updateSelection(selectedPreset: string): void {
    const buttons = this._element?.querySelectorAll('.ms-PropertyPanePresets-option');
    buttons?.forEach(btn => {
      const isSelected = (btn as HTMLElement).dataset.preset === selectedPreset;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));

      // Update checkmark
      const check = btn.querySelector('.ms-PropertyPanePresets-check');
      if (isSelected && !check) {
        const checkEl = document.createElement('i');
        checkEl.className = 'ms-Icon ms-Icon--CheckMark ms-PropertyPanePresets-check';
        btn.appendChild(checkEl);
      } else if (!isSelected && check) {
        check.remove();
      }
    });
  }

  /**
   * Add CSS styles
   */
  private _addStyles(): void {
    const styleId = 'PropertyPanePresets-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .ms-PropertyPanePresets {
        margin-bottom: 16px;
      }
      .ms-PropertyPanePresets-fieldLabel {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #323130;
        margin-bottom: 8px;
      }
      .ms-PropertyPanePresets-options {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ms-PropertyPanePresets-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border: 1px solid #d2d0ce;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        text-align: left;
        transition: all 0.15s ease;
        width: 100%;
      }
      .ms-PropertyPanePresets-option:hover {
        border-color: #0078d4;
        background: #f3f2f1;
      }
      .ms-PropertyPanePresets-option:focus {
        outline: 2px solid #0078d4;
        outline-offset: 2px;
      }
      .ms-PropertyPanePresets-option.selected {
        border-color: #0078d4;
        background: #deecf9;
      }
      .ms-PropertyPanePresets-icon {
        font-size: 20px;
        color: #605e5c;
        width: 24px;
        text-align: center;
      }
      .ms-PropertyPanePresets-option.selected .ms-PropertyPanePresets-icon {
        color: #0078d4;
      }
      .ms-PropertyPanePresets-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .ms-PropertyPanePresets-label {
        font-size: 14px;
        font-weight: 500;
        color: #323130;
      }
      .ms-PropertyPanePresets-description {
        font-size: 12px;
        color: #605e5c;
      }
      .ms-PropertyPanePresets-check {
        font-size: 16px;
        color: #0078d4;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Factory function to create the property pane presets picker
 */
export function PropertyPanePresets(props: IPropertyPanePresetsProps): IPropertyPaneField<IPropertyPanePresetsProps> {
  return new PropertyPanePresetsField(props);
}
