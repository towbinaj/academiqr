/**
 * Dashboard Page — Collection cards grid
 * Features: search across collection + link fields, drag-and-drop reorder via handle
 */
import { requireAuth, signOut } from '../shared/auth.js'
import { supabase } from '../shared/supabase.js'
import { goToEditor, navigate } from '../shared/router.js'
import Sortable from 'sortablejs'
import { initThemeToggle, toggleTheme, getCurrentTheme } from '../shared/theme-toggle.js'
import { showToast } from '../shared/toast.js'
import { renderTagChips, normalizeTag, normalizeTags, getAllUserTags, createTagInput, invalidateTagCache } from '../shared/tag-utils.js'

let user = null
let collections = []
let searchQuery = ''
let filterTag = ''
let allUserTags = []
let sortableInstance = null

// ── Initialization ──
async function init() {
  user = await requireAuth()
  if (!user) return

  renderNav()
  await loadCollections()
  renderCollections()

  // Load tags in background (doesn't block initial render)
  getAllUserTags(supabase, user.id).then(tags => { allUserTags = tags })

  // Check if user needs to set a username
  await checkUsernameOnboarding()

  // Bind events
  document.getElementById('new-collection-btn')?.addEventListener('click', createNewCollection)

  document.getElementById('collection-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value
    renderCollections()
  })
}

// ── Username Onboarding ──
async function checkUsernameOnboarding() {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (profile?.username) return // Already set

    // Show onboarding banner
    const banner = document.createElement('div')
    banner.className = 'username-onboarding'
    banner.innerHTML = `
      <div class="onboarding-content">
        <div class="onboarding-text">
          <h3><i class="fas fa-user-tag"></i> Set Your Username</h3>
          <p>Choose a permanent username for your public collection URLs (e.g. academiqr.com/u/<strong>your-name</strong>/collection)</p>
        </div>
        <div class="onboarding-input">
          <div class="username-input-row">
            <span class="username-prefix">academiqr.com/u/</span>
            <input type="text" id="onboarding-username" placeholder="your-username" maxlength="30">
          </div>
          <p id="onboarding-username-status" style="font-size:0.75rem; min-height:1.2em; margin-top:4px;"></p>
          <button class="btn-primary" id="onboarding-save-btn">Set Username</button>
        </div>
      </div>
    `

    const header = document.querySelector('.dashboard-header')
    header.parentNode.insertBefore(banner, header.nextSibling)

    // Live availability check
    let timeout = null
    document.getElementById('onboarding-username')?.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
      e.target.value = val
      const status = document.getElementById('onboarding-username-status')

      if (!val || val.length < 3) {
        status.textContent = val ? 'Must be at least 3 characters' : ''
        status.style.color = '#64748b'
        return
      }

      status.textContent = 'Checking...'
      status.style.color = '#64748b'
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        const { data } = await supabase.from('profiles').select('id').eq('username', val).limit(1)
        if (data && data.length > 0) {
          status.textContent = 'Username is taken'
          status.style.color = '#ef4444'
        } else {
          status.textContent = 'Available!'
          status.style.color = '#22c55e'
        }
      }, 500)
    })

    // Save button
    document.getElementById('onboarding-save-btn')?.addEventListener('click', async () => {
      const val = document.getElementById('onboarding-username')?.value?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
      if (!val || val.length < 3) {
        showToast('Username must be at least 3 characters (letters, numbers, hyphens only)', 'warning')
        return
      }

      const btn = document.getElementById('onboarding-save-btn')
      btn.disabled = true
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, username: val })

        if (error) {
          if (error.code === '23505' || error.message?.includes('username')) {
            showToast('That username is already taken. Please choose another.', 'warning')
          } else {
            throw error
          }
          btn.disabled = false
          btn.innerHTML = 'Set Username'
          return
        }

        banner.remove()
      } catch (err) {
        console.error('Failed to set username:', err)
        showToast('Failed to save: ' + err.message, 'error')
        btn.disabled = false
        btn.innerHTML = 'Set Username'
      }
    })
  } catch {
    // Non-critical — don't block dashboard
  }
}

