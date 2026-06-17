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
    let scrollHeight = document.documentElement.scrollHeight;
    let innerHeight = window.innerHeight;
    let totalScroll = scrollHeight - innerHeight;

    const handleResize = () => {
      scrollHeight = document.documentElement.scrollHeight;
      innerHeight = window.innerHeight;
      totalScroll = scrollHeight - innerHeight;
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const progress = totalScroll > 0 ? scrollY / totalScroll : 0;
          setScrollProgress(progress);
          if (scrollY < 200) {
            setActiveSection('hero');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    // High-performance IntersectionObserver for Section Spy
    const sections = ['about', 'experience', 'projects', 'skills', 'founder', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
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
