/**
 * Shared Link Utilities
 * Handles library link resolution and per-collection overrides
 *
 * Display priority for each field:
 *   1. custom_overrides (per-collection customization for any link)
 *   2. _resolved_* (synced from source via source_link_id + use_library_defaults)
 *   3. Direct columns (title, image_url, etc. — the "library" version)
 */
import { supabase } from './supabase.js'

/**
 * For links that have source_link_id and use_library_defaults=true,
 * fetch the source link's title/image and merge resolved values.
 * Sets _resolved_title, _resolved_image_url, _resolved_image_position, _resolved_image_scale
 * on each link object.
 *
 * @param {Array} links - Array of link objects from link_items
 */
export async function resolveLibraryDefaults(links) {
  const linked = links.filter(l => l.source_link_id && l.use_library_defaults)
  if (linked.length === 0) return

  const sourceIds = [...new Set(linked.map(l => l.source_link_id))]

  try {
    const { data, error } = await supabase
      .from('link_items')
      .select('id, title, image_url, image_position, image_scale')
      .in('id', sourceIds)

    if (error) throw error

    const sourceMap = new Map((data || []).map(s => [s.id, s]))

    for (const link of linked) {
      const src = sourceMap.get(link.source_link_id)
      if (src) {
        link._resolved_title = src.title
        link._resolved_image_url = src.image_url
        link._resolved_image_position = src.image_position
        link._resolved_image_scale = src.image_scale
      }
    }
  } catch (err) {
    console.error('[link-utils] Failed to resolve library defaults:', err)
    // Non-fatal — links will use their own cached values
  }
}

/**
 * Check if a link has per-collection custom overrides active
 * @param {object} link
 * @returns {boolean}
 */
export function hasCustomOverrides(link) {
  return link.custom_overrides != null && typeof link.custom_overrides === 'object'
}

/**
 * Get the display title for a link, respecting overrides and library defaults
 * @param {object} link
 * @returns {string}
 */
export function getDisplayTitle(link) {
  // 1. Per-collection custom override
  if (hasCustomOverrides(link) && 'title' in link.custom_overrides) {
    return link.custom_overrides.title || ''
  }
  // 2. Synced from source link (library defaults)
  if (link.use_library_defaults && link.source_link_id && link._resolved_title != null) {
    return link._resolved_title
  }
  // 3. Direct column (library version)
  return link.title || ''
}

/**
 * Get the display image URL for a link, respecting overrides and library defaults
 * @param {object} link
 * @returns {string|null}
 */
export function getDisplayImageUrl(link) {
  // 1. Per-collection custom override (use 'in' to support override-to-null)
  if (hasCustomOverrides(link) && 'image_url' in link.custom_overrides) {
    return link.custom_overrides.image_url || null
  }
  // 2. Synced from source link
  if (link.use_library_defaults && link.source_link_id && link._resolved_image_url !== undefined) {
    return link._resolved_image_url
  }
  // 3. Direct column
  return link.image_url || null
}

/**
 * Get the display image position for a link, respecting overrides and library defaults
 * @param {object} link
 * @returns {{ x: number, y: number }}
 */
export function getDisplayImagePosition(link) {
  if (hasCustomOverrides(link) && link.custom_overrides.image_position) {
    return link.custom_overrides.image_position
  }
  if (link.use_library_defaults && link.source_link_id && link._resolved_image_position) {
    return link._resolved_image_position
  }
  return link.image_position || link.imagePosition || { x: 50, y: 50 }
}

/**
 * Get the display image scale for a link, respecting overrides and library defaults
 * @param {object} link
 * @returns {number}
 */
export function getDisplayImageScale(link) {
  if (hasCustomOverrides(link) && link.custom_overrides.image_scale != null) {
    return link.custom_overrides.image_scale
  }
  if (link.use_library_defaults && link.source_link_id && link._resolved_image_scale != null) {
    return link._resolved_image_scale
  }
  return link.image_scale ?? link.imageScale ?? 100
}
