import { test, expect } from '@playwright/test'
import { createRequire } from 'node:module'
import { mockSupabase, CID, UID } from './supabase-mock.mjs'

const jsQRPath = createRequire(import.meta.url).resolve('jsqr/dist/jsQR.js')

test('QR tab generates a scannable code for the collection URL', async ({ page, context }) => {
  await mockSupabase(context, { signedIn: true })
  const cdn = []
  page.on('request', r => { if (/cdnjs\.cloudflare\.com/.test(r.url())) cdn.push(r.url()) })
  await page.goto(`/src/pages/editor.html?id=${CID}`)
  await page.locator('.tab[data-tab="qr-code"]').click()
  const img = page.locator('#qr-code-container img[data-composite="true"]')
  await expect(img).toBeVisible({ timeout: 10000 })

  // Decode the generated image in the page with jsQR
  await page.addScriptTag({ path: jsQRPath })
  const decoded = await img.evaluate(async (el) => {
    await el.decode()
    const c = document.createElement('canvas')
    c.width = el.naturalWidth; c.height = el.naturalHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(el, 0, 0)
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height)
    return window.jsQR(data, width, height)?.data ?? null
  })
  expect(decoded).toBe(`https://academiqr.com/public.html?user=${UID.replace(/-/g, '').slice(0, 12)}&collection=${CID}`)
  expect(cdn, 'QR library is bundled, not loaded from cdnjs').toEqual([])
})
