import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, ExternalLink, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { youtubeContent } from '../services/youtubeService';
import { fadeUp, staggerContainer, staggerChild } from '../motion/variants';

export const YouTubePage = () => {
  const [filter, setFilter] = useState('all');
  const [filteredMedia, setFilteredMedia] = useState(youtubeContent);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredMedia(youtubeContent);
    } else {
      setFilteredMedia(youtubeContent.filter(item => item.type === filter));
    }
  }, [filter]);

  const tabs = [
    { label: 'All Artifacts', value: 'all' },
    { label: 'Project Demos', value: 'video' },
    { label: 'Piano Covers', value: 'short' }
  ];

  return (
    <>
      <SEO 
        title="Media Hub | Likith Naidu Anumakonda"
        description="Cinematic media hub showcasing Likith Naidu's AI/ML innovations and creative piano expressions. Experience the intersection of technology and art."
        keywords="Likith Naidu YouTube, AI Demo, Piano Cover, Music Tech, Classical Piano India"
        canonical="https://likith-portfolio.online/youtube"
        image="https://likith-portfolio.online/images/likith/likith-anumakonda-portrait.jpeg"
      />

      <div className="pt-32 pb-24 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-left">
          
          {/* Back link */}
          <Link to="/?source=nav" className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          {/* Header copy */}
          <div className="flex justify-start mb-16">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">Media Ingest</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                Media <br /><span className="text-gradient">Hub.</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed font-light font-sans">
                Cinematic media hub showcasing Likith Naidu's AI/ML innovations and creative piano expressions. Experience the intersection of technology and art.
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-2.5 mb-12"
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`tab-btn px-6 py-2.5 rounded-full border border-white/8 text-slate-400 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  filter === tab.value ? 'active' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Video Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredMedia.map((item) => {
                const isShort = item.type === 'short';

                if (isShort) {
                  return (
                    <motion.div
                      key={item.id}
                      variants={staggerChild}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="short-card glass-panel rounded-3xl border border-white/10 overflow-hidden group text-left relative"
                    >
                      <div className="relative h-full w-full">
                        <iframe 
                          className="w-full h-full border-0 absolute inset-0" 
                          src={item.embed_url} 
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">Piano Short</span>
                          <h3 className="text-white font-bold text-sm leading-tight mb-2">{item.title}</h3>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500">
                            <span>{item.views} Views</span>
                            <span>{item.published}</span>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a 
                            href={item.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors" 
                            title="Watch on YouTube"
                          >
                            <Youtube className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={item.id}
                    variants={staggerChild}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel rounded-3xl border border-white/10 overflow-hidden group text-left flex flex-col"
                  >
                    <div className="video-container">
                      <iframe 
                        src={item.embed_url} 
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-bold text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 uppercase tracking-widest">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.duration}</span>
                      </div>
                      
                      <h3 className="text-white font-bold text-lg mb-3 group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span>{item.views} Views</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span>{item.published}</span>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={item.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-glass text-[10px] py-1.5 px-3"
                          >
                            Watch
                          </a>
                          <a 
                            href={item.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default YouTubePage;
