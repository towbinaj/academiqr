/**
 * Link Library Page — Master list of all user's links
 * Features: search, inline active toggle, edit modal with image controls,
 * add-to-collection flow, media library browser
 */
import { requireAuth, signOut } from '../shared/auth.js'
import { supabase } from '../shared/supabase.js'
import { navigate } from '../shared/router.js'
import { compressAndUpload, listUserImages } from '../shared/image-utils.js'
import { initThemeToggle, toggleTheme, getCurrentTheme } from '../shared/theme-toggle.js'
import { showToast } from '../shared/toast.js'
import { renderTagChips, normalizeTags, getAllUserTags, createTagInput, invalidateTagCache } from '../shared/tag-utils.js'

let user = null
let allLinks = []
let collections = []
let searchQuery = ''
let filterTag = ''
let allUserTags = []
let totalLinkCount = 0
const PAGE_SIZE = 25
let sortMode = 'created-desc'
let selectedLinkIds = new Set()
let editingLinkId = null

// ── Initialization ──
async function init() {
  user = await requireAuth()
  if (!user) return

  renderNav()
  showBackBreadcrumb()
  showLoading()

  await Promise.all([
    loadCollections(),
    loadAllLinks()
  ])

  renderLibrary()

  // Load tags in background
  getAllUserTags(supabase, user.id).then(tags => { allUserTags = tags })
  bindEvents()

  console.log(`[AcademiQR v1.0] Link Library loaded: ${allLinks.length} links across ${collections.length} collections`)
}

// ── Back to Collection Breadcrumb ──
function showBackBreadcrumb() {
  const el = document.getElementById('back-to-collection')
  if (!el) return

  try {
    const raw = sessionStorage.getItem('academiqr-last-collection')
    if (!raw) return
    const { id, title } = JSON.parse(raw)
    if (!id) return

    el.innerHTML = `<a href="/src/pages/editor.html?id=${id}"><i class="fas fa-arrow-left"></i> Back to ${escapeHtml(title)}</a>`
    el.style.display = 'block'
  } catch {
    // ignore
  }
}

