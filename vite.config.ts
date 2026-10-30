import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// base './' → la app funciona bajo cualquier subruta (GitHub Pages, dominio propio, etc.)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Método Estudio',
        short_name: 'Mét. Estudio',
        description:
          'Descubrí cómo estudiás mejor: autoperfil, técnicas y herramientas para practicar — en tu dispositivo, sin cuentas.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#bd392c',
        theme_color: '#bd392c',
        orientation: 'portrait-primary',
        lang: 'es-AR',
        icons: [
          { src: './pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: './pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: './pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precachea el shell de la app para que abra sin conexión; los datos
        // viven en localStorage, no hay llamadas de red que cachear aparte.
        globPatterns: ['**/*.{js,css,html,png,webp,svg,woff,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          data: ['@tanstack/react-query', 'zustand', 'date-fns'],
        },
      },
    },
  },
})
