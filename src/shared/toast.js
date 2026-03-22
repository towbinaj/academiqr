/**
 * Toast Notification System
 * Unified feedback for success, error, warning, and info messages
 */

const TOAST_TYPES = {
  success: { icon: 'fa-check-circle', color: '#22c55e', duration: 4000 },
  error:   { icon: 'fa-circle-exclamation', color: '#ef4444', duration: 8000 },
  warning: { icon: 'fa-triangle-exclamation', color: '#f59e0b', duration: 8000 },
  info:    { icon: 'fa-circle-info', color: '#1A2F5B', duration: 4000 },
}

const MAX_VISIBLE = 3
let container = null
const activeToasts = []

function getContainer() {
  if (container && document.body.contains(container)) return container
  container = document.createElement('div')
  container.className = 'toast-container'
  document.body.appendChild(container)
  return container
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {'success'|'error'|'warning'|'info'} type - Toast type
 * @param {Object} [options]
 * @param {number} [options.duration] - Auto-dismiss time in ms (0 = no auto-dismiss)
 */
export function showToast(message, type = 'info', options = {}) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info
  const duration = options.duration ?? config.duration
  const el = getContainer()

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <div class="toast-accent" style="background:${config.color}"></div>
    <i class="fas ${config.icon} toast-icon" style="color:${config.color}"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-dismiss" aria-label="Dismiss"><i class="fas fa-times"></i></button>
    ${duration > 0 ? `<div class="toast-progress"><div class="toast-progress-bar" style="background:${config.color};animation-duration:${duration}ms"></div></div>` : ''}
  `

  // Dismiss on click
  toast.querySelector('.toast-dismiss').addEventListener('click', () => removeToast(toast))

  // Pause progress on hover
  if (duration > 0) {
    toast.addEventListener('mouseenter', () => {
      const bar = toast.querySelector('.toast-progress-bar')
      if (bar) bar.style.animationPlayState = 'paused'
    })
    toast.addEventListener('mouseleave', () => {
      const bar = toast.querySelector('.toast-progress-bar')
      if (bar) bar.style.animationPlayState = 'running'
    })
  }

  // Manage stack
  activeToasts.push(toast)
  while (activeToasts.length > MAX_VISIBLE) {
    removeToast(activeToasts[0])
  }

  el.appendChild(toast)

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-enter')
  })

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration)
  }

  return toast
}

function removeToast(toast) {
  if (!toast || !toast.parentNode) return
  const idx = activeToasts.indexOf(toast)
  if (idx > -1) activeToasts.splice(idx, 1)

  toast.classList.add('toast-exit')
  toast.addEventListener('animationend', () => {
    toast.remove()
  }, { once: true })
  // Fallback removal
  setTimeout(() => toast.remove(), 400)
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