// ── Nav Bar ──
function renderNav() {
  const nav = document.getElementById('main-nav')
  if (!nav) return
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand"><img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png" alt="AcademiQR" class="nav-logo"></a>
      <div class="nav-links">
        <a href="/src/pages/dashboard.html" class="nav-link"><i class="fas fa-th-large"></i> My Collections</a>
        <a href="/src/pages/library.html" class="nav-link active"><i class="fas fa-link"></i> Link Library</a>
        <a href="/src/pages/profile.html" class="nav-link"><i class="fas fa-user-circle"></i> Profile</a>
        <div class="nav-user">
          <button id="theme-toggle-btn" class="btn-ghost" title="Toggle dark mode"><i class="fas fa-circle-half-stroke"></i></button>
          <button id="sign-out-btn" class="btn-ghost"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </div>
      </div>
    </div>
  `
  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    await signOut()
    navigate('login')
  })
  initThemeToggle()
  const themeBtn = document.getElementById('theme-toggle-btn')
  if (themeBtn) {
    themeBtn.querySelector('i').className = getCurrentTheme() === 'dark' ? 'fas fa-circle-half-stroke' : 'fas fa-circle-half-stroke'
    themeBtn.addEventListener('click', () => {
      const next = toggleTheme()
      themeBtn.querySelector('i').className = next === 'dark' ? 'fas fa-circle-half-stroke' : 'fas fa-circle-half-stroke'
    })
  }
}

// ── Loading State ──
function showLoading() {
  const content = document.getElementById('library-content')
  if (content) {
    content.innerHTML = `
      <div class="library-loading">
        <div class="loading-spinner"></div>
        <p>Loading your links...</p>
      </div>
    `
  }
}

// ── Load All Collections ──
async function loadCollections() {
  try {
    const { data, error } = await supabase
      .from('link_lists')
      .select('id, slug, presentation_data')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    collections = data || []
  } catch (error) {
    console.error('Failed to load collections:', error)
    collections = []
  }
}

// ── Load Links (paginated) ──
async function loadAllLinks(append = false) {
  try {
    const from = append ? allLinks.length : 0
    const to = from + PAGE_SIZE - 1

    const query = supabase
      .from('link_items')
      .select('*, source_link_id, use_library_defaults, link_lists!inner(id, slug, presentation_data, owner_id)', { count: 'exact' })
      .eq('link_lists.owner_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query

    if (error) throw error
    if (append) {
      allLinks = [...allLinks, ...(data || [])]
    } else {
      allLinks = data || []
    }
    totalLinkCount = count || allLinks.length
  } catch (error) {
    console.error('Failed to load links:', error)
    if (!append) allLinks = []
  }
}

// ── Render Library ──
function renderLibrary() {
  const content = document.getElementById('library-content')
  if (!content) return

  const filtered = getFilteredLinks()

  if (allLinks.length === 0) {
    content.innerHTML = `
      <div class="library-empty">
        <i class="fas fa-link"></i>
        <h3>Your link library is empty</h3>
        <p>Links you create in collections will appear here. You can also create standalone links to reuse across multiple collections.</p>
        <button class="btn-primary" id="empty-new-link-btn"><i class="fas fa-plus"></i> Create Your First Link</button>
      </div>
    `
    document.getElementById('empty-new-link-btn')?.addEventListener('click', openNewLinkModal)
    return
  }

  // Stats + duplicate detection
  const urlCounts = {}
  allLinks.forEach(l => { const u = (l.url || '').toLowerCase().replace(/\/+$/, ''); urlCounts[u] = (urlCounts[u] || 0) + 1 })
  const duplicateUrls = new Set(Object.keys(urlCounts).filter(u => urlCounts[u] > 1))
  const duplicateCount = allLinks.filter(l => duplicateUrls.has((l.url || '').toLowerCase().replace(/\/+$/, ''))).length
  const uniqueUrls = new Set(allLinks.map(l => l.url)).size
  const activeCount = allLinks.filter(l => l.is_active !== false).length

  content.innerHTML = `
    <div class="library-stats">
      <div class="library-stat"><strong>${allLinks.length}</strong> total links</div>
      <div class="library-stat"><strong>${uniqueUrls}</strong> unique URLs</div>
      <div class="library-stat"><strong>${activeCount}</strong> active</div>
      <div class="library-stat"><strong>${collections.length}</strong> collections</div>
      ${duplicateCount > 0 ? `<div class="library-stat library-stat-warn"><strong>${duplicateCount}</strong> <a href="#" id="filter-duplicates" class="${searchQuery === ':duplicates' ? 'filter-active' : ''}">duplicates${searchQuery === ':duplicates' ? ' ✕' : ''}</a></div>` : ''}
    </div>
    ${selectedLinkIds.size > 0 ? `
      <div class="bulk-action-bar">
        <span class="bulk-count">${selectedLinkIds.size} selected</span>
        <button class="btn-secondary btn-sm" id="bulk-toggle-btn"><i class="fas fa-toggle-on"></i> Toggle Active</button>
        <button class="btn-secondary btn-sm" id="bulk-move-btn"><i class="fas fa-folder-plus"></i> Add to Collection</button>
        <button class="btn-ghost btn-sm" id="bulk-clear-btn"><i class="fas fa-times"></i> Clear</button>
        <span style="flex:1;"></span>
        <button class="btn-danger btn-sm" id="bulk-delete-btn"><i class="fas fa-trash"></i> Delete</button>
      </div>
    ` : ''}
    <div class="library-table-header">
      <span><input type="checkbox" id="select-all-checkbox" ${filtered.length > 0 && filtered.every(l => selectedLinkIds.has(l.id)) ? 'checked' : ''}></span>
      <span></span>
      <span class="sortable-header" data-sort-asc="title-asc" data-sort-desc="title-desc">Title / URL ${sortIcon('title-asc', 'title-desc')}</span>
      <span class="sortable-header" data-sort-asc="collection-asc" data-sort-desc="collection-desc">Collection ${sortIcon('collection-asc', 'collection-desc')}</span>
      <span>Tags</span>
      <span>Actions</span>
    </div>
    ${filtered.length === 0 ? `
      <div class="library-empty" style="padding: 40px;">
        <i class="fas fa-search"></i>
        <h3>No matches found</h3>
        <p>No links match "${escapeHtml(searchQuery)}". Try a different search term or clear your search.</p>
      </div>
    ` : filtered.map(link => {
      const collName = link.link_lists?.presentation_data?.title || link.link_lists?.slug || '—'
      const collId = link.link_lists?.id || link.list_id
      const isActive = link.is_active !== false
      return `
        <div class="library-link-row ${selectedLinkIds.has(link.id) ? 'row-selected' : ''}" data-link-id="${link.id}">
          <div class="lib-link-checkbox">
            <input type="checkbox" class="link-select-checkbox" data-link-id="${link.id}" ${selectedLinkIds.has(link.id) ? 'checked' : ''}>
          </div>
          <div class="lib-link-image">
            ${link.image_url ? `
              <img src="${escapeHtml(link.image_url)}" alt=""
                   onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link lib-link-image-empty\\'></i>'">
            ` : `
              <i class="fas fa-link lib-link-image-empty"></i>
            `}
          </div>
          <div class="lib-link-info">
            <div class="lib-link-title">${escapeHtml(link.title || 'Untitled')}</div>
            <div class="lib-link-url"><a href="${escapeHtml(link.url || '#')}" target="_blank" rel="noopener">${escapeHtml(truncateUrl(link.url || ''))}</a></div>
          </div>
          <div class="lib-link-collections">
            <span class="collection-tag" data-coll-id="${collId}" title="Click to open in editor" style="cursor:pointer;">${escapeHtml(collName)}</span>
          </div>
          <div class="lib-link-tags-col">
            <div style="display:flex; flex-wrap:wrap; gap:3px; align-items:center;">
              ${renderTagChips(link.tags || [], { clickable: true, removable: true, activeTag: filterTag })}
              <button class="tag-add-btn lib-tag-add-btn" data-link-id="${link.id}" title="Add tag"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          <div class="lib-link-actions">
            <label class="toggle-switch" title="${isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}">
              <input type="checkbox" ${isActive ? 'checked' : ''} data-action="toggle-active" data-link-id="${link.id}">
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" title="Edit" data-action="edit" data-link-id="${link.id}"><i class="fas fa-pen"></i></button>
            <button class="btn-icon" title="Add to collection" data-action="add-to-collection" data-link-id="${link.id}"><i class="fas fa-plus-circle"></i></button>
            <button class="btn-icon" title="Open collection" data-action="open-collection" data-coll-id="${collId}"><i class="fas fa-external-link-alt"></i></button>
            <button class="btn-icon danger" title="Delete" data-action="delete" data-link-id="${link.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `
    }).join('')}
    ${totalLinkCount > allLinks.length ? `
      <div class="load-more-container">
        <button class="btn-secondary load-more-btn" id="load-more-btn">
          <i class="fas fa-chevron-down"></i>
          Load ${Math.min(PAGE_SIZE, totalLinkCount - allLinks.length)} more · ${totalLinkCount - allLinks.length} remaining
        </button>
      </div>
    ` : ''}
  `

  // Load more
  document.getElementById('load-more-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('load-more-btn')
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...' }
    await loadAllLinks(true)
    renderLibrary()
  })

  // Bind row actions
  // Sortable column headers
  content.querySelectorAll('.sortable-header').forEach(header => {
    header.addEventListener('click', () => {
      const ascKey = header.dataset.sortAsc
      const descKey = header.dataset.sortDesc
      // Toggle: if already ascending, switch to descending; otherwise ascending
      if (sortMode === ascKey) {
        sortMode = descKey
      } else {
        sortMode = ascKey
      }
      // Sync the dropdown
      const select = document.getElementById('sort-select')
      if (select) select.value = sortMode
      renderLibrary()
    })
  })

  // Tag remove buttons on link rows
  content.querySelectorAll('.lib-link-tags-col .tag-remove[data-tag]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const tag = btn.dataset.tag
      const row = btn.closest('.library-link-row')
      const linkId = row?.dataset.linkId
      const link = allLinks.find(l => l.id === linkId)
      if (!link) return

      link.tags = (link.tags || []).filter(t => t !== tag)
      const { error } = await supabase
        .from('link_items')
        .update({ tags: link.tags, updated_at: new Date().toISOString() })
        .eq('id', linkId)

      if (error) {
        showToast('Failed to remove tag: ' + error.message, 'error')
        return
      }
      renderLibrary()
    })
  })

  // Tag click-to-filter
  content.querySelectorAll('.tag-chip[data-tag]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation()
      if (e.target.closest('.tag-remove')) return
      const tag = chip.dataset.tag
      filterTag = filterTag === tag ? '' : tag
      renderLibrary()
    })
  })

  // Tag quick-add on link rows
  content.querySelectorAll('.lib-tag-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const linkId = btn.dataset.linkId
      openLibraryTagInput(btn, linkId)
    })
  })

  content.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      openEditLinkModal(btn.dataset.linkId)
    })
  })

  content.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      deleteLink(btn.dataset.linkId)
    })
  })

  content.querySelectorAll('[data-action="open-collection"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      navigate('editor', { id: btn.dataset.collId })
    })
  })

  content.querySelectorAll('.collection-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation()
      const collId = tag.dataset.collId
      if (collId) navigate('editor', { id: collId })
    })
  })

  // Active toggle
  content.querySelectorAll('[data-action="toggle-active"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      e.stopPropagation()
      toggleLinkActive(checkbox.dataset.linkId, checkbox.checked)
    })
  })

  // Add to collection
  content.querySelectorAll('[data-action="add-to-collection"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      openAddToCollectionModal(btn.dataset.linkId)
    })
  })

  // ── Bulk selection ──
  // Individual checkboxes
  content.querySelectorAll('.link-select-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation()
      const linkId = cb.dataset.linkId
      if (cb.checked) {
        selectedLinkIds.add(linkId)
      } else {
        selectedLinkIds.delete(linkId)
      }
      renderLibrary()
    })
  })

  // Select all
  document.getElementById('select-all-checkbox')?.addEventListener('change', (e) => {
    const filtered = getFilteredLinks()
    if (e.target.checked) {
      filtered.forEach(l => selectedLinkIds.add(l.id))
    } else {
      selectedLinkIds.clear()
    }
    renderLibrary()
  })

  // Bulk action buttons
  document.getElementById('bulk-delete-btn')?.addEventListener('click', bulkDelete)
  document.getElementById('bulk-move-btn')?.addEventListener('click', bulkMove)
  document.getElementById('bulk-toggle-btn')?.addEventListener('click', bulkToggleActive)
  document.getElementById('bulk-clear-btn')?.addEventListener('click', () => {
    selectedLinkIds.clear()
    renderLibrary()
  })

  // Filter duplicates link — toggles on/off
  document.getElementById('filter-duplicates')?.addEventListener('click', (e) => {
    e.preventDefault()
    const searchInput = document.getElementById('link-search')
    if (searchInput) {
      if (searchQuery === ':duplicates') {
        searchQuery = ''
        searchInput.value = ''
      } else {
        searchQuery = ':duplicates'
        searchInput.value = ':duplicates'
      }
      renderLibrary()
    }
  })
}

// ── Toggle Active/Inactive ──
async function toggleLinkActive(linkId, isActive) {
  const link = allLinks.find(l => l.id === linkId)
  if (!link) return

  try {
    const { error } = await supabase
      .from('link_items')
      .update({ is_active: isActive })
      .eq('id', linkId)

    if (error) throw error
    link.is_active = isActive
  } catch (error) {
    console.error('Failed to toggle active:', error)
    // Revert the checkbox
    const checkbox = document.querySelector(`[data-action="toggle-active"][data-link-id="${linkId}"]`)
    if (checkbox) checkbox.checked = !isActive
  }
}

// ── Filtered + Sorted Links ──
function getFilteredLinks() {
  let results = [...allLinks]

  // Tag filter
  if (filterTag) {
    results = results.filter(link => (link.tags || []).includes(filterTag))
  }

  // Filter by search
  if (searchQuery.trim()) {
    if (searchQuery.trim() === ':duplicates') {
      const urlCounts = {}
      allLinks.forEach(l => { const u = (l.url || '').toLowerCase().replace(/\/+$/, ''); urlCounts[u] = (urlCounts[u] || 0) + 1 })
      const dupeUrls = new Set(Object.keys(urlCounts).filter(u => urlCounts[u] > 1))
      results = results.filter(link => dupeUrls.has((link.url || '').toLowerCase().replace(/\/+$/, '')))
    } else {
      const q = searchQuery.toLowerCase()
      results = results.filter(link => {
        const title = (link.title || '').toLowerCase()
        const url = (link.url || '').toLowerCase()
        const collName = (link.link_lists?.presentation_data?.title || link.link_lists?.slug || '').toLowerCase()
        const tags = (link.tags || []).join(' ').toLowerCase()
        return title.includes(q) || url.includes(q) || collName.includes(q) || tags.includes(q)
      })
    }
  }

  // Pre-compute usage counts for "most used" sort
  let usageCounts = null
  if (sortMode === 'most-used') {
    usageCounts = new Map()
    allLinks.forEach(link => {
      const url = link.url || ''
      usageCounts.set(url, (usageCounts.get(url) || 0) + 1)
    })
  }

  // Sort
  results.sort((a, b) => {
    switch (sortMode) {
      case 'created-desc':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      case 'created-asc':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0)
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '')
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'collection-asc': {
        const ca = a.link_lists?.presentation_data?.title || a.link_lists?.slug || ''
        const cb = b.link_lists?.presentation_data?.title || b.link_lists?.slug || ''
        return ca.localeCompare(cb)
      }
      case 'collection-desc': {
        const ca = a.link_lists?.presentation_data?.title || a.link_lists?.slug || ''
        const cb = b.link_lists?.presentation_data?.title || b.link_lists?.slug || ''
        return cb.localeCompare(ca)
      }
      case 'active-first':
        return (b.is_active !== false ? 1 : 0) - (a.is_active !== false ? 1 : 0)
      case 'inactive-first':
        return (a.is_active !== false ? 1 : 0) - (b.is_active !== false ? 1 : 0)
      case 'most-used':
        return (usageCounts.get(b.url || '') || 0) - (usageCounts.get(a.url || '') || 0)
      case 'updated-desc':
        return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
      default:
        return 0
    }
  })

  return results
}

// ── Modal: New Link ──
function openNewLinkModal() {
  editingLinkId = null
  const modal = document.getElementById('link-modal')
  document.getElementById('modal-title').textContent = 'New Link'
  document.getElementById('modal-link-title').value = ''
  document.getElementById('modal-link-url').value = ''
  document.getElementById('modal-link-image').value = ''
  document.getElementById('modal-image-preview').innerHTML = ''
  document.getElementById('modal-image-controls').style.display = 'none'

  populateCollectionDropdown(null)

  modal.style.display = 'flex'
  document.getElementById('modal-link-title').focus()
}

// ── Modal: Edit Link ──
function openEditLinkModal(linkId) {
  const link = allLinks.find(l => l.id === linkId)
  if (!link) return

  editingLinkId = linkId
  const modal = document.getElementById('link-modal')
  document.getElementById('modal-title').textContent = 'Edit Link'
  document.getElementById('modal-link-title').value = link.title || ''
  document.getElementById('modal-link-url').value = link.url || ''
  document.getElementById('modal-link-image').value = link.image_url || ''

  populateCollectionDropdown(link.link_lists?.id || link.list_id)

  // Image preview
  const previewEl = document.getElementById('modal-image-preview')
  const controlsEl = document.getElementById('modal-image-controls')
  if (link.image_url) {
    previewEl.innerHTML = `<img src="${escapeHtml(link.image_url)}" alt="Preview" style="width:80px; height:80px; object-fit:cover; border-radius:8px; margin-top:8px;">`
    controlsEl.style.display = 'block'
    document.getElementById('modal-img-pos-x').value = link.image_position?.x ?? 50
    document.getElementById('modal-img-pos-y').value = link.image_position?.y ?? 50
    document.getElementById('modal-img-scale').value = link.image_scale ?? 100
  } else {
    previewEl.innerHTML = ''
    controlsEl.style.display = 'none'
  }

  // Tags
  const tagsEl = document.getElementById('modal-link-tags')
  const tagInputEl = document.getElementById('modal-tag-input-container')
  const linkTags = link.tags || []
  link._pendingTags = [...linkTags]
  if (tagsEl) tagsEl.innerHTML = renderTagChips(linkTags, { removable: true })
  if (tagInputEl) {
    tagInputEl.innerHTML = ''
    createTagInput(tagInputEl, allUserTags, linkTags, (tag) => {
      link._pendingTags = normalizeTags([...link._pendingTags, tag])
      if (tagsEl) tagsEl.innerHTML = renderTagChips(link._pendingTags, { removable: true })
      bindModalTagRemove(link, tagsEl)
      if (!allUserTags.includes(tag)) { allUserTags.push(tag); allUserTags.sort(); invalidateTagCache() }
    })
  }
  bindModalTagRemove(link, tagsEl)

  modal.style.display = 'flex'
  document.getElementById('modal-link-title').focus()
}

function bindModalTagRemove(link, tagsEl) {
  if (!tagsEl) return
  tagsEl.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag
      link._pendingTags = (link._pendingTags || []).filter(t => t !== tag)
      tagsEl.innerHTML = renderTagChips(link._pendingTags, { removable: true })
      bindModalTagRemove(link, tagsEl)
    })
  })
}

function populateCollectionDropdown(selectedId) {
  const select = document.getElementById('modal-link-collection')
  if (collections.length === 0) {
    select.innerHTML = '<option value="" disabled>No collections — create one first</option>'
    return
  }
  select.innerHTML = collections.map(c => {
    const name = c.presentation_data?.title || c.slug
    const selected = c.id === selectedId ? 'selected' : ''
    return `<option value="${c.id}" ${selected}>${escapeHtml(name)}</option>`
  }).join('')
}

function closeModal() {
  document.getElementById('link-modal').style.display = 'none'
  editingLinkId = null
}

// ── Save Link (Create or Update) ──
async function saveLink() {
  const title = document.getElementById('modal-link-title').value.trim()
  const url = document.getElementById('modal-link-url').value.trim()
  const imageUrl = document.getElementById('modal-link-image').value.trim()
  const collectionId = document.getElementById('modal-link-collection').value
  const imgPosX = parseInt(document.getElementById('modal-img-pos-x')?.value) || 50
  const imgPosY = parseInt(document.getElementById('modal-img-pos-y')?.value) || 50
  const imgScale = parseInt(document.getElementById('modal-img-scale')?.value) || 100

  if (!title) { showToast('Please enter a title.', 'warning'); return }
  if (!url) { showToast('Please enter a URL.', 'warning'); return }
  if (!collectionId) { showToast('Please select a collection.', 'warning'); return }

  // Get tags from pending state
  const editingLink = editingLinkId ? allLinks.find(l => l.id === editingLinkId) : null
  const tags = editingLink?._pendingTags || []

  try {
    if (editingLinkId) {
      const { error } = await supabase
        .from('link_items')
        .update({
          title,
          url,
          image_url: imageUrl || null,
          image_position: { x: imgPosX, y: imgPosY },
          image_scale: imgScale,
          list_id: collectionId,
          ...(tags.length > 0 ? { tags } : {}),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLinkId)

      if (error) throw error
    } else {
      const { data: existingLinks } = await supabase
        .from('link_items')
        .select('order_index')
        .eq('list_id', collectionId)
        .order('order_index', { ascending: false })
        .limit(1)

      const maxOrder = existingLinks?.[0]?.order_index || 0

      const { error } = await supabase
        .from('link_items')
        .insert({
          list_id: collectionId,
          title,
          url,
          image_url: imageUrl || null,
          image_position: { x: imgPosX, y: imgPosY },
          image_scale: imgScale,
          order_index: maxOrder + 100,
          is_active: true
        })

      if (error) throw error
    }

    closeModal()
    await loadAllLinks()
    renderLibrary()

  } catch (error) {
    console.error('Failed to save link:', error)
    showToast('Failed to save: ' + error.message, 'error')
  }
}

// ── Modal: Image Upload ──
async function handleModalImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  // No size limit — image is compressed before upload

  const uploadBtn = document.getElementById('modal-upload-btn')
  const originalHtml = uploadBtn?.innerHTML
  try {
    if (uploadBtn) { uploadBtn.disabled = true; uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>' }
    const publicUrl = await compressAndUpload(file, 'links', user.id, { maxWidth: 800, maxHeight: 800 })
    document.getElementById('modal-link-image').value = publicUrl
    updateModalImagePreview(publicUrl)
  } catch (error) {
    console.error('Upload failed:', error)
    showToast('Upload failed: ' + error.message, 'error')
  } finally {
    if (uploadBtn) { uploadBtn.disabled = false; uploadBtn.innerHTML = originalHtml }
  }
}

function updateModalImagePreview(url) {
  const previewEl = document.getElementById('modal-image-preview')
  const controlsEl = document.getElementById('modal-image-controls')
  if (url) {
    previewEl.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" style="width:80px; height:80px; object-fit:cover; border-radius:8px; margin-top:8px;">`
    controlsEl.style.display = 'block'
  } else {
    previewEl.innerHTML = ''
    controlsEl.style.display = 'none'
  }
}

