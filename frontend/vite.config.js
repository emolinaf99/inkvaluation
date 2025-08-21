import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'http://217.196.61.73:8082',  // redirige solicitudes /api al backend local
      '/images': 'http://217.196.61.73:8082'  // redirige solicitudes /images al backend local
    }
  }
})
