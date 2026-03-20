/**
 * Collection Editor Page
 * Loads a single collection and its links, renders editor UI
 */
import { requireAuth, signOut } from '../shared/auth.js'
import { supabase } from '../shared/supabase.js'
import { getParam, goToDashboard, navigate, getPublicUrl } from '../shared/router.js'
import { renderQRCodeTab as renderQRTab } from '../components/qr-code/qr-tab.js'
import { renderAnalyticsTab as renderAnalyticsModule } from '../components/analytics/analytics-tab.js'
import { resolveLibraryDefaults, hasCustomOverrides, getDisplayTitle, getDisplayImageUrl, getDisplayImagePosition, getDisplayImageScale } from '../shared/link-utils.js'
import { initThemeToggle, toggleTheme, getCurrentTheme } from '../shared/theme-toggle.js'
import { compressAndUpload, listUserImages } from '../shared/image-utils.js'
import { createAutoSaver, registerAutoSaver, flushAll } from '../shared/auto-save.js'

let user = null
let collection = null
let profile = null
let links = []
let selectedLinkId = null
let activeTab = 'details'

// ── Auto-savers (initialized after collection loads) ──
let presentationSaver = null
let settingsSaver = null
let linkSaver = null
let themeSaver = null

// ── Shared Constants ──
const CHEVRON_SVG = `<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`
const CHEVRON_SVG_COLLAPSED = `<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`

const DEFAULT_THEME = {
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  gradientText: '',
  backgroundImage: '',
  backgroundImageX: 50,
  backgroundImageY: 50,
  backgroundImageScale: 100,
  profileTextColor: '#1A2F5B',
  presentationTextColor: '#1A2F5B',
  buttonTextColor: '#000000',
  buttonBackgroundColor: '#1A2F5B',
  buttonStyle: 'soft',
  buttonBorderRadius: '8px',
  buttonPadding: '12px 24px',
  buttonFontSize: '16px',
  buttonFontWeight: '500',
  textFontSize: '18px',
  textFontWeight: '600',
  borderEnabled: false,
  borderType: 'solid',
  borderStyle: 'fill',
  borderColor: '#1A2F5B',
  borderWidth: '1px',
  borderGradient: '',
}

// ── Shared Helpers ──
function showSaveSuccess(buttonId) {
  const btn = document.getElementById(buttonId)
  if (!btn) return
  const orig = btn.textContent
  btn.textContent = '✓ Saved'
  setTimeout(() => { btn.textContent = orig }, 1500)
}

function imageTransformCSS(x = 50, y = 50, scale = 100) {
  return `translate(${(x - 50) * 0.6}%, ${(y - 50) * 0.6}%) scale(${scale / 100})`
}

function setupSectionToggle(container) {
  container.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const sectionId = header.dataset.section
      const content = document.getElementById(sectionId)
      const chevron = header.querySelector('.section-chevron')
      if (content && chevron) {
        content.classList.toggle('collapsed')
        chevron.classList.toggle('collapsed')
      }
    })
  })
}

// ── Initialization ──
async function init() {
  user = await requireAuth()
  if (!user) return

  const collectionId = getParam('id')
  if (!collectionId) {
    goToDashboard()
    return
  }

  renderNav()
  await Promise.all([
    loadCollection(collectionId),
    loadProfile()
  ])

  if (!collection) {
    alert('Collection not found')
    goToDashboard()
    return
  }

  await loadLinks()
  renderSidebar()
  renderTabContent()
  renderPreview()
  bindEvents()

  // ── Initialize auto-savers ──
  presentationSaver = createAutoSaver(async () => {
    try {
      updatePresentationDataLive()
      const { error } = await supabase
        .from('link_lists')
        .update({ presentation_data: collection.presentation_data })
        .eq('id', collection.id)
      if (error) throw error
      renderSidebar()
      return true
    } catch (err) {
      console.error('Auto-save presentation failed:', err)
      return false
    }
  }, { statusSelector: '#presentation-save-status' })

  settingsSaver = createAutoSaver(async () => {
    try {
      const visibility = document.getElementById('collection-visibility')?.value || 'public'
      const newPasskey = document.getElementById('collection-passkey')?.value.trim()
      const slug = document.getElementById('collection-slug')?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || collection.slug
      const updates = { visibility, slug }
      if (visibility === 'passkey' && newPasskey) {
        updates.passkey_hash = newPasskey
      } else if (visibility !== 'passkey') {
        updates.passkey_hash = null
      }
      const { error } = await supabase
        .from('link_lists')
        .update(updates)
        .eq('id', collection.id)
      if (error) throw error
      collection.visibility = visibility
      collection.slug = slug
      if (updates.passkey_hash !== undefined) collection.passkey_hash = updates.passkey_hash
      renderSidebar()
      return true
    } catch (err) {
      console.error('Auto-save settings failed:', err)
      return false
    }
  }, { statusSelector: '#settings-save-status' })

  linkSaver = createAutoSaver(async () => {
    // Use the current selectedLinkId at save time
    const linkId = selectedLinkId
    if (!linkId) return false
    try {
      const link = links.find(l => l.id === linkId)
      if (!link) return false

      const title = document.getElementById('link-title')?.value.trim()
      const url = document.getElementById('link-url')?.value.trim()
      const imageUrl = document.getElementById('link-image')?.value.trim()

      const hasSource = !!link.source_link_id
      const hasCustom = hasCustomOverrides(link)
      const isCustomizing = hasSource ? !link.use_library_defaults : hasCustom
      const usingDefaults = hasSource && link.use_library_defaults

      const imgPosX = usingDefaults ? (link.image_position?.x ?? 50) : (parseInt(document.getElementById('link-img-pos-x')?.value) || 50)
      const imgPosY = usingDefaults ? (link.image_position?.y ?? 50) : (parseInt(document.getElementById('link-img-pos-y')?.value) || 50)
      const imgScale = usingDefaults ? (link.image_scale ?? 100) : (parseInt(document.getElementById('link-img-scale')?.value) || 100)

      const updates = {
        url,
        use_library_defaults: !!link.use_library_defaults,
      }

      if (isCustomizing && !hasSource) {
        updates.custom_overrides = {
          title: title,
          image_url: imageUrl || null,
          image_position: { x: imgPosX, y: imgPosY },
          image_scale: imgScale,
        }
      } else if (!usingDefaults) {
        updates.title = title
        updates.image_url = imageUrl || null
        updates.image_position = { x: imgPosX, y: imgPosY }
        updates.image_scale = imgScale
        updates.custom_overrides = null
      }

      const { error } = await supabase
        .from('link_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', linkId)
      if (error) throw error
      Object.assign(link, updates)
      renderLinksList()
      renderPreview()
      return true
    } catch (err) {
      console.error('Auto-save link failed:', err)
      return false
    }
  }, { statusSelector: '#link-save-status' })

  themeSaver = createAutoSaver(async () => {
    try {
      const formTheme = getThemeFromForm()
      const newTheme = { ...collection.theme, ...formTheme }
      const { error } = await supabase
        .from('link_lists')
        .update({ theme: newTheme })
        .eq('id', collection.id)
      if (error) throw error
      collection.theme = newTheme
      renderPreview()
      return true
    } catch (err) {
      console.error('Auto-save theme failed:', err)
      return false
    }
  }, { statusSelector: '#theme-save-status' })

  registerAutoSaver(presentationSaver)
  registerAutoSaver(settingsSaver)
  registerAutoSaver(linkSaver)
  registerAutoSaver(themeSaver)

  // Flush all pending auto-saves before leaving the page
  window.addEventListener('beforeunload', () => { flushAll() })

  // Store last-edited collection for "Back to" breadcrumb on other pages
  sessionStorage.setItem('academiqr-last-collection', JSON.stringify({
    id: collection.id,
    title: collection.presentation_data?.title || 'Untitled Collection',
  }))

  console.log(`[AcademiQR v1.0] Editor loaded: "${collection.presentation_data?.title || 'Untitled'}" with ${links.length} links`)
}

// ── Nav ──
function renderNav() {
  const nav = document.getElementById('main-nav')
  if (!nav) return
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand"><img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png" alt="AcademiQR" class="nav-logo"></a>
      <div class="nav-links">
        <a href="/src/pages/dashboard.html" class="nav-link"><i class="fas fa-th-large"></i> My Collections</a>
        <a href="/src/pages/library.html" class="nav-link"><i class="fas fa-link"></i> Link Library</a>
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

// ── Load Collection ──
async function loadCollection(id) {
  try {
    const { data, error } = await supabase
      .from('link_lists')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (error) throw error
    collection = data
    console.log('[Editor] Collection loaded:', collection?.id)
  } catch (error) {
    console.error('Failed to load collection:', error)
    collection = null
  }
}

// ── Load Links ──
async function loadLinks() {
  if (!collection) return

  try {
    const { data, error } = await supabase
      .from('link_items')
      .select('*, source_link_id, use_library_defaults')
      .eq('list_id', collection.id)
      .order('order_index', { ascending: true })

    if (error) throw error

    links = data || []

    // Sort by order_index, fallback to created_at
    links.sort((a, b) => {
      const orderA = a.order_index ?? Infinity
      const orderB = b.order_index ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    })

    // Resolve library defaults for linked links
    await resolveLibraryDefaults(links)
  } catch (error) {
    console.error('Failed to load links:', error)
    links = []
  }
}

// ── Load Profile ──
async function loadProfile() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, username, profile_photo, profile_photo_position, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat')
      .eq('id', user.id)
      .single()

    if (error) throw error
    profile = data
  } catch (error) {
    console.error('Failed to load profile:', error)
    profile = {}
  }
}