// ── Media Library (Browse) ──
let mediaLibraryCallback = null

async function openMediaLibrary(callback) {
  mediaLibraryCallback = callback
  const modal = document.getElementById('media-library-modal')
  const content = document.getElementById('media-library-content')
  if (!modal || !content) return

  modal.style.display = 'flex'
  content.innerHTML = '<div style="text-align:center; padding:32px; color:#9ca3af;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i><p style="margin-top:12px;">Loading images...</p></div>'

  try {
    const images = await listUserImages(user.id)
    if (images.length === 0) {
      content.innerHTML = '<div style="text-align:center; padding:32px; color:#9ca3af;"><i class="fas fa-images" style="font-size:2rem; opacity:0.3; display:block; margin-bottom:12px;"></i><p>No uploaded images yet.</p></div>'
      return
    }
    content.innerHTML = `<div class="media-grid">${images.map(img => `
      <div class="media-item" data-url="${escapeHtml(img.url)}" title="${escapeHtml(img.name)}">
        <img src="${escapeHtml(img.url)}" alt="" loading="lazy">
      </div>
    `).join('')}</div>`

    content.querySelectorAll('.media-item').forEach(item => {
      item.addEventListener('click', () => {
        if (mediaLibraryCallback) mediaLibraryCallback(item.dataset.url)
        closeMediaLibrary()
      })
    })
  } catch (error) {
    content.innerHTML = `<div style="text-align:center; padding:32px; color:#ef4444;"><p>Failed to load: ${escapeHtml(error.message)}</p></div>`
  }
}

