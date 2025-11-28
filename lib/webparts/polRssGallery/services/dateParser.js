/**
 * Date Parser Service for RSS/Atom Feeds
 *
 * Handles various date formats commonly found in feeds:
 * - RFC 822 (RSS standard): "Sat, 23 Nov 2025 14:30:00 GMT"
 * - RFC 3339/ISO 8601 (Atom standard): "2025-11-23T14:30:00Z"
 * - Various non-standard formats used by real-world feeds
 *
 * @module dateParser
 * @see ST-003-05: Improve Date Parsing
 */
/**
 * Month name mappings (English)
 */
const MONTH_NAMES = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
};
/**
 * Norwegian month name mappings
 */
const MONTH_NAMES_NO = {
    jan: 0, januar: 0,
    feb: 1, februar: 1,
    mar: 2, mars: 2,
    apr: 3, april: 3,
    mai: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    okt: 9, oktober: 9,
    nov: 10, november: 10,
    des: 11, desember: 11,
};
/**
 * Combined month mappings (English + Norwegian)
 */
const ALL_MONTH_NAMES = {
    ...MONTH_NAMES,
    ...MONTH_NAMES_NO,
};
/**
 * Timezone offset mappings for common abbreviations
 * Values are in minutes offset from UTC
 */
const TIMEZONE_OFFSETS = {
    // UTC/GMT
    utc: 0, gmt: 0, z: 0,
    // US timezones
    est: -300, edt: -240, // Eastern
    cst: -360, cdt: -300, // Central
    mst: -420, mdt: -360, // Mountain
    pst: -480, pdt: -420, // Pacific
    // European timezones
    cet: 60, cest: 120, // Central European
    eet: 120, eest: 180, // Eastern European
    wet: 0, west: 60, // Western European
    // Other common zones
    ist: 330, // Indian Standard Time
    jst: 540, // Japan Standard Time
    aest: 600, // Australian Eastern
    nzst: 720, // New Zealand
};
/**
 * Parse a date string from various formats
 *
 * @param dateStr - The date string to parse
 * @returns DateParseResult with parsed date and metadata
 *
 * @example
 * ```typescript
 * const result = parseDate('Sat, 23 Nov 2025 14:30:00 GMT');
 * if (result.success) {
 *   console.log(result.date); // Date object
 *   console.log(result.format); // 'rfc822'
 * }
 * ```
 */
export function parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
        return {
            date: null,
            original: dateStr || '',
            success: false,
            format: 'unknown',
        };
    }
    const trimmed = dateStr.trim();
    // Try each parser in order of specificity
    const parsers = [
        { format: 'rfc3339', parser: parseRfc3339 },
        { format: 'iso8601', parser: parseIso8601 },
        { format: 'rfc822', parser: parseRfc822 },
        { format: 'iso8601-date', parser: parseIso8601DateOnly },
        { format: 'long-date', parser: parseLongDate },
        { format: 'us-date', parser: parseUsDate },
        { format: 'eu-date', parser: parseEuDate },
        { format: 'timestamp', parser: parseTimestamp },
    ];
    for (const { format, parser } of parsers) {
        const result = parser(trimmed);
        if (result && isValidDate(result)) {
            return {
                date: result,
                original: dateStr,
                success: true,
                format,
            };
        }
    }
    // Last resort: try native Date constructor
    const nativeResult = tryNativeDate(trimmed);
    if (nativeResult && isValidDate(nativeResult)) {
        return {
            date: nativeResult,
            original: dateStr,
            success: true,
            format: 'unknown',
        };
    }
    return {
        date: null,
        original: dateStr,
        success: false,
        format: 'unknown',
    };
}
/**
 * Parse date and return Date object or fallback
 *
 * @param dateStr - The date string to parse
 * @param fallback - Fallback value if parsing fails (default: new Date())
 * @returns Parsed Date or fallback
 */
export function parseDateOrDefault(dateStr, fallback) {
    const result = parseDate(dateStr);
    if (result.success && result.date) {
        return result.date;
    }
    return fallback !== null && fallback !== void 0 ? fallback : new Date();
}
/**
 * Parse date and return ISO string or null
 *
 * @param dateStr - The date string to parse
 * @returns ISO 8601 string or null if parsing failed
 */
export function parseDateToIsoString(dateStr) {
    const result = parseDate(dateStr);
    if (result.success && result.date) {
        return result.date.toISOString();
    }
    return null;
}
/**
 * Check if a Date object is valid (not Invalid Date)
 */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