// ── Render Sidebar ──
function renderSidebar() {
  const pd = collection.presentation_data || {}
  const title = pd.title || 'Untitled Collection'
  document.getElementById('collection-title').textContent = title

  const meta = document.getElementById('collection-meta')
  if (meta) {
    const conference = pd.conference || ''
    meta.innerHTML = `
      ${conference ? `<span class="meta-item"><i class="fas fa-building"></i> ${escapeHtml(conference)}</span>` : ''}
      <span class="meta-item"><i class="fas fa-list"></i> ${links.length} link${links.length !== 1 ? 's' : ''}</span>
    `
  }

  renderLinksList()
}

function renderLinksList() {
  const container = document.getElementById('links-list')
  if (!container) return

  if (links.length === 0) {
    container.innerHTML = `
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `
    return
  }

  container.innerHTML = links.map((link, index) => {
    const isSelected = link.id === selectedLinkId
    const isActive = link.is_active !== false

    return `
      <div class="link-item ${isSelected ? 'selected' : ''} ${!isActive ? 'inactive' : ''}"
           data-link-id="${link.id}" data-index="${index}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${getDisplayImageUrl(link) ? `
          <div class="link-thumb">
            <img src="${escapeHtml(getDisplayImageUrl(link))}" alt="" loading="lazy"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        ` : `
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${escapeHtml(getDisplayTitle(link) || 'Untitled Link')}${link.use_library_defaults && link.source_link_id ? ' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>' : ''}</div>
          <div class="link-url">${escapeHtml(truncateUrl(link.url || ''))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${link.id}" title="${isActive ? 'Active' : 'Inactive'}">
            <i class="fas ${isActive ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
          </button>
        </div>
      </div>
    `
  }).join('')

  // Bind link item clicks — select link
  container.querySelectorAll('.link-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.link-toggle') || e.target.closest('.link-drag-handle')) return
      selectedLinkId = item.dataset.linkId
      renderLinksList()
      renderTabContent()
      scrollToLinkEditor()
    })
  })

  // Bind toggle buttons
  container.querySelectorAll('.link-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleLinkActive(btn.dataset.linkId)
    })
  })

  // Initialize drag and drop
  initDragAndDrop()
}

function scrollToLinkEditor() {
  setTimeout(() => {
    const section = document.getElementById('link-editor-section')
    if (section) {
      section.style.display = 'block' // ensure it's open
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 50)
}

// ── Tab Content ──
function renderTabContent() {
  const content = document.getElementById('tab-content')
  if (!content) return

  switch (activeTab) {
    case 'details': renderDetailsTab(content); break
    case 'appearance': renderAppearanceTab(content); break
    case 'qr-code': renderQRCodeTab(content); break
    case 'analytics': renderAnalyticsTab(content); break
  }
}

function renderDetailsTab(container) {
  const pd = collection.presentation_data || {}
  const chevronSvg = CHEVRON_SVG

  // Visibility
  const visibility = collection.visibility || 'public'
  const hasPasskey = !!collection.passkey_hash

  // Presentation Information section (always shown)
  let html = `
    <!-- ═══ PRESENTATION INFORMATION ═══ -->
    <div class="section">
      <div class="section-header" data-section="presentation-section">
        <h3>Presentation Information <span id="presentation-save-status" class="auto-save-status"></span></h3>
        ${chevronSvg}
      </div>
      <div class="section-content" id="presentation-section">
        <div class="form-group">
          <label for="info-title">Title</label>
          <input type="text" id="info-title" value="${escapeHtml(pd.title || '')}" placeholder="Presentation title" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-conference">Conference / Event</label>
          <input type="text" id="info-conference" value="${escapeHtml(pd.conference || '')}" placeholder="Conference name" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-location">Location</label>
          <input type="text" id="info-location" value="${escapeHtml(pd.location || '')}" placeholder="City, State / Country" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-date">Date</label>
          <input type="date" id="info-date" value="${pd.date || ''}">
        </div>
        <div class="form-group" style="display:flex; gap:24px;">
          <label class="checkbox-label">
            <input type="checkbox" id="display-title" ${pd.displayTitle !== false ? 'checked' : ''}>
            <span>Show title</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="display-conference" ${pd.displayConference !== false ? 'checked' : ''}>
            <span>Show conference</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ═══ COLLECTION SETTINGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="settings-section">
        <h3>Collection Settings <span id="settings-save-status" class="auto-save-status"></span></h3>
        ${CHEVRON_SVG_COLLAPSED}
      </div>
      <div class="section-content collapsed" id="settings-section">
        <div class="form-group">
          <label for="collection-slug">Collection URL Slug</label>
          <div class="slug-input-row">
            <span class="slug-prefix">${profile?.username ? `academiqr.com/u/${escapeHtml(profile.username)}/` : 'slug: '}</span>
            <input type="text" id="collection-slug" value="${escapeHtml(collection.slug || '')}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${profile?.username && collection.slug ? `academiqr.com/u/${escapeHtml(profile.username)}/${escapeHtml(collection.slug)}` : `academiqr.com/public.html?collection=${collection.id.substring(0, 8)}...`}</span>
            <button type="button" class="btn-ghost btn-sm" id="copy-link-btn" title="Copy link" style="margin-left:auto;"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <div class="form-group">
          <label for="collection-visibility">Visibility</label>
          <select id="collection-visibility" class="form-select">
            <option value="public" ${visibility === 'public' ? 'selected' : ''}>Public — Anyone with the link</option>
            <option value="private" ${visibility === 'private' ? 'selected' : ''}>Private — Only you</option>
            <option value="passkey" ${hasPasskey ? 'selected' : ''}>Passkey — Requires a code</option>
          </select>
        </div>
        <div class="form-group" id="passkey-group" style="display:${hasPasskey || visibility === 'passkey' ? 'block' : 'none'}">
          <label for="collection-passkey">Passkey</label>
          <input type="text" id="collection-passkey" value="" placeholder="${hasPasskey ? '(unchanged — enter new to update)' : 'Enter passkey'}">
        </div>
      </div>
    </div>
  `

  // Link editor section (shown when a link is selected)
  if (selectedLinkId) {
    const link = links.find(l => l.id === selectedLinkId)
    if (link) {
      // Determine display values based on library defaults or custom overrides
      const hasSource = !!link.source_link_id
      const hasCustom = hasCustomOverrides(link)
      // "isCustomizing" = user chose per-collection customization
      // For source links: !use_library_defaults means customizing
      // For non-source links: presence of custom_overrides means customizing
      const isCustomizing = hasSource ? !link.use_library_defaults : hasCustom
      // "usingDefaults" = syncing from a source link (read-only title/image)
      const usingDefaults = hasSource && link.use_library_defaults

      // For editing: show the link's own values when customizing, resolved when using defaults
      const editTitle = isCustomizing && hasCustom
        ? (link.custom_overrides.title ?? link.title ?? '')
        : (link.title || '')
      const editImageUrl = isCustomizing && hasCustom
        ? (link.custom_overrides.image_url ?? link.image_url ?? '')
        : (link.image_url || '')
      const displayTitle = getDisplayTitle(link) || ''
      const displayImageUrl = getDisplayImageUrl(link) || ''

      const imgPos = usingDefaults
        ? (getDisplayImagePosition(link))
        : isCustomizing && hasCustom && link.custom_overrides.image_position
          ? link.custom_overrides.image_position
          : (link.image_position || link.imagePosition || { x: 50, y: 50 })
      const imgScale = usingDefaults
        ? getDisplayImageScale(link)
        : isCustomizing && hasCustom && link.custom_overrides.image_scale != null
          ? link.custom_overrides.image_scale
          : (link.image_scale ?? link.imageScale ?? 100)

      const currentImageUrl = usingDefaults ? displayImageUrl : editImageUrl

      html += `
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${chevronSvg}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${escapeHtml(displayTitle || 'Untitled')}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${link.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${!isCustomizing ? 'active' : ''}">
                <input type="radio" name="link-source-mode" value="library" ${!isCustomizing ? 'checked' : ''}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${isCustomizing ? 'active' : ''}">
                <input type="radio" name="link-source-mode" value="custom" ${isCustomizing ? 'checked' : ''}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${!isCustomizing ? `
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${hasSource
                ? 'Title and image sync with the library version. Changes in the library will appear here automatically.'
                : 'Editing title or image here will also update in your Link Library.'}</p>
            ` : `
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${escapeHtml(usingDefaults ? displayTitle : editTitle)}" placeholder="Link title" ${usingDefaults ? 'disabled' : ''}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${escapeHtml(link.url || '')}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${escapeHtml(currentImageUrl || '')}" placeholder="Image URL or upload" ${usingDefaults ? 'disabled' : ''}>
              <button class="btn-secondary" id="upload-image-btn" ${usingDefaults ? 'disabled' : ''}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${usingDefaults ? 'disabled' : ''}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${currentImageUrl ? `
              <div class="image-preview" style="margin-top:12px;">
                <img src="${escapeHtml(currentImageUrl)}" alt="Preview"
                     style="transform: ${imageTransformCSS(imgPos.x, imgPos.y, imgScale)};"
                     onerror="this.style.display='none'">
              </div>
              ${!usingDefaults ? `
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${imgPos.x ?? 50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${imgPos.y ?? 50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="200" value="${imgScale}" class="range-input">
              </div>
              ` : ''}
            ` : ''}
          </div>

          ${isCustomizing ? `
          <div class="form-actions">
              <button class="btn-secondary" id="save-as-library-btn" title="Create a new library link with this custom title/image">
                <i class="fas fa-plus"></i> Save as New Library Link
              </button>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
      `
    }
  } else {
    html += `
    <div style="text-align:center; padding:24px; color:#9ca3af;">
      <i class="fas fa-mouse-pointer" style="font-size:1.5rem; opacity:0.3; margin-bottom:8px; display:block;"></i>
      <p style="font-size:0.875rem;">Select a link in the sidebar to edit it</p>
    </div>
    `
  }

  container.innerHTML = html

  // ── Bind Presentation Info events ──
  // Live-update preview and trigger auto-save when presentation fields change
  ;['info-title', 'info-conference', 'info-location', 'info-date'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      updatePresentationDataLive()
      renderPreview()
      presentationSaver.trigger()
    })
  })
  ;['display-title', 'display-conference'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      updatePresentationDataLive()
      renderPreview()
      presentationSaver.trigger()
    })
  })

  // ── Bind Collection Settings events ──
  document.getElementById('copy-link-btn')?.addEventListener('click', copyCollectionLink)

  // Slug input — live URL preview + sanitize + warning + auto-save with confirmation
  const originalSlug = collection.slug || ''
  document.getElementById('collection-slug')?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    e.target.value = val
    const preview = document.getElementById('public-link-preview')
    const status = document.getElementById('slug-status')
    if (preview && profile?.username && val) {
      preview.textContent = `academiqr.com/u/${profile.username}/${val}`
    } else if (preview && val) {
      preview.textContent = `academiqr.com/public.html?collection=${collection.id.substring(0, 8)}...`
    }
    // Show warning if changing an existing slug
    if (status && originalSlug && val !== originalSlug) {
      status.innerHTML = '<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>'
    } else if (status) {
      status.textContent = ''
    }
    // Auto-save slug: confirm if changing an existing slug
    if (originalSlug && val !== originalSlug) {
      // Don't auto-save slug changes until user blurs (handled below)
    } else {
      settingsSaver.trigger()
    }
  })
  // On blur, if slug changed from original, confirm before saving
  document.getElementById('collection-slug')?.addEventListener('blur', () => {
    const val = document.getElementById('collection-slug')?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || ''
    if (originalSlug && val !== originalSlug && val) {
      const confirmed = confirm(
        'You are changing this collection\'s URL slug.\n\n' +
        'Any QR codes or shared links using the short URL format will stop working.\n' +
        '(Note: QR codes using the legacy ?collection= format will still work.)\n\n' +
        'Continue?'
      )
      if (confirmed) {
        settingsSaver.trigger()
      } else {
        document.getElementById('collection-slug').value = originalSlug
        const preview = document.getElementById('public-link-preview')
        if (preview && profile?.username && originalSlug) {
          preview.textContent = `academiqr.com/u/${profile.username}/${originalSlug}`
        }
        const status = document.getElementById('slug-status')
        if (status) status.textContent = ''
      }
    }
  })
  document.getElementById('collection-visibility')?.addEventListener('change', (e) => {
    const pg = document.getElementById('passkey-group')
    if (pg) pg.style.display = e.target.value === 'passkey' ? 'block' : 'none'
    settingsSaver.trigger()
  })
  document.getElementById('collection-passkey')?.addEventListener('input', () => {
    settingsSaver.trigger()
  })

  // ── Bind Link Editor events ──
  if (selectedLinkId) {
    const linkId = selectedLinkId
    document.getElementById('delete-link-btn')?.addEventListener('click', () => deleteLink(linkId))

    // Auto-save link fields on input/change
    ;['link-title', 'link-url', 'link-image'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        linkSaver.trigger()
      })
    })

    // Library/Custom toggle for ALL links
    document.querySelectorAll('input[name="link-source-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const link = links.find(l => l.id === linkId)
        if (!link) return

        const wantLibrary = e.target.value === 'library'

        if (link.source_link_id) {
          // Source-linked: toggle use_library_defaults
          link.use_library_defaults = wantLibrary
        } else {
          // Direct link: toggle custom_overrides
          if (wantLibrary) {
            // Revert to library version — clear overrides
            link.custom_overrides = null
          } else {
            // Customize — copy current values into overrides
            link.custom_overrides = {
              title: link.title || '',
              image_url: link.image_url || null,
              image_position: link.image_position || { x: 50, y: 50 },
              image_scale: link.image_scale ?? 100,
            }
          }
        }

        renderTabContent()
        renderLinksList()
        renderPreview()
      })
    })

    // Save as new library link
    document.getElementById('save-as-library-btn')?.addEventListener('click', () => saveAsNewLibraryLink(linkId))

    // Link image upload via file
    document.getElementById('upload-image-btn')?.addEventListener('click', () => {
      document.getElementById('link-image-file')?.click()
    })
    document.getElementById('link-image-file')?.addEventListener('change', handleLinkImageUpload)

    // Browse media library for link image
    document.getElementById('browse-media-btn')?.addEventListener('click', () => {
      openMediaLibrary((url) => {
        const imageInput = document.getElementById('link-image')
        if (imageInput) imageInput.value = url
        const link = links.find(l => l.id === linkId)
        if (link) {
          if (hasCustomOverrides(link)) {
            link.custom_overrides.image_url = url
          } else {
            link.image_url = url
          }
          renderPreview()
          renderLinksList()
          renderTabContent()
          linkSaver.trigger()
        }
      })
    })

    // Link image position sliders
    ;['link-img-pos-x', 'link-img-pos-y', 'link-img-scale'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        updateLinkImagePreview()
        linkSaver.trigger()
      })
    })
  }

  setupSectionToggle(container)
}

// ── Presentation Data Helpers ──
function updatePresentationDataLive() {
  const pd = collection.presentation_data || {}
  pd.title = document.getElementById('info-title')?.value || ''
  pd.conference = document.getElementById('info-conference')?.value || ''
  pd.location = document.getElementById('info-location')?.value || ''
  pd.date = document.getElementById('info-date')?.value || ''
  pd.displayTitle = document.getElementById('display-title')?.checked ?? true
  pd.displayConference = document.getElementById('display-conference')?.checked ?? true
  collection.presentation_data = pd
}

async function savePresentationData() {
  updatePresentationDataLive()
  try {
    const { error } = await supabase
      .from('link_lists')
      .update({ presentation_data: collection.presentation_data })
      .eq('id', collection.id)

    if (error) throw error

    renderSidebar()
    renderPreview()

    showSaveSuccess('save-presentation-btn')
  } catch (error) {
    console.error('Failed to save presentation data:', error)
    alert('Failed to save: ' + error.message)
  }
}

async function saveCollectionSettings() {
  const visibility = document.getElementById('collection-visibility')?.value || 'public'
  const newPasskey = document.getElementById('collection-passkey')?.value.trim()
  const slug = document.getElementById('collection-slug')?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || collection.slug

  // Warn if slug is being changed
  if (slug !== collection.slug && collection.slug) {
    const confirmed = confirm(
      'You are changing this collection\'s URL slug.\n\n' +
      'Any QR codes or shared links using the short URL format will stop working.\n' +
      '(Note: QR codes using the legacy ?collection= format will still work.)\n\n' +
      'Continue?'
    )
    if (!confirmed) return
  }

  try {
    const updates = { visibility, slug }

    // Only update passkey if a new one was entered
    if (visibility === 'passkey' && newPasskey) {
      updates.passkey_hash = newPasskey // In production, hash this
    } else if (visibility !== 'passkey') {
      updates.passkey_hash = null
    }

    const { error } = await supabase
      .from('link_lists')
      .update(updates)
      .eq('id', collection.id)

    if (error) throw error

    collection.visibility = visibility
    collection.slug = slug
    if (updates.passkey_hash !== undefined) collection.passkey_hash = updates.passkey_hash

    renderSidebar()

    showSaveSuccess('save-settings-btn')
  } catch (error) {
    console.error('Failed to save settings:', error)
    alert('Failed to save: ' + error.message)
  }
}

function copyCollectionLink() {
  const link = getPublicUrl(user.id, collection.id, {
    username: profile?.username,
    slug: collection.slug,
  })
  navigator.clipboard.writeText(link).then(() => {
    const btn = document.getElementById('copy-link-btn')
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i>'
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i>' }, 1500)
    }
  }).catch(() => {
    // Fallback for older browsers
    prompt('Copy this link:', link)
  })
}

// ── Link Image Upload (base64, matching v0.6.7) ──
async function handleLinkImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // No size limit — image is compressed before upload

  const uploadBtn = document.getElementById('upload-image-btn')
  const originalHtml = uploadBtn?.innerHTML
  try {
    // Show loading state
    if (uploadBtn) {
      uploadBtn.disabled = true
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'
    }

    // Compress and upload to Supabase Storage
    const publicUrl = await compressAndUpload(file, 'links', user.id, { maxWidth: 800, maxHeight: 800 })

    const imageInput = document.getElementById('link-image')
    if (imageInput) imageInput.value = publicUrl

    // Update in memory and re-render
    const link = links.find(l => l.id === selectedLinkId)
    if (link) {
      if (hasCustomOverrides(link)) {
        link.custom_overrides.image_url = publicUrl
      } else {
        link.image_url = publicUrl
      }
      renderPreview()
      renderLinksList()
      linkSaver.trigger()
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    alert('Image upload failed: ' + error.message)
  } finally {
    if (uploadBtn) {
      uploadBtn.disabled = false
      uploadBtn.innerHTML = originalHtml
    }
  }
}

function updateLinkImagePreview() {
  const link = links.find(l => l.id === selectedLinkId)
  if (!link) return

  const x = parseInt(document.getElementById('link-img-pos-x')?.value) || 50
  const y = parseInt(document.getElementById('link-img-pos-y')?.value) || 50
  const scale = parseInt(document.getElementById('link-img-scale')?.value) || 100

  // Update in memory — respect custom overrides mode
  if (hasCustomOverrides(link)) {
    link.custom_overrides.image_position = { x, y }
    link.custom_overrides.image_scale = scale
  } else {
    link.image_position = { x, y }
    link.image_scale = scale
  }

  // Update the inline preview (square crop — matches phone preview transform)
  const previewImg = document.querySelector('.image-preview img')
  if (previewImg) {
    previewImg.style.transform = imageTransformCSS(x, y, scale)
  }

  renderPreview()
}

// Normalize v0.6.7 theme keys to consistent naming
function normalizeTheme(raw) {
  // Handle null/undefined/empty — return brand defaults for new collections
  if (!raw || (typeof raw === 'object' && Object.keys(raw).length === 0)) return { ...DEFAULT_THEME }

  // Handle string-encoded JSON (v0.6.7 edge case)
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw) } catch { return normalizeTheme(null) }
  }

  // v0.6.7 compatibility: map old key names
  // v0.6.7 uses "gradientBorderEnabled" for border toggle, "textColor" for combined text color,
  // "background" for CSS background shorthand, "presentationColor" / "profileColor" as aliases
  // v0.6.7 uses "borderGradientText" for gradient CSS (not "borderGradient")
  // Border enabled: v0.6.7 uses "gradientBorderEnabled", v1.0 uses "borderEnabled"
  // Use truthiness check (not strict ===) to handle edge cases from JSONB
  const borderOn = !!(raw.borderEnabled || raw.gradientBorderEnabled)

  // Resolve text color — for collections migrated from v0.6.7, textColor is the canonical field
  // v1.0 may have saved stale profileTextColor/presentationTextColor during buggy intermediate saves
  // Use textColor (v0.6.7 canonical) as highest priority if it exists
  const resolvedTextColor = [
    raw.textColor, raw.presentationTextColor, raw.profileTextColor,
    raw.presentationColor, raw.profileColor
  ].find(c => typeof c === 'string' && c.length > 0) || '#1A2F5B'

  const normalized = {
    backgroundType: raw.backgroundType || 'solid',
    backgroundColor: raw.backgroundColor || '#ffffff',
    gradientText: raw.gradientText || '',
    backgroundImage: raw.backgroundImage || '',
    backgroundImageX: raw.backgroundImageX ?? raw.imagePositionX ?? 50,
    backgroundImageY: raw.backgroundImageY ?? raw.imagePositionY ?? 50,
    backgroundImageScale: raw.backgroundImageScale ?? raw.imageScale ?? 100,
    profileTextColor: resolvedTextColor,
    presentationTextColor: resolvedTextColor,
    buttonTextColor: raw.buttonTextColor || '#000000',
    buttonBackgroundColor: raw.buttonBackgroundColor || raw.buttonBgColor || '#1A2F5B',
    buttonStyle: raw.buttonStyle || 'soft',
    buttonBorderRadius: raw.buttonBorderRadius || raw.borderRadius || '8px',
    buttonPadding: raw.buttonPadding || '12px 24px',
    buttonFontSize: raw.buttonFontSize || '16px',
    buttonFontWeight: raw.buttonFontWeight || '500',
    textFontSize: raw.textFontSize || '18px',
    textFontWeight: raw.textFontWeight || '600',
    // v0.6.7 uses "gradientBorderEnabled" for the border toggle
    borderEnabled: borderOn,
    borderType: raw.borderType || 'solid',
    // v0.6.7 may save borderStyle as CSS value ('solid') from computedStyle — normalize to 'fill'/'thin'
    borderStyle: (raw.borderStyle === 'fill' || raw.borderStyle === 'thin') ? raw.borderStyle : 'fill',
    borderColor: raw.borderColor || '#1A2F5B',
    borderWidth: raw.borderWidth || '1px',
    // v0.6.7 saves gradient as "borderGradientText", v1.0 uses "borderGradient"
    borderGradient: raw.borderGradient || raw.borderGradientText || '',
    borderGradientAngle: raw.borderGradientAngle || '',
  }


  return normalized
}

const COLOR_PRESETS = ['#ffffff', '#e5e7eb', '#9ca3af', '#1f2937', '#000000', '#1A2F5B']
const GRADIENT_PRESETS = [
  'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  'linear-gradient(135deg, #1A2F5B, #3B5B8F)',
  'linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)'
]

function colorPresetsHtml(selectedColor) {
  return `<div class="color-presets">${COLOR_PRESETS.map(c =>
    `<button type="button" class="color-preset ${c === selectedColor ? 'active' : ''}" data-color="${c}" style="background:${c};${c === '#ffffff' ? 'border:1px solid #e5e7eb;' : ''}" title="${c}"></button>`
  ).join('')}</div>`
}

function renderAppearanceTab(container) {
  const nt = normalizeTheme(collection.theme)

  const bgType = nt.backgroundType
  const bgColor = nt.backgroundColor
  const gradientText = nt.gradientText || 'linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)'
  const profileTextColor = nt.profileTextColor
  const presentationTextColor = nt.presentationTextColor
  const buttonTextColor = nt.buttonTextColor
  const buttonBgColor = nt.buttonBackgroundColor
  const buttonStyle = nt.buttonStyle
  const borderEnabled = nt.borderEnabled
  const borderType = nt.borderType
  const borderStyle = nt.borderStyle
  const borderColor = nt.borderColor
  const borderWidth = nt.borderWidth
  const borderRadius = nt.buttonBorderRadius
  const borderGradient = nt.borderGradient

  const chevronSvg = CHEVRON_SVG

  container.innerHTML = `
    <div class="appearance-editor">
      <!-- ═══ BACKGROUND ═══ -->
      <div class="section">
        <div class="section-header" data-section="background-section">
          <h3>Background <span id="theme-save-status" class="auto-save-status"></span></h3>
          ${chevronSvg}
        </div>
        <div class="section-content" id="background-section">
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label"><input type="radio" name="bg-type" value="solid" ${bgType === 'solid' ? 'checked' : ''}> Solid Color</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="gradient" ${bgType === 'gradient' ? 'checked' : ''}> Gradient</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="image" ${bgType === 'image' ? 'checked' : ''}> Image</label>
            </div>
          </div>

          <!-- Solid Color -->
          <div id="bg-solid-group" style="display:${bgType === 'solid' ? 'block' : 'none'}">
            <div class="form-group">
              <div class="color-input-row">
                <input type="color" id="theme-bg-color" value="${bgColor}">
                <input type="text" id="theme-bg-color-text" value="${bgColor}" class="color-text">
              </div>
              ${colorPresetsHtml(bgColor)}
            </div>
          </div>

          <!-- Gradient -->
          <div id="bg-gradient-group" style="display:${bgType === 'gradient' ? 'block' : 'none'}">
            <div class="form-group">
              <label>Gradient CSS</label>
              <textarea id="theme-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${escapeHtml(gradientText)}</textarea>
              <div class="gradient-preview" id="gradient-preview" style="background: ${gradientText};"></div>
            </div>
            <div class="form-group">
              <label>Presets</label>
              <div class="gradient-presets">
                ${GRADIENT_PRESETS.map((g, i) => `
                  <button type="button" class="gradient-preset" data-gradient="${escapeHtml(g)}" style="background: ${g};" title="Preset ${i + 1}"></button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Image -->
          <div id="bg-image-group" style="display:${bgType === 'image' ? 'block' : 'none'}">
            <div class="form-group">
              <label>Background Image</label>
              <div class="image-upload-row">
                <button type="button" class="btn-save-compact" id="bg-upload-btn"><i class="fas fa-folder-open"></i> Choose File</button>
                <button type="button" class="btn-save-compact" id="bg-browse-media-btn"><i class="fas fa-images"></i> Browse Library</button>
                <input type="file" id="bg-image-file" accept="image/*" style="display:none">
              </div>
              ${nt.backgroundImage ? `
                <div class="bg-image-preview" style="background-image: url('${nt.backgroundImage}');"></div>
                <button type="button" class="btn-ghost btn-sm" id="bg-image-remove"><i class="fas fa-times"></i> Remove</button>
              ` : ''}
            </div>
            <div class="form-group">
              <label>Position X</label>
              <input type="range" id="bg-pos-x" min="0" max="100" value="${nt.backgroundImageX}" class="range-input">
            </div>
            <div class="form-group">
              <label>Position Y</label>
              <input type="range" id="bg-pos-y" min="0" max="100" value="${nt.backgroundImageY}" class="range-input">
            </div>
            <div class="form-group">
              <label>Scale</label>
              <input type="range" id="bg-pos-scale" min="50" max="200" value="${nt.backgroundImageScale}" class="range-input">
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TEXT & BUTTONS ═══ -->
      <div class="section">
        <div class="section-header" data-section="text-buttons-section">
          <h3>Text & Buttons</h3>
          ${chevronSvg}
        </div>
        <div class="section-content" id="text-buttons-section">
          <div class="form-group">
            <label>Profile and Presentation Information Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-presentation-text" value="${presentationTextColor}">
              <input type="text" id="theme-presentation-text-val" value="${presentationTextColor}" class="color-text">
            </div>
            ${colorPresetsHtml(presentationTextColor)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${buttonTextColor}">
              <input type="text" id="theme-btn-text-val" value="${buttonTextColor}" class="color-text">
            </div>
            ${colorPresetsHtml(buttonTextColor)}
          </div>
          <div class="form-group">
            <label>Button Style</label>
            <select id="theme-button-style" class="form-select">
              <option value="soft" ${buttonStyle === 'soft' ? 'selected' : ''}>Soft Glass</option>
              <option value="solid" ${buttonStyle === 'solid' ? 'selected' : ''}>Solid</option>
              <option value="outline" ${buttonStyle === 'outline' ? 'selected' : ''}>Outline</option>
            </select>
          </div>
          <div class="form-group" id="btn-bg-group" style="display:${buttonStyle === 'solid' ? 'block' : 'none'}">
            <label>Button Background Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-bg" value="${buttonBgColor}">
              <input type="text" id="theme-btn-bg-val" value="${buttonBgColor}" class="color-text">
            </div>
            ${colorPresetsHtml(buttonBgColor)}
          </div>
        </div>
      </div>

      <!-- ═══ BORDER EFFECTS ═══ -->
      <div class="section">
        <div class="section-header" data-section="border-effects-section">
          <h3>Border Effects</h3>
          ${chevronSvg}
        </div>
        <div class="section-content" id="border-effects-section">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="theme-border-enabled" ${borderEnabled ? 'checked' : ''}>
              <span>Enable Custom Border</span>
            </label>
          </div>
          <div id="border-options" style="display:${borderEnabled ? 'block' : 'none'}">
            <div class="form-group">
              <label>Border Type</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-type" value="solid" ${borderType === 'solid' ? 'checked' : ''}> Solid Color</label>
                <label class="radio-label"><input type="radio" name="border-type" value="gradient" ${borderType === 'gradient' ? 'checked' : ''}> Gradient</label>
              </div>
            </div>
            <div class="form-group">
              <label>Border Style</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-style" value="fill" ${borderStyle === 'fill' ? 'checked' : ''}> Frame Fill</label>
                <label class="radio-label"><input type="radio" name="border-style" value="thin" ${borderStyle === 'thin' ? 'checked' : ''}> Thin Border</label>
              </div>
            </div>

            <!-- Solid border color -->
            <div id="border-solid-group" style="display:${borderType === 'solid' ? 'block' : 'none'}">
              <div class="form-group">
                <label>Border Color</label>
                <div class="color-input-row">
                  <input type="color" id="theme-border-color" value="${borderColor}">
                  <input type="text" id="theme-border-color-val" value="${borderColor}" class="color-text">
                </div>
                ${colorPresetsHtml(borderColor)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${borderType === 'gradient' ? 'block' : 'none'}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${escapeHtml(borderGradient)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${borderGradient || 'linear-gradient(45deg, #1A2F5B, #3B5B8F)'};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${GRADIENT_PRESETS.map((g, i) => `
                    <button type="button" class="border-gradient-preset" data-gradient="${escapeHtml(g)}" style="background: ${g};" title="Preset ${i + 1}"></button>
                  `).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══ THEME MANAGEMENT ═══ -->
      <div class="section">
        <div class="section-header" data-section="theme-management-section">
          <h3>Theme Management</h3>
          ${CHEVRON_SVG_COLLAPSED}
        </div>
        <div class="section-content collapsed" id="theme-management-section">
          <div class="form-group">
            <label>New Theme</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="theme-name" placeholder="Enter theme name" maxlength="100" style="flex:1;">
              <button type="button" class="btn-save-compact" id="save-new-theme-btn">Save Theme</button>
            </div>
          </div>
          <div class="form-group">
            <label>Saved Themes</label>
            <div id="saved-themes-list">
              <p style="color:#9ca3af; font-size:0.875rem;">Loading...</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `

  // ── Sync color pickers with text inputs ──
  const colorPairs = [
    ['theme-bg-color', 'theme-bg-color-text'],
    ['theme-presentation-text', 'theme-presentation-text-val'],
    ['theme-btn-bg', 'theme-btn-bg-val'],
    ['theme-btn-text', 'theme-btn-text-val'],
    ['theme-border-color', 'theme-border-color-val']
  ]
  colorPairs.forEach(([picker, text]) => {
    document.getElementById(picker)?.addEventListener('input', (e) => {
      const t = document.getElementById(text)
      if (t) t.value = e.target.value
      livePreviewTheme()
    })
    document.getElementById(text)?.addEventListener('input', (e) => {
      const p = document.getElementById(picker)
      if (p && /^#[0-9a-fA-F]{6}$/.test(e.target.value)) p.value = e.target.value
      livePreviewTheme()
    })
  })

  // ── Color preset buttons ──
  container.addEventListener('click', (e) => {
    const preset = e.target.closest('.color-preset')
    if (!preset) return
    const color = preset.dataset.color
    const row = preset.closest('.form-group')
    const picker = row?.querySelector('input[type="color"]')
    const text = row?.querySelector('.color-text')
    if (picker) picker.value = color
    if (text) text.value = color
    // Update active state
    row?.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'))
    preset.classList.add('active')
    livePreviewTheme()
  })

  // ── Gradient preset buttons ──
  container.querySelectorAll('.gradient-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const textarea = document.getElementById('theme-gradient')
      const preview = document.getElementById('gradient-preview')
      if (textarea) textarea.value = btn.dataset.gradient
      if (preview) preview.style.background = btn.dataset.gradient
      livePreviewTheme()
    })
  })
  container.querySelectorAll('.border-gradient-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const textarea = document.getElementById('theme-border-gradient')
      const preview = document.getElementById('border-gradient-preview')
      if (textarea) textarea.value = btn.dataset.gradient
      if (preview) preview.style.background = btn.dataset.gradient
      livePreviewTheme()
    })
  })

  // ── Background type radio toggle ──
  container.querySelectorAll('input[name="bg-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('bg-solid-group').style.display = e.target.value === 'solid' ? 'block' : 'none'
      document.getElementById('bg-gradient-group').style.display = e.target.value === 'gradient' ? 'block' : 'none'
      document.getElementById('bg-image-group').style.display = e.target.value === 'image' ? 'block' : 'none'
      livePreviewTheme()
    })
  })

  // ── Button style — show/hide bg color ──
  document.getElementById('theme-button-style')?.addEventListener('change', (e) => {
    const bgGroup = document.getElementById('btn-bg-group')
    if (bgGroup) bgGroup.style.display = e.target.value === 'solid' ? 'block' : 'none'
    livePreviewTheme()
  })

  // ── Border enable toggle ──
  document.getElementById('theme-border-enabled')?.addEventListener('change', (e) => {
    const opts = document.getElementById('border-options')
    if (opts) opts.style.display = e.target.checked ? 'block' : 'none'
    livePreviewTheme()
  })

  // ── Border type radio toggle ──
  container.querySelectorAll('input[name="border-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('border-solid-group').style.display = e.target.value === 'solid' ? 'block' : 'none'
      document.getElementById('border-gradient-group').style.display = e.target.value === 'gradient' ? 'block' : 'none'
      livePreviewTheme()
    })
  })

  // ── Gradient textarea live preview ──
  document.getElementById('theme-gradient')?.addEventListener('input', (e) => {
    const preview = document.getElementById('gradient-preview')
    if (preview) preview.style.background = e.target.value
    livePreviewTheme()
  })
  document.getElementById('theme-border-gradient')?.addEventListener('input', (e) => {
    const preview = document.getElementById('border-gradient-preview')
    if (preview) preview.style.background = e.target.value
    livePreviewTheme()
  })

  // ── Image position sliders ──
  ;['bg-pos-x', 'bg-pos-y', 'bg-pos-scale'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', livePreviewTheme)
  })

  // ── Background image upload ──
  document.getElementById('bg-upload-btn')?.addEventListener('click', () => {
    document.getElementById('bg-image-file')?.click()
  })
  document.getElementById('bg-image-file')?.addEventListener('change', handleBgImageUpload)

  // Browse media library for background image
  document.getElementById('bg-browse-media-btn')?.addEventListener('click', () => {
    openMediaLibrary((url) => {
      collection._pendingBgImage = url
      livePreviewTheme()
      renderAppearanceTab(document.getElementById('tab-content'))
    })
  })

  // ── All other live-updating fields ──
  ;['theme-button-style'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', livePreviewTheme)
  })
  container.querySelectorAll('input[name="border-style"]').forEach(r => {
    r.addEventListener('change', livePreviewTheme)
  })

  setupSectionToggle(container)

  document.getElementById('save-new-theme-btn')?.addEventListener('click', saveNamedTheme)

  // Load saved themes
  loadSavedThemes()
}

