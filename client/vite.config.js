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
      'vegas-ebony-phenomenon-eugene.trycloudflare.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})
