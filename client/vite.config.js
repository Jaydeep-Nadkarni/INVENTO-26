import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb'],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '*.trycloudflare.com',
      'father-april-nursery-mouth.trycloudflare.com'
    ],
    // Proxy for Cloudflare tunneling and API routes
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Vercel routing configuration
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'qr-vendor': ['qrcode.react']
        }
      }
    }
  },
  // SPA routing for Vercel
  preview: {
    port: 3000,
    host: true
  }
})
