import { cleanDescription, resolveImageUrl, safeHref } from '../rssUtils';

describe('RSS content security controls', () => {
  test('allows only HTTP and HTTPS article links', () => {
    const scriptUrl = ['java', 'script:alert(1)'].join('');
    expect(safeHref('https://news.example/article')).toBe('https://news.example/article');
    expect(safeHref('http://news.example/article')).toBe('http://news.example/article');
    expect(safeHref(scriptUrl)).toBeUndefined();
    expect(safeHref('//attacker.example/phish')).toBeUndefined();
  });

  test('allows only HTTP and HTTPS image URLs', () => {
    const scriptUrl = ['java', 'script:alert(1)'].join('');
    expect(resolveImageUrl('https://images.example/photo.jpg?utm_source=rss')).toBe(
      'https://images.example/photo.jpg'
    );
    expect(resolveImageUrl('httpx://attacker.example/tracker')).toBeUndefined();
    expect(resolveImageUrl(scriptUrl)).toBeUndefined();
  });

  test('validates image URLs extracted from wrapper query parameters', () => {
    expect(
      resolveImageUrl(
        'https://proxy.example/image?url=https%3A%2F%2Fimages.example%2Fphoto.jpg'
      )
    ).toBe('https://images.example/photo.jpg');
    expect(
      resolveImageUrl(
        'https://proxy.example/image?url=httpx%3A%2F%2Fattacker.example%2Ftracker'
      )
    ).toBeUndefined();
  });

  test('removes executable description markup and attributes', () => {
    const scriptScheme = ['java', 'script:'].join('');
    const result = cleanDescription(
      // nosemgrep: javascript.lang.security.audit.unknown-value-with-script-tag.unknown-value-with-script-tag -- intentional sanitizer regression payload
      `<p>Safe <a href="${scriptScheme}alert(1)" onclick="alert(1)">link</a></p>` +
        '<script>alert(1)</script><iframe src="https://attacker.example"></iframe>'
    );

    expect(result).toContain('<p>Safe <a>link</a></p>');
    expect(result).not.toContain(scriptScheme);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('<iframe');
  });
});
