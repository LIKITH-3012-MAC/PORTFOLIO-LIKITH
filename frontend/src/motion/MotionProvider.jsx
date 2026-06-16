import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useDeviceTier from '../hooks/useDeviceTier';
import useReducedMotion from '../hooks/useReducedMotion';

const MotionContext = createContext(null);

export const MotionProvider = ({ children }) => {
  const location = useLocation();
  const deviceTier = useDeviceTier();
  const prefersReduced = useReducedMotion();
  
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll bounds to map current active section index
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const progress = scrollY / (document.documentElement.scrollHeight - height || 1);
      setScrollProgress(progress);

      // Simple section spy mappings
      const sections = ['about', 'experience', 'projects', 'skills', 'founder', 'contact'];
      let currentSection = 'hero';
      
      const scrollPosition = scrollY + height * 0.35;
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const sectionHeight = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + sectionHeight) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const value = {
    activeSection,
    scrollProgress,
    deviceTier,
    prefersReduced,
    currentPath: location.pathname
  };

  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotionFlow = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionFlow must be used within a MotionProvider');
  }
  return context;
};

export default MotionProvider;
