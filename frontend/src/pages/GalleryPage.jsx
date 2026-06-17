import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { fadeUp, staggerContainer, staggerChild, modalTransition } from '../motion/variants';

/* ═══════════════════════════════════════════════════════════
   Gallery Data — each entry describes one photograph
   ═══════════════════════════════════════════════════════════ */
const likithGallery = [
  {
    src: '/images/likith/likith-naidu-anumakonda.jpeg',
    alt: 'Likith Naidu Anumakonda — black and white close-up portrait wearing glasses',
    title: 'Likith Naidu Anumakonda',
    caption: 'Likith Naidu Anumakonda — close-up portrait.',
    width: 3072,
    height: 4096,
    priority: true,
  },
  {
    src: '/images/likith/likith-naidu-anumakonda-profile.png',
    alt: 'Likith Naidu Anumakonda in a suit standing in front of an institutional building',
    title: 'Likith Naidu Anumakonda — Professional Profile',
    caption: 'Likith Naidu Anumakonda in formal attire at a campus.',
    width: 1672,
    height: 941,
  },
  {
    src: '/images/likith/likith-naidu-anumakonda-portrait.png',
    alt: 'Likith Naidu Anumakonda — stylized editorial portrait with purple backdrop',
    title: 'Likith Naidu Anumakonda — Editorial Portrait',
    caption: 'Stylized editorial portrait of Likith Naidu Anumakonda.',
    width: 1184,
    height: 864,
  },
  {
    src: '/images/likith/likith-naidu-anumakonda-professional.jpeg',
    alt: 'Likith Naidu Anumakonda in a blazer on a rooftop with city skyline',
    title: 'Likith Naidu Anumakonda — Rooftop Portrait',
    caption: 'Likith Naidu Anumakonda on a rooftop overlooking the city.',
    width: 1440,
    height: 1440,
  },
  {
    src: '/images/likith/likith-anumakonda-profile-photo.jpeg',
    alt: 'Likith Anumakonda in a blazer against a hillside cityscape',
    title: 'Likith Anumakonda — Outdoor Portrait',
    caption: 'Likith Anumakonda in formal wear with a panoramic backdrop.',
    width: 2752,
    height: 1536,
  },
  {
    src: '/images/likith/likith-anumakonda-professional-photo.jpeg',
    alt: 'Likith Anumakonda wearing a blazer and blue shirt on a rooftop terrace',
    title: 'Likith Anumakonda — Terrace Portrait',
    caption: 'Likith Anumakonda on a terrace with the city skyline behind.',
    width: 2752,
    height: 1536,
  },
  {
    src: '/images/likith/likith-anumakonda-portrait.jpeg',
    alt: 'Likith Anumakonda at the beach with ocean waves',
    title: 'Likith Anumakonda — By the Sea',
    caption: 'Likith Anumakonda by the ocean.',
    width: 1227,
    height: 685,
  },
  {
    src: '/images/likith/likith-naidu-anumakonda-casual-photo.jpeg',
    alt: 'Likith Naidu Anumakonda — candid indoor shot with sunglasses',
    title: 'Likith Naidu Anumakonda — Candid',
    caption: 'Candid photograph of Likith Naidu Anumakonda.',
    width: 1280,
    height: 720,
  },
  {
    src: '/images/likith/likith-anumakonda-personal-portrait.jpeg',
    alt: 'Likith Anumakonda — monochrome rooftop portrait in blazer',
    title: 'Likith Anumakonda — Monochrome Portrait',
    caption: 'Monochrome portrait of Likith Anumakonda.',
    width: 1440,
    height: 1440,
  },
];

/* ═══════════════════════════════════════════════════════════
   JSON-LD Structured Data
   ═══════════════════════════════════════════════════════════ */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Likith Naidu Anumamkonda',
    alternateName: 'Likith Anumakonda',
    url: 'https://likith-portfolio.online/',
    image: [
      'https://likith-portfolio.online/images/likith/likith-naidu-anumakonda.jpeg',
      'https://likith-portfolio.online/images/likith/likith-naidu-anumakonda-profile.png',
      'https://likith-portfolio.online/images/likith/likith-naidu-anumakonda-portrait.png',
    ],
    sameAs: [
      'https://github.com/LIKITH-3012-MAC',
      'https://www.linkedin.com/in/likith-naidu-anumakonda/',
      'https://x.com/Likithdob301206',
      'https://www.instagram.com/likhith_anumakonda',
      'https://youtube.com/@LIKITH_NAIDU_ANUMAKONDA',
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   Open Graph + Twitter meta tag definitions
   ═══════════════════════════════════════════════════════════ */
const OG_TITLE = 'Likith Naidu Anumakonda — Official Photo Gallery';
const OG_DESCRIPTION = 'Official gallery of Likith Naidu Anumakonda.';
const OG_URL = 'https://likith-portfolio.online/gallery';
const OG_IMAGE = 'https://likith-portfolio.online/images/likith/likith-naidu-anumakonda-profile.png';

const META_TAGS = [
  { property: 'og:title', content: OG_TITLE },
  { property: 'og:description', content: OG_DESCRIPTION },
  { property: 'og:url', content: OG_URL },
  { property: 'og:type', content: 'profile' },
  { property: 'og:image', content: OG_IMAGE },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: OG_TITLE },
  { name: 'twitter:description', content: OG_DESCRIPTION },
  { name: 'twitter:image', content: OG_IMAGE },
];

/* ═══════════════════════════════════════════════════════════
   Helper — upsert or create a <meta> tag on document.head
   ═══════════════════════════════════════════════════════════ */
