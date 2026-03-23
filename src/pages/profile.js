/**
 * AcademiQR v1.0 — Profile Settings Page
 * Edit display name, profile photo, social links.
 * Matches v0.6.7 profile modal functionality as a dedicated page.
 */
import { requireAuth, signOut } from '../shared/auth.js'
import { supabase } from '../shared/supabase.js'
import { navigate } from '../shared/router.js'
import { compressAndUpload, listUserImages, deleteUserImages } from '../shared/image-utils.js'
import { initThemeToggle, toggleTheme, getCurrentTheme } from '../shared/theme-toggle.js'
import { showToast } from '../shared/toast.js'
import { createAutoSaver } from '../shared/auto-save.js'
import Sortable from 'sortablejs'
// XLSX is lazy-loaded only when user exports (297KB library)
let XLSX = null
async function loadXLSX() {
  if (!XLSX) XLSX = await import('xlsx')
  return XLSX
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

let user = null
let profile = null
let photoState = { src: null, scale: 100, x: 50, y: 50 }
let editBackup = null // backup before editing position
let profileSaver = null

// ── Init ──
async function init() {
  user = await requireAuth()
  if (!user) return

  renderNav()
  showBackBreadcrumb()
  await loadProfile()
  populateForm()
  bindEvents()
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
  } catch { /* ignore */ }
}

// ── Nav ──
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
        <a href="/src/pages/dashboard.html" class="nav-link"><i class="fas fa-th-large"></i> My Collections</a>
        <a href="/src/pages/library.html" class="nav-link"><i class="fas fa-link"></i> Link Library</a>
        <a href="/src/pages/profile.html" class="nav-link active"><i class="fas fa-user-circle"></i> Profile</a>
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

// ── Data Loading ──
async function loadProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, username, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate')
    .eq('id', user.id)
    .single()

  if (!error && data) {
    profile = data
    // Parse photo position
    if (data.profile_photo) {
      photoState.src = data.profile_photo
      if (data.profile_photo_position) {
        try {
          const pos = typeof data.profile_photo_position === 'string'
            ? JSON.parse(data.profile_photo_position)
            : data.profile_photo_position
          photoState.scale = pos.scale || 100
          photoState.x = pos.x ?? 50
          photoState.y = pos.y ?? 50
        } catch { /* defaults */ }
      }
    }
  } else {
    profile = {}
  }
}

// ── Populate Form ──
function populateForm() {
  const p = profile || {}

  // Display name
  const nameEl = document.getElementById('display-name')
  if (nameEl) nameEl.value = p.display_name || ''

  // Username (permanent once set)
  const usernameEl = document.getElementById('username')
  if (usernameEl) {
    usernameEl.value = p.username || ''
    if (p.username) {
      usernameEl.disabled = true
      const lockedMsg = document.getElementById('username-locked-msg')
      if (lockedMsg) lockedMsg.style.display = 'block'
    }
  }
  const previewEl = document.getElementById('username-preview')
  if (previewEl) previewEl.textContent = p.username || 'your-username'

  // Social links
  const socials = ['email', 'website', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'google_scholar', 'orcid', 'researchgate']
  for (const s of socials) {
    const el = document.getElementById(`social-${s}`)
    if (el) el.value = p[`social_${s}`] || ''
  }

  // Restore social link order
  const grid = document.getElementById('social-links-grid')
  if (grid && p.social_order && Array.isArray(p.social_order)) {
    const items = [...grid.querySelectorAll('.social-input-group[data-social]')]
    const ordered = []
    for (const key of p.social_order) {
      const item = items.find(el => el.dataset.social === key)
      if (item) ordered.push(item)
    }
    // Append any remaining items not in the saved order
    for (const item of items) {
      if (!ordered.includes(item)) ordered.push(item)
    }
    for (const item of ordered) grid.appendChild(item)
  }

  // Photo
  updatePhotoPreview()
}

// ── Photo Preview ──
function updatePhotoPreview() {
  const img = document.getElementById('photo-img')
  const placeholder = document.getElementById('photo-placeholder')
  const editBtn = document.getElementById('photo-edit-btn')
  const removeBtn = document.getElementById('photo-remove-btn')

  if (photoState.src) {
    img.src = photoState.src
    img.style.display = 'block'
    img.style.transform = photoTransformCSS()
    placeholder.style.display = 'none'
    editBtn.style.display = ''
    removeBtn.style.display = ''
  } else {
    img.style.display = 'none'
    placeholder.style.display = 'flex'
    editBtn.style.display = 'none'
    removeBtn.style.display = 'none'
  }
}

function photoTransformCSS() {
  const s = photoState.scale / 100
  const px = (photoState.x - 50) * -1
  const py = (photoState.y - 50) * -1
  return `translate(${px}%, ${py}%) scale(${s})`
}

// ── Photo Upload ──
async function handlePhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    showToast('Please upload a JPG, PNG, GIF, or WebP image.', 'warning')
    e.target.value = ''
    return
  }
  // No size limit — image is compressed before upload

  const uploadBtn = document.getElementById('photo-upload-btn')
  const originalHtml = uploadBtn?.innerHTML
  try {
    if (uploadBtn) {
      uploadBtn.disabled = true
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'
    }

    const publicUrl = await compressAndUpload(file, 'profiles', user.id, { maxWidth: 400, maxHeight: 400 })

    photoState.src = publicUrl
    photoState.scale = 100
    photoState.x = 50
    photoState.y = 50
    updatePhotoPreview()
  } catch (error) {
    console.error('Photo upload failed:', error)
    showToast('Photo upload failed: ' + error.message, 'error')
  } finally {
    if (uploadBtn) {
      uploadBtn.disabled = false
      uploadBtn.innerHTML = originalHtml
    }
  }
}

async function browseMediaForPhoto() {
  const btn = document.getElementById('photo-browse-btn')
  const originalHtml = btn?.innerHTML
  try {
    if (btn) {
      btn.disabled = true
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
    }

    const images = await listUserImages(user.id)

    if (images.length === 0) {
      showToast('No uploaded images found. Upload an image first.', 'info')
      return
    }

    // Show a simple picker overlay
    const overlay = document.createElement('div')
    overlay.className = 'media-picker-overlay'
    overlay.innerHTML = `
      <div class="media-picker">
        <div class="media-picker-header">
          <h3>Choose an Image</h3>
          <button class="modal-close media-picker-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="media-picker-grid">
          ${images.map(img => `
            <div class="media-picker-item" data-url="${img.url.replace(/"/g, '&quot;')}">
              <img src="${img.url.replace(/"/g, '&quot;')}" alt="${img.name}" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    `

    document.body.appendChild(overlay)

    // Close handler
    const close = () => overlay.remove()
    overlay.querySelector('.media-picker-close')?.addEventListener('click', close)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })

    // Select handler
    overlay.querySelectorAll('.media-picker-item').forEach(item => {
      item.addEventListener('click', () => {
        photoState.src = item.dataset.url
        photoState.scale = 100
        photoState.x = 50
        photoState.y = 50
        updatePhotoPreview()
        close()
      })
    })
  } catch (error) {
    console.error('Browse failed:', error)
    showToast('Failed to load images: ' + error.message, 'error')
  } finally {
    if (btn) {
      btn.disabled = false
      btn.innerHTML = originalHtml
    }
  }
}

function removePhoto() {
  photoState = { src: null, scale: 100, x: 50, y: 50 }
  const fileInput = document.getElementById('photo-upload')
  if (fileInput) fileInput.value = ''
  updatePhotoPreview()
  // Hide edit panel if open
  document.getElementById('photo-edit-panel').style.display = 'none'
}

// ── Photo Position Editing ──
function openEditPanel() {
  if (!photoState.src) return
  editBackup = { ...photoState }

  const panel = document.getElementById('photo-edit-panel')
  const editImg = document.getElementById('photo-edit-img')
  editImg.src = photoState.src

  document.getElementById('photo-zoom').value = photoState.scale
  document.getElementById('photo-pan-x').value = photoState.x
  document.getElementById('photo-pan-y').value = photoState.y
  updateEditLabels()
  applyEditTransform()
  panel.style.display = 'flex'
}

function applyEditTransform() {
  const img = document.getElementById('photo-edit-img')
  if (!img) return
  const s = photoState.scale / 100
  const px = (photoState.x - 50) * -1
  const py = (photoState.y - 50) * -1
  img.style.transform = `translate(${px}%, ${py}%) scale(${s})`
}

function updateEditLabels() {
  document.getElementById('zoom-value').textContent = photoState.scale + '%'
  document.getElementById('pan-x-value').textContent = photoState.x
  document.getElementById('pan-y-value').textContent = photoState.y
}

function saveEditPosition() {
  editBackup = null
  document.getElementById('photo-edit-panel').style.display = 'none'
  updatePhotoPreview()
}

