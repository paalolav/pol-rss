/**
 * Tests for Responsive Breakpoints System
 * @file tests/utils/breakpoints.test.ts
 */

import {
  breakpoints,
  breakpointNames,
  getBreakpoint,
  isAtBreakpoint,
  isBelowBreakpoint,
  isBetweenBreakpoints,
  minWidth,
  maxWidth,
  betweenWidths,
  getResponsiveValue,
  containerBreakpoints,
  getContainerBreakpoint,
  getRecommendedColumns,
  isMobileLayout,
  isTabletLayout,
  isDesktopLayout,
  BreakpointName,
  ResponsiveValue
} from '../../src/webparts/polRssGallery/utils/breakpoints';

describe('Breakpoints Constants', () => {
  describe('breakpoints object', () => {
    it('should have correct breakpoint values', () => {
      expect(breakpoints.xs).toBe(320);
      expect(breakpoints.sm).toBe(480);
      expect(breakpoints.md).toBe(768);
      expect(breakpoints.lg).toBe(1024);
      expect(breakpoints.xl).toBe(1280);
      expect(breakpoints.xxl).toBe(1440);
    });

    it('should have breakpoints in ascending order', () => {
      const values = Object.values(breakpoints);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });

  describe('breakpointNames array', () => {
    it('should contain all breakpoint names in order', () => {
      expect(breakpointNames).toEqual(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);
    });

    it('should have the same length as breakpoints object', () => {
      expect(breakpointNames.length).toBe(Object.keys(breakpoints).length);
    });
  });

  describe('containerBreakpoints object', () => {
    it('should have correct container breakpoint values', () => {
      expect(containerBreakpoints.narrow).toBe(256);
      expect(containerBreakpoints.compact).toBe(384);
      expect(containerBreakpoints.standard).toBe(768);
      expect(containerBreakpoints.wide).toBe(1200);
      expect(containerBreakpoints.fullWidth).toBe(1440);
    });
  });
});

describe('getBreakpoint', () => {
  it('should return "xs" for widths below 480px', () => {
    expect(getBreakpoint(0)).toBe('xs');
    expect(getBreakpoint(319)).toBe('xs');
    expect(getBreakpoint(320)).toBe('xs');
    expect(getBreakpoint(400)).toBe('xs');
    expect(getBreakpoint(479)).toBe('xs');
  });

  it('should return "sm" for widths 480-767px', () => {
    expect(getBreakpoint(480)).toBe('sm');
    expect(getBreakpoint(600)).toBe('sm');
    expect(getBreakpoint(767)).toBe('sm');
  });

  it('should return "md" for widths 768-1023px', () => {
    expect(getBreakpoint(768)).toBe('md');
    expect(getBreakpoint(900)).toBe('md');
    expect(getBreakpoint(1023)).toBe('md');
  });

  it('should return "lg" for widths 1024-1279px', () => {
    expect(getBreakpoint(1024)).toBe('lg');
    expect(getBreakpoint(1100)).toBe('lg');
    expect(getBreakpoint(1279)).toBe('lg');
  });

  it('should return "xl" for widths 1280-1439px', () => {
    expect(getBreakpoint(1280)).toBe('xl');
    expect(getBreakpoint(1350)).toBe('xl');
    expect(getBreakpoint(1439)).toBe('xl');
  });

  it('should return "xxl" for widths 1440px and above', () => {
    expect(getBreakpoint(1440)).toBe('xxl');
    expect(getBreakpoint(1920)).toBe('xxl');
    expect(getBreakpoint(2560)).toBe('xxl');
  });

  it('should handle edge cases at exact breakpoint boundaries', () => {
    expect(getBreakpoint(breakpoints.sm)).toBe('sm');
    expect(getBreakpoint(breakpoints.md)).toBe('md');
    expect(getBreakpoint(breakpoints.lg)).toBe('lg');
    expect(getBreakpoint(breakpoints.xl)).toBe('xl');
    expect(getBreakpoint(breakpoints.xxl)).toBe('xxl');
  });

  it('should handle negative widths as xs', () => {
    expect(getBreakpoint(-100)).toBe('xs');
  });
});

describe('isAtBreakpoint', () => {
  it('should return true when width is at or above breakpoint', () => {
    expect(isAtBreakpoint(768, 'md')).toBe(true);
    expect(isAtBreakpoint(1024, 'md')).toBe(true);
    expect(isAtBreakpoint(1920, 'md')).toBe(true);
  });

  it('should return false when width is below breakpoint', () => {
    expect(isAtBreakpoint(767, 'md')).toBe(false);
    expect(isAtBreakpoint(400, 'md')).toBe(false);
    expect(isAtBreakpoint(0, 'md')).toBe(false);
  });

  it('should work for all breakpoints', () => {
    const widths = { xs: 320, sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1440 };
    Object.entries(widths).forEach(([bp, value]) => {
      expect(isAtBreakpoint(value, bp as BreakpointName)).toBe(true);
      expect(isAtBreakpoint(value - 1, bp as BreakpointName)).toBe(false);
    });
  });
});

describe('isBelowBreakpoint', () => {
  it('should return true when width is below breakpoint', () => {
    expect(isBelowBreakpoint(767, 'md')).toBe(true);
    expect(isBelowBreakpoint(400, 'md')).toBe(true);
    expect(isBelowBreakpoint(0, 'md')).toBe(true);
  });

  it('should return false when width is at or above breakpoint', () => {
    expect(isBelowBreakpoint(768, 'md')).toBe(false);
    expect(isBelowBreakpoint(1024, 'md')).toBe(false);
    expect(isBelowBreakpoint(1920, 'md')).toBe(false);
  });

  it('should be the inverse of isAtBreakpoint', () => {
    const testWidths = [0, 319, 320, 479, 480, 767, 768, 1023, 1024, 1279, 1280, 1439, 1440];
    testWidths.forEach(width => {
      expect(isBelowBreakpoint(width, 'md')).toBe(!isAtBreakpoint(width, 'md'));
    });
  });
});

describe('isBetweenBreakpoints', () => {
  it('should return true for widths in range (inclusive start, exclusive end)', () => {
    expect(isBetweenBreakpoints(768, 'md', 'lg')).toBe(true);
    expect(isBetweenBreakpoints(900, 'md', 'lg')).toBe(true);
    expect(isBetweenBreakpoints(1023, 'md', 'lg')).toBe(true);
  });

  it('should return false for widths outside range', () => {
    expect(isBetweenBreakpoints(767, 'md', 'lg')).toBe(false); // below start
    expect(isBetweenBreakpoints(1024, 'md', 'lg')).toBe(false); // at end (exclusive)
    expect(isBetweenBreakpoints(1200, 'md', 'lg')).toBe(false); // above end
  });

  it('should handle different breakpoint ranges', () => {
    expect(isBetweenBreakpoints(500, 'sm', 'md')).toBe(true);
    expect(isBetweenBreakpoints(1300, 'xl', 'xxl')).toBe(true);
    expect(isBetweenBreakpoints(350, 'xs', 'sm')).toBe(true);
  });
});

describe('Media Query Generators', () => {
  describe('minWidth', () => {
    it('should generate correct min-width media query', () => {
      expect(minWidth('md')).toBe('(min-width: 768px)');
      expect(minWidth('lg')).toBe('(min-width: 1024px)');
      expect(minWidth('xs')).toBe('(min-width: 320px)');
    });
  });

  describe('maxWidth', () => {
    it('should generate correct max-width media query (breakpoint - 1)', () => {
      expect(maxWidth('md')).toBe('(max-width: 767px)');
      expect(maxWidth('lg')).toBe('(max-width: 1023px)');
      expect(maxWidth('sm')).toBe('(max-width: 479px)');
    });
  });

  describe('betweenWidths', () => {
    it('should generate correct range media query', () => {
      expect(betweenWidths('md', 'lg')).toBe('(min-width: 768px) and (max-width: 1023px)');
      expect(betweenWidths('sm', 'md')).toBe('(min-width: 480px) and (max-width: 767px)');
      expect(betweenWidths('lg', 'xl')).toBe('(min-width: 1024px) and (max-width: 1279px)');
    });
  });
});

describe('getResponsiveValue', () => {
  it('should return base value when no breakpoint-specific value matches', () => {
    const values: ResponsiveValue<number> = { base: 1 };
    expect(getResponsiveValue(100, values)).toBe(1);
    expect(getResponsiveValue(1920, values)).toBe(1);
  });

  it('should return breakpoint-specific value when width matches', () => {
    const values: ResponsiveValue<number> = {
      base: 1,
      md: 2,
      lg: 3
    };
    expect(getResponsiveValue(300, values)).toBe(1);  // below md
    expect(getResponsiveValue(768, values)).toBe(2);  // at md
    expect(getResponsiveValue(900, values)).toBe(2);  // above md, below lg
    expect(getResponsiveValue(1024, values)).toBe(3); // at lg
    expect(getResponsiveValue(1920, values)).toBe(3); // above lg
  });

  it('should use highest matching breakpoint value', () => {
    const values: ResponsiveValue<string> = {
      base: 'base',
      sm: 'small',
      md: 'medium',
      lg: 'large',
      xl: 'extra-large'
    };
    expect(getResponsiveValue(1280, values)).toBe('extra-large');
    expect(getResponsiveValue(1025, values)).toBe('large');
    expect(getResponsiveValue(769, values)).toBe('medium');
    expect(getResponsiveValue(481, values)).toBe('small');
  });

  it('should work with different value types', () => {
    const boolValues: ResponsiveValue<boolean> = {
      base: false,
      lg: true
    };
    expect(getResponsiveValue(600, boolValues)).toBe(false);
    expect(getResponsiveValue(1200, boolValues)).toBe(true);

    const objectValues: ResponsiveValue<{ cols: number }> = {
      base: { cols: 1 },
      md: { cols: 2 },
      lg: { cols: 3 }
    };
    expect(getResponsiveValue(500, objectValues)).toEqual({ cols: 1 });
    expect(getResponsiveValue(800, objectValues)).toEqual({ cols: 2 });
    expect(getResponsiveValue(1100, objectValues)).toEqual({ cols: 3 });
  });
});

describe('getContainerBreakpoint', () => {
  it('should return "narrow" for widths below 384px', () => {
    expect(getContainerBreakpoint(200)).toBe('narrow');
    expect(getContainerBreakpoint(256)).toBe('narrow');
    expect(getContainerBreakpoint(383)).toBe('narrow');
  });

  it('should return "compact" for widths 384-767px', () => {
    expect(getContainerBreakpoint(384)).toBe('compact');
    expect(getContainerBreakpoint(500)).toBe('compact');
    expect(getContainerBreakpoint(767)).toBe('compact');
  });

  it('should return "standard" for widths 768-1199px', () => {
    expect(getContainerBreakpoint(768)).toBe('standard');
    expect(getContainerBreakpoint(1000)).toBe('standard');
    expect(getContainerBreakpoint(1199)).toBe('standard');
  });

  it('should return "wide" for widths 1200-1439px', () => {
    expect(getContainerBreakpoint(1200)).toBe('wide');
    expect(getContainerBreakpoint(1300)).toBe('wide');
    expect(getContainerBreakpoint(1439)).toBe('wide');
  });

  it('should return "fullWidth" for widths 1440px and above', () => {
    expect(getContainerBreakpoint(1440)).toBe('fullWidth');
    expect(getContainerBreakpoint(1920)).toBe('fullWidth');
    expect(getContainerBreakpoint(2560)).toBe('fullWidth');
  });
});

describe('getRecommendedColumns', () => {
  it('should return 1 column for very narrow containers', () => {
    expect(getRecommendedColumns(200)).toBe(1);
    expect(getRecommendedColumns(279)).toBe(1);
  });

  it('should return correct columns based on minItemWidth', () => {
    // Default minItemWidth is 280
    expect(getRecommendedColumns(280)).toBe(1);
    expect(getRecommendedColumns(560)).toBe(2);
    expect(getRecommendedColumns(840)).toBe(3);
    expect(getRecommendedColumns(1120)).toBe(4); // Max is 4
  });

  it('should cap at 4 columns', () => {
    expect(getRecommendedColumns(1920)).toBe(4);
    expect(getRecommendedColumns(2560)).toBe(4);
  });

  it('should respect custom minItemWidth', () => {
    expect(getRecommendedColumns(600, 200)).toBe(3);
    expect(getRecommendedColumns(600, 300)).toBe(2);
    expect(getRecommendedColumns(600, 400)).toBe(1);
  });

  it('should never return less than 1 column', () => {
    expect(getRecommendedColumns(0)).toBe(1);
    expect(getRecommendedColumns(50)).toBe(1);
    expect(getRecommendedColumns(-100)).toBe(1);
  });
});

describe('Layout Type Detection', () => {
  describe('isMobileLayout', () => {
    it('should return true for widths below 480px', () => {
      expect(isMobileLayout(0)).toBe(true);
      expect(isMobileLayout(320)).toBe(true);
      expect(isMobileLayout(479)).toBe(true);
    });

    it('should return false for widths 480px and above', () => {
      expect(isMobileLayout(480)).toBe(false);
      expect(isMobileLayout(768)).toBe(false);
      expect(isMobileLayout(1920)).toBe(false);
    });
  });

  describe('isTabletLayout', () => {
    it('should return true for widths 480-1023px', () => {
      expect(isTabletLayout(480)).toBe(true);
      expect(isTabletLayout(768)).toBe(true);
      expect(isTabletLayout(1023)).toBe(true);
    });

    it('should return false for widths below 480px', () => {
      expect(isTabletLayout(0)).toBe(false);
      expect(isTabletLayout(320)).toBe(false);
      expect(isTabletLayout(479)).toBe(false);
    });

    it('should return false for widths 1024px and above', () => {
      expect(isTabletLayout(1024)).toBe(false);
      expect(isTabletLayout(1920)).toBe(false);
    });
  });

  describe('isDesktopLayout', () => {
    it('should return true for widths 1024px and above', () => {
      expect(isDesktopLayout(1024)).toBe(true);
      expect(isDesktopLayout(1280)).toBe(true);
      expect(isDesktopLayout(1920)).toBe(true);
    });

    it('should return false for widths below 1024px', () => {
      expect(isDesktopLayout(0)).toBe(false);
      expect(isDesktopLayout(768)).toBe(false);
      expect(isDesktopLayout(1023)).toBe(false);
    });
  });

  describe('layout type mutual exclusivity', () => {
    it('should have exactly one layout type true for any width', () => {
      const testWidths = [0, 320, 479, 480, 768, 1023, 1024, 1920];

      testWidths.forEach(width => {
        const mobile = isMobileLayout(width);
        const tablet = isTabletLayout(width);
        const desktop = isDesktopLayout(width);

        const trueCount = [mobile, tablet, desktop].filter(Boolean).length;
        expect(trueCount).toBe(1);
      });
    });
  });
});

describe('TypeScript Types', () => {
  it('should allow valid breakpoint names', () => {
    const validNames: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    validNames.forEach(name => {
      expect(breakpoints[name]).toBeDefined();
    });
  });

  it('should allow ResponsiveValue with base and optional breakpoints', () => {
    const value: ResponsiveValue<number> = {
      base: 0,
      md: 1,
      lg: 2
    };
    expect(value.base).toBe(0);
    expect(value.md).toBe(1);
    expect(value.lg).toBe(2);
    expect(value.xs).toBeUndefined();
  });
});

describe('Edge Cases', () => {
  it('should handle zero width', () => {
    expect(getBreakpoint(0)).toBe('xs');
    expect(isAtBreakpoint(0, 'xs')).toBe(false); // 0 < 320
    expect(isBelowBreakpoint(0, 'xs')).toBe(true);
    expect(getContainerBreakpoint(0)).toBe('narrow');
    expect(getRecommendedColumns(0)).toBe(1);
  });

  it('should handle very large widths', () => {
    const largeWidth = 10000;
    expect(getBreakpoint(largeWidth)).toBe('xxl');
    expect(isAtBreakpoint(largeWidth, 'xxl')).toBe(true);
    expect(isDesktopLayout(largeWidth)).toBe(true);
    expect(getContainerBreakpoint(largeWidth)).toBe('fullWidth');
    expect(getRecommendedColumns(largeWidth)).toBe(4); // capped at 4
  });

  it('should handle decimal widths', () => {
    expect(getBreakpoint(767.5)).toBe('sm');
    expect(getBreakpoint(768.5)).toBe('md');
    expect(isAtBreakpoint(767.999, 'md')).toBe(false);
    expect(isAtBreakpoint(768.001, 'md')).toBe(true);
  });
});
