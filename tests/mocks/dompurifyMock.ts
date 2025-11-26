/**
 * DOMPurify Mock for Jest Tests
 *
 * Provides a simplified mock of DOMPurify for testing purposes.
 * This mock implements the core sanitization behavior for test validation.
 */

// Simple HTML sanitizer for testing
const sanitize = (dirty: string, config?: { ALLOWED_TAGS?: string[] }): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // If ALLOWED_TAGS is empty array, strip all tags
  if (config?.ALLOWED_TAGS?.length === 0) {
    return dirty.replace(/<[^>]*>/g, '');
  }

  // Remove script tags
  let clean = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and vbscript: URLs
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href=""');
  clean = clean.replace(/href\s*=\s*["']?\s*vbscript:[^"'>\s]*/gi, 'href=""');
  clean = clean.replace(/href\s*=\s*["']?\s*data:text\/html[^"'>\s]*/gi, 'href=""');

  // Remove dangerous src attributes
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""');
  clean = clean.replace(/src\s*=\s*["']?\s*data:text\/html[^"'>\s]*/gi, 'src=""');

  // Remove iframe, object, embed, form, input, button, textarea tags
  clean = clean.replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '');
  clean = clean.replace(/<iframe\b[^>]*>/gi, '');
  clean = clean.replace(/<object\b[^>]*>.*?<\/object>/gi, '');
  clean = clean.replace(/<object\b[^>]*>/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<form\b[^>]*>.*?<\/form>/gi, '');
  clean = clean.replace(/<input\b[^>]*>/gi, '');
  clean = clean.replace(/<button\b[^>]*>.*?<\/button>/gi, '');
  clean = clean.replace(/<textarea\b[^>]*>.*?<\/textarea>/gi, '');
  clean = clean.replace(/<select\b[^>]*>.*?<\/select>/gi, '');

  // Remove meta, link, base tags
  clean = clean.replace(/<meta\b[^>]*>/gi, '');
  clean = clean.replace(/<link\b[^>]*>/gi, '');
  clean = clean.replace(/<base\b[^>]*>/gi, '');
  clean = clean.replace(/<template\b[^>]*>.*?<\/template>/gi, '');

  // Remove svg with scripts or event handlers
  clean = clean.replace(/<svg\b[^>]*on\w+[^>]*>.*?<\/svg>/gi, '');
  clean = clean.replace(/<svg\b[^>]*on\w+[^>]*>/gi, '');
  clean = clean.replace(/<svg\b[^>]*>.*?<script.*?<\/svg>/gi, '');

  // Remove body, marquee, video, math with event handlers
  clean = clean.replace(/<body\b[^>]*on\w+[^>]*>/gi, '');
  clean = clean.replace(/<marquee\b[^>]*on\w+[^>]*>/gi, '');
  clean = clean.replace(/<video\b[^>]*>.*?<source[^>]*onerror[^>]*>.*?<\/video>/gi, '');
  clean = clean.replace(/<math\b[^>]*>.*?<\/math>/gi, '');

  // Remove style attributes
  clean = clean.replace(/\s+style\s*=\s*["'][^"']*["']/gi, '');

  // Remove empty hrefs that resulted from sanitization
  clean = clean.replace(/href=""\s*/gi, '');

  // Clean up empty tag attributes
  clean = clean.replace(/src=""\s*/gi, '');

  return clean;
};

const DOMPurifyMock = {
  sanitize,
  setConfig: jest.fn(),
  clearConfig: jest.fn(),
  isValidAttribute: jest.fn(() => true),
  addHook: jest.fn(),
  removeHook: jest.fn(),
  removeAllHooks: jest.fn(),
  version: '3.0.0',
};

export default DOMPurifyMock;
