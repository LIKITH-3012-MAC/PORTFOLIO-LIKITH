import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, ExternalLink, Play, Trophy, Medal, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';

export const Venture = () => {
  return (
    <>
      {/* 1. SAKRA VISION CEO CARD */}
      <section id="founder" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex justify-center">
          {/* CEO Card text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="glass-panel rounded-3xl p-10 relative overflow-hidden group text-left max-w-3xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">Venture</h3>
              <h2 className="text-3xl font-display font-bold text-white mb-4">SAKRA Vision</h2>
              <p className="text-slate-400 font-light leading-relaxed mb-8">
                Founder & CEO. Driving innovation in computer vision automation and dedicated AI
                infrastructure. Focused on building highly efficient systems that bridge complex algorithms
                with real-world utility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/collab?source=venture" className="btn-premium group">
                  Start Collaboration
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="https://www.sakra-vision.online" target="_blank" rel="noopener noreferrer" className="btn-glass flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Visit Portal
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CREATIVE IDENTITY / PIANO SECTION */}
      <section className="py-32 relative z-10 bg-[#030712]/40 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 filter grayscale mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          {/* Left: text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-display font-light text-white tracking-wide leading-tight">
              The Art of <span className="font-bold text-gradient-accent">Precision.</span>
            </h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Classical Pianist. Where discipline meets emotion. Exploring the deep architectural symmetry shared between classical composition and algorithmic systems engineering.
            </p>
            <div className="pt-2 flex justify-center">
              <Link to="/youtube?source=nav" className="btn-premium group shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Witness Performance
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. EDUCATION & ACHIEVEMENTS */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Academic progression */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">Academic Progression</h2>
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-l-2 border-l-amber-500">
                  <h3 className="text-xl font-bold text-white mb-1">B.Tech CSE — Artificial Intelligence</h3>
                  <div className="text-sm font-mono text-amber-400 mb-3">PBR VITS (Current)</div>
                  <p className="text-slate-400 text-sm font-light">
                    Focusing on complex data structures (Python), Java OOP, and Neural Networks.
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-2 border-l-blue-500">
                  <h3 className="text-xl font-bold text-white mb-1">Advanced AIML Specialization</h3>
                  <div className="text-sm font-mono text-blue-400 mb-3">IIT-Patna (I-HUB)</div>
                  <p className="text-slate-400 text-sm font-light">
                    Deep Learning, NLP, Computer Vision, and real-time predictive modeling.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Proof of Work */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ delay: 100 }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">Proof of Work</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Trophy className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Technova2K25 Best Concept</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Awarded for innovative software engineering principles at PBRVITS.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Medal className="w-6 h-6 text-slate-300 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">1st Prize: CodeClash 2025</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Secured 1st place in algorithmic problem solving.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Database className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">SQL & AI Data Storytelling</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Optimized complex queries, reducing report generation time by 60%.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Venture;
