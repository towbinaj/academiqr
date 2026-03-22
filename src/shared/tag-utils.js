/**
 * Tag Utilities — shared across dashboard, editor, and library
 * Tags are user-defined labels applied to collections and links.
 * All tags share one pool for autocomplete.
 */

const MAX_TAG_LENGTH = 30
const MAX_TAGS_PER_ITEM = 10

/**
 * Normalize a tag string: lowercase, trim, replace spaces with hyphens, strip invalid chars
 */
export function normalizeTag(tag) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .substring(0, MAX_TAG_LENGTH)
}

/**
 * Normalize and deduplicate an array of tags
 */
export function normalizeTags(tags) {
  if (!Array.isArray(tags)) return []
  const seen = new Set()
  return tags
    .map(normalizeTag)
    .filter(t => {
      if (!t || seen.has(t)) return false
      seen.add(t)
      return true
    })
    .slice(0, MAX_TAGS_PER_ITEM)
}

const TAG_CACHE_KEY = 'academiqr_tags_cache'
const TAG_CACHE_TTL = 60000 // 1 minute

/**
 * Get all unique tags from the user's collections and links.
 * Uses sessionStorage cache to avoid repeated queries.
 */
export async function getAllUserTags(supabase, userId) {
  // Check cache first
  try {
    const cached = sessionStorage.getItem(TAG_CACHE_KEY)
    if (cached) {
      const { tags, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < TAG_CACHE_TTL) return tags
    }
  } catch { /* ignore */ }
  const tags = new Set()

  // Collection tags from presentation_data JSONB
  const { data: collections } = await supabase
    .from('link_lists')
    .select('presentation_data')
    .eq('owner_id', userId)

  if (collections) {
    for (const c of collections) {
      const pd = c.presentation_data || {}
      if (Array.isArray(pd.tags)) {
        pd.tags.forEach(t => tags.add(t))
      }
    }
  }

  // Link tags from tags TEXT[] column (may not exist if migration hasn't run)
  try {
    const { data: links, error: linkErr } = await supabase
      .from('link_items')
      .select('tags, link_lists!inner(owner_id)')
      .eq('link_lists.owner_id', userId)
      .not('tags', 'eq', '{}')

    if (!linkErr && links) {
      for (const l of links) {
        if (Array.isArray(l.tags)) {
          l.tags.forEach(t => tags.add(t))
        }
      }
    }
  } catch {
    // tags column may not exist yet — skip link tags
  }

  const result = [...tags].sort()

  // Cache for subsequent page loads
  try {
    sessionStorage.setItem(TAG_CACHE_KEY, JSON.stringify({ tags: result, timestamp: Date.now() }))
  } catch { /* ignore */ }

  return result
}

/**
 * Invalidate the tag cache (call after adding/removing tags)
 */
export function invalidateTagCache() {
  try { sessionStorage.removeItem(TAG_CACHE_KEY) } catch { /* ignore */ }
}

/**
 * Render tag chips HTML
 * @param {string[]} tags
 * @param {Object} options
 * @param {boolean} options.removable - show × button
 * @param {boolean} options.clickable - make chips clickable for filtering
 * @param {string} options.activeTag - currently active filter tag
 */
export function renderTagChips(tags, options = {}) {
  if (!tags || tags.length === 0) return ''
  const { removable = false, clickable = false, activeTag = '' } = options

  return tags.map(tag => {
    const isActive = activeTag === tag
    const classes = ['tag-chip']
    if (clickable) classes.push('tag-clickable')
    if (isActive) classes.push('tag-active')

    return `<span class="${classes.join(' ')}" data-tag="${escapeAttr(tag)}">${escapeHtml(tag)}${removable ? ' <button class="tag-remove" data-tag="' + escapeAttr(tag) + '">&times;</button>' : ''}</span>`
  }).join('')
}

/**
 * Create a tag input with autocomplete
 * Appends an input + suggestion dropdown to the container.
 * @param {HTMLElement} container - element to append the input into
 * @param {string[]} allTags - all available tags for autocomplete
 * @param {string[]} currentTags - tags already applied (excluded from suggestions)
 * @param {Function} onAdd - callback when a tag is added: onAdd(tag)
 * @returns {{ destroy: Function }} cleanup handle
 */
export function createTagInput(container, allTags, currentTags, onAdd) {
  const wrapper = document.createElement('div')
  wrapper.className = 'tag-input-wrapper'
  wrapper.innerHTML = `
    <input type="text" class="tag-input" placeholder="Add tag..." maxlength="${MAX_TAG_LENGTH}">
  `
  container.appendChild(wrapper)

  // Append suggestions to body so it's never clipped by overflow containers
  const suggestions = document.createElement('div')
  suggestions.className = 'tag-suggestions'
  suggestions.style.display = 'none'
  document.body.appendChild(suggestions)

  const input = wrapper.querySelector('.tag-input')
  let currentTagSet = new Set(currentTags.map(t => t.toLowerCase()))

  function positionSuggestions() {
    const rect = input.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    suggestions.style.position = 'fixed'
    suggestions.style.left = rect.left + 'px'
    suggestions.style.width = Math.max(rect.width, 160) + 'px'

    if (spaceBelow < 160 && spaceAbove > spaceBelow) {
      // Open upward
      suggestions.style.bottom = (window.innerHeight - rect.top + 4) + 'px'
      suggestions.style.top = 'auto'
    } else {
      // Open downward
      suggestions.style.top = rect.bottom + 4 + 'px'
      suggestions.style.bottom = 'auto'
    }
  }

  function updateSuggestions() {
    const val = normalizeTag(input.value)
    if (!val) {
      suggestions.style.display = 'none'
      return
    }

    const matches = allTags
      .filter(t => t.includes(val) && !currentTagSet.has(t))
      .slice(0, 5)

    if (matches.length === 0) {
      suggestions.style.display = 'none'
      return
    }

    suggestions.innerHTML = matches.map(t =>
      `<div class="tag-suggestion-item" data-tag="${escapeAttr(t)}">${escapeHtml(t)}</div>`
    ).join('')
    suggestions.style.display = 'block'
    positionSuggestions()
  }

  function addTag(raw) {
    const tag = normalizeTag(raw)
    if (!tag || currentTagSet.has(tag)) return
    if (currentTagSet.size >= MAX_TAGS_PER_ITEM) return
    currentTagSet.add(tag)
    input.value = ''
    suggestions.style.display = 'none'
    onAdd(tag)
  }

  input.addEventListener('input', updateSuggestions)

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input.value)
    }
    if (e.key === 'Escape') {
      input.value = ''
      suggestions.style.display = 'none'
    }
  })

  suggestions.addEventListener('click', (e) => {
    const item = e.target.closest('.tag-suggestion-item')
    if (item) addTag(item.dataset.tag)
  })

  // Close suggestions on outside click
  function handleOutsideClick(e) {
    if (!wrapper.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.style.display = 'none'
    }
  }
  document.addEventListener('click', handleOutsideClick)

  return {
    destroy() {
      document.removeEventListener('click', handleOutsideClick)
      suggestions.remove()
      wrapper.remove()
    },
    updateCurrentTags(tags) {
      currentTagSet = new Set(tags.map(t => t.toLowerCase()))
    }
  }
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
