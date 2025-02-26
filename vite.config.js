import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    visualizer({
      open: true, // Automatisch im Browser öffnen
      filename: 'stats.html', // Name der Ausgabedatei
      gzipSize: true, // Gzip-Größe anzeigen
      brotliSize: true, // Brotli-Größe anzeigen
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-i18n', 'vue-router', 'pinia'],
          libraries: [
            'bootstrap',
            '@popperjs/core',
            '@fortawesome/fontawesome-free',
            '@fortawesome/fontawesome-free/js/all.min.js',
            'localforage',
            'sweetalert2',
            'toastify-js'
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/gothic-tales/' : '',
})
