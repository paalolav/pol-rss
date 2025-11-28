/**
 * Custom Property Pane Preset Picker Control
 *
 * Allows users to select from predefined configuration templates.
 */
import { PropertyPaneFieldType } from '@microsoft/sp-property-pane';
import { presets } from './presets';
/**
 * Custom property pane field for preset selection
 */
class PropertyPanePresetsField {
    constructor(props) {
        this.type = PropertyPaneFieldType.Custom;
        this._element = null;
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
    _onRender(element) {
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
                const presetKey = btn.dataset.preset;
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
    _onDispose() {
        this._element = null;
    }
    /**
     * Get icon for preset
     */
    _getPresetIcon(presetKey) {
        const icons = {
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
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    /**
     * Update selection state
     */
    _updateSelection(selectedPreset) {
        var _a;
        const buttons = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.ms-PropertyPanePresets-option');
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach(btn => {
            const isSelected = btn.dataset.preset === selectedPreset;
            btn.classList.toggle('selected', isSelected);
            btn.setAttribute('aria-pressed', String(isSelected));
            // Update checkmark
            const check = btn.querySelector('.ms-PropertyPanePresets-check');
            if (isSelected && !check) {
                const checkEl = document.createElement('i');
                checkEl.className = 'ms-Icon ms-Icon--CheckMark ms-PropertyPanePresets-check';
                btn.appendChild(checkEl);
            }
            else if (!isSelected && check) {
                check.remove();
            }
        });
    }
    /**
     * Add CSS styles
     */
    _addStyles() {
        const styleId = 'PropertyPanePresets-styles';
        if (document.getElementById(styleId))
            return;
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
export function PropertyPanePresets(props) {
    return new PropertyPanePresetsField(props);
}
//# sourceMappingURL=PropertyPanePresets.js.map