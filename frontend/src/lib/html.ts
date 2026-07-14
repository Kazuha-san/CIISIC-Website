/**
 * Safely sanitizes an HTML string on the client side to prevent XSS.
 * Removes <script>, <iframe>, <style>, and JavaScript-based action attributes.
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') return html;
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove blacklisted elements
    const blacklist = ['script', 'iframe', 'object', 'embed', 'link', 'style', 'meta', 'base'];
    blacklist.forEach(tag => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });
    
    // Remove inline event handlers (on*) and javascript: URIs
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        const attrName = attr.name.toLowerCase();
        const attrVal = attr.value.trim().toLowerCase();
        
        if (attrName.startsWith('on') || attrVal.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return doc.body.innerHTML;
  } catch (e) {
    console.error('HTML sanitization error:', e);
    return html;
  }
}

/**
 * Strips all HTML tags from a string to return raw text.
 * Useful for card/table preview listings.
 */
export function stripHTML(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || '';
  } catch (e) {
    return html.replace(/<[^>]*>/g, '');
  }
}
