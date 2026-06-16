import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Mail, Github, Youtube } from 'lucide-react';
import CONFIG from '../../services/config';
import useKnowledge from '../../hooks/useKnowledge';
import { MagneticButton } from '../effects/MagneticButton';
import { MagneticIcon } from '../effects/MagneticIcon';

export const Navbar = ({ visible, mobileMenuEnabled, menuOpen, setMenuOpen, onOpenMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('index');

  // Load identity dynamically from knowledge base
  const { data: profile } = useKnowledge('likith-profile.json');
  
  const brandName = profile?.identity?.fullName
    ? profile.identity.fullName.split(' ').slice(0, 2).join(' ').toUpperCase()
    : 'LIKITH NAIDU';
    
  const brandRole = profile?.identity?.roles?.[0] || 'AI Architect';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Section spy on homepage
      if (location.pathname === '/' || location.pathname === '/index.html') {
        const sections = ['about', 'experience', 'projects', 'founder'];
        const scrollPosition = window.scrollY + window.innerHeight * 0.3;

        let currentSection = 'index';
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentSection = sectionId;
              break;
            }
          }
        }
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Determine active nav highlights based on route paths
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('git-profile') || path.includes('likith-git-profile')) {
      setActiveSection('git');
    } else if (path.includes('youtube') || path.includes('likith-youtube')) {
      setActiveSection('youtube');
    } else if (path.includes('collab')) {
      setActiveSection('collab');
    } else if (path === '/' && !location.hash) {
      setActiveSection('index');
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const el = document.getElementById(sectionId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: 0, duration: 1.5 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleMessageClick = () => {
    if (onOpenMessage) {
      onOpenMessage();
    } else {
      navigate('/?open=message');
    }
  };

  return (
    <nav 
      id="navbar" 
      className={`site-header fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 rounded-full border border-white/10 bg-slate-950/40 backdrop-blur-xl px-6 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${
        scrolled ? 'py-2.5 bg-slate-950/85' : 'py-3 bg-slate-950/40'
      } ${
        visible ? 'site-header--visible' : 'site-header--intro'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Brand logo wrapper */}
        <MagneticIcon>
          <Link to="/?source=nav" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="https://raw.githubusercontent.com/LIKITH-3012-MAC/MY-PIC-GALLERY/refs/heads/main/Gemini_Generated_Image_ltizrcltizrcltiz.png"
                className="w-full h-full object-cover" 
                alt={brandName} 
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold tracking-tight leading-none text-sm text-white">{brandName}</span>
              <span className="text-[8px] text-slate-400 font-mono tracking-widest uppercase">{brandRole}</span>
            </div>
          </Link>
        </MagneticIcon>

        {/* Desktop Links with magnetic effects */}
        <div className="hidden lg:flex items-center gap-6">
          <MagneticIcon>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`desktop-nav-link text-xs font-medium tracking-wider uppercase ${activeSection === 'about' ? 'active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Identity
            </button>
          </MagneticIcon>

          <MagneticIcon>
            <button 
              onClick={() => handleNavClick('experience')} 
              className={`desktop-nav-link text-xs font-medium tracking-wider uppercase ${activeSection === 'experience' ? 'active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Experience
            </button>
          </MagneticIcon>

          <MagneticIcon>
            <button 
              onClick={() => handleNavClick('projects')} 
              className={`desktop-nav-link text-xs font-medium tracking-wider uppercase ${activeSection === 'projects' ? 'active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Systems
            </button>
          </MagneticIcon>

          <MagneticIcon>
            <Link 
              to="/git-profile?source=nav" 
              className={`desktop-nav-link text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 ${activeSection === 'git' ? 'active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Github className="w-3.5 h-3.5" /> Git Archive
            </Link>
          </MagneticIcon>

          <MagneticIcon>
            <Link 
              to="/youtube?source=nav" 
              className={`desktop-nav-link text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 ${activeSection === 'youtube' ? 'active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Hub
            </Link>
          </MagneticIcon>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <MagneticButton 
            onClick={handleMessageClick}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-amber-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10"
          >
            <Mail className="w-3.5 h-3.5" /> Message
          </MagneticButton>
          
          <MagneticButton>
            <Link 
              to="/collab?source=nav" 
              className={`btn-premium hidden lg:flex !py-2 !px-5 !text-[10px] ${activeSection === 'collab' ? 'border-amber-400' : ''}`}
            >
              Collaborate
            </Link>
          </MagneticButton>
          
          {/* Mobile hamburger menu */}
          {mobileMenuEnabled && (
            <button
              type="button"
              className={`mobile-menu-button lg:hidden ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
