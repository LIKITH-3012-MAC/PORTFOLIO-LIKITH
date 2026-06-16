import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Play, Zap, MessageSquare, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import CONFIG from '../../services/config';
import { fadeUp, scaleReveal } from '../../motion/variants';
import useKnowledge from '../../hooks/useKnowledge';

export const Hero = ({ onOpenMessage }) => {
  // Load profile and socials from knowledge
  const { data: profile } = useKnowledge('likith-profile.json');
  const { data: socialsData } = useKnowledge('socials.json');

  const tagline = profile?.identity?.tagline || "Engineering Intelligent Systems. Architecting the intersection of autonomous AI and creative technical leadership.";
  const brandRole = profile?.identity?.roles?.[0] || "AI-ML Architect & Founder";
  
  const getSocialUrl = (platformName) => {
    return socialsData?.socials?.find(s => s.platform.toLowerCase().includes(platformName.toLowerCase()))?.url;
  };

  const githubUrl = getSocialUrl('github') || CONFIG.CONTACT.GITHUB;
  const linkedinUrl = getSocialUrl('linkedin') || CONFIG.CONTACT.LINKEDIN;
  const twitterUrl = getSocialUrl('x') || getSocialUrl('twitter') || CONFIG.CONTACT.X;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 text-left">
        {/* Left: Copy & Actions */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-300 tracking-wider uppercase">Systems & Data Logic</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight text-white">
            Engineering <br />
            <span className="text-gradient">Intelligent</span><br />
            <span className="text-gradient-accent">Systems.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/git-profile?source=hero" className="btn-premium flex items-center gap-2">
              <Github className="w-4 h-4" /> View Archive
            </Link>
            <Link to="/youtube?source=hero" className="btn-glass flex items-center gap-2">
              <Play className="w-4 h-4" /> Media Hub
            </Link>
            <Link 
              to="/collab?source=hero" 
              className="btn-glass flex items-center gap-2 border-amber-400/30 text-amber-400 hover:border-amber-400 hover:bg-amber-400/5 transition-all duration-300"
            >
              <Zap className="w-4 h-4" /> Work with Me
            </Link>
            <button 
              onClick={onOpenMessage} 
              className="btn-glass flex items-center gap-3 group text-white border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Likith’s Message</span>
            </button>

          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-white/5">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Right: Floating PBR card anchored to WebGL center */}
        <div className="relative h-[300px] md:h-[500px] lg:h-[600px] w-full flex items-center justify-center order-first md:order-last pointer-events-none">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleReveal}
            className="glass-panel p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl animate-bounce shadow-2xl pointer-events-auto"
            style={{ animationDuration: '4s' }}
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-white uppercase tracking-tighter">AI-ML Architect</div>
                <div className="text-xs text-slate-400 font-mono">PBR VITS • IIT PATNA ALUM IHUB AIML</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
