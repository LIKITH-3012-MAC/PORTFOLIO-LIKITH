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
      max-width: 50vw;
      text-align: center;
    }

    .header-spacer {
      width: 140px;
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
    }

    .image-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      max-height: 100%;
    }

    .viewer-image {
      max-width: 88vw;
      max-height: 78vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    /* Bottom Info Bar */
    footer {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0.6rem 1.25rem;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }

    .shortcut-legend {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .header-title {
        display: none;
      }
      .header-spacer {
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

    <div class="header-spacer"></div>
  </header>

  <main>
    <div class="image-container">
      <img src="${rawPath}" alt="${title}" class="viewer-image" />
    </div>
  </main>

  <footer>
    <div class="shortcut-legend">
      <span><kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">Esc</kbd> Home</span>
    </div>
  </footer>

  <script>
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.location.href = '/';
      }
    });
  </script>
</body>
</html>`;
}