function cancelEditPosition() {
  if (editBackup) {
    photoState = { ...editBackup }
    editBackup = null
  }
  document.getElementById('photo-edit-panel').style.display = 'none'
  updatePhotoPreview()
}

// ── URL Validation Helpers ──
function normalizeUrl(value) {
  if (!value || !value.trim()) return ''
  let url = value.trim()
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return ''
    return url
  } catch {
    return ''
  }
}

function isValidEmail(value) {
  if (!value || !value.trim()) return true // empty is valid (optional field)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidUrl(value) {
  if (!value || !value.trim()) return true // empty is valid (optional field)
  let url = value.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function validateSocialInput(input, type) {
  const value = input.value.trim()
  if (!value) {
    input.classList.remove('input-invalid')
    input.removeAttribute('title')
    return true
  }
  const valid = type === 'email' ? isValidEmail(value) : isValidUrl(value)
  if (valid) {
    input.classList.remove('input-invalid')
    input.removeAttribute('title')
  } else {
    input.classList.add('input-invalid')
    input.title = type === 'email' ? 'Please enter a valid email address' : 'Please enter a valid URL'
  }
  return valid
}

// ── Save Profile Data (shared by autosave and button) ──
async function saveProfileData() {
  const displayName = document.getElementById('display-name')?.value?.trim() || ''
  const username = document.getElementById('username')?.value?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || null
  const finalUsername = profile?.username ? profile.username : username

  const socialData = {}
  const socials = ['email', 'website', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'google_scholar', 'orcid', 'researchgate']
  for (const s of socials) {
    const el = document.getElementById(`social-${s}`)
    const val = el?.value?.trim() || ''
    if (s === 'email') {
      // Only save if valid or empty
      socialData[`social_${s}`] = isValidEmail(val) ? val : (profile?.[`social_${s}`] || '')
    } else {
      // Only save if valid or empty
      socialData[`social_${s}`] = isValidUrl(val) ? normalizeUrl(val) : (profile?.[`social_${s}`] || '')
    }
  }

  // Get current social link order from DOM
  const grid = document.getElementById('social-links-grid')
  const socialOrder = grid
    ? [...grid.querySelectorAll('.social-input-group[data-social]')].map(el => el.dataset.social)
    : null

  const updates = {
    display_name: displayName,
    username: finalUsername,
    profile_photo: photoState.src || null,
    profile_photo_position: JSON.stringify({
      scale: photoState.scale,
      x: photoState.x,
      y: photoState.y,
    }),
    ...socialData,
    social_order: socialOrder,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...updates })

  if (error) {
    console.error('[Profile] Save failed:', error)
    return false
  }
  return true
}

// ── Save Profile (explicit button click) ──
async function saveProfile() {
  const btn = document.getElementById('save-profile-btn')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

  // Cancel any pending autosave
  if (profileSaver) profileSaver.cancel()

  const ok = await saveProfileData()

  if (!ok) {
    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed'
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-save"></i> Save Profile'
      btn.disabled = false
    }, 2000)
  } else {
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!'
    btn.classList.add('btn-success')
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-save"></i> Save Profile'
      btn.classList.remove('btn-success')
      btn.disabled = false
    }, 1500)
  }
}

// ── Delete Account ──
// ── GDPR Data Export ──
async function fetchAllUserData() {
  const [profileRes, collectionsRes, linksRes, themesRes, viewsRes, clicksRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('link_lists').select('*').eq('owner_id', user.id),
    supabase.from('link_items').select('*, link_lists!inner(owner_id)').eq('link_lists.owner_id', user.id),
    supabase.from('user_themes').select('*').eq('user_id', user.id),
    supabase.from('page_views').select('*').eq('owner_id', user.id),
    supabase.from('link_clicks').select('*').eq('owner_id', user.id),
  ])

  return {
    profile: profileRes.data || null,
    collections: collectionsRes.data || [],
    links: (linksRes.data || []).map(l => { const { link_lists, ...rest } = l; return rest }),
    themes: themesRes.data || [],
    page_views: viewsRes.data || [],
    link_clicks: clicksRes.data || [],
  }
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function withExportSpinner(btn, fn) {
  const originalHtml = btn?.innerHTML
  try {
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...' }
    await fn()
  } catch (err) {
    console.error('[Profile] Export failed:', err)
    showToast('Export failed: ' + err.message, 'error')
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = originalHtml }
  }
}

