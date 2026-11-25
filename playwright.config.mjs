import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PORT || 4173)

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '*.spec.mjs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'off',
    // Locally, an existing Chromium can be used: PW_CHROMIUM_PATH=/path/to/chromium
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Serves the built site; run `npm run build` first.
  webServer: { command: `node tests/e2e/server.mjs`, port, reuseExistingServer: !process.env.CI, env: { PORT: String(port) } },
})
