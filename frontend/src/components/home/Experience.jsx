import React from 'react';
import { ShieldCheck, Cpu, TrendingUp, ArrowRight, Check, Briefcase, GraduationCap, Building2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';
import { MagneticCard } from '../effects/MagneticCard';
import { useMotionFlow } from '../../motion/MotionProvider';

export const Experience = () => {
  const { scrollProgress } = useMotionFlow();

  // Calculate local progress of the timeline based on scroll depth
  const localProgress = Math.min(Math.max((scrollProgress - 0.14) / 0.28, 0), 1);

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
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-[11px] font-mono text-slate-300 tracking-wider uppercase">Professional Experience &amp; Initiatives</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Experience &amp; <span className="text-gradient">Timeline.</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed font-light">
            Chronological journey across research-oriented software internships, venture leadership, specialized AI/ML training, and technical initiatives.
          </p>
        </motion.div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Chronological Experience Rails */}
          <div className="lg:col-span-8 space-y-10 relative pl-8">
            {/* Continuous growing timeline beam */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-white/10 overflow-hidden rounded-full pointer-events-none">
              <motion.div
                className="w-full h-full bg-gradient-to-b from-emerald-400 via-amber-400 to-blue-500 origin-top"
                style={{ scaleY: localProgress }}
              />
            </div>

            {/* 1. 2026 — VINS Internship (Ongoing) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              <div
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.05
                    ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.85)] scale-110'
                    : 'bg-emerald-500/80'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 2026 · October 7, 2026 – December 5, 2026
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Vicharanashala Internship (VINS)</h3>
                    <p className="text-slate-300 font-medium">Vicharanashala Lab for Education Design, IIT Ropar</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-[11px] font-mono text-emerald-300 tracking-wider uppercase shrink-0">
                    VINS Intern · Currently Ongoing
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed font-light mb-6">
                  Currently participating in the Vicharanashala Internship (VINS), associated with the Vicharanashala Lab for Education Design at IIT Ropar. The programme provides practical exposure to research-oriented software engineering and open-source development through structured technical work and mentorship.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Role</div>
                    <div className="text-xs text-slate-200 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> VINS Intern
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Duration</div>
                    <div className="text-xs text-slate-200">Oct 7, 2026 – Dec 5, 2026</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Status</div>
                    <div className="text-xs text-emerald-300 font-medium">Currently Ongoing</div>
                  </div>
                </div>
              </MagneticCard>
            </motion.div>

            {/* 2. 2026 — AI & ML Programme (Vishlesan i-Hub, IIT Patna) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              <div
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.25
                    ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] scale-110'
                    : 'bg-slate-700'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> 2026 · July 2025 – June 2026
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">AI &amp; ML Programme</h3>
                    <p className="text-slate-300 font-medium">Vishlesan i-Hub, IIT Patna</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-[11px] font-mono text-blue-300 tracking-wider uppercase shrink-0">
                    Successfully Completed
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed font-light mb-6">
                  Successfully completed the Artificial Intelligence and Machine Learning Programme offered by Vishlesan i-Hub, IIT Patna. The programme strengthened my understanding of AI/ML fundamentals and their practical applications.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Programme</div>
                    <div className="text-xs text-slate-200">Artificial Intelligence &amp; Machine Learning Programme</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Duration &amp; Status</div>
                    <div className="text-xs text-blue-300">July 2025 – June 2026 · Completed</div>
                  </div>
                </div>
              </MagneticCard>
            </motion.div>

            {/* 3. 2026 — Founder & CEO — SAKRA VISION */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              <div
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.45
                    ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-110'
                    : 'bg-slate-700'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> 2026 · AI Product Studio &amp; Venture
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">SAKRA VISION</h3>
                    <p className="text-slate-300 font-medium">AI Product Studio &amp; Technology Venture</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] font-mono text-amber-300 tracking-wider uppercase shrink-0">
                    Founder &amp; CEO
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed font-light mb-6">
                  Serving as Founder &amp; CEO of <strong className="text-white font-medium">SAKRA VISION</strong>, directing product strategy and engineering across AI application development, machine learning, computer vision, LLM and RAG workflows, AI agents, and web software.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#founder" className="btn-glass !py-2 !px-5 text-xs flex items-center gap-2">
                    View Venture Details <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </MagneticCard>
            </motion.div>

            {/* 4. 2026 — Solution Challenge (Build with AI · GDG) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              <div
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.65
                    ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-110'
                    : 'bg-slate-700'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-2">2026 · Developer Programme (Under Evaluation)</div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Solution Challenge 2026</h3>
                    <p className="text-slate-300 font-medium">Build with AI · Google Developer Groups</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] font-mono text-slate-200 tracking-wider uppercase">
                    Team Lead · Team SΛKRΛ
                  </div>
                </div>

                <div className="space-y-5 mb-7">
                  <div>
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" /> Project: RESOLVIT — AI-Assisted Civic &amp; NGO Platform
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Led <strong className="text-white font-medium">Team SΛKRΛ</strong> in designing and building <strong className="text-white font-medium">RESOLVIT</strong> for the Build with AI initiative. Contributed to the application workflows for civic issue reporting, priority routing, tracking, and resolution coordination between citizens, NGOs, and local authorities. Currently submitted and under evaluation.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Responsibilities</div>
                      <div className="text-xs text-slate-200">Team coordination, backend APIs, AI-assisted routing</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Status</div>
                      <div className="text-xs text-amber-300">Submitted · Under Evaluation</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="https://g.dev/likithai" target="_blank" rel="noopener noreferrer" className="btn-glass !py-2 !px-5 text-xs flex items-center gap-2">
                    View Google Developer Profile <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </MagneticCard>
            </motion.div>

            {/* 5. 2025 — Smart India Hackathon (Prometheus AI) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="relative"
            >
              <div
                className={`absolute left-[-37px] top-7 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all duration-500 z-10 ${
                  localProgress > 0.85
                    ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] scale-110'
                    : 'bg-slate-700'
                }`}
              />

              <MagneticCard className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-all duration-500">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-2">2025 · National Hackathon</div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Smart India Hackathon</h3>
                    <p className="text-slate-300 font-medium">Ministry of Education · Government of India Initiative</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] font-mono text-slate-200 tracking-wider uppercase">
                    Engineering Team Lead (5 Members)
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" /> Project: Prometheus AI
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Led a five-member engineering team building <strong className="text-white font-medium">Prometheus AI</strong>. Worked on core backend implementation using Next.js and Google Genkit, alongside NoSQL schema restructuring aimed at improving data retrieval performance.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">Team Leadership</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">Next.js &amp; Genkit</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">Database Optimization</span>
                  </div>
                </div>
              </MagneticCard>
            </motion.div>

          </div>

          {/* Right: Summary & Profiles */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              <MagneticCard className="glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-400" /> Active Milestones
                </h3>

                <div className="space-y-8">
                  {/* Milestone Summary 1 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border border-emerald-400 bg-emerald-400/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      </div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Oct 7 – Dec 5, 2026 · Ongoing</div>
                      <div className="text-sm text-white font-medium mb-1">VINS Internship (IIT Ropar Lab)</div>
                      <p className="text-xs text-slate-300 font-light">Vicharanashala Lab for Education Design, IIT Ropar.</p>
                    </div>
                  </div>

                  {/* Milestone Summary 2 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border border-blue-400 bg-blue-400/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-300" />
                      </div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-blue-300 uppercase tracking-wider mb-1">Jul 2025 – Jun 2026 · Completed</div>
                      <div className="text-sm text-white font-medium mb-1">AI &amp; ML Programme (IIT Patna)</div>
                      <p className="text-xs text-slate-300 font-light">Vishlesan i-Hub, IIT Patna (Additional AI/ML Programme).</p>
                    </div>
                  </div>

                  {/* Milestone Summary 3 */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border-amber-400 bg-amber-400 flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-950" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">2026 · Under Evaluation</div>
                      <div className="text-sm text-white font-medium mb-1">Solution Challenge 2026</div>
                      <p className="text-xs text-slate-300 font-light">RESOLVIT entry submitted with Team SΛKRΛ under Build with AI.</p>
                    </div>
                  </div>
                </div>

                {/* Developer Link */}
                <div className="mt-10 pt-6 border-t border-white/10">
                  <a href="https://g.dev/likithai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <span className="text-xs text-slate-200 font-medium">Google Developer Profile</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
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
