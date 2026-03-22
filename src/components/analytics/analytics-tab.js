/**
 * AcademiQR v1.0 — Analytics Tab Module
 * Displays page views, link clicks, social media clicks, and unique visitors.
 * Data sourced from page_views and link_clicks tables.
 */
import { supabase } from '../../shared/supabase.js'

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

const PLATFORM_NAMES = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  snapchat: 'Snapchat',
  email: 'Email',
}

// ── Date Helpers ──

function defaultDateRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function parseLocalDate(dateStr, endOfDay = false) {
  const [y, m, d] = dateStr.split('-').map(Number)
  if (endOfDay) return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString()
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString()
}

// ── Data Fetching ──

async function fetchAnalytics(userId, listId, dateFrom, dateTo) {
  // Build date range ISO strings
  const from = dateFrom ? parseLocalDate(dateFrom) : null
  const to = dateTo ? parseLocalDate(dateTo, true) : null

  function applyDateFilter(query, col) {
    if (from) query = query.gte(col, from)
    if (to) query = query.lte(col, to)
    return query
  }

  // 1) Total link clicks (exclude social media — link_id not null)
  let clicksQ = supabase
    .from('link_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)
    .eq('list_id', listId)
    .not('link_id', 'is', null)
  clicksQ = applyDateFilter(clicksQ, 'clicked_at')
  const { count: totalClicks } = await clicksQ

  // 2) Page views count
  let viewsQ = supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)
    .eq('list_id', listId)
  viewsQ = applyDateFilter(viewsQ, 'viewed_at')
  const { count: totalViews } = await viewsQ

  // 3) Unique visitors (unique session_id)
  let sessionsQ = supabase
    .from('page_views')
    .select('session_id')
    .eq('owner_id', userId)
    .eq('list_id', listId)
  sessionsQ = applyDateFilter(sessionsQ, 'viewed_at')
  const { data: sessionRows } = await sessionsQ
  const uniqueVisitors = sessionRows
    ? new Set(sessionRows.map(r => r.session_id).filter(Boolean)).size
    : 0

  // 4) Clicks by link (with join to link_items for title/url)
  let linksQ = supabase
    .from('link_clicks')
    .select('link_id, link_items:link_id (title, url)')
    .eq('owner_id', userId)
    .eq('list_id', listId)
    .not('link_id', 'is', null)
  linksQ = applyDateFilter(linksQ, 'clicked_at')
  const { data: clicksData } = await linksQ

  const linkMap = {}
  if (clicksData) {
    for (const c of clicksData) {
      if (!linkMap[c.link_id]) {
        linkMap[c.link_id] = {
          title: c.link_items?.title || 'Unknown Link',
          url: c.link_items?.url || '',
          clicks: 0,
        }
      }
      linkMap[c.link_id].clicks++
    }
  }
  const linkBreakdown = Object.values(linkMap).sort((a, b) => b.clicks - a.clicks)

  // 5) Social media clicks (social_platform not null)
  let socialQ = supabase
    .from('link_clicks')
    .select('social_platform')
    .eq('owner_id', userId)
    .eq('list_id', listId)
  socialQ = applyDateFilter(socialQ, 'clicked_at')
  const { data: allClicks } = await socialQ

  const socialMap = {}
  if (allClicks) {
    for (const c of allClicks) {
      if (!c.social_platform) continue
      const p = c.social_platform.toLowerCase()
      if (!socialMap[p]) socialMap[p] = { platform: p, clicks: 0 }
      socialMap[p].clicks++
    }
  }
  const socialBreakdown = Object.values(socialMap).sort((a, b) => b.clicks - a.clicks)
  const totalSocialClicks = socialBreakdown.reduce((s, i) => s + i.clicks, 0)

  // 6) Daily views time series (for chart)
  let dailyViewsQ = supabase
    .from('page_views')
    .select('viewed_at')
    .eq('owner_id', userId)
    .eq('list_id', listId)
  dailyViewsQ = applyDateFilter(dailyViewsQ, 'viewed_at')
  const { data: viewsData } = await dailyViewsQ

  const dailyViews = {}
  if (viewsData) {
    for (const v of viewsData) {
      const day = (v.viewed_at || v.created_at || '').substring(0, 10)
      if (day) dailyViews[day] = (dailyViews[day] || 0) + 1
    }
  }

  // 7) Daily clicks time series
  let dailyClicksQ = supabase
    .from('link_clicks')
    .select('clicked_at')
    .eq('owner_id', userId)
    .eq('list_id', listId)
    .not('link_id', 'is', null)
  dailyClicksQ = applyDateFilter(dailyClicksQ, 'clicked_at')
  const { data: clicksTimeSeries } = await dailyClicksQ

  const dailyClicks = {}
  if (clicksTimeSeries) {
    for (const c of clicksTimeSeries) {
      const day = (c.clicked_at || c.created_at || '').substring(0, 10)
      if (day) dailyClicks[day] = (dailyClicks[day] || 0) + 1
    }
  }

  return { totalClicks: totalClicks || 0, totalViews: totalViews || 0, uniqueVisitors, totalSocialClicks, linkBreakdown, socialBreakdown, dailyViews, dailyClicks }
}

