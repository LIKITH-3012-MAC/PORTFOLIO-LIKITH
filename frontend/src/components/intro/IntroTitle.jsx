import React from 'react';
import { motion } from 'framer-motion';

export const IntroTitle = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6">
      {/* Volumetric fade in and blur reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center flex flex-col items-center justify-center"
      >
        <h1 
          className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-white tracking-tight leading-tight select-none relative"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.15), 0 0 60px rgba(251, 191, 36, 0.1)',
          }}
        >
          {/* Mobile Layout (Split Lines) */}
          <span className="block md:hidden text-gradient">
            Welcome to<br />
            <span className="text-amber-400">Likith’s Portfolio</span>
          </span>

          {/* Desktop Layout (Single Line) */}
          <span className="hidden md:block text-gradient">
            Welcome to <span className="text-amber-400">Likith’s Portfolio</span>
          </span>
        </h1>

        {/* Futuristic technology tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[9px] md:text-xs text-slate-400 font-mono tracking-[0.3em] uppercase mt-5 max-w-md"
        >
          Architecting Intelligent Systems
        </motion.p>

        {/* Decorative holographic neural indicator */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mt-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default IntroTitle;
