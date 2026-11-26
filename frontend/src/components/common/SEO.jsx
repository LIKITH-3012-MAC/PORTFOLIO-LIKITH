import { useEffect } from 'react';

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

export const SEO = ({ title, description, keywords, canonical, image }) => {
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

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonical) {
      canonicalLink.setAttribute('href', canonical);
    }

    // Update page-specific Open Graph / Twitter image
    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('property', 'og:image:secure_url', image);
      upsertMeta('name', 'twitter:image', image);

      const isPng = image.endsWith('.png');
      upsertMeta('property', 'og:image:type', isPng ? 'image/png' : 'image/jpeg');

      // Map sizes
      if (image.includes('likith-naidu-anumakonda-profile.png')) {
        upsertMeta('property', 'og:image:width', '1672');
        upsertMeta('property', 'og:image:height', '941');
      } else if (image.includes('likith-naidu-anumakonda-portrait.png')) {
        upsertMeta('property', 'og:image:width', '1184');
        upsertMeta('property', 'og:image:height', '864');
      } else if (image.includes('likith-anumakonda-portrait.jpeg')) {
        upsertMeta('property', 'og:image:width', '1227');
        upsertMeta('property', 'og:image:height', '685');
      } else if (image.includes('likith-anumakonda-profile-photo.jpeg')) {
        upsertMeta('property', 'og:image:width', '2752');
        upsertMeta('property', 'og:image:height', '1536');
      }
    }
  }, [title, description, keywords, canonical, image]);

  return null;
};

export default SEO;
