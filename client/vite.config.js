import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    assetsInclude: ['**/*.glb'],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      allowedHosts: true,
      host: true,
      // Proxy for Cloudflare tunneling and API routes
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    // Vercel routing configuration
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('framer-motion') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              if (id.includes('qrcode')) {
                return 'qr-vendor';
              }
            }
          }
        }
      }
    },
    // SPA routing for Vercel
    preview: {
      port: 3000,
      host: true
    }
  }
})
