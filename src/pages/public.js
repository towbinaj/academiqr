/**
 * AcademiQR v1.0 — Public Collection Page
 * Renders a themed collection page for visitors (no auth required)
 * URL format: public.html?user=UUID&collection=UUID
 */
import { supabase } from '../shared/supabase.js'
import { resolveLibraryDefaults, getDisplayTitle, getDisplayImageUrl, getDisplayImagePosition, getDisplayImageScale } from '../shared/link-utils.js'

const root = document.getElementById('public-root')

// ── Helpers ──
function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function setMetaTags(collection, profile) {
  const pd = collection.presentation_data || {}
  const title = pd.title || 'AcademiQR Collection'
  const displayName = profile?.display_name || ''
  const conference = pd.conference || ''

  // Build description
  const parts = []
  if (displayName) parts.push(displayName)
  if (conference) parts.push(conference)
  const description = parts.length > 0
    ? `${title} — ${parts.join(' • ')}`
    : title

  // Profile photo for og:image
  const ogImage = profile?.profile_photo || 'https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png'

  // Page title
  document.title = `${title} | AcademiQR`

  // Set or create meta tags
  const tags = {
    'og:title': title,
    'og:description': description,
    'og:image': ogImage,
    'og:type': 'website',
    'og:url': window.location.href,
    'twitter:card': 'summary',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': ogImage,
  }

  for (const [property, content] of Object.entries(tags)) {
    const attr = property.startsWith('twitter:') ? 'name' : 'property'
    let el = document.querySelector(`meta[${attr}="${property}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  // Also set standard description meta
  let descEl = document.querySelector('meta[name="description"]')
  if (!descEl) {
    descEl = document.createElement('meta')
    descEl.setAttribute('name', 'description')
    document.head.appendChild(descEl)
  }
  descEl.setAttribute('content', description)
}

function imageTransformCSS(x = 50, y = 50, scale = 100) {
  return `translate(${(x - 50) * 1.5}%, ${(y - 50) * 1.5}%) scale(${scale / 100})`
}

// ── Theme Normalization (matches editor.js) ──
function normalizeTheme(raw) {
  const defaults = {
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
    borderEnabled: true,
    borderType: 'gradient',
    borderStyle: 'thin',
    borderColor: '#1A2F5B',
    borderGradient: 'linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)',
  }

  if (!raw) return { ...defaults }

  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw) } catch { return { ...defaults } }
  }

  const borderOn = raw.borderEnabled !== undefined ? !!raw.borderEnabled : raw.gradientBorderEnabled !== undefined ? !!raw.gradientBorderEnabled : true

  return {
    backgroundType: raw.backgroundType || 'solid',
    backgroundColor: raw.backgroundColor || '#ffffff',
    gradientText: raw.gradientText || '',
    backgroundImage: raw.backgroundImage || '',
    backgroundImageX: raw.backgroundImageX ?? raw.imagePositionX ?? 50,
    backgroundImageY: raw.backgroundImageY ?? raw.imagePositionY ?? 50,
    backgroundImageScale: raw.backgroundImageScale ?? raw.imageScale ?? 100,
    profileTextColor: [raw.textColor, raw.presentationTextColor, raw.profileTextColor, raw.presentationColor, raw.profileColor].find(c => typeof c === 'string' && c.length > 0) || '#1A2F5B',
    presentationTextColor: [raw.textColor, raw.presentationTextColor, raw.profileTextColor, raw.presentationColor, raw.profileColor].find(c => typeof c === 'string' && c.length > 0) || '#1A2F5B',
    buttonTextColor: raw.buttonTextColor || '#000000',
    buttonBackgroundColor: raw.buttonBackgroundColor || raw.buttonBgColor || '#1A2F5B',
    buttonStyle: raw.buttonStyle || 'soft',
    buttonBorderRadius: raw.buttonBorderRadius || raw.borderRadius || '8px',
    borderEnabled: borderOn,
    borderType: raw.borderType || 'solid',
    borderStyle: (raw.borderStyle === 'fill' || raw.borderStyle === 'thin') ? raw.borderStyle : 'fill',
    borderColor: raw.borderColor || '#1A2F5B',
    borderGradient: raw.borderGradient || raw.borderGradientText || '',
  }
}

// ── Error / Loading States ──
function showError(title, message) {
  root.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
    </div>
  `
}

// ── Data Fetching ──
async function loadCollection(collectionId) {
  const { data, error } = await supabase
    .from('link_lists')
    .select('id, owner_id, slug, visibility, passkey_hash, theme, presentation_data, qr_code_data')
    .eq('id', collectionId)
    .single()

  if (error) throw error
  return data
}

async function loadLinks(collectionId) {
  const { data, error } = await supabase
    .from('link_items')
    .select('id, url, title, image_url, image_position, image_scale, order_index, is_active, source_link_id, use_library_defaults, custom_overrides')
    .eq('list_id', collectionId)
    .order('order_index', { ascending: true })

  if (error) throw error
  const activeLinks = (data || []).filter(l => l.is_active !== false)

  // Resolve library defaults for linked links
  await resolveLibraryDefaults(activeLinks)

  return activeLinks
}

async function loadProfile(ownerId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate')
    .eq('id', ownerId)
    .single()

  if (error) throw error
  return data || {}
}

// ── Analytics ──
const sessionId = crypto.randomUUID()

async function trackPageView(collection) {
  try {
    const ua = navigator.userAgent
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    await supabase.from('page_views').insert({
      list_id: collection.id,
      owner_id: collection.owner_id,
      user_agent: ua.substring(0, 500),
      device_type: deviceType,
      referrer: document.referrer || null,
      session_id: sessionId,
    })
  } catch {
    // Fire-and-forget — don't block rendering
  }
}

function trackLinkClick(collection, linkId) {
  supabase.from('link_clicks').insert({
    link_id: linkId,
    list_id: collection.id,
    owner_id: collection.owner_id,
    user_agent: navigator.userAgent.substring(0, 500),
    session_id: sessionId,
  }).then(() => {}).catch(() => {})
}

function trackSocialClick(collection, platform) {
  supabase.from('link_clicks').insert({
    list_id: collection.id,
    owner_id: collection.owner_id,
    user_agent: navigator.userAgent.substring(0, 500),
    social_platform: platform,
    session_id: sessionId,
  }).then(() => {}).catch(() => {})
}

// ── Build Button Inline Style ──
function btnInlineStyle(theme) {
  const { buttonStyle, buttonBackgroundColor: buttonBg, buttonTextColor: buttonText } = theme

  let style = `color: ${buttonText}; border-radius: 8px; font-size: 1rem;`

  if (buttonStyle === 'solid') {
    style += `background: ${buttonBg}; border-color: ${buttonBg};`
  } else if (buttonStyle === 'outline') {
    style += `background: transparent; border: 2px solid ${buttonText}; color: ${buttonText};`
  } else {
    // soft (glass)
    style += `color: ${buttonText};`
  }

  return style
}

// ── Render Page ──
function renderPage(collection, links, profile) {
  const nt = normalizeTheme(collection.theme)
  const pd = collection.presentation_data || {}
  const p = profile || {}

  // Set page title
  document.title = pd.title
    ? `${pd.title} — AcademiQR`
    : 'AcademiQR'

  // Background style
  let bgStyle = ''
  if (nt.backgroundType === 'gradient' && nt.gradientText) {
    bgStyle = `background: ${nt.gradientText};`
  } else if (nt.backgroundType === 'image' && nt.backgroundImage) {
    bgStyle = `background: url('${nt.backgroundImage}') ${nt.backgroundImageX}% ${nt.backgroundImageY}% / ${nt.backgroundImageScale}% no-repeat;`
  } else {
    bgStyle = `background: ${nt.backgroundColor};`
  }

  // Border frame style
  let frameStyle = 'background: #1e293b;'
  if (nt.borderEnabled) {
    if (nt.borderType === 'gradient' && nt.borderGradient) {
      frameStyle = `background: ${nt.borderGradient};`
    } else {
      if (nt.borderStyle === 'thin') {
        frameStyle = `background: #1e293b; box-shadow: inset 0 0 0 8px ${nt.borderColor};`
      } else {
        frameStyle = `background: ${nt.borderColor};`
      }
    }
  }

  // Profile photo
  const photoSrc = p.profile_photo || ''
  let photoPosition = { scale: 100, x: 50, y: 50 }
  if (p.profile_photo_position) {
    try {
      photoPosition = typeof p.profile_photo_position === 'string'
        ? JSON.parse(p.profile_photo_position)
        : p.profile_photo_position
    } catch { /* defaults */ }
  }
  const scaleVal = (photoPosition.scale || 100) / 100
  const panX = ((photoPosition.x || 50) - 50) * -1
  const panY = ((photoPosition.y || 50) - 50) * -1

  // Social links
  const allSocials = [
    { key: 'social_email', icon: 'fa-envelope', prefix: 'mailto:', fab: false },
    { key: 'social_website', icon: 'fa-globe', prefix: '', fab: false },
    { key: 'social_instagram', icon: 'fa-instagram', prefix: '', fab: true },
    { key: 'social_facebook', icon: 'fa-facebook', prefix: '', fab: true },
    { key: 'social_twitter', icon: 'fa-x-twitter', prefix: '', fab: true },
    { key: 'social_linkedin', icon: 'fa-linkedin', prefix: '', fab: true },
    { key: 'social_youtube', icon: 'fa-youtube', prefix: '', fab: true },
    { key: 'social_tiktok', icon: 'fa-tiktok', prefix: '', fab: true },
    { key: 'social_snapchat', icon: 'fa-snapchat', prefix: '', fab: true },
    { key: 'social_google_scholar', icon: 'fa-graduation-cap', prefix: '', fab: false },
    { key: 'social_orcid', icon: 'fa-orcid', prefix: '', fab: true },
    { key: 'social_researchgate', icon: 'fa-researchgate', prefix: '', fab: true },
  ]

  // Apply user's custom order if saved
  const savedOrder = p.social_order
  let socials
  if (savedOrder && Array.isArray(savedOrder)) {
    const ordered = []
    for (const key of savedOrder) {
      const s = allSocials.find(s => s.key === `social_${key}`)
      if (s) ordered.push(s)
    }
    // Append any not in saved order
    for (const s of allSocials) {
      if (!ordered.includes(s)) ordered.push(s)
    }
    socials = ordered.filter(s => p[s.key]?.trim())
  } else {
    socials = allSocials.filter(s => p[s.key]?.trim())
  }

  // Presentation data
  const title = pd.title || ''
  const showTitle = pd.displayTitle !== false
  const showConference = pd.displayConference !== false
  const conference = pd.conference || ''
  const location = pd.location || ''
  const date = pd.date ? formatDate(pd.date) : ''
  const hasPresentation = (showTitle && title) || (showConference && conference) || location || date

  const profileTextColor = nt.profileTextColor
  const presentationTextColor = nt.presentationTextColor

  root.innerHTML = `
    <div class="public-wrapper">
      <div class="public-frame" style="${frameStyle}">
        <div class="public-screen" style="${bgStyle}">

          <!-- Header -->
          <div class="public-header">
            <div class="public-profile">
              ${photoSrc ? `
                <div class="public-avatar">
                  <img src="${escapeHtml(photoSrc)}" alt="Profile"
                       style="transform: translate(${panX}%, ${panY}%) scale(${scaleVal}); transform-origin: center center;"
                       onerror="this.parentElement.style.display='none'">
                </div>
              ` : ''}
              <div class="public-name-section">
                ${p.display_name ? `<h1 class="public-display-name" style="color: ${profileTextColor};">${escapeHtml(p.display_name)}</h1>` : ''}
                ${socials.length > 0 ? `
                  <div class="public-socials">
                    ${socials.map(s => {
                      const href = s.prefix + (p[s.key] || '')
                      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"
                                 class="public-social-icon ${s.key}" title="${s.key.replace('social_', '')}">
                                <i class="${s.fab ? 'fab' : 'fas'} ${s.icon}"></i>
                              </a>`
                    }).join('')}
                  </div>
                ` : ''}
              </div>
            </div>

            ${hasPresentation ? `
              <div class="public-presentation" style="color: ${presentationTextColor};">
                ${showTitle && title ? `<div class="public-info-field"><span class="public-info-value">${escapeHtml(title)}</span></div>` : ''}
                ${showConference && conference ? `<div class="public-info-field"><span class="public-info-value">${escapeHtml(conference)}</span></div>` : ''}
                ${location ? `<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${escapeHtml(location)}</span></div>` : ''}
                ${date ? `<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${escapeHtml(date)}</span></div>` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Links -->
          <div class="public-links">
            ${links.length === 0 ? `
              <p style="text-align:center; color:${presentationTextColor}; opacity:0.6; padding:24px;">No links available</p>
            ` : links.map(link => {
              const pos = getDisplayImagePosition(link)
              const sc = getDisplayImageScale(link)
              const imgTransform = imageTransformCSS(pos.x, pos.y, sc)
              const linkImgUrl = getDisplayImageUrl(link)
              const linkTitle = getDisplayTitle(link) || 'Untitled'

              return `
                <a href="${escapeHtml(link.url || '#')}" target="_blank" rel="noopener noreferrer"
                   class="public-link-btn ${nt.buttonStyle}" style="${btnInlineStyle(nt)}" data-link-id="${link.id}">
                  ${linkImgUrl ? `
                    <div class="public-link-image-wrapper">
                      <div class="public-link-image">
                        <img src="${escapeHtml(linkImgUrl)}" alt=""
                             style="transform: ${imgTransform};"
                             onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                      </div>
                    </div>
                  ` : ''}
                  <div class="public-link-text">${escapeHtml(linkTitle)}</div>
                </a>
              `
            }).join('')}
          </div>

          <!-- Footer -->
          <div class="public-footer" style="color: ${profileTextColor};">
            <p class="public-footer-text">Powered by <a href="https://academiqr.com" style="color: ${profileTextColor};">AcademiQR.com</a></p>
          </div>
        </div>
      </div>
    </div>
  `

  // ── Track link clicks ──
  root.querySelectorAll('.public-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const linkId = btn.dataset.linkId
      if (linkId) trackLinkClick(collection, linkId)
    })
  })

  // ── Track social clicks ──
  root.querySelectorAll('.public-social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      // Extract platform from class (e.g. "social_youtube" → "youtube")
      const classes = icon.className.split(' ')
      const platformClass = classes.find(c => c.startsWith('social_'))
      const platform = platformClass ? platformClass.replace('social_', '') : 'unknown'
      trackSocialClick(collection, platform)
    })
  })
}

