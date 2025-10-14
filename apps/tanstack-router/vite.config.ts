import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  if (isDev) {
    const envPath = path.resolve(process.cwd(), "../../");
    const env = loadEnv(mode, envPath, "");
    process.env = { ...process.env, ...env };
  }

  return {
    server: {
      port: 3002,
    },
    plugins: [tanstackRouter(), viteReact()],
  };
});
