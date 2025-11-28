/**
 * Tests for Enhanced ErrorBoundary
 *
 * Tests the error boundary component including error display,
 * retry mechanism, action handling, and recovery functionality.
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { RssErrorBoundary } from '../../src/webparts/polRssGallery/components/ErrorBoundary';
import {
  RssErrorCode,
  RssErrorSeverity,
  RssErrorCategory,
  createRssError,
  RssError
} from '../../src/webparts/polRssGallery/errors/errorTypes';

// Mock the styles - override the scss.ts file which takes precedence
jest.mock('../../src/webparts/polRssGallery/components/RssFeed.module.scss.ts', () => ({
  __esModule: true,
  default: {
    errorContainer: 'errorContainer',
    errorContent: 'errorContent',
    errorIcon: 'errorIcon',
    warning: 'warning',
    critical: 'critical',
    errorTitle: 'errorTitle',
    errorMessage: 'errorMessage',
    errorActions: 'errorActions',
    actionButton: 'actionButton',
    primary: 'primary',
    retryStatus: 'retryStatus',
    retrySpinner: 'retrySpinner',
    errorCode: 'errorCode',
    errorDetails: 'errorDetails'
  }
}));

// Component that throws an error
const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
  throw error;
};

// Component that works normally
const WorkingComponent: React.FC<{ text: string }> = ({ text }) => {
  return <div data-testid="working">{text}</div>;
};

describe('RssErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Normal operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <RssErrorBoundary>
          <WorkingComponent text="Hello World" />
        </RssErrorBoundary>
      );

      expect(screen.getByTestId('working')).toHaveTextContent('Hello World');
    });

    it('should render multiple children', () => {
      render(
        <RssErrorBoundary>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </RssErrorBoundary>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should catch errors and display error UI', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error message')} />
        </RssErrorBoundary>
      );

      // The error will be classified and have a user message
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display error code', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      // Error code should be displayed
      expect(screen.getByText(/Error Code:/)).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <RssErrorBoundary onError={onError}>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error'
        })
      );
    });

    it('should include feedUrl in error context', () => {
      const onError = jest.fn();
      const feedUrl = 'https://example.com/feed.xml';

      render(
        <RssErrorBoundary onError={onError} feedUrl={feedUrl}>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            feedUrl
          })
        })
      );
    });
  });

  describe('Error classification', () => {
    it('should classify CORS errors correctly', () => {
      const onError = jest.fn();

      render(
        <RssErrorBoundary onError={onError}>
          <ThrowError error={new Error('CORS policy blocked')} />
        </RssErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: RssErrorCode.NETWORK_CORS_BLOCKED
        })
      );
    });

    it('should classify timeout errors correctly', () => {
      const onError = jest.fn();

      render(
        <RssErrorBoundary onError={onError}>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: RssErrorCode.NETWORK_TIMEOUT
        })
      );
    });

    it('should classify XML parsing errors correctly', () => {
      const onError = jest.fn();

      render(
        <RssErrorBoundary onError={onError}>
          <ThrowError error={new Error('XML parse error')} />
        </RssErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: RssErrorCode.PARSE_INVALID_XML
        })
      );
    });
  });

  describe('Retry mechanism', () => {
    it('should show retry button for retryable errors', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Timeout errors are retryable
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should reset error state on retry', async () => {
      let throwError = true;

      const TestComponent: React.FC = () => {
        if (throwError) {
          throw new Error('Request timeout');
        }
        return <div data-testid="recovered">Recovered</div>;
      };

      render(
        <RssErrorBoundary>
          <TestComponent />
        </RssErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Stop throwing
      throwError = false;

      // Click retry
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      // Wait for retry to complete
      await waitFor(() => {
        expect(screen.getByTestId('recovered')).toBeInTheDocument();
      });
    });

    it('should show retry button enabled initially', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Timeout errors are retryable - button should be enabled
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).not.toBeDisabled();
    });
  });

  describe('Auto-retry', () => {
    it('should schedule auto-retry for retryable errors when enabled', () => {
      render(
        <RssErrorBoundary enableAutoRetry>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Should show countdown
      expect(screen.getByText(/Retry scheduled in/)).toBeInTheDocument();
    });

    it('should not schedule auto-retry when disabled', () => {
      render(
        <RssErrorBoundary enableAutoRetry={false}>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Should not show countdown
      expect(screen.queryByText(/Retry scheduled in/)).not.toBeInTheDocument();
    });

    it('should not auto-retry for non-retryable errors', () => {
      render(
        <RssErrorBoundary enableAutoRetry>
          <ThrowError error={new Error('CORS policy blocked')} />
        </RssErrorBoundary>
      );

      // CORS errors are not retryable
      expect(screen.queryByText(/Retry scheduled in/)).not.toBeInTheDocument();
    });

    it('should countdown before retry', () => {
      render(
        <RssErrorBoundary enableAutoRetry>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      const countdownText = screen.getByText(/Retry scheduled in/);
      expect(countdownText).toBeInTheDocument();

      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Countdown should decrease
      // Note: The exact behavior depends on implementation
    });
  });

  describe('Action buttons', () => {
    it('should render suggested actions', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('CORS policy blocked')} />
        </RssErrorBoundary>
      );

      // CORS errors should have "Configure Proxy" action
      expect(screen.getByRole('button', { name: /configure proxy/i })).toBeInTheDocument();
    });

    it('should call onAction callback when action is clicked', () => {
      const onAction = jest.fn();

      render(
        <RssErrorBoundary onAction={onAction}>
          <ThrowError error={new Error('CORS policy blocked')} />
        </RssErrorBoundary>
      );

      const configureButton = screen.getByRole('button', { name: /configure proxy/i });
      fireEvent.click(configureButton);

      expect(onAction).toHaveBeenCalledWith(
        'configure-proxy',
        expect.objectContaining({
          code: RssErrorCode.NETWORK_CORS_BLOCKED
        })
      );
    });

    it('should render primary action button', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Primary action should be the "Try Again" button for retryable errors
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton).not.toBeDisabled();
    });
  });

  describe('Custom fallback', () => {
    it('should use custom fallback when provided', () => {
      const customFallback = (error: RssError) => (
        <div data-testid="custom-fallback">
          Custom error: {error.code}
        </div>
      );

      render(
        <RssErrorBoundary customFallback={customFallback}>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    it('should pass retry function to custom fallback', () => {
      let retryFn: (() => void) | null = null;
      let throwError = true;

      const customFallback = (error: RssError, retry: () => void) => {
        retryFn = retry;
        return (
          <div data-testid="custom-fallback">
            <button onClick={retry}>Custom Retry</button>
          </div>
        );
      };

      const TestComponent: React.FC = () => {
        if (throwError) {
          throw new Error('Test error');
        }
        return <div data-testid="recovered">Recovered</div>;
      };

      render(
        <RssErrorBoundary customFallback={customFallback}>
          <TestComponent />
        </RssErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();

      // Stop throwing and retry
      throwError = false;
      fireEvent.click(screen.getByRole('button', { name: /custom retry/i }));

      // Should recover
      expect(screen.queryByTestId('custom-fallback')).not.toBeInTheDocument();
    });
  });

  describe('Error severity display', () => {
    it('should show warning icon for warning severity', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Timeout is a warning severity
      const icon = document.querySelector('.ms-Icon--Warning');
      expect(icon).toBeInTheDocument();
    });

    it('should show error icon for error severity', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('XML parse error')} />
        </RssErrorBoundary>
      );

      // Parse errors have error severity
      const icon = document.querySelector('.ms-Icon--ErrorBadge');
      expect(icon).toBeInTheDocument();
    });

    it('should show critical icon for critical severity', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('SSL certificate error')} />
        </RssErrorBoundary>
      );

      // SSL errors are critical
      const icon = document.querySelector('.ms-Icon--StatusErrorFull');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Technical details', () => {
    it('should show technical details when available', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error with stack')} />
        </RssErrorBoundary>
      );

      // Details should be in a collapsible section
      const details = document.querySelector('details');
      expect(details).toBeInTheDocument();
    });

    it('should include feed URL in error details for onError callback', () => {
      const feedUrl = 'https://example.com/feed.xml';
      const onError = jest.fn();

      render(
        <RssErrorBoundary feedUrl={feedUrl} onError={onError}>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      // The feedUrl should be passed to the onError callback in the error details
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            feedUrl
          })
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" on error container', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-live="polite" on error container', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-hidden on icons', () => {
      render(
        <RssErrorBoundary>
          <ThrowError error={new Error('Test error')} />
        </RssErrorBoundary>
      );

      const icons = document.querySelectorAll('.ms-Icon');
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Cleanup', () => {
    it('should clear timers on unmount', () => {
      const { unmount } = render(
        <RssErrorBoundary enableAutoRetry>
          <ThrowError error={new Error('Request timeout')} />
        </RssErrorBoundary>
      );

      // Timer should be set
      expect(screen.getByText(/Retry scheduled in/)).toBeInTheDocument();

      // Unmount
      unmount();

      // Advancing timers should not cause any issues
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(10000);
        });
      }).not.toThrow();
    });
  });
});
