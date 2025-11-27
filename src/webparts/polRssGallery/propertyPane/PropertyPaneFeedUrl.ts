/**
 * Custom Property Pane Feed URL Control
 *
 * A text field with real-time URL validation and feed testing capabilities.
 */
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-property-pane';
import { validateUrlFormat } from '../components/FeedValidator';
import { validateFeed } from '../services/feedValidator';
import { ImprovedFeedParser } from '../services/improvedFeedParser';

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
 * Internal state for the control
 */
interface IFeedUrlControlState {
  value: string;
  validationResult: IFeedValidationResult;
  isValidating: boolean;
}

/**
 * Custom property pane field for feed URL with validation
 */
class PropertyPaneFeedUrlField implements IPropertyPaneField<IPropertyPaneFeedUrlProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneCustomFieldProps;

  private _props: IPropertyPaneFeedUrlProps;
  private _state: IFeedUrlControlState;
  private _element: HTMLElement | null = null;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: IPropertyPaneFeedUrlProps) {
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
  private _onRender(element: HTMLElement, _context: unknown, _changeCallback: (targetProperty: string, value: unknown) => void): void {
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
    const input = element.querySelector('input') as HTMLInputElement;
    const testBtn = element.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;

    if (input) {
      input.addEventListener('input', (e) => {
        const newValue = (e.target as HTMLInputElement).value;
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
  private _onDispose(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._element = null;
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
   * Add CSS styles
   */
  private _addStyles(): void {
    const styleId = 'PropertyPaneFeedUrl-styles';
    if (document.getElementById(styleId)) return;

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
  private _validateUrlFormat(url: string): void {
    const validation = validateUrlFormat(url);
    const input = this._element?.querySelector('input');

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
    } else if (!url) {
      this._updateStatus({ status: 'idle' });
    }
  }

  /**
   * Validate the feed by fetching and parsing
   */
  private async _validateFeed(): Promise<void> {
    const url = this._state.value;
    if (!url) return;

    const validation = validateUrlFormat(url);
    if (!validation.isValid) return;

    this._updateStatus({ status: 'validating', message: 'Validating feed...' });

    const testBtn = this._element?.querySelector('.ms-PropertyPaneFeedUrl-testBtn') as HTMLButtonElement;
    if (testBtn) testBtn.disabled = true;

    try {
      // Try to fetch the feed
      let response: Response;
      let usedProxy = false;

      try {
        response = await fetch(url, { mode: 'cors' });
      } catch (corsError) {
        // If CORS fails and we have a proxy, try that
        if (this._props.proxyUrl) {
          const proxyFullUrl = `${this._props.proxyUrl}?url=${encodeURIComponent(url)}`;
          response = await fetch(proxyFullUrl);
          usedProxy = true;
        } else {
          throw corsError;
        }
      }

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
      const parser = new ImprovedFeedParser();
      const parseResult = parser.parse(content);

      const result: IFeedValidationResult = {
        status: usedProxy ? 'warning' : 'valid',
        feedTitle: parseResult.title || validationResult.metadata?.title,
        itemCount: parseResult.items.length,
        format: this._formatVersionString(validationResult.format, validationResult.formatVersion),
        message: usedProxy ? 'Feed requires proxy (CORS)' : undefined
      };

      this._updateStatus(result);

      const input = this._element?.querySelector('input');
      if (input) {
        input.classList.remove('error');
        input.classList.add('valid');
      }

      if (this._props.onValidationChange) {
        this._props.onValidationChange(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to validate feed';
      this._updateStatus({
        status: 'invalid',
        message: message.includes('CORS') || message.includes('NetworkError')
          ? 'CORS error - try configuring a proxy URL'
          : message
      });
    } finally {
      if (testBtn) testBtn.disabled = false;
    }
  }

  /**
   * Update the status display
   */
  private _updateStatus(result: IFeedValidationResult): void {
    this._state.validationResult = result;

    const statusEl = this._element?.querySelector('.ms-PropertyPaneFeedUrl-status') as HTMLElement;
    if (!statusEl) return;

    // Reset classes
    statusEl.classList.remove('visible', 'validating', 'valid', 'warning', 'invalid');

    if (result.status === 'idle') {
      return;
    }

    statusEl.classList.add('visible', result.status);

    let content = '';

    switch (result.status) {
      case 'validating':
        content = '<i class="ms-Icon ms-Icon--ProgressRingDots"></i> Validating feed...';
        break;
      case 'valid':
        content = `
          <div class="ms-PropertyPaneFeedUrl-feedInfo">
            <i class="ms-Icon ms-Icon--CheckMark"></i> Feed is valid
          </div>
          ${result.feedTitle ? `<div>${this._escapeHtml(result.feedTitle)}</div>` : ''}
          <div class="ms-PropertyPaneFeedUrl-feedMeta">${result.format || 'RSS'} &bull; ${result.itemCount || 0} items</div>
        `;
        break;
      case 'warning':
        content = `
          <div class="ms-PropertyPaneFeedUrl-feedInfo">
            <i class="ms-Icon ms-Icon--Warning"></i> ${result.message || 'Feed has warnings'}
          </div>
          ${result.feedTitle ? `<div>${this._escapeHtml(result.feedTitle)}</div>` : ''}
          <div class="ms-PropertyPaneFeedUrl-feedMeta">${result.format || 'RSS'} &bull; ${result.itemCount || 0} items</div>
        `;
        break;
      case 'invalid':
        content = `<i class="ms-Icon ms-Icon--ErrorBadge"></i> ${result.message || 'Invalid feed'}`;
        break;
    }

    statusEl.innerHTML = content;
  }

  /**
   * Format feed version string for display
   */
  private _formatVersionString(format: string, version?: string): string {
    const formatNames: Record<string, string> = {
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
export function PropertyPaneFeedUrl(props: IPropertyPaneFeedUrlProps): IPropertyPaneField<IPropertyPaneFeedUrlProps> {
  return new PropertyPaneFeedUrlField(props);
}
