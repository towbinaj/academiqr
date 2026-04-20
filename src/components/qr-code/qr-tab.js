/**
 * AcademiQR v1.0 — QR Code Tab Module
 * Generates, customizes, and downloads QR codes for collections.
 * Uses QRCode.js (CDN) for canvas-based QR generation.
 */
import { supabase } from '../../shared/supabase.js'
import { getPublicUrl } from '../../shared/router.js'
import { createAutoSaver, registerAutoSaver } from '../../shared/auto-save.js'
import { showToast } from '../../shared/toast.js'

const LOGO_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png'
const CONTAINER_SIZE = 250
const QR_PADDING = 16
const BORDER_WIDTH = 8

let currentQRCode = null
let currentQRLogo = null

// ── Helpers ──

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/** Draw a rounded rectangle path on ctx */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/** Read current QR form values */
function getQRSettings(container) {
  const el = (id) => container.querySelector(`#${id}`)
  return {
    color: el('qr-color')?.value || '#1A2F5B',
    bgColor: el('qr-bg-color')?.value || '#ffffff',
    borderEnabled: el('qr-border-enabled')?.checked || false,
    borderColor: el('qr-border-color')?.value || '#000000',
    borderStyle: el('qr-border-style')?.value || 'solid',
    borderRadius: parseInt(el('qr-border-radius')?.value || '16'),
    logo: currentQRLogo,
  }
}

/**
 * Build a composite canvas: border → padding → QR → logo
 * Returns a canvas element at CONTAINER_SIZE × CONTAINER_SIZE
 */
function buildCompositeCanvas(qrCanvas, settings) {
  const bw = settings.borderEnabled ? BORDER_WIDTH : 0
  const br = settings.borderEnabled ? settings.borderRadius : 16

  const composite = document.createElement('canvas')
  composite.width = CONTAINER_SIZE
  composite.height = CONTAINER_SIZE
  const ctx = composite.getContext('2d')

  // 1) Clear canvas fully transparent first (avoids white corner artifacts)
  ctx.clearRect(0, 0, CONTAINER_SIZE, CONTAINER_SIZE)

  // 2) Background fill for padding area with rounded corners
  ctx.fillStyle = settings.bgColor
  roundedRect(ctx, bw, bw, qrCanvas.width + QR_PADDING * 2, qrCanvas.height + QR_PADDING * 2, br)
  ctx.fill()

  // 2) Border stroke
  if (settings.borderEnabled) {
    ctx.strokeStyle = settings.borderColor
    ctx.lineWidth = BORDER_WIDTH

    if (settings.borderStyle === 'dashed') {
      ctx.setLineDash([BORDER_WIDTH * 2, BORDER_WIDTH])
    } else if (settings.borderStyle === 'dotted') {
      ctx.setLineDash([BORDER_WIDTH, BORDER_WIDTH])
    } else if (settings.borderStyle === 'double') {
      ctx.lineWidth = BORDER_WIDTH / 3
      const bx = BORDER_WIDTH / 2, by = BORDER_WIDTH / 2
      const bww = qrCanvas.width + QR_PADDING * 2 + BORDER_WIDTH
      const bhh = qrCanvas.height + QR_PADDING * 2 + BORDER_WIDTH
      ctx.strokeRect(bx, by, bww, bhh)
      ctx.strokeRect(bx + BORDER_WIDTH, by + BORDER_WIDTH, bww - BORDER_WIDTH * 2, bhh - BORDER_WIDTH * 2)
    }

    if (settings.borderStyle !== 'double') {
      const sx = BORDER_WIDTH / 2, sy = BORDER_WIDTH / 2
      const sw = qrCanvas.width + QR_PADDING * 2 + BORDER_WIDTH
      const sh = qrCanvas.height + QR_PADDING * 2 + BORDER_WIDTH
      if (br > 0) {
        roundedRect(ctx, sx, sy, sw, sh, br)
        ctx.stroke()
      } else {
        ctx.strokeRect(sx, sy, sw, sh)
      }
    }
    ctx.setLineDash([])
  }

  // 3) Clip to rounded rect then draw QR code (prevents white corner artifacts)
  const qrX = bw + QR_PADDING
  const qrY = bw + QR_PADDING
  ctx.save()
  roundedRect(ctx, bw, bw, qrCanvas.width + QR_PADDING * 2, qrCanvas.height + QR_PADDING * 2, br)
  ctx.clip()
  ctx.drawImage(qrCanvas, qrX, qrY)
  ctx.restore()

  return { canvas: composite, ctx, qrX, qrY, qrSize: qrCanvas.width }
}

