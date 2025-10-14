import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  if (isDev) {
    const envPath = path.resolve(process.cwd(), "../../");
    const env = loadEnv(mode, envPath, "");
    process.env = { ...process.env, ...env };
  }

  return {
    server: {
      port: 3001,
    },
    plugins: [remix(), tsconfigPaths()],
  };
});
