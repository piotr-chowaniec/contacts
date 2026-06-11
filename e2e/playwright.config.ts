import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve("..", ".env"), override: true });

export default defineConfig({
  testDir: "./",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
  },

  projects: [
    // Calls clerkSetup() once before any app tests run
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
    },

    {
      name: "nextjs",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3000" },
    },
    {
      name: "remix",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3001" },
    },
    {
      name: "tanstack-router",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3002" },
    },
    {
      name: "tanstack-start",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3003" },
    },
  ],

  webServer: [
    {
      command: "pnpm --filter nextjs dev",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: resolve(".."),
    },
    {
      command: "pnpm --filter remix dev",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: resolve(".."),
    },
    {
      command: "pnpm --filter tanstack-router dev",
      url: "http://localhost:3002",
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: resolve(".."),
    },
    {
      command: "pnpm --filter tanstack-start dev",
      url: "http://localhost:3003",
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: resolve(".."),
    },
    {
      command: "pnpm --filter server start",
      url: "http://localhost:3010/healthcheck",
      reuseExistingServer: true,
      timeout: 30_000,
      cwd: resolve(".."),
      env: { NODE_ENV: "development" },
    },
  ],
});