function closeMediaLibrary() {
  const modal = document.getElementById('media-library-modal')
  if (modal) modal.style.display = 'none'
  mediaLibraryCallback = null
}

// ── Add to Collection Modal ──
let addToCollectionLinkId = null

function openAddToCollectionModal(linkId) {
  const link = allLinks.find(l => l.id === linkId)
  if (!link) return

  addToCollectionLinkId = linkId
  const modal = document.getElementById('add-to-collection-modal')
  document.getElementById('atc-link-name').textContent = `Add "${link.title || 'Untitled'}" to another collection:`

  const currentCollId = link.link_lists?.id || link.list_id
  const list = document.getElementById('atc-collections-list')
  list.innerHTML = collections
    .filter(c => c.id !== currentCollId)
    .map(c => {
      const name = c.presentation_data?.title || c.slug
      const conf = c.presentation_data?.conference || ''
      return `<div class="atc-collection-item" data-coll-id="${c.id}"><i class="fas fa-layer-group"></i> ${escapeHtml(name)}${conf ? `<span class="atc-collection-conf"> — ${escapeHtml(conf)}</span>` : ''}</div>`
    }).join('')

  if (list.innerHTML === '') {
    list.innerHTML = '<p style="color:#9ca3af; text-align:center; padding:16px;">No other collections available.</p>'
  }

  // Bind clicks
  list.querySelectorAll('.atc-collection-item').forEach(item => {
    item.addEventListener('click', () => addLinkToCollection(linkId, item.dataset.collId))
  })

  modal.style.display = 'flex'
}

