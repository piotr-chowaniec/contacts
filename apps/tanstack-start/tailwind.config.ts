import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "../../shared/ui/components/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;