/** Overlay logo on composite canvas (returns Promise) */
function applyLogo(ctx, logoSrc, qrX, qrY, qrSize) {
  return new Promise((resolve) => {
    if (!logoSrc) { resolve(); return }
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.onload = () => {
      const maxSize = qrSize * 0.20
      let lw = logo.width, lh = logo.height
      if (lw > maxSize || lh > maxSize) {
        const s = Math.min(maxSize / lw, maxSize / lh)
        lw *= s; lh *= s
      }
      const x = qrX + (qrSize - lw) / 2
      const y = qrY + (qrSize - lh) / 2
      // White circle behind logo
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(qrX + qrSize / 2, qrY + qrSize / 2, Math.max(lw, lh) / 2 + 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.drawImage(logo, x, y, lw, lh)
      resolve()
    }
    logo.onerror = () => resolve() // Skip logo on error
    logo.src = logoSrc
  })
}

// ── Core: Generate QR ──

async function generateQR(container, publicUrl) {
  if (typeof QRCode === 'undefined') {
    console.error('[QR] QRCode.js library not loaded')
    return
  }

  const settings = getQRSettings(container)
  const qrContainer = container.querySelector('#qr-code-container')
  if (!qrContainer) return

  // Clear previous
  currentQRCode = null
  qrContainer.innerHTML = ''
  qrContainer.style.cssText = 'background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;'

  // Calculate QR size: container - border - padding
  const bw = settings.borderEnabled ? BORDER_WIDTH : 0
  const qrSize = CONTAINER_SIZE - (bw * 2) - (QR_PADDING * 2)

  // Generate QR code into a hidden temp div
  const tempDiv = document.createElement('div')
  tempDiv.style.cssText = 'position:absolute; left:-9999px; top:-9999px;'
  document.body.appendChild(tempDiv)

  try {
    currentQRCode = new QRCode(tempDiv, {
      text: publicUrl,
      width: qrSize,
      height: qrSize,
      colorDark: settings.color,
      colorLight: settings.bgColor,
      correctLevel: QRCode.CorrectLevel.H
    })
  } catch (err) {
    console.error('[QR] Generation failed:', err)
    qrContainer.innerHTML = '<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>'
    document.body.removeChild(tempDiv)
    return
  }

  // Wait for canvas to render
  await new Promise(r => setTimeout(r, 100))

  const canvas = tempDiv.querySelector('canvas')
  if (!canvas) {
    document.body.removeChild(tempDiv)
    return
  }

  // Build composite canvas with border/padding/logo
  const { canvas: composite, ctx, qrX, qrY, qrSize: qs } = buildCompositeCanvas(canvas, settings)
  await applyLogo(ctx, currentQRLogo, qrX, qrY, qs)

  // Display composite as image (enables right-click copy)
  const img = document.createElement('img')
  img.src = composite.toDataURL('image/png')
  const displayRadius = settings.borderEnabled ? settings.borderRadius : 16
  img.style.cssText = `width:${CONTAINER_SIZE}px; height:${CONTAINER_SIZE}px; display:block; margin:0 auto; border-radius:${displayRadius}px; background:transparent;`
  img.alt = 'QR Code'
  img.title = 'Right-click to copy image'
  img.setAttribute('data-composite', 'true')
  qrContainer.innerHTML = ''
  qrContainer.appendChild(img)
  qrContainer._compositeCanvas = composite

  // Clean up temp div
  document.body.removeChild(tempDiv)

  // Show download buttons
  const actions = container.querySelector('#qr-actions')
  if (actions) actions.style.display = 'flex'
}

// ── Download ──

function downloadQR(container, format, slug) {
  const qrContainer = container.querySelector('#qr-code-container')
  if (!qrContainer || !currentQRCode) return

  const compositeImg = qrContainer.querySelector('img[data-composite="true"]')
  if (!compositeImg) return

  const filename = `${slug || 'qrcode'}-qrcode`

  if (format === 'png' || format === 'jpeg') {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')
      if (format === 'jpeg') {
        // JPEG needs opaque background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, c.width, c.height)
      }
      ctx.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = `${filename}.${format === 'jpeg' ? 'jpg' : 'png'}`
      link.href = c.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95)
      link.click()
    }
    img.src = compositeImg.src
  } else if (format === 'svg') {
    // SVG wrapping a raster PNG (QR codes are inherently raster from QRCode.js)
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const png = c.toDataURL('image/png')
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><image href="${png}" width="${c.width}" height="${c.height}"/></svg>`
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const link = document.createElement('a')
      link.download = `${filename}.svg`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    }
    img.src = compositeImg.src
  }
}

// ── Save QR Code Theme ──

async function saveQRSettings(collectionId, container) {
  const settings = getQRSettings(container)
  const qrData = {
    color: settings.color,
    bgColor: settings.bgColor,
    borderEnabled: settings.borderEnabled,
    borderColor: settings.borderColor,
    borderStyle: settings.borderStyle,
    borderRadius: String(settings.borderRadius),
    logo: currentQRLogo,
  }

  const { error } = await supabase
    .from('link_lists')
    .update({ qr_code_data: qrData, updated_at: new Date().toISOString() })
    .eq('id', collectionId)

  return !error
}

// ── QR Theme Management ──

async function loadSavedQRThemes(container, userId) {
  const listEl = container.querySelector('#saved-qr-themes-list')
  if (!listEl) return

  const { data, error } = await supabase
    .from('user_themes')
    .select('*')
    .eq('user_id', userId)
    .eq('theme_type', 'qr')
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    listEl.innerHTML = '<p class="qr-themes-empty">No saved QR themes yet</p>'
    return
  }

  listEl.innerHTML = data.map(record => {
    const name = escapeHtml(record.name)
    return `
      <div class="saved-theme-item" data-theme-id="${record.id}" data-theme-name="${name}">
        <div class="saved-theme-name">${name}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${record.id}" data-theme-name="${name}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `
  }).join('')
}

async function saveQRTheme(container, userId, publicUrl) {
  const nameInput = container.querySelector('#qr-theme-name')
  const themeName = nameInput?.value?.trim()
  if (!themeName) {
    showToast('Please enter a QR theme name', 'warning')
    return
  }

  const settings = getQRSettings(container)
  const themeData = {
    name: themeName,
    color: settings.color,
    bgColor: settings.bgColor,
    borderEnabled: settings.borderEnabled,
    borderColor: settings.borderColor,
    borderStyle: settings.borderStyle,
    borderRadius: String(settings.borderRadius),
    logo: currentQRLogo,
  }

  // Check if theme name exists
  const { data: existing } = await supabase
    .from('user_themes')
    .select('id')
    .eq('user_id', userId)
    .eq('name', themeName)
    .eq('theme_type', 'qr')
    .maybeSingle()

  if (existing) {
    if (!confirm(`QR Theme "${themeName}" already exists. Overwrite?`)) return
    await supabase
      .from('user_themes')
      .update({ theme_data: themeData, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('user_themes')
      .insert({ user_id: userId, name: themeName, theme_type: 'qr', theme_data: themeData })
  }

  nameInput.value = ''
  await loadSavedQRThemes(container, userId)
}

async function deleteQRTheme(container, userId, themeId, themeName) {
  if (!confirm(`Delete QR Theme "${themeName}"?`)) return
  await supabase
    .from('user_themes')
    .delete()
    .eq('id', themeId)
    .eq('user_id', userId)
  await loadSavedQRThemes(container, userId)
}

function applyQRTheme(container, publicUrl, themeData) {
  const el = (id) => container.querySelector(`#${id}`)

  if (themeData.color) {
    if (el('qr-color')) el('qr-color').value = themeData.color
    if (el('qr-color-text')) el('qr-color-text').value = themeData.color
  }
  if (themeData.bgColor) {
    if (el('qr-bg-color')) el('qr-bg-color').value = themeData.bgColor
    if (el('qr-bg-color-text')) el('qr-bg-color-text').value = themeData.bgColor
  }
  if (themeData.borderEnabled !== undefined) {
    if (el('qr-border-enabled')) el('qr-border-enabled').checked = themeData.borderEnabled
    const opts = el('qr-border-options')
    if (opts) opts.style.display = themeData.borderEnabled ? 'block' : 'none'
  }
  if (themeData.borderColor) {
    if (el('qr-border-color')) el('qr-border-color').value = themeData.borderColor
    if (el('qr-border-color-text')) el('qr-border-color-text').value = themeData.borderColor
  }
  if (themeData.borderStyle) {
    if (el('qr-border-style')) el('qr-border-style').value = themeData.borderStyle
  }
  if (themeData.borderRadius) {
    if (el('qr-border-radius')) el('qr-border-radius').value = themeData.borderRadius
  }
  if (themeData.logo) {
    currentQRLogo = themeData.logo
  } else {
    currentQRLogo = null
  }
  updateLogoPreview(container)
  generateQR(container, publicUrl)
}

