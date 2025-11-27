/**
 * Conditional Field Logic
 *
 * Determines which property pane fields should be shown based on
 * the current property values.
 */
import { IRssFeedWebPartProps } from '../RssFeedWebPart';

/**
 * Check if a property field should be visible based on dependencies
 */
export function shouldShowField(
  fieldKey: keyof IRssFeedWebPartProps | string,
  properties: IRssFeedWebPartProps
): boolean {
  const rules: Record<string, () => boolean> = {
    // Carousel settings only for banner layout
    autoscroll: () => properties.layout === 'banner',
    interval: () => properties.layout === 'banner' && properties.autoscroll === true,

    // Fallback image URL only when force fallback enabled
    fallbackImageUrl: () => properties.forceFallbackImage === true,

    // Refresh interval only when auto refresh enabled
    refreshInterval: () => properties.autoRefresh === true
  };

  // If no rule exists, field is always visible
  const rule = rules[fieldKey];
  return rule ? rule() : true;
}

/**
 * Check if a property group should be shown based on layout
 */
export function shouldShowGroup(
  groupKey: string,
  properties: IRssFeedWebPartProps
): boolean {
  const rules: Record<string, () => boolean> = {
    // Banner settings group only for banner layout
    bannerSettings: () => properties.layout === 'banner'
  };

  const rule = rules[groupKey];
  return rule ? rule() : true;
}

/**
 * Check if a field should be disabled
 */
export function isFieldDisabled(
  fieldKey: keyof IRssFeedWebPartProps | string,
  properties: IRssFeedWebPartProps
): boolean {
  const rules: Record<string, () => boolean> = {
    // Interval disabled when autoscroll is off
    interval: () => properties.layout !== 'banner' || !properties.autoscroll,

    // Refresh interval disabled when auto refresh is off
    refreshInterval: () => !properties.autoRefresh,

    // Fallback URL disabled when force fallback is off
    fallbackImageUrl: () => !properties.forceFallbackImage
  };

  const rule = rules[fieldKey];
  return rule ? rule() : false;
}

/**
 * Get all fields that depend on a specific property
 */
export function getDependentFields(
  propertyKey: keyof IRssFeedWebPartProps
): string[] {
  const dependencies: Record<string, string[]> = {
    layout: ['autoscroll', 'interval'],
    autoscroll: ['interval'],
    autoRefresh: ['refreshInterval'],
    forceFallbackImage: ['fallbackImageUrl']
  };

  return dependencies[propertyKey] || [];
}
