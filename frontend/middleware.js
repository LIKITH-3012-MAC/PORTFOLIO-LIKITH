import { generateImageViewerHtml } from './src/utils/imageViewerTemplate.js';

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|gif|svg|avif|ico)$/i;

// Excluded favicon/icon files so viewer template itself can load icons cleanly
const EXCLUDED_BRAND_ICONS = new Set(['/favicon.png', '/favicon.ico', '/apple-touch-icon.png']);

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Skip if raw parameter is explicitly passed
  if (url.searchParams.get('raw') === 'true' || url.searchParams.get('raw') === '1') {
    return;
  }

  // 2. Skip brand icons
  if (EXCLUDED_BRAND_ICONS.has(pathname)) {
    return;
  }

  // 3. Target image namespace / extensions
  const isImagePath = pathname.startsWith('/images/') || IMAGE_EXT_REGEX.test(pathname);
  if (!isImagePath) {
    return;
  }

  // 4. Request header content negotiation
  const secFetchDest = request.headers.get('sec-fetch-dest');
  const acceptHeader = request.headers.get('accept') || '';

  // Explicit embedded resource request -> serve raw image binary
  if (secFetchDest === 'image' || secFetchDest === 'style' || secFetchDest === 'script' || secFetchDest === 'worker' || secFetchDest === 'font') {
    return;
  }

  // Direct browser navigation -> serve HTML Image Viewer with favicon
  const isDirectNavigation = secFetchDest === 'document' || (acceptHeader.includes('text/html') && !acceptHeader.startsWith('image/'));

  if (isDirectNavigation) {
    const html = generateImageViewerHtml(pathname);
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-image-viewer': 'true'
      }
    });
  }

  return;
}

export const config = {
  matcher: [
    '/images/:path*',
    '/((?:[^/]+/)*[^/]+\\.(?:jpg|jpeg|png|webp|gif|svg|avif|ico))'
  ]
};
