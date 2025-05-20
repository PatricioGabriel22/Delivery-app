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
      registerType: 'autoUpdate',
      manifest: {
        name: 'Victorina Pasteleria APP',
        short_name: 'Victorina APP',
        start_url: '/',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        background_color: '#000000',
        theme_color: '#FF0000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
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
