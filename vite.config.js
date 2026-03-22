import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 3000,
    open: true,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
        editor: resolve(__dirname, 'src/pages/editor.html'),
        library: resolve(__dirname, 'src/pages/library.html'),
        profile: resolve(__dirname, 'src/pages/profile.html'),
        public: resolve(__dirname, 'public.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html')
      }
    }
  }
})
