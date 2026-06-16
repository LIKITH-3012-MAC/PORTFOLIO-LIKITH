import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Cpu, Globe, Database, Layout, Ticket, Waves, Eye, Shield, ShieldCheck, Server, Sparkles, Sliders, Award, Phone, Check, TrendingUp } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const iconMap = {
  cpu: Cpu,
  globe: Globe,
  database: Database,
  layout: Layout,
  ticket: Ticket,
  waves: Waves
};

export const ProjectModal = ({ isOpen, onClose, project }) => {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const IconComponent = iconMap[project.icon] || Cpu;

  // Custom detailed layout for Sakra Vision Event Hub
  if (project.id === 'modal-sakraevents' || project.id === 'sakraevents') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
        
        {/* Modal Content */}
        <div 
          className="modal-content relative w-full max-w-3xl bg-slate-950/95 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.15)] max-h-[85vh] flex flex-col"
          data-lenis-prevent
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white">SAKRA VISION Event Hub</h3>
                <div className="text-xs text-indigo-400 font-mono tracking-widest uppercase">
                  AI-Powered Event Registration, Verification &amp; Participant Communication Platform
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300 font-light text-sm md:text-base leading-relaxed custom-scrollbar text-left">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold font-display mb-2 text-lg">Overview</h4>
                <p className="text-slate-300 font-light text-sm md:text-base leading-relaxed">
                  SAKRA VISION Event Hub is a next-generation AI-powered event operations platform built to replace the limitations of traditional registration systems.
                  While platforms such as Google Forms are useful for collecting basic information, they lack intelligent verification, automated communication workflows, participant lifecycle management, and advanced event administration capabilities.
                  To address these limitations, we engineered a complete event management ecosystem that combines Artificial Intelligence, automation, cloud infrastructure, and real-time communication into a single platform.
                  The platform enables organizers to manage registrations, verify payment submissions, automate participant communication, distribute certificates, track attendance, and operate events from a centralized dashboard.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <h4 className="text-indigo-400 font-semibold font-display mb-2 text-base flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Vision
                </h4>
                <p className="text-slate-300 font-light text-sm md:text-base leading-relaxed">
                  Our goal is simple: Transform traditional event registration into an intelligent, automated, and scalable event operations platform powered by AI.
                  Instead of manually verifying payments, manually sending emails, manually calling participants, and manually issuing certificates, the platform automates the entire workflow from registration to post-event engagement.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold font-display mb-3 text-lg">Core Technology Stack</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Backend &amp; Database
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 font-light">
                    <li>Python &amp; FastAPI (REST API, JWT)</li>
                    <li>Aiven Cloud MySQL (Optimized Relational Models)</li>
                    <li>Cloud-Hosted Participant Management</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5" /> Frontend
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 font-light">
                    <li>Custom Dynamic Form Builder</li>
                    <li>Responsive UI &amp; Mobile-Friendly Registration</li>
                    <li>Admin Operations Dashboard</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Cloud &amp; Deployment
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 font-light">
                    <li>Aiven Cloud Infrastructure</li>
                    <li>Render Deployment</li>
                    <li>Resend Domain Email Infrastructure</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Automation Services
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 font-light">
                    <li>Resend API Email Workflows</li>
                    <li>AI Voice Communication System</li>
                    <li>Attendance &amp; Certificate Engines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold font-display text-lg">AI Receipt Screening Engine</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                  <div className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> The Problem
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Traditional registration systems allow arbitrary image uploads as proof of payment. This leads to fake screenshots, manual verification bottlenecks, high fraud risk, and delayed approvals.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> The Solution
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    SAKRA VISION's built-in intelligent screening engine automatically validates uploaded payment screenshots before permitting submission, eliminating manual overhead.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-white font-semibold text-sm">Receipt Intelligence Features</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> Visual &amp; OCR Analysis
                    </div>
                    <p className="text-xs text-slate-400 font-light">
                      Evaluates layout structure, receipt consistency, transaction summary regions, and payment interface features. Extracts UTR numbers, transaction IDs, reference numbers, amounts, and recipient info via OCR.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Fraud Reduction Logic
                    </div>
                    <p className="text-xs text-slate-400 font-light">
                      Validates success indicators, checks for presence of amount, transaction metadata, app branding, layout structure, and OCR confidence signals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold font-display mb-3 text-lg">Intelligent Registration Workflow</h4>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 overflow-x-auto whitespace-nowrap hide-scrollbar">
                <div className="inline-flex items-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Registration</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Form Submission</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Upload Screenshot</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">AI Screening</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Admin Review</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Approval Decision</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Auto Comm</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Event Participation</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Attendance Tracking</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Certificate Distribution</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" /> Automated Email Infrastructure
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Integrates with Resend API and custom domain email services to trigger automated, branded communication at every major checkpoint of the participant lifecycle.
                </p>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Features</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Confirmations</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Approval Alerts</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Reminders</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Certificates</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Email Workflows &amp; Benefits
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 font-light">
                  <li><strong>Zero manual emailing:</strong> Streamlines organizers' workload.</li>
                  <li><strong>Instant communication:</strong> Professional real-time engagement.</li>
                  <li><strong>Professional branding:</strong> Matches custom domain identity.</li>
                  <li><strong>Announcements:</strong> Broadcast critical administrative updates.</li>
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
              <h4 className="text-white font-semibold font-display text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-400" /> AI Voice Agent Automation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                One of the platform's most advanced capabilities is its AI-powered voice communication system. It integrates intelligent Voice AI agents capable of communicating directly with participants via real phone calls.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-slate-300">
                <div className="space-y-2">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-400" /> Core Capabilities
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong>Confirmations:</strong> Informs about approval status.</li>
                    <li><strong>Schedules:</strong> Shares slot timings and instructions.</li>
                    <li><strong>Dynamic Messages:</strong> Delivers custom admin instructions dynamically.</li>
                    <li><strong>Human-Like:</strong> Natural, conversational real-time dialogs.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-400" /> Status-Based Dialogs
                  </div>
                  <ul className="space-y-1 text-slate-400">
                    <li><span className="text-emerald-400 font-mono text-[11px] font-semibold uppercase mr-1">[Approved]</span> Shares dates, slots, &amp; schedules.</li>
                    <li><span className="text-amber-400 font-mono text-[11px] font-semibold uppercase mr-1">[Pending]</span> Informs about pending verification.</li>
                    <li><span className="text-red-400 font-mono text-[11px] font-semibold uppercase mr-1">[Correction]</span> Guides to fix unclear receipts/resubmit.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" /> Advanced Admin Dashboard
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  The administrative control center provides complete operational visibility, allowing organizers to monitor registrants, manage approvals, trigger Voice AI calls, track attendance, and inspect receipt audits in real time.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">Participant Logs</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">AI Call Trigger</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">Receipt Review</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" /> Attendance &amp; Certificate Engine
                </h4>
                <div className="text-xs text-slate-400 space-y-2 font-light">
                  <p>
                    Auto-generates personalized, high-resolution certificates (with verification support, suitable for LinkedIn &amp; Resume sharing) once attendance is recorded.
                  </p>
                  <div className="p-2 rounded bg-black/40 text-[10px] font-mono text-indigo-300 flex items-center justify-between border border-white/5">
                    <span>Mark Attended</span>
                    <span>&rarr;</span>
                    <span>Thank You Email</span>
                    <span>&rarr;</span>
                    <span>Certificate Link</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" /> Security &amp; Anti-Abuse
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 font-light">
                  <li><strong>JWT &amp; Secure Tokens:</strong> Dynamic authentication and token-based certificate sharing.</li>
                  <li><strong>Anti-Abuse Engine:</strong> Prevents spam submissions with pre-validation screenshot scans.</li>
                  <li><strong>Protected Operations:</strong> Role-based access control for administrative endpoints.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 space-y-3">
                <h4 className="text-white font-semibold font-display text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" /> Platform Highlights
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-medium">
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AI Verification</div>
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Voice Agent Calling</div>
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Email Automation</div>
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Dynamic Certificate</div>
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Attendance Engine</div>
                  <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Admin Dashboard</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold font-display mb-3 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> Future Roadmap
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">WhatsApp Automation</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">Event Analytics</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">AI-Powered Insights</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">QR Attendance</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">Multi-Event Admin</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">Sponsor Portals</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">Automated Feedback</span>
                </div>
              </div>

              <div className="p-5 border-t border-white/10 text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                <p>
                  <strong>Conclusion:</strong> SAKRA VISION Event Hub is more than a registration platform. It is a complete AI-powered event operations ecosystem designed to automate verification, communication, participant management, attendance tracking, and post-event engagement. By combining Artificial Intelligence, automation, cloud infrastructure, and modern communication systems, SAKRA VISION transforms traditional event management into a scalable, intelligent, and professional experience.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/5">
            <a 
              href="https://forms-project-f3sb.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-premium px-5 py-2 text-xs flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Launch App
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Standard project modal layout
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div 
        className="modal-content relative w-full max-w-3xl bg-slate-950/95 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)] max-h-[85vh] flex flex-col"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4 text-left">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-white">{project.title}</h3>
              <div className="text-xs text-slate-400 font-mono tracking-widest uppercase">{project.subtitle}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300 font-light text-sm md:text-base leading-relaxed custom-scrollbar text-left">
          {project.details?.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold font-display mb-2 text-lg">{section.heading}</h4>
              <p>{section.text}</p>
            </div>
          ))}

          {project.specs && (
            <div className="grid grid-cols-2 gap-4">
              {project.specs.map((spec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">{spec.label}</div>
                  <div className="text-xs text-slate-300">{spec.value}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h4 className="text-white font-semibold font-display mb-2 text-lg">Core Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/5">
          {project.sourceUrl && (
            <a 
              href={project.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass px-5 py-2 text-xs flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.liveUrl ? (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-premium px-5 py-2 text-xs flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Live Project
            </a>
          ) : (
            <button 
              onClick={onClose}
              className="btn-glass px-5 py-2 text-xs"
            >
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