// ── Rendering ──

function renderLinksBreakdown(container, linksArray) {
  const el = container.querySelector('#links-breakdown-list')
  if (!el) return

  if (!linksArray || linksArray.length === 0) {
    el.innerHTML = '<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>'
    return
  }

  const maxClicks = Math.max(...linksArray.map(l => l.clicks))
  el.innerHTML = linksArray.map(link => {
    const pct = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0
    const truncUrl = link.url.length > 50 ? link.url.substring(0, 50) + '...' : link.url
    return `
      <div class="analytics-link-row">
        <div class="analytics-link-info">
          <div class="analytics-link-title">${escapeHtml(link.title)}</div>
          <div class="analytics-link-url" title="${escapeHtml(link.url)}">${escapeHtml(truncUrl)}</div>
        </div>
        <div class="analytics-link-count">${link.clicks}</div>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `
  }).join('')
}

function renderSocialBreakdown(container, socialArray) {
  const el = container.querySelector('#social-breakdown-list')
  if (!el) return

  if (!socialArray || socialArray.length === 0) {
    el.innerHTML = '<p class="analytics-empty">No social media clicks yet.</p>'
    return
  }

  el.innerHTML = socialArray.map(item => {
    const name = PLATFORM_NAMES[item.platform] || item.platform.charAt(0).toUpperCase() + item.platform.slice(1)
    return `
      <div class="analytics-social-row">
        <span class="analytics-social-name">${escapeHtml(name)}</span>
        <span class="analytics-social-count">${item.clicks}</span>
      </div>
    `
  }).join('')
}

function updateStatCards(container, data) {
  const set = (id, val) => {
    const el = container.querySelector(`#${id}`)
    if (el) el.textContent = val
  }
  set('stat-total-views', data.totalViews)
  set('stat-link-clicks', data.totalClicks)
  set('stat-social-clicks', data.totalSocialClicks)
  set('stat-unique-visitors', data.uniqueVisitors)
}

// ── Chart Rendering (canvas-based, no dependencies) ──
function renderTimeSeriesChart(container, dailyViews, dailyClicks, dateFrom, dateTo) {
  const canvas = container.querySelector('#analytics-chart')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // Set canvas size
  const rect = canvas.parentElement.getBoundingClientRect()
  const width = rect.width || 600
  const height = 200
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx.scale(dpr, dpr)

  // Generate date range
  const from = new Date(dateFrom || Date.now() - 30 * 86400000)
  const to = new Date(dateTo || Date.now())
  const days = []
  const d = new Date(from)
  while (d <= to) {
    days.push(d.toISOString().substring(0, 10))
    d.setDate(d.getDate() + 1)
  }
  if (days.length === 0) return

  const viewValues = days.map(d => dailyViews[d] || 0)
  const clickValues = days.map(d => dailyClicks[d] || 0)
  const maxVal = Math.max(...viewValues, ...clickValues, 1)

  // Layout
  const pad = { top: 20, right: 16, bottom: 32, left: 40 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  // Dark mode detection
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
  const labelColor = isDark ? '#94a3b8' : '#94a3b8'
  const viewsColor = isDark ? 'rgba(147, 197, 253, 1)' : 'rgba(26, 47, 91, 1)'  // light blue in dark, navy in light
  const clicksColor = isDark ? 'rgba(74, 222, 128, 1)' : 'rgba(34, 197, 94, 1)'  // brighter green in dark
  const legendTextColor = isDark ? '#cbd5e1' : undefined  // use line color in light mode

  // Clear
  ctx.clearRect(0, 0, width, height)

  // Grid lines
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 0.5
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(width - pad.right, y)
    ctx.stroke()
  }

  // Y-axis labels
  ctx.fillStyle = labelColor
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(maxVal * (4 - i) / 4)
    const y = pad.top + (chartH / 4) * i + 3
    ctx.fillText(val.toString(), pad.left - 6, y)
  }

  // X-axis labels (show ~6 date labels)
  ctx.textAlign = 'center'
  const labelInterval = Math.max(1, Math.floor(days.length / 6))
  for (let i = 0; i < days.length; i += labelInterval) {
    const x = pad.left + (chartW / (days.length - 1 || 1)) * i
    const parts = days[i].split('-')
    ctx.fillText(`${parts[1]}/${parts[2]}`, x, height - 8)
  }

  // Draw line helper
  function drawLine(values, color) {
    if (values.length < 2) return
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let i = 0; i < values.length; i++) {
      const x = pad.left + (chartW / (values.length - 1 || 1)) * i
      const y = pad.top + chartH - (values[i] / maxVal) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Fill area
    ctx.lineTo(pad.left + chartW, pad.top + chartH)
    ctx.lineTo(pad.left, pad.top + chartH)
    ctx.closePath()
    ctx.fillStyle = color.replace('1)', isDark ? '0.15)' : '0.08)')
    ctx.fill()
  }

  drawLine(viewValues, viewsColor)
  drawLine(clickValues, clicksColor)

  // Legend
  ctx.font = '11px Inter, sans-serif'
  // Views swatch + label
  ctx.fillStyle = viewsColor
  ctx.fillRect(pad.left, 4, 12, 3)
  ctx.fillStyle = legendTextColor || viewsColor
  ctx.fillText('Views', pad.left + 40, 10)
  // Clicks swatch + label
  ctx.fillStyle = clicksColor
  ctx.fillRect(pad.left + 80, 4, 12, 3)
  ctx.fillStyle = legendTextColor || clicksColor
  ctx.fillText('Clicks', pad.left + 120, 10)
}