/**
 * Parse RFC 3339 format (used by Atom feeds)
 * Format: "2025-11-23T14:30:00Z" or "2025-11-23T14:30:00+01:00"
 */
function parseRfc3339(dateStr) {
    // Full RFC 3339 regex with optional fractional seconds and timezone
    const rfc3339Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})$/i;
    const match = dateStr.match(rfc3339Regex);
    if (!match)
        return null;
    const [, year, month, day, hour, minute, second, fractional, tz] = match;
    // Build ISO string for parsing
    let isoStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    // Add fractional seconds if present (pad/truncate to 3 digits for milliseconds)
    if (fractional) {
        const ms = fractional.padEnd(3, '0').slice(0, 3);
        isoStr += `.${ms}`;
    }
    // Normalize timezone
    if (tz.toUpperCase() === 'Z') {
        isoStr += 'Z';
    }
    else {
        // Ensure timezone has colon: +0100 -> +01:00
        const normalizedTz = tz.includes(':') ? tz : `${tz.slice(0, 3)}:${tz.slice(3)}`;
        isoStr += normalizedTz;
    }
    return new Date(isoStr);
}
/**
 * Parse ISO 8601 datetime format
 * Format: "2025-11-23T14:30:00" (without timezone)
 */
function parseIso8601(dateStr) {
    // ISO 8601 without timezone (assume local)
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/;
    const match = dateStr.match(iso8601Regex);
    if (!match)
        return null;
    const [, year, month, day, hour, minute, second] = match;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
}
/**
 * Parse ISO 8601 date-only format
 * Format: "2025-11-23"
 */
function parseIso8601DateOnly(dateStr) {
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateStr.match(isoDateRegex);
    if (!match)
        return null;
    const [, year, month, day] = match;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), 0, 0, 0);
}
/**
 * Parse RFC 822 format (used by RSS feeds)
 * Format: "Sat, 23 Nov 2025 14:30:00 GMT"
 * Also handles: "23 Nov 2025 14:30:00 GMT" (without day name)
 */
function parseRfc822(dateStr) {
    // RFC 822 with optional day name
    // eslint-disable-next-line max-len
    const rfc822Regex = /^(?:\w{3},?\s+)?(\d{1,2})\s+(\w{3,9})\s+(\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([A-Z]{1,5}|[+-]\d{4})?$/i;
    const match = dateStr.match(rfc822Regex);
    if (!match)
        return null;
    const [, day, monthStr, yearStr, hour, minute, second = '0', tz = 'GMT'] = match;
    // Parse month name
    const month = ALL_MONTH_NAMES[monthStr.toLowerCase()];
    if (month === undefined)
        return null;
    // Parse year (handle 2-digit years)
    let year = parseInt(yearStr, 10);
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }
    // Create date in UTC
    const date = new Date(Date.UTC(year, month, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10)));
    // Apply timezone offset
    const offsetMinutes = parseTimezone(tz);
    if (offsetMinutes !== 0) {
        date.setTime(date.getTime() - offsetMinutes * 60 * 1000);
    }
    return date;
}
/**
 * Parse long date format
 * Format: "November 23, 2025" or "23 November 2025"
 */
function parseLongDate(dateStr) {
    // "Month Day, Year" format
    const usLongRegex = /^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/i;
    const usMatch = dateStr.match(usLongRegex);
    if (usMatch) {
        const [, monthStr, day, year] = usMatch;
        const month = ALL_MONTH_NAMES[monthStr.toLowerCase()];
        if (month !== undefined) {
            return new Date(parseInt(year, 10), month, parseInt(day, 10), 0, 0, 0);
        }
    }
    // "Day Month Year" format
    const euLongRegex = /^(\d{1,2})\.?\s+(\w+)\s+(\d{4})$/i;
    const euMatch = dateStr.match(euLongRegex);
    if (euMatch) {
        const [, day, monthStr, year] = euMatch;
        const month = ALL_MONTH_NAMES[monthStr.toLowerCase()];
        if (month !== undefined) {
            return new Date(parseInt(year, 10), month, parseInt(day, 10), 0, 0, 0);
        }
    }
    return null;
}
/**
 * Parse US date format
 * Format: "11/23/2025" or "11/23/2025 14:30"
 */
