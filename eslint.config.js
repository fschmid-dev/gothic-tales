import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import vueParser from "vue-eslint-parser";

export default [
  // --- Global ignores (similar to .eslintignore) ---
  {
    ignores: ["dist/", "node_modules/", ".vscode/"],
  },

  // --- Base ESLint Recommended Rules ---
  // Applies general ESLint recommended rules
  eslint.configs.recommended,

  // --- Prettier Integration (should be last to override conflicting rules) ---
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // --- Node.js Files Configuration (specifically for vite.config.js) ---
  {
    files: ["vite.config.js"], // Target only your Vite config file
    languageOptions: {
      // Define Node.js globals for this specific file
      globals: {
        ...globals.node, // This includes 'process'
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // You can add specific rules for Node.js files here if needed
    },
  },

  // --- Vue and JavaScript Files Configuration ---
  {
    files: ["**/*.vue", "**/*.js"], // Target Vue Single File Components and regular JS files
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: vueParser, // Use vue-eslint-parser for both .vue and .js for consistent parsing
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // The direct import for 'pluginVue.configs["vue3-recommended"].rules' can be tricky.
      // Let's try importing the recommended config itself if available,
      // or using a more robust way to merge rules.
      // Given your error, let's try this alternative:
      ...pluginVue.configs["vue3-recommended"]?.rules, // Add optional chaining just in case
      // Or, if pluginVue.configs['vue3-recommended'] is undefined, this is the root cause.
      // If the above still fails, it means the structure 'configs["vue3-recommended"]' isn't valid for this plugin version under ESLint 9.
      // In that case, you might need to manually add the rules.

      // Custom Vue/JS rules
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "no-unused-vars": "warn",
    },
  },
];
