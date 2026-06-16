import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Loader2, X } from 'lucide-react';

export const VerificationModal = ({ isOpen, onClose, onVerified }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [mathQuestion, setMathQuestion] = useState('');
  const [mathAnswer, setMathAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRef = useRef(null);
  const checkboxRef = useRef(null);

  // Generate Math Question
  const generateMathQuestion = () => {
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === '+') {
      a = Math.floor(Math.random() * 15) + 3;
      b = Math.floor(Math.random() * 12) + 2;
      ans = a + b;
    } else {
      a = Math.floor(Math.random() * 15) + 8;
      b = Math.floor(Math.random() * (a - 2)) + 1;
      ans = a - b;
    }

    const prefixes = ['What is', 'Solve:', 'Verify:'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    setMathQuestion(`${prefix} ${a} ${op === '-' ? '−' : '+'} ${b} = ?`);
    setMathAnswer(ans);
  };

  // Reset modal when opened/closed
  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
      setAttemptCount(0);
      setUserAnswer('');
      setStatusMessage('');
      setIsError(false);
      setIsVerified(false);
      setIsVerifying(false);
      generateMathQuestion();
      
      // Focus checkbox after short delay for animations
      setTimeout(() => {
        if (checkboxRef.current) checkboxRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleCheckboxClick = () => {
    if (isVerifying || isVerified) return;

    const nextChecked = !isChecked;
    setIsChecked(nextChecked);
    
    if (nextChecked) {
      setStatusMessage('');
      setIsError(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    } else {
      setUserAnswer('');
    }
  };

  const handleVerify = async () => {
    if (isVerifying || isVerified) return;

    setIsError(false);
    setStatusMessage('');

    if (!isChecked) {
      setIsError(true);
      setStatusMessage('Please confirm you are not a robot.');
      return;
    }

    const parsedAnswer = parseInt(userAnswer, 10);
    if (isNaN(parsedAnswer)) {
      setIsError(true);
      setStatusMessage('Please enter a valid answer to the security check.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    if (parsedAnswer !== mathAnswer) {
      const nextAttempts = attemptCount + 1;
      setAttemptCount(nextAttempts);

      const errorMessages = [
        'Incorrect answer. Please try again.',
        'Verification failed. A new check has been generated.',
        'Wrong answer. Focus and try once more.'
      ];
      
      setIsError(true);
      setStatusMessage(errorMessages[Math.min(nextAttempts - 1, errorMessages.length - 1)]);

      if (nextAttempts >= 2) {
        generateMathQuestion();
      }
      setUserAnswer('');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    // Success state
    setIsVerifying(true);
    setStatusMessage('');
    
    // Simulate verification delay (visual feedback)
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsVerifying(false);
    setIsVerified(true);
    
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    onVerified();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="hv-overlay active flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="hv-backdrop" 
        onClick={onClose}
      />
      
      {/* Verification Card */}
      <div className={`hv-card relative max-w-sm w-full z-10 ${isError ? 'shake' : ''}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="hv-close absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Cancel verification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="hv-header flex flex-col items-center text-center">
          <div className="hv-icon-ring mb-4">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="hv-title font-display font-bold text-lg text-white mb-2">Human Verification</h2>
          <p className="hv-subtitle text-xs text-slate-400 max-w-xs leading-relaxed">
            Complete this quick check before securely submitting your collaboration request.
          </p>
        </div>

        {/* Divider */}
        <div className="hv-divider my-4 border-b border-white/5" />

        {/* Box Contents */}
        <div className="space-y-4">
          
          {/* Checkbox wrapper */}
          {!isVerified && (
            <div className="hv-checkbox-row relative flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
              <button
                ref={checkboxRef}
                onClick={handleCheckboxClick}
                className={`hv-checkbox flex items-center gap-3 w-full text-left focus:outline-none`}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
              >
                <div className={`hv-check-box w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all ${isChecked ? 'bg-amber-500 border-amber-500' : 'bg-transparent'}`}>
                  {isChecked && (
                    <svg className="w-3.5 h-3.5 text-slate-950 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="hv-checkbox-label text-sm text-slate-200">I'm not a robot</span>
              </button>
              <div className="hv-verification-pulse absolute inset-0 pointer-events-none rounded-2xl" />
            </div>
          )}

          {/* Math Challenge */}
          {isChecked && !isVerified && (
            <div className={`hv-math-section active space-y-2`}>
              <div className="flex justify-between items-center mb-1">
                <span className="hv-math-tag text-[9px] font-bold text-amber-500 tracking-wider">SECURITY CHECK</span>
                <span className="hv-math-question text-sm font-mono text-slate-200">{mathQuestion}</span>
              </div>
              <div className="hv-input-wrap">
                <input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="hv-math-input w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-center font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  placeholder="Your answer"
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {isError && statusMessage && (
            <div className="hv-error visible text-xs text-red-500 bg-red-950/20 border border-red-500/10 p-3 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Verified State */}
          {isVerified && (
            <div className="hv-verified-state visible flex flex-col items-center justify-center py-4 text-center">
              <div className="hv-verified-icon w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">Identity Verified</span>
            </div>
          )}

        </div>

        {/* Divider */}
        <div className="hv-divider my-4 border-b border-white/5" />

        {/* Footer actions */}
        <div className="hv-actions flex gap-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying || isVerified}
            className={`hv-btn-verify flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isVerifying || isVerified
                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
            type="button"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : isVerified ? (
              <span>Verified</span>
            ) : (
              <span>Verify &amp; Submit</span>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="hv-btn-cancel py-3 px-4 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            type="button"
          >
            Cancel
          </button>
        </div>

        {/* Attempt Counter */}
        {attemptCount > 0 && (
          <div className="hv-footer-meta mt-3 text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            {attemptCount >= 2 ? `ATTEMPT ${attemptCount} • CHALLENGE REFRESHED` : `ATTEMPT ${attemptCount}`}
          </div>
        )}

      </div>
    </div>
  );
};

export default VerificationModal;
