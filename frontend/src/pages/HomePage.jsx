import React, { useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Experience from '../components/home/Experience';
import Projects from '../components/home/Projects';
import Skills from '../components/home/Skills';
import Venture from '../components/home/Venture';
import Contact from '../components/home/Contact';

export const HomePage = () => {
  const location = useLocation();
  const { handleOpenMessage } = useOutletContext();

  // Scroll to hash section if present in location state (from redirection or routes)
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: 0, duration: 1.5 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 500);
    }
  }, [location.hash]);

  return (
    <>
      <SEO 
        title="Likith Naidu Anumakonda | AI/ML Architect & Founder"
        description="Official portfolio of Likith Naidu Anumakonda, featuring AI/ML engineering, full-stack projects, technical work, creative work and founder initiatives."
        keywords="Likith Naidu Anumakonda, Likith Anumakonda, Likith Naidu, AI Engineer, ML Architect, SAKRA VISION, Full Stack Developer, Python, Node.js, IIT Patna"
        canonical="https://likith-portfolio.online/"
        image="https://likith-portfolio.online/images/likith/likith-naidu-anumakonda-profile.png"
      />
      
      {/* Scroll Sections */}
      <Hero onOpenMessage={handleOpenMessage} />
      
      <About />
      
      <Experience />
      
      <Projects />
      
      <Skills />
      
      <Venture />
      
      <Contact />
    </>
  );
};

export default HomePage;
