/**
 * Simple Page Router
 * Handles navigation between multi-page app pages
 */

const ROUTES = {
  login: '/index.html',
  dashboard: '/src/pages/dashboard.html',
  editor: '/src/pages/editor.html',
  library: '/src/pages/library.html',
  profile: '/src/pages/profile.html',
  public: '/public.html'
}

/**
 * Navigate to a named route
 * @param {string} route - Route name (dashboard, editor, library, etc.)
 * @param {object} params - URL parameters
 */
export function navigate(route, params = {}) {
  const basePath = ROUTES[route]
  if (!basePath) {
    console.error(`Unknown route: ${route}`)
    return
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  const fullUrl = queryString ? `${basePath}?${queryString}` : basePath
  window.location.href = fullUrl
}

/**
 * Get a URL parameter from the current page
 * @param {string} key
 * @returns {string|null}
 */
export function getParam(key) {
  const url = new URL(window.location.href)
  return url.searchParams.get(key)
}

/**
 * Navigate to the collection editor for a specific collection
 * @param {string} collectionId
 */
export function goToEditor(collectionId) {
  navigate('editor', { id: collectionId })
}

/**
 * Navigate back to the dashboard
 */
export function goToDashboard() {
  navigate('dashboard')
}

/**
 * Navigate to the link library
 */
export function goToLibrary() {
  navigate('library')
}

/**
 * Get the full public URL for a collection
 * Uses short URL format if username + slug available, otherwise falls back to query params
 * @param {string} userId
 * @param {string} collectionId
 * @param {Object} [options]
 * @param {string} [options.username] - User's username for short URLs
 * @param {string} [options.slug] - Collection's slug for short URLs
 * @returns {string}
 */
export function getPublicUrl(userId, collectionId, options = {}) {
  const { username, slug } = options

  // Short URL format if username and slug are available
  if (username && slug) {
    return `https://academiqr.com/u/${username}/${slug}`
  }

  // Fallback: legacy query param format
  const normalizedUserId = userId.replace(/-/g, '').substring(0, 12).toLowerCase()
  return `https://academiqr.com/public.html?user=${normalizedUserId}&collection=${collectionId}`
}