// ── Logo Handling ──

function handleLogoUpload(container, publicUrl, e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showToast('Logo must be under 5 MB', 'warning')
    e.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (ev) => {
    currentQRLogo = ev.target.result
    updateLogoPreview(container)
    generateQR(container, publicUrl)
  }
  reader.readAsDataURL(file)
}

function removeLogo(container, publicUrl) {
  currentQRLogo = null
  updateLogoPreview(container)
  const fileInput = container.querySelector('#qr-logo-upload')
  if (fileInput) fileInput.value = ''
  generateQR(container, publicUrl)
}

function useDefaultLogo(container, publicUrl) {
  currentQRLogo = LOGO_URL
  updateLogoPreview(container)
  generateQR(container, publicUrl)
}

function updateLogoPreview(container) {
  const preview = container.querySelector('#qr-logo-preview')
  const img = container.querySelector('#qr-logo-img')
  if (currentQRLogo) {
    if (img) img.src = currentQRLogo
    if (preview) preview.style.display = 'inline-block'
  } else {
    if (preview) preview.style.display = 'none'
    if (img) img.src = ''
  }
}

// ── Color Sync Helpers ──

function syncColorInputs(container, pickerId, textId) {
  const picker = container.querySelector(`#${pickerId}`)
  const text = container.querySelector(`#${textId}`)
  if (picker && text) text.value = picker.value
}