async function exportAsJson() {
  await withExportSpinner(document.getElementById('export-json-btn'), async () => {
    const data = await fetchAllUserData()
    const exportObj = {
      exported_at: new Date().toISOString(),
      user_id: user.id,
      email: user.email,
      ...data,
    }
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
    downloadFile(blob, `academiqr-data-${new Date().toISOString().split('T')[0]}.json`)
  })
}

async function exportAsExcel() {
  await withExportSpinner(document.getElementById('export-excel-btn'), async () => {
    const data = await fetchAllUserData()
    const xl = await loadXLSX()
    const wb = xl.utils.book_new()

    // Profile sheet
    if (data.profile) {
      const profileRows = Object.entries(data.profile).map(([key, val]) => ({
        Field: key,
        Value: typeof val === 'object' ? JSON.stringify(val) : String(val ?? ''),
      }))
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(profileRows), 'Profile')
    }

    // Collections sheet
    if (data.collections.length > 0) {
      const collRows = data.collections.map(c => ({
        ID: c.id,
        Title: c.presentation_data?.title || '',
        Conference: c.presentation_data?.conference || '',
        Location: c.presentation_data?.location || '',
        Date: c.presentation_data?.date || '',
        Visibility: c.visibility || '',
        Slug: c.slug || '',
        Created: c.created_at || '',
      }))
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(collRows), 'Collections')
    }

    // Links sheet
    if (data.links.length > 0) {
      const linkRows = data.links.map(l => ({
        ID: l.id,
        Title: l.title || '',
        URL: l.url || '',
        'Image URL': l.image_url || '',
        Active: l.is_active !== false ? 'Yes' : 'No',
        'Collection ID': l.list_id || '',
        Created: l.created_at || '',
      }))
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(linkRows), 'Links')
    }

    // Page Views sheet
    if (data.page_views.length > 0) {
      const viewRows = data.page_views.map(v => ({
        'Collection ID': v.list_id || '',
        'Device': v.device_type || '',
        'Referrer': v.referrer || '',
        'Viewed At': v.viewed_at || v.created_at || '',
      }))
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(viewRows), 'Page Views')
    }

    // Link Clicks sheet
    if (data.link_clicks.length > 0) {
      const clickRows = data.link_clicks.map(c => ({
        'Link ID': c.link_id || '',
        'Social Platform': c.social_platform || '',
        'Collection ID': c.list_id || '',
        'Clicked At': c.clicked_at || c.created_at || '',
      }))
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(clickRows), 'Link Clicks')
    }

    const wbOut = xl.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadFile(blob, `academiqr-data-${new Date().toISOString().split('T')[0]}.xlsx`)
  })
}

async function exportAsCsv() {
  await withExportSpinner(document.getElementById('export-csv-btn'), async () => {
    const data = await fetchAllUserData()

    // Only export links as CSV (most useful single-sheet format)
    const xl = await loadXLSX()
    const linkRows = data.links.map(l => ({
      Title: l.title || '',
      URL: l.url || '',
      'Image URL': l.image_url || '',
      Active: l.is_active !== false ? 'Yes' : 'No',
      'Collection ID': l.list_id || '',
      Created: l.created_at || '',
    }))

    const wb = xl.utils.book_new()
    if (linkRows.length > 0) {
      xl.utils.book_append_sheet(wb, xl.utils.json_to_sheet(linkRows), 'Links')
    }

    const csvOut = xl.write(wb, { bookType: 'csv', type: 'string' })
    const blob = new Blob([csvOut], { type: 'text/csv' })
    downloadFile(blob, `academiqr-links-${new Date().toISOString().split('T')[0]}.csv`)
  })
}

async function deleteAccount() {
  const confirmed = confirm(
    'Are you sure you want to permanently delete your account?\n\n' +
    'This will delete ALL your data: collections, links, themes, analytics, uploaded images, and your login.\n\n' +
    'This action CANNOT be undone.'
  )
  if (!confirmed) return

  const doubleConfirm = confirm('This is your last chance. Delete everything?')
  if (!doubleConfirm) return

  const btn = document.getElementById('delete-account-btn')
  const originalHtml = btn?.innerHTML
  try {
    if (btn) {
      btn.disabled = true
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...'
    }

    // Get current session token for the Edge Function
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No active session. Please sign in again.')
    }

    // Call the server-side Edge Function which:
    // 1. Deletes all DB data (analytics, links, collections, themes, profile)
    // 2. Deletes all uploaded images from Storage
    // 3. Deletes the Auth user record (GDPR compliant)
    const { data, error } = await supabase.functions.invoke('delete-account', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (error) throw error
    if (data?.error) throw new Error(data.error)

    // Sign out locally (server already invalidated the user)
    await signOut()
    navigate('login')
  } catch (err) {
    console.error('[Profile] Account deletion failed:', err)
    showToast('Failed to delete account: ' + (err.message || 'Unknown error'), 'error')
    if (btn) {
      btn.disabled = false
      btn.innerHTML = originalHtml
    }
  }
}

