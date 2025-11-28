/**
 * Property Pane Validators
 *
 * Input validation for all property pane fields to prevent injection attacks
 * and ensure data integrity.
 *
 * @see REF-012-SECURITY-HARDENING.md ST-012-05
 */
import { UrlValidator } from '../services/urlValidator';

/**
 * Maximum lengths for text inputs
 */
const MAX_LENGTHS = {
  title: 100,
  keywords: 500,
  url: 2048,
};

/**
 * Input props for validateAll
 */
interface ValidateAllProps {
  feedUrl?: string;
  webPartTitle?: string;
  fallbackImageUrl?: string;
  filterKeywords?: string;
  maxItems?: number;
  refreshInterval?: number;
  interval?: number;
}

/**
 * Property validators for the RSS Feed web part
 */
export const PropertyValidators: {
  feedUrl(value: string): string | undefined;
  fallbackImageUrl(value: string): string | undefined;
  webPartTitle(value: string): string | undefined;
  filterKeywords(value: string): string | undefined;
  itemCount(value: number): string | undefined;
  refreshInterval(value: number): string | undefined;
  carouselInterval(value: number): string | undefined;
  sanitizeText(value: string): string;
  validateAll(props: ValidateAllProps): Record<string, string | undefined>;
  isAllValid(props: ValidateAllProps): boolean;
} = {
  /**
   * Validates the feed URL property
   *
   * @param value The URL to validate
   * @returns Error message or undefined if valid
   *
   * @example
   * ```typescript
   * const error = PropertyValidators.feedUrl('https://example.com/feed.xml');
   * if (error) {
   *   console.error(error);
   * }
   * ```
   */
  feedUrl(value: string): string | undefined {
    if (!value || value.trim() === '') {
      return 'Feed URL is required';
    }

    if (value.length > MAX_LENGTHS.url) {
      return `URL must be ${MAX_LENGTHS.url} characters or less`;
    }

    const validator = new UrlValidator();
    const result = validator.validateFeedUrl(value);

    if (!result.isValid) {
      return result.error || 'Invalid feed URL';
    }

    return undefined; // Valid
  },

  /**
   * Validates the fallback image URL property
   *
   * @param value The image URL to validate (optional field)
   * @returns Error message or undefined if valid
   */
  fallbackImageUrl(value: string): string | undefined {
    // Optional field - empty is valid
    if (!value || value.trim() === '') {
      return undefined;
    }

    if (value.length > MAX_LENGTHS.url) {
      return `URL must be ${MAX_LENGTHS.url} characters or less`;
    }

    const validator = new UrlValidator();
    const result = validator.validate(value);

    if (!result.isValid) {
      return result.error || 'Invalid image URL';
    }

    return undefined; // Valid
  },

  /**
   * Validates the web part title property
   *
   * @param value The title to validate (optional field)
   * @returns Error message or undefined if valid
   */
  webPartTitle(value: string): string | undefined {
    // Optional field - empty is valid
    if (!value) {
      return undefined;
    }

    if (value.length > MAX_LENGTHS.title) {
      return `Title must be ${MAX_LENGTHS.title} characters or less`;
    }

    // Check for HTML tags (should not contain any)
    if (/<[^>]+>/g.test(value)) {
      return 'Title cannot contain HTML tags';
    }

    // Check for script patterns
    if (/javascript:|on\w+=/i.test(value)) {
      return 'Title contains invalid characters';
    }

    return undefined; // Valid
  },

  /**
   * Validates the filter keywords property
   *
   * @param value Comma-separated keywords to validate
   * @returns Error message or undefined if valid
   */
  filterKeywords(value: string): string | undefined {
    // Optional field - empty is valid
    if (!value || value.trim() === '') {
      return undefined;
    }

    if (value.length > MAX_LENGTHS.keywords) {
      return `Keywords must be ${MAX_LENGTHS.keywords} characters or less`;
    }

    // Check for HTML tags
    if (/<[^>]+>/g.test(value)) {
      return 'Keywords cannot contain HTML tags';
    }

    // Check for script patterns
    if (/javascript:|on\w+=/i.test(value)) {
      return 'Keywords contain invalid characters';
    }

    return undefined; // Valid
  },

  /**
   * Validates numeric item count
   *
   * @param value The item count
   * @returns Error message or undefined if valid
   */
  itemCount(value: number): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a number';
    }

    if (!Number.isInteger(value)) {
      return 'Must be a whole number';
    }

    if (value < 1 || value > 100) {
      return 'Must be between 1 and 100';
    }

    return undefined; // Valid
  },

  /**
   * Validates refresh interval in minutes
   *
   * @param value The refresh interval
   * @returns Error message or undefined if valid
   */
  refreshInterval(value: number): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a number';
    }

    if (!Number.isInteger(value)) {
      return 'Must be a whole number';
    }

    if (value < 1 || value > 1440) {
      // 1 minute to 24 hours
      return 'Must be between 1 and 1440 minutes';
    }

    return undefined; // Valid
  },

  /**
   * Validates carousel interval in seconds
   *
   * @param value The interval in seconds
   * @returns Error message or undefined if valid
   */
  carouselInterval(value: number): string | undefined {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a number';
    }

    if (!Number.isInteger(value)) {
      return 'Must be a whole number';
    }

    if (value < 1 || value > 60) {
      return 'Must be between 1 and 60 seconds';
    }

    return undefined; // Valid
  },

  /**
   * Sanitizes text input by escaping HTML
   *
   * @param value The text to sanitize
   * @returns Sanitized text
   */
  sanitizeText(value: string): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/&(?!(lt|gt|quot|#x27|amp);)/g, '&amp;');
  },

  /**
   * Validates all properties at once
   *
   * @param props The web part properties
   * @returns Object with property names as keys and error messages as values
   */
  validateAll(props: ValidateAllProps): Record<string, string | undefined> {
    return {
      feedUrl: props.feedUrl !== undefined ? this.feedUrl(props.feedUrl) : undefined,
      webPartTitle: props.webPartTitle !== undefined ? this.webPartTitle(props.webPartTitle) : undefined,
      fallbackImageUrl: props.fallbackImageUrl !== undefined ? this.fallbackImageUrl(props.fallbackImageUrl) : undefined,
      filterKeywords: props.filterKeywords !== undefined ? this.filterKeywords(props.filterKeywords) : undefined,
      maxItems: props.maxItems !== undefined ? this.itemCount(props.maxItems) : undefined,
      refreshInterval: props.refreshInterval !== undefined ? this.refreshInterval(props.refreshInterval) : undefined,
      interval: props.interval !== undefined ? this.carouselInterval(props.interval) : undefined,
    };
  },

  /**
   * Checks if all properties are valid
   *
   * @param props The web part properties
   * @returns True if all properties are valid
   */
  isAllValid(props: ValidateAllProps): boolean {
    const errors = this.validateAll(props);
    return Object.values(errors).every((error) => error === undefined);
  },
};

export default PropertyValidators;
