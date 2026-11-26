import React, { useEffect } from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { modalTransition } from '../../motion/variants';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { imageConfig } from '../../config/seo';

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
    "AI Agents & RAG",
    "ML & Computer Vision",
    "Python & FastAPI",
    "React & Next.js",
    "Node.js",
    "PostgreSQL & MySQL",
    "Resend & Twilio APIs",
    "Deployment & DNS"
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
                  Personal Note
                </div>
                
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                  Building AI and web software <br />
                  with practical engineering focus.
                </h2>

                <div className="space-y-4 text-slate-400 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    I&apos;m <b>Likith Naidu Anumakonda</b>, an AI/ML Engineer and the Founder &amp; CEO of <b>SAKRA VISION</b>. I am currently pursuing a B.Tech in Computer Science and Engineering (Artificial Intelligence) at PBR VITS, Kavali, Andhra Pradesh.
                  </p>
                  <p>
                    I completed the Artificial Intelligence and Machine Learning Programme offered by <b>Vishlesan i-Hub, IIT Patna</b> (July 2025 – June 2026) and am currently participating in the <b>Vicharanashala Internship (VINS)</b> associated with the <b>Vicharanashala Lab for Education Design, IIT Ropar</b> (October 7 – December 5, 2026).
                  </p>
                  <p>
                    My engineering work covers <b>AI application development</b>, <b>machine learning</b>, <b>computer vision</b>, <b>LLM and RAG workflows</b>, and <b>AI agents and automation</b> alongside full-stack web delivery with <b>Python (FastAPI), Node.js, React, and Next.js</b>.
                  </p>
                </div>

                {/* SAKRA Block */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
                    SAKRA VISION · AI Product Studio &amp; Venture
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    As Founder &amp; CEO of <b>SAKRA VISION</b>, I build practical AI applications, automation workflows, and web software with clean engineering standards from prototype to deployment.
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
                    Discuss a Project
                  </Link>
                  <a href="/LIKITH-resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-glass flex items-center gap-2">
                    <FileText className="w-4 h-4" /> View Resume
                  </a>
                  <button onClick={onClose} className="btn-glass">
                    Close
                  </button>
                </div>
              </div>

              {/* Right Side: Portrait */}
              <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-[4/5] hidden md:block">
                <figure className="w-full h-full relative">
                  <img 
                    src={imageConfig.messagesImage} 
                    alt="Likith Anumakonda wearing a blazer and blue shirt on a rooftop terrace"
                    width="2752"
                    height="1536"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter contrast-110 saturate-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85 pointer-events-none"></div>
                  <figcaption className="absolute bottom-4 left-4 text-xs font-mono text-white/80 z-20">
                    Likith Naidu Anumakonda
                  </figcaption>
                </figure>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FounderMessage;
