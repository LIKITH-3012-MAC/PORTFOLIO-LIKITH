import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, ExternalLink, Music, BookOpen, Trophy, Medal, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';

export const Venture = () => {
  return (
    <>
      {/* 1. SAKRA VISION VENTURE CARD */}
      <section id="founder" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex justify-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden group text-left max-w-3xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <p className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">AI Product Studio &amp; Technology Venture</p>
              <h2 className="text-3xl font-display font-bold text-white mb-4">SAKRA VISION</h2>
              <p className="text-slate-300 font-light leading-relaxed mb-6">
                Founder &amp; CEO. An AI product studio and technology venture focused on AI application development, machine learning, computer vision, LLM and RAG applications, AI agents and automation, and software and web application development.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "AI Application Development",
                  "Machine Learning",
                  "Computer Vision",
                  "LLM & RAG Applications",
                  "AI Agents & Automation",
                  "Software & Web Apps"
                ].map((area) => (
                  <span key={area} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    {area}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/collab?source=venture" className="btn-premium group">
                  Discuss a Project
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="https://www.sakra-vision.online" target="_blank" rel="noopener noreferrer" className="btn-glass flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Explore SAKRA VISION
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CREATIVE WORK: CLASSICAL PIANO & AUTHORED BOOK */}
      <section className="py-28 relative z-10 bg-[#030712]/40 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 filter grayscale mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-12 space-y-3"
          >
            <div className="text-xs font-mono text-amber-400 tracking-[0.2em] uppercase">
              Music &amp; Writing
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Classical Piano &amp; Authored Work
            </h2>
            <p className="text-slate-400 font-light max-w-2xl mx-auto text-sm md:text-base">
              Creative disciplines I practice alongside engineering — classical piano performance and long-form writing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Classical Pianist</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Practicing and performing classical piano repertoire alongside software and AI engineering. The discipline, structure, and timing of musical study directly shape how I approach technical craft.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/piano?source=home" className="btn-premium text-xs">
                  Explore Piano Studio
                </Link>
                <Link to="/youtube?source=nav" className="btn-glass text-xs">
                  Watch Performances
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ delay: 100 }}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-blue-300 uppercase tracking-widest mb-1">
                    Author
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    &ldquo;Echoes of an Unsaid Goodbye&rdquo;
                  </h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Author of the book <em>Echoes of an Unsaid Goodbye</em>, reflecting an ongoing commitment to reflective storytelling and creative expression beyond software and machine learning.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                Literary Work · Likith Naidu Anumakonda
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. EDUCATION & RECOGNITION */}
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
              <h2 className="text-3xl font-display font-bold text-white mb-8">Education</h2>
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-l-2 border-l-amber-500">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">Currently Pursuing</div>
                  <h3 className="text-xl font-bold text-white mb-1">B.Tech, Computer Science and Engineering (Artificial Intelligence)</h3>
                  <div className="text-sm font-mono text-slate-200 mb-3">
                    Parvatha Reddy Babul Reddy Visvodaya Institute of Technology and Science (PBR VITS), Kavali, Andhra Pradesh
                  </div>
                  <p className="text-slate-300 text-sm font-light">
                    Undergraduate degree in Computer Science &amp; Engineering specializing in AI, with coursework in Data Structures, Python, Java OOP, Database Management, and Machine Learning.
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-2 border-l-blue-500">
                  <div className="text-[11px] font-mono text-blue-300 uppercase tracking-wider mb-1">
                    Additional AI/ML Programme · Successfully Completed · July 2025 – June 2026
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Completed AI &amp; Machine Learning Programme — Vishlesan i-Hub, IIT Patna</h3>
                  <div className="text-sm font-mono text-slate-200 mb-3">
                    Vishlesan i-Hub, IIT Patna · Artificial Intelligence and Machine Learning Programme
                  </div>
                  <p className="text-slate-300 text-sm font-light">
                    Successfully completed the Artificial Intelligence and Machine Learning Programme offered by Vishlesan i-Hub, IIT Patna. The programme strengthened my understanding of AI/ML fundamentals and their practical applications.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Highlights & Recognition */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ delay: 100 }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">Recognition &amp; Applied Work</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Trophy className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Technova2K25 — Best Concept</h3>
                    <p className="text-sm text-slate-400 font-light">
                      Recognized for presenting an applied software engineering concept at PBR VITS.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Medal className="w-6 h-6 text-slate-300 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">CodeClash 2025 — First Prize</h3>
                    <p className="text-sm text-slate-400 font-light">
                      Secured 1st place in algorithmic problem solving.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 glass-panel p-4 rounded-xl">
                  <Database className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">SQL &amp; Data Analysis Workflows</h3>
                    <p className="text-sm text-slate-400 font-light">
                      Designed structured SQL queries and reporting workflows to simplify operational data analysis.
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
