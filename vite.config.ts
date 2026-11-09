
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',

      includeAssets: [
        'icons/app-icon-gold-192.png',
        'icons/app-icon-gold-512.png',
        'icons/apple-touch-icon-gold.png',
        'images/**/*',
      ],

      manifest: {
        id: '/',
        name: 'Manisha Properties',
        short_name: 'Manisha Properties',
        description: 'Explore properties and real estate services from Manisha Properties.',
        theme_color: '#0A0805',
        background_color: '#0A0805',
        display_override: ['window-controls-overlay', 'standalone'],
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/app-icon-gold-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/app-icon-gold-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif}',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        // Workbox matches the pathname and query string together.
        navigateFallbackAllowlist: [
          /^\/(?:\?.*)?$/,
          /^\/(?:about|videos|privacy|install)\/?(?:\?.*)?$/,
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
