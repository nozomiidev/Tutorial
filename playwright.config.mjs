import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 120_000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  outputDir: 'artifacts/e2e/test-results',
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30_000,
    navigationTimeout: 120_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
