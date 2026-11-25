import { test, expect } from '@playwright/test'
import { mockSupabase, collection, LINK_A, LINK_B, CID } from './supabase-mock.mjs'

const linkWrites = (writes) => writes.filter(w => w.table === 'link_items' && w.method === 'PATCH')
const idIn = (w) => (w.query.includes(LINK_A.id) ? 'A' : w.query.includes(LINK_B.id) ? 'B' : '?')

async function openEditor(page, context, data = {}) {
  const mock = await mockSupabase(context, { signedIn: true, ...data })
  await page.goto(`/src/pages/editor.html?id=${CID}`)
  await expect(page.locator(`.link-item[data-link-id="${LINK_A.id}"]`)).toBeVisible()
  return mock
}

test('editing a link then immediately selecting another saves the edit to the right link', async ({ page, context }) => {
  const { writes } = await openEditor(page, context)
  await page.locator(`.link-item[data-link-id="${LINK_A.id}"]`).click()
  await page.fill('#link-title', 'Link A EDITED')
  await page.locator(`.link-item[data-link-id="${LINK_B.id}"]`).click() // within the 1 s debounce
  await expect.poll(() => linkWrites(writes).length).toBeGreaterThan(0)
  await page.waitForTimeout(1500) // let any (wrong) debounced save fire too
  const saves = linkWrites(writes).map(w => [idIn(w), w.body.title])
  expect(saves).toEqual([['A', 'Link A EDITED']])
})

test('switching a link to Custom is saved on its own', async ({ page, context }) => {
  const { writes } = await openEditor(page, context)
  await page.locator(`.link-item[data-link-id="${LINK_A.id}"]`).click()
  await page.locator('label.source-toggle-option:has(input[value="custom"])').click()
  await expect.poll(() => linkWrites(writes).length, { timeout: 4000 }).toBe(1)
  expect(linkWrites(writes)[0].body.custom_overrides).toMatchObject({ title: 'Link A' })
})

test('changing visibility does not rewrite a legacy slug that contains spaces', async ({ page, context }) => {
  const legacy = 'Interruption Management - RSNA 2025'
  const { writes } = await openEditor(page, context, { collections: [collection({ slug: legacy })] })
  await page.evaluate(() => {
    const el = document.getElementById('collection-visibility')
    el.value = 'private'
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await expect.poll(() => writes.filter(w => w.table === 'link_lists').length, { timeout: 4000 }).toBe(1)
  expect(writes.find(w => w.table === 'link_lists').body).toMatchObject({ visibility: 'private', slug: legacy })
})

test('editing the presentation title then switching tabs saves the title', async ({ page, context }) => {
  const { writes } = await openEditor(page, context)
  await page.fill('#info-title', 'Renamed Talk')
  await page.locator('.tab[data-tab="appearance"]').click()
  await expect.poll(() => writes.filter(w => w.table === 'link_lists' && w.body?.presentation_data).length).toBe(1)
  expect(writes.find(w => w.body?.presentation_data).body.presentation_data.title).toBe('Renamed Talk')
})
