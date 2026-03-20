/**
 * Security utilities for input sanitization
 */

/** Validate a CSS color value (hex, rgb, rgba, hsl, hsla, named colors) */
export function sanitizeCSSColor(value) {
  if (!value || typeof value !== 'string') return ''
  const v = value.trim()
  // Allow hex colors
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v
  // Allow rgb/rgba/hsl/hsla
  if (/^(rgb|rgba|hsl|hsla)\([^)]+\)$/.test(v)) return v
  // Allow common named colors
  const named = ['transparent', 'white', 'black', 'red', 'blue', 'green', 'gray', 'grey', 'inherit', 'currentColor']
  if (named.includes(v.toLowerCase())) return v
  return ''
}

/** Validate a CSS gradient value */
export function sanitizeCSSGradient(value) {
  if (!value || typeof value !== 'string') return ''
  const v = value.trim()
  // Must start with linear-gradient, radial-gradient, or conic-gradient
  if (/^(linear|radial|conic)-gradient\(/.test(v)) {
    // Must not contain semicolons, curly braces, or url() — prevents injection
    if (/[;{}]|url\s*\(/.test(v)) return ''
    return v
  }
  return ''
}

/** Validate a CSS URL (must be https Supabase storage or data: URI) */
export function sanitizeCSSUrl(value) {
  if (!value || typeof value !== 'string') return ''
  const v = value.trim()
  // Allow data: URIs for images
  if (v.startsWith('data:image/')) return v
  // Allow Supabase storage URLs only
  try {
    const url = new URL(v)
    if (url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')) return v
  } catch { /* invalid URL */ }
  return ''
}

/** Validate a URL is safe (https protocol only, no javascript:) */
export function sanitizeUrl(value) {
  if (!value || typeof value !== 'string') return ''
  const v = value.trim()
  if (!v) return ''
  try {
    const url = new URL(v.startsWith('http') ? v : 'https://' + v)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString()
  } catch { /* invalid */ }
  return ''
}
