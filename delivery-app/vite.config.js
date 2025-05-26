import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true // 👈 fuerza el uso de PWA en dev 
      },
      manifest: {
        name: 'Victorina Pasteleria APP',
        short_name: 'Victorina APP',
        start_url: '/',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        background_color: '#000000',
        theme_color: '#FF0000',
        icons: [
            {
            // Mínimo requerido para ser instalable en escritorio
            src: 'pwa-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            //192x192 para el acceso rápido o launcher
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            //512x512 para pantalla de instalación, la pantalla de inicio y la tienda
            src: 'logoApp.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          new RegExp('^/assets/'),
          new RegExp('/[^/?]+\\.[^/]+$'),
        ],
        skipWaiting:true,
        clientsClaim:true
      },
      
    })
  ],
  resolve:{
    alias:{
      '@components':path.resolve(__dirname,'src/components'),
      '@pages':path.resolve(__dirname,'src/pages'),
      '@context':path.resolve(__dirname,'src/context')


    }
  },
  server:{
    allowedHosts:['b6d9-181-230-65-50.ngrok-free.app']
    //o directamente le pado a allowedHost:'all'
  }
})
