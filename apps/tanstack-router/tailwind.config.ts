import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../shared/ui/components/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;