function applyColorFromText(container, textId, pickerId) {
  const text = container.querySelector(`#${textId}`)
  const picker = container.querySelector(`#${pickerId}`)
  if (text && picker && /^#[0-9a-fA-F]{6}$/.test(text.value)) {
    picker.value = text.value
  }
}

// ── Main Render ──

export function renderQRCodeTab(container, collection, user) {
  if (!collection || !user) {
    container.innerHTML = '<div class="qr-tab"><p>Please select a collection first.</p></div>'
    return
  }

  const publicUrl = getPublicUrl(user.id, collection.id)
  const qrData = collection.qr_code_data || {}

  // Reset state
  currentQRCode = null
  currentQRLogo = qrData.logo || null

  const savedColor = qrData.color || '#1A2F5B'
  const savedBgColor = qrData.bgColor || '#ffffff'
  const savedBorderEnabled = qrData.borderEnabled === true || qrData.borderEnabled === 'true'
  const savedBorderColor = qrData.borderColor || '#000000'
  const savedBorderStyle = qrData.borderStyle || 'solid'
  const savedBorderRadius = String(qrData.borderRadius || '16')

  container.innerHTML = `
    <div class="qr-tab">
      <h3>QR Code <span id="qr-save-status" class="auto-save-status"></span></h3>
      <p class="tab-description">Generate a QR code that links directly to this collection's public page.</p>

      <div class="qr-content">
        <!-- Left: Settings -->
        <div class="qr-settings">

          <!-- Public URL -->
          <div class="form-group">
            <label>Collection URL</label>
            <div class="qr-url-row">
              <input type="text" id="qr-url" class="form-input" value="${escapeHtml(publicUrl)}" readonly>
              <button id="qr-copy-url" class="btn-icon" title="Copy URL"><i class="fas fa-copy"></i></button>
            </div>
          </div>

          <!-- Colors -->
          <div class="form-group qr-color-row">
            <div class="qr-color-group">
              <label>QR Code Color</label>
              <div class="color-options">
                <input type="color" id="qr-color" value="${savedColor}" class="color-picker">
                <input type="text" id="qr-color-text" value="${savedColor}" class="color-input" maxlength="7">
              </div>
            </div>
            <div class="qr-color-group">
              <label>Background Color</label>
              <div class="color-options">
                <input type="color" id="qr-bg-color" value="${savedBgColor}" class="color-picker">
                <input type="text" id="qr-bg-color-text" value="${savedBgColor}" class="color-input" maxlength="7">
              </div>
            </div>
          </div>

          <!-- Border -->
          <div class="form-group">
            <label class="qr-checkbox-label">
              <input type="checkbox" id="qr-border-enabled" ${savedBorderEnabled ? 'checked' : ''}>
              <span>Border</span>
            </label>
            <div id="qr-border-options" class="qr-border-options" style="display: ${savedBorderEnabled ? 'block' : 'none'};">
              <div class="form-group">
                <label class="qr-sub-label">Color</label>
                <div class="color-options">
                  <input type="color" id="qr-border-color" value="${savedBorderColor}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${savedBorderColor}" class="color-input" maxlength="7">
                </div>
              </div>
              <div class="qr-border-inline">
                <div>
                  <label class="qr-sub-label">Style</label>
                  <select id="qr-border-style" class="form-input">
                    <option value="solid" ${savedBorderStyle === 'solid' ? 'selected' : ''}>Solid</option>
                    <option value="dashed" ${savedBorderStyle === 'dashed' ? 'selected' : ''}>Dashed</option>
                    <option value="dotted" ${savedBorderStyle === 'dotted' ? 'selected' : ''}>Dotted</option>
                    <option value="double" ${savedBorderStyle === 'double' ? 'selected' : ''}>Double</option>
                  </select>
                </div>
                <div>
                  <label class="qr-sub-label">Corners</label>
                  <select id="qr-border-radius" class="form-input">
                    <option value="16" ${savedBorderRadius === '16' ? 'selected' : ''}>Rounded</option>
                    <option value="0" ${savedBorderRadius === '0' ? 'selected' : ''}>Square</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Logo -->
          <div class="form-group">
            <label>Center Logo</label>
            <input type="file" id="qr-logo-upload" accept="image/*" style="display:none;">
            <div class="qr-logo-buttons">
              <button id="qr-logo-upload-btn" class="btn-primary btn-sm">Upload New</button>
              <button id="qr-logo-default-btn" class="btn-primary btn-sm">AcademiQR Logo</button>
            </div>
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${currentQRLogo ? 'inline-block' : 'none'};">
              <img id="qr-logo-img" src="${currentQRLogo || ''}" alt="Logo">
              <button id="qr-logo-remove" class="btn-remove-image" title="Remove logo"><i class="fas fa-xmark"></i></button>
            </div>
          </div>

          <!-- QR Theme Management -->
          <div class="qr-theme-section">
            <div class="section-header" id="qr-theme-toggle">
              <h4>QR Code Theme Management</h4>
              <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </div>
            <div class="section-content" id="qr-theme-content" style="display:none;">
              <div class="form-group">
                <label class="qr-sub-label">New Theme</label>
                <div class="qr-theme-save-row">
                  <input type="text" id="qr-theme-name" class="form-input" maxlength="100" placeholder="Enter theme name">
                  <button id="qr-theme-save-btn" class="btn-primary btn-sm">Save</button>
                </div>
              </div>
              <div class="form-group">
                <label class="qr-sub-label">Saved Themes</label>
                <div id="saved-qr-themes-list">
                  <p class="qr-themes-empty">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Preview + Download -->
        <div class="qr-preview-section">
          <div id="qr-code-container" class="qr-code-container">
            <div style="text-align:center; color:#9ca3af;">
              <i class="fas fa-qrcode" style="font-size:2rem; margin-bottom:8px; display:block; opacity:0.3;"></i>
              <p style="font-size:0.85rem;">Generating...</p>
            </div>
          </div>
          <div id="qr-actions" class="qr-actions" style="display:none;">
            <button class="btn-primary btn-sm" data-format="png"><i class="fas fa-download"></i> PNG</button>
            <button class="btn-primary btn-sm" data-format="jpeg"><i class="fas fa-download"></i> JPEG</button>
            <button class="btn-primary btn-sm" data-format="svg"><i class="fas fa-download"></i> SVG</button>
          </div>
        </div>
      </div>
    </div>
  `

  // ── Wire up events ──

  const regenerate = () => generateQR(container, publicUrl)

  // Copy URL
  container.querySelector('#qr-copy-url')?.addEventListener('click', () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      const btn = container.querySelector('#qr-copy-url')
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 1500) }
    })
  })

  // Color pickers → regenerate
  for (const id of ['qr-color', 'qr-bg-color', 'qr-border-color']) {
    container.querySelector(`#${id}`)?.addEventListener('input', () => {
      syncColorInputs(container, id, id + '-text')
      regenerate()
    })
  }

  // Color text inputs → sync + regenerate
  for (const [textId, pickerId] of [['qr-color-text', 'qr-color'], ['qr-bg-color-text', 'qr-bg-color'], ['qr-border-color-text', 'qr-border-color']]) {
    container.querySelector(`#${textId}`)?.addEventListener('input', () => {
      applyColorFromText(container, textId, pickerId)
      regenerate()
    })
  }

  // Border toggle
  container.querySelector('#qr-border-enabled')?.addEventListener('change', (e) => {
    const opts = container.querySelector('#qr-border-options')
    if (opts) opts.style.display = e.target.checked ? 'block' : 'none'
    regenerate()
  })

  // Border style/radius → regenerate
  for (const id of ['qr-border-style', 'qr-border-radius']) {
    container.querySelector(`#${id}`)?.addEventListener('change', regenerate)
  }

  // Auto-save QR settings on any change
  const qrSaver = createAutoSaver(async () => {
    // Abort if the QR form has been torn down (e.g., tab switched before debounce fired).
    // Without this, getQRSettings would read null inputs and save defaults over real values.
    if (!container.querySelector('#qr-color')) return false
    const ok = await saveQRSettings(collection.id, container)
    if (ok) {
      const s = getQRSettings(container)
      collection.qr_code_data = {
        color: s.color,
        bgColor: s.bgColor,
        borderEnabled: s.borderEnabled,
        borderColor: s.borderColor,
        borderStyle: s.borderStyle,
        borderRadius: String(s.borderRadius),
        logo: currentQRLogo,
      }
    }
    return ok
  }, { statusSelector: '#qr-save-status' })
  registerAutoSaver(qrSaver)
  const triggerQRSave = () => qrSaver.trigger()

  // Trigger auto-save on all QR setting changes
  for (const id of ['qr-color', 'qr-bg-color', 'qr-border-color']) {
    container.querySelector(`#${id}`)?.addEventListener('input', triggerQRSave)
  }
  for (const id of ['qr-color-text', 'qr-bg-color-text', 'qr-border-color-text']) {
    container.querySelector(`#${id}`)?.addEventListener('input', triggerQRSave)
  }
  container.querySelector('#qr-border-enabled')?.addEventListener('change', triggerQRSave)
  for (const id of ['qr-border-style', 'qr-border-radius']) {
    container.querySelector(`#${id}`)?.addEventListener('change', triggerQRSave)
  }

  // Logo upload
  container.querySelector('#qr-logo-upload-btn')?.addEventListener('click', () => {
    container.querySelector('#qr-logo-upload')?.click()
  })
  container.querySelector('#qr-logo-upload')?.addEventListener('change', (e) => { handleLogoUpload(container, publicUrl, e); triggerQRSave() })
  container.querySelector('#qr-logo-default-btn')?.addEventListener('click', () => { useDefaultLogo(container, publicUrl); triggerQRSave() })
  container.querySelector('#qr-logo-remove')?.addEventListener('click', () => { removeLogo(container, publicUrl); triggerQRSave() })

  // Download buttons
  container.querySelector('#qr-actions')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-format]')
    if (btn) downloadQR(container, btn.dataset.format, collection.slug)
  })

  // QR Theme Management
  container.querySelector('#qr-theme-toggle')?.addEventListener('click', () => {
    const content = container.querySelector('#qr-theme-content')
    const chevron = container.querySelector('#qr-theme-toggle .section-chevron')
    if (content) {
      const open = content.style.display !== 'none'
      content.style.display = open ? 'none' : 'block'
      if (chevron) chevron.classList.toggle('collapsed', open)
    }
  })

  container.querySelector('#qr-theme-save-btn')?.addEventListener('click', () => {
    saveQRTheme(container, user.id, publicUrl)
  })

  // Delegate clicks on theme list (load + delete)
  container.querySelector('#saved-qr-themes-list')?.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.qr-theme-delete')
    if (deleteBtn) {
      e.stopPropagation()
      await deleteQRTheme(container, user.id, deleteBtn.dataset.themeId, deleteBtn.dataset.themeName)
      return
    }
    const item = e.target.closest('.saved-theme-item')
    if (item) {
      // Load theme: fetch from DB by ID
      const { data } = await supabase
        .from('user_themes')
        .select('theme_data')
        .eq('id', item.dataset.themeId)
        .single()
      if (data?.theme_data) {
        applyQRTheme(container, publicUrl, data.theme_data)
      }
    }
  })

  // Auto-generate on tab open
  generateQR(container, publicUrl)

  // Load saved themes in background
  loadSavedQRThemes(container, user.id)
}
