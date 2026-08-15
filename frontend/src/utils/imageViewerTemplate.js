/**
 * Formats an image URL path into a human-readable, clean document title.
 * Example: '/images/likith/likith-anumakonda-professional-photo.jpeg' 
 *       -> 'Likith Anumakonda — Professional Photo'
 * Example: '/images/projects/ai-dashboard.webp'
 *       -> 'Ai Dashboard'
 */
export function formatImageTitle(pathname) {
  if (!pathname) return 'Image Viewer | Likith Naidu Portfolio';
  
  // Extract trailing filename
  const filename = pathname.split('/').pop() || '';
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  if (!nameWithoutExt) return 'Image Viewer | Likith Naidu Portfolio';
  
  // Convert hyphens and underscores to spaces
  let words = nameWithoutExt.split(/[-_]+/).filter(Boolean);
  
  // Capitalize words
  words = words.map(word => {
    // Keep acronyms uppercase if short (e.g. AI, ML, API, UI, UX, ID)
    const upper = word.toUpperCase();
    if (['AI', 'ML', 'API', 'UI', 'UX', 'ID', 'PDF', 'PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'].includes(upper)) {
      return upper;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  let formattedName = words.join(' ');

  // Standardized formatting for personal profile photos
  if (formattedName.toLowerCase().startsWith('likith anumakonda')) {
    const rest = formattedName.slice('likith anumakonda'.length).trim();
    return rest ? `Likith Anumakonda — ${rest}` : 'Likith Anumakonda';
  }
  if (formattedName.toLowerCase().startsWith('likith naidu anumakonda')) {
    const rest = formattedName.slice('likith naidu anumakonda'.length).trim();
    return rest ? `Likith Naidu Anumakonda — ${rest}` : 'Likith Naidu Anumakonda';
  }
  
  return `${formattedName} | Likith Naidu Portfolio`;
}

/**
 * Generates the full HTML Image Viewer shell response string.
 * @param {string} imagePath - Relative path of the requested image (e.g. '/images/likith/photo.jpeg')
 */
export function generateImageViewerHtml(imagePath) {
  // Sanitize path against injection
  const safePath = String(imagePath).replace(/"/g, '&quot;');
  const title = formatImageTitle(safePath);
  const rawPath = safePath.includes('?') ? `${safePath}&raw=true` : `${safePath}?raw=true`;
  const filename = safePath.split('/').pop()?.split('?')[0] || 'image';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  
  <!-- Global Favicon System -->
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Meta & Robots -->
  <meta name="robots" content="noindex, follow" />
  <meta name="theme-color" content="#070a12" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #070a12;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* Subtle radial glow background */
    .bg-glow {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.08), transparent 70%),
                  radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05), transparent 50%);
      z-index: 0;
    }

    /* Top Navigation Header */
    header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      height: 60px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #94a3b8;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .brand:hover {
      color: #38bdf8;
    }

    .brand-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }

    .header-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 40vw;
      text-align: center;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.4rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: #cbd5e1;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn:hover {
      background: rgba(51, 65, 85, 0.9);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-primary {
      background: #2563eb;
      color: #ffffff;
      border-color: #3b82f6;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      border-color: #60a5fa;
    }

    /* Main Viewport */
    main {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow: auto;
      cursor: grab;
    }

    main:active {
      cursor: grabbing;
    }

    .image-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      max-height: 100%;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .viewer-image {
      max-width: 88vw;
      max-height: 78vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
      transition: box-shadow 0.2s ease;
    }

    /* Bottom Info Bar */
    footer {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1.25rem;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.15rem 0.4rem;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      color: #94a3b8;
    }

    .shortcut-legend {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .header-title {
        display: none;
      }
      .shortcut-legend {
        display: none;
      }
      footer {
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="bg-glow"></div>

  <header>
    <a href="/" class="brand" title="Return to Portfolio">
      <img src="/favicon.png" alt="Favicon" class="brand-icon" />
      <span>Likith Naidu Portfolio</span>
    </a>

    <div class="header-title">${title}</div>

    <div class="actions">
      <button id="zoomBtn" class="btn" title="Toggle Zoom (Z)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <span>Zoom</span>
      </button>

      <a href="${rawPath}" target="_blank" class="btn" title="View Direct Raw Image Binary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span>Raw Image</span>
      </a>

      <a href="${rawPath}" download="${filename}" class="btn btn-primary" title="Download Image (D)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Download</span>
      </a>
    </div>
  </header>

  <main id="mainViewport">
    <div class="image-container" id="imgContainer">
      <img src="${rawPath}" alt="${title}" class="viewer-image" id="viewerImg" />
    </div>
  </main>

  <footer>
    <div class="info-item">
      <span class="badge" id="dimBadge">Loading dimensions...</span>
      <span class="badge">${safePath}</span>
    </div>

    <div class="shortcut-legend">
      <span><kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">Z</kbd> Zoom</span>
      <span><kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">Esc</kbd> Home</span>
      <span><kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">D</kbd> Download</span>
    </div>
  </footer>

  <script>
    (function() {
      const img = document.getElementById('viewerImg');
      const container = document.getElementById('imgContainer');
      const dimBadge = document.getElementById('dimBadge');
      const zoomBtn = document.getElementById('zoomBtn');
      let isZoomed = false;

      function updateDimensions() {
        if (img.naturalWidth && img.naturalHeight) {
          dimBadge.textContent = img.naturalWidth + ' × ' + img.naturalHeight + ' px';
        }
      }

      if (img.complete) {
        updateDimensions();
      } else {
        img.addEventListener('load', updateDimensions);
      }

      function toggleZoom() {
        isZoomed = !isZoomed;
        if (isZoomed) {
          container.style.transform = 'scale(1.75)';
          container.style.cursor = 'zoom-out';
          img.style.maxHeight = 'none';
          img.style.maxWidth = 'none';
        } else {
          container.style.transform = 'scale(1)';
          container.style.cursor = 'grab';
          img.style.maxHeight = '78vh';
          img.style.maxWidth = '88vw';
        }
      }

      zoomBtn.addEventListener('click', toggleZoom);
      img.addEventListener('click', toggleZoom);

      document.addEventListener('keydown', function(e) {
        if (e.key === 'z' || e.key === 'Z') {
          toggleZoom();
        } else if (e.key === 'Escape') {
          window.location.href = '/';
        } else if (e.key === 'd' || e.key === 'D') {
          const downloadBtn = document.querySelector('a[download]');
          if (downloadBtn) downloadBtn.click();
        }
      });
    })();
  </script>
</body>
</html>`;
}
