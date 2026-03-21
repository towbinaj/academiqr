// AcademiQR Service Worker — Cache-first for static assets, network-first for API
const CACHE_NAME = 'academiqr-v1'
const STATIC_ASSETS = [
  '/',
  '/src/pages/dashboard.html',
  '/src/pages/editor.html',
  '/src/pages/library.html',
  '/src/pages/profile.html',
  '/public.html',
]

// Install — cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET and Supabase API calls
  if (event.request.method !== 'GET') return
  if (url.hostname.includes('supabase')) return

  // Don't cache auth pages
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return // Let browser handle login page normally
  }

  // Cache-first for static assets (CSS, JS, fonts, images)
  if (url.pathname.match(/\.(css|js|woff2?|png|jpg|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
      )
    )
    return
  }

  // Network-first for HTML pages
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