// ── Passkey Gate ──
function showPasskeyPrompt(collection, onSuccess) {
  root.innerHTML = `
    <div class="passkey-modal">
      <i class="fas fa-lock" style="font-size:2rem; color:#1A2F5B; margin-bottom:12px;"></i>
      <h2>This collection is protected</h2>
      <p>Enter the passkey to view this content.</p>
      <input type="password" id="passkey-input" placeholder="Enter passkey" autofocus>
      <button id="passkey-submit">Submit</button>
      <p id="passkey-error" style="color:#ef4444; font-size:0.75rem; margin-top:8px; display:none;">Incorrect passkey. Try again.</p>
    </div>
  `

  const submit = () => {
    const val = document.getElementById('passkey-input')?.value || ''
    // Simple comparison — passkey is a shared conference access code, not a password
    if (val === collection.passkey_hash) {
      onSuccess()
    } else {
      document.getElementById('passkey-error').style.display = 'block'
    }
  }

  document.getElementById('passkey-submit')?.addEventListener('click', submit)
  document.getElementById('passkey-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submit()
  })
}

// ── Main Init ──
// ── Resolve collection from URL ──
// Supports both formats:
//   /public.html?user=abc&collection=uuid  (legacy)
//   /u/username/collection-slug            (short URL)
async function resolveFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const collectionId = params.get('collection')

  // Legacy query param format
  if (collectionId) return collectionId

  // Path-based short URL: /u/username/slug
  const path = window.location.pathname
  const match = path.match(/^\/u\/([^/]+)\/([^/]+)\/?$/)
  if (match) {
    const [, username, slug] = match
    // Look up user by username
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (!profileData) return null

    // Look up collection by slug + owner
    const { data: collData } = await supabase
      .from('link_lists')
      .select('id')
      .eq('owner_id', profileData.id)
      .eq('slug', slug)
      .single()

    return collData?.id || null
  }

  return null
}

async function init() {
  const collectionId = await resolveFromUrl()

  if (!collectionId) {
    showError('Missing Collection', 'No collection ID provided in the URL.')
    return
  }

  try {
    // Load collection first
    const collection = await loadCollection(collectionId)

    if (!collection) {
      showError('Not Found', 'This collection does not exist or has been removed.')
      return
    }

    // Check visibility
    if (collection.visibility === 'private') {
      showError('Private Collection', 'This collection is private and cannot be viewed.')
      return
    }

    // Load links and profile in parallel
    const [links, profile] = await Promise.all([
      loadLinks(collectionId),
      loadProfile(collection.owner_id)
    ])

    // Set page title and Open Graph meta tags
    setMetaTags(collection, profile)

    // Check passkey
    if (collection.passkey_hash) {
      showPasskeyPrompt(collection, () => {
        renderPage(collection, links, profile)
        trackPageView(collection)
      })
    } else {
      renderPage(collection, links, profile)
      trackPageView(collection)
    }
  } catch (error) {
    console.error('[Public] Failed to load:', error)
    showError('Something went wrong', 'Unable to load this collection. Please try again later.')
  }
}

init()
