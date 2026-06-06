document.addEventListener('DOMContentLoaded', () => {
    const collabForm = document.getElementById('collab-form');
    if (!collabForm) return;

    // ═══ STATE ═══
    let isRobotChecked = false;
    let mathAnswer = null;
    let attemptCount = 0;
    let isSubmitting = false;
    let formOpenTimestamp = Date.now(); // Anti-spam: track when page loaded

    // ═══ GEOGRAPHY CASCADING LOGIC ═══
    const GEOGRAPHY_DATA = {
        "India": {
            "Andhra Pradesh": {},
            "Arunachal Pradesh": {},
            "Assam": {},
            "Bihar": {},
            "Chhattisgarh": {},
            "Goa": {},
            "Gujarat": {},
            "Haryana": {},
            "Himachal Pradesh": {},
            "Jharkhand": {},
            "Karnataka": {},
            "Kerala": {},
            "Madhya Pradesh": {},
            "Maharashtra": {},
            "Manipur": {},
            "Meghalaya": {},
            "Mizoram": {},
            "Nagaland": {},
            "Odisha": {},
            "Punjab": {},
            "Rajasthan": {},
            "Sikkim": {},
            "Tamil Nadu": {},
            "Telangana": {},
            "Tripura": {},
            "Uttar Pradesh": {},
            "Uttarakhand": {},
            "West Bengal": {},
            "Andaman and Nicobar Islands": {},
            "Chandigarh": {},
            "Dadra and Nagar Haveli and Daman and Diu": {},
            "Delhi": {},
            "Jammu and Kashmir": {},
            "Ladakh": {},
            "Lakshadweep": {},
            "Puducherry": {}
        },
        "USA": {
            "Alabama": {},
            "Alaska": {},
            "Arizona": {},
            "Arkansas": {},
            "California": {},
            "Colorado": {},
            "Connecticut": {},
            "Delaware": {},
            "Florida": {},
            "Georgia": {},
            "Hawaii": {},
            "Idaho": {},
            "Illinois": {},
            "Indiana": {},
            "Iowa": {},
            "Kansas": {},
            "Kentucky": {},
            "Louisiana": {},
            "Maine": {},
            "Maryland": {},
            "Massachusetts": {},
            "Michigan": {},
            "Minnesota": {},
            "Mississippi": {},
            "Missouri": {},
            "Montana": {},
            "Nebraska": {},
            "Nevada": {},
            "New Hampshire": {},
            "New Jersey": {},
            "New Mexico": {},
            "New York": {},
            "North Carolina": {},
            "North Dakota": {},
            "Ohio": {},
            "Oklahoma": {},
            "Oregon": {},
            "Pennsylvania": {},
            "Rhode Island": {},
            "South Carolina": {},
            "South Dakota": {},
            "Tennessee": {},
            "Texas": {},
            "Utah": {},
            "Vermont": {},
            "Virginia": {},
            "Washington": {},
            "West Virginia": {},
            "Wisconsin": {},
            "Wyoming": {}
        },
        "Other": { "Global": { "International": ["Other Region"] } }
    };

    const countrySelect = document.getElementById('country-select');
    const stateSelect = document.getElementById('state-select');

    // Init Countries
    countrySelect.innerHTML = '<option value="" disabled selected>Select Country</option>';
    Object.keys(GEOGRAPHY_DATA).forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener('change', () => {
        const states = GEOGRAPHY_DATA[countrySelect.value];
        stateSelect.innerHTML = '<option value="" disabled selected>Select State</option>';
        stateSelect.disabled = false;
        stateSelect.classList.remove('opacity-50');
        
        Object.keys(states).forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    });

    // ═══ FORM PREFILL LOGIC ═══
    function prefillCollabFormFromURL() {
        if (!window.Navigation) return;

        const tracking = window.Navigation.getUrlTracking();
        const storedTracking = JSON.parse(sessionStorage.getItem("site_tracking") || "{}");
        
        // Priority: 1. Current URL, 2. Stored Session
        const source = tracking.source || storedTracking.source;
        const hash = tracking.hash_section || storedTracking.hash_section;
        const utmSource = tracking.utm_source || storedTracking.utm_source;
        
        const sourceNoteEl = document.getElementById('source-note');
        if (sourceNoteEl) {
            if (source === 'nav') {
                sourceNoteEl.innerHTML = `<i data-lucide="compass" class="w-3 h-3"></i> Opened from Navigation`;
                sourceNoteEl.classList.remove('hidden');
            } else if (source === 'agent') {
                sourceNoteEl.innerHTML = `<i data-lucide="cpu" class="w-3 h-3 text-amber-400"></i> Opened from im sakra`;
                sourceNoteEl.classList.remove('hidden');
            } else if (source === 'hero') {
                sourceNoteEl.innerHTML = `<i data-lucide="zap" class="w-3 h-3 text-amber-400"></i> Opened from Hero CTA`;
                sourceNoteEl.classList.remove('hidden');
            } else if (utmSource === 'instagram') {
                sourceNoteEl.innerHTML = `<i data-lucide="instagram" class="w-3 h-3 text-pink-500"></i> Opened from Instagram`;
                sourceNoteEl.classList.remove('hidden');
            } else if (hash) {
                sourceNoteEl.innerHTML = `<i data-lucide="anchor" class="w-3 h-3"></i> Context: Section ${hash}`;
                sourceNoteEl.classList.remove('hidden');
            }
        }

        const params = new URLSearchParams(window.location.search);
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

        for (const [paramKey, formFieldName] of Object.entries(mapping)) {
            const val = params.get(paramKey);
            if (val) {
                const input = collabForm.querySelector(`[name="${formFieldName}"]`);
                if (input) {
                    if (formFieldName === 'country') {
                        let optionExists = Array.from(input.options).some(opt => opt.value === val);
                        if (optionExists) {
                            input.value = val;
                            input.dispatchEvent(new Event('change'));
                        }
                    } else if (input.tagName === 'SELECT') {
                        let optionExists = Array.from(input.options).some(opt => opt.value === val);
                        if (optionExists) {
                            input.value = val;
                        }
                    } else {
                        input.value = val;
                    }
                }
            }
        }
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Execute prefill after dropdowns are initialized
    prefillCollabFormFromURL();


    // ═══════════════════════════════════════════════════
    // VERIFICATION SYSTEM
    // ═══════════════════════════════════════════════════

    const overlay = document.getElementById('verification-overlay');
    const card = document.getElementById('hv-card');
    const checkbox = document.getElementById('hv-checkbox');
    const pulse = document.getElementById('hv-pulse');
    const mathSection = document.getElementById('hv-math-section');
    const mathQuestion = document.getElementById('hv-math-question');
    const mathInput = document.getElementById('hv-math-input');
    const errorEl = document.getElementById('hv-error');
    const verifiedState = document.getElementById('hv-verified-state');
    const verifyBtn = document.getElementById('hv-btn-verify');
    const cancelBtn = document.getElementById('hv-btn-cancel');
    const closeBtn = document.getElementById('hv-close');
    const backdrop = document.getElementById('hv-backdrop');
    const footerMeta = document.getElementById('hv-footer-meta');

    // ── Math Question Generator ──
    function generateMathQuestion() {
        const ops = ['+', '−'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;
        
        if (op === '+') {
            a = Math.floor(Math.random() * 15) + 3;
            b = Math.floor(Math.random() * 12) + 2;
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 15) + 8;
            b = Math.floor(Math.random() * (a - 2)) + 1;
            answer = a - b;
        }

        const prefixes = ['What is', 'Solve:', 'Verify:'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        mathQuestion.textContent = `${prefix} ${a} ${op} ${b} = ?`;
        mathAnswer = answer;
    }

    // ── Open Verification Modal ──
    function openVerification() {
        // Reset state
        isRobotChecked = false;
        attemptCount = 0;
        isSubmitting = false;

        checkbox.classList.remove('checked');
        checkbox.setAttribute('aria-checked', 'false');
        mathSection.classList.remove('active');
        mathInput.value = '';
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
        verifiedState.classList.remove('visible');
        verifyBtn.classList.remove('loading');
        card.classList.remove('shake');
        footerMeta.textContent = '';

        generateMathQuestion();

        // Show modal
        overlay.classList.add('active');

        // Focus trap start
        setTimeout(() => checkbox.focus(), 400);
    }

    // ── Close Verification Modal ──
    function closeVerification() {
        overlay.classList.remove('active');
        isSubmitting = false;
    }

    // ── Checkbox Toggle ──
    checkbox.addEventListener('click', () => {
        if (isSubmitting) return;

        isRobotChecked = !isRobotChecked;
        checkbox.classList.toggle('checked', isRobotChecked);
        checkbox.setAttribute('aria-checked', isRobotChecked ? 'true' : 'false');

        // Trigger pulse
        pulse.classList.remove('pulse');
        void pulse.offsetWidth; // Force reflow
        pulse.classList.add('pulse');

        // Activate math section
        if (isRobotChecked) {
            mathSection.classList.add('active');
            setTimeout(() => mathInput.focus(), 400);
        } else {
            mathSection.classList.remove('active');
            mathInput.value = '';
        }

        // Clear errors
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
    });

    // ── Enter key on math input triggers verify ──
    mathInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleVerification();
        }
    });

    // ── Verify Button ──
    verifyBtn.addEventListener('click', () => handleVerification());

    // ── Close handlers ──
    cancelBtn.addEventListener('click', closeVerification);
    closeBtn.addEventListener('click', closeVerification);
    backdrop.addEventListener('click', closeVerification);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeVerification();
        }
    });

    // ── Core Verification Logic ──
    async function handleVerification() {
        if (isSubmitting) return;

        // Clear previous errors
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
        card.classList.remove('shake');

        // Check 1: Robot checkbox
        if (!isRobotChecked) {
            showError('Please confirm you are not a robot.');
            triggerShake();
            return;
        }

        // Check 2: Math answer
        const userAnswer = parseInt(mathInput.value, 10);
        if (isNaN(userAnswer)) {
            showError('Please enter a valid answer to the security check.');
            triggerShake();
            mathInput.focus();
            return;
        }

        if (userAnswer !== mathAnswer) {
            attemptCount++;
            const messages = [
                'Incorrect answer. Please try again.',
                'Verification failed. A new check has been generated.',
                'Wrong answer. Focus and try once more.'
            ];
            showError(messages[Math.min(attemptCount - 1, messages.length - 1)]);
            triggerShake();
            
            // Regenerate after 2nd failed attempt
            if (attemptCount >= 2) {
                generateMathQuestion();
                footerMeta.textContent = `ATTEMPT ${attemptCount} • CHALLENGE REFRESHED`;
            } else {
                footerMeta.textContent = `ATTEMPT ${attemptCount}`;
            }
            
            mathInput.value = '';
            mathInput.focus();
            return;
        }

        // ── Verification Passed ──
        isSubmitting = true;

        // Show verified state
        mathSection.classList.remove('active');
        checkbox.style.display = 'none';
        verifiedState.classList.add('visible');
        footerMeta.textContent = 'IDENTITY CONFIRMED • TRANSMITTING...';

        // Put verify button in loading state
        verifyBtn.classList.add('loading');

        // Small delay for visual feedback, then submit to backend
        await new Promise(r => setTimeout(r, 800));

        // Close verification modal smoothly
        closeVerification();

        // Now submit to backend
        await submitToBackend();
    }

    // ── Error display ──
    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
    }

    // ── Shake effect ──
    function triggerShake() {
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
    }


    // ═══════════════════════════════════════════════════
    // FORM SUBMISSION FLOW
    // ═══════════════════════════════════════════════════

    collabForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Check honeypot
        const honeypot = document.getElementById('hp-field');
        if (honeypot && honeypot.value) {
            // Bot detected — silently fail
            console.warn('Honeypot triggered.');
            return;
        }

        // Anti-speed check: if less than 3 seconds since page load, likely a bot
        if (Date.now() - formOpenTimestamp < 3000) {
            console.warn('Submission too fast.');
            return;
        }

        // Validate required fields
        if (!validateRequiredFields()) return;

        // Open verification modal
        openVerification();
    });

    // ── Field Validation ──
    function validateRequiredFields() {
        const requiredFields = [
            { name: 'full_name', label: 'Full Name' },
            { name: 'phone_number', label: 'Phone Number' },
            { name: 'country', label: 'Country' },
            { name: 'collaboration_type', label: 'Collaboration Type' },
            { name: 'purpose', label: 'Project Purpose' },
            { name: 'email', label: 'Email' }
        ];

        let firstInvalid = null;

        for (const field of requiredFields) {
            const input = collabForm.querySelector(`[name="${field.name}"]`);
            if (!input || !input.value.trim()) {
                // Highlight the field
                input.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                input.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.1)';
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }, 3000);

                if (!firstInvalid) firstInvalid = input;
            }
        }

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Show premium inline notification on submit button
            showPremiumError('Please fill all required fields before proceeding.');
            return false;
        }

        return true;
    }

    // ── Backend Submission ──
    async function submitToBackend() {
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        const formData = new FormData(collabForm);
        const data = Object.fromEntries(formData.entries());

        // Remove honeypot from payload
        delete data._hp_field;

        const payload = {
            full_name: data.full_name,
            phone_number: data.phone_number,
            country: data.country,
            state: data.state || null,
            collaboration_type: data.collaboration_type,
            purpose: data.purpose,
            organization: data.organization || null,
            timeline: data.timeline || null,
            email: data.email || null,
            budget_range: data.budget_range || null,
            preferred_contact_method: data.preferred_contact_method || null,
            
            // Tracking Metadata (Prioritize session storage captured on landing)
            ...window.getStoredTrackingPayload()
        };

        // Premium Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span class="tracking-widest uppercase text-xs font-bold">Transmitting to Database...</span>
            </div>
        `;

        try {
            const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/api/collab`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // System level error
                if (window.navigateToProblem) {
                    window.navigateToProblem({ result: 'failed', type: 'collab', code: response.status });
                } else {
                    window.location.href = `problem.html?result=failed&type=collab&code=${response.status}`;
                }
                return;
            }

            const data = await response.json();

            if (data.success === true && data.id) {
                // SUCCESS: Backend confirmed MySQL storage and returned ID
                // We prioritize source returned from backend, or fallback to the one we sent
                const finalSource = data.source || payload.source || "form";
                triggerCinematicSuccess(data.id, data.token, data.email_sent, finalSource);
            } else {
                // API returned success false or missing ID
                if (window.navigateToProblem) {
                    window.navigateToProblem({ result: 'failed', type: 'collab', reason: data.message || 'db_insert_failed' });
                } else {
                    window.location.href = `problem.html?result=failed&type=collab&reason=${encodeURIComponent(data.message || 'db_insert_failed')}`;
                }
            }
        } catch (error) {
            console.error('Transmission Error:', error);
            if (window.navigateToProblem) {
                window.navigateToProblem({ result: 'error', type: 'collab', state: 'offline' });
            } else {
                window.location.href = `problem.html?result=error&type=collab&state=offline`;
            }
            isSubmitting = false;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            if (window.lucide) lucide.createIcons();
        }
    }


    // ═══════════════════════════════════════════════════
    // CINEMATIC SUCCESS ANIMATION (unchanged core logic)
    // ═══════════════════════════════════════════════════

    // Helper function for spawning particles under the engine nozzle
    function startExhaustParticles(container) {
        if (!container) return null;
        const spawnParticle = () => {
            const p = document.createElement('div');
            p.className = 'exhaust-particle';
            
            // Random size (6px to 18px)
            const size = Math.random() * 12 + 6;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            
            // Random horizontal position near center
            const xOffset = (Math.random() - 0.5) * 16; // -8px to +8px
            p.style.left = `calc(50% + ${xOffset}px)`;
            p.style.top = '10px';
            
            container.appendChild(p);
            
            // Animate using hardware-accelerated CSS transitions
            requestAnimationFrame(() => {
                p.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
                p.style.opacity = '0.8';
                
                // Drift calculations
                const driftX = (Math.random() - 0.5) * 50; // -25px to +25px
                const driftY = Math.random() * 70 + 40; // 40px to 110px
                const scaleEnd = Math.random() * 0.4 + 0.1;
                
                p.style.transform = `translate(${driftX}px, ${driftY}px) scale(${scaleEnd})`;
                p.style.opacity = '0';
            });
            
            // Remove from DOM when done
            setTimeout(() => {
                p.remove();
            }, 1500);
        };
        
        // Trigger initial burst of particles
        for (let i = 0; i < 5; i++) {
            setTimeout(spawnParticle, i * 100);
        }
        
        return setInterval(spawnParticle, 70);
    }

    function triggerCinematicSuccess(insertedId, token, emailSent, source) {
        const stage = document.getElementById('cinematic-success');
        const rocket = document.getElementById('rocket-unit');
        const content = document.getElementById('success-content');
        const form = document.getElementById('collab-form');
        
        const sourceLabels = {
            'nav': 'Navigation',
            'agent': 'Likith’s AI Agent',
            'form': 'Collaboration Form',
            'footer': 'Footer',
            'hero': 'Hero Section',
            'email': 'Email Link'
        };
        const friendlySource = sourceLabels[source] || sourceLabels['form'] || 'Collaboration Form';

        // Set up the premium HTML content structure
        let statusBadge = '';
        let descText = '';
        if (emailSent === true) {
            statusBadge = `<span class="text-emerald-400 text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">Premium Confirmation Sent</span>`;
            descText = `Your collaboration request has successfully entered the <span class="text-white font-semibold">Sakra</span> execution ecosystem. A confirmation message has been dispatched to your email address.`;
        } else if (emailSent === false) {
            statusBadge = `<span class="text-amber-400 text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">Email Dispatch Interrupted</span>`;
            descText = `Your request has been securely stored in the SAKRA database. Although the confirmation email was interrupted, Likith Naidu will review your details manually.`;
        } else {
            statusBadge = `<span class="text-slate-400 text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-slate-900/40 border border-slate-700/20">Request Stored</span>`;
            descText = `Thank you for collaborating. Your request has successfully entered the <span class="text-white font-semibold">Sakra</span> ecosystem.`;
        }

        if (content) {
            content.innerHTML = `
                <!-- Step 1: Verification Badge -->
                <div class="success-fade-in-up flex items-center justify-center gap-2 mb-4" id="success-badge-verify">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Identity Verified
                    </span>
                </div>
                
                <!-- Step 2: Main Title -->
                <h2 id="success-title" class="success-fade-in-up font-display font-black text-white tracking-tighter text-3xl md:text-5xl mb-3 text-center uppercase">
                    Launch Confirmed
                </h2>
                
                <!-- Step 3: Status Pill -->
                <div id="success-status-pill" class="success-fade-in-up mb-6">
                    ${statusBadge}
                </div>
                
                <!-- Step 4: Description -->
                <p id="success-desc" class="success-fade-in-up text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto mb-8 text-center">
                    ${descText}
                </p>
                
                <!-- Step 5: Reference Grid -->
                <div id="success-reference-grid" class="success-fade-in-up w-full max-w-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md mb-8 text-left">
                    <div class="flex flex-col gap-1">
                        <span class="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Reference ID</span>
                        <span class="text-xs text-slate-200 font-mono font-semibold">REQ-${insertedId || 'PENDING'}</span>
                    </div>
                    <div class="flex flex-col gap-1 border-t border-white/5 pt-3 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                        <span class="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Traffic Origin</span>
                        <span class="text-xs text-slate-200 font-mono font-semibold">${friendlySource}</span>
                    </div>
                    <div class="flex flex-col gap-1 border-t border-white/5 pt-3 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                        <span class="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono">Email Status</span>
                        <span class="text-xs ${emailSent ? 'text-emerald-400' : 'text-amber-400'} font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full ${emailSent ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
                            ${emailSent ? 'Dispatched' : 'Pending'}
                        </span>
                    </div>
                </div>
                
                <!-- Step 6: Actions -->
                <div id="success-actions" class="success-fade-in-up flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md justify-items-center">
                    <a href="index.html?source=collab" class="btn-liquid-glass flex items-center justify-center gap-2 group w-full sm:w-auto">
                        <span>Back to Portfolio</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="group-hover:translate-x-1 transition-transform duration-300"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                    <button onclick="window.location.reload()" class="btn-liquid-glass bg-white/5 border-white/5 opacity-60 hover:opacity-100 w-full sm:w-auto">
                        Submit Another
                    </button>
                </div>
            `;
        }

        // Phase 1: Form Dissolve
        if (form) {
            form.style.transition = 'all 1s cubic-bezier(0.22, 1, 0.36, 1)';
            form.style.opacity = '0';
            form.style.filter = 'blur(10px)';
            form.style.transform = 'scale(0.95)';
        }
        
        // Phase 2: Success Stage Reveal
        stage.classList.add('active');
        
        // Lock scroll
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        if (window.lenis) window.lenis.stop();
        
        const glowPurple = document.getElementById('glow-purple');
        const glowBlue = document.getElementById('glow-blue');
        const glowWhite = document.getElementById('glow-white');

        // 150ms: Soft glow emerges
        setTimeout(() => {
            if (glowPurple) glowPurple.classList.add('active');
            if (glowBlue) glowBlue.classList.add('active');
            if (glowWhite) glowWhite.classList.add('active');
        }, 150);
            
        // 300ms: Rocket fades in
        setTimeout(() => {
            if (rocket) rocket.classList.add('reveal');
        }, 300);
            
        // 500ms: Rocket lifts upward slightly
        setTimeout(() => {
            if (rocket) rocket.classList.add('lifted');
        }, 500);

        // 800ms: Rocket exhaust activates (flame flickers)
        const thrusterFlame = document.getElementById('thruster-flame-group');
        setTimeout(() => {
            if (thrusterFlame) thrusterFlame.classList.add('active');
        }, 800);
                
        // 1000ms: Particle trail appears & Rocket persistent hover
        let particleInterval = null;
        setTimeout(() => {
            const particlesContainer = document.getElementById('exhaust-particles');
            if (particlesContainer) {
                particleInterval = startExhaustParticles(particlesContainer);
            }
            if (rocket) {
                rocket.classList.remove('lifted');
                rocket.classList.add('floating');
            }
        }, 1000);

        // 1200ms: Success title & Identity verified badge animates in
        setTimeout(() => {
            const verify = document.getElementById('success-badge-verify');
            const title = document.getElementById('success-title');
            if (verify) verify.classList.add('active');
            if (title) title.classList.add('active');
        }, 1200);

        // 1400ms: Confirmation status text appears
        setTimeout(() => {
            const statusPill = document.getElementById('success-status-pill');
            const desc = document.getElementById('success-desc');
            if (statusPill) statusPill.classList.add('active');
            if (desc) desc.classList.add('active');
        }, 1400);

        // 1800ms: Reference ID & Actions appear
        setTimeout(() => {
            const refGrid = document.getElementById('success-reference-grid');
            const actions = document.getElementById('success-actions');
            if (refGrid) refGrid.classList.add('active');
            if (actions) actions.classList.add('active');
            if (window.lucide) window.lucide.createIcons();
        }, 1800);
    }

    function showPremiumError(message) {
        const submitBtn = document.getElementById('submit-btn');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.classList.remove('btn-premium');
        submitBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        submitBtn.style.color = '#ffffff';
        
        submitBtn.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">${message || 'System Error'}</span>
            </div>
        `;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            submitBtn.style = '';
            submitBtn.classList.add('btn-premium');
            submitBtn.innerHTML = originalContent;
            if (window.lucide) lucide.createIcons();
        }, 4000);
    }
});
