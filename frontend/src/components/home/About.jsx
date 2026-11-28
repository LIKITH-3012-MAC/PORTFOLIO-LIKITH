import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp } from '../../motion/variants';
import useKnowledge from '../../hooks/useKnowledge';
import { imageConfig } from '../../config/seo';

export const About = () => {
  const { data: profile } = useKnowledge('likith-profile.json');
  const { data: founderData } = useKnowledge('founder.json');

  const city = profile?.identity?.location?.city || 'Kavali';
  const state = profile?.identity?.location?.state || 'Andhra Pradesh';
  const country = profile?.identity?.location?.country || 'India';
  const companyName = founderData?.founder?.company || 'SAKRA VISION';

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Profile Portrait */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="md:col-span-5 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-[4/5]">
              <figure className="w-full h-full relative">
                <img 
                  src={imageConfig.multiDimensionImage}
                  alt="Likith Naidu Anumakonda"
                  width="1672"
                  height="941"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-cover filter contrast-125 saturate-0 group-hover:saturate-100 transition-all duration-700"
                />
                <figcaption className="absolute bottom-4 left-4 text-xs font-mono text-white/80 z-20">
                  Likith Naidu Anumakonda
                </figcaption>
              </figure>
            </div>
          </motion.div>
          
          {/* Right Column: Identity details */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="md:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-amber-300 uppercase tracking-widest">
              About Me
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              AI/ML Engineer &amp; <br />
              <span className="text-gradient-accent">Product Builder.</span>
            </h2>
            
            <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed font-light">
              <p>
                I am Likith Naidu Anumakonda from {city}, {state}, {country}. I am currently pursuing a B.Tech in Computer Science and Engineering (Artificial Intelligence) at Parvatha Reddy Babul Reddy Visvodaya Institute of Technology and Science (PBR VITS), Kavali. Having completed the Artificial Intelligence and Machine Learning Programme offered by Vishlesan i-Hub, IIT Patna (July 2025 – June 2026), I am currently participating in the Vicharanashala Internship (VINS), associated with the Vicharanashala Lab for Education Design at IIT Ropar (October 7 – December 5, 2026).
              </p>
              <p>
                My technical focus lies in <strong className="text-white font-medium">machine learning, AI application development, computer vision, LLM/RAG workflows, backend engineering, and database integration</strong> using Python, FastAPI, Java, and modern web technologies.
              </p>
              <p>
                Alongside my academics and internship work, I lead <strong className="text-white font-medium">{companyName}</strong> as Founder &amp; CEO — an AI product studio and technology venture. Outside of software engineering, I am a Classical Pianist and Author of <em>Echoes of an Unsaid Goodbye</em>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-display font-bold text-white mb-1">AI/ML</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Primary Focus</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white mb-1">B.Tech CSE (AI)</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">PBR VITS · Pursuing</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white mb-1">{companyName}</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Founder &amp; CEO</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
