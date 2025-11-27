/**
 * Tests for FeedValidator component
 *
 * Tests URL validation, feed testing, and UI states.
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FeedValidator,
  validateUrlFormat,
  useFeedUrlValidation,
  ValidationState
} from '../../src/webparts/polRssGallery/components/FeedValidator';

// Mock the styles module
jest.mock('../../src/webparts/polRssGallery/components/RssFeed.module.scss', () => ({
  __esModule: true,
  default: {
    feedValidator: 'feedValidator',
    feedValidatorLabel: 'feedValidatorLabel',
    feedValidatorInputWrapper: 'feedValidatorInputWrapper',
    feedValidatorInput: 'feedValidatorInput',
    inputError: 'inputError',
    feedValidatorButton: 'feedValidatorButton',
    feedValidatorError: 'feedValidatorError',
    feedValidatorSuggestion: 'feedValidatorSuggestion',
    feedValidatorStatus: 'feedValidatorStatus',
    feedValidatorDetails: 'feedValidatorDetails',
    validationValid: 'validationValid',
    validationWarning: 'validationWarning',
    validationInvalid: 'validationInvalid',
    validationSuccess: 'validationSuccess',
    validationWarningText: 'validationWarningText',
    validationError: 'validationError',
    feedTitle: 'feedTitle',
    feedMeta: 'feedMeta',
    warningList: 'warningList',
    errorSuggestion: 'errorSuggestion'
  }
}));

// Mock ImprovedFeedParser - parse is a static method
jest.mock('../../src/webparts/polRssGallery/services/improvedFeedParser', () => ({
  ImprovedFeedParser: {
    parse: jest.fn().mockReturnValue([
      { title: 'Item 1', link: 'https://example.com/1' },
      { title: 'Item 2', link: 'https://example.com/2' }
    ])
  }
}));

// Mock feedValidator service
jest.mock('../../src/webparts/polRssGallery/services/feedValidator', () => ({
  validateFeed: jest.fn().mockReturnValue({
    isValid: true,
    format: 'rss2',
    formatVersion: '2.0',
    errors: [],
    warnings: [],
    metadata: {
      title: 'Test Feed',
      itemCount: 2
    }
  }),
  detectFeedFormat: jest.fn().mockReturnValue('rss2')
}));

describe('validateUrlFormat', () => {
  it('should reject empty URL', () => {
    const result = validateUrlFormat('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('URL is required');
  });

  it('should reject whitespace-only URL', () => {
    const result = validateUrlFormat('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('URL is required');
  });

  it('should reject URL without protocol', () => {
    const result = validateUrlFormat('example.com/feed');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('URL must start with http:// or https://');
    expect(result.suggestion).toContain('https://');
  });

  it('should accept valid HTTPS URL', () => {
    const result = validateUrlFormat('https://example.com/feed.xml');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid HTTP URL', () => {
    const result = validateUrlFormat('http://example.com/rss');
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid hostname', () => {
    const result = validateUrlFormat('https://invalid');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid hostname');
  });

  it('should warn about localhost URLs', () => {
    const result = validateUrlFormat('http://localhost:3000/feed');
    expect(result.isValid).toBe(true);
    expect(result.suggestion).toContain('localhost');
  });

  it('should suggest feed path when not obvious', () => {
    const result = validateUrlFormat('https://example.com/page');
    expect(result.isValid).toBe(true);
    expect(result.suggestion).toContain('may not be a feed');
  });

  it('should not suggest for common feed patterns', () => {
    const feedUrls = [
      'https://example.com/feed',
      'https://example.com/rss',
      'https://example.com/atom',
      'https://example.com/feed.xml',
      'https://example.com/news.rss'
    ];

    feedUrls.forEach(url => {
      const result = validateUrlFormat(url);
      expect(result.isValid).toBe(true);
      expect(result.suggestion).toBeUndefined();
    });
  });

  it('should reject malformed URL', () => {
    const result = validateUrlFormat('https://');
    expect(result.isValid).toBe(false);
  });
});

describe('FeedValidator Component', () => {
  const defaultProps = {
    url: '',
    onUrlChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render input with label', () => {
      render(<FeedValidator {...defaultProps} />);

      expect(screen.getByLabelText('Feed URL')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter feed URL/)).toBeInTheDocument();
    });

    it('should render custom label', () => {
      render(<FeedValidator {...defaultProps} label="RSS Feed" />);

      expect(screen.getByLabelText('RSS Feed')).toBeInTheDocument();
    });

    it('should render test button', () => {
      render(<FeedValidator {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Test/i })).toBeInTheDocument();
    });

    it('should render with initial URL', () => {
      render(<FeedValidator {...defaultProps} url="https://example.com/feed" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('https://example.com/feed');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<FeedValidator {...defaultProps} disabled={true} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByRole('button', { name: /Test/i })).toBeDisabled();
    });
  });

  describe('URL Input', () => {
    it('should call onUrlChange when typing', async () => {
      const onUrlChange = jest.fn();
      render(<FeedValidator {...defaultProps} onUrlChange={onUrlChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'https://test.com');

      expect(onUrlChange).toHaveBeenCalled();
    });

    it('should show error for invalid URL format', () => {
      render(<FeedValidator {...defaultProps} url="invalid-url" />);

      expect(screen.getByText(/must start with http/i)).toBeInTheDocument();
    });

    it('should show suggestion for non-feed URL', () => {
      render(<FeedValidator {...defaultProps} url="https://example.com/page" />);

      expect(screen.getByText(/may not be a feed/i)).toBeInTheDocument();
    });

    it('should not show error for valid URL', () => {
      render(<FeedValidator {...defaultProps} url="https://example.com/feed.xml" />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Test Button', () => {
    it('should be disabled when URL is empty', () => {
      render(<FeedValidator {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Test/i })).toBeDisabled();
    });

    it('should be disabled when URL is invalid', () => {
      render(<FeedValidator {...defaultProps} url="not-a-url" />);

      expect(screen.getByRole('button', { name: /Test/i })).toBeDisabled();
    });

    it('should be enabled when URL is valid', () => {
      render(<FeedValidator {...defaultProps} url="https://example.com/feed" />);

      expect(screen.getByRole('button', { name: /Test/i })).not.toBeDisabled();
    });
  });

  describe('Validation State Changes', () => {
    it('should call onValidationChange when validation starts', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rss><channel><title>Test</title></channel></rss>')
      });

      const onValidationChange = jest.fn();

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          onValidationChange={onValidationChange}
          fetchFn={mockFetch}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'validating' })
        );
      });
    });

    it('should show validating state when testing', async () => {
      const mockFetch = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          text: () => Promise.resolve('<rss><channel><title>Test</title></channel></rss>')
        }), 100))
      );

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Validating feed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Successful Validation', () => {
    it('should show valid state on success', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rss version="2.0"><channel><title>Test Feed</title><item><title>Item</title></item></channel></rss>')
      });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          showDetails={true}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Feed is valid/i)).toBeInTheDocument();
      });
    });

    it('should show feed title when available', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rss version="2.0"><channel><title>My Test Feed</title></channel></rss>')
      });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          showDetails={true}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Test Feed')).toBeInTheDocument();
      });
    });
  });

  describe('Failed Validation', () => {
    it('should show error on HTTP failure', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      // User message for HTTP errors is "The feed server returned an error"
      await waitFor(() => {
        expect(screen.getByText(/server returned an error/i)).toBeInTheDocument();
      });
    });

    it('should show error on network failure', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        const status = screen.getByRole('status');
        expect(status).toBeInTheDocument();
      });
    });
  });

  describe('Proxy Fallback', () => {
    it('should try proxy when direct fetch fails', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('CORS error'))
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<rss><channel><title>Test</title></channel></rss>')
        });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          proxyUrl="https://proxy.example.com"
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith(
          'https://proxy.example.com?url=https%3A%2F%2Fexample.com%2Ffeed'
        );
      });
    });

    it('should show warning when proxy was needed', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('CORS error'))
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<rss version="2.0"><channel><title>Test</title></channel></rss>')
        });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          proxyUrl="https://proxy.example.com"
          showDetails={true}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/requires proxy/i)).toBeInTheDocument();
      });
    });
  });

  describe('Blur Validation', () => {
    it('should validate on blur when enabled', async () => {
      jest.useFakeTimers();

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rss><channel><title>Test</title></channel></rss>')
      });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          validateOnBlur={true}
          debounceMs={100}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      // Advance timers to trigger debounced validation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });

    it('should not validate on blur when disabled', () => {
      const mockFetch = jest.fn();

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
          validateOnBlur={false}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible input with label', () => {
      render(<FeedValidator {...defaultProps} label="RSS Feed URL" />);

      const input = screen.getByLabelText('RSS Feed URL');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should mark input as invalid when error exists', () => {
      render(<FeedValidator {...defaultProps} url="invalid" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby for errors', () => {
      render(<FeedValidator {...defaultProps} url="invalid" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'url-error');
    });

    it('should use live region for status updates', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rss><channel><title>Test</title></channel></rss>')
      });

      render(
        <FeedValidator
          {...defaultProps}
          url="https://example.com/feed"
          fetchFn={mockFetch}
        />
      );

      const button = screen.getByRole('button', { name: /Test/i });
      fireEvent.click(button);

      await waitFor(() => {
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
});

describe('useFeedUrlValidation Hook', () => {
  const TestComponent: React.FC<{ initialUrl?: string }> = ({ initialUrl = '' }) => {
    const { url, setUrl, isValid, error, suggestion } = useFeedUrlValidation(initialUrl);

    return (
      <div>
        <input
          data-testid="url-input"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <span data-testid="is-valid">{isValid ? 'valid' : 'invalid'}</span>
        {error && <span data-testid="error">{error}</span>}
        {suggestion && <span data-testid="suggestion">{suggestion}</span>}
      </div>
    );
  };

  it('should initialize with empty URL as invalid', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('is-valid')).toHaveTextContent('invalid');
  });

  it('should validate URL on change', async () => {
    render(<TestComponent />);

    const input = screen.getByTestId('url-input');
    await userEvent.type(input, 'https://example.com/feed');

    expect(screen.getByTestId('is-valid')).toHaveTextContent('valid');
  });

  it('should show error for invalid URL', async () => {
    render(<TestComponent />);

    const input = screen.getByTestId('url-input');
    await userEvent.type(input, 'not-a-url');

    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('should initialize with provided URL', () => {
    render(<TestComponent initialUrl="https://example.com/feed" />);

    expect(screen.getByTestId('is-valid')).toHaveTextContent('valid');
  });
});
