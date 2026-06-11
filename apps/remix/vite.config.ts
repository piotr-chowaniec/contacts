import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
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
      port: 3001,
    },
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
