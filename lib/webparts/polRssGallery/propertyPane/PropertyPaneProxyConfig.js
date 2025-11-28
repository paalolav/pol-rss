/**
 * Custom Property Pane Proxy Configuration Control
 *
 * Provides proxy URL configuration with connection testing.
 */
import { PropertyPaneFieldType } from '@microsoft/sp-property-pane';
/**
 * Custom property pane field for proxy configuration
 */
class PropertyPaneProxyConfigField {
    constructor(props) {
        this.type = PropertyPaneFieldType.Custom;
        this._element = null;
        this._isTesting = false;
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
        element.innerHTML = `
      <div class="ms-PropertyPaneProxyConfig">
        <label class="ms-PropertyPaneProxyConfig-label" for="proxyUrl-${this._props.key}">${this._props.label}</label>
        <div class="ms-PropertyPaneProxyConfig-inputWrapper">
          <input
            type="url"
            id="proxyUrl-${this._props.key}"
            class="ms-PropertyPaneProxyConfig-input"
            value="${this._escapeHtml(this._props.value || '')}"
            placeholder="${this._props.placeholder || ''}"
          />
        </div>
        ${this._props.description ? `<span class="ms-PropertyPaneProxyConfig-description">${this._props.description}</span>` : ''}
        <div class="ms-PropertyPaneProxyConfig-actions">
          <button
            type="button"
            class="ms-PropertyPaneProxyConfig-testBtn"
            ${!this._props.value ? 'disabled' : ''}
          >
            <i class="ms-Icon ms-Icon--PlugConnected"></i>
            <span class="ms-PropertyPaneProxyConfig-testBtnText">${this._props.strings.testConnection}</span>
          </button>
          ${this._props.helpUrl ? `
            <a href="${this._props.helpUrl}" target="_blank" rel="noopener" class="ms-PropertyPaneProxyConfig-helpLink">
              <i class="ms-Icon ms-Icon--Help"></i>
              ${this._props.strings.helpLink}
            </a>
          ` : ''}
        </div>
        <div class="ms-PropertyPaneProxyConfig-status"></div>
      </div>
    `;
        // Add styles
        this._addStyles();
        // Wire up events
        const input = element.querySelector('input');
        const testBtn = element.querySelector('.ms-PropertyPaneProxyConfig-testBtn');
        if (input) {
            input.addEventListener('input', (e) => {
                const newValue = e.target.value;
                this._props.onPropertyChange(this._props.key, this._props.value, newValue);
                // Enable/disable test button
                if (testBtn) {
                    testBtn.disabled = !newValue;
                }
                // Clear status
                this._updateStatus('');
            });
        }
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this._testConnection();
            });
        }
    }
    /**
     * Clean up
     */
    _onDispose() {
        this._element = null;
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
     * Test the proxy connection
     */
    async _testConnection() {
        var _a, _b, _c;
        const input = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        const url = input === null || input === void 0 ? void 0 : input.value;
        if (!url || this._isTesting)
            return;
        this._isTesting = true;
        const testBtn = (_b = this._element) === null || _b === void 0 ? void 0 : _b.querySelector('.ms-PropertyPaneProxyConfig-testBtn');
        const testBtnText = (_c = this._element) === null || _c === void 0 ? void 0 : _c.querySelector('.ms-PropertyPaneProxyConfig-testBtnText');
        if (testBtn)
            testBtn.disabled = true;
        if (testBtnText)
            testBtnText.textContent = this._props.strings.testing;
        this._updateStatus('testing', this._props.strings.testing);
        try {
            // Test by calling the proxy health endpoint
            const healthUrl = url.includes('?') ? url : `${url.replace(/\/+$/, '')}/health`;
            const testUrl = url.includes('health') ? url : healthUrl;
            const response = await fetch(testUrl, {
                method: 'GET',
                mode: 'cors'
            });
            if (response.ok) {
                this._updateStatus('success', this._props.strings.success);
            }
            else {
                // Try the proxy with a test URL
                const proxyTestUrl = `${url}${url.includes('?') ? '&' : '?'}url=${encodeURIComponent('https://www.nrk.no/toppsaker.rss')}`;
                const proxyResponse = await fetch(proxyTestUrl);
                if (proxyResponse.ok) {
                    this._updateStatus('success', this._props.strings.success);
                }
                else {
                    this._updateStatus('failed', `${this._props.strings.failed} (HTTP ${proxyResponse.status})`);
                }
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this._updateStatus('failed', `${this._props.strings.failed}: ${message}`);
        }
        finally {
            this._isTesting = false;
            if (testBtn)
                testBtn.disabled = false;
            if (testBtnText)
                testBtnText.textContent = this._props.strings.testConnection;
        }
    }
    /**
     * Update status display
     */
    _updateStatus(status, message) {
        var _a;
        const statusEl = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelector('.ms-PropertyPaneProxyConfig-status');
        if (!statusEl)
            return;
        statusEl.className = 'ms-PropertyPaneProxyConfig-status';
        if (!status || !message) {
            statusEl.innerHTML = '';
            return;
        }
        statusEl.classList.add(status);
        const icons = {
            testing: 'ProgressRingDots',
            success: 'CheckMark',
            failed: 'ErrorBadge'
        };
        statusEl.innerHTML = `
      <i class="ms-Icon ms-Icon--${icons[status] || 'Info'}"></i>
      <span>${this._escapeHtml(message)}</span>
    `;
    }
    /**
     * Add CSS styles
     */
    _addStyles() {
        const styleId = 'PropertyPaneProxyConfig-styles';
        if (document.getElementById(styleId))
            return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .ms-PropertyPaneProxyConfig {
        margin-bottom: 12px;
      }
      .ms-PropertyPaneProxyConfig-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #323130;
        margin-bottom: 4px;
      }
      .ms-PropertyPaneProxyConfig-inputWrapper {
        margin-bottom: 4px;
      }
      .ms-PropertyPaneProxyConfig-input {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #8a8886;
        border-radius: 2px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
      }
      .ms-PropertyPaneProxyConfig-input:focus {
        border-color: #0078d4;
      }
      .ms-PropertyPaneProxyConfig-description {
        display: block;
        font-size: 12px;
        color: #605e5c;
        margin-bottom: 8px;
      }
      .ms-PropertyPaneProxyConfig-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .ms-PropertyPaneProxyConfig-testBtn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #0078d4;
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        font-size: 13px;
      }
      .ms-PropertyPaneProxyConfig-testBtn:hover {
        background: #106ebe;
      }
      .ms-PropertyPaneProxyConfig-testBtn:disabled {
        background: #c8c8c8;
        cursor: not-allowed;
      }
      .ms-PropertyPaneProxyConfig-helpLink {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #0078d4;
        text-decoration: none;
      }
      .ms-PropertyPaneProxyConfig-helpLink:hover {
        text-decoration: underline;
      }
      .ms-PropertyPaneProxyConfig-status {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        padding: 8px;
        border-radius: 2px;
        font-size: 12px;
      }
      .ms-PropertyPaneProxyConfig-status:empty {
        display: none;
      }
      .ms-PropertyPaneProxyConfig-status.testing {
        background: #f3f2f1;
        color: #323130;
      }
      .ms-PropertyPaneProxyConfig-status.success {
        background: #dff6dd;
        color: #107c10;
      }
      .ms-PropertyPaneProxyConfig-status.failed {
        background: #fde7e9;
        color: #a4262c;
      }
    `;
        document.head.appendChild(style);
    }
}
/**
 * Factory function to create the property pane proxy config control
 */
export function PropertyPaneProxyConfig(props) {
    return new PropertyPaneProxyConfigField(props);
}
//# sourceMappingURL=PropertyPaneProxyConfig.js.map