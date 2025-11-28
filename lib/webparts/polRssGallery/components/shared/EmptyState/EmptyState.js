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
 * Default icon component
 */
const DefaultIcon = () => (React.createElement("span", { className: "ms-Icon ms-Icon--Feed", "aria-hidden": "true" }));
/**
 * EmptyState component
 */
export const EmptyState = ({ icon, title, description, action, secondaryAction, size = 'md', className = '', testId = 'empty-state' }) => {
    const containerClasses = [
        styles.emptyState,
        styles[size],
        className
    ].filter(Boolean).join(' ');
    // Render icon
    const renderIcon = () => {
        if (icon === null)
            return null;
        const iconContent = icon !== null && icon !== void 0 ? icon : React.createElement(DefaultIcon, null);
        // Check if it's a string (emoji)
        if (typeof iconContent === 'string') {
            return (React.createElement("span", { className: styles.iconEmoji, "aria-hidden": "true" }, iconContent));
        }
        return (React.createElement("div", { className: styles.iconWrapper, "aria-hidden": "true" }, iconContent));
    };
    // Render action button
    const renderAction = (actionConfig, isPrimary = true) => {
        const ButtonComponent = isPrimary ? PrimaryButton : DefaultButton;
        return (React.createElement(ButtonComponent, { onClick: actionConfig.onClick, className: styles.actionButton, "data-testid": `${testId}-action${isPrimary ? '' : '-secondary'}` }, actionConfig.label));
    };
    return (React.createElement("div", { className: containerClasses, "data-testid": testId, role: "status", "aria-label": title },
        renderIcon(),
        React.createElement("h3", { className: styles.title }, title),
        description && (React.createElement("p", { className: styles.description }, description)),
        (action || secondaryAction) && (React.createElement("div", { className: styles.actions },
            action && renderAction(action, action.primary !== false),
            secondaryAction && renderAction(secondaryAction, secondaryAction.primary === true)))));
};
export const NoItemsEmptyState = ({ onRefresh, message, testId = 'no-items-empty-state' }) => (React.createElement(EmptyState, { icon: "\uD83D\uDCF0", title: message || 'Ingen elementer', description: "Feeden er tom eller alle elementer er filtrert bort.", action: onRefresh ? { label: 'Oppdater', onClick: onRefresh } : undefined, testId: testId }));
export const NoFeedConfiguredEmptyState = ({ onOpenSettings, testId = 'no-feed-configured-empty-state' }) => (React.createElement(EmptyState, { icon: "\u2699\uFE0F", title: "Ingen feed konfigurert", description: "Konfigurer en RSS-feed URL i webdelens innstillinger for \u00E5 vise innhold.", action: onOpenSettings ? { label: 'Åpne innstillinger', onClick: onOpenSettings } : undefined, testId: testId }));
export const FilteredEmptyState = ({ onClearFilters, filterValue, testId = 'filtered-empty-state' }) => (React.createElement(EmptyState, { icon: "\uD83D\uDD0D", title: "Ingen treff", description: filterValue
        ? `Ingen elementer matcher "${filterValue}". Prøv et annet søk.`
        : 'Ingen elementer matcher de valgte filtrene.', action: onClearFilters ? { label: 'Nullstill filtre', onClick: onClearFilters } : undefined, testId: testId }));
export const OfflineEmptyState = ({ onRetry, testId = 'offline-empty-state' }) => (React.createElement(EmptyState, { icon: "\uD83D\uDCE1", title: "Frakoblet", description: "Du er frakoblet internett. Koble til igjen for \u00E5 laste inn innhold.", action: onRetry ? { label: 'Prøv igjen', onClick: onRetry } : undefined, testId: testId }));
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map