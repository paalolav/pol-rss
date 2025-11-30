/**
 * Custom Property Pane Feed URL Control
 *
 * A text field with real-time URL validation and feed testing capabilities.
 */
import { PropertyPaneFieldType } from '@microsoft/sp-property-pane';
import { validateUrlFormat } from '../components/FeedValidator';
import { validateFeed } from '../services/feedValidator';
import { ImprovedFeedParser } from '../services/improvedFeedParser';
import { ProxyService } from '../services/proxyService';
/**
 * Custom property pane field for feed URL with validation
 */
class PropertyPaneFeedUrlField {
    constructor(props) {
        this.type = PropertyPaneFieldType.Custom;
        this._element = null;
        this._debounceTimer = null;
        this._props = props;
        this.targetProperty = props.key;
        this._state = {
            value: props.value || '',
            validationResult: { status: 'idle' },
            isValidating: false
        };
        this.properties = {
            key: props.key,
            onRender: this._onRender.bind(this),
            onDispose: this._onDispose.bind(this)
        };
    }
    /**
     * Render the control
     */
    _onRender(element, _context, _changeCallback) {
        this._element = element;
        // Create the control structure
        element.innerHTML = `
      <div class="ms-PropertyPaneFeedUrl">
        <label class="ms-PropertyPaneFeedUrl-label" for="feedUrl-${this._props.key}">${this._props.label}</label>
        <div class="ms-PropertyPaneFeedUrl-inputWrapper">
          <input
            type="url"
            id="feedUrl-${this._props.key}"
            class="ms-PropertyPaneFeedUrl-input"
            value="${this._escapeHtml(this._state.value)}"
            placeholder="${this._props.placeholder || ''}"
          />
          <button
            type="button"
            class="ms-PropertyPaneFeedUrl-testBtn"
            title="Test feed"
          >
            <i class="ms-Icon ms-Icon--TestBeaker"></i>
          </button>
        </div>
        ${this._props.description ? `<span class="ms-PropertyPaneFeedUrl-description">${this._props.description}</span>` : ''}
        <div class="ms-PropertyPaneFeedUrl-status"></div>
      </div>
    `;
        // Add styles
        this._addStyles();
        // Wire up events
        const input = element.querySelector('input');
        const testBtn = element.querySelector('.ms-PropertyPaneFeedUrl-testBtn');
        if (input) {
            input.addEventListener('input', (e) => {
                const newValue = e.target.value;
                this._state.value = newValue;
                this._props.onPropertyChange(this._props.key, this._props.value, newValue);
                // Validate URL format immediately
                this._validateUrlFormat(newValue);
                // Debounce full validation
                if (this._debounceTimer) {
                    clearTimeout(this._debounceTimer);
                }
            });
            input.addEventListener('blur', () => {
                // Validate on blur after debounce
                if (this._debounceTimer) {
                    clearTimeout(this._debounceTimer);
                }
                if (this._state.value && validateUrlFormat(this._state.value).isValid) {
                    this._debounceTimer = setTimeout(() => {
                        this._validateFeed();
                    }, 300);
                }
            });
        }
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this._validateFeed();
            });
        }
        // Initial validation if value exists
        if (this._state.value) {
            this._validateUrlFormat(this._state.value);
        }
    }
    /**
     * Clean up
     */
    _onDispose() {
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
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
     * Add CSS styles
     */
    _addStyles() {
        const styleId = 'PropertyPaneFeedUrl-styles';
        if (document.getElementById(styleId))
            return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .ms-PropertyPaneFeedUrl {
        margin-bottom: 12px;
      }
      .ms-PropertyPaneFeedUrl-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #323130;
        margin-bottom: 4px;
      }
      .ms-PropertyPaneFeedUrl-inputWrapper {
        display: flex;
        gap: 4px;
      }
      .ms-PropertyPaneFeedUrl-input {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid #8a8886;
        border-radius: 2px;
        font-size: 14px;
        outline: none;
      }
      .ms-PropertyPaneFeedUrl-input:focus {
        border-color: #0078d4;
      }
      .ms-PropertyPaneFeedUrl-input.error {
        border-color: #a4262c;
      }
      .ms-PropertyPaneFeedUrl-input.valid {
        border-color: #107c10;
      }
      .ms-PropertyPaneFeedUrl-testBtn {
        padding: 6px 12px;
        background: #0078d4;
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
      }
      .ms-PropertyPaneFeedUrl-testBtn:hover {
        background: #106ebe;
      }
      .ms-PropertyPaneFeedUrl-testBtn:disabled {
        background: #c8c8c8;
        cursor: not-allowed;
      }
      .ms-PropertyPaneFeedUrl-description {
        display: block;
        font-size: 12px;
        color: #605e5c;
        margin-top: 4px;
      }
      .ms-PropertyPaneFeedUrl-status {
        margin-top: 8px;
        padding: 8px;
        border-radius: 2px;
        font-size: 12px;
        display: none;
      }
      .ms-PropertyPaneFeedUrl-status.visible {
        display: block;
      }
      .ms-PropertyPaneFeedUrl-status.validating {
        background: #f3f2f1;
        color: #323130;
      }
      .ms-PropertyPaneFeedUrl-status.valid {
        background: #dff6dd;
        color: #107c10;
      }
      .ms-PropertyPaneFeedUrl-status.warning {
        background: #fff4ce;
        color: #797673;
      }
      .ms-PropertyPaneFeedUrl-status.invalid {
        background: #fde7e9;
        color: #a4262c;
      }
      .ms-PropertyPaneFeedUrl-feedInfo {
        font-weight: 600;
        margin-bottom: 4px;
      }
      .ms-PropertyPaneFeedUrl-feedMeta {
        font-size: 11px;
        opacity: 0.8;
      }
    `;
        document.head.appendChild(style);
    }
    /**
     * Validate URL format only
     */
    _validateUrlFormat(url) {
        var _a;
        const validation = validateUrlFormat(url);
        const input = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        if (input) {
            input.classList.remove('error', 'valid');
            if (!validation.isValid && url) {
                input.classList.add('error');
            }
        }
        // Update status only for format errors
        if (!validation.isValid && url) {
            this._updateStatus({
                status: 'invalid',
                message: validation.error
            });
        }
        else if (!url) {
            this._updateStatus({ status: 'idle' });
        }
    }
    /**
     * Validate the feed by fetching and parsing
     * Uses ProxyService for automatic CORS proxy fallback
     */
    async _validateFeed() {
        var _a, _b, _c;
        const url = this._state.value;
        if (!url)
            return;
        const validation = validateUrlFormat(url);
        if (!validation.isValid)
            return;
        this._updateStatus({ status: 'validating', message: 'Validating feed...' });
        const testBtn = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelector('.ms-PropertyPaneFeedUrl-testBtn');
        if (testBtn)
            testBtn.disabled = true;
        try {
            // Use ProxyService.fetch which handles CORS fallback automatically
            const response = await ProxyService.fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*'
                }
            });
            if (!response.ok) {
                this._updateStatus({
                    status: 'invalid',
                    message: `HTTP ${response.status}: ${response.statusText}`
                });
                return;
            }
            const content = await response.text();
            // Validate feed format
            const validationResult = validateFeed(content);
            if (!validationResult.isValid) {
                this._updateStatus({
                    status: 'invalid',
                    message: validationResult.errors.map(e => e.message).join('; ')
                });
                return;
            }
            // Parse to get details
            const parsedItems = ImprovedFeedParser.parse(content, { fallbackImageUrl: '' });
            const result = {
                status: 'valid',
                feedTitle: (_b = validationResult.metadata) === null || _b === void 0 ? void 0 : _b.title,
                itemCount: parsedItems.length,
                format: this._formatVersionString(validationResult.format, validationResult.formatVersion),
                message: undefined
            };
            this._updateStatus(result);
            const input = (_c = this._element) === null || _c === void 0 ? void 0 : _c.querySelector('input');
            if (input) {
                input.classList.remove('error');
                input.classList.add('valid');
            }
            if (this._props.onValidationChange) {
                this._props.onValidationChange(result);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to validate feed';
            this._updateStatus({
                status: 'invalid',
                message: message
            });
        }
        finally {
            if (testBtn)
                testBtn.disabled = false;
        }
    }
    /**
     * Update the status display
     * Uses safe DOM manipulation to prevent XSS attacks
     */
    _updateStatus(result) {
        var _a;
        this._state.validationResult = result;
        const statusEl = (_a = this._element) === null || _a === void 0 ? void 0 : _a.querySelector('.ms-PropertyPaneFeedUrl-status');
        if (!statusEl)
            return;
        // Reset classes and content
        statusEl.classList.remove('visible', 'validating', 'valid', 'warning', 'invalid');
        statusEl.innerHTML = '';
        if (result.status === 'idle') {
            return;
        }
        statusEl.classList.add('visible', result.status);
        // Build content safely using DOM APIs to prevent XSS
        switch (result.status) {
            case 'validating': {
                const icon = document.createElement('i');
                icon.className = 'ms-Icon ms-Icon--ProgressRingDots';
                statusEl.appendChild(icon);
                statusEl.appendChild(document.createTextNode(' Validating feed...'));
                break;
            }
            case 'valid': {
                const feedInfo = document.createElement('div');
                feedInfo.className = 'ms-PropertyPaneFeedUrl-feedInfo';
                const checkIcon = document.createElement('i');
                checkIcon.className = 'ms-Icon ms-Icon--CheckMark';
                feedInfo.appendChild(checkIcon);
                feedInfo.appendChild(document.createTextNode(' Feed is valid'));
                statusEl.appendChild(feedInfo);
                if (result.feedTitle) {
                    const titleDiv = document.createElement('div');
                    titleDiv.textContent = result.feedTitle;
                    statusEl.appendChild(titleDiv);
                }
                const metaDiv = document.createElement('div');
                metaDiv.className = 'ms-PropertyPaneFeedUrl-feedMeta';
                metaDiv.textContent = `${result.format || 'RSS'} \u2022 ${result.itemCount || 0} items`;
                statusEl.appendChild(metaDiv);
                break;
            }
            case 'warning': {
                const feedInfo = document.createElement('div');
                feedInfo.className = 'ms-PropertyPaneFeedUrl-feedInfo';
                const warnIcon = document.createElement('i');
                warnIcon.className = 'ms-Icon ms-Icon--Warning';
                feedInfo.appendChild(warnIcon);
                feedInfo.appendChild(document.createTextNode(` ${result.message || 'Feed has warnings'}`));
                statusEl.appendChild(feedInfo);
                if (result.feedTitle) {
                    const titleDiv = document.createElement('div');
                    titleDiv.textContent = result.feedTitle;
                    statusEl.appendChild(titleDiv);
                }
                const metaDiv = document.createElement('div');
                metaDiv.className = 'ms-PropertyPaneFeedUrl-feedMeta';
                metaDiv.textContent = `${result.format || 'RSS'} \u2022 ${result.itemCount || 0} items`;
                statusEl.appendChild(metaDiv);
                break;
            }
            case 'invalid': {
                const icon = document.createElement('i');
                icon.className = 'ms-Icon ms-Icon--ErrorBadge';
                statusEl.appendChild(icon);
                statusEl.appendChild(document.createTextNode(` ${result.message || 'Invalid feed'}`));
                break;
            }
        }
    }
    /**
     * Format feed version string for display
     */
    _formatVersionString(format, version) {
        const formatNames = {
            'rss1': 'RSS 1.0',
            'rss2': 'RSS 2.0',
            'atom': 'Atom',
            'json': 'JSON Feed'
        };
        const name = formatNames[format] || format.toUpperCase();
        return version ? `${name} ${version}` : name;
    }
}
/**
 * Factory function to create the property pane feed URL field
 */
export function PropertyPaneFeedUrl(props) {
    return new PropertyPaneFeedUrlField(props);
}
//# sourceMappingURL=PropertyPaneFeedUrl.js.map