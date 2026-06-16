import React from 'react';
import { Brain, Code2, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';
import { MagneticCard } from '../effects/MagneticCard';

export const Skills = () => {
  const skillCategories = [
    {
      title: "AI & Intelligence",
      icon: Brain,
      iconColor: "text-amber-400",
      skills: ["AI Agent Dev", "ML Model Design", "RAG Architecture", "Ollama / Llama 3.2", "Scikit-Learn", "TensorFlow"]
    },
    {
      title: "Full-Stack Systems",
      icon: Code2,
      iconColor: "text-blue-400",
      skills: ["Python (FastAPI)", "Node.js Ecosystem", "Next.js / React", "Tailwind CSS", "API Controller Logic", "Middleware Dev"]
    },
    {
      title: "Infrastructure & Execution",
      icon: Database,
      iconColor: "text-purple-400",
      skills: ["Cloud DB (PostgreSQL)", "Metadata Architecture", "Domain Control", "Google Console Setup", "A-Z Deployment", "Product Execution"]
    }
  ];

  return (
    <section id="skills" className="py-24 relative z-10 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-3xl md:text-5xl font-display font-bold text-center text-white mb-16"
        >
          Technical Ecosystem
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                transition={{ delay: idx * 100 }}
                className="h-full"
              >
                <MagneticCard className="glass-panel p-8 rounded-3xl text-left h-full">
                  <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${cat.iconColor}`} /> {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </MagneticCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
