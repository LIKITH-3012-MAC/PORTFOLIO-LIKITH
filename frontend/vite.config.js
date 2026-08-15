import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateImageViewerHtml } from './src/utils/imageViewerTemplate.js';

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|gif|svg|avif|ico)$/i;
const EXCLUDED_BRAND_ICONS = new Set(['/favicon.png', '/favicon.ico', '/apple-touch-icon.png']);

function imageViewerPlugin() {
  return {
    name: 'vite-plugin-global-image-viewer',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || '';
        const urlObj = new URL(rawUrl, 'http://localhost');
        const pathname = urlObj.pathname;

        if (urlObj.searchParams.get('raw') === 'true' || urlObj.searchParams.get('raw') === '1') {
          return next();
        }

        if (EXCLUDED_BRAND_ICONS.has(pathname)) {
          return next();
        }

        const isImagePath = pathname.startsWith('/images/') || IMAGE_EXT_REGEX.test(pathname);
        if (!isImagePath) {
          return next();
        }

        const secFetchDest = req.headers['sec-fetch-dest'];
        const acceptHeader = req.headers['accept'] || '';

        if (secFetchDest === 'image' || secFetchDest === 'style' || secFetchDest === 'script' || secFetchDest === 'worker' || secFetchDest === 'font') {
          return next();
        }

        const isDirectNavigation = secFetchDest === 'document' || (acceptHeader.includes('text/html') && !acceptHeader.startsWith('image/'));

        if (isDirectNavigation) {
          const html = generateImageViewerHtml(pathname);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          return res.end(html);
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imageViewerPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'gsap'],
          react: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});