function closeAddToCollectionModal() {
  document.getElementById('add-to-collection-modal').style.display = 'none'
  addToCollectionLinkId = null
}

async function addLinkToCollection(linkId, collectionId) {
  const link = allLinks.find(l => l.id === linkId)
  if (!link) return

  try {
    // Get max order for target collection
    const { data: existing } = await supabase
      .from('link_items')
      .select('order_index')
      .eq('list_id', collectionId)
      .order('order_index', { ascending: false })
      .limit(1)

    const maxOrder = existing?.[0]?.order_index || 0

    const { error } = await supabase
      .from('link_items')
      .insert({
        list_id: collectionId,
        title: link.title,
        url: link.url,
        image_url: link.image_url,
        image_position: link.image_position,
        image_scale: link.image_scale,
        order_index: maxOrder + 100,
        is_active: true,
        source_link_id: link.id,
        use_library_defaults: true,
      })

    if (error) throw error

    closeAddToCollectionModal()
    await loadAllLinks()
    renderLibrary()
  } catch (error) {
    console.error('Failed to add to collection:', error)
    showToast('Failed to add: ' + error.message, 'error')
  }
}

// ── Bulk Operations ──
async function bulkDelete() {
  const count = selectedLinkIds.size
  if (count === 0) return
  if (!confirm(`Delete ${count} selected link${count > 1 ? 's' : ''}? This cannot be undone.`)) return

  try {
    const ids = Array.from(selectedLinkIds)
    // Scope deletes to only links belonging to user's collections
    const userCollIds = new Set(collections.map(c => c.id))
    const validIds = ids.filter(id => {
      const link = allLinks.find(l => l.id === id)
      return link && userCollIds.has(link.link_lists?.id || link.list_id)
    })
    await Promise.all(validIds.map(id => {
      const link = allLinks.find(l => l.id === id)
      const listId = link.link_lists?.id || link.list_id
      return supabase.from('link_items').delete().eq('id', id).eq('list_id', listId)
    }))
    allLinks = allLinks.filter(l => !selectedLinkIds.has(l.id))
    selectedLinkIds.clear()
    renderLibrary()
  } catch (error) {
    console.error('Bulk delete failed:', error)
    showToast('Failed to delete: ' + error.message, 'error')
  }
}

