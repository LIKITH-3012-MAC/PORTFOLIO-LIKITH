import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Music, Sparkles } from 'lucide-react';
import { pianoInstagramProfile } from '../../data/pianoLinks';
import { fadeUp } from '../../motion/variants';

export const InstagramCard = () => {
  const { profileUrl, username, bio, category, stats } = pianoInstagramProfile;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="relative rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl p-8 md:p-10 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-left"
    >
      {/* Subtle studio lighting accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Left: Avatar placeholder + Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Neutral Instagram-themed avatar placeholder */}
          <div className="relative w-24 h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-600/15" />
              <Instagram className="w-8 h-8 text-white relative z-10" />
              <span className="mt-1 inline-flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-amber-400/90 relative z-10">
                <Music className="w-2.5 h-2.5" /> Piano
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-300">
                <Instagram className="w-3 h-3 text-rose-400" />
                Instagram
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-[10px] font-mono uppercase tracking-widest text-amber-300">
                <Sparkles className="w-3 h-3" />
                {category}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {username}
            </h3>

            <p className="text-slate-300 text-base font-light leading-relaxed">
              {bio}
            </p>
          </div>
        </div>

        {/* Right: Stats + Follow Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-6 pt-6 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="grid grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-xl md:text-2xl font-display font-bold text-white">
                {stats.posts}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Posts
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-display font-bold text-white">
                {stats.followers}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Followers
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-display font-bold text-white">
                {stats.following}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Following
              </div>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-2.5 whitespace-nowrap shadow-[0_8px_30px_rgba(251,191,36,0.25)]"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default InstagramCard;
