/**
 * EmptyState Component
 *
 * A component for displaying empty states when no content is available.
 * Provides clear messaging and optional action buttons.
 *
 * Features:
 * - Customizable icon
 * - Title and description
 * - Optional action button
 * - Multiple size variants
 * - Accessible design
 */

import * as React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import styles from './EmptyState.module.scss';

/**
 * Size variant for the empty state
 */
export type EmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * Action button configuration
 */
export interface EmptyStateAction {
  /**
   * Button label text
   */
  label: string;
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * Whether this is the primary action
   * @default true
   */
  primary?: boolean;
}

/**
 * Props for the EmptyState component
 */
export interface IEmptyStateProps {
  /**
   * Icon to display (can be a string emoji, icon component, or null)
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Primary action button
   */
  action?: EmptyStateAction;
  /**
   * Secondary action button
   */
  secondaryAction?: EmptyStateAction;
  /**
   * Size variant
   * @default 'md'
   */
  size?: EmptyStateSize;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
}

/**
 * Default icon component
 */
const DefaultIcon: React.FC = () => (
  <span className="ms-Icon ms-Icon--Feed" aria-hidden="true" />
);

/**
 * EmptyState component
 */
export const EmptyState: React.FC<IEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
  testId = 'empty-state'
}) => {
  const containerClasses = [
    styles.emptyState,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  // Render icon
  const renderIcon = () => {
    if (icon === null) return null;

    const iconContent = icon ?? <DefaultIcon />;

    // Check if it's a string (emoji)
    if (typeof iconContent === 'string') {
      return (
        <span className={styles.iconEmoji} aria-hidden="true">
          {iconContent}
        </span>
      );
    }

    return (
      <div className={styles.iconWrapper} aria-hidden="true">
        {iconContent}
      </div>
    );
  };

  // Render action button
  const renderAction = (actionConfig: EmptyStateAction, isPrimary: boolean = true) => {
    const ButtonComponent = isPrimary ? PrimaryButton : DefaultButton;

    return (
      <ButtonComponent
        onClick={actionConfig.onClick}
        className={styles.actionButton}
        data-testid={`${testId}-action${isPrimary ? '' : '-secondary'}`}
      >
        {actionConfig.label}
      </ButtonComponent>
    );
  };

  return (
    <div
      className={containerClasses}
      data-testid={testId}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      {renderIcon()}

      {/* Title */}
      <h3 className={styles.title}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className={styles.actions}>
          {action && renderAction(action, action.primary !== false)}
          {secondaryAction && renderAction(secondaryAction, secondaryAction.primary === true)}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Preset Empty States
// ============================================================

/**
 * Empty state for when no feed items are available
 */
export interface INoItemsEmptyStateProps {
  /**
   * Callback to refresh the feed
   */
  onRefresh?: () => void;
  /**
   * Custom message
   */
  message?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
}

export const NoItemsEmptyState: React.FC<INoItemsEmptyStateProps> = ({
  onRefresh,
  message,
  testId = 'no-items-empty-state'
}) => (
  <EmptyState
    icon="📰"
    title={message || 'Ingen elementer'}
    description="Feeden er tom eller alle elementer er filtrert bort."
    action={onRefresh ? { label: 'Oppdater', onClick: onRefresh } : undefined}
    testId={testId}
  />
);

/**
 * Empty state for when no feed URL is configured
 */
export interface INoFeedConfiguredEmptyStateProps {
  /**
   * Callback to open settings
   */
  onOpenSettings?: () => void;
  /**
   * Test ID for testing
   */
  testId?: string;
}

export const NoFeedConfiguredEmptyState: React.FC<INoFeedConfiguredEmptyStateProps> = ({
  onOpenSettings,
  testId = 'no-feed-configured-empty-state'
}) => (
  <EmptyState
    icon="⚙️"
    title="Ingen feed konfigurert"
    description="Konfigurer en RSS-feed URL i webdelens innstillinger for å vise innhold."
    action={onOpenSettings ? { label: 'Åpne innstillinger', onClick: onOpenSettings } : undefined}
    testId={testId}
  />
);

/**
 * Empty state for filtered results
 */
export interface IFilteredEmptyStateProps {
  /**
   * Callback to clear filters
   */
  onClearFilters?: () => void;
  /**
   * The active filter value
   */
  filterValue?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
}

export const FilteredEmptyState: React.FC<IFilteredEmptyStateProps> = ({
  onClearFilters,
  filterValue,
  testId = 'filtered-empty-state'
}) => (
  <EmptyState
    icon="🔍"
    title="Ingen treff"
    description={filterValue
      ? `Ingen elementer matcher "${filterValue}". Prøv et annet søk.`
      : 'Ingen elementer matcher de valgte filtrene.'
    }
    action={onClearFilters ? { label: 'Nullstill filtre', onClick: onClearFilters } : undefined}
    testId={testId}
  />
);

/**
 * Empty state for offline mode
 */
export interface IOfflineEmptyStateProps {
  /**
   * Callback to retry
   */
  onRetry?: () => void;
  /**
   * Test ID for testing
   */
  testId?: string;
}

export const OfflineEmptyState: React.FC<IOfflineEmptyStateProps> = ({
  onRetry,
  testId = 'offline-empty-state'
}) => (
  <EmptyState
    icon="📡"
    title="Frakoblet"
    description="Du er frakoblet internett. Koble til igjen for å laste inn innhold."
    action={onRetry ? { label: 'Prøv igjen', onClick: onRetry } : undefined}
    testId={testId}
  />
);

export default EmptyState;
