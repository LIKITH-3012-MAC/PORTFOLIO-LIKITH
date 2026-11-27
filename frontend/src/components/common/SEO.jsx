import { useEffect } from 'react';

const SITE_URL = 'https://likith-naidu-anumakonda.online';

const IMAGE_DIMENSIONS = {
  'likith-naidu-anumakonda-profile.png': { width: '1672', height: '941', type: 'image/png' },
  'likith-naidu-anumakonda-portrait.png': { width: '1184', height: '864', type: 'image/png' },
  'likith-anumakonda-portrait.jpeg': { width: '1227', height: '685', type: 'image/jpeg' },
  'likith-anumakonda-profile-photo.jpeg': { width: '2752', height: '1536', type: 'image/jpeg' },
  'likith-anumakonda-professional-photo.jpeg': { width: '2752', height: '1536', type: 'image/jpeg' },
  'piano-studio-hero.jpg': { width: '1376', height: '768', type: 'image/jpeg' },
  'likith-naidu-anumakonda-beach-blazer-monochrome.jpg': { width: '1600', height: '901', type: 'image/jpeg' },
  'likith-naidu-anumakonda-beach-blazer-portrait.jpg': { width: '1600', height: '901', type: 'image/jpeg' },
};

const upsertMeta = (attrName, attrValue, content) => {
  if (!content) return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const resolveAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  image,
  imageAlt,
  robots = 'index, follow',
  meta = [],
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta('property', 'og:title', title);
      upsertMeta('name', 'twitter:title', title);
    }

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }

    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    // Resolve robots directive (explicit prop or meta array fallback)
    const robotsMetaEntry = Array.isArray(meta)
      ? meta.find((entry) => entry?.name === 'robots' && entry?.content)
      : null;
    upsertMeta('name', 'robots', robotsMetaEntry?.content || robots);

    // Support any additional meta entries if provided
    if (Array.isArray(meta)) {
      meta.forEach((entry) => {
        if (entry?.name && entry?.content && entry.name !== 'robots') {
          upsertMeta('name', entry.name, entry.content);
        } else if (entry?.property && entry?.content) {
          upsertMeta('property', entry.property, entry.content);
        }
      });
    }

    // Manage canonical link & og:url / twitter:url
    const resolvedCanonical = resolveAbsoluteUrl(canonical);
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (resolvedCanonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', resolvedCanonical);
      upsertMeta('property', 'og:url', resolvedCanonical);
      upsertMeta('name', 'twitter:url', resolvedCanonical);
    } else {
      if (canonicalLink) {
        canonicalLink.remove();
      }
      if (typeof window !== 'undefined') {
        const currentUrl = `${SITE_URL}${window.location.pathname}`;
        upsertMeta('property', 'og:url', currentUrl);
        upsertMeta('name', 'twitter:url', currentUrl);
      }
    }

    // Update page-specific Open Graph / Twitter image
    const resolvedImage = resolveAbsoluteUrl(image);
    if (resolvedImage) {
      upsertMeta('property', 'og:image', resolvedImage);
      upsertMeta('property', 'og:image:secure_url', resolvedImage);
      upsertMeta('name', 'twitter:image', resolvedImage);

      if (imageAlt) {
        upsertMeta('property', 'og:image:alt', imageAlt);
        upsertMeta('name', 'twitter:image:alt', imageAlt);
      }

      const matchedEntry = Object.entries(IMAGE_DIMENSIONS).find(([fileKey]) =>
        resolvedImage.includes(fileKey)
      );
      if (matchedEntry) {
        const [, dims] = matchedEntry;
        upsertMeta('property', 'og:image:type', dims.type);
        upsertMeta('property', 'og:image:width', dims.width);
        upsertMeta('property', 'og:image:height', dims.height);
      } else {
        const isPng = resolvedImage.toLowerCase().endsWith('.png');
        upsertMeta('property', 'og:image:type', isPng ? 'image/png' : 'image/jpeg');
      }
    }
  }, [title, description, keywords, canonical, image, imageAlt, robots, meta]);

  return null;
};

export default SEO;
