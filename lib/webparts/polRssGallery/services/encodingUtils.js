/**
 * Encoding Utilities
 *
 * Handles proper character encoding detection and conversion for RSS feeds.
 * Many RSS feeds use ISO-8859-1 (Latin-1) encoding, which must be properly
 * decoded to display Norwegian characters (æ, ø, å) correctly.
 */
/**
 * Detect encoding from XML declaration or Content-Type header
 */
export function detectEncoding(contentTypeHeader, xmlContent) {
    // Check Content-Type header first
    if (contentTypeHeader) {
        const charsetMatch = contentTypeHeader.match(/charset=([^;,\s]+)/i);
        if (charsetMatch) {
            return normalizeEncodingName(charsetMatch[1]);
        }
    }
    // Check XML declaration in the first 200 bytes
    if (xmlContent && xmlContent.length > 0) {
        // Read first 200 bytes as ASCII to find the XML declaration
        const header = new TextDecoder('ascii').decode(xmlContent.slice(0, 200));
        const encodingMatch = header.match(/<\?xml[^>]*encoding=["']([^"']+)["']/i);
        if (encodingMatch) {
            return normalizeEncodingName(encodingMatch[1]);
        }
    }
    // Default to UTF-8
    return 'utf-8';
}
/**
 * Normalize encoding name to a valid TextDecoder label
 */
function normalizeEncodingName(encoding) {
    const normalized = encoding.toLowerCase().replace(/[_\s]/g, '-');
    // Map common encoding names to TextDecoder labels
    const encodingMap = {
        'iso-8859-1': 'iso-8859-1',
        'iso8859-1': 'iso-8859-1',
        'latin1': 'iso-8859-1',
        'latin-1': 'iso-8859-1',
        'windows-1252': 'windows-1252',
        'cp1252': 'windows-1252',
        'utf-8': 'utf-8',
        'utf8': 'utf-8',
    };
    return encodingMap[normalized] || normalized;
}
/**
 * Decode response body with proper encoding detection
 *
 * This is the main function to use instead of response.text()
 * when you need proper encoding support for non-UTF-8 feeds.
 */
export async function decodeResponseText(response) {
    // Get the raw bytes
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // Detect encoding from headers and content
    const contentType = response.headers.get('content-type');
    const encoding = detectEncoding(contentType, bytes);
    // Decode with the detected encoding
    try {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    }
    catch (_a) {
        // Fallback to UTF-8 if the detected encoding isn't supported
        console.warn(`[EncodingUtils] Unsupported encoding "${encoding}", falling back to UTF-8`);
        return new TextDecoder('utf-8').decode(bytes);
    }
}
/**
 * Check if content appears to have encoding issues
 * (useful for debugging)
 */
export function hasEncodingIssues(text) {
    // Check for common UTF-8 mojibake patterns from ISO-8859-1
    const mojibakePatterns = [
        /Ã¦/, // æ
        /Ã¸/, // ø
        /Ã¥/, // å
        /Ã†/, // Æ
        /Ã˜/, // Ø
        /Ã…/, // Å
        /\uFFFD/, // Replacement character
    ];
    return mojibakePatterns.some(pattern => pattern.test(text));
}
//# sourceMappingURL=encodingUtils.js.map