import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CONFIG from '../../services/config';
import useKnowledge from '../../hooks/useKnowledge';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Load socials and contact details from knowledge base
  const { data: socialsData } = useKnowledge('socials.json');
  const { data: contactData } = useKnowledge('contact.json');
  const { data: profile } = useKnowledge('likith-profile.json');

  const name = profile?.identity?.fullName || 'Likith Naidu Anumamkonda';
  
  const getSocialUrl = (platformName) => {
    return socialsData?.socials?.find(s => s.platform.toLowerCase().includes(platformName.toLowerCase()))?.url;
  };

  const githubUrl = getSocialUrl('github') || CONFIG.CONTACT.GITHUB;
  const linkedinUrl = getSocialUrl('linkedin') || CONFIG.CONTACT.LINKEDIN;
  const twitterUrl = getSocialUrl('x') || getSocialUrl('twitter') || CONFIG.CONTACT.X;
  const phone = contactData?.contact?.phone || CONFIG.CONTACT.PHONE;

  const handleSupportClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const el = document.getElementById('contact');
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: 0, duration: 1.5 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate('/#contact');
    }
  };

  return (
    <footer className="py-8 border-t border-white/5 text-center relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500 font-light">
          &copy; {currentYear} {name}. All systems operational.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-slate-500">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <span>/</span>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <span>/</span>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X / Twitter</a>
          <span>/</span>
          <a href="#contact" onClick={handleSupportClick} className="hover:text-white transition-colors">Support</a>
          <span>/</span>
          <a href={`tel:${phone}`} className="hover:text-white transition-colors">Phone</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
