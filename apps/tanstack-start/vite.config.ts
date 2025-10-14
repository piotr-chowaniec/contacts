import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  if (isDev) {
    const envPath = path.resolve(process.cwd(), "../../");
    const env = loadEnv(mode, envPath, "");
    process.env = { ...process.env, ...env };
  }

  return {
    server: {
      port: 3003,
    },
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart(),
    ],
  };
});
