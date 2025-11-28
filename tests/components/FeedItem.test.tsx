/**
 * FeedItem Component Tests
 */

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IRssItem } from '../../src/webparts/polRssGallery/components/IRssItem';

// Mock styles - must be before component import
jest.mock('../../src/webparts/polRssGallery/components/shared/FeedItem/FeedItem.module.scss', () => {
  const styles = {
    feedItem: 'feedItem',
    card: 'card',
    list: 'list',
    banner: 'banner',
    inverted: 'inverted',
    imageLink: 'imageLink',
    imageWrapper: 'imageWrapper',
    image: 'image',
    content: 'content',
    title: 'title',
    titleLink: 'titleLink',
    meta: 'meta',
    date: 'date',
    source: 'source',
    description: 'description',
    categories: 'categories',
    category: 'category',
  };
  return { default: styles, ...styles };
});

// Mock the sanitizer
jest.mock('../../src/webparts/polRssGallery/services/contentSanitizer', () => ({
  sanitizer: {
    sanitize: (html: string) => html.replace(/<script.*?>.*?<\/script>/gi, '')
  }
}));

import { FeedItem, FeedItemVariant } from '../../src/webparts/polRssGallery/components/shared/FeedItem';

// Mock ResponsiveImage
jest.mock('../../src/webparts/polRssGallery/components/ResponsiveImage', () => ({
  ResponsiveImage: ({ src, alt, testId }: { src: string; alt: string; testId?: string }) => (
    <div data-testid={testId || 'responsive-image'} data-src={src}>{alt}</div>
  ),
  ImagePlaceholder: ({ alt, testId }: { alt: string; testId?: string }) => (
    <div data-testid={testId || 'image-placeholder'}>{alt}</div>
  )
}));

