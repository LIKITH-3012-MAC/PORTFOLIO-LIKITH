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

  // Determine tag style based on category
  const isAI = project.tags.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('ml') || t.toLowerCase().includes('model'));
  const categoryType = isAI ? 'AI Project' : 'Data System';

  return (
    <MagneticCard className="glass-panel rounded-3xl overflow-hidden group flex flex-col h-full text-left relative transition-all duration-500 border border-white/5 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]">
      {/* Holographic Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10 rounded-tl-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10 rounded-tr-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10 rounded-bl-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10 rounded-br-xl group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Visual Screen Header */}
      <div className="aspect-video bg-slate-950 relative overflow-hidden border-b border-white/10 p-8 flex items-center justify-center">
        {/* Dynamic color backdrops */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 group-hover:scale-110 transition duration-700`}></div>
        
        {/* Holographic scanner mesh lines */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        
        {/* Reflection light sweep */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        <IconComponent className={`w-16 h-16 text-white/40 group-hover:text-white transition duration-500 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]`} />
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-[8px] font-mono tracking-widest uppercase mb-1 block ${isAI ? 'text-amber-400' : 'text-blue-400'}`}>
              {categoryType}
            </span>
            <h3 className="text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
              {project.title}
            </h3>
          </div>
          {project.badge && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-mono tracking-widest uppercase rounded border border-amber-500/20">
              {project.badge}
            </span>
          )}
        </div>
        
        <p className="text-slate-400 font-light text-sm mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 font-mono">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-auto">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View App
            </a>
          )}
          {project.sourceUrl && (
            <a 
              href={project.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> Source
            </a>
          )}
          <button 
            onClick={onExplore}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors ml-auto"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" /> Details
          </button>
        </div>
      </div>
    </MagneticCard>
  );
};

export default ProjectCard;
