import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
            },
        },
        // base: '',
        plugins: [vue()],
        optimizeDeps: {
            exclude: ['pdfjs-dist'],
            esbuildOptions: {
                supported: { 'top-level-await': true },
            },
        },
        build: {
            rollupOptions: {
                external: ['pdfjs-dist']  // This also prevents pdfjs-dist from being bundled
            }
        }
    },
})
