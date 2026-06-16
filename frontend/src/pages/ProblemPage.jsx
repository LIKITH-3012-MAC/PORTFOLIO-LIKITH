import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, RotateCcw, Mail, Home } from 'lucide-react';
import SEO from '../components/common/SEO';
import { trackVisit } from '../services/analytics';
import { CONFIG } from '../services/config';

export const ProblemPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const result = searchParams.get("result");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const token = searchParams.get("token");

  useEffect(() => {
    trackVisit('/problem');
  }, []);

  // Define Default Messaging
  let title = "System Anomaly.";
  let message = "Likith's architecture encountered a technical interruption. Your request may not have been fully processed.";
  let statusText = `Anomaly: ${type || 'System'} • State: ${state || 'Interrupted'} • Code: ${code || '500'}`;
  
  let buttons = (
    <>
      <button 
        onClick={() => navigate(-1)} 
        className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Retry Action
      </button>
      <a 
        href={`mailto:${CONFIG.CONTACT.PRIMARY_EMAIL}`} 
        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        <Mail className="w-4 h-4" /> Direct Support
      </a>
    </>
  );

  // Context-Specific Refinement
  if (code === '500') {
    message = "The secure database transmission was interrupted. This is likely a temporary system maintenance state.";
  } else if (state === 'offline') {
    message = "The backend service is currently unreachable. Please check your connection or try again later.";
  } else if (result === 'success' && token) {
    title = "Legacy Verification.";
    message = "Success states are now handled directly on the collaboration page. Your token confirms a valid submission.";
    buttons = (
      <button 
        onClick={() => navigate('/')} 
        className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-colors"
      >
        <Home className="w-4 h-4" /> Return to Portfolio
      </button>
    );
    statusText = `Status: Logged • ID: ${id}`;
  }

  return (
    <>
      <SEO 
        title="System Interruption | Likith Naidu"
        description="Support and fallback page for Likith Naidu's portfolio. Technical anomalies are logged here."
        meta={[{ name: "robots", content: "noindex, follow" }]}
      />

      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent selection:bg-white/20 selection:text-white text-left">
        <div className="max-w-2xl w-full text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center text-white mx-auto mb-8 animate-pulse">
            <ShieldAlert className="w-10 h-10 text-amber-500 opacity-80" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
            {title}
          </h1>

          <p className="text-slate-400 text-lg mb-12 font-light leading-relaxed max-w-lg mx-auto">
            {message}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {buttons}
          </div>

          <p className="mt-12 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-mono">
            {statusText}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProblemPage;
