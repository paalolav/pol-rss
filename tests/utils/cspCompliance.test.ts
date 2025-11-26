/**
 * CSP Compliance Utility Tests
 *
 * Tests for Content Security Policy compliance validation.
 * @see REF-012-SECURITY-HARDENING.md ST-012-02
 */
import { CspCompliance } from '../../src/webparts/polRssGallery/utils/cspCompliance';

describe('CspCompliance', () => {
  describe('hasDangerousContent()', () => {
    it('should detect javascript: protocol', () => {
      expect(CspCompliance.hasDangerousContent('javascript:alert(1)')).toBe(true);
      expect(CspCompliance.hasDangerousContent('JAVASCRIPT:alert(1)')).toBe(true);
    });

    it('should detect vbscript: protocol', () => {
      expect(CspCompliance.hasDangerousContent('vbscript:alert(1)')).toBe(true);
    });

    it('should detect data:text/html', () => {
      expect(CspCompliance.hasDangerousContent('data:text/html,<script>alert(1)</script>')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(CspCompliance.hasDangerousContent('onclick=alert(1)')).toBe(true);
      expect(CspCompliance.hasDangerousContent('onerror="alert(1)"')).toBe(true);
      expect(CspCompliance.hasDangerousContent('onmouseover = alert(1)')).toBe(true);
    });

    it('should detect script tags', () => {
      expect(CspCompliance.hasDangerousContent('<script>alert(1)</script>')).toBe(true);
      expect(CspCompliance.hasDangerousContent('<SCRIPT>alert(1)</SCRIPT>')).toBe(true);
    });

    it('should detect CSS expression', () => {
      expect(CspCompliance.hasDangerousContent('expression(alert(1))')).toBe(true);
    });

    it('should detect CSS behavior', () => {
      expect(CspCompliance.hasDangerousContent('behavior: url(script.htc)')).toBe(true);
    });

    it('should not flag safe content', () => {
      expect(CspCompliance.hasDangerousContent('Hello, world!')).toBe(false);
      expect(CspCompliance.hasDangerousContent('<p>Safe paragraph</p>')).toBe(false);
      expect(CspCompliance.hasDangerousContent('https://example.com')).toBe(false);
    });

    it('should handle empty/null content', () => {
      expect(CspCompliance.hasDangerousContent('')).toBe(false);
      expect(CspCompliance.hasDangerousContent(null as unknown as string)).toBe(false);
      expect(CspCompliance.hasDangerousContent(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isSafeUrl()', () => {
    it('should allow https URLs', () => {
      expect(CspCompliance.isSafeUrl('https://example.com')).toBe(true);
    });

    it('should allow http URLs', () => {
      expect(CspCompliance.isSafeUrl('http://example.com')).toBe(true);
    });

    it('should allow mailto URLs', () => {
      expect(CspCompliance.isSafeUrl('mailto:test@example.com')).toBe(true);
    });

    it('should allow tel URLs', () => {
      expect(CspCompliance.isSafeUrl('tel:+1234567890')).toBe(true);
    });

    it('should allow relative URLs', () => {
      expect(CspCompliance.isSafeUrl('/page')).toBe(true);
      expect(CspCompliance.isSafeUrl('./page')).toBe(true);
      expect(CspCompliance.isSafeUrl('../page')).toBe(true);
    });

    it('should allow protocol-relative URLs', () => {
      expect(CspCompliance.isSafeUrl('//example.com/page')).toBe(true);
    });

    it('should block javascript: URLs', () => {
      expect(CspCompliance.isSafeUrl('javascript:alert(1)')).toBe(false);
    });

    it('should block data: URLs', () => {
      expect(CspCompliance.isSafeUrl('data:text/html,test')).toBe(false);
    });

    it('should handle empty URLs', () => {
      expect(CspCompliance.isSafeUrl('')).toBe(false);
      expect(CspCompliance.isSafeUrl(null as unknown as string)).toBe(false);
    });
  });

  describe('isSafeImageUrl()', () => {
    it('should allow https image URLs', () => {
      expect(CspCompliance.isSafeImageUrl('https://example.com/image.jpg')).toBe(true);
    });

    it('should allow http image URLs', () => {
      expect(CspCompliance.isSafeImageUrl('http://example.com/image.png')).toBe(true);
    });

    it('should allow data:image URLs', () => {
      expect(CspCompliance.isSafeImageUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
      expect(CspCompliance.isSafeImageUrl('data:image/gif;base64,R0lGODlh')).toBe(true);
    });

    it('should allow relative image URLs', () => {
      expect(CspCompliance.isSafeImageUrl('/images/logo.png')).toBe(true);
      expect(CspCompliance.isSafeImageUrl('./img/photo.jpg')).toBe(true);
    });

    it('should block data:text/html URLs', () => {
      expect(CspCompliance.isSafeImageUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should block javascript: URLs', () => {
      expect(CspCompliance.isSafeImageUrl('javascript:alert(1)')).toBe(false);
    });

    it('should handle empty URLs', () => {
      expect(CspCompliance.isSafeImageUrl('')).toBe(false);
      expect(CspCompliance.isSafeImageUrl(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidClassName()', () => {
    it('should allow valid class names', () => {
      expect(CspCompliance.isValidClassName('myClass')).toBe(true);
      expect(CspCompliance.isValidClassName('my-class')).toBe(true);
      expect(CspCompliance.isValidClassName('my_class')).toBe(true);
      expect(CspCompliance.isValidClassName('MyClass123')).toBe(true);
      expect(CspCompliance.isValidClassName('_private')).toBe(true);
      expect(CspCompliance.isValidClassName('-modifier')).toBe(true);
    });

    it('should reject invalid class names', () => {
      expect(CspCompliance.isValidClassName('123start')).toBe(false);
      expect(CspCompliance.isValidClassName('has space')).toBe(false);
      expect(CspCompliance.isValidClassName('<script>')).toBe(false);
      expect(CspCompliance.isValidClassName('class"quote')).toBe(false);
    });

    it('should handle empty values', () => {
      expect(CspCompliance.isValidClassName('')).toBe(false);
      expect(CspCompliance.isValidClassName(null as unknown as string)).toBe(false);
    });
  });

  describe('sanitizeClassNames()', () => {
    it('should pass through valid class names', () => {
      expect(CspCompliance.sanitizeClassNames('class1 class2')).toBe('class1 class2');
    });

    it('should filter out invalid class names', () => {
      expect(CspCompliance.sanitizeClassNames('valid <script> also-valid')).toBe('valid also-valid');
    });

    it('should handle empty string', () => {
      expect(CspCompliance.sanitizeClassNames('')).toBe('');
    });
  });

  describe('isSafeStyleValue()', () => {
    it('should allow simple style values', () => {
      expect(CspCompliance.isSafeStyleValue('red')).toBe(true);
      expect(CspCompliance.isSafeStyleValue('#ff0000')).toBe(true);
      expect(CspCompliance.isSafeStyleValue('100px')).toBe(true);
      expect(CspCompliance.isSafeStyleValue('bold')).toBe(true);
    });

    it('should block javascript in styles', () => {
      expect(CspCompliance.isSafeStyleValue('javascript:alert(1)')).toBe(false);
    });

    it('should block CSS expression', () => {
      expect(CspCompliance.isSafeStyleValue('expression(alert(1))')).toBe(false);
    });

    it('should block url() in styles', () => {
      expect(CspCompliance.isSafeStyleValue('url(image.jpg)')).toBe(false);
    });

    it('should block @import', () => {
      expect(CspCompliance.isSafeStyleValue('@import "evil.css"')).toBe(false);
    });

    it('should handle empty values', () => {
      expect(CspCompliance.isSafeStyleValue('')).toBe(false);
      expect(CspCompliance.isSafeStyleValue(null as unknown as string)).toBe(false);
    });
  });

  describe('createSafeStyles()', () => {
    it('should allow whitelisted properties', () => {
      const styles = CspCompliance.createSafeStyles({
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
      });

      expect(styles.color).toBe('red');
      expect(styles.fontSize).toBe('14px');
      expect(styles.marginTop).toBe('10px');
    });

    it('should filter out non-whitelisted properties', () => {
      const styles = CspCompliance.createSafeStyles({
        color: 'red',
        position: 'absolute', // Not whitelisted
        zIndex: 9999, // Not whitelisted
      });

      expect(styles.color).toBe('red');
      expect((styles as Record<string, unknown>).position).toBeUndefined();
      expect((styles as Record<string, unknown>).zIndex).toBeUndefined();
    });

    it('should filter out dangerous values', () => {
      const styles = CspCompliance.createSafeStyles({
        color: 'expression(alert(1))',
        fontSize: '14px',
      });

      expect((styles as Record<string, unknown>).color).toBeUndefined();
      expect(styles.fontSize).toBe('14px');
    });

    it('should handle numeric values', () => {
      const styles = CspCompliance.createSafeStyles({
        opacity: 0.5,
      });

      expect(styles.opacity).toBe(0.5);
    });
  });
});
