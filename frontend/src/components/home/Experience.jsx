import React from 'react';
import { ShieldCheck, Cpu, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';
import { MagneticCard } from '../effects/MagneticCard';
import { useMotionFlow } from '../../motion/MotionProvider';

export const Experience = () => {
  const { scrollProgress } = useMotionFlow();
  
  // Calculate local progress of the timeline based on scroll depth
  const localProgress = Math.min(Math.max((scrollProgress - 0.14) / 0.24, 0), 1);

  return (
    <section id="experience" className="py-32 relative z-10 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 text-left">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Execution Proof</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Leadership & <br /><span className="text-gradient">Trajectory.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Defining technical outcomes through rigorous engineering management, team formation, and strategic innovation in national and global ecosystems.
          </p>
        </motion.div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: The Journey Rails */}
          <div className="lg:col-span-8 space-y-12 relative pl-8">
            {/* Continuous growing timeline beam */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-white/10 overflow-hidden rounded-full pointer-events-none">
              <motion.div 
                className="w-full h-full bg-gradient-to-b from-amber-400 via-blue-500 to-purple-600 origin-top"
                style={{ scaleY: localProgress }}
              />
            </div>
            
            {/* Milestone 1: GDG / SΛKRΛ */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              {/* Pulsing indicator node */}
              <div 
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.15 
                    ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-110' 
                    : 'bg-slate-700'
                }`}
              />
              
              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div>
                    <div className="text-xs font-mono text-amber-400 tracking-[0.2em] uppercase mb-2">2026 • Global Initiative</div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:tracking-tight transition-all">Solution Challenge 2026</h3>
                    <p className="text-slate-400 font-medium">Build with AI • GDG Ecosystem</p>
                  </div>
                  <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white tracking-widest uppercase">Team SΛKRΛ</div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" /> Project: RESOLVIT — AI-Powered Civic & NGO Operations Platform
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                      Assembling and leading <b>Team SΛKRΛ</b> within a high-performance AI/ML ecosystem to architect a production-grade civic intelligence platform. <b>RESOLVIT</b> transforms community signals into actionable, accountability-driven workflows—orchestrating seamless issue-to-resolution cycles for citizens and public authorities.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Focus</div>
                      <div className="text-xs text-slate-300">Civic Intelligence & Governance Logic</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Execution</div>
                      <div className="text-xs text-slate-300">AI-Assisted Workflow Orchestration</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="https://g.dev/likithai" target="_blank" rel="noopener noreferrer" className="btn-glass py-2 px-5 text-[10px] flex items-center gap-2">
                    View Google Dev Profile <ArrowRight className="w-3 h-3" />
                  </a>
                  <button className="btn-glass text-[10px] py-2 px-5 opacity-50 cursor-not-allowed">Challenge Journey Log</button>
                </div>
              </MagneticCard>
            </motion.div>

            {/* Milestone 2: SIH 2025 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              {/* Pulsing indicator node */}
              <div 
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.75 
                    ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] scale-110' 
                    : 'bg-slate-700'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div>
                    <div className="text-xs font-mono text-slate-500 tracking-[0.2em] uppercase mb-2">2025 • National Milestone</div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:tracking-tight transition-all">Smart India Hackathon</h3>
                    <p className="text-slate-400 font-medium">Ministry of Education • Govt. of India</p>
                  </div>
                  <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white tracking-widest uppercase">Engineering Team Lead</div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" /> Project: Prometheus AI
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                      Directed a 5-person engineering squad to deliver high-performance architecture. Engineered the core backend using Next.js and Google Genkit, implementing optimized NoSQL schemas that achieved a <b>50% reduction</b> in data retrieval latency.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono">Team Management</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono">Architecture Design</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono">Performance Optimization</span>
                  </div>
                </div>
              </MagneticCard>
            </motion.div>

          </div>

          {/* Right: Competitive Innovation Roadmap */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              <MagneticCard className="glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-white" /> Innovation Pathway
                </h3>
                
                <div className="space-y-8">
                  {/* Roadmap Step 1 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40 group-hover:opacity-100"></div>
                      </div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Phase 01</div>
                      <div className="text-sm text-white font-medium mb-1">Team SΛKRΛ Formation</div>
                      <p className="text-xs text-slate-400 font-light">Assembling specialized AI-ML architects for global challenges.</p>
                    </div>
                  </div>

                  {/* Roadmap Step 2 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40 group-hover:opacity-100"></div>
                      </div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Phase 02</div>
                      <div className="text-sm text-white font-medium mb-1">Prototype Submission</div>
                      <p className="text-xs text-slate-400 font-light">Deploying RESOLVIT prototype under Build with AI initiative.</p>
                    </div>
                  </div>

                  {/* Roadmap Step 3 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border-white bg-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">Current State</div>
                      <div className="text-sm text-white font-medium mb-1">Ecosystem Evaluation</div>
                      <p className="text-xs text-slate-400 font-light">Undergoing technical review and product-market alignment.</p>
                    </div>
                  </div>
                </div>

                {/* Trust Links */}
                <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                  <a href="https://g.dev/likithai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <span className="text-xs text-slate-300">Google Developer Profile</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] text-slate-600 font-mono tracking-tighter">VERIFIED IN BUILD WITH AI ECOSYSTEM</span>
                  </div>
                </div>
              </MagneticCard>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;
