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
