import { defineConfig, globalIgnores } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";

import path from "node:path";
import { fileURLToPath } from "node:url";

import tsEslint from "typescript-eslint";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import _import from "eslint-plugin-import";
import eslintComments from "eslint-plugin-eslint-comments";

// Read ignored files from .gitignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  includeIgnoreFile(gitignorePath),
  globalIgnores(["**/node_modules", "**/build", "**/coverage"]),
  {
    // Language options
    languageOptions: {
      globals: {
        BigInt: true,
        console: true,
        WebAssembly: true,
      },
      parser: tsParser,

      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },

    // Settings
    settings: {
      env: {
        es6: true,
      },
    },

    // Extends
    extends: [
      "js/recommended",
      tsEslint.configs.recommended,
      eslintConfigPrettier,
    ],

    // Plugins
    plugins: {
      js,
      "@typescript-eslint": tsEslintPlugin,
      import: _import,
      "eslint-comments": eslintComments,
    },

    // Rules
    rules: {
      // typescript
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // eslint-comments
      "eslint-comments/disable-enable-pair": [
        "error",
        {
          allowWholeFile: true,
        },
      ],
      "eslint-comments/no-unused-disable": "error",
    },
  },
]);
