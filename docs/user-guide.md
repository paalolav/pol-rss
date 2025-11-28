# POL RSS Gallery - User Guide

> Version: 1.3.0
> For SharePoint page editors and content managers

This guide explains how to add and configure the POL RSS Gallery web part on your SharePoint pages.

## Table of Contents

1. [Adding the Web Part](#adding-the-web-part)
2. [Quick Start with Presets](#quick-start-with-presets)
3. [Configuration Options](#configuration-options)
4. [Layout Options](#layout-options)
5. [Display Settings](#display-settings)
6. [Tips and Best Practices](#tips-and-best-practices)

---

## Adding the Web Part

1. **Edit your SharePoint page** - Click "Edit" in the top right corner
2. **Add a web part** - Hover over a section and click the **+** button
3. **Search for the web part** - Type "RSS" or "POL RSS Gallery"
4. **Select the web part** - Click on "POL RSS Gallery" to add it
5. **Configure** - Click the pencil icon or the web part to open settings

---

## Quick Start with Presets

The easiest way to configure the web part is using **presets**. Presets are pre-configured templates for common use cases.

### Available Presets

| Preset | Best For | Description |
|--------|----------|-------------|
| **News Banner** | Hero sections | Full-width rotating carousel with large images |
| **Blog Grid** | Main content | Card grid with images and descriptions |
| **Compact List** | Sidebars | Space-efficient list view |
| **Photo Gallery** | Image-heavy feeds | Masonry grid showcasing images |
| **Custom** | Advanced users | Manual configuration of all settings |

### Using a Preset

1. Open web part settings
2. In "Basic Settings", click a preset button
3. Settings will be automatically configured
4. Enter your feed URL
5. Publish the page

---

## Configuration Options

### Basic Settings

#### Feed URL
The RSS or Atom feed URL you want to display.

**Examples:**
- `https://www.nrk.no/toppsaker.rss`
- `https://www.vg.no/rss/feed`
- `https://example.com/blog/feed.xml`

**Finding RSS Feeds:**
- Look for the RSS icon on websites
- Try adding `/feed`, `/rss`, or `/feed.xml` to a site URL
- Check the site's footer or "Subscribe" page

#### Title
Optional title displayed above the feed content. Leave blank to hide.

#### Maximum Items
Number of feed items to display (1-50). Default: 10.

**Recommendations:**
- Banner: 5-8 items
- Cards: 6-12 items
- List: 8-15 items
- Gallery: 12-24 items

### Display Settings

| Setting | Description |
|---------|-------------|
| **Show Date** | Display publication date for each item |
| **Show Description** | Display item summary/excerpt |
| **Show Source** | Display the feed/publication name (useful for aggregated feeds) |

### Image Settings

| Setting | Description |
|---------|-------------|
| **Force Fallback Image** | Always use the fallback image instead of feed images |
| **Fallback Image URL** | Image to display when items have no image |

### Banner Settings (Banner Layout Only)

| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Autoplay** | Automatically rotate through items | On |
| **Autoplay Interval** | Seconds between rotations | 5 |
| **Show Navigation** | Display previous/next arrows | On |
| **Show Pagination** | Display position dots | On |
| **Banner Height** | Height preset (Small/Medium/Large) | Medium |

### Gallery Settings (Gallery Layout Only)

| Setting | Description | Default |
|---------|-------------|---------|
| **Columns** | Number of columns (Auto/2/3/4) | Auto |
| **Title Position** | Where to show titles (Hover/Below/Hidden) | Hover |
| **Aspect Ratio** | Image shape (1:1/4:3/16:9) | 4:3 |
| **Gap Size** | Space between items (Small/Medium/Large) | Medium |

### Advanced Settings

| Setting | Description |
|---------|-------------|
| **Auto Refresh** | Enable automatic feed refresh |
| **Refresh Interval** | Minutes between refreshes (default: 5) |
| **Proxy URL** | Custom CORS proxy URL (contact admin if needed) |

---

## Layout Options

### Banner Layout

A full-width carousel that rotates through items. Best for:
- Hero sections
- Important news highlights
- Featured content

**Features:**
- Large images with overlay text
- Automatic rotation (configurable)
- Touch/swipe support
- Keyboard navigation

### Card Layout

A responsive grid of cards. Best for:
- Main content areas
- Blog feeds
- News listings

**Features:**
- Responsive columns (auto-adjusts to space)
- Images with title and description
- Equal-height cards
- Click anywhere to open article

### List Layout

A compact vertical list. Best for:
- Sidebars (1/3 column)
- Quick reference
- High-density content

**Features:**
- Small thumbnails
- Compact text
- Optional dividers
- Space-efficient

### Minimal Layout

Text-only list without images. Best for:
- Very narrow columns
- Text-focused content
- Maximum density

**Features:**
- No images
- Title and date only
- Very compact
- Fast loading

### Gallery Layout

A masonry-style image grid. Best for:
- Photo feeds
- Visual content
- Portfolio displays

**Features:**
- Images as hero content
- Hover effects with titles
- Responsive columns
- Configurable aspect ratios

---

## Display Settings

### Date Formatting

Dates are displayed in Norwegian format (e.g., "25. nov 2025").

### Source Display

When "Show Source" is enabled, the publication name appears next to the date:
```
25. nov 2025 | Finansavisen
```

This is especially useful for:
- Aggregated feeds (Meltwater, Retriever)
- Multi-source content
- News monitoring

---

## Tips and Best Practices

### Choosing the Right Layout

| Scenario | Recommended Layout |
|----------|-------------------|
| Homepage hero | Banner |
| News section (2-3 columns) | Cards |
| Sidebar widget | List or Minimal |
| Photography/visual content | Gallery |
| Mixed content | Cards |

### Performance Tips

1. **Limit items** - Fewer items = faster loading
2. **Use caching** - Enable auto-refresh with reasonable interval (5+ minutes)
3. **Optimize images** - Gallery layout loads many images; use reasonable counts

### Accessibility

The web part is WCAG 2.1 AA compliant:
- Full keyboard navigation
- Screen reader support
- High contrast mode compatible
- Respects user motion preferences

### Mobile Considerations

- Banner: Full-width, swipe-enabled
- Cards: Single column on phones
- List: Compact, thumb-friendly
- Gallery: Responsive columns

### Common Issues

| Issue | Solution |
|-------|----------|
| Feed won't load | Check URL is valid RSS/Atom; try proxy |
| No images showing | Feed may not have images; use fallback |
| Content looks wrong | Some feeds have limited data; try different layout |
| Old content showing | Wait for cache refresh or reduce refresh interval |

---

## Example Configurations

### News Banner (Homepage Hero)

- **Layout:** Banner
- **Items:** 5
- **Autoplay:** On, 5 seconds
- **Show Date:** Yes
- **Show Description:** No
- **Height:** Large

### Company Blog (Main Section)

- **Layout:** Cards
- **Items:** 9
- **Show Date:** Yes
- **Show Description:** Yes (truncated)
- **Show Source:** No

### Industry News (Sidebar)

- **Layout:** List
- **Items:** 8
- **Show Date:** Yes
- **Show Description:** No
- **Show Source:** Yes

### Photo Gallery (Visual Section)

- **Layout:** Gallery
- **Items:** 16
- **Columns:** Auto
- **Title Position:** Hover
- **Aspect Ratio:** 1:1
- **Gap:** Medium

---

## Need Help?

- **Feed not loading?** Contact your SharePoint administrator
- **Layout issues?** Try a different preset
- **Performance problems?** Reduce item count

For technical support, contact your IT department or SharePoint administrator.
