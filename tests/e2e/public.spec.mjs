import { test, expect } from '@playwright/test'
import { mockSupabase, collection, link, CID, UID } from './supabase-mock.mjs'

const links = [
  link('aaaaaaaa-0000-4000-8000-00000000000a', 'First Paper', { order_index: 100 }),
  link('bbbbbbbb-0000-4000-8000-00000000000b', 'Hidden Link', { order_index: 150, is_active: false }),
  link('cccccccc-0000-4000-8000-00000000000c', 'Slides', { order_index: 200 }),
]

test('short URL with spaces in the slug renders the collection', async ({ page, context }) => {
  await mockSupabase(context, {
    collections: [collection({ slug: 'Interruption Management - RSNA 2025', presentation_data: { title: 'Interruption Management' } })],
    links,
  })
  await page.goto('/u/drtest/Interruption%20Management%20-%20RSNA%202025')
  await expect(page.locator('a.public-link-btn')).toHaveText([/First Paper/, /Slides/]) // inactive link hidden, order kept
  await expect(page).toHaveTitle(/Interruption Management/)
  await expect(page.getByText('Missing Collection')).toHaveCount(0)
})

test('legacy QR-code URL (?user=&collection=) renders the collection', async ({ page, context }) => {
  await mockSupabase(context, { links })
  await page.goto(`/public.html?user=${UID.replace(/-/g, '').slice(0, 12)}&collection=${CID}`)
  await expect(page.locator('a.public-link-btn')).toHaveCount(2)
  await expect(page.locator('a.public-link-btn').first()).toHaveAttribute('href', 'https://first-paper.test')
})

test('unknown slug shows an error instead of a blank page', async ({ page, context }) => {
  await mockSupabase(context, { collections: [] })
  await page.goto('/u/drtest/does-not-exist')
  await expect(page.getByText(/Missing Collection|Not Found/)).toBeVisible()
})
