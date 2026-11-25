/**
 * Slug Utilities — URL-friendly collection slugs (academiqr.com/u/{username}/{slug})
 */

/**
 * Final slug: lowercase, accents stripped, spaces/underscores -> hyphens,
 * only [a-z0-9-], no leading/trailing/double hyphens.
 * "Pediatric Liver Tumors – CHOP" -> "pediatric-liver-tumors-chop"
 * @param {string} text
 * @param {number} [maxLength=60]
 * @returns {string} may be '' if nothing usable remains
 */
export function slugify(text, maxLength = 60) {
  return String(text ?? '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '') // é -> e
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength)
    .replace(/-+$/, '')
}

/**
 * Light cleanup while the user is typing: same character rules as slugify(), but keeps a
 * trailing hyphen so "my-" can become "my-talk".
 * @param {string} text
 * @returns {string}
 */
export function sanitizeSlugInput(text) {
  return String(text ?? '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
}

/**
 * The slug to save from the slug field. Leaves an existing slug untouched when the field
 * still holds it exactly (older slugs may contain spaces; re-cleaning them would silently
 * change the URL and break shared links).
 * @param {string} fieldValue
 * @param {string} currentSlug
 * @returns {string}
 */
export function slugFromField(fieldValue, currentSlug) {
  if (currentSlug && fieldValue === currentSlug) return currentSlug
  return slugify(fieldValue) || currentSlug
}
