import { test, expect } from '@playwright/test'
import { mockSupabase } from './supabase-mock.mjs'

test('wrong password shows the error toast', async ({ page, context }) => {
  await mockSupabase(context)
  await page.goto('/')
  await page.fill('#email', 'nobody@example.com')
  await page.fill('#password', 'WrongPass1!')
  await page.click('#login-btn')
  await expect(page.locator('[class*=toast]').filter({ hasText: 'Invalid email or password' }).first()).toBeVisible()
})

test('signed-in pages redirect to login when signed out', async ({ page, context }) => {
  await mockSupabase(context)
  for (const p of ['dashboard', 'editor', 'library', 'profile']) {
    await page.goto(`/src/pages/${p}.html`)
    await expect(page).toHaveURL(/\/index\.html$/)
  }
})

test('signed out: landing + login show on first paint, no spinner, no layout shift', async ({ page, context }) => {
  await mockSupabase(context)
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value })
      .observe({ type: 'layout-shift', buffered: true })
  })
  await page.setViewportSize({ width: 1350, height: 940 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/no-session/)
  await expect(page.locator('#landing')).toBeVisible()
  await expect(page.locator('#email')).toBeVisible()
  await expect(page.locator('#loading')).toBeHidden()
  await page.waitForTimeout(1000)
  expect(await page.evaluate(() => window.__cls)).toBeLessThan(0.1)
})

test('signed in: the home page sends you to the dashboard', async ({ page, context }) => {
  await mockSupabase(context, { signedIn: true, collections: [], links: [] })
  await page.goto('/')
  await expect(page).toHaveURL(/dashboard\.html/)
})
