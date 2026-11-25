import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 12_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    channel: process.env.E2E_CHROMIUM_CHANNEL || undefined,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
})
