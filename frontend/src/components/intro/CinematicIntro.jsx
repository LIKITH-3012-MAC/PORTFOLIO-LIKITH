import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import IntroTitle from './IntroTitle';

export const CinematicIntro = ({ introActive, setIntroActive, onSkip }) => {
  const [searchParams] = useSearchParams();
  const [showTitle, setShowTitle] = useState(false);

  // Read developer bypass and session storage state
  useEffect(() => {
    const isReplay = searchParams.get('replay') === 'true' || searchParams.get('replay') === '1' || searchParams.get('debug') === 'intro';
    const hasSeenIntro = sessionStorage.getItem('likith-cinematic-intro-seen');

    if (isReplay) {
      sessionStorage.removeItem('likith-cinematic-intro-seen');
      setIntroActive(true);
    } else if (!hasSeenIntro) {
      setIntroActive(true);
    } else {
      setIntroActive(false);
    }
  }, [searchParams, setIntroActive]);

  // Lock body scroll during the intro
  useEffect(() => {
    if (introActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [introActive]);

  // Handle cinematic sequence timings
  useEffect(() => {
    if (!introActive) {
      setShowTitle(false);
      return;
    }

    // Show title at t = 1.6s
    const titleShowTimeout = setTimeout(() => {
      setShowTitle(true);
    }, 1600);

    // Hide title at t = 3.3s (when camera passes through portal)
    const titleHideTimeout = setTimeout(() => {
      setShowTitle(false);
    }, 3300);

    return () => {
      clearTimeout(titleShowTimeout);
      clearTimeout(titleHideTimeout);
    };
  }, [introActive]);

  const handleDevReplay = () => {
    sessionStorage.removeItem('likith-cinematic-intro-seen');
    setIntroActive(true);
  };

  return (
    <>
      <AnimatePresence>
        {introActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 w-screen h-screen z-50 pointer-events-none flex flex-col justify-between p-6"
            style={{
              background: 'radial-gradient(circle at center, rgba(10,15,30,0) 0%, rgba(3,5,10,0.85) 100%)',
            }}
          >
            {/* Top Bar / Visual Vignette */}
            <div className="w-full flex justify-between items-center pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[9px] text-slate-400 font-mono tracking-widest uppercase"
              >
                System Boot // Cosmic Engine
              </motion.div>
            </div>

            {/* Cinematic Welcome Title */}
            <IntroTitle show={showTitle} />

            {/* Bottom Controls */}
            <div className="w-full flex justify-end items-center pointer-events-auto">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                onClick={onSkip}
                className="px-4 py-2 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-400/80 hover:text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/10 font-mono text-xs tracking-wider transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.05)] cursor-pointer"
              >
                Skip Sequence ➔
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Developer Replay Button (Only visible in local development environment when intro is inactive) */}
      {import.meta.env.DEV && !introActive && (
        <button
          onClick={handleDevReplay}
          className="fixed bottom-4 left-4 z-40 px-3 py-1.5 rounded bg-slate-900/90 border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 font-mono text-[10px] tracking-wider transition-all duration-200 cursor-pointer shadow-lg"
          title="Developer Replay Option (Local Only)"
        >
          ⚙️ Replay Intro
        </button>
      )}
    </>
  );
};

export default CinematicIntro;
