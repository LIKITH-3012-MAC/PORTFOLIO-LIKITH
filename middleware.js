import { generateImageViewerHtml } from './frontend/src/utils/imageViewerTemplate.js';

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|gif|svg|avif|ico)$/i;
const EXCLUDED_BRAND_ICONS = new Set(['/favicon.png', '/favicon.ico', '/apple-touch-icon.png']);

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (url.searchParams.get('raw') === 'true' || url.searchParams.get('raw') === '1') {
    return;
  }

  if (EXCLUDED_BRAND_ICONS.has(pathname)) {
    return;
  }

  const isImagePath = pathname.startsWith('/images/') || IMAGE_EXT_REGEX.test(pathname);
  if (!isImagePath) {
    return;
  }

  const secFetchDest = request.headers.get('sec-fetch-dest');
  const acceptHeader = request.headers.get('accept') || '';

  if (secFetchDest === 'image' || secFetchDest === 'style' || secFetchDest === 'script' || secFetchDest === 'worker' || secFetchDest === 'font') {
    return;
  }

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