// ── Events ──
function bindEvents() {
  // Photo upload
  document.getElementById('photo-upload-btn')?.addEventListener('click', () => {
    document.getElementById('photo-upload')?.click()
  })
  document.getElementById('photo-upload')?.addEventListener('change', handlePhotoUpload)
  document.getElementById('photo-remove-btn')?.addEventListener('click', removePhoto)

  // Browse media library for profile photo
  document.getElementById('photo-browse-btn')?.addEventListener('click', browseMediaForPhoto)

  // Username live check
  let usernameTimeout = null
  document.getElementById('username')?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    e.target.value = val
    const preview = document.getElementById('username-preview')
    if (preview) preview.textContent = val || 'your-username'

    const status = document.getElementById('username-status')
    if (!val || val.length < 3) {
      status.textContent = val ? 'Username must be at least 3 characters' : ''
      status.className = 'username-status'
      return
    }

    status.textContent = 'Checking...'
    status.className = 'username-status checking'

    clearTimeout(usernameTimeout)
    usernameTimeout = setTimeout(async () => {
      // Skip check if it's the user's current username
      if (val === profile?.username) {
        status.textContent = 'This is your current username'
        status.className = 'username-status available'
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', val)
        .limit(1)
      if (data && data.length > 0) {
        status.textContent = 'Username is taken'
        status.className = 'username-status taken'
      } else {
        status.textContent = 'Username is available!'
        status.className = 'username-status available'
      }
    }, 500)
  })

  // Photo edit
  document.getElementById('photo-edit-btn')?.addEventListener('click', openEditPanel)
  document.getElementById('photo-edit-save')?.addEventListener('click', saveEditPosition)
  document.getElementById('photo-edit-cancel')?.addEventListener('click', cancelEditPosition)

  // Edit sliders
  document.getElementById('photo-zoom')?.addEventListener('input', (e) => {
    photoState.scale = parseInt(e.target.value)
    updateEditLabels()
    applyEditTransform()
  })
  document.getElementById('photo-pan-x')?.addEventListener('input', (e) => {
    photoState.x = parseInt(e.target.value)
    updateEditLabels()
    applyEditTransform()
  })
  document.getElementById('photo-pan-y')?.addEventListener('input', (e) => {
    photoState.y = parseInt(e.target.value)
    updateEditLabels()
    applyEditTransform()
  })

  // Auto-save on form changes
  profileSaver = createAutoSaver(async () => {
    const result = await saveProfileData()
    return result
  }, { delay: 1500, statusSelector: '#profile-save-status' })

  const autoSaveFields = ['display-name', 'social-email', 'social-website', 'social-instagram', 'social-facebook', 'social-twitter', 'social-linkedin', 'social-youtube', 'social-tiktok', 'social-snapchat', 'social-google_scholar', 'social-orcid', 'social-researchgate']
  for (const id of autoSaveFields) {
    const el = document.getElementById(id)
    if (!el) continue
    el.addEventListener('input', () => {
      // Validate social inputs on each keystroke
      if (id.startsWith('social-')) {
        validateSocialInput(el, id === 'social-email' ? 'email' : 'url')
      }
      profileSaver.trigger()
    })
    // Also validate on blur for immediate feedback
    if (id.startsWith('social-')) {
      el.addEventListener('blur', () => {
        validateSocialInput(el, id === 'social-email' ? 'email' : 'url')
      })
    }
  }

  // Social links drag-and-drop reordering
  const socialGrid = document.getElementById('social-links-grid')
  if (socialGrid) {
    new Sortable(socialGrid, {
      handle: '.social-drag-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: () => profileSaver.trigger(),
    })
  }

  // Explicit save button (also flushes any pending autosave)
  document.getElementById('save-profile-btn')?.addEventListener('click', saveProfile)

  // Export data
  document.getElementById('export-json-btn')?.addEventListener('click', exportAsJson)
  document.getElementById('export-excel-btn')?.addEventListener('click', exportAsExcel)
  document.getElementById('export-csv-btn')?.addEventListener('click', exportAsCsv)

  // Delete account
  document.getElementById('delete-account-btn')?.addEventListener('click', deleteAccount)
}

init()
