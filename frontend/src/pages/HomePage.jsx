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
        title="Likith Naidu Anumakonda | AI/ML Engineer &amp; Founder, SAKRA VISION"
        description='Likith Naidu Anumakonda is an AI/ML Engineer and Founder & CEO of SAKRA VISION, pursuing B.Tech CSE (AI) at PBR VITS, Kavali. Completed the AI & ML Programme at Vishlesan i-Hub, IIT Patna, and VINS Intern at Vicharanashala Lab, IIT Ropar. Classical Pianist & Author of "Echoes of an Unsaid Goodbye".'
        keywords="Likith Naidu Anumakonda, SAKRA VISION, Founder & CEO, AI/ML Engineer, Vicharanashala Internship, VINS, Vicharanashala Lab for Education Design IIT Ropar, Vishlesan i-Hub IIT Patna, Artificial Intelligence, Machine Learning, Computer Vision, Generative AI, B.Tech CSE Artificial Intelligence, PBR VITS, Classical Pianist, Author, Echoes of an Unsaid Goodbye"
        canonical="https://likith-naidu-anumakonda.online/"
        image="https://likith-naidu-anumakonda.online/images/likith/likith-naidu-anumakonda-profile.png"
        imageAlt="Likith Naidu Anumakonda — AI/ML Engineer and Founder & CEO of SAKRA VISION"
        robots="index, follow"
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
