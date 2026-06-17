import { useEffect } from 'react';

export const SEO = ({ title, description, keywords, canonical, image }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    if (keywords) {
      metaKeywords.setAttribute('content', keywords);
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
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', image);

      let ogImageSecure = document.querySelector('meta[property="og:image:secure_url"]');
      if (!ogImageSecure) {
        ogImageSecure = document.createElement('meta');
        ogImageSecure.setAttribute('property', 'og:image:secure_url');
        document.head.appendChild(ogImageSecure);
      }
      ogImageSecure.setAttribute('content', image);

      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', image);

      // Set explicit type and dimensions if it's png vs jpeg
      let ogImageType = document.querySelector('meta[property="og:image:type"]');
      if (!ogImageType) {
        ogImageType = document.createElement('meta');
        ogImageType.setAttribute('property', 'og:image:type');
        document.head.appendChild(ogImageType);
      }
      const isPng = image.endsWith('.png');
      ogImageType.setAttribute('content', isPng ? 'image/png' : 'image/jpeg');
      
      let ogImageWidth = document.querySelector('meta[property="og:image:width"]');
      if (!ogImageWidth) {
        ogImageWidth = document.createElement('meta');
        ogImageWidth.setAttribute('property', 'og:image:width');
        document.head.appendChild(ogImageWidth);
      }
      let ogImageHeight = document.querySelector('meta[property="og:image:height"]');
      if (!ogImageHeight) {
        ogImageHeight = document.createElement('meta');
        ogImageHeight.setAttribute('property', 'og:image:height');
        document.head.appendChild(ogImageHeight);
      }

      // Map sizes
      if (image.includes('likith-naidu-anumakonda-profile.png')) {
        ogImageWidth.setAttribute('content', '1672');
        ogImageHeight.setAttribute('content', '941');
      } else if (image.includes('likith-naidu-anumakonda-portrait.png')) {
        ogImageWidth.setAttribute('content', '1184');
        ogImageHeight.setAttribute('content', '864');
      } else if (image.includes('likith-anumakonda-portrait.jpeg')) {
        ogImageWidth.setAttribute('content', '1227');
        ogImageHeight.setAttribute('content', '685');
      } else if (image.includes('likith-anumakonda-profile-photo.jpeg')) {
        ogImageWidth.setAttribute('content', '2752');
        ogImageHeight.setAttribute('content', '1536');
      }
    }
  }, [title, description, keywords, canonical, image]);

  return null;
};

export default SEO;
