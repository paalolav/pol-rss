# POL RSS Gallery

A modern RSS feed web part for SharePoint Online with multiple layouts, caching, and enterprise-ready security.

![Version](https://img.shields.io/badge/version-1.3.0-blue)
![SPFx](https://img.shields.io/badge/SPFx-1.21-green)
![Node](https://img.shields.io/badge/node-%3E%3D22.14.0-brightgreen)
![Tests](https://img.shields.io/badge/tests-1685%20passing-success)

## Features

- **5 Layout Options**: Banner carousel, cards, list, minimal, and gallery (masonry)
- **Multi-Format Support**: RSS 2.0, RSS 1.0, Atom 1.0, JSON Feed
- **Source Display**: Show publication names for aggregated feeds
- **Responsive Design**: Mobile-first with container queries
- **Two-Tier Caching**: Memory + IndexedDB with stale-while-revalidate
- **Security Hardened**: DOMPurify sanitization, SSRF protection
- **WCAG 2.1 AA**: Full keyboard and screen reader support
- **Norwegian Localization**: Full support for nb-NO and nn-NO

## Quick Start

### Installation

1. Download `pol-rss-gallery.sppkg` from [Releases](#)
2. Upload to your SharePoint App Catalog
3. Trust and deploy the package
4. Add "POL RSS Gallery" to any page

### Configuration

1. Edit the page containing the web part
2. Select a **preset** for quick setup:
   - News Banner (carousel)
   - Blog Grid (cards)
   - Compact List
   - Photo Gallery
3. Enter your **Feed URL**
4. Customize display options as needed
5. Publish the page

## Layouts

| Layout | Best For | Description |
|--------|----------|-------------|
| **Banner** | Hero sections | Full-width rotating carousel |
| **Cards** | Main content | Responsive grid with images |
| **List** | Sidebars | Compact list with thumbnails |
| **Minimal** | Narrow columns | Text-only, maximum density |
| **Gallery** | Visual feeds | Masonry grid, images as hero |

## Documentation

- [User Guide](docs/user-guide.md) - Configuration and usage
- [Admin Guide](docs/admin-guide.md) - Deployment and proxy setup
- [Developer Docs](docs/developer.md) - Architecture and APIs
- [Changelog](CHANGELOG.md) - Version history

## Development

### Prerequisites

- Node.js >= 22.14.0 < 23.0.0
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/paalolav/pol-rss.git
cd pol-rss

# Install dependencies
npm install

# Start development server
gulp serve
```

### Build

```bash
# Bundle for production
gulp bundle --ship

# Create .sppkg package
gulp package-solution --ship
```

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## CORS Proxy (Optional)

For feeds that don't support CORS, deploy the included Azure Function proxy:

```bash
cd CORS-Proxy/scripts
./deploy.sh -g "rg-rss-proxy" -n "fn-rss-proxy-yourorg"
```

See [CORS-Proxy/README.md](CORS-Proxy/README.md) for detailed setup.

## Architecture

```
┌────────────────┐     ┌──────────────┐     ┌──────────────┐
│  SharePoint    │────>│  Azure Fn    │────>│  RSS Feed    │
│  (Web Part)    │<────│  CORS Proxy  │<────│  (External)  │
└────────────────┘     └──────────────┘     └──────────────┘
        │
        ▼
┌────────────────┐
│  Two-Tier      │
│  Cache         │
│  (Memory +     │
│   IndexedDB)   │
└────────────────┘
```

## Supported Feed Formats

| Format | Support |
|--------|---------|
| RSS 2.0 | Full |
| RSS 1.0 (RDF) | Full |
| Atom 1.0 | Full |
| JSON Feed 1.0/1.1 | Full |
| Malformed XML | Recovery mode |

## Browser Support

- Microsoft Edge (Chromium)
- Google Chrome
- Mozilla Firefox
- Safari (macOS/iOS)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## Support

- [Open an issue](https://github.com/paalolav/pol-rss/issues)
- Check [Troubleshooting](docs/admin-guide.md#troubleshooting)

---

Made with SharePoint Framework 1.21
