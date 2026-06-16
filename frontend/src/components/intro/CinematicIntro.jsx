import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import IntroTitle from './IntroTitle';

export const CinematicIntro = ({ exiting, onComplete, onSkip }) => {
  const [showTitle, setShowTitle] = useState(false);

  // Lock body scroll during the intro, with full cleanup restoration
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyHeight = document.body.style.height;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyTouchAction = document.body.style.touchAction;
    const previousHtmlTouchAction = document.documentElement.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100dvh';

    if (window.lenis) {
      window.lenis.stop();
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.height = previousBodyHeight;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.touchAction = previousBodyTouchAction;
      document.documentElement.style.touchAction = previousHtmlTouchAction;

      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  // Handle cinematic sequence timings
  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`cinematic-intro fixed inset-0 w-full h-full z-50 flex flex-col justify-between p-6 ${
        exiting ? 'is-exiting pointer-events-none' : 'pointer-events-auto'
      }`}
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
  );
};

export default CinematicIntro;
