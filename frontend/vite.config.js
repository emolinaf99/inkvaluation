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
      // Rutas de autenticación al backend local
      '^/api/auth/.*': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      
      // Ruta de usuario general al backend local
      '^/api/user/.*': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
       
      // Inscripción al backend local
      '^/inscripcion': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      
      // Todas las demás rutas /api van al microservicio externo
      '^/api/.*': {
        target: 'http://217.196.61.73:8082',
        changeOrigin: true,
        secure: false
      },
      
      '^/images/.*': {
        target: 'http://217.196.61.73:8082',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
