/**
 * Helper utility functions for score formatting and text sanitization.
 */

/**
 * Calculates integer percentage score
 * @param {number} score 
 * @param {number} total 
 * @returns {number} Percentage value (0 - 100)
 */
export function calculatePercentage(score, total) {
  if (!total || total <= 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Truncates text to max length with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
