import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, RefreshCw } from 'lucide-react';

export const CinematicSuccess = ({ isActive, insertedId, emailSent, source, onReset }) => {
  const [glowActive, setGlowActive] = useState(false);
  const [rocketReveal, setRocketReveal] = useState(false);
  const [rocketLifted, setRocketLifted] = useState(false);
  const [flameActive, setFlameActive] = useState(false);
  const [rocketFloating, setRocketFloating] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [badgeActive, setBadgeActive] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [statusActive, setStatusActive] = useState(false);
  const [descActive, setDescActive] = useState(false);
  const [gridActive, setGridActive] = useState(false);
  const [actionsActive, setActionsActive] = useState(false);

  const particlesContainerRef = useRef(null);

  // Sync state transitions when success goes active
  useEffect(() => {
    if (isActive) {
      // Body scroll locking
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      if (window.lenis) window.lenis.stop();

      // Timeline stages
      const t1 = setTimeout(() => setGlowActive(true), 150);
      const t2 = setTimeout(() => setRocketReveal(true), 300);
      const t3 = setTimeout(() => setRocketLifted(true), 500);
      const t4 = setTimeout(() => setFlameActive(true), 800);
      const t5 = setTimeout(() => {
        setRocketLifted(false);
        setRocketFloating(true);
        setParticlesActive(true);
      }, 1000);
      const t6 = setTimeout(() => {
        setBadgeActive(true);
        setTitleActive(true);
      }, 1200);
      const t7 = setTimeout(() => {
        setStatusActive(true);
        setDescActive(true);
      }, 1400);
      const t8 = setTimeout(() => {
        setGridActive(true);
        setActionsActive(true);
      }, 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
        clearTimeout(t7);
        clearTimeout(t8);

        // Reset scroll when unmounting or deactivated
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        if (window.lenis) window.lenis.start();
      };
    } else {
      // Reset all states
      setGlowActive(false);
      setRocketReveal(false);
      setRocketLifted(false);
      setFlameActive(false);
      setRocketFloating(false);
      setParticlesActive(false);
      setBadgeActive(false);
      setTitleActive(false);
      setStatusActive(false);
      setDescActive(false);
      setGridActive(false);
      setActionsActive(false);
    }
  }, [isActive]);

  // Particle Generation Loop
  useEffect(() => {
    if (!particlesActive || !particlesContainerRef.current) return;

    const container = particlesContainerRef.current;
    
    const spawnParticle = () => {
      if (!container) return;
      const p = document.createElement('div');
      p.className = 'exhaust-particle';
      
      const size = Math.random() * 12 + 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      
      const xOffset = (Math.random() - 0.5) * 16;
      p.style.left = `calc(50% + ${xOffset}px)`;
      p.style.top = '10px';
      
      container.appendChild(p);
      
      requestAnimationFrame(() => {
        p.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
        p.style.opacity = '0.8';
        
        const driftX = (Math.random() - 0.5) * 50;
        const driftY = Math.random() * 70 + 40;
        const scaleEnd = Math.random() * 0.4 + 0.1;
        
        p.style.transform = `translate(${driftX}px, ${driftY}px) scale(${scaleEnd})`;
        p.style.opacity = '0';
      });
      
      setTimeout(() => {
        p.remove();
      }, 1500);
    };

    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnParticle, i * 100);
    }

    const interval = setInterval(spawnParticle, 70);
    return () => clearInterval(interval);
  }, [particlesActive]);

  const sourceLabels = {
    'nav': 'Navigation',
    'agent': 'Likith’s AI Agent',
    'form': 'Collaboration Form',
    'footer': 'Footer',
    'hero': 'Hero Section',
    'email': 'Email Link'
  };
  const friendlySource = sourceLabels[source] || sourceLabels['form'] || 'Collaboration Form';

  let statusBadge = '';
  let descText = '';
  if (emailSent === true) {
    statusBadge = 'Premium Confirmation Sent';
    descText = 'Your collaboration request has successfully entered the Sakra execution ecosystem. A confirmation message has been dispatched to your email address.';
  } else if (emailSent === false) {
    statusBadge = 'Email Dispatch Interrupted';
    descText = 'Your request has been securely stored in the SAKRA database. Although the confirmation email was interrupted, Likith Naidu will review your details manually.';
  } else {
    statusBadge = 'Request Stored';
    descText = 'Thank you for collaborating. Your request has successfully entered the Sakra ecosystem.';
  }

  if (!isActive) return null;

  return (
    <div id="cinematic-success" className="success-stage active" data-lenis-prevent="true">
      {/* Atmosphere Layer */}
      <div id="rocket-atmosphere" className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Animation Stage */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center px-4 py-8">
        
        {/* Rocket & Glow Area */}
        <div id="rocket-stage" className="relative">
          {/* Glow System Behind Rocket */}
          <div className={`glow-layer w-[240px] h-[240px] bg-[radial-gradient(circle,rgba(168,85,247,0.25)_0%,transparent_70%)] blur-[50px] ${glowActive ? 'active' : ''}`} />
          <div className={`glow-layer w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,transparent_70%)] blur-[40px] ${glowActive ? 'active' : ''}`} />
          <div className={`glow-layer w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_60%)] blur-[25px] ${glowActive ? 'active' : ''}`} />
          
          {/* Rocket Unit Container */}
          <div 
            id="rocket-unit" 
            className={`rocket-container ${rocketReveal ? 'reveal' : ''} ${rocketLifted ? 'lifted' : ''} ${rocketFloating ? 'floating' : ''}`}
          >
            {/* Exhaust Particles Container */}
            <div ref={particlesContainerRef} id="exhaust-particles" className="exhaust-particles-container" />
            
            {/* SVG Rocket */}
            <svg viewBox="0 0 120 220" className="rocket-svg drop-shadow-[0_10px_30px_rgba(56,189,248,0.2)]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="rocket-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
                  <stop offset="40%" stopColor="rgba(255, 255, 255, 0.05)" />
                  <stop offset="100%" stopColor="rgba(15, 23, 42, 0.2)" />
                </linearGradient>
                <linearGradient id="rocket-glass-shine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                  <stop offset="30%" stopColor="rgba(255, 255, 255, 0.05)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="rocket-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="rocket-fin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
                  <stop offset="100%" stopColor="rgba(30, 41, 59, 0.5)" />
                </linearGradient>
                <linearGradient id="flame-core-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="20%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Thruster Flame */}
              <g className={`thruster-flame ${flameActive ? 'active' : ''}`} id="thruster-flame-group">
                <path d="M 52,175 Q 60,225 68,175 Q 60,185 52,175 Z" fill="url(#flame-core-grad)" opacity="0.9" />
                <path d="M 46,175 Q 60,240 74,175 Q 60,195 46,175 Z" fill="url(#flame-core-grad)" opacity="0.4" filter="blur(2px)" />
              </g>

              {/* Wings */}
              <path d="M 36,140 Q 15,165 10,180 Q 25,182 36,170 Z" fill="url(#rocket-fin-grad)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
              <path d="M 84,140 Q 105,165 110,180 Q 95,182 84,170 Z" fill="url(#rocket-fin-grad)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
              
              {/* Engine Nozzle */}
              <path d="M 48,165 L 72,165 L 68,176 L 52,176 Z" fill="#334155" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              
              {/* Body */}
              <path d="M 60,20 C 32,80 36,130 36,165 L 84,165 C 84,130 88,80 60,20 Z" fill="url(#rocket-body-grad)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
              
              {/* Shine */}
              <path d="M 60,22 C 34,80 38,128 38,163 L 42,163 C 42,128 38,80 60,24 Z" fill="url(#rocket-glass-shine)" opacity="0.6" />
              
              {/* Window */}
              <circle cx="60" cy="85" r="16" fill="rgba(15, 23, 42, 0.5)" stroke="url(#rocket-accent-grad)" strokeWidth="2.5" />
              <circle cx="60" cy="85" r="11" fill="url(#rocket-glass-shine)" opacity="0.3" />
              <path d="M 53,78 A 11,11 0 0 1 67,78" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Accent */}
              <path d="M 60,115 L 60,145" stroke="url(#rocket-accent-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Success Content */}
        <div id="success-content" className="success-message-container w-full flex flex-col items-center">
          
          {/* Identity Verified Badge */}
          <div className={`success-fade-in-up flex items-center justify-center gap-2 mb-4 ${badgeActive ? 'active' : ''}`} id="success-badge-verify">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
              <Check className="w-3 h-3" />
              Identity Verified
            </span>
          </div>
          
          {/* Main Title */}
          <h2 id="success-title" className={`success-fade-in-up font-display font-black text-white tracking-tighter text-3xl md:text-5xl mb-3 text-center uppercase ${titleActive ? 'active' : ''}`}>
            Launch Confirmed
          </h2>
          
          {/* Status Pill */}
          <div id="success-status-pill" className={`success-fade-in-up mb-6 ${statusActive ? 'active' : ''}`}>
            <span className={`text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border ${
              emailSent === true
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : emailSent === false
                ? 'text-amber-400 bg-amber-950/40 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'text-slate-400 bg-slate-900/40 border-slate-700/20'
            }`}>
              {statusBadge}
            </span>
          </div>
          
          {/* Description */}
          <p id="success-desc" className={`success-fade-in-up text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto mb-8 text-center ${descActive ? 'active' : ''}`}>
            {descText}
          </p>
          
          {/* Reference Grid */}
          <div id="success-reference-grid" className={`success-fade-in-up w-full max-w-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md mb-8 text-left ${gridActive ? 'active' : ''}`}>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Reference ID</span>
              <span className="text-xs text-slate-200 font-mono font-semibold">REQ-{insertedId || 'PENDING'}</span>
            </div>
            <div className="flex flex-col gap-1 border-t border-white/5 pt-3 md:border-t-0 md:pt-0 md:border-l md:pl-4">
              <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Traffic Origin</span>
              <span className="text-xs text-slate-200 font-mono font-semibold">{friendlySource}</span>
            </div>
            <div className="flex flex-col gap-1 border-t border-white/5 pt-3 md:border-t-0 md:pt-0 md:border-l md:pl-4">
              <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Email Status</span>
              <span className={`text-xs ${emailSent ? 'text-emerald-400' : 'text-amber-400'} font-mono font-semibold uppercase tracking-wider flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${emailSent ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {emailSent ? 'Dispatched' : 'Pending'}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div id="success-actions" className={`success-fade-in-up flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md ${actionsActive ? 'active' : ''}`}>
            <Link 
              to="/?source=collab" 
              onClick={() => {
                // Ensure scroll locks are cleaned up when returning via Link
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                document.body.style.height = '';
              }}
              className="btn-premium flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>Back to Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button 
              onClick={onReset}
              className="px-6 py-3 rounded-full border border-white/5 bg-white/5 text-slate-200 hover:text-white opacity-60 hover:opacity-100 flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-xs uppercase tracking-wider font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Submit Another
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CinematicSuccess;