describe('FeedItem', () => {
  const mockItem: IRssItem = {
    title: 'Test Article Title',
    link: 'https://example.com/article',
    pubDate: '2024-01-15T10:00:00Z',
    description: '<p>This is the article description with <strong>HTML</strong>.</p>',
    imageUrl: 'https://example.com/image.jpg',
    author: 'John Doe',
    categories: ['News', 'Technology'],
    feedType: 'rss'
  };

  const variants: FeedItemVariant[] = ['card', 'list', 'banner'];

  describe('Rendering', () => {
    it.each(variants)('renders in %s variant', (variant) => {
      render(<FeedItem item={mockItem} variant={variant} testId="feed-item" />);

      const element = screen.getByTestId('feed-item');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-variant', variant);
    });

    it('renders title as a link', () => {
      render(<FeedItem item={mockItem} variant="card" />);

      const titleLink = screen.getByRole('link', { name: mockItem.title });
      expect(titleLink).toHaveAttribute('href', mockItem.link);
      expect(titleLink).toHaveAttribute('target', '_blank');
      expect(titleLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders image when showImage is true', () => {
      render(<FeedItem item={mockItem} variant="card" showImage testId="feed-item" />);

      expect(screen.getByTestId('feed-item-image')).toBeInTheDocument();
    });

    it('does not render image when showImage is false', () => {
      render(<FeedItem item={mockItem} variant="card" showImage={false} testId="feed-item" />);

      expect(screen.queryByTestId('feed-item-image')).not.toBeInTheDocument();
    });

    it('renders fallback placeholder when no image URL', () => {
      const itemWithoutImage = { ...mockItem, imageUrl: undefined };
      render(<FeedItem item={itemWithoutImage} variant="card" testId="feed-item" />);

      expect(screen.getByTestId('feed-item-placeholder')).toBeInTheDocument();
    });

    it('renders date when showDate is true', () => {
      render(<FeedItem item={mockItem} variant="card" showDate testId="feed-item" />);

      // Date should be formatted
      const dateElement = screen.getByText(/15/); // Part of the date
      expect(dateElement).toBeInTheDocument();
    });

    it('does not render date when showDate is false', () => {
      render(<FeedItem item={mockItem} variant="card" showDate={false} />);

      // Looking for time element which contains the date
      expect(screen.queryByRole('time')).not.toBeInTheDocument();
    });

    it('renders description when showDescription is true', () => {
      render(<FeedItem item={mockItem} variant="card" showDescription />);

      // Description should be plain text (HTML stripped)
      expect(screen.getByText(/This is the article description/)).toBeInTheDocument();
    });

    it('does not render description when showDescription is false', () => {
      render(<FeedItem item={mockItem} variant="card" showDescription={false} />);

      expect(screen.queryByText(/This is the article description/)).not.toBeInTheDocument();
    });

    it('renders categories when showCategories is true', () => {
      render(<FeedItem item={mockItem} variant="card" showCategories />);

      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('does not render categories when showCategories is false', () => {
      render(<FeedItem item={mockItem} variant="card" showCategories={false} />);

      expect(screen.queryByText('News')).not.toBeInTheDocument();
    });

    it('renders source when showSource is true', () => {
      render(<FeedItem item={mockItem} variant="card" showSource />);

      expect(screen.getByText(mockItem.author!)).toBeInTheDocument();
    });
  });

  describe('Text Truncation', () => {
    it('truncates title when maxChars is specified', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          titleTruncation={{ maxChars: 10 }}
        />
      );

      expect(screen.getByText('Test Artic…')).toBeInTheDocument();
    });

    it('truncates description when maxChars is specified', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          showDescription
          descriptionTruncation={{ maxChars: 20 }}
        />
      );

      // Description should be truncated
      const description = screen.getByText(/This is the article/);
      expect(description.textContent?.length).toBeLessThanOrEqual(21); // 20 chars + ellipsis
    });
  });

  describe('Click Handling', () => {
    it('calls onItemClick when clicked', () => {
      const handleClick = jest.fn();
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          onItemClick={handleClick}
          testId="feed-item"
        />
      );

      fireEvent.click(screen.getByTestId('feed-item'));
      expect(handleClick).toHaveBeenCalledWith(mockItem, expect.any(Object));
    });

    it('has role="button" when onItemClick is provided', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          onItemClick={() => {}}
          testId="feed-item"
        />
      );

      expect(screen.getByTestId('feed-item')).toHaveAttribute('role', 'button');
    });

    it('does not have role="button" when onItemClick is not provided', () => {
      render(<FeedItem item={mockItem} variant="card" testId="feed-item" />);

      expect(screen.getByTestId('feed-item')).not.toHaveAttribute('role', 'button');
    });

    it('handles keyboard navigation (Enter)', () => {
      const handleClick = jest.fn();
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          onItemClick={handleClick}
          testId="feed-item"
        />
      );

      fireEvent.keyDown(screen.getByTestId('feed-item'), { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });

    it('handles keyboard navigation (Space)', () => {
      const handleClick = jest.fn();
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          onItemClick={handleClick}
          testId="feed-item"
        />
      );

      fireEvent.keyDown(screen.getByTestId('feed-item'), { key: ' ' });
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Date Formatting', () => {
    it('formats date with Norwegian locale by default', () => {
      render(<FeedItem item={mockItem} variant="card" showDate testId="feed-item" />);

      // Should have a time element with dateTime attribute
      const timeElement = screen.getByTestId('feed-item').querySelector('time');
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('dateTime', mockItem.pubDate);
    });

    it('handles invalid date gracefully', () => {
      const itemWithInvalidDate = { ...mockItem, pubDate: 'invalid-date' };
      render(<FeedItem item={itemWithInvalidDate} variant="card" showDate />);

      // Should display the original string for invalid dates
      expect(screen.getByText('invalid-date')).toBeInTheDocument();
    });

    it('does not render date when pubDate is missing', () => {
      const itemWithoutDate = { ...mockItem, pubDate: undefined };
      render(<FeedItem item={itemWithoutDate} variant="card" showDate testId="feed-item" />);

      const timeElement = screen.getByTestId('feed-item').querySelector('time');
      expect(timeElement).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('uses fallback image URL when provided and no item image', () => {
      const itemWithoutImage = { ...mockItem, imageUrl: undefined };
      render(
        <FeedItem
          item={itemWithoutImage}
          variant="card"
          fallbackImageUrl="https://example.com/fallback.jpg"
          testId="feed-item"
        />
      );

      const image = screen.getByTestId('feed-item-image');
      expect(image).toHaveAttribute('data-src', 'https://example.com/fallback.jpg');
    });

    it('renders image as link when imageAsLink is true', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          imageAsLink
          testId="feed-item"
        />
      );

      const imageLink = screen.getByTestId('feed-item-image').closest('a');
      expect(imageLink).toHaveAttribute('href', mockItem.link);
      expect(imageLink).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Accessibility', () => {
    it('renders as an article element', () => {
      render(<FeedItem item={mockItem} variant="card" testId="feed-item" />);

      expect(screen.getByTestId('feed-item').tagName).toBe('ARTICLE');
    });

    it('has tabIndex when clickable', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          onItemClick={() => {}}
          testId="feed-item"
        />
      );

      expect(screen.getByTestId('feed-item')).toHaveAttribute('tabindex', '0');
    });

    it('time element has proper datetime attribute', () => {
      render(<FeedItem item={mockItem} variant="card" showDate testId="feed-item" />);

      const timeElement = screen.getByTestId('feed-item').querySelector('time');
      expect(timeElement).toHaveAttribute('dateTime', mockItem.pubDate);
    });
  });

  describe('CSS Classes', () => {
    it('applies variant via data attribute', () => {
      render(<FeedItem item={mockItem} variant="banner" testId="feed-item" />);

      expect(screen.getByTestId('feed-item')).toHaveAttribute('data-variant', 'banner');
    });

    it('applies custom className', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          className="custom-class"
          testId="feed-item"
        />
      );

      expect(screen.getByTestId('feed-item')).toHaveClass('custom-class');
    });

    it('applies inverted class when isInverted is true', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          isInverted={true}
          testId="feed-item"
        />
      );

      const element = screen.getByTestId('feed-item');
      expect(element).toHaveClass('inverted');
    });

    it('does not apply inverted class when isInverted is false', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="card"
          isInverted={false}
          testId="feed-item"
        />
      );

      const element = screen.getByTestId('feed-item');
      expect(element).not.toHaveClass('inverted');
    });

    it('applies inverted class for list variant on strong background', () => {
      render(
        <FeedItem
          item={mockItem}
          variant="list"
          isInverted
          testId="feed-item"
        />
      );

      const element = screen.getByTestId('feed-item');
      expect(element).toHaveClass('inverted');
      expect(element).toHaveClass('list');
    });
  });

  describe('Edge Cases', () => {
    it('handles item without categories', () => {
      const itemWithoutCategories = { ...mockItem, categories: undefined };
      render(
        <FeedItem
          item={itemWithoutCategories}
          variant="card"
          showCategories
          testId="feed-item"
        />
      );

      // Should not throw and should not render categories section
      expect(screen.queryByText('News')).not.toBeInTheDocument();
    });

    it('handles item with empty categories array', () => {
      const itemWithEmptyCategories = { ...mockItem, categories: [] };
      render(
        <FeedItem
          item={itemWithEmptyCategories}
          variant="card"
          showCategories
          testId="feed-item"
        />
      );

      // Should not throw and should not render categories section
      expect(screen.queryByText('News')).not.toBeInTheDocument();
    });

    it('handles item without description', () => {
      const itemWithoutDescription = { ...mockItem, description: undefined };
      render(
        <FeedItem
          item={itemWithoutDescription}
          variant="card"
          showDescription
          testId="feed-item"
        />
      );

      // Should not throw - verify component renders
      expect(screen.getByTestId('feed-item')).toBeInTheDocument();
      // Title should be in the heading
      const title = screen.getByRole('heading', { name: mockItem.title });
      expect(title).toBeInTheDocument();
    });

    it('handles HTML entities in description', () => {
      const itemWithEntities = {
        ...mockItem,
        description: 'Test &amp; description with &lt;entities&gt;'
      };
      render(
        <FeedItem
          item={itemWithEntities}
          variant="card"
          showDescription
          testId="feed-item"
        />
      );

      expect(screen.getByText(/Test & description/)).toBeInTheDocument();
    });
  });
});
