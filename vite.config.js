import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        visualizer({
            open: true,
            filename: 'stats.html',
            gzipSize: true,
            brotliSize: true,
        })
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url)),
            },
        ],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue', 'vue-i18n', 'vue-router', 'pinia'],
                    libraries: [
                        'bootstrap',
                        '@popperjs/core',
                        "@fortawesome/fontawesome-svg-core",
                        "@fortawesome/free-brands-svg-icons",
                        "@fortawesome/free-regular-svg-icons",
                        "@fortawesome/free-solid-svg-icons",
                        "@fortawesome/vue-fontawesome",
                        'localforage',
                        'sweetalert2',
                        'toastify-js'
                    ],
                },
            },
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                ],
            },
        },
    },
    base: process.env.NODE_ENV === 'production' ? '/gothic-tales/' : '',
});
