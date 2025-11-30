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
     * Uses safe DOM manipulation to prevent XSS attacks
     */
    _onRender(element) {
        this._element = element;
        // Build DOM safely to prevent XSS
        const container = document.createElement('div');
        container.className = 'ms-PropertyPaneProxyConfig';
        // Label
        const label = document.createElement('label');
        label.className = 'ms-PropertyPaneProxyConfig-label';
        label.setAttribute('for', `proxyUrl-${this._props.key}`);
        label.textContent = this._props.label;
        container.appendChild(label);
        // Input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'ms-PropertyPaneProxyConfig-inputWrapper';
        const input = document.createElement('input');
        input.type = 'url';
        input.id = `proxyUrl-${this._props.key}`;
        input.className = 'ms-PropertyPaneProxyConfig-input';
        input.value = this._props.value || '';
        if (this._props.placeholder) {
            input.placeholder = this._props.placeholder;
        }
        inputWrapper.appendChild(input);
        container.appendChild(inputWrapper);
        // Description (optional)
        if (this._props.description) {
            const description = document.createElement('span');
            description.className = 'ms-PropertyPaneProxyConfig-description';
            description.textContent = this._props.description;
            container.appendChild(description);
        }
        // Actions
        const actions = document.createElement('div');
        actions.className = 'ms-PropertyPaneProxyConfig-actions';
        // Test button
        const testBtn = document.createElement('button');
        testBtn.type = 'button';
        testBtn.className = 'ms-PropertyPaneProxyConfig-testBtn';
        testBtn.disabled = !this._props.value;
        const plugIcon = document.createElement('i');
        plugIcon.className = 'ms-Icon ms-Icon--PlugConnected';
        testBtn.appendChild(plugIcon);
        const testBtnText = document.createElement('span');
        testBtnText.className = 'ms-PropertyPaneProxyConfig-testBtnText';
        testBtnText.textContent = this._props.strings.testConnection;
        testBtn.appendChild(testBtnText);
        actions.appendChild(testBtn);
        // Help link (optional)
        if (this._props.helpUrl) {
            const helpLink = document.createElement('a');
            helpLink.href = this._props.helpUrl;
            helpLink.target = '_blank';
            helpLink.rel = 'noopener';
            helpLink.className = 'ms-PropertyPaneProxyConfig-helpLink';
            const helpIcon = document.createElement('i');
            helpIcon.className = 'ms-Icon ms-Icon--Help';
            helpLink.appendChild(helpIcon);
            helpLink.appendChild(document.createTextNode(` ${this._props.strings.helpLink}`));
            actions.appendChild(helpLink);
        }
        container.appendChild(actions);
        // Status
        const status = document.createElement('div');
        status.className = 'ms-PropertyPaneProxyConfig-status';
        container.appendChild(status);
        // Clear and append
        element.innerHTML = '';
        element.appendChild(container);
        // Add styles
        this._addStyles();
        // Wire up events (use the elements we created above, not querySelector)
        input.addEventListener('input', (e) => {
            const newValue = e.target.value;
            this._props.onPropertyChange(this._props.key, this._props.value, newValue);
            // Enable/disable test button
            testBtn.disabled = !newValue;
            // Clear status
            this._updateStatus('');
        });
        testBtn.addEventListener('click', () => {
            this._testConnection();
        });
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