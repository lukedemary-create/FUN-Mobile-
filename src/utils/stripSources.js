/**
 * Removes source URLs and website citations from text
 * @param {string} text - The response text
 * @returns {string} - Cleaned text without URLs
 */
export function stripSources(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Remove URL patterns (http/https)
  let cleaned = text.replace(/https?:\/\/[^\s\)]+/gi, '');
  
  // Remove markdown links [text](url)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove source citations like [sourcename.com] or (sourcename.com)
  cleaned = cleaned.replace(/[\[\(][^\]\)]*\.(com|org|net|edu|gov)[^\]\)]*[\]\)]/gi, '');
  
  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.trim();
  
  return cleaned;
}