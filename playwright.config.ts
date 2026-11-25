import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const MOCK_PORT = 4010;

/** E2E against the production build (`npm run build` first) and a local HN mock, so no real network is used. */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node tests/e2e/mock-server.mts",
      url: `http://127.0.0.1:${MOCK_PORT}/topstories.json`,
      env: { MOCK_PORT: String(MOCK_PORT) },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run start -- -p ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}`,
      env: { HN_API_BASE: `http://127.0.0.1:${MOCK_PORT}` },
      reuseExistingServer: !process.env.CI,
    },
  ],
});
