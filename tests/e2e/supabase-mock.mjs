// In-browser stand-in for Supabase: intercepts every request to the project URL,
// serves fixture data, and records writes. Optionally fakes a signed-in session.
export const REF = 'natzpfyxpuycsuuzbqrd'
export const UID = '11111111-1111-4111-8111-111111111111'
export const CID = '22222222-2222-4222-8222-222222222222'
export const user = { id: UID, aud: 'authenticated', role: 'authenticated', email: 'test@example.com', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' }

export const link = (id, title, extra = {}) => ({
  id, list_id: CID, title, url: `https://${title.toLowerCase().replace(/\W+/g, '-')}.test`, image_url: null,
  image_position: { x: 50, y: 50 }, image_scale: 100, order_index: 100, is_active: true,
  source_link_id: null, use_library_defaults: false, custom_overrides: null, tags: [], ...extra,
})

export const LINK_A = link('aaaaaaaa-0000-4000-8000-00000000000a', 'Link A', { order_index: 100 })
export const LINK_B = link('bbbbbbbb-0000-4000-8000-00000000000b', 'Link B', { order_index: 200 })

export const collection = (extra = {}) => ({
  id: CID, owner_id: UID, slug: 'my-talk', visibility: 'public', passkey_hash: null, theme: {},
  presentation_data: { title: 'My Talk', conference: 'RSNA' }, qr_code_data: {}, order_index: 0,
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z', ...extra,
})

/**
 * @param {import('@playwright/test').BrowserContext} context
 * @param {{ signedIn?: boolean, collections?: object[], links?: object[], profile?: object, authError?: boolean }} data
 * @returns {{ writes: Array<{method: string, table: string, query: string, body: any}> }}
 */
export async function mockSupabase(context, data = {}) {
  const writes = []
  const collections = data.collections ?? [collection()]
  const links = data.links ?? [LINK_A, LINK_B]
  const profile = data.profile ?? { id: UID, display_name: 'Dr. Test', username: 'drtest' }
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }

  await context.route(`https://${REF}.supabase.co/**`, async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const method = req.method()
    const table = url.pathname.split('/').pop()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: cors, body: JSON.stringify(body) })
    if (method === 'OPTIONS') return route.fulfill({ status: 200, headers: cors })

    if (url.pathname === '/auth/v1/user') return data.signedIn ? json(user) : json({ message: 'no session' }, 401)
    if (url.pathname === '/auth/v1/token') return json({ error: 'invalid_grant', error_description: 'Invalid login credentials', code: 'invalid_credentials' }, 400)
    if (url.pathname.startsWith('/auth/')) return json({})
    if (url.pathname === '/functions/v1/rate-limit-check') return json({ allowed: true, isLocked: false, remainingTime: 0 })

    if (method !== 'GET' && method !== 'HEAD') {
      const body = JSON.parse(req.postData() || 'null')
      writes.push({ method, table, query: url.search, body })
      if (method === 'POST' && body && !Array.isArray(body)) return json({ ...body, id: '33333333-3333-4333-8333-333333333333' }, 201)
      return json([])
    }

    const single = (req.headers()['accept'] || '').includes('vnd.pgrst.object')
    const eq = (col) => url.searchParams.get(col)?.replace(/^eq\./, '')
    let rows = []
    if (table === 'link_lists') rows = collections.filter(c => (!eq('id') || c.id === eq('id')) && (!eq('slug') || c.slug === eq('slug')))
    else if (table === 'link_items') rows = links.filter(l => !eq('list_id') || l.list_id === eq('list_id'))
    else if (table === 'profiles') rows = (!eq('username') || profile.username === eq('username')) ? [profile] : []
    if (single) return rows.length ? json(rows[0]) : json({ code: 'PGRST116', message: 'no rows' }, 406)
    return json(rows)
  })

  if (data.signedIn) {
    await context.addInitScript(([ref, user]) => {
      const now = Math.floor(Date.now() / 1000)
      const jwt = 'x.' + btoa(JSON.stringify({ sub: user.id, exp: now + 3600 })) + '.y'
      localStorage.setItem(`sb-${ref}-auth-token`, JSON.stringify({ access_token: jwt, token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: 'r', user }))
    }, [REF, user])
  }
  return { writes }
}
