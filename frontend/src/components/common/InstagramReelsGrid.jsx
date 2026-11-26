import React from 'react';
import { Instagram, Play, ExternalLink } from 'lucide-react';
import { instagramReels } from '../../data/pianoLinks';

export const InstagramReelsGrid = ({ reels = instagramReels, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {reels.map((reel) => (
        <a
          key={reel.id}
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${reel.label} on Instagram (opens in a new tab)`}
          className="glass-panel rounded-3xl border border-white/10 overflow-hidden group flex flex-col text-left transition-all duration-300 hover:border-rose-400/40 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(244,63,94,0.12)] focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          {/* Instagram-branded preview container (no external scraping or unstable embeds) */}
          <div className="relative aspect-[4/3] sm:aspect-[4/5] w-full bg-slate-950/90 overflow-hidden flex items-center justify-center border-b border-white/10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/15 via-rose-500/15 to-purple-600/20 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl" />

            {/* Top badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-widest text-slate-200">
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span>Instagram Reel</span>
            </div>

            {/* Centered Play affordance */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:bg-rose-500/25 group-hover:border-rose-300/60">
                <Play className="w-7 h-7 text-white fill-white/90 translate-x-0.5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300">
                {reel.label}
              </span>
            </div>
          </div>

          {/* Card footer action */}
          <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
            <div className="min-w-0">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-rose-300/90">
                Instagram Reel
              </span>
              <h3 className="text-base font-display font-semibold text-white">
                {reel.label}
              </h3>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400 transition-colors duration-300">
              <span>Watch on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default InstagramReelsGrid;
