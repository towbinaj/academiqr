// Accessibility: axe-core (the engine behind Lighthouse's accessibility score), WCAG 2.1 A/AA + best practices.
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockSupabase, collection, link, CID, LINK_A, LINK_B } from './supabase-mock.mjs'

const signedIn = { signedIn: true, collections: [collection()], links: [LINK_A, LINK_B] }
const screens = [
  ['home', '/', {}],
  ['collection page', `/public.html?collection=${CID}`, { links: [link('aaaaaaaa-0000-4000-8000-00000000000a', 'First Paper')] }],
  ['privacy', '/privacy.html', {}],
  ['dashboard', '/src/pages/dashboard.html', signedIn],
  ['editor: Collection tab', `/src/pages/editor.html?id=${CID}`, signedIn],
  ['editor: link selected', `/src/pages/editor.html?id=${CID}`, signedIn, p => p.locator(`.link-item[data-link-id="${LINK_A.id}"]`).click()],
  ['editor: Appearance tab', `/src/pages/editor.html?id=${CID}`, signedIn, p => p.locator('.tab[data-tab="appearance"]').click()],
  ['editor: QR tab', `/src/pages/editor.html?id=${CID}`, signedIn, async p => { await p.locator('.tab[data-tab="qr-code"]').click(); await p.locator('#qr-code-container img').waitFor() }],
  ['editor: Analytics tab', `/src/pages/editor.html?id=${CID}`, signedIn, p => p.locator('.tab[data-tab="analytics"]').click()],
  ['library', '/src/pages/library.html', signedIn],
  ['profile', '/src/pages/profile.html', signedIn],
]

for (const [name, path, data, act] of screens) {
  test(`a11y: ${name}`, async ({ page, context }) => {
    await mockSupabase(context, data)
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    if (act) { await act(page); await page.waitForLoadState('networkidle') }
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()
    const summary = violations.map(v => `${v.impact} ${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)
    expect(summary).toEqual([])
  })
}
