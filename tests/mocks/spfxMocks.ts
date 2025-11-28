/**
 * SPFx Mocks
 *
 * Mock implementations for SharePoint Framework context objects.
 * These mocks allow testing SPFx webparts without a SharePoint environment.
 */

import { HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

// Types for mocks
export interface MockWebPartContext {
  pageContext: MockPageContext;
  spHttpClient: MockSPHttpClient;
  httpClient: MockHttpClient;
  instanceId: string;
  domElement: HTMLElement;
}

export interface MockPageContext {
  web: {
    title: string;
    absoluteUrl: string;
    serverRelativeUrl: string;
    id: string;
  };
  site: {
    absoluteUrl: string;
    serverRelativeUrl: string;
    id: string;
  };
  user: {
    displayName: string;
    email: string;
    loginName: string;
  };
  cultureInfo: {
    currentCultureName: string;
    currentUICultureName: string;
  };
}

export interface MockSPHttpClient {
  get: jest.Mock;
  post: jest.Mock;
  fetch: jest.Mock;
}

export interface MockHttpClient {
  get: jest.Mock;
  post: jest.Mock;
  fetch: jest.Mock;
}

/**
 * Create a mock PageContext
 */
export const createMockPageContext = (overrides?: Partial<MockPageContext>): MockPageContext => ({
  web: {
    title: 'Test Site',
    absoluteUrl: 'https://contoso.sharepoint.com/sites/test',
    serverRelativeUrl: '/sites/test',
    id: 'web-guid-1234',
    ...overrides?.web,
  },
  site: {
    absoluteUrl: 'https://contoso.sharepoint.com/sites/test',
    serverRelativeUrl: '/sites/test',
    id: 'site-guid-1234',
    ...overrides?.site,
  },
  user: {
    displayName: 'Test User',
    email: 'test@contoso.com',
    loginName: 'i:0#.f|membership|test@contoso.com',
    ...overrides?.user,
  },
  cultureInfo: {
    currentCultureName: 'en-US',
    currentUICultureName: 'en-US',
    ...overrides?.cultureInfo,
  },
});

/**
 * Create a mock HTTP response
 */
export const createMockResponse = (
  data: unknown,
  status: number = 200,
  ok: boolean = true
): Partial<HttpClientResponse> => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
  headers: new Headers(),
});

/**
 * Create a mock SPHttpClient
 */
export const createMockSPHttpClient = (
  defaultResponse?: Partial<HttpClientResponse>
): MockSPHttpClient => {
  const response = defaultResponse || createMockResponse({});

  return {
    get: jest.fn().mockResolvedValue(response),
    post: jest.fn().mockResolvedValue(response),
    fetch: jest.fn().mockResolvedValue(response),
  };
};

/**
 * Create a mock HttpClient
 */
export const createMockHttpClient = (
  defaultResponse?: Partial<HttpClientResponse>
): MockHttpClient => {
  const response = defaultResponse || createMockResponse({});

  return {
    get: jest.fn().mockResolvedValue(response),
    post: jest.fn().mockResolvedValue(response),
    fetch: jest.fn().mockResolvedValue(response),
  };
};

/**
 * Create a complete mock WebPartContext
 */
export const createMockWebPartContext = (
  overrides?: Partial<MockWebPartContext>
): MockWebPartContext => ({
  pageContext: createMockPageContext(overrides?.pageContext as Partial<MockPageContext>),
  spHttpClient: createMockSPHttpClient(),
  httpClient: createMockHttpClient(),
  instanceId: 'webpart-instance-1234',
  domElement: document.createElement('div'),
  ...overrides,
});

/**
 * Create a mock for the @microsoft/sp-http module
 */
export const spHttpMock = {
  SPHttpClient: {
    configurations: {
      v1: {},
    },
  },
  HttpClient: {
    configurations: {
      v1: {},
    },
  },
};

/**
 * Create a mock for the @microsoft/sp-core-library module
 */
export const spCoreLibraryMock = {
  Environment: {
    type: 3, // EnvironmentType.SharePoint
  },
  EnvironmentType: {
    Local: 1,
    Test: 2,
    SharePoint: 3,
    ClassicSharePoint: 4,
  },
  Log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  },
  Guid: {
    newGuid: jest.fn().mockReturnValue({ toString: () => 'mock-guid-1234' }),
    parse: jest.fn(),
    isValid: jest.fn().mockReturnValue(true),
  },
};

/**
 * Helper to setup all SPFx module mocks
 */
export const setupSpfxMocks = (): void => {
  jest.mock('@microsoft/sp-http', () => spHttpMock);
  jest.mock('@microsoft/sp-core-library', () => spCoreLibraryMock);
};

/**
 * Mock localization strings
 */
export const RssFeedWebPartStringsMock = {
  PropertyPaneDescription: 'RSS Feed Configuration',
  BasicGroupName: 'Basic Settings',
  BannerSettingsGroupName: 'Banner Settings',
  FeedUrlFieldLabel: 'Feed URL',
  LayoutFieldLabel: 'Layout',
  LayoutBannerLabel: 'Banner',
  LayoutCardLabel: 'Card',
  LayoutListLabel: 'List',
  AutoscrollFieldLabel: 'Auto-scroll',
  AutoscrollOnLabel: 'On',
  AutoscrollOffLabel: 'Off',
  IntervalFieldLabel: 'Interval',
  ForceFallbackFieldLabel: 'Force Fallback',
  ForceFallbackOnLabel: 'On',
  ForceFallbackOffLabel: 'Off',
  FallbackUrlFieldLabel: 'Fallback URL',
  FallbackUrlDescription: 'URL for fallback image',
  MaxItemsFieldLabel: 'Max Items',
  ShowPubDateFieldLabel: 'Show Publication Date',
  ShowPubDateOnLabel: 'On',
  ShowPubDateOffLabel: 'Off',
  ShowDescriptionFieldLabel: 'Show Description',
  ShowDescriptionOnLabel: 'On',
  ShowDescriptionOffLabel: 'Off',
  TitleFieldLabel: 'Title',
  AutoRefreshFieldLabel: 'Auto Refresh',
  AutoRefreshOnLabel: 'On',
  AutoRefreshOffLabel: 'Off',
  RefreshIntervalFieldLabel: 'Refresh Interval',
  ErrorLoadingFeed: 'Error loading feed',
  NoItemsMessage: 'No items found',
  LoadingMessage: 'Loading...',
  RetryButtonText: 'Retry',
  ErrorParsingFeed: 'Error parsing feed',
  ErrorFetchingFeed: 'Error fetching feed',
};

/**
 * Mock Fluent UI components commonly used in tests
 */
export const fluentUIMocks = {
  Spinner: jest.fn(() => null),
  MessageBar: jest.fn(({ children }) => children),
  PrimaryButton: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
  TextField: jest.fn(({ label, value, onChange }) => (
    <input aria-label={label} value={value} onChange={e => onChange?.(e, e.target.value)} />
  )),
  Dropdown: jest.fn(({ label, options, onChange }) => (
    <select aria-label={label} onChange={e => onChange?.(e, options?.find((o: {key: string}) => o.key === e.target.value))}>
      {options?.map((o: {key: string; text: string}) => <option key={o.key} value={o.key}>{o.text}</option>)}
    </select>
  )),
  Icon: jest.fn(({ iconName }) => <span data-icon={iconName} />),
  Toggle: jest.fn(({ checked, onChange, label }) => (
    <input type="checkbox" aria-label={label} checked={checked} onChange={e => onChange?.(e, e.target.checked)} />
  )),
};