// ── Nav Bar ──
function renderNav() {
  const nav = document.getElementById('main-nav')
  if (!nav) return

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" alt="AcademiQR" class="nav-logo-icon" width="40" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_white_.png">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" alt="" class="nav-logo-wordmark" width="200" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_white_logo_.png">
          </a>
      <div class="nav-links">
        <a href="/src/pages/library.html" class="nav-link">
          <i class="fas fa-link"></i> Link Library
        </a>
        <a href="/src/pages/profile.html" class="nav-link">
          <i class="fas fa-user-circle"></i> Profile
        </a>
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

  // Theme toggle
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

// ── Load Collections from Supabase ──
async function loadCollections() {
  const grid = document.getElementById('collections-grid')
  if (!grid) return

  grid.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your collections...</p>
    </div>
  `

  try {
    const { data: linkLists, error } = await supabase
      .from('link_lists')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    collections = linkLists || []

    // Sort by order_index, then by created_at
    collections.sort((a, b) => {
      const orderA = a.order_index ?? Infinity
      const orderB = b.order_index ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })

    // Load link titles + URLs for search (also gives us count)
    await Promise.all(collections.map(async (collection) => {
      try {
        const { data: linkData, error } = await supabase
          .from('link_items')
          .select('title, url')
          .eq('list_id', collection.id)

        collection._links = error ? [] : (linkData || [])
        collection._linkCount = collection._links.length
      } catch {
        collection._links = []
        collection._linkCount = 0
      }
    }))

  } catch (error) {
    console.error('Failed to load collections:', error)
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load collections. Please try again.</p>
        <button class="btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `
  }
}

// ── Search / Filter ──
function getFilteredCollections() {
  let result = collections

  // Tag filter
  if (filterTag) {
    result = result.filter(c => {
      const tags = (c.presentation_data || {}).tags || []
      return tags.includes(filterTag)
    })
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    result = result.filter(collection => {
      const pd = collection.presentation_data || {}

      if ((pd.title || '').toLowerCase().includes(q)) return true
      if ((pd.conference || '').toLowerCase().includes(q)) return true
      if ((pd.location || '').toLowerCase().includes(q)) return true
      if ((pd.date || '').toLowerCase().includes(q)) return true

      // Search tags
      const tags = pd.tags || []
      if (tags.some(t => t.includes(q))) return true

      const links = collection._links || []
      return links.some(link =>
        (link.title || '').toLowerCase().includes(q) ||
        (link.url || '').toLowerCase().includes(q)
      )
    })
  }

  return result
}

