/**
 * Tests for ResponsiveGrid Component
 * @file tests/components/ResponsiveGrid.test.tsx
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsiveGrid, GridItem, GapSize } from '../../src/webparts/polRssGallery/components/ResponsiveGrid';

// Mock the useContainerSize hook
jest.mock('../../src/webparts/polRssGallery/hooks/useContainerSize', () => ({
  useContainerSize: jest.fn(() => ({
    width: 1000,
    height: 600,
    breakpoint: 'lg',
    containerBreakpoint: 'standard',
    columns: 3,
    isNarrow: false,
    isInitialized: true
  }))
}));

// Import the mock so we can manipulate it
import { useContainerSize } from '../../src/webparts/polRssGallery/hooks/useContainerSize';
const mockUseContainerSize = useContainerSize as jest.MockedFunction<typeof useContainerSize>;

describe('ResponsiveGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default mock value
    mockUseContainerSize.mockReturnValue({
      width: 1000,
      height: 600,
      breakpoint: 'lg',
      containerBreakpoint: 'standard',
      columns: 3,
      isNarrow: false,
      isInitialized: true
    });
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <ResponsiveGrid>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </ResponsiveGrid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render with default test ID', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(screen.getByTestId('responsive-grid')).toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(
        <ResponsiveGrid testId="my-grid">
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(screen.getByTestId('my-grid')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <ResponsiveGrid className="custom-class">
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveClass('custom-class');
    });

    it('should render without errors when centerItems is true', () => {
      const { container } = render(
        <ResponsiveGrid centerItems>
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(screen.getByTestId('responsive-grid')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="responsive-grid"]')).toBeTruthy();
    });

    it('should render without errors when centerItems is false', () => {
      const { container } = render(
        <ResponsiveGrid centerItems={false}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(screen.getByTestId('responsive-grid')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="responsive-grid"]')).toBeTruthy();
    });
  });

  describe('CSS custom properties', () => {
    it('should set --min-item-width with default value', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--min-item-width')).toBe('280px');
    });

    it('should set --min-item-width with custom value', () => {
      render(
        <ResponsiveGrid minItemWidth={350}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--min-item-width')).toBe('350px');
    });

    it('should set --max-columns based on maxColumns and available columns', () => {
      mockUseContainerSize.mockReturnValue({
        width: 1000,
        height: 600,
        breakpoint: 'lg',
        containerBreakpoint: 'standard',
        columns: 4,
        isNarrow: false,
        isInitialized: true
      });

      render(
        <ResponsiveGrid maxColumns={3}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--max-columns')).toBe('3');
    });

    it('should limit --max-columns to available columns when container is narrow', () => {
      mockUseContainerSize.mockReturnValue({
        width: 300,
        height: 400,
        breakpoint: 'xs',
        containerBreakpoint: 'narrow',
        columns: 1,
        isNarrow: true,
        isInitialized: true
      });

      render(
        <ResponsiveGrid maxColumns={4}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--max-columns')).toBe('1');
    });

    it.each<[GapSize, string]>([
      ['none', '0'],
      ['xs', 'var(--gap-xs, 4px)'],
      ['sm', 'var(--gap-sm, 8px)'],
      ['md', 'var(--gap-md, 16px)'],
      ['lg', 'var(--gap-lg, 24px)'],
      ['xl', 'var(--gap-xl, 32px)']
    ])('should set --grid-gap for gap="%s"', (gap, expectedValue) => {
      render(
        <ResponsiveGrid gap={gap}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--grid-gap')).toBe(expectedValue);
    });
  });

  describe('data attributes', () => {
    it('should set data-columns attribute', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.getAttribute('data-columns')).toBe('3');
    });

    it('should set data-width attribute', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.getAttribute('data-width')).toBe('1000');
    });
  });

  describe('column change callback', () => {
    it('should call onColumnsChange when columns change', () => {
      const onColumnsChange = jest.fn();

      const { rerender } = render(
        <ResponsiveGrid onColumnsChange={onColumnsChange}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      // Change the mock return value
      mockUseContainerSize.mockReturnValue({
        width: 600,
        height: 400,
        breakpoint: 'sm',
        containerBreakpoint: 'compact',
        columns: 2,
        isNarrow: false,
        isInitialized: true
      });

      rerender(
        <ResponsiveGrid onColumnsChange={onColumnsChange}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(onColumnsChange).toHaveBeenCalledWith(2);
    });

    it('should not call onColumnsChange when columns stay the same', () => {
      const onColumnsChange = jest.fn();

      const { rerender } = render(
        <ResponsiveGrid onColumnsChange={onColumnsChange}>
          <div>Content</div>
        </ResponsiveGrid>
      );

      // Rerender with same column count
      rerender(
        <ResponsiveGrid onColumnsChange={onColumnsChange}>
          <div>Updated Content</div>
        </ResponsiveGrid>
      );

      // Should not be called since columns didn't change
      expect(onColumnsChange).not.toHaveBeenCalled();
    });
  });

  describe('default props', () => {
    it('should use default minItemWidth of 280', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      expect(mockUseContainerSize).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ minItemWidth: 280 })
      );
    });

    it('should use default maxColumns of 4', () => {
      mockUseContainerSize.mockReturnValue({
        width: 2000,
        height: 800,
        breakpoint: 'xxl',
        containerBreakpoint: 'fullWidth',
        columns: 6,
        isNarrow: false,
        isInitialized: true
      });

      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      // maxColumns is 4, but columns from hook is 6, so should be 4
      expect(grid.style.getPropertyValue('--max-columns')).toBe('4');
    });

    it('should use default gap of "md"', () => {
      render(
        <ResponsiveGrid>
          <div>Content</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('responsive-grid');
      expect(grid.style.getPropertyValue('--grid-gap')).toBe('var(--gap-md, 16px)');
    });
  });
});

describe('GridItem', () => {
  it('should render children', () => {
    render(
      <GridItem>
        <span>Item content</span>
      </GridItem>
    );

    expect(screen.getByText('Item content')).toBeInTheDocument();
  });

  it('should wrap content in a div element', () => {
    render(
      <GridItem>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    // GridItem should wrap content in a div
    expect(content.parentElement?.tagName).toBe('DIV');
  });

  it('should apply custom className', () => {
    render(
      <GridItem className="custom-item">
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    expect(content.parentElement).toHaveClass('custom-item');
  });

  it('should not set gridColumn when span is 1', () => {
    render(
      <GridItem span={1}>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    expect(content.parentElement?.style.gridColumn).toBe('');
  });

  it('should set gridColumn span when span > 1', () => {
    render(
      <GridItem span={2}>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    expect(content.parentElement?.style.gridColumn).toBe('span 2');
  });

  it('should support span of 3', () => {
    render(
      <GridItem span={3}>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    expect(content.parentElement?.style.gridColumn).toBe('span 3');
  });

  it('should support span of 4', () => {
    render(
      <GridItem span={4}>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    expect(content.parentElement?.style.gridColumn).toBe('span 4');
  });

  it('should default span to 1', () => {
    render(
      <GridItem>
        <span data-testid="content">Content</span>
      </GridItem>
    );

    const content = screen.getByTestId('content');
    // When span is 1, no gridColumn style is set
    expect(content.parentElement?.style.gridColumn).toBe('');
  });
});

describe('ResponsiveGrid with GridItem', () => {
  it('should render GridItems within ResponsiveGrid', () => {
    render(
      <ResponsiveGrid>
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
      </ResponsiveGrid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should render mixed content (GridItems and regular elements)', () => {
    render(
      <ResponsiveGrid>
        <GridItem>Grid Item</GridItem>
        <div>Regular Div</div>
        <GridItem span={2}>Spanning Item</GridItem>
      </ResponsiveGrid>
    );

    expect(screen.getByText('Grid Item')).toBeInTheDocument();
    expect(screen.getByText('Regular Div')).toBeInTheDocument();
    expect(screen.getByText('Spanning Item')).toBeInTheDocument();
  });
});

describe('edge cases', () => {
  it('should handle zero width container gracefully', () => {
    mockUseContainerSize.mockReturnValue({
      width: 0,
      height: 0,
      breakpoint: 'xs',
      containerBreakpoint: 'narrow',
      columns: 1,
      isNarrow: true,
      isInitialized: true
    });

    render(
      <ResponsiveGrid>
        <div>Content</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('responsive-grid');
    expect(grid.style.getPropertyValue('--max-columns')).toBe('1');
  });

  it('should handle empty children', () => {
    render(
      <ResponsiveGrid>
        {null}
        {undefined}
        {false}
      </ResponsiveGrid>
    );

    expect(screen.getByTestId('responsive-grid')).toBeInTheDocument();
  });

  it('should handle single child', () => {
    render(
      <ResponsiveGrid>
        <div>Single Item</div>
      </ResponsiveGrid>
    );

    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });

  it('should handle many children', () => {
    const items = Array.from({ length: 100 }, (_, i) => (
      <div key={i}>Item {i + 1}</div>
    ));

    render(<ResponsiveGrid>{items}</ResponsiveGrid>);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 100')).toBeInTheDocument();
  });
});
