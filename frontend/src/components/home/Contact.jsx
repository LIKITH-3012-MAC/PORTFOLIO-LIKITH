import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import CONFIG from '../../services/config';
import { fadeUp } from '../../motion/variants';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 relative z-10 bg-white/[0.02] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left: Candid Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="md:col-span-5 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-[16/9] md:aspect-[4/3] max-w-sm mx-auto">
              <figure className="w-full h-full relative">
                <img 
                  src="/images/likith/likith-naidu-anumakonda-casual-photo.jpeg"
                  alt="Likith Naidu Anumakonda — candid indoor shot with sunglasses"
                  width="1280"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter contrast-110 saturate-50 group-hover:saturate-100 transition-all duration-700"
                />
                <figcaption className="absolute bottom-4 left-4 text-xs font-mono text-white/80 z-20">
                  Likith Naidu Anumakonda
                </figcaption>
              </figure>
            </div>
          </motion.div>

          {/* Right: Text & Action */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="md:col-span-7 space-y-6 text-left"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Ready to Build?</h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Whether you're looking for a technical co-founder, an architect for your next AI system, or simply want to connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href={`mailto:${CONFIG.CONTACT.PRIMARY_EMAIL}`} className="btn-premium flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" /> Initiate Contact
              </a>
              <a 
                href={CONFIG.CONTACT.LINKEDIN} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass flex items-center justify-center"
              >
                <Linkedin className="w-4 h-4 mr-2" /> Professional Network
              </a>
              <a 
                href={CONFIG.CONTACT.INSTAGRAM} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass flex items-center justify-center"
              >
                <Instagram className="w-4 h-4 mr-2" /> Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
