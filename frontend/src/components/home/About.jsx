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
                  alt="Likith Naidu Anumakonda in a suit standing in front of an institutional building"
                  width="1672"
                  height="941"
                  loading="eager"
                  fetchPriority="high"
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
            className="md:col-span-7 space-y-8 text-left"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              The Architecture of <br />
              <span className="text-gradient-accent">Identity.</span>
            </h2>
            
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-light">
              <p>
                I am a multidimensional engineer and builder from {state}, {country}. I don't just write
                code; I design systems. From offline LLM architectures to civic intelligence platforms, my
                focus is always on creating elegant solutions to complex data problems.
              </p>
              <p>
                My approach blends deep technical rigor in <strong className="text-white font-medium">Python,
                Java SE, and AI models</strong> with a refined aesthetic sense, ensuring that every
                product I build is not only highly performant but also visually and experientially
                world-class.
              </p>
              

            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">AI/ML</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Specialization</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">Python/Java</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Core Logic</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">Founder</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">{companyName}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