async function handleBgImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const uploadBtn = document.getElementById('bg-upload-btn')
  const originalHtml = uploadBtn?.innerHTML
  try {
    if (uploadBtn) {
      uploadBtn.disabled = true
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'
    }

    const publicUrl = await compressAndUpload(file, 'backgrounds', user.id, { maxWidth: 1920, maxHeight: 1920 })

    collection._pendingBgImage = publicUrl
    livePreviewTheme()
    renderAppearanceTab(document.getElementById('tab-content'))
  } catch (error) {
    console.error('Background image upload failed:', error)
    alert('Background image upload failed: ' + error.message)
  } finally {
    if (uploadBtn) {
      uploadBtn.disabled = false
      uploadBtn.innerHTML = originalHtml
    }
  }
}

function livePreviewTheme() {
  const formTheme = getThemeFromForm()
  const mergedTheme = { ...collection.theme, ...formTheme }
  if (collection._pendingBgImage) {
    mergedTheme.backgroundImage = collection._pendingBgImage
  }
  renderPreview(mergedTheme)
  if (themeSaver) themeSaver.trigger()
}

function renderQRCodeTab(container) {
  renderQRTab(container, collection, user)
}

function renderAnalyticsTab(container) {
  renderAnalyticsModule(container, collection, user)
}

