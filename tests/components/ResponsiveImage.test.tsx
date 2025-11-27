/**
 * Tests for ResponsiveImage Component
 * @file tests/components/ResponsiveImage.test.tsx
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ResponsiveImage,
  ImagePlaceholder,
  AspectRatio,
  ObjectFit
} from '../../src/webparts/polRssGallery/components/ResponsiveImage';

describe('ResponsiveImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image'
  };

  describe('rendering', () => {
    it('should render with required props', () => {
      render(<ResponsiveImage {...defaultProps} />);

      expect(screen.getByTestId('responsive-image')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-image-img')).toBeInTheDocument();
    });

    it('should render with correct alt text', () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('should render with correct src', () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should apply custom className', () => {
      render(<ResponsiveImage {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('responsive-image');
      expect(container).toHaveClass('custom-class');
    });

    it('should apply custom testId', () => {
      render(<ResponsiveImage {...defaultProps} testId="my-image" />);

      expect(screen.getByTestId('my-image')).toBeInTheDocument();
      expect(screen.getByTestId('my-image-img')).toBeInTheDocument();
    });
  });

  describe('aspect ratio', () => {
    it.each<[AspectRatio, string]>([
      ['16:9', '56.25%'],
      ['4:3', '75%'],
      ['1:1', '100%'],
      ['3:2', '66.67%'],
      ['21:9', '42.86%']
    ])('should apply %s aspect ratio with padding-bottom %s', (ratio, expectedPadding) => {
      render(<ResponsiveImage {...defaultProps} aspectRatio={ratio} />);

      const container = screen.getByTestId('responsive-image');
      expect(container).toHaveAttribute('data-aspect', ratio);
      expect(container.style.paddingBottom).toBe(expectedPadding);
    });

    it('should not apply padding-bottom for auto aspect ratio', () => {
      render(<ResponsiveImage {...defaultProps} aspectRatio="auto" />);

      const container = screen.getByTestId('responsive-image');
      expect(container).toHaveAttribute('data-aspect', 'auto');
      expect(container.style.paddingBottom).toBe('');
    });

    it('should use 16:9 as default aspect ratio', () => {
      render(<ResponsiveImage {...defaultProps} />);

      const container = screen.getByTestId('responsive-image');
      expect(container).toHaveAttribute('data-aspect', '16:9');
      expect(container.style.paddingBottom).toBe('56.25%');
    });
  });

  describe('loading strategy', () => {
    it('should use lazy loading by default', () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should use eager loading when specified', () => {
      render(<ResponsiveImage {...defaultProps} loading="eager" />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  describe('object fit', () => {
    it.each<ObjectFit>(['cover', 'contain', 'fill', 'none', 'scale-down'])(
      'should apply object-fit: %s',
      (fit) => {
        render(<ResponsiveImage {...defaultProps} objectFit={fit} />);

        const img = screen.getByTestId('responsive-image-img');
        expect(img.style.objectFit).toBe(fit);
      }
    );

    it('should use cover as default object-fit', () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img.style.objectFit).toBe('cover');
    });
  });

  describe('loading states', () => {
    it('should show skeleton during loading', () => {
      render(<ResponsiveImage {...defaultProps} />);

      expect(screen.getByTestId('responsive-image-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-image')).toHaveAttribute('data-state', 'loading');
    });

    it('should not show skeleton when showSkeleton is false', () => {
      render(<ResponsiveImage {...defaultProps} showSkeleton={false} />);

      expect(screen.queryByTestId('responsive-image-skeleton')).not.toBeInTheDocument();
    });

    it('should hide skeleton after image loads', async () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.load(img);

      await waitFor(() => {
        expect(screen.queryByTestId('responsive-image-skeleton')).not.toBeInTheDocument();
        expect(screen.getByTestId('responsive-image')).toHaveAttribute('data-state', 'loaded');
      });
    });

    it('should call onLoad callback when image loads', () => {
      const onLoad = jest.fn();
      render(<ResponsiveImage {...defaultProps} onLoad={onLoad} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should show error state when image fails to load', async () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId('responsive-image-error')).toBeInTheDocument();
        expect(screen.getByTestId('responsive-image')).toHaveAttribute('data-state', 'error');
      });
    });

    it('should call onError callback when image fails', () => {
      const onError = jest.fn();
      render(<ResponsiveImage {...defaultProps} onError={onError} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.error(img);

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should display accessible error message', async () => {
      render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.error(img);

      await waitFor(() => {
        const error = screen.getByTestId('responsive-image-error');
        expect(error).toHaveAttribute('role', 'img');
        expect(error).toHaveAttribute('aria-label', 'Test image');
      });
    });
  });

  describe('fallback image', () => {
    it('should try fallback when primary image fails', async () => {
      render(
        <ResponsiveImage
          {...defaultProps}
          fallbackSrc="https://example.com/fallback.jpg"
        />
      );

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');

      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId('responsive-image-img')).toHaveAttribute(
          'src',
          'https://example.com/fallback.jpg'
        );
      });
    });

    it('should show error if fallback also fails', async () => {
      render(
        <ResponsiveImage
          {...defaultProps}
          fallbackSrc="https://example.com/fallback.jpg"
        />
      );

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId('responsive-image-img')).toHaveAttribute(
          'src',
          'https://example.com/fallback.jpg'
        );
      });

      // Fallback also fails
      fireEvent.error(screen.getByTestId('responsive-image-img'));

      await waitFor(() => {
        expect(screen.getByTestId('responsive-image-error')).toBeInTheDocument();
      });
    });
  });

  describe('dimensions', () => {
    it('should apply width and height when provided', () => {
      render(<ResponsiveImage {...defaultProps} width={800} height={600} />);

      const img = screen.getByTestId('responsive-image-img');
      expect(img).toHaveAttribute('width', '800');
      expect(img).toHaveAttribute('height', '600');
    });
  });

  describe('src changes', () => {
    it('should reset state when src changes', () => {
      const { rerender } = render(<ResponsiveImage {...defaultProps} />);

      const img = screen.getByTestId('responsive-image-img');
      fireEvent.load(img);

      expect(screen.getByTestId('responsive-image')).toHaveAttribute('data-state', 'loaded');

      rerender(
        <ResponsiveImage {...defaultProps} src="https://example.com/new-image.jpg" />
      );

      expect(screen.getByTestId('responsive-image')).toHaveAttribute('data-state', 'loading');
      expect(screen.getByTestId('responsive-image-img')).toHaveAttribute(
        'src',
        'https://example.com/new-image.jpg'
      );
    });
  });
});

describe('ImagePlaceholder', () => {
  const defaultProps = {
    alt: 'Placeholder image'
  };

  it('should render with required props', () => {
    render(<ImagePlaceholder {...defaultProps} />);

    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
  });

  it('should have accessible role and label', () => {
    render(<ImagePlaceholder {...defaultProps} />);

    const placeholder = screen.getByTestId('image-placeholder');
    expect(placeholder).toHaveAttribute('role', 'img');
    expect(placeholder).toHaveAttribute('aria-label', 'Placeholder image');
  });

  it('should apply aspect ratio', () => {
    render(<ImagePlaceholder {...defaultProps} aspectRatio="16:9" />);

    const placeholder = screen.getByTestId('image-placeholder');
    expect(placeholder.style.paddingBottom).toBe('56.25%');
  });

  it('should render default icon', () => {
    render(<ImagePlaceholder {...defaultProps} />);

    expect(screen.getByText('📰')).toBeInTheDocument();
  });

  it('should render custom icon', () => {
    render(<ImagePlaceholder {...defaultProps} icon="🖼️" />);

    expect(screen.getByText('🖼️')).toBeInTheDocument();
  });

  it('should render custom React node as icon', () => {
    render(
      <ImagePlaceholder
        {...defaultProps}
        icon={<span data-testid="custom-icon">Custom</span>}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<ImagePlaceholder {...defaultProps} className="custom-placeholder" />);

    const placeholder = screen.getByTestId('image-placeholder');
    expect(placeholder).toHaveClass('custom-placeholder');
  });

  it('should apply custom testId', () => {
    render(<ImagePlaceholder {...defaultProps} testId="my-placeholder" />);

    expect(screen.getByTestId('my-placeholder')).toBeInTheDocument();
  });
});