function upsertMeta(attr, value, content) {
  const selector = `meta[${attr}="${value}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

/* ═══════════════════════════════════════════════════════════
   GalleryPage Component
   ═══════════════════════════════════════════════════════════ */
export const GalleryPage = () => {
  /* ── Lightbox state ─────────────────────────────────── */
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isLightboxOpen = lightboxIndex !== null;
  const triggerRef = useRef(null);        // element that opened the lightbox
  const closeBtnRef = useRef(null);       // close button inside lightbox
  const lightboxRef = useRef(null);       // lightbox container for focus trap

  /* ── Open Graph & Twitter meta tags (useEffect) ──────── */
  useEffect(() => {
    const created = [];

    META_TAGS.forEach(({ property, name, content }) => {
      if (property) {
        created.push(upsertMeta('property', property, content));
      }
      if (name) {
        created.push(upsertMeta('name', name, content));
      }
    });

    return () => {
      created.forEach((el) => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  /* ── JSON-LD structured data ─────────────────────────── */
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(STRUCTURED_DATA);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /* ── Lightbox navigation helpers ─────────────────────── */
  const openLightbox = useCallback((index, triggerElement) => {
    triggerRef.current = triggerElement;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    // Restore focus to the trigger element
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? likithGallery.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === likithGallery.length - 1 ? 0 : i + 1));
  }, []);

  /* ── Keyboard handling (Escape, Arrow keys) ──────────── */
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goPrev, goNext]);

  /* ── Focus trap — keep focus inside lightbox ─────────── */
  useEffect(() => {
    if (!isLightboxOpen) return;

    // Auto-focus close button on open
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const container = lightboxRef.current;
    if (!container) return;

    const handleTrap = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTrap);
    return () => document.removeEventListener('keydown', handleTrap);
  }, [isLightboxOpen]);

  /* ── Lock body scroll when lightbox is open ──────────── */
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLightboxOpen]);

  /* ── Active lightbox image ──────────────────────────── */
  const activeImage = isLightboxOpen ? likithGallery[lightboxIndex] : null;

  /* ═══════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════ */
  return (
    <>
      <SEO
        title="Photo Gallery | Likith Naidu Anumakonda"
        description="Official photo gallery of Likith Naidu Anumakonda — portraits, professional shots, and candid photography."
        keywords="Likith Naidu Anumakonda, photo gallery, portraits, professional photography, Likith Anumakonda"
        canonical="https://likith-portfolio.online/gallery"
      />

      {/* ──────────── Page Content ──────────── */}
      <main className="min-h-screen pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Back link */}
          <Link
            to="/?source=nav"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          {/* Page header */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">Visual Archive</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Photo <br /><span className="text-gradient">Gallery.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
              A curated collection of portraits and professional photographs of Likith Naidu Anumakonda.
            </p>
          </motion.header>

          {/* Gallery Grid */}
          <section aria-labelledby="likith-gallery-heading">
            <h2
              id="likith-gallery-heading"
              className="sr-only"
            >
              Photographs of Likith Naidu Anumakonda
            </h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {likithGallery.map((image, index) => (
                <motion.figure
                  key={image.src}
                  variants={staggerChild}
                  className="glass-panel rounded-2xl overflow-hidden group cursor-pointer focus-within:ring-2 focus-within:ring-amber-400/50"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <button
                    type="button"
                    onClick={(e) => openLightbox(index, e.currentTarget)}
                    className="relative block w-full h-full focus:outline-none"
                    aria-label={`View full image: ${image.title}`}
                  >
                    {/* Aspect-ratio container */}
                    <div
                      className="relative w-full h-0 overflow-hidden"
                      style={{ paddingBottom: `${(image.height / image.width) * 100}%` }}
                    >
                      <picture>
                        <img
                          src={image.src}
                          alt={image.alt}
                          title={image.title}
                          width={image.width}
                          height={image.height}
                          loading={image.priority ? 'eager' : 'lazy'}
                          fetchpriority={image.priority ? 'high' : undefined}
                          decoding={image.priority ? undefined : 'async'}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                      </picture>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Hover caption preview */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                          {String(index + 1).padStart(2, '0')} / {String(likithGallery.length).padStart(2, '0')}
                        </span>
                        <span className="text-white text-sm font-display font-semibold block leading-tight">
                          {image.title}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Figcaption — always in DOM for SEO */}
                  <figcaption className="px-5 py-4 border-t border-white/5">
                    <span className="text-sm text-slate-400 font-sans leading-relaxed">
                      {image.caption}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </section>
        </div>
      </main>

      {/* ──────────── Lightbox Modal ──────────── */}
      <AnimatePresence>
        {isLightboxOpen && activeImage && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Lightbox: ${activeImage.title}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.25 } },
              exit: { opacity: 0, transition: { duration: 0.2 } },
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={closeLightbox}
              aria-hidden="true"
            />

            {/* Content container */}
            <motion.div
              variants={modalTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 flex flex-col items-center max-w-[90vw] max-h-[90vh]"
            >
              {/* Close button */}
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="absolute -top-12 right-0 md:top-0 md:-right-14 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl"
              />

              {/* Title & Caption below image */}
              <div className="mt-5 text-center max-w-xl px-4">
                <h3 className="text-white font-display font-semibold text-lg mb-1">
                  {activeImage.title}
                </h3>
                <p className="text-slate-400 text-sm font-sans">
                  {activeImage.caption}
                </p>
                <span className="text-[10px] font-mono text-slate-600 mt-2 block">
                  {lightboxIndex + 1} / {likithGallery.length}
                </span>
              </div>
            </motion.div>

            {/* Previous button */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