// ── Live Preview ──
// Renders phone preview matching v0.6.7's exact HTML structure and CSS classes
function renderPreview(themeOverride) {
  const preview = document.getElementById('phone-preview')
  if (!preview) return

  const nt = normalizeTheme(themeOverride || collection.theme)
  const pd = collection.presentation_data || {}
  const p = profile || {}

  // Background
  const bgType = nt.backgroundType
  let bgStyle = ''
  if (bgType === 'gradient' && nt.gradientText) {
    bgStyle = `background: ${nt.gradientText};`
  } else if (bgType === 'image' && nt.backgroundImage) {
    const posX = nt.backgroundImageX
    const posY = nt.backgroundImageY
    const scale = nt.backgroundImageScale
    bgStyle = `background: url('${nt.backgroundImage}') ${posX}% ${posY}% / ${scale}% no-repeat;`
  } else {
    bgStyle = `background: ${nt.backgroundColor};`
  }

  // Text colors — profile and presentation always use the same color
  const presentationTextColor = nt.presentationTextColor
  const profileTextColor = presentationTextColor

  // Button styles
  const buttonStyle = nt.buttonStyle
  const buttonBg = nt.buttonBackgroundColor
  const buttonText = nt.buttonTextColor
  const borderRadius = nt.buttonBorderRadius
  const borderEnabled = nt.borderEnabled
  const borderType = nt.borderType
  const borderStyle = nt.borderStyle
  const borderColor = nt.borderColor
  const borderGradient = nt.borderGradient

  // Profile photo
  const photoSrc = p.profile_photo || ''
  let photoPosition = { scale: 100, x: 50, y: 50 }
  if (p.profile_photo_position) {
    try {
      photoPosition = typeof p.profile_photo_position === 'string'
        ? JSON.parse(p.profile_photo_position)
        : p.profile_photo_position
    } catch { /* use defaults */ }
  }
  const scaleVal = (photoPosition.scale || 100) / 100
  const panX = ((photoPosition.x || 50) - 50) * -1
  const panY = ((photoPosition.y || 50) - 50) * -1

  // Social links
  const socials = [
    { key: 'social_email', icon: 'fa-envelope', prefix: 'mailto:' },
    { key: 'social_instagram', icon: 'fa-instagram', prefix: '' },
    { key: 'social_facebook', icon: 'fa-facebook', prefix: '' },
    { key: 'social_twitter', icon: 'fa-x-twitter', prefix: '' },
    { key: 'social_linkedin', icon: 'fa-linkedin', prefix: '' },
    { key: 'social_youtube', icon: 'fa-youtube', prefix: '' },
    { key: 'social_tiktok', icon: 'fa-tiktok', prefix: '' },
    { key: 'social_snapchat', icon: 'fa-snapchat', prefix: '' }
  ].filter(s => p[s.key]?.trim())

  // Presentation data
  const title = pd.title || 'Untitled'
  const showTitle = pd.displayTitle !== false
  const showConference = pd.displayConference !== false
  const conference = pd.conference || ''
  const location = pd.location || ''
  const date = pd.date ? formatDate(pd.date) : ''

  const activeLinks = links.filter(l => l.is_active !== false)

  // Build inline style for link buttons — border effects do NOT apply here (they're for the phone frame)
  function btnInlineStyle() {
    let style = `color: ${buttonText}; border-radius: 8px; font-size: 1.14rem;`

    if (buttonStyle === 'solid') {
      style += `background: ${buttonBg} !important; border-color: ${buttonBg} !important;`
    } else if (buttonStyle === 'outline') {
      style += `background: transparent !important; border: 2px solid ${buttonText} !important; color: ${buttonText} !important;`
    } else {
      // soft (glass) — default CSS class styling, just override text color
      style += `color: ${buttonText} !important;`
    }

    return style
  }

  // Apply border effects to PHONE FRAME only (matches v0.6.7 behavior)
  const mockup = preview.closest('.phone-mockup') || preview.parentElement
  if (mockup) {
    // Reset styles first
    mockup.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
    mockup.style.padding = '8px'

    if (borderEnabled) {
      if (borderType === 'gradient' && borderGradient) {
        // Gradient border on phone frame
        if (borderStyle === 'thin') {
          mockup.style.background = borderGradient
          mockup.style.padding = '8px'
          mockup.style.boxShadow = `inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)`
        } else {
          // frame fill
          mockup.style.background = borderGradient
          mockup.style.padding = '8px'
        }
      } else {
        // Solid border on phone frame
        if (borderStyle === 'thin') {
          mockup.style.background = '#1e293b'
          mockup.style.boxShadow = `inset 0 0 0 8px ${borderColor}, 0 20px 40px rgba(0, 0, 0, 0.3)`
        } else {
          // frame fill
          mockup.style.background = borderColor
        }
      }
    } else {
      mockup.style.background = '#1e293b'
    }
  }

  // Has any presentation info to show?
  const hasPresentation = (showTitle && title) || (showConference && conference) || location || date

  preview.innerHTML = `
    <div class="phone-screen" style="${bgStyle}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${photoSrc ? `
            <div class="phone-avatar">
              <img src="${escapeHtml(photoSrc)}" alt="Profile"
                   style="transform: translate(${panX}%, ${panY}%) scale(${scaleVal}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          ` : ''}
          <div class="phone-name-section">
            ${p.display_name ? `<h4 class="phone-display-name" style="color: ${profileTextColor};">${escapeHtml(p.display_name)}</h4>` : ''}
            ${socials.length > 0 ? `
              <div class="phone-socials">
                ${socials.map(s => `
                  <span class="phone-social-icon ${s.key}" title="${s.key.replace('social_', '')}">
                    <i class="${s.key === 'social_email' ? 'fas' : 'fab'} ${s.icon}"></i>
                  </span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Presentation Info -->
        ${hasPresentation ? `
          <div class="phone-presentation" style="color: ${presentationTextColor};">
            ${showTitle ? `<div class="phone-info-field"><span class="phone-info-value">${escapeHtml(title)}</span></div>` : ''}
            ${showConference && conference ? `<div class="phone-info-field"><span class="phone-info-value">${escapeHtml(conference)}</span></div>` : ''}
            ${location ? `<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${escapeHtml(location)}</span></div>` : ''}
            ${date ? `<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${escapeHtml(date)}</span></div>` : ''}
          </div>
        ` : ''}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${activeLinks.length === 0 ? `
          <p class="phone-empty" style="color: ${presentationTextColor};">No active links</p>
        ` : activeLinks.map(link => {
          // Calculate link image transform — use resolved values for library-linked links
          const pos = getDisplayImagePosition(link)
          const sc = getDisplayImageScale(link)
          const imgTransform = imageTransformCSS(pos.x, pos.y, sc)
          const linkImgUrl = getDisplayImageUrl(link)
          const linkTitle = getDisplayTitle(link) || 'Untitled'

          return `
            <div class="phone-link-btn ${buttonStyle}" style="${btnInlineStyle()}">
              ${linkImgUrl ? `
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${escapeHtml(linkImgUrl)}" alt=""
                      style="transform: ${imgTransform};"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              ` : ''}
              <div class="phone-link-text">${escapeHtml(linkTitle)}</div>
            </div>
          `
        }).join('')}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${profileTextColor};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${profileTextColor};">AcademiQR.com</a></p>
      </div>
    </div>
  `
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Data Actions ──

async function saveLink(linkId) {
  const link = links.find(l => l.id === linkId)
  if (!link) return

  const title = document.getElementById('link-title')?.value.trim()
  const url = document.getElementById('link-url')?.value.trim()
  const imageUrl = document.getElementById('link-image')?.value.trim()

  // Determine which mode this link is in
  const hasSource = !!link.source_link_id
  const hasCustom = hasCustomOverrides(link)
  const isCustomizing = hasSource ? !link.use_library_defaults : hasCustom
  const usingDefaults = hasSource && link.use_library_defaults

  const imgPosX = usingDefaults ? (link.image_position?.x ?? 50) : (parseInt(document.getElementById('link-img-pos-x')?.value) || 50)
  const imgPosY = usingDefaults ? (link.image_position?.y ?? 50) : (parseInt(document.getElementById('link-img-pos-y')?.value) || 50)
  const imgScale = usingDefaults ? (link.image_scale ?? 100) : (parseInt(document.getElementById('link-img-scale')?.value) || 100)

  try {
    const updates = {
      url,
      use_library_defaults: !!link.use_library_defaults,
    }

    if (isCustomizing && !hasSource) {
      // Non-source link with per-collection overrides → save to custom_overrides JSONB
      updates.custom_overrides = {
        title: title,
        image_url: imageUrl || null,
        image_position: { x: imgPosX, y: imgPosY },
        image_scale: imgScale,
      }
      // Don't touch the top-level title/image_url (that's the library version)
    } else if (!usingDefaults) {
      // Source link in custom mode, OR non-source link in library mode → save to top-level columns
      updates.title = title
      updates.image_url = imageUrl || null
      updates.image_position = { x: imgPosX, y: imgPosY }
      updates.image_scale = imgScale
      updates.custom_overrides = null // clear any prior overrides
    }
    // If usingDefaults (source link in sync mode), don't update title/image at all

    const { error } = await supabase
      .from('link_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', linkId)

    if (error) throw error

    Object.assign(link, updates)

    renderLinksList()
    renderPreview()

    showSaveSuccess('save-link-btn')
  } catch (error) {
    console.error('Failed to save link:', error)
    alert('Failed to save: ' + error.message)
  }
}

// ── Save as New Library Link ──
// Creates a new link_items row with the customized title/image as canonical values
async function saveAsNewLibraryLink(linkId) {
  const link = links.find(l => l.id === linkId)
  if (!link) return

  // Get current form values (the customized version)
  const title = document.getElementById('link-title')?.value.trim()
  const url = document.getElementById('link-url')?.value.trim()
  const imageUrl = document.getElementById('link-image')?.value.trim()
  const imgPosX = parseInt(document.getElementById('link-img-pos-x')?.value) || 50
  const imgPosY = parseInt(document.getElementById('link-img-pos-y')?.value) || 50
  const imgScale = parseInt(document.getElementById('link-img-scale')?.value) || 100

  if (!title) { alert('Please enter a title.'); return }
  if (!url) { alert('Please enter a URL.'); return }

  try {
    const maxOrder = links.reduce((max, l) => Math.max(max, l.order_index || 0), 0)

    const { data, error } = await supabase
      .from('link_items')
      .insert({
        list_id: collection.id,
        title,
        url,
        image_url: imageUrl || null,
        image_position: { x: imgPosX, y: imgPosY },
        image_scale: imgScale,
        order_index: maxOrder + 100,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    links.push(data)
    selectedLinkId = data.id
    renderLinksList()
    renderTabContent()
    renderPreview()
    renderSidebar()

    showSaveSuccess('save-as-library-btn')
  } catch (error) {
    console.error('Failed to create library link:', error)
    alert('Failed to create: ' + error.message)
  }
}

async function deleteLink(linkId) {
  const link = links.find(l => l.id === linkId)
  if (!link || !confirm(`Delete "${link.title || 'this link'}"?`)) return

  try {
    const { error } = await supabase.from('link_items').delete().eq('id', linkId).eq('list_id', collection.id)
    if (error) throw error

    links = links.filter(l => l.id !== linkId)
    selectedLinkId = null
    renderLinksList()
    renderTabContent()
    renderPreview()
    renderSidebar()
  } catch (error) {
    console.error('Failed to delete link:', error)
    alert('Failed to delete: ' + error.message)
  }
}

async function toggleLinkActive(linkId) {
  const link = links.find(l => l.id === linkId)
  if (!link) return

  const newActive = link.is_active === false

  try {
    const { error } = await supabase
      .from('link_items')
      .update({ is_active: newActive })
      .eq('id', linkId)

    if (error) throw error
    link.is_active = newActive
    renderLinksList()
    renderPreview()
  } catch (error) {
    console.error('Failed to toggle link:', error)
  }
}

// ── Add New Link (Modal) ──
function openNewLinkModal() {
  const modal = document.getElementById('new-link-modal')
  if (!modal) return
  document.getElementById('new-link-title').value = ''
  document.getElementById('new-link-url').value = ''
  document.getElementById('new-link-image').value = ''
  modal.style.display = 'flex'
  document.getElementById('new-link-title').focus()
}

function closeNewLinkModal() {
  const modal = document.getElementById('new-link-modal')
  if (modal) modal.style.display = 'none'
}

async function saveNewLink() {
  const title = document.getElementById('new-link-title')?.value.trim()
  const url = document.getElementById('new-link-url')?.value.trim()
  const imageUrl = document.getElementById('new-link-image')?.value.trim()

  if (!title) { alert('Please enter a title.'); return }
  if (!url) { alert('Please enter a URL.'); return }

  try {
    const maxOrder = links.reduce((max, l) => Math.max(max, l.order_index || 0), 0)

    const { data, error } = await supabase
      .from('link_items')
      .insert({
        list_id: collection.id,
        title, url,
        image_url: imageUrl || null,
        order_index: maxOrder + 100,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    links.push(data)
    selectedLinkId = data.id
    closeNewLinkModal()
    renderLinksList()
    renderTabContent()
    renderPreview()
    renderSidebar()
  } catch (error) {
    console.error('Failed to add link:', error)
    alert('Failed to add link: ' + error.message)
  }
}

// ── Add Existing Link (from other collections) ──
let allUserLinks = []

async function openExistingLinkModal() {
  const modal = document.getElementById('existing-link-modal')
  if (!modal) return
  modal.style.display = 'flex'

  const list = document.getElementById('existing-links-list')
  if (list) list.innerHTML = '<p class="existing-link-empty">Loading...</p>'

  try {
    const { data, error } = await supabase
      .from('link_items')
      .select('*, link_lists!inner(id, slug, presentation_data, owner_id)')
      .eq('link_lists.owner_id', user.id)
      .neq('list_id', collection.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    allUserLinks = data || []
    renderExistingLinks('')
  } catch (error) {
    console.error('Failed to load links:', error)
    if (list) list.innerHTML = '<p class="existing-link-empty">Failed to load links.</p>'
  }
}

function renderExistingLinks(query) {
  const list = document.getElementById('existing-links-list')
  if (!list) return

  const q = query.toLowerCase()
  const filtered = q
    ? allUserLinks.filter(l =>
        (l.title || '').toLowerCase().includes(q) ||
        (l.url || '').toLowerCase().includes(q))
    : allUserLinks

  if (filtered.length === 0) {
    list.innerHTML = `<p class="existing-link-empty">${q ? 'No matches found.' : 'No links in other collections.'}</p>`
    return
  }

  list.innerHTML = filtered.map(link => {
    const collName = link.link_lists?.presentation_data?.title || link.link_lists?.slug || ''
    return `
      <div class="existing-link-item" data-link-id="${link.id}">
        <div class="link-thumb">
          ${link.image_url
            ? `<img src="${escapeHtml(link.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`
            : '<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${escapeHtml(link.title || 'Untitled')}</div>
          <div class="link-url">${escapeHtml(truncateUrl(link.url || ''))}</div>
        </div>
        <span class="link-collection-name">${escapeHtml(collName)}</span>
      </div>
    `
  }).join('')

  list.querySelectorAll('.existing-link-item').forEach(item => {
    item.addEventListener('click', () => addExistingLink(item.dataset.linkId))
  })
}

async function addExistingLink(sourceLinkId) {
  const sourceLink = allUserLinks.find(l => l.id === sourceLinkId)
  if (!sourceLink) return

  try {
    const maxOrder = links.reduce((max, l) => Math.max(max, l.order_index || 0), 0)

    const { data, error } = await supabase
      .from('link_items')
      .insert({
        list_id: collection.id,
        title: sourceLink.title,
        url: sourceLink.url,
        image_url: sourceLink.image_url,
        image_position: sourceLink.image_position || null,
        image_scale: sourceLink.image_scale || null,
        order_index: maxOrder + 100,
        is_active: true,
        source_link_id: sourceLinkId,
        use_library_defaults: true
      })
      .select()
      .single()

    if (error) throw error

    // Copy resolved values so preview works immediately
    data._resolved_title = sourceLink.title
    data._resolved_image_url = sourceLink.image_url
    data._resolved_image_position = sourceLink.image_position
    data._resolved_image_scale = sourceLink.image_scale
    links.push(data)
    selectedLinkId = data.id
    closeExistingLinkModal()
    renderLinksList()
    renderTabContent()
    renderPreview()
    renderSidebar()
  } catch (error) {
    console.error('Failed to add existing link:', error)
    alert('Failed to add link: ' + error.message)
  }
}

function closeExistingLinkModal() {
  const modal = document.getElementById('existing-link-modal')
  if (modal) modal.style.display = 'none'
  allUserLinks = []
}

// ── Media Library Modal ──
let mediaLibraryCallback = null

async function openMediaLibrary(callback) {
  mediaLibraryCallback = callback
  const modal = document.getElementById('media-library-modal')
  const content = document.getElementById('media-library-content')
  if (!modal || !content) return

  modal.style.display = 'flex'

  // Show loading
  content.innerHTML = `
    <div style="text-align:center; padding:32px; color:#9ca3af;">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>
      <p style="margin-top:12px;">Loading your images...</p>
    </div>
  `

  try {
    const images = await listUserImages(user.id)

    if (images.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:32px; color:#9ca3af;">
          <i class="fas fa-images" style="font-size:2rem; opacity:0.3; margin-bottom:12px; display:block;"></i>
          <p>No uploaded images yet.</p>
          <p style="font-size:0.8rem;">Upload an image first, then it will appear here for reuse.</p>
        </div>
      `
      return
    }

    content.innerHTML = `
      <div class="media-grid">
        ${images.map(img => `
          <div class="media-item" data-url="${escapeHtml(img.url)}" title="${escapeHtml(img.name)}">
            <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.name)}" loading="lazy">
            <span class="media-item-label">${escapeHtml(img.category)}</span>
          </div>
        `).join('')}
      </div>
    `

    // Bind click on each image
    content.querySelectorAll('.media-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.dataset.url
        if (mediaLibraryCallback) mediaLibraryCallback(url)
        closeMediaLibrary()
      })
    })
  } catch (error) {
    console.error('Failed to load media library:', error)
    content.innerHTML = `
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${escapeHtml(error.message)}</p>
      </div>
    `
  }
}

