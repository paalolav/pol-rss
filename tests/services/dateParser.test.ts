/**
 * Date Parser Tests
 *
 * Tests for the dateParser service covering various date formats
 * found in RSS/Atom feeds and common non-standard variations.
 *
 * @see ST-003-05: Improve Date Parsing
 */

import {
  parseDate,
  parseDateOrDefault,
  parseDateToIsoString,
  isValidDate,
  formatDate,
  formatRelativeDate,
  compareDates,
  DateParseResult,
} from '../../src/webparts/polRssGallery/services/dateParser';

describe('dateParser', () => {
  describe('parseDate', () => {
    describe('RFC 3339 (Atom standard)', () => {
      it('should parse RFC 3339 with Z timezone', () => {
        const result = parseDate('2025-11-23T14:30:00Z');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should parse RFC 3339 with positive offset', () => {
        const result = parseDate('2025-11-23T14:30:00+01:00');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
        // +01:00 means 13:30 UTC
        expect(result.date?.toISOString()).toBe('2025-11-23T13:30:00.000Z');
      });

      it('should parse RFC 3339 with negative offset', () => {
        const result = parseDate('2025-11-23T14:30:00-05:00');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
        // -05:00 means 19:30 UTC
        expect(result.date?.toISOString()).toBe('2025-11-23T19:30:00.000Z');
      });

      it('should parse RFC 3339 with fractional seconds', () => {
        const result = parseDate('2025-11-23T14:30:00.123Z');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.123Z');
      });

      it('should parse RFC 3339 with offset without colon', () => {
        const result = parseDate('2025-11-23T14:30:00+0100');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
        expect(result.date?.toISOString()).toBe('2025-11-23T13:30:00.000Z');
      });

      it('should parse RFC 3339 with lowercase z', () => {
        const result = parseDate('2025-11-23T14:30:00z');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc3339');
      });
    });

    describe('ISO 8601', () => {
      it('should parse ISO 8601 datetime without timezone', () => {
        const result = parseDate('2025-11-23T14:30:00');
        expect(result.success).toBe(true);
        expect(result.format).toBe('iso8601');
        expect(result.date?.getFullYear()).toBe(2025);
        expect(result.date?.getMonth()).toBe(10); // November = 10
        expect(result.date?.getDate()).toBe(23);
        expect(result.date?.getHours()).toBe(14);
        expect(result.date?.getMinutes()).toBe(30);
      });

      it('should parse ISO 8601 with fractional seconds', () => {
        const result = parseDate('2025-11-23T14:30:00.500');
        expect(result.success).toBe(true);
        expect(result.format).toBe('iso8601');
      });

      it('should parse ISO 8601 date only', () => {
        const result = parseDate('2025-11-23');
        expect(result.success).toBe(true);
        expect(result.format).toBe('iso8601-date');
        expect(result.date?.getFullYear()).toBe(2025);
        expect(result.date?.getMonth()).toBe(10);
        expect(result.date?.getDate()).toBe(23);
      });
    });

    describe('RFC 822 (RSS standard)', () => {
      it('should parse RFC 822 with full day name', () => {
        const result = parseDate('Sat, 23 Nov 2025 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should parse RFC 822 without comma after day', () => {
        const result = parseDate('Sat 23 Nov 2025 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
      });

      it('should parse RFC 822 without day name', () => {
        const result = parseDate('23 Nov 2025 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
      });

      it('should parse RFC 822 without seconds', () => {
        const result = parseDate('Sat, 23 Nov 2025 14:30 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
      });

      it('should parse RFC 822 with EST timezone', () => {
        const result = parseDate('Sat, 23 Nov 2025 09:30:00 EST');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
        // EST is UTC-5
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should parse RFC 822 with numeric timezone', () => {
        const result = parseDate('Sat, 23 Nov 2025 15:30:00 +0100');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should parse RFC 822 with 2-digit year', () => {
        const result = parseDate('Sat, 23 Nov 25 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
        expect(result.date?.getFullYear()).toBe(2025);
      });

      it('should parse RFC 822 with full month name', () => {
        const result = parseDate('23 November 2025 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
      });

      it('should parse RFC 822 with single-digit day', () => {
        const result = parseDate('Sat, 3 Nov 2025 14:30:00 GMT');
        expect(result.success).toBe(true);
        expect(result.format).toBe('rfc822');
        expect(result.date?.getDate()).toBe(3);
      });

      it('should handle all English month abbreviations', () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach((month, index) => {
          const result = parseDate(`1 ${month} 2025 12:00:00 GMT`);
          expect(result.success).toBe(true);
          expect(result.date?.getMonth()).toBe(index);
        });
      });

      it('should handle Norwegian month names', () => {
        const months = [
          { name: 'januar', num: 0 },
          { name: 'februar', num: 1 },
          { name: 'mars', num: 2 },
          { name: 'april', num: 3 },
          { name: 'mai', num: 4 },
          { name: 'juni', num: 5 },
          { name: 'juli', num: 6 },
          { name: 'august', num: 7 },
          { name: 'september', num: 8 },
          { name: 'oktober', num: 9 },
          { name: 'november', num: 10 },
          { name: 'desember', num: 11 },
        ];
        months.forEach(({ name, num }) => {
          const result = parseDate(`1 ${name} 2025 12:00:00 GMT`);
          expect(result.success).toBe(true);
          expect(result.date?.getMonth()).toBe(num);
        });
      });
    });

    describe('Long date formats', () => {
      it('should parse US long format "Month Day, Year"', () => {
        const result = parseDate('November 23, 2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('long-date');
        expect(result.date?.getFullYear()).toBe(2025);
        expect(result.date?.getMonth()).toBe(10);
        expect(result.date?.getDate()).toBe(23);
      });

      it('should parse US long format without comma', () => {
        const result = parseDate('November 23 2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('long-date');
      });

      it('should parse EU long format "Day Month Year"', () => {
        const result = parseDate('23 November 2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('long-date');
      });

      it('should parse EU long format with dot', () => {
        const result = parseDate('23. November 2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('long-date');
      });

      it('should parse Norwegian long format', () => {
        const result = parseDate('23 november 2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('long-date');
      });
    });

    describe('US date format (MM/DD/YYYY)', () => {
      it('should parse US date format', () => {
        const result = parseDate('11/23/2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('us-date');
        expect(result.date?.getMonth()).toBe(10); // November
        expect(result.date?.getDate()).toBe(23);
      });

      it('should parse US date format with time', () => {
        const result = parseDate('11/23/2025 14:30');
        expect(result.success).toBe(true);
        expect(result.format).toBe('us-date');
        expect(result.date?.getHours()).toBe(14);
        expect(result.date?.getMinutes()).toBe(30);
      });

      it('should parse US date format with seconds', () => {
        const result = parseDate('11/23/2025 14:30:45');
        expect(result.success).toBe(true);
        expect(result.date?.getSeconds()).toBe(45);
      });

      it('should parse US date format with 2-digit year', () => {
        const result = parseDate('11/23/25');
        expect(result.success).toBe(true);
        expect(result.date?.getFullYear()).toBe(2025);
      });

      it('should reject invalid US date (month > 12)', () => {
        const result = parseDate('13/23/2025');
        expect(result.success).toBe(false);
      });
    });

    describe('EU date format (DD/MM/YYYY)', () => {
      it('should parse EU date format with slashes', () => {
        const result = parseDate('23/11/2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('eu-date');
        expect(result.date?.getDate()).toBe(23);
        expect(result.date?.getMonth()).toBe(10); // November
      });

      it('should parse EU date format with dots', () => {
        const result = parseDate('23.11.2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('eu-date');
      });

      it('should parse EU date format with dashes', () => {
        const result = parseDate('23-11-2025');
        expect(result.success).toBe(true);
        expect(result.format).toBe('eu-date');
      });

      it('should parse EU date format with time', () => {
        const result = parseDate('23/11/2025 14:30');
        expect(result.success).toBe(true);
        expect(result.date?.getHours()).toBe(14);
      });

      it('should reject invalid EU date (month > 12)', () => {
        const result = parseDate('23/13/2025');
        expect(result.success).toBe(false);
      });
    });

    describe('Unix timestamps', () => {
      it('should parse Unix timestamp in seconds', () => {
        const result = parseDate('1763906400');
        expect(result.success).toBe(true);
        expect(result.format).toBe('timestamp');
        // 1763906400 = Sun Nov 23 2025 14:00:00 UTC
        expect(result.date?.getUTCFullYear()).toBe(2025);
        expect(result.date?.getUTCMonth()).toBe(10); // November
        expect(result.date?.getUTCDate()).toBe(23);
      });

      it('should parse Unix timestamp in milliseconds', () => {
        const result = parseDate('1763906400000');
        expect(result.success).toBe(true);
        expect(result.format).toBe('timestamp');
        expect(result.date?.getUTCFullYear()).toBe(2025);
        expect(result.date?.getUTCMonth()).toBe(10); // November
        expect(result.date?.getUTCDate()).toBe(23);
      });

      it('should not parse non-numeric strings as timestamps', () => {
        const result = parseDate('173237abc');
        expect(result.format).not.toBe('timestamp');
      });
    });

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        const result = parseDate('');
        expect(result.success).toBe(false);
        expect(result.date).toBeNull();
      });

      it('should handle null-like inputs', () => {
        const result = parseDate(null as unknown as string);
        expect(result.success).toBe(false);
      });

      it('should handle undefined', () => {
        const result = parseDate(undefined as unknown as string);
        expect(result.success).toBe(false);
      });

      it('should handle whitespace-only string', () => {
        const result = parseDate('   ');
        expect(result.success).toBe(false);
      });

      it('should handle string with leading/trailing whitespace', () => {
        const result = parseDate('  2025-11-23T14:30:00Z  ');
        expect(result.success).toBe(true);
      });

      it('should handle completely invalid date string', () => {
        const result = parseDate('not a date at all');
        expect(result.success).toBe(false);
        expect(result.format).toBe('unknown');
      });

      it('should preserve original string in result', () => {
        const original = '2025-11-23T14:30:00Z';
        const result = parseDate(original);
        expect(result.original).toBe(original);
      });

      it('should handle dates at year boundaries', () => {
        const newYear = parseDate('2025-01-01T00:00:00Z');
        expect(newYear.success).toBe(true);
        expect(newYear.date?.getUTCMonth()).toBe(0);
        expect(newYear.date?.getUTCDate()).toBe(1);

        const newYearEve = parseDate('2025-12-31T23:59:59Z');
        expect(newYearEve.success).toBe(true);
        expect(newYearEve.date?.getUTCMonth()).toBe(11);
        expect(newYearEve.date?.getUTCDate()).toBe(31);
      });

      it('should handle leap year dates', () => {
        const result = parseDate('2024-02-29T12:00:00Z');
        expect(result.success).toBe(true);
        expect(result.date?.getUTCMonth()).toBe(1);
        expect(result.date?.getUTCDate()).toBe(29);
      });
    });

    describe('Timezone handling', () => {
      it('should handle CET timezone', () => {
        const result = parseDate('23 Nov 2025 15:30:00 CET');
        expect(result.success).toBe(true);
        // CET is UTC+1
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should handle PST timezone', () => {
        const result = parseDate('23 Nov 2025 06:30:00 PST');
        expect(result.success).toBe(true);
        // PST is UTC-8
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });

      it('should handle UTC timezone', () => {
        const result = parseDate('23 Nov 2025 14:30:00 UTC');
        expect(result.success).toBe(true);
        expect(result.date?.toISOString()).toBe('2025-11-23T14:30:00.000Z');
      });
    });
  });

  describe('parseDateOrDefault', () => {
    it('should return parsed date on success', () => {
      const date = parseDateOrDefault('2025-11-23T14:30:00Z');
      expect(date.toISOString()).toBe('2025-11-23T14:30:00.000Z');
    });

    it('should return current date when parsing fails and no fallback', () => {
      const before = new Date();
      const date = parseDateOrDefault('invalid');
      const after = new Date();
      expect(date.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(date.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should return provided fallback when parsing fails', () => {
      const fallback = new Date('2020-01-01T00:00:00Z');
      const date = parseDateOrDefault('invalid', fallback);
      expect(date.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });
  });

  describe('parseDateToIsoString', () => {
    it('should return ISO string on success', () => {
      const result = parseDateToIsoString('Sat, 23 Nov 2025 14:30:00 GMT');
      expect(result).toBe('2025-11-23T14:30:00.000Z');
    });

    it('should return null on failure', () => {
      const result = parseDateToIsoString('invalid');
      expect(result).toBeNull();
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2025-11-23'))).toBe(true);
    });

    it('should return false for Invalid Date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-Date objects', () => {
      expect(isValidDate('2025-11-23' as unknown as Date)).toBe(false);
      expect(isValidDate(null as unknown as Date)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2025-11-23T14:30:00Z');
      const formatted = formatDate(date);
      // Norwegian format
      expect(formatted).toMatch(/23.*nov.*2025/i);
    });

    it('should format date with custom locale', () => {
      const date = new Date('2025-11-23T14:30:00Z');
      const formatted = formatDate(date, 'en-US');
      expect(formatted).toMatch(/nov.*23.*2025/i);
    });

    it('should format date with custom options', () => {
      const date = new Date('2025-11-23T14:30:00Z');
      const formatted = formatDate(date, 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
      expect(formatted).toContain('November');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatRelativeDate', () => {
    it('should format recent dates as relative', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const formatted = formatRelativeDate(fiveMinutesAgo, 'en-US');
      expect(formatted).toMatch(/5.*minute/i);
    });

    it('should format hour-old dates', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const formatted = formatRelativeDate(twoHoursAgo, 'en-US');
      expect(formatted).toMatch(/2.*hour/i);
    });

    it('should format day-old dates', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const formatted = formatRelativeDate(twoDaysAgo, 'en-US');
      expect(formatted).toMatch(/2.*day/i);
    });

    it('should format old dates as absolute', () => {
      const oldDate = new Date('2020-01-01');
      const formatted = formatRelativeDate(oldDate, 'en-US');
      // Should fall back to absolute date format
      expect(formatted).toMatch(/jan.*2020/i);
    });
  });

  describe('compareDates', () => {
    it('should sort dates descending by default', () => {
      const dates = [
        '2025-11-21T00:00:00Z',
        '2025-11-23T00:00:00Z',
        '2025-11-22T00:00:00Z',
      ];
      const sorted = [...dates].sort((a, b) => compareDates(a, b));
      expect(sorted).toEqual([
        '2025-11-23T00:00:00Z',
        '2025-11-22T00:00:00Z',
        '2025-11-21T00:00:00Z',
      ]);
    });

    it('should sort dates ascending when specified', () => {
      const dates = [
        '2025-11-21T00:00:00Z',
        '2025-11-23T00:00:00Z',
        '2025-11-22T00:00:00Z',
      ];
      const sorted = [...dates].sort((a, b) => compareDates(a, b, false));
      expect(sorted).toEqual([
        '2025-11-21T00:00:00Z',
        '2025-11-22T00:00:00Z',
        '2025-11-23T00:00:00Z',
      ]);
    });

    it('should handle invalid dates by treating them as epoch', () => {
      const dates = ['2025-11-23T00:00:00Z', 'invalid', '2025-11-22T00:00:00Z'];
      const sorted = [...dates].sort((a, b) => compareDates(a, b));
      // Invalid date becomes epoch (1970), so it goes to the end when descending
      expect(sorted[2]).toBe('invalid');
    });

    it('should return 0 for equal dates', () => {
      const result = compareDates('2025-11-23T14:30:00Z', '2025-11-23T14:30:00Z');
      expect(result).toBe(0);
    });
  });

  describe('Real-world feed date examples', () => {
    it('should parse NRK feed dates', () => {
      const result = parseDate('Sat, 23 Nov 2025 15:30:00 +0100');
      expect(result.success).toBe(true);
    });

    it('should parse BBC feed dates', () => {
      const result = parseDate('Sat, 23 Nov 2025 14:30:00 GMT');
      expect(result.success).toBe(true);
    });

    it('should parse YouTube feed dates (Atom)', () => {
      const result = parseDate('2025-11-23T14:30:00+00:00');
      expect(result.success).toBe(true);
    });

    it('should parse WordPress feed dates', () => {
      const result = parseDate('Sat, 23 Nov 2025 14:30:00 +0000');
      expect(result.success).toBe(true);
    });

    it('should parse Medium feed dates', () => {
      const result = parseDate('2025-11-23T14:30:00.000Z');
      expect(result.success).toBe(true);
    });

    it('should parse GitHub feed dates', () => {
      const result = parseDate('2025-11-23T14:30:00Z');
      expect(result.success).toBe(true);
    });

    it('should parse Meltwater-style dates', () => {
      // Meltwater often uses ISO 8601
      const result = parseDate('2025-11-23T14:30:00+01:00');
      expect(result.success).toBe(true);
    });

    it('should parse Retriever-style dates', () => {
      const result = parseDate('2025-11-23 14:30:00');
      // This should be handled by native Date or ISO parser
      expect(result.success).toBe(true);
    });
  });
});
