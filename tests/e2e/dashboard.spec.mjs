import { test, expect } from '@playwright/test'
import { mockSupabase, collection, CID } from './supabase-mock.mjs'

test('duplicating a collection gives a readable slug', async ({ page, context }) => {
  const { writes } = await mockSupabase(context, {
    signedIn: true,
    collections: [collection({ presentation_data: { title: 'Pediatric Liver Tumors – CHOP' } })],
    links: [],
  })
  page.on('dialog', d => d.accept())
  await page.goto('/src/pages/dashboard.html')
  await page.locator(`[data-action="duplicate"][data-id="${CID}"]`).click()
  await expect.poll(() => writes.find(w => w.table === 'link_lists' && w.method === 'POST')?.body?.slug)
    .toMatch(/^pediatric-liver-tumors-chop-copy-[a-z0-9]{4}$/)
})

test('a new collection gets an untitled-xxxx slug', async ({ page, context }) => {
  const { writes } = await mockSupabase(context, { signedIn: true, collections: [], links: [] })
  await page.goto('/src/pages/dashboard.html')
  await page.locator('#new-collection-btn').click()
  await expect.poll(() => writes.find(w => w.table === 'link_lists' && w.method === 'POST')?.body?.slug)
    .toMatch(/^untitled-[a-z0-9]{4}$/)
})
