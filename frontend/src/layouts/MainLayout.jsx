import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useWebGLSupport from '../hooks/useWebGLSupport';
import useReducedMotion from '../hooks/useReducedMotion';
import Navbar from '../components/common/Navbar';
import MobileMenu from '../components/common/MobileMenu';
import Footer from '../components/common/Footer';
import ScrollProgress from '../components/common/ScrollProgress';
import ScrollToTop from '../components/common/ScrollToTop';
import Chatbot from '../components/chatbot/Chatbot';
import FounderMessage from '../components/home/FounderMessage';
import GlobalStarCanvas from '../three/cinematic-stars/GlobalStarCanvas';
import CinematicIntro from '../components/intro/CinematicIntro';
import { Bot } from 'lucide-react';

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [founderMessageOpen, setFounderMessageOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Cinematic Intro state - guaranteed completion checks
  const [introComplete, setIntroComplete] = useState(() => {
    try {
      return sessionStorage.getItem('likith-cinematic-intro-seen') === 'true';
    } catch {
      return false;
    }
  });

  const introTime = useRef(0);
  const hasCompletedRef = useRef(false);

  // Idempotent completion function
  const completeIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIntroComplete(true);
    try {
      sessionStorage.setItem('likith-cinematic-intro-seen', 'true');
    } catch (err) {
      // safe fallback
    }
  }, []);

  const prefersReduced = useReducedMotion();
  const hasWebGL = useWebGLSupport();

  // Instant skip for reduced motion or missing WebGL contexts
  useEffect(() => {
    if (prefersReduced || !hasWebGL) {
      completeIntro();
    }
  }, [prefersReduced, hasWebGL, completeIntro]);

  // Safety Timeout Fallback (5 seconds) to ensure the portfolio never stays locked
  useEffect(() => {
    if (introComplete) return;
    const safetyTimer = window.setTimeout(() => {
      completeIntro();
    }, 5000);
    return () => window.clearTimeout(safetyTimer);
  }, [introComplete, completeIntro]);

  // Pageshow event handler (for Mobile Safari back-forward cache compatibility)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        completeIntro();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [completeIntro]);

  // Reset the intro timer when intro starts
  useEffect(() => {
    if (!introComplete) {
      introTime.current = 0;
    }
  }, [introComplete]);

  // Listen for the ?open=message query parameter globally
  useEffect(() => {
    if (searchParams.get('open') === 'message') {
      setFounderMessageOpen(true);
      // Clean query params without page refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('open');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleOpenMessage = () => {
    // Toggles the personal Message modal open
    setFounderMessageOpen(true);
  };

  const handleOpenAI = () => {
    // Toggles the AI concierge open
    setChatbotOpen(true);
  };

  const handleSkipIntro = () => {
    completeIntro();
  };

  return (
    <div className={`app-shell min-h-screen flex flex-col bg-transparent text-slate-100 overflow-x-hidden selection:bg-white/20 selection:text-white ${
      introComplete ? 'app--ready' : 'app--intro'
    }`}>
      {/* Cinematic Intro Manager (Layer 5) */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <CinematicIntro 
            key="cinematic-intro"
            introActive={!introComplete} 
            setIntroActive={setIntroComplete} 
            onSkip={completeIntro}
            onComplete={completeIntro}
          />
        )}
      </AnimatePresence>

      {/* Immersive 3D Space Background (Layer 1) */}
      <GlobalStarCanvas 
        introActive={!introComplete}
        introTime={introTime}
        onIntroComplete={completeIntro}
      />

      {/* Site Content (Layer 3) */}
      <div 
        className={`site-content flex-grow flex flex-col transition-opacity duration-1000 ${
          introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scroll trackers */}
        <ScrollProgress />
        <ScrollToTop />

        {/* Shared Header Navigation */}
        <Navbar 
          introComplete={introComplete}
          menuOpen={mobileMenuOpen}
          setMenuOpen={setMobileMenuOpen}
          onOpenMessage={handleOpenMessage}
        />

        {/* Mobile drawer menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          onOpenMessage={handleOpenMessage}
        />

        {/* Main Page Content */}
        <main className="flex-grow">
          <Outlet context={{ handleOpenMessage, handleOpenAI }} />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>

      {/* Shared Chatbot Concierge (Layer 4) */}
      <Chatbot 
        isOpen={chatbotOpen} 
        onOpen={() => setChatbotOpen(true)}
        onClose={() => setChatbotOpen(false)}
      />

      {/* Founder Direct Transmission Modal (Layer 4) */}
      <FounderMessage 
        isOpen={founderMessageOpen}
        onClose={() => setFounderMessageOpen(false)}
      />

      {/* Floating Developer Replay Button (Only visible in local development environment when intro is completed) */}
      {import.meta.env.DEV && introComplete && (
        <button
          onClick={() => {
            try {
              sessionStorage.removeItem('likith-cinematic-intro-seen');
            } catch {}
            window.location.reload();
          }}
          className="fixed bottom-4 left-4 z-40 px-3 py-1.5 rounded bg-slate-900/90 border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 font-mono text-[10px] tracking-wider transition-all duration-200 cursor-pointer shadow-lg"
          title="Developer Replay Option (Local Only)"
        >
          ⚙️ Replay Intro
        </button>
      )}
    </div>
  );
};

export default MainLayout;