function closeMediaLibrary() {
  const modal = document.getElementById('media-library-modal')
  if (modal) modal.style.display = 'none'
  mediaLibraryCallback = null
}

// ── Drag and Drop Reorder ──
let draggedIndex = null

function initDragAndDrop() {
  const container = document.getElementById('links-list')
  if (!container) return

  container.querySelectorAll('.link-item').forEach(item => {
    item.setAttribute('draggable', 'true')

    item.addEventListener('dragstart', (e) => {
      draggedIndex = parseInt(item.dataset.index)
      item.classList.add('dragging')
      e.dataTransfer.effectAllowed = 'move'
    })

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging')
      container.querySelectorAll('.link-item').forEach(i => i.classList.remove('drag-over'))
      draggedIndex = null
    })

    item.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      container.querySelectorAll('.link-item').forEach(i => i.classList.remove('drag-over'))
      item.classList.add('drag-over')
    })

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over')
    })

    item.addEventListener('drop', async (e) => {
      e.preventDefault()
      const targetIndex = parseInt(item.dataset.index)
      if (draggedIndex === null || draggedIndex === targetIndex) return

      const [moved] = links.splice(draggedIndex, 1)
      links.splice(targetIndex, 0, moved)

      links.forEach((link, i) => {
        link.order_index = (i + 1) * 100
      })

      renderLinksList()
      renderPreview()

      try {
        await Promise.all(links.map(link =>
          supabase
            .from('link_items')
            .update({ order_index: link.order_index })
            .eq('id', link.id)
        ))
      } catch (error) {
        console.error('Failed to save order:', error)
      }
    })
  })
}

