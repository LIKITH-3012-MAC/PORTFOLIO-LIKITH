import React, { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import MobileMenu from '../components/common/MobileMenu';
import Footer from '../components/common/Footer';
import ScrollProgress from '../components/common/ScrollProgress';
import ScrollToTop from '../components/common/ScrollToTop';
import Chatbot from '../components/chatbot/Chatbot';
import FounderMessage from '../components/home/FounderMessage';
import CosmicCanvas from '../three/cosmic/CosmicCanvas';
import { Bot } from 'lucide-react';

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [founderMessageOpen, setFounderMessageOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <div className="app-shell min-h-screen flex flex-col bg-transparent text-slate-100 overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Immersive 3D Space Background (Layer 1) */}
      <CosmicCanvas />

      {/* Site Content (Layer 3) */}
      <div className="site-content flex-grow flex flex-col">
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
