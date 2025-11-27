/**
 * EmptyState Component Tests
 */

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EmptyState,
  NoItemsEmptyState,
  NoFeedConfiguredEmptyState,
  FilteredEmptyState,
  OfflineEmptyState,
  EmptyStateSize
} from '../../src/webparts/polRssGallery/components/shared/EmptyState';

// Mock Fluent UI buttons
jest.mock('@fluentui/react/lib/Button', () => ({
  PrimaryButton: ({ children, onClick, ...props }: { children: React.ReactNode; onClick: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} data-testid={props['data-testid']}>{children}</button>
  ),
  DefaultButton: ({ children, onClick, ...props }: { children: React.ReactNode; onClick: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} data-testid={props['data-testid']}>{children}</button>
  )
}));

describe('EmptyState', () => {
  describe('Base EmptyState', () => {
    it('renders with required props', () => {
      render(<EmptyState title="No items" testId="empty-state" />);

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <EmptyState
          title="No items"
          description="Try a different search"
          testId="empty-state"
        />
      );

      expect(screen.getByText('Try a different search')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      render(<EmptyState title="No items" testId="empty-state" />);

      const paragraphs = screen.getByTestId('empty-state').querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });

    it('renders emoji icon when string is provided', () => {
      render(
        <EmptyState
          title="No items"
          icon="📰"
          testId="empty-state"
        />
      );

      expect(screen.getByText('📰')).toBeInTheDocument();
    });

    it('renders custom icon component', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
      render(
        <EmptyState
          title="No items"
          icon={<CustomIcon />}
          testId="empty-state"
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders default icon when icon prop is not provided', () => {
      render(<EmptyState title="No items" testId="empty-state" />);

      // Default icon is rendered - just check the component renders
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('does not render icon when icon is null', () => {
      render(<EmptyState title="No items" icon={null} testId="empty-state" />);

      const iconWrapper = screen.getByTestId('empty-state').querySelector('[class*="iconWrapper"]');
      const iconEmoji = screen.getByTestId('empty-state').querySelector('[class*="iconEmoji"]');
      expect(iconWrapper).not.toBeInTheDocument();
      expect(iconEmoji).not.toBeInTheDocument();
    });

    it('renders primary action button', () => {
      const handleClick = jest.fn();
      render(
        <EmptyState
          title="No items"
          action={{ label: 'Retry', onClick: handleClick }}
          testId="empty-state"
        />
      );

      const button = screen.getByTestId('empty-state-action');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Retry');

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });

    it('renders secondary action button', () => {
      const handlePrimary = jest.fn();
      const handleSecondary = jest.fn();
      render(
        <EmptyState
          title="No items"
          action={{ label: 'Retry', onClick: handlePrimary }}
          secondaryAction={{ label: 'Cancel', onClick: handleSecondary }}
          testId="empty-state"
        />
      );

      const secondaryButton = screen.getByTestId('empty-state-action-secondary');
      expect(secondaryButton).toBeInTheDocument();
      expect(secondaryButton).toHaveTextContent('Cancel');

      fireEvent.click(secondaryButton);
      expect(handleSecondary).toHaveBeenCalled();
    });

    it('does not render actions section when no actions provided', () => {
      render(<EmptyState title="No items" testId="empty-state" />);

      const actions = screen.getByTestId('empty-state').querySelector('[class*="actions"]');
      expect(actions).not.toBeInTheDocument();
    });

    describe('Size variants', () => {
      it.each(['sm', 'md', 'lg'] as EmptyStateSize[])('renders with %s size', (size) => {
        render(<EmptyState title="No items" size={size} testId="empty-state" />);

        // Component should render without errors
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });

      it('defaults to md size', () => {
        render(<EmptyState title="No items" testId="empty-state" />);

        // Component should render without errors
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });
    });

    it('applies custom className', () => {
      render(
        <EmptyState
          title="No items"
          className="custom-class"
          testId="empty-state"
        />
      );

      expect(screen.getByTestId('empty-state')).toHaveClass('custom-class');
    });

    it('has role="status" for accessibility', () => {
      render(<EmptyState title="No items" testId="empty-state" />);

      expect(screen.getByTestId('empty-state')).toHaveAttribute('role', 'status');
    });

    it('has aria-label matching title', () => {
      render(<EmptyState title="No items found" testId="empty-state" />);

      expect(screen.getByTestId('empty-state')).toHaveAttribute('aria-label', 'No items found');
    });
  });

  describe('NoItemsEmptyState', () => {
    it('renders with default message', () => {
      render(<NoItemsEmptyState testId="no-items" />);

      expect(screen.getByText('Ingen elementer')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<NoItemsEmptyState message="Custom message" testId="no-items" />);

      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

    it('renders refresh button when onRefresh provided', () => {
      const handleRefresh = jest.fn();
      render(<NoItemsEmptyState onRefresh={handleRefresh} testId="no-items" />);

      const button = screen.getByTestId('no-items-action');
      expect(button).toHaveTextContent('Oppdater');

      fireEvent.click(button);
      expect(handleRefresh).toHaveBeenCalled();
    });

    it('does not render refresh button when onRefresh not provided', () => {
      render(<NoItemsEmptyState testId="no-items" />);

      expect(screen.queryByTestId('no-items-action')).not.toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<NoItemsEmptyState testId="no-items" />);

      expect(screen.getByText(/Feeden er tom/)).toBeInTheDocument();
    });

    it('displays feed icon', () => {
      render(<NoItemsEmptyState testId="no-items" />);

      expect(screen.getByText('📰')).toBeInTheDocument();
    });
  });

  describe('NoFeedConfiguredEmptyState', () => {
    it('renders with correct title', () => {
      render(<NoFeedConfiguredEmptyState testId="no-feed" />);

      expect(screen.getByText('Ingen feed konfigurert')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<NoFeedConfiguredEmptyState testId="no-feed" />);

      expect(screen.getByText(/Konfigurer en RSS-feed URL/)).toBeInTheDocument();
    });

    it('renders settings button when onOpenSettings provided', () => {
      const handleSettings = jest.fn();
      render(<NoFeedConfiguredEmptyState onOpenSettings={handleSettings} testId="no-feed" />);

      const button = screen.getByTestId('no-feed-action');
      expect(button).toHaveTextContent('Åpne innstillinger');

      fireEvent.click(button);
      expect(handleSettings).toHaveBeenCalled();
    });

    it('does not render settings button when onOpenSettings not provided', () => {
      render(<NoFeedConfiguredEmptyState testId="no-feed" />);

      expect(screen.queryByTestId('no-feed-action')).not.toBeInTheDocument();
    });

    it('displays settings icon', () => {
      render(<NoFeedConfiguredEmptyState testId="no-feed" />);

      expect(screen.getByText('⚙️')).toBeInTheDocument();
    });
  });

  describe('FilteredEmptyState', () => {
    it('renders with generic message when no filter value', () => {
      render(<FilteredEmptyState testId="filtered" />);

      expect(screen.getByText('Ingen treff')).toBeInTheDocument();
      expect(screen.getByText(/Ingen elementer matcher de valgte filtrene/)).toBeInTheDocument();
    });

    it('renders with specific message when filter value provided', () => {
      render(<FilteredEmptyState filterValue="test query" testId="filtered" />);

      expect(screen.getByText(/Ingen elementer matcher "test query"/)).toBeInTheDocument();
    });

    it('renders clear filters button when onClearFilters provided', () => {
      const handleClear = jest.fn();
      render(<FilteredEmptyState onClearFilters={handleClear} testId="filtered" />);

      const button = screen.getByTestId('filtered-action');
      expect(button).toHaveTextContent('Nullstill filtre');

      fireEvent.click(button);
      expect(handleClear).toHaveBeenCalled();
    });

    it('does not render clear filters button when onClearFilters not provided', () => {
      render(<FilteredEmptyState testId="filtered" />);

      expect(screen.queryByTestId('filtered-action')).not.toBeInTheDocument();
    });

    it('displays search icon', () => {
      render(<FilteredEmptyState testId="filtered" />);

      expect(screen.getByText('🔍')).toBeInTheDocument();
    });
  });

  describe('OfflineEmptyState', () => {
    it('renders with correct title', () => {
      render(<OfflineEmptyState testId="offline" />);

      expect(screen.getByText('Frakoblet')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<OfflineEmptyState testId="offline" />);

      expect(screen.getByText(/Du er frakoblet internett/)).toBeInTheDocument();
    });

    it('renders retry button when onRetry provided', () => {
      const handleRetry = jest.fn();
      render(<OfflineEmptyState onRetry={handleRetry} testId="offline" />);

      const button = screen.getByTestId('offline-action');
      expect(button).toHaveTextContent('Prøv igjen');

      fireEvent.click(button);
      expect(handleRetry).toHaveBeenCalled();
    });

    it('does not render retry button when onRetry not provided', () => {
      render(<OfflineEmptyState testId="offline" />);

      expect(screen.queryByTestId('offline-action')).not.toBeInTheDocument();
    });

    it('displays offline icon', () => {
      render(<OfflineEmptyState testId="offline" />);

      expect(screen.getByText('📡')).toBeInTheDocument();
    });
  });
});
