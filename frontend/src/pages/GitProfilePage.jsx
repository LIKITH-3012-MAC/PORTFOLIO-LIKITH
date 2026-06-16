import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Brain, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { repositories } from '../services/githubService';
import { fadeUp, staggerContainer, staggerChild } from '../motion/variants';

export const GitProfilePage = () => {
  const [filter, setFilter] = useState('all');
  const [filteredRepos, setFilteredRepos] = useState(repositories);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRepos(repositories);
    } else {
      setFilteredRepos(repositories.filter(repo => repo.category === filter));
    }
  }, [filter]);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Featured', value: 'featured' },
    { label: 'AI & ML', value: 'ai-ml' },
    { label: 'Web Tech', value: 'web' },
    { label: 'Experimental', value: 'other' }
  ];

  return (
    <>
      <SEO 
        title="Engineering Archive | Likith Naidu Anumamkonda"
        description="Explore the curated showcase of 22+ public repositories, AI systems, and experimental builds by Likith Naidu Anumamkonda."
        keywords="Likith Naidu GitHub, AI Projects, ML Repositories, Python Code, Open Source AI"
        canonical="https://likith-portfolio.online/git-profile"
      />

      <div className="pt-32 pb-24 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-left">
          
          {/* Header breadcrumb */}
          <Link to="/?source=nav" className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          {/* Title description */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">System Core</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Engineering <br /><span className="text-gradient">Archive.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-light">
              Explore the curated showcase of 22+ public repositories, AI systems, and experimental builds by Likith Naidu Anumamkonda. Curated for performance and modularity.
            </p>
          </motion.div>

          {/* Filtering matrix tabs */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-2.5 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`btn-filter ${filter === cat.value ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Repos Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={filter} // Forces stagger reveal animation reset on filter tab switches
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredRepos.map((repo) => {
                const isAI = repo.language === 'Python' || repo.language === 'Jupyter Notebook';
                return (
                  <motion.div
                    key={repo.name}
                    variants={staggerChild}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="repo-card glass-panel p-8 rounded-3xl border border-white/10 flex flex-col h-full group text-left"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-amber-500/50 transition-colors">
                        {isAI ? <Brain className="w-5 h-5 text-amber-400" /> : <Code className="w-5 h-5 text-blue-400" />}
                      </div>
                      {repo.category === 'featured' && (
                        <span className="text-[9px] font-bold text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 uppercase tracking-widest">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                      {repo.name}
                    </h3>
                    
                    <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 flex-grow">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {repo.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${repo.language === 'Python' ? 'bg-blue-400' : repo.language === 'HTML' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                        <span className="text-xs text-slate-500 font-mono">{repo.language}</span>
                      </div>
                      <a 
                        href={`https://github.com/LIKITH-3012-MAC/${repo.name}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-amber-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
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

export default GitProfilePage;