function parseUsDate(dateStr) {
    const usDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = dateStr.match(usDateRegex);
    if (!match)
        return null;
    const [, month, day, yearStr, hour = '0', minute = '0', second = '0'] = match;
    // Validate month (1-12) and day (1-31)
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
        return null;
    }
    let year = parseInt(yearStr, 10);
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }
    return new Date(year, monthNum - 1, dayNum, parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
}
/**
 * Parse European date format
 * Format: "23/11/2025" or "23.11.2025" or "23-11-2025"
 */
function parseEuDate(dateStr) {
    const euDateRegex = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = dateStr.match(euDateRegex);
    if (!match)
        return null;
    const [, day, month, yearStr, hour = '0', minute = '0', second = '0'] = match;
    // Validate day (1-31) and month (1-12)
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
        return null;
    }
    let year = parseInt(yearStr, 10);
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }
    return new Date(year, monthNum - 1, dayNum, parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
}
/**
 * Parse Unix timestamp
 * Format: "1732370400" (seconds) or "1732370400000" (milliseconds)
 */
function parseTimestamp(dateStr) {
    // Only digits
    if (!/^\d+$/.test(dateStr))
        return null;
    const num = parseInt(dateStr, 10);
    // Distinguish between seconds and milliseconds
    // Timestamps before year 3000 in seconds: < 32503680000
    // Timestamps in milliseconds are typically > 10000000000000
    if (num > 10000000000) {
        // Milliseconds
        return new Date(num);
    }
    else if (num > 0) {
        // Seconds
        return new Date(num * 1000);
    }
    return null;
}
/**
 * Try native Date constructor as last resort
 */
function tryNativeDate(dateStr) {
    try {
        const date = new Date(dateStr);
        if (isValidDate(date)) {
            return date;
        }
    }
    catch (_a) {
        // Ignore parsing errors
    }
    return null;
}
/**
 * Parse timezone string to offset in minutes
 *
 * @param tz - Timezone string (e.g., "GMT", "+0100", "-05:00", "EST")
 * @returns Offset in minutes from UTC
 */
function parseTimezone(tz) {
    if (!tz)
        return 0;
    const normalized = tz.toUpperCase().trim();
    // Check named timezones
    const namedOffset = TIMEZONE_OFFSETS[normalized.toLowerCase()];
    if (namedOffset !== undefined) {
        return namedOffset;
    }
    // Parse numeric offset: +0100, -05:00, +01
    const numericRegex = /^([+-])(\d{1,2}):?(\d{2})?$/;
    const match = normalized.match(numericRegex);
    if (match) {
        const [, sign, hours, minutes = '0'] = match;
        const offset = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        return sign === '-' ? -offset : offset;
    }
    return 0;
}
/**
 * Format a Date object for display
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'nb-NO')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date, locale = 'nb-NO', options) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    };
    try {
        return date.toLocaleDateString(locale, defaultOptions);
    }
    catch (_a) {
        return date.toDateString();
    }
}
/**
 * Format a Date object for relative display (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'nb-NO')
 * @returns Relative time string
 */
export function formatRelativeDate(date, locale = 'nb-NO') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const RelativeTimeFormat = Intl.RelativeTimeFormat;
        if (!RelativeTimeFormat)
            throw new Error('Not supported');
        const rtf = new RelativeTimeFormat(locale, { numeric: 'auto' });
        if (diffDays > 30) {
            return formatDate(date, locale);
        }
        else if (diffDays >= 1) {
            return rtf.format(-diffDays, 'day');
        }
        else if (diffHours >= 1) {
            return rtf.format(-diffHours, 'hour');
        }
        else if (diffMin >= 1) {
            return rtf.format(-diffMin, 'minute');
        }
        else {
            return rtf.format(-diffSec, 'second');
        }
    }
    catch (_a) {
        // Fallback for environments without Intl.RelativeTimeFormat
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
        else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
        else if (diffMin > 0) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        }
        else {
            return 'just now';
        }
    }
}
/**
 * Compare two dates for sorting
 *
 * @param a - First date string
 * @param b - Second date string
 * @param descending - Sort descending (newest first) if true
 * @returns Comparison result (-1, 0, 1)
 */
export function compareDates(a, b, descending = true) {
    const dateA = parseDateOrDefault(a, new Date(0));
    const dateB = parseDateOrDefault(b, new Date(0));
    const diff = dateA.getTime() - dateB.getTime();
    if (descending) {
        return diff > 0 ? -1 : diff < 0 ? 1 : 0;
    }
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}
//# sourceMappingURL=dateParser.js.map