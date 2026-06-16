import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import MobileMenu from '../components/common/MobileMenu';
import Footer from '../components/common/Footer';
import ScrollProgress from '../components/common/ScrollProgress';
import ScrollToTop from '../components/common/ScrollToTop';
import Chatbot from '../components/chatbot/Chatbot';
import FounderMessage from '../components/home/FounderMessage';
import SolarSystemCanvas from '../three/solar-system/SolarSystemCanvas';
import CinematicIntro from '../components/intro/CinematicIntro';
import { Bot } from 'lucide-react';

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [founderMessageOpen, setFounderMessageOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Cinematic Intro state
  const [introActive, setIntroActive] = useState(true);
  const introTime = useRef(0);

  // Reset the intro timer when intro starts
  useEffect(() => {
    if (introActive) {
      introTime.current = 0;
    }
  }, [introActive]);

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
    sessionStorage.setItem('likith-cinematic-intro-seen', 'true');
    setIntroActive(false);
  };

  return (
    <div className="app-shell min-h-screen flex flex-col bg-transparent text-slate-100 overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Cinematic Intro Manager (Layer 5) */}
      <CinematicIntro 
        introActive={introActive} 
        setIntroActive={setIntroActive} 
        onSkip={handleSkipIntro}
      />

      {/* Immersive 3D Space Background (Layer 1) */}
      <SolarSystemCanvas 
        introActive={introActive}
        introTime={introTime}
        onIntroComplete={handleSkipIntro}
      />

      {/* Site Content (Layer 3) */}
      <div 
        className={`site-content flex-grow flex flex-col transition-opacity duration-1000 ${
          introActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Scroll trackers */}
        <ScrollProgress />
        <ScrollToTop />

        {/* Shared Header Navigation */}
        <Navbar 
          onOpenMenu={() => setMobileMenuOpen(true)} 
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
    </div>
  );
};

export default MainLayout;
