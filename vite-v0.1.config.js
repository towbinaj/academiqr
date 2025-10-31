import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  esbuild: {
    // Use the full path to node.exe
    platform: 'node'
  }
})