async function bulkToggleActive() {
  const count = selectedLinkIds.size
  if (count === 0) return

  // Determine: if any selected are active, deactivate all; otherwise activate all
  const selectedLinks = allLinks.filter(l => selectedLinkIds.has(l.id))
  const anyActive = selectedLinks.some(l => l.is_active !== false)
  const newState = !anyActive

  try {
    const ids = Array.from(selectedLinkIds)
    await Promise.all(ids.map(id =>
      supabase.from('link_items').update({ is_active: newState }).eq('id', id)
    ))
    selectedLinks.forEach(l => { l.is_active = newState })
    renderLibrary()
  } catch (error) {
    console.error('Bulk toggle failed:', error)
    showToast('Failed to toggle: ' + error.message, 'error')
  }
}

function bulkMove() {
  if (selectedLinkIds.size === 0) return

  // Reuse the add-to-collection modal pattern
  const modal = document.getElementById('add-to-collection-modal')
  document.getElementById('atc-link-name').textContent = `Add ${selectedLinkIds.size} selected link${selectedLinkIds.size > 1 ? 's' : ''} to:`

  const list = document.getElementById('atc-collections-list')
  list.innerHTML = `
    <div class="atc-collection-item atc-new-collection" data-coll-id="__new__"><i class="fas fa-plus-circle"></i> New Collection...</div>
    ${collections.map(c => {
      const name = c.presentation_data?.title || c.slug
      const conf = c.presentation_data?.conference || ''
      return `<div class="atc-collection-item" data-coll-id="${c.id}"><i class="fas fa-layer-group"></i> ${escapeHtml(name)}${conf ? `<span class="atc-collection-conf"> — ${escapeHtml(conf)}</span>` : ''}</div>`
    }).join('')}
  `

  // Bind clicks for bulk move
  list.querySelectorAll('.atc-collection-item').forEach(item => {
    item.addEventListener('click', async () => {
      let collId = item.dataset.collId

      // Create new collection if requested
      if (collId === '__new__') {
        const title = prompt('Enter a title for the new collection:')
        if (!title) return
        try {
          const slug = title.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 6)
          const { data, error } = await supabase
            .from('link_lists')
            .insert({ owner_id: user.id, slug, visibility: 'public', theme: {}, presentation_data: { title } })
            .select()
            .single()
          if (error) throw error
          collId = data.id
          collections.push(data)
        } catch (err) {
          showToast('Failed to create collection: ' + err.message, 'error')
          return
        }
      }

      try {
        // Copy links to the target collection (not move)
        const selectedLinks = allLinks.filter(l => selectedLinkIds.has(l.id))
        const newLinks = selectedLinks.map(link => ({
          list_id: collId,
          title: link.title,
          url: link.url,
          image_url: link.image_url,
          image_position: link.image_position,
          image_scale: link.image_scale,
          is_active: true,
          order_index: link.order_index,
          source_link_id: link.id,
          use_library_defaults: true,
        }))
        await supabase.from('link_items').insert(newLinks)
        closeAddToCollectionModal()
        selectedLinkIds.clear()
        await loadAllLinks()
        renderLibrary()
      } catch (error) {
        console.error('Bulk move failed:', error)
        showToast('Failed to move: ' + error.message, 'error')
      }
    })
  })

  modal.style.display = 'flex'
}

