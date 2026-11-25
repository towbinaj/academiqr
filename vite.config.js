import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        dashboard: resolve(import.meta.dirname, 'src/pages/dashboard.html'),
        editor: resolve(import.meta.dirname, 'src/pages/editor.html'),
        library: resolve(import.meta.dirname, 'src/pages/library.html'),
        profile: resolve(import.meta.dirname, 'src/pages/profile.html'),
        public: resolve(import.meta.dirname, 'public.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        terms: resolve(import.meta.dirname, 'terms.html')
      }
    }
  }
})
