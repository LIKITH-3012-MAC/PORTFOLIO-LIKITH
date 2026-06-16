import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import CONFIG from '../../services/config';
import { fadeUp } from '../../motion/variants';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 relative z-10 bg-white/[0.02] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Ready to Build?</h2>
          <p className="text-lg text-slate-400 font-light mb-12 max-w-2xl mx-auto">
            Whether you're looking for a technical co-founder, an architect for your next AI system, or simply want to connect.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href={`mailto:${CONFIG.CONTACT.PRIMARY_EMAIL}`} className="btn-premium w-full sm:w-auto">
              <Mail className="w-4 h-4 mr-2" /> Initiate Contact
            </a>
            <a 
              href={CONFIG.CONTACT.LINKEDIN} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass w-full sm:w-auto flex items-center justify-center"
            >
              <Linkedin className="w-4 h-4 mr-2" /> Professional Network
            </a>
            <a 
              href={CONFIG.CONTACT.INSTAGRAM} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass w-full sm:w-auto flex items-center justify-center"
            >
              <Instagram className="w-4 h-4 mr-2" /> Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