function getThemeFromForm() {
  const bgType = document.querySelector('input[name="bg-type"]:checked')?.value || 'solid'
  const borderType = document.querySelector('input[name="border-type"]:checked')?.value || 'solid'
  const borderStyleVal = document.querySelector('input[name="border-style"]:checked')?.value || 'fill'
  const borderEnabled = document.getElementById('theme-border-enabled')?.checked || false

  // Cache repeated DOM reads
  const textColor = document.getElementById('theme-presentation-text')?.value || '#1A2F5B'
  const btnBg = document.getElementById('theme-btn-bg')?.value || '#1A2F5B'
  const borderGradientVal = document.getElementById('theme-border-gradient')?.value || ''

  return {
    backgroundType: bgType,
    backgroundColor: document.getElementById('theme-bg-color')?.value || '#ffffff',
    gradientText: document.getElementById('theme-gradient')?.value || '',
    backgroundImage: collection._pendingBgImage || (collection.theme || {}).backgroundImage || '',
    backgroundImageX: parseInt(document.getElementById('bg-pos-x')?.value) || 50,
    backgroundImageY: parseInt(document.getElementById('bg-pos-y')?.value) || 50,
    backgroundImageScale: parseInt(document.getElementById('bg-pos-scale')?.value) || 100,
    profileTextColor: textColor,
    presentationTextColor: textColor,
    textColor: textColor,             // v0.6.7 backward compat — must overwrite stale values
    presentationColor: textColor,     // v0.6.7 backward compat
    profileColor: textColor,          // v0.6.7 backward compat
    buttonBackgroundColor: btnBg,
    buttonBgColor: btnBg,             // v0.6.7 backward compat
    buttonTextColor: document.getElementById('theme-btn-text')?.value || '#000000',
    buttonStyle: document.getElementById('theme-button-style')?.value || 'soft',
    buttonBorderRadius: '8px',
    borderEnabled,
    gradientBorderEnabled: borderEnabled, // v0.6.7 backward compat
    borderType,
    borderStyle: borderStyleVal,
    borderColor: document.getElementById('theme-border-color')?.value || '#1A2F5B',
    borderGradient: borderGradientVal,
    borderGradientText: borderGradientVal, // v0.6.7 backward compat
  }
}

