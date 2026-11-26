import React from 'react';
import { Cpu, Globe, Database, Layout, Ticket, Waves, ExternalLink, Github, Info } from 'lucide-react';
import { MagneticCard } from '../effects/MagneticCard';

const iconMap = {
  cpu: Cpu,
  globe: Globe,
  database: Database,
  layout: Layout,
  ticket: Ticket,
  waves: Waves
};

export const ProjectCard = ({ project, onExplore }) => {
  const IconComponent = iconMap[project.icon] || Cpu;
  const categoryType = project.category || 'Software Project';

  return (
    <MagneticCard className="glass-panel rounded-3xl overflow-hidden group flex flex-col h-full text-left relative transition-all duration-500 border border-white/10 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]">
      {/* Subtle Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10 rounded-tl-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10 rounded-tr-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10 rounded-bl-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10 rounded-br-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Visual Screen Header */}
      <div className="aspect-video bg-slate-950 relative overflow-hidden border-b border-white/10 p-8 flex items-center justify-center">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 group-hover:scale-110 transition duration-700`}></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        <IconComponent className="w-16 h-16 text-white/45 group-hover:text-white transition duration-500 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
      </div>
      
      <div className="p-7 sm:p-8 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase mb-1.5 block text-amber-400">
              {categoryType}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
              {project.title}
            </h3>
          </div>
          {project.status && (
            <span className="px-2.5 py-1 bg-white/5 text-slate-300 text-[10px] font-mono tracking-wider uppercase rounded-md border border-white/10 shrink-0">
              {project.status}
            </span>
          )}
        </div>
        
        <p className="text-slate-300 font-light text-sm mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-7">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-mono">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 mt-auto">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live App
            </a>
          )}
          {project.sourceUrl && (
            <a 
              href={project.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> Source
            </a>
          )}
          <button 
            type="button"
            onClick={onExplore}
            className="text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-1.5 transition-colors ml-auto cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" /> Details
          </button>
        </div>
      </div>
    </MagneticCard>
  );
};

export default ProjectCard;
