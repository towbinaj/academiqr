import { test, expect } from '@playwright/test'
import { mockSupabase, collection, link, CID } from './supabase-mock.mjs'

const external = /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/

for (const [name, path, opts] of [
  ['home', '/', {}],
  ['collection page', `/public.html?collection=${CID}`, { links: [link('aaaaaaaa-0000-4000-8000-00000000000a', 'First Paper')] }],
  ['dashboard', '/src/pages/dashboard.html', { signedIn: true, collections: [collection()], links: [] }],
  ['privacy', '/privacy.html', {}],
]) {
  test(`${name}: fonts and icons are self-hosted and render`, async ({ page, context }) => {
    await mockSupabase(context, opts)
    const offsite = []
    page.on('request', r => { if (external.test(r.url())) offsite.push(r.url()) })
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    expect(offsite, 'no Google Fonts / Font Awesome CDN requests').toEqual([])

    const icon = page.locator('i.fas, i.fab').first()
    if (await icon.count()) {
      await expect(icon).toBeVisible()
      const ok = await icon.evaluate(async (el) => {
        await document.fonts.ready
        const fam = getComputedStyle(el, '::before').fontFamily
        const glyph = getComputedStyle(el, '::before').content
        return { fam, glyph, loaded: document.fonts.check(`900 16px "Font Awesome 6 Free"`) || document.fonts.check(`400 16px "Font Awesome 6 Brands"`) }
      })
      expect(ok.fam).toMatch(/Font Awesome 6/)
      expect(ok.glyph).not.toBe('none')
      expect(ok.loaded).toBe(true)
    }
  })
}

test('collection page renders text in self-hosted Inter', async ({ page, context }) => {
  await mockSupabase(context, { links: [link('aaaaaaaa-0000-4000-8000-00000000000a', 'First Paper')] })
  await page.goto(`/public.html?collection=${CID}`)
  await expect(page.locator('a.public-link-btn')).toHaveCount(1)
  const loaded = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.family.replace(/"/g, '') === 'Inter' && f.status === 'loaded').length })
  expect(loaded).toBeGreaterThan(0)
})
