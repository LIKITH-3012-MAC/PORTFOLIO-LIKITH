import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Piano, Headphones, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import { trackVisit } from '../services/analytics';
import { fadeUp } from '../motion/variants';
import VirtualPiano from '../components/piano/VirtualPiano';
import MusicPlayer from '../components/piano/MusicPlayer';
import InstagramCard from '../components/piano/InstagramCard';

const ABOUT_MUSIC_CONTENT = {
  eyebrow: "Creative Philosophy",
  heading: "Music is another language of creativity.",
  paragraphs: [
    "Writing code and playing the piano draw from the same quiet focus — structure, timing, dynamics, and patience. Where software engineering translates ideas into intelligent systems, the piano translates emotion into resonance.",
    "Likith's Piano Studio is a dedicated space to explore that intersection: sit at the keys, experiment with harmonies in real time, and experience melodies crafted beyond the terminal.",
  ],
};

export const PianoStudioPage = () => {
  useEffect(() => {
    trackVisit('/piano');
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: -96, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO
        title="Likith's Piano Studio | Where Code Meets Music"
        description="Likith's Piano Studio — a cinematic interactive music studio featuring a playable Web Audio virtual piano, studio music deck, and @pianopeaceby_lee."
        keywords="Likith Naidu Piano Studio, pianopeaceby_lee, Virtual Piano, Interactive Music Studio, Classical Piano"
        canonical="https://likith-portfolio.online/piano"
        image="https://likith-portfolio.online/images/piano-studio-hero.jpg"
      />

      <div className="min-h-screen text-slate-200 pb-28">
        {/* HERO SECTION */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          {/* Cinematic Piano Backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/piano-studio-hero.jpg"
              alt="Concert grand piano in midnight studio lighting"
              className="w-full h-full object-cover object-center opacity-35 scale-105"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/70 to-[#030712]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_65%)]" />
          </div>

          {/* Animated Atmospheric Orbs */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px]"
          />
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [1.05, 0.96, 1.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-500/12 blur-[130px]"
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
            {/* Back to Portfolio */}
            <Link
              to="/?source=piano"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 mb-10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="lg:col-span-7 space-y-7"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-slate-950/60 backdrop-blur-md">
                  <Piano className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.25em] uppercase">
                    Likith&apos;s Piano Studio
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight">
                  Where Code <br />
                  Meets <span className="text-amber-400 drop-shadow-[0_0_24px_rgba(251,191,36,0.3)]">Music.</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Beyond algorithms and creativity, there&apos;s a melody that speaks.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('virtual-piano')}
                    className="btn-premium inline-flex items-center gap-2.5 shadow-[0_0_35px_rgba(251,191,36,0.3)] cursor-pointer"
                  >
                    <Music className="w-4 h-4" />
                    <span>Enter Piano Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('music-player')}
                    className="btn-glass inline-flex items-center gap-2.5 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-blue-400" />
                    <span>Explore My Music</span>
                  </button>
                </div>
              </motion.div>

              {/* Featured Studio Visual Frame */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="lg:col-span-5"
              >
                <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950/60 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.75)] group">
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src="/images/piano-studio-hero.jpg"
                      alt="Likith's Piano Studio concert grand piano"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Live Synth
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
                      Acoustic Expression
                    </div>
                    <div className="text-lg font-display font-bold text-white mt-1">
                      Midnight Grand Studio
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STUDIO SECTIONS CONTAINER */}
        <div className="max-w-7xl mx-auto px-6 space-y-20 relative z-10">
          {/* INTERACTIVE VIRTUAL PIANO */}
          <section id="virtual-piano" className="scroll-mt-28">
            <VirtualPiano />
          </section>

          {/* MUSIC PLAYER */}
          <section id="music-player" className="scroll-mt-28">
            <MusicPlayer />
          </section>

          {/* INSTAGRAM PROFILE INTEGRATION */}
          <section id="instagram-studio" className="scroll-mt-28">
            <InstagramCard />
          </section>

          {/* ABOUT MY MUSIC */}
          <section id="about-music" className="scroll-mt-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="relative rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-8 sm:p-10 md:p-12 overflow-hidden text-left"
            >
              <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl" />
              <div className="max-w-3xl space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
                  <Music className="w-3 h-3" />
                  {ABOUT_MUSIC_CONTENT.eyebrow}
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                  {ABOUT_MUSIC_CONTENT.heading}
                </h2>

                <div className="space-y-4 text-slate-400 text-base sm:text-lg font-light leading-relaxed">
                  {ABOUT_MUSIC_CONTENT.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PianoStudioPage;