// ── Delete Link ──
async function deleteLink(linkId) {
  const link = allLinks.find(l => l.id === linkId)
  if (!link) return
  if (!confirm(`Delete "${link.title || 'this link'}"? This cannot be undone.`)) return

  try {
    const link = allLinks.find(l => l.id === linkId)
    const listId = link?.link_lists?.id || link?.list_id
    const { error } = await supabase
      .from('link_items')
      .delete()
      .eq('id', linkId)
      .eq('list_id', listId)

    if (error) throw error

    allLinks = allLinks.filter(l => l.id !== linkId)
    renderLibrary()
  } catch (error) {
    console.error('Failed to delete link:', error)
    showToast('Failed to delete: ' + error.message, 'error')
  }
}

// ── Event Binding ──
function bindEvents() {
  // Search
  document.getElementById('link-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value
    renderLibrary()
  })

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    sortMode = e.target.value
    renderLibrary()
  })

  // New link button
  document.getElementById('new-link-btn')?.addEventListener('click', openNewLinkModal)

  // Edit Modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal)
  document.getElementById('modal-cancel')?.addEventListener('click', closeModal)
  document.getElementById('modal-save')?.addEventListener('click', saveLink)
  document.getElementById('link-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'link-modal') closeModal()
  })

  // Modal image upload
  document.getElementById('modal-upload-btn')?.addEventListener('click', () => {
    document.getElementById('modal-image-file')?.click()
  })
  document.getElementById('modal-image-file')?.addEventListener('change', handleModalImageUpload)

  // Modal browse media
  document.getElementById('modal-browse-btn')?.addEventListener('click', () => {
    openMediaLibrary((url) => {
      document.getElementById('modal-link-image').value = url
      updateModalImagePreview(url)
    })
  })

  // Add to Collection modal
  document.getElementById('atc-modal-close')?.addEventListener('click', closeAddToCollectionModal)
  document.getElementById('add-to-collection-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'add-to-collection-modal') closeAddToCollectionModal()
  })

  // Media Library modal
  document.getElementById('media-library-close')?.addEventListener('click', closeMediaLibrary)
  document.getElementById('media-library-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'media-library-modal') closeMediaLibrary()
  })

  // Close all modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
      closeAddToCollectionModal()
      closeMediaLibrary()
    }
  })
}