// ── Render Collection Cards ──
function renderCollections() {
  const grid = document.getElementById('collections-grid')
  if (!grid) return

  // Destroy existing sortable before re-rendering
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }

  if (collections.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-rocket"></i></div>
        <h3>Welcome to AcademiQR</h3>
        <p>Create your first collection to start sharing links with your audience.</p>
        <button class="btn-primary" id="empty-create-btn">
          <i class="fas fa-plus"></i> Create Collection
        </button>
      </div>
    `
    document.getElementById('empty-create-btn')?.addEventListener('click', createNewCollection)
    return
  }

  const filtered = getFilteredCollections()
  const isSearching = !!searchQuery.trim()

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h3>No matching collections</h3>
        <p>No collections match "${escapeHtml(searchQuery)}". Try a different search term.</p>
      </div>
    `
    return
  }

  grid.innerHTML = filtered.map(collection => {
    const pd = collection.presentation_data || {}
    const title = pd.title || 'Untitled Collection'
    const conference = pd.conference || ''
    const linkCount = collection._linkCount || 0

    // Visibility badge
    let visIcon, visLabel
    if (collection.passkey_hash) {
      visIcon = 'fa-key'
      visLabel = 'Passkey'
    } else if (collection.visibility === 'private') {
      visIcon = 'fa-lock'
      visLabel = 'Private'
    } else {
      visIcon = 'fa-globe'
      visLabel = 'Public'
    }

    // Theme preview color
    const theme = collection.theme || {}
    const bgColor = theme.backgroundColor || theme.background_color || '#1A2F5B'
    const accentColor = theme.accentColor || theme.accent_color || '#3B5998'

    // Date
    const created = collection.created_at
      ? new Date(collection.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : ''

    return `
      <div class="collection-card" data-id="${collection.id}">
        <div class="card-theme-strip" style="background: linear-gradient(135deg, ${accentColor}, ${bgColor})"></div>
        <div class="card-body">
          <div class="card-top">
            ${!isSearching ? '<span class="drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>' : ''}
            <div class="card-content">
              <div class="card-title-row">
                <h3 class="card-title">${escapeHtml(title)}</h3>
                <div class="card-actions">
                  <button class="btn-icon" title="Duplicate" data-action="duplicate" data-id="${collection.id}">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="btn-icon btn-danger-icon" title="Delete" data-action="delete" data-id="${collection.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              ${conference ? `<p class="card-conference">${escapeHtml(conference)}</p>` : ''}
            </div>
          </div>
          <div class="card-meta">
            <span class="card-badge"><i class="fas ${visIcon}"></i> ${visLabel}</span>
            <span class="card-links"><i class="fas fa-link"></i> ${linkCount} link${linkCount !== 1 ? 's' : ''}</span>
            <span class="card-date">${created}</span>
          </div>
          ${(pd.tags && pd.tags.length > 0) || true ? `
            <div class="card-tags" data-collection-id="${collection.id}">
              ${renderTagChips(pd.tags || [], { clickable: true, removable: true, activeTag: filterTag })}
              <button class="tag-add-btn" data-collection-id="${collection.id}" title="Add tag"><i class="fas fa-plus"></i></button>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }).join('')

  // Bind card click events
  grid.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-actions')) return
      if (e.target.closest('.drag-handle')) return
      if (e.target.closest('.card-tags')) return
      goToEditor(card.dataset.id)
    })
  })

  // Bind action buttons
  grid.querySelectorAll('[data-action="duplicate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      duplicateCollection(btn.dataset.id)
    })
  })

  grid.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      deleteCollection(btn.dataset.id)
    })
  })

  // Tag remove buttons (must bind before click-to-filter to prevent propagation conflicts)
  grid.querySelectorAll('.tag-remove[data-tag]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const tag = btn.dataset.tag
      const card = btn.closest('.collection-card')
      const collId = card?.dataset.id
      const coll = collections.find(c => c.id === collId)
      if (!coll) return

      const pd = { ...(coll.presentation_data || {}) }
      pd.tags = (pd.tags || []).filter(t => t !== tag)
      const { error } = await supabase
        .from('link_lists')
        .update({ presentation_data: pd, updated_at: new Date().toISOString() })
        .eq('id', collId)

      if (error) {
        showToast('Failed to remove tag: ' + error.message, 'error')
        return
      }
      coll.presentation_data = pd
      renderCollections()
    })
  })

  // Tag click-to-filter
  grid.querySelectorAll('.tag-chip[data-tag]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation()
      // Don't filter if the click was on the remove button
      if (e.target.closest('.tag-remove')) return
      const tag = chip.dataset.tag
      filterTag = filterTag === tag ? '' : tag
      renderCollections()
      updateTagFilterBar()
    })
  })

  // Tag quick-add buttons
  grid.querySelectorAll('.tag-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const collId = btn.dataset.collectionId
      openInlineTagInput(btn, collId)
    })
  })

  // Update filter bar
  updateTagFilterBar()

  // Init drag-and-drop (only when not searching/filtering — reordering a filtered list is meaningless)
  if (!isSearching && !filterTag && filtered.length > 1) {
    sortableInstance = new Sortable(grid, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: handleReorderEnd,
    })
  }
}

// ── Tag Filter Bar ──
function updateTagFilterBar() {
  const bar = document.getElementById('tag-filter-bar')
  if (!bar) return
  if (filterTag) {
    bar.style.display = 'flex'
    bar.innerHTML = `
      <span>Filtered by:</span>
      <span class="tag-chip tag-active">${escapeHtml(filterTag)} <button class="tag-remove" id="clear-tag-filter">&times;</button></span>
    `
    document.getElementById('clear-tag-filter')?.addEventListener('click', () => {
      filterTag = ''
      renderCollections()
    })
  } else {
    bar.style.display = 'none'
    bar.innerHTML = ''
  }
}

// ── Inline Tag Input on Card ──
function openInlineTagInput(btn, collectionId) {
  // Remove any existing inline inputs
  document.querySelectorAll('.tag-input-wrapper').forEach(w => w.remove())

  const coll = collections.find(c => c.id === collectionId)
  if (!coll) return

  const currentTags = (coll.presentation_data || {}).tags || []
  const container = btn.closest('.card-tags')

  const handle = createTagInput(container, allUserTags, currentTags, async (tag) => {
    // Add tag to collection
    const pd = { ...(coll.presentation_data || {}), tags: normalizeTags([...currentTags, tag]) }
    const { error } = await supabase
      .from('link_lists')
      .update({ presentation_data: pd, updated_at: new Date().toISOString() })
      .eq('id', collectionId)

    if (error) {
      showToast('Failed to add tag: ' + error.message, 'error')
      return
    }

    coll.presentation_data = pd
    if (!allUserTags.includes(tag)) allUserTags.push(tag)
    allUserTags.sort()
    invalidateTagCache()
    renderCollections()
  })

  // Focus the input
  container.querySelector('.tag-input')?.focus()
}

