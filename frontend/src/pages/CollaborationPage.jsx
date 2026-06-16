import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Code, 
  Award, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Instagram, 
  Anchor, 
  Send, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

import SEO from '../components/common/SEO';
import { CONFIG } from '../services/config';
import { GEOGRAPHY_DATA, submitCollaboration } from '../services/collaborationService';
import { trackVisit } from '../services/analytics';
import VerificationModal from '../components/collaboration/VerificationModal';
import CinematicSuccess from '../components/collaboration/CinematicSuccess';

export const CollaborationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form Fields State
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    country: '',
    state: '',
    collaboration_type: '',
    purpose: '',
    organization: '',
    timeline: '',
    email: '',
    budget_range: '',
    preferred_contact_method: 'Email',
    _hp_field: '' // Honeypot bot protection
  });

  const [statesList, setStatesList] = useState([]);
  const [trackingSource, setTrackingSource] = useState('form');
  const [trackingInfo, setTrackingInfo] = useState({});
  const [badgeNote, setBadgeNote] = useState(null);

  // Verification & Submission State
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isSuccessActive, setIsSuccessActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [insertedId, setInsertedId] = useState('');
  const [emailSent, setEmailSent] = useState(null);

  // Cloudflare Turnstile state
  const turnstileRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const mountTimeRef = useRef(Date.now());

  // Helper to extract session tracking
  const getStoredTrackingPayload = () => {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get("source");
    const stored = JSON.parse(sessionStorage.getItem("site_tracking") || "{}");
    
    return {
      source: urlSource || stored.source || "form",
      utm_source: params.get("utm_source") || stored.utm_source || null,
      utm_medium: params.get("utm_medium") || stored.utm_medium || null,
      utm_campaign: params.get("utm_campaign") || stored.utm_campaign || null,
      utm_content: params.get("utm_content") || stored.utm_content || null,
      utm_term: params.get("utm_term") || stored.utm_term || null,
      referrer: stored.ref || document.referrer || null,
      landing_page: stored.landing_page || (window.location.pathname + window.location.search),
      hash_section: stored.hash_section || window.location.hash.replace('#', '') || null
    };
  };

  // Init tracking and prefills
  useEffect(() => {
    trackVisit('/collab');
    mountTimeRef.current = Date.now();

    // Prefill dropdown mapping
    const prefillData = {};
    const mapping = {
      fullname: "full_name",
      phone: "phone_number",
      country: "country",
      state: "state",
      collaboration_type: "collaboration_type",
      purpose: "purpose",
      organization: "organization",
      timeline: "timeline",
      email: "email",
      budget_range: "budget_range",
      preferred_contact_method: "preferred_contact_method"
    };

    let selectedCountry = '';
    mapping && Object.entries(mapping).forEach(([paramKey, formFieldName]) => {
      const val = searchParams.get(paramKey);
      if (val) {
        prefillData[formFieldName] = val;
        if (formFieldName === 'country') {
          selectedCountry = val;
        }
      }
    });

    if (selectedCountry && GEOGRAPHY_DATA[selectedCountry]) {
      setStatesList(Object.keys(GEOGRAPHY_DATA[selectedCountry]));
    }

    setFormData(prev => ({
      ...prev,
      ...prefillData
    }));

    // Source tracking metadata
    const tracking = getStoredTrackingPayload();
    setTrackingSource(tracking.source || 'form');
    setTrackingInfo(tracking);

    // Setup source-note text/badge
    const source = tracking.source;
    const utmSource = tracking.utm_source;
    const hash = tracking.hash_section;

    if (source === 'nav') {
      setBadgeNote({ icon: <Compass className="w-3 h-3 text-slate-400" />, text: 'Opened from Navigation' });
    } else if (source === 'agent') {
      setBadgeNote({ icon: <Cpu className="w-3 h-3 text-amber-400" />, text: 'Opened from im sakra' });
    } else if (source === 'hero') {
      setBadgeNote({ icon: <Zap className="w-3 h-3 text-amber-400" />, text: 'Opened from Hero CTA' });
    } else if (utmSource === 'instagram') {
      setBadgeNote({ icon: <Instagram className="w-3 h-3 text-pink-500" />, text: 'Opened from Instagram' });
    } else if (hash) {
      setBadgeNote({ icon: <Anchor className="w-3 h-3 text-slate-400" />, text: `Context: Section ${hash}` });
    }

  }, [searchParams]);

  // Turnstile script setup
  useEffect(() => {
    let script = document.getElementById('cf-turnstile-script');
    if (!script) {
      script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    let widgetId;
    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current) {
        try {
          widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: CONFIG.TURNSTILE_SITE_KEY,
            callback: (token) => {
              setTurnstileToken(token);
            },
            'expired-callback': () => {
              setTurnstileToken(null);
            },
            'error-callback': () => {
              setTurnstileToken(null);
            }
          });
        } catch (err) {
          console.error('Turnstile render error:', err);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          renderWidget();
          clearInterval(interval);
        }
      }, 100);
      return () => {
        clearInterval(interval);
        if (widgetId && window.turnstile) {
          try {
            window.turnstile.remove(widgetId);
          } catch (e) {}
        }
      };
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {}
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, country, state: '' }));
    if (GEOGRAPHY_DATA[country]) {
      setStatesList(Object.keys(GEOGRAPHY_DATA[country]));
    } else {
      setStatesList([]);
    }
  };

  const validateRequired = () => {
    const required = [
      { name: 'full_name', label: 'Full Name' },
      { name: 'phone_number', label: 'Phone Number' },
      { name: 'country', label: 'Country' },
      { name: 'collaboration_type', label: 'Collaboration Type' },
      { name: 'purpose', label: 'Project Purpose' },
      { name: 'email', label: 'Email' }
    ];

    for (const field of required) {
      if (!formData[field.name].trim()) {
        showError(`Please fill all required fields before proceeding. (${field.label} is required)`);
        const input = document.getElementsByName(field.name)[0];
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
    }
    return true;
  };

  const showError = (msg) => {
    setSubmitError(msg);
    setTimeout(() => {
      setSubmitError('');
    }, 4000);
  };

  const handleSubmitAttempt = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Honeypot bot protection
    if (formData._hp_field) {
      console.warn('Bot detected by Honeypot.');
      return;
    }

    // Speed bot protection
    if (Date.now() - mountTimeRef.current < 3000) {
      console.warn('Bot detected by submit speed.');
      return;
    }

    // Standard fields check
    if (!validateRequired()) return;

    // Cloudflare Turnstile token validation
    if (!turnstileToken) {
      showError('Please complete Cloudflare security verification first.');
      return;
    }

    // Open human check modal
    setIsVerificationOpen(true);
  };

  const handleIdentityVerified = async () => {
    setIsVerificationOpen(false);
    setIsSubmitting(true);

    const payload = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      country: formData.country,
      state: formData.state || null,
      collaboration_type: formData.collaboration_type,
      purpose: formData.purpose,
      organization: formData.organization || null,
      timeline: formData.timeline || null,
      email: formData.email || null,
      budget_range: formData.budget_range || null,
      preferred_contact_method: formData.preferred_contact_method || null,
      turnstile_token: turnstileToken,
      ...trackingInfo
    };

    try {
      const response = await submitCollaboration(payload);
      
      if (response && response.success === true && response.id) {
        setInsertedId(response.id);
        setEmailSent(response.email_sent);
        setIsSuccessActive(true);
      } else {
        navigate(`/problem?result=failed&type=collab&reason=${encodeURIComponent(response?.message || 'db_insert_failed')}`);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      navigate('/problem?result=error&type=collab&state=offline');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      full_name: '',
      phone_number: '',
      country: '',
      state: '',
      collaboration_type: '',
      purpose: '',
      organization: '',
      timeline: '',
      email: '',
      budget_range: '',
      preferred_contact_method: 'Email',
      _hp_field: ''
    });
    setStatesList([]);
    setTurnstileToken(null);
    setInsertedId('');
    setEmailSent(null);
    setIsSuccessActive(false);
    mountTimeRef.current = Date.now();

    // Reload turnstile iframe explicitly
    if (window.turnstile) {
      try {
        window.turnstile.reset();
      } catch (e) {}
    }
  };

  return (
    <>
      <SEO 
        title="Collaborate | Likith Naidu Anumamkonda"
        description="Start a high-end technical collaboration with Likith Naidu Anumamkonda. Founder-grade intake for AI, ML, and creative tech projects."
        keywords="Likith Naidu Collaboration, Partner with Likith, AI Agent Development, Custom SaaS"
        canonical="https://likith-portfolio.online/collab"
      />

      <main className="pt-32 pb-20 px-6 min-h-screen text-slate-200 transition-all duration-1000" id="main-content">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-black mb-6 text-gradient uppercase tracking-tighter">
              Collaborate With Likith
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              Tell me what you want to build, and let's explore how we can create something meaningful together.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-amber-500/70 font-mono text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> All requests are reviewed carefully
            </div>
            
            {/* Context Badge */}
            {badgeNote && (
              <div id="source-note" className="mt-4 flex items-center justify-center gap-2 text-slate-400/80 font-mono text-[10px] uppercase tracking-widest border border-white/5 bg-white/5 py-1.5 px-4 rounded-full w-fit mx-auto shadow-md">
                {badgeNote.icon}
                <span>{badgeNote.text}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>

                <form onSubmit={handleSubmitAttempt} className="space-y-6 relative z-10 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                      <input 
                        type="text" 
                        name="full_name" 
                        required 
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone_number" 
                        required 
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Country *</label>
                      <select 
                        name="country" 
                        required
                        value={formData.country}
                        onChange={handleCountryChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none text-sm cursor-pointer"
                      >
                        <option value="" disabled className="bg-slate-900">Select Country</option>
                        {Object.keys(GEOGRAPHY_DATA).map(country => (
                          <option key={country} value={country} className="bg-slate-900">{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State / Province</label>
                      <select 
                        name="state" 
                        disabled={statesList.length === 0}
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none text-sm cursor-pointer ${statesList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="" disabled className="bg-slate-900">Select State</option>
                        {statesList.map(state => (
                          <option key={state} value={state} className="bg-slate-900">{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Collaboration Type *</label>
                    <select 
                      name="collaboration_type" 
                      required
                      value={formData.collaboration_type}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none text-sm cursor-pointer"
                    >
                      <option value="" disabled className="bg-slate-900">Select Project Category</option>
                      <option value="AI Agent" className="bg-slate-900">AI Agent Development</option>
                      <option value="ML Model" className="bg-slate-900">ML Model Development</option>
                      <option value="Fullstack" className="bg-slate-900">Fullstack Development</option>
                      <option value="Freelance" className="bg-slate-900">Freelance Project</option>
                      <option value="Music" className="bg-slate-900">Music / Creative</option>
                      <option value="Consultation" className="bg-slate-900">AI/ML Consultation</option>
                      <option value="Startup" className="bg-slate-900">Startup Collaboration</option>
                      <option value="Portfolio" className="bg-slate-900">Personal Brand Site</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Purpose / Need *</label>
                    <textarea 
                      name="purpose" 
                      required 
                      rows="4"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Describe your vision or the problem you're solving..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Organization / Brand</label>
                      <input 
                        type="text" 
                        name="organization" 
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corp or Personal"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Expected Timeline</label>
                      <input 
                        type="text" 
                        name="timeline" 
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="e.g. 2 months / Immediate"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Budget Range (Optional)</label>
                      <input 
                        type="text" 
                        name="budget_range" 
                        value={formData.budget_range}
                        onChange={handleInputChange}
                        placeholder="e.g. $1k - $5k"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Contact Method</label>
                    <select 
                      name="preferred_contact_method"
                      value={formData.preferred_contact_method}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none text-sm cursor-pointer"
                    >
                      <option value="Email" className="bg-slate-900">Email</option>
                      <option value="WhatsApp" className="bg-slate-900">WhatsApp / Phone</option>
                      <option value="LinkedIn" className="bg-slate-900">LinkedIn DM</option>
                    </select>
                  </div>

                  {/* Honeypot field (hidden from humans, visible to bots) */}
                  <input 
                    type="text" 
                    name="_hp_field" 
                    value={formData._hp_field}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, zIndex: -1 }} 
                    tabIndex="-1" 
                    autoComplete="off" 
                  />

                  {/* Cloudflare Turnstile Widget */}
                  <div className="flex justify-center mt-6">
                    <div ref={turnstileRef} className="cf-turnstile" />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !turnstileToken}
                    className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                      isSubmitting || !turnstileToken
                        ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed opacity-50'
                        : 'btn-premium hover:scale-[1.01]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Transmitting to Database...</span>
                      </>
                    ) : submitError ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-red-400">{submitError}</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Collaboration Request</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 text-left">
              {/* Why Likith Sidebar Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                <h3 className="text-amber-500 font-display font-bold text-lg mb-6 uppercase tracking-tighter">Why Likith?</h3>
                <ul className="space-y-5">
                  <li className="flex gap-3">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">AI-First Mindset</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Building systems that leverage local LLMs and RAG architecture.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Code className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">Full Stack Mastery</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        End-to-end execution from architecture to premium UI/UX.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">Founder Vision</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Product-driven development with a focus on impact and scale.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Categories Sidebar Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <h3 className="text-blue-400 font-display font-bold text-lg mb-4 uppercase tracking-tighter">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono tracking-wider">
                    GenAI Agents
                  </span>
                  <span className="text-[10px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono tracking-wider">
                    ML Model Dev
                  </span>
                  <span className="text-[10px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono tracking-wider">
                    Custom SaaS
                  </span>
                  <span className="text-[10px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono tracking-wider">
                    Civic Tech
                  </span>
                  <span className="text-[10px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono tracking-wider">
                    Music Tech
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs font-mono uppercase tracking-[0.5em]">
          Likith Naidu Anumamkonda • Secure Collaboration Intake
        </p>
      </footer>

      {/* Identity verification modal */}
      <VerificationModal 
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerified={handleIdentityVerified}
      />

      {/* Cinematic rocket success screen */}
      <CinematicSuccess 
        isActive={isSuccessActive}
        insertedId={insertedId}
        emailSent={emailSent}
        source={trackingSource}
        onReset={handleResetForm}
      />
    </>
  );
};

export default CollaborationPage;