// ── Helpers ──
function sortIcon(ascKey, descKey) {
  if (sortMode === ascKey) return '<i class="fas fa-sort-up sort-indicator"></i>'
  if (sortMode === descKey) return '<i class="fas fa-sort-down sort-indicator"></i>'
  return '<i class="fas fa-sort sort-indicator-inactive"></i>'
}

// ── Library Inline Tag Input ──
function openLibraryTagInput(btn, linkId) {
  document.querySelectorAll('.tag-input-wrapper').forEach(w => w.remove())

  const link = allLinks.find(l => l.id === linkId)
  if (!link) return

  const currentTags = link.tags || []
  const container = btn.closest('.lib-link-tags-col')

  createTagInput(container, allUserTags, currentTags, async (tag) => {
    link.tags = normalizeTags([...currentTags, tag])
    const { error } = await supabase
      .from('link_items')
      .update({ tags: link.tags, updated_at: new Date().toISOString() })
      .eq('id', linkId)

    if (error) {
      showToast('Failed to add tag: ' + error.message, 'error')
      return
    }
    if (!allUserTags.includes(tag)) { allUserTags.push(tag); allUserTags.sort(); invalidateTagCache() }
    renderLibrary()
  })

  container.querySelector('.tag-input')?.focus()
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function truncateUrl(url) {
  try {
    const u = new URL(url)
    const path = u.pathname.length > 40 ? u.pathname.substring(0, 40) + '...' : u.pathname
    return u.hostname + path
  } catch {
    return url.length > 60 ? url.substring(0, 60) + '...' : url
  }
}

// ── Start ──
init()
