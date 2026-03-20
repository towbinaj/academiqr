/**
 * Dark/Light Theme Toggle
 * Persists preference to localStorage, respects system preference as default
 */

const STORAGE_KEY = 'academiqr-theme'

export function initThemeToggle() {
  // Apply saved theme or system preference
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved)
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }

  // Listen for system preference changes (if no manual override)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
  })
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem(STORAGE_KEY, next)
  return next
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}
