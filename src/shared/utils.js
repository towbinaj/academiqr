/**
 * Shared Utility Functions
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  const errors = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('One number')
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('One special character')
  return { isValid: errors.length === 0, errors }
}

/**
 * Show a temporary message in a container element
 * @param {HTMLElement} container
 * @param {string} text
 * @param {'success'|'error'|'warning'} type
 */
export function showMessage(container, text, type = 'error') {
  if (!container) return
  container.innerHTML = `<div class="message message-${type}">${text}</div>`
  // Auto-clear success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => { container.innerHTML = '' }, 5000)
  }
}

/**
 * Set a persistent login cookie in localStorage
 * @param {string} email
 * @param {boolean} isLoggedIn
 */
export function setPersistentLogin(email, isLoggedIn) {
  try {
    localStorage.setItem('academiq_email', email)
    localStorage.setItem('academiq_logged_in', isLoggedIn ? 'true' : 'false')
    localStorage.setItem('academiq_login_time', Date.now().toString())
  } catch { /* ignore */ }
}

/**
 * Get persistent login data from localStorage
 * @returns {{ email: string|null, isLoggedIn: string|null }}
 */
export function getPersistentLogin() {
  try {
    const email = localStorage.getItem('academiq_email')
    const isLoggedIn = localStorage.getItem('academiq_logged_in')
    const loginTime = localStorage.getItem('academiq_login_time')

    // Expire after 14 days
    if (loginTime) {
      const days = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60 * 24)
      if (days > 14) {
        clearPersistentLogin()
        return { email: null, isLoggedIn: null }
      }
    }
    return { email, isLoggedIn }
  } catch {
    return { email: null, isLoggedIn: null }
  }
}

/**
 * Clear persistent login data
 */
export function clearPersistentLogin() {
  try {
    localStorage.removeItem('academiq_email')
    localStorage.removeItem('academiq_logged_in')
    localStorage.removeItem('academiq_login_time')
  } catch { /* ignore */ }
}
