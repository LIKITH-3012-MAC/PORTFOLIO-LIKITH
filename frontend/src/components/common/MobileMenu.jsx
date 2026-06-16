import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, ArrowRight, Mail, Compass, ShieldAlert, Cpu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { mobileMenuTransition } from '../../motion/variants';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { MagneticButton } from '../effects/MagneticButton';
import { MagneticIcon } from '../effects/MagneticIcon';

export const MobileMenu = ({ isOpen, onClose, onOpenMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useBodyScrollLock(isOpen);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (sectionId) => {
    onClose();
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
    onClose();
    if (onOpenMessage) {
      onOpenMessage();
    } else {
      navigate('/?open=message');
    }
  };

  const menuItems = [
    { label: 'Identity', type: 'section', target: 'about' },
    { label: 'Experience', type: 'section', target: 'experience' },
    { label: 'Systems', type: 'section', target: 'projects' },
    { label: 'Git Archive', type: 'link', target: '/git-profile?source=nav' },
    { label: 'YouTube Hub', type: 'link', target: '/youtube?source=nav' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Dim & Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Floating Glass Menu Panel */}
          <motion.div 
            variants={mobileMenuTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950/75 backdrop-blur-2xl p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-bold text-sm text-white tracking-wider uppercase">Navigation</span>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors" 
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Nav items */}
            <div className="flex flex-col gap-2.5">
              {menuItems.map((item, index) => {
                const isActive = item.type === 'section'
                  ? location.hash === `#${item.target}`
                  : location.pathname === item.target.split('?')[0];

                if (item.type === 'section') {
                  return (
                    <MagneticIcon key={index} className="w-full">
                      <button
                        onClick={() => handleNavClick(item.target)}
                        className={`mobile-nav-item w-full text-left ${isActive ? 'active' : ''}`}
                      >
                        <span className="mobile-nav-label">{item.label}</span>
                        <ArrowRight className="mobile-nav-arrow w-4 h-4 opacity-0 transition-all" />
                      </button>
                    </MagneticIcon>
                  );
                }

                return (
                  <MagneticIcon key={index} className="w-full">
                    <Link
                      to={item.target}
                      onClick={onClose}
                      className={`mobile-nav-item w-full flex justify-between items-center ${isActive ? 'active' : ''}`}
                    >
                      <span className="mobile-nav-label">{item.label}</span>
                      <ArrowRight className="mobile-nav-arrow w-4 h-4 opacity-0 transition-all" />
                    </Link>
                  </MagneticIcon>
                );
              })}

              <hr className="border-white/5 my-2" />

              {/* Message button */}
              <MagneticButton 
                onClick={handleMessageClick}
                className="mobile-nav-item w-full text-left"
              >
                <span className="mobile-nav-label flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" /> Message Founder
                </span>
                <ArrowRight className="mobile-nav-arrow w-4 h-4 opacity-0 transition-all text-amber-400" />
              </MagneticButton>

              {/* Collaborate call to action */}
              <MagneticButton className="w-full">
                <Link 
                  to="/collab?source=nav" 
                  onClick={onClose}
                  className={`mobile-nav-item mobile-nav-btn w-full flex justify-between items-center ${location.pathname.includes('collab') ? 'active' : ''}`}
                >
                  <span className="mobile-nav-label">Collaborate</span>
                  <ArrowRight className="mobile-nav-arrow w-4 h-4 opacity-0 transition-all" />
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
