import React, { useEffect } from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { modalTransition } from '../../motion/variants';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

export const FounderMessage = ({ isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const capabilities = [
    "AI Agents",
    "Full-Stack Systems",
    "Python & Node.js",
    "ML Models",
    "Cloud Databases",
    "API Architecture",
    "OTP & Twilio",
    "Google Console"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex justify-center items-start md:items-center p-4 bg-slate-950/80 backdrop-blur-3xl overflow-y-auto"
          data-lenis-prevent="true"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-20"
            aria-label="Close Message"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div 
            variants={modalTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-5xl my-auto p-4 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center text-left">
              {/* Left Side: Copy */}
              <div className="space-y-6">
                <div className="inline-block text-xs font-mono text-amber-400 tracking-[0.2em] uppercase border border-amber-400/20 bg-amber-400/5 px-3 py-1 rounded-full">
                  Founder’s Direct Transmission
                </div>
                
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                  Beyond the code, <br />
                  I architect <br />
                  complete ecosystems.
                </h2>

                <div className="space-y-4 text-slate-400 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    Beyond the code, I architect complete ecosystems. As the founder of <b>SAKRA VISION</b>, I approach every project not just as a developer, but as a technical architect and strategic lead.
                  </p>
                  <p>
                    My A-to-Z specialties include <b>AI-ML architecting</b>, the development of sophisticated <b>AI Agents</b>, and the design of custom <b>ML models</b>. I own the entire technical stack—leveraging <b>Python and Node.js</b> to build robust full-stack systems that handle everything from complex <b>API architecture</b> and <b>middleware integration</b> to secure communication systems like <b>Resend OTP and Twilio</b>.
                  </p>
                  <p>
                    I manage the entire technical launch cycle, including <b>domain control</b>, server configuration, <b>Google Console setup</b>, and <b>metadata architecture</b>. My focus is the absolute, end-to-end execution of the client’s vision, ensuring every product is delivered with engineered excellence.
                  </p>
                </div>

                {/* SAKRA Block */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
                    SAKRA VISION • THE EXECUTION ECOSYSTEM
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    I am the founder of <b>SAKRA VISION</b>. Every project under my leadership operates under the technical vision, discipline, and real execution ecosystem of SAKRA. We don’t just deliver code; we deliver complete, production-grade technical solutions.
                  </p>
                </div>

                {/* Capability Showcase */}
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((cap, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/collab?source=footer" onClick={onClose} className="btn-premium">
                    Work With Likith
                  </Link>
                  <a href="/LIKITH-resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-glass flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Resume
                  </a>
                  <button onClick={onClose} className="btn-glass">
                    Close Message
                  </button>
                </div>
              </div>

              {/* Right Side: Portrait */}
              <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-[4/5] hidden md:block">
                <img 
                  src="/images/likith/likith-anumakonda-professional-photo.jpeg" 
                  alt="Likith Naidu Anumakonda — Founder Portrait"
                  className="w-full h-full object-cover filter contrast-110 saturate-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85"></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FounderMessage;
