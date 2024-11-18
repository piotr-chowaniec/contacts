// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    name: "TypeScript",
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "Disable TypeScript",
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: [
      "**/dist/**/*",
      "**/build/**/*",
      "**/.turbo/**/*",
      "**/.vercel/**/*",
      "**/.vinxi/**/*",
      "**/.next/**/*",
      "**/eslint.config.mjs",
      "**/**/*.js",
    ],
  },
  {
    name: "Rules for React files",
    files: ["**/*.{jsx, tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } },
    ...reactHooks.configs["recommended-latest"],
  },
  {
    name: "Rules for all files",
    rules: {
      "no-console": "off",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
);

export default eslintConfig;
