// eslint.config.js
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import vueParser from "vue-eslint-parser"; // Neuen Parser importieren

export default [
  // Grundlegende ESLint-Regeln
  eslint.configs.recommended,

  // Vue-spezifische Konfiguration
  {
    files: ["**/*.vue", "**/*.js"], // Wichtiger Hinweis: Dateitypen festlegen!
    languageOptions: {
      globals: {
        ...globals.browser,
        // Optional: Wenn du Node.js-APIs im Browser verwendest
        // ...globals.node,
      },
      parser: vueParser, // Verwende den Vue-Parser für Vue-Dateien
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue: pluginVue,
      prettier: prettierPlugin, // Prettier als Plugin hinzufügen
    },
    rules: {
      // Vue-spezifische empfohlene Regeln
      ...pluginVue.configs["vue3-recommended"].rules, // Oder 'vue3-essential'
      // Zusätzliche Prettier-Regeln (durch das Plugin)
      ...prettierConfig.rules,
      "prettier/prettier": "error", // Zeigt Prettier-Fehler als ESLint-Fehler an

      // Deine eigenen oder überschriebenen Regeln
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "no-unused-vars": "warn", // Beispiel: Nicht verwendete Variablen warnen
    },
  },
  {
    // Konfiguration für JavaScript-Dateien außerhalb von Vue-Komponenten
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Deine JS-spezifischen Regeln hier
    },
  },
];