async function saveTheme() {
  try {
    const formTheme = getThemeFromForm()
    const newTheme = { ...collection.theme, ...formTheme }

    const { error } = await supabase
      .from('link_lists')
      .update({ theme: newTheme })
      .eq('id', collection.id)

    if (error) throw error

    collection.theme = newTheme
    renderPreview()

    showSaveSuccess('save-theme-btn')
  } catch (error) {
    console.error('Failed to save theme:', error)
    alert('Failed to save: ' + error.message)
  }
}

// ── Theme Management ──
async function loadSavedThemes() {
  const container = document.getElementById('saved-themes-list')
  if (!container) return

  try {
    const { data, error } = await supabase
      .from('user_themes')
      .select('*')
      .eq('user_id', user.id)
      .eq('theme_type', 'appearance')
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>'
      return
    }

    container.innerHTML = data.map(t => `
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${escapeHtml(t.name || t.theme_name || 'Unnamed')}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${t.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${t.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('')

    // Bind apply buttons
    container.querySelectorAll('.apply-theme-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const theme = data.find(t => t.id === btn.dataset.themeId)
        if (theme && theme.theme_data) {
          collection.theme = { ...collection.theme, ...theme.theme_data }
          renderPreview()
          renderAppearanceTab(document.getElementById('tab-content'))
        }
      })
    })

    // Bind delete buttons
    container.querySelectorAll('.delete-theme-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const theme = data.find(t => t.id === btn.dataset.themeId)
        if (!theme || !confirm(`Delete theme "${theme.name || theme.theme_name}"?`)) return
        try {
          const { error } = await supabase.from('user_themes').delete().eq('id', theme.id).eq('user_id', user.id)
          if (error) throw error
          loadSavedThemes()
        } catch (err) {
          console.error('Failed to delete theme:', err)
          alert('Failed to delete: ' + err.message)
        }
      })
    })
  } catch (error) {
    console.error('Failed to load themes:', error)
    container.innerHTML = '<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'
  }
}

async function saveNamedTheme() {
  const nameInput = document.getElementById('theme-name')
  const name = nameInput?.value.trim()
  if (!name) {
    alert('Please enter a theme name.')
    return
  }

  try {
    const themeData = getThemeFromForm()

    const { error } = await supabase
      .from('user_themes')
      .insert({
        user_id: user.id,
        name: name,
        theme_name: name,
        theme_type: 'appearance',
        theme_data: themeData,
      })

    if (error) throw error

    if (nameInput) nameInput.value = ''
    loadSavedThemes()

    showSaveSuccess('save-new-theme-btn')
  } catch (error) {
    console.error('Failed to save theme:', error)
    alert('Failed to save theme: ' + error.message)
  }
}

// ── Event Binding ──
function bindEvents() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      activeTab = tab.dataset.tab
      renderTabContent()
    })
  })

  // Sidebar buttons
  document.getElementById('add-link-btn')?.addEventListener('click', openNewLinkModal)
  document.getElementById('add-existing-btn')?.addEventListener('click', openExistingLinkModal)

  // New Link Modal
  document.getElementById('new-link-modal-close')?.addEventListener('click', closeNewLinkModal)
  document.getElementById('new-link-cancel')?.addEventListener('click', closeNewLinkModal)
  document.getElementById('new-link-save')?.addEventListener('click', saveNewLink)
  document.getElementById('new-link-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'new-link-modal') closeNewLinkModal()
  })

  // New Link modal image upload
  document.getElementById('new-link-upload-btn')?.addEventListener('click', () => {
    document.getElementById('new-link-image-file')?.click()
  })
  document.getElementById('new-link-image-file')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // No size limit — image is compressed before upload
    const btn = document.getElementById('new-link-upload-btn')
    const originalHtml = btn?.innerHTML
    try {
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>' }
      const publicUrl = await compressAndUpload(file, 'links', user.id, { maxWidth: 800, maxHeight: 800 })
      document.getElementById('new-link-image').value = publicUrl
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = originalHtml }
    }
  })
  document.getElementById('new-link-browse-btn')?.addEventListener('click', () => {
    openMediaLibrary((url) => {
      document.getElementById('new-link-image').value = url
    })
  })

  // Existing Link Modal
  document.getElementById('existing-link-modal-close')?.addEventListener('click', closeExistingLinkModal)
  document.getElementById('existing-link-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'existing-link-modal') closeExistingLinkModal()
  })
  document.getElementById('existing-link-search')?.addEventListener('input', (e) => {
    renderExistingLinks(e.target.value)
  })

  // Media Library Modal
  document.getElementById('media-library-close')?.addEventListener('click', closeMediaLibrary)
  document.getElementById('media-library-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'media-library-modal') closeMediaLibrary()
  })

  // Close any modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNewLinkModal()
      closeExistingLinkModal()
      closeMediaLibrary()
    }
  })
}

// ── Helpers ──
function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function truncateUrl(url) {
  try {
    const u = new URL(url)
    const path = u.pathname.length > 30 ? u.pathname.substring(0, 30) + '...' : u.pathname
    return u.hostname + path
  } catch {
    return url.length > 50 ? url.substring(0, 50) + '...' : url
  }
}

// ── Start ──
init()