// ── Main Render ──

export function renderAnalyticsTab(container, collection, user) {
  if (!collection || !user) {
    container.innerHTML = '<div class="analytics-tab"><p>Please select a collection first.</p></div>'
    return
  }

  const defaults = defaultDateRange()

  container.innerHTML = `
    <div class="analytics-tab">
      <h3>Analytics</h3>
      <p class="tab-description">Page views and link clicks for this collection.</p>

      <!-- Date Range Filter -->
      <div class="analytics-date-row">
        <input type="date" id="analytics-date-from" class="form-input" value="${defaults.from}">
        <span class="analytics-date-sep">to</span>
        <input type="date" id="analytics-date-to" class="form-input" value="${defaults.to}">
        <button id="analytics-refresh" class="btn-primary btn-sm"><i class="fas fa-sync-alt"></i> Apply</button>
      </div>

      <!-- Stats Grid -->
      <div class="analytics-stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="stat-total-views">—</div>
          <div class="stat-label">Total Views</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-link-clicks">—</div>
          <div class="stat-label">Link Clicks</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-social-clicks">—</div>
          <div class="stat-label">Social Clicks</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-unique-visitors">—</div>
          <div class="stat-label">Unique Visitors</div>
        </div>
      </div>

      <!-- Views & Clicks Chart -->
      <div class="analytics-section">
        <div class="section-header" id="chart-toggle">
          <h4>Views & Clicks Over Time</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="chart-content">
          <canvas id="analytics-chart" style="width:100%; height:200px;"></canvas>
        </div>
      </div>

      <!-- Clicks by Link -->
      <div class="analytics-section">
        <div class="section-header" id="links-breakdown-toggle">
          <h4>Clicks by Link</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="links-breakdown-content">
          <div id="links-breakdown-list">
            <p class="analytics-empty">Loading...</p>
          </div>
        </div>
      </div>

      <!-- Social Media Clicks -->
      <div class="analytics-section">
        <div class="section-header" id="social-breakdown-toggle">
          <h4>Social Media Clicks</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="social-breakdown-content">
          <div id="social-breakdown-list">
            <p class="analytics-empty">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  `

  // ── Wire Events ──

  const refresh = async () => {
    const dateFrom = container.querySelector('#analytics-date-from')?.value || ''
    const dateTo = container.querySelector('#analytics-date-to')?.value || ''
    const btn = container.querySelector('#analytics-refresh')
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...' }

    try {
      const data = await fetchAnalytics(user.id, collection.id, dateFrom, dateTo)
      updateStatCards(container, data)
      renderTimeSeriesChart(container, data.dailyViews, data.dailyClicks, dateFrom, dateTo)
      renderLinksBreakdown(container, data.linkBreakdown)
      renderSocialBreakdown(container, data.socialBreakdown)
    } catch (err) {
      console.error('[Analytics] Failed to load:', err)
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sync-alt"></i> Apply' }
  }

  container.querySelector('#analytics-refresh')?.addEventListener('click', refresh)

  // Section toggles
  for (const [toggleId, contentId] of [
    ['chart-toggle', 'chart-content'],
    ['links-breakdown-toggle', 'links-breakdown-content'],
    ['social-breakdown-toggle', 'social-breakdown-content'],
  ]) {
    container.querySelector(`#${toggleId}`)?.addEventListener('click', () => {
      const content = container.querySelector(`#${contentId}`)
      const chevron = container.querySelector(`#${toggleId} .section-chevron`)
      if (content) {
        const open = content.style.display !== 'none'
        content.style.display = open ? 'none' : 'block'
        if (chevron) chevron.classList.toggle('collapsed', open)
      }
    })
  }

  // Auto-load on tab open
  refresh()
}
