import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, Mail } from 'lucide-react';
import SEO from '../components/common/SEO';
import { trackVisit } from '../services/analytics';
import { CONFIG } from '../services/config';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    trackVisit('/404');
  }, []);

  return (
    <>
      <SEO 
        title="404 - Page Not Found | Likith Naidu"
        description="The requested page could not be found."
        meta={[{ name: "robots", content: "noindex, follow" }]}
      />

      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent selection:bg-white/20 selection:text-white text-left">
        <div className="max-w-2xl w-full text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center text-white mx-auto mb-8 animate-pulse">
            <ShieldAlert className="w-10 h-10 text-red-500 opacity-80" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
            Matrix Disruption <br /><span className="text-red-500">404.</span>
          </h1>

          <p className="text-slate-400 text-lg mb-12 font-light leading-relaxed max-w-lg mx-auto">
            The requested node could not be resolved in the current operational environment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-colors"
            >
              <Home className="w-4 h-4" /> Return to Portfolio
            </button>
            <a 
              href={`mailto:${CONFIG.CONTACT.PRIMARY_EMAIL}`} 
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" /> Direct Support
            </a>
          </div>

          <p className="mt-12 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-mono">
            Node status: Unresolved
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
