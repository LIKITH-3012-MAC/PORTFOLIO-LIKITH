import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Zap, MessageSquare, Cpu, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';
import CONFIG from '../../services/config';
import { fadeUp, scaleReveal } from '../../motion/variants';
import useKnowledge from '../../hooks/useKnowledge';

export const Hero = ({ onOpenMessage }) => {
  const { data: socialsData } = useKnowledge('socials.json');

  const getSocialUrl = (platformName) => {
    return socialsData?.socials?.find(s => s.platform.toLowerCase().includes(platformName.toLowerCase()))?.url;
  };

  const githubUrl = getSocialUrl('github') || CONFIG.CONTACT.GITHUB;
  const linkedinUrl = getSocialUrl('linkedin') || CONFIG.CONTACT.LINKEDIN;
  const twitterUrl = getSocialUrl('x') || getSocialUrl('twitter') || CONFIG.CONTACT.X;

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 text-left">
        {/* Left: Identity & Clear Actions */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-200 tracking-wider uppercase">
              AI/ML Engineer · Founder &amp; CEO, SAKRA VISION
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.08] tracking-tight text-white">
              Likith Naidu <br />
              <span className="text-gradient">Anumakonda</span>
            </h1>
            <p className="text-xl sm:text-2xl font-display font-medium text-amber-300/95">
              Building AI-Powered Applications &amp; Software
            </p>
          </div>

          <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
            I build AI-powered applications and software solutions focused on practical problems. My work combines machine learning, backend engineering, and product development.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button type="button" onClick={scrollToProjects} className="btn-premium flex items-center gap-2 cursor-pointer">
              <FolderKanban className="w-4 h-4" /> View Projects
            </button>
            <Link to="/git-profile?source=hero" className="btn-glass flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Explore My Work
            </Link>
            <Link 
              to="/collab?source=hero" 
              className="btn-glass flex items-center gap-2 border-amber-400/30 text-amber-300 hover:border-amber-400 hover:bg-amber-400/5 transition-all duration-300"
            >
              <Zap className="w-4 h-4" /> Get in Touch
            </Link>
            <button 
              type="button"
              onClick={onOpenMessage} 
              className="btn-glass flex items-center gap-2.5 group text-white border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Personal Note</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-white/10">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X profile" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Right: Floating Identity Card over 3D scene */}
        <div className="relative h-[340px] md:h-[460px] lg:h-[540px] w-full flex items-center justify-center order-first md:order-last">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleReveal}
            className="glass-panel p-6 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl z-30 pointer-events-auto max-w-sm"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-display font-bold text-white tracking-tight">AI/ML Engineer</div>
                <div className="text-xs text-slate-300 font-mono">B.Tech CSE (AI) · PBR VITS, Kavali</div>
                <div className="text-[11px] text-amber-300/90 font-mono">Founder &amp; CEO, SAKRA VISION</div>
                <div className="text-[11px] text-slate-400 font-mono">VINS Intern (IIT Ropar Lab) · Vishlesan i-Hub (IIT Patna)</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