// ── Reorder persistence ──
async function handleReorderEnd() {
  const grid = document.getElementById('collections-grid')
  const cards = grid.querySelectorAll('.collection-card')

  const idOrder = Array.from(cards).map(c => c.dataset.id)
  const reordered = []
  for (const id of idOrder) {
    const col = collections.find(c => c.id === id)
    if (col) reordered.push(col)
  }

  // Safety: include any collections not in grid (shouldn't happen)
  for (const col of collections) {
    if (!reordered.includes(col)) reordered.push(col)
  }

  collections = reordered

  try {
    await Promise.all(collections.map((c, i) => {
      c.order_index = (i + 1) * 100
      return supabase
        .from('link_lists')
        .update({ order_index: c.order_index })
        .eq('id', c.id)
    }))
  } catch (error) {
    console.error('Failed to save order:', error)
  }
}

// ── Actions ──

function generateSlug(title) {
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')          // spaces to hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .replace(/^-|-$/g, '')         // trim leading/trailing hyphens
    .substring(0, 50)
  // Add short random suffix for uniqueness
  return slug ? `${slug}-${Math.random().toString(36).substring(2, 6)}` : crypto.randomUUID().substring(0, 8)
}

async function createNewCollection() {
  const minOrder = collections.reduce((min, c) => Math.min(min, c.order_index ?? 0), 0)

  try {
    const slug = generateSlug('untitled')
    const { data, error } = await supabase
      .from('link_lists')
      .insert({
        owner_id: user.id,
        slug,
        visibility: 'public',
        theme: {},
        presentation_data: { title: 'Untitled Collection' },
        order_index: minOrder - 100,
      })
      .select()
      .single()

    if (error) throw error
    goToEditor(data.id)
  } catch (error) {
    console.error('Failed to create collection:', error)
    showToast('Failed to create collection: ' + error.message, 'error')
  }
}

async function duplicateCollection(id) {
  const original = collections.find(c => c.id === id)
  if (!original) return

  if (!confirm(`Duplicate "${original.presentation_data?.title || 'Untitled'}"?`)) return

  try {
    const newSlug = crypto.randomUUID()
    const maxOrder = collections.reduce((max, c) => Math.max(max, c.order_index || 0), 0)
    const { data, error } = await supabase
      .from('link_lists')
      .insert({
        owner_id: user.id,
        slug: newSlug,
        title: original.title,
        description: original.description,
        theme: original.theme,
        socials: original.socials,
        layout: original.layout,
        visibility: original.visibility,
        presentation_data: {
          ...original.presentation_data,
          title: (original.presentation_data?.title || 'Untitled') + ' (Copy)'
        },
        order_index: maxOrder + 100,
      })
      .select()
      .single()

    if (error) throw error

    // Also duplicate links
    const { data: links } = await supabase
      .from('link_items')
      .select('*')
      .eq('list_id', id)

    if (links && links.length > 0) {
      const newLinks = links.map(link => ({
        list_id: data.id,
        title: link.title,
        url: link.url,
        image_url: link.image_url,
        order_index: link.order_index,
        is_active: link.is_active
      }))
      await supabase.from('link_items').insert(newLinks)
    }

    await loadCollections()
    renderCollections()

  } catch (error) {
    console.error('Failed to duplicate:', error)
    showToast('Failed to duplicate: ' + error.message, 'error')
  }
}

async function deleteCollection(id) {
  const collection = collections.find(c => c.id === id)
  if (!collection) return

  const name = collection.presentation_data?.title || 'Untitled Collection'
  if (!confirm(`Delete "${name}"? This will also delete all links in this collection. This cannot be undone.`)) return

  try {
    const { error } = await supabase
      .from('link_lists')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)

    if (error) throw error

    await loadCollections()
    renderCollections()
  } catch (error) {
    console.error('Failed to delete:', error)
    showToast('Failed to delete: ' + error.message, 'error')
  }
}

// ── Helpers ──
function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

// ── Start ──
init()
