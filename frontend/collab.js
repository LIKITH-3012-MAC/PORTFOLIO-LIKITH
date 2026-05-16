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
                sourceNoteEl.innerHTML = `<i data-lucide="cpu" class="w-3 h-3 text-amber-400"></i> Opened from Likith's AI Agent`;
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

            if (data.success === true && data.id && data.token) {
                // SUCCESS: Backend confirmed MySQL storage and returned ID + Token
                triggerCinematicSuccess(data.id, data.token, data.email_sent);
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

    function triggerCinematicSuccess(insertedId, token, emailSent) {
        const stage = document.getElementById('cinematic-success');
        const rocket = document.getElementById('rocket-unit');
        const vapor = document.getElementById('rocket-vapor');
        const content = document.getElementById('success-content');
        const form = document.getElementById('collab-form');
        
        const successTitle = document.getElementById('success-title');
        const successDesc = document.getElementById('success-desc');

        // Update Content based on email status
        if (successTitle && successDesc) {
            successTitle.innerHTML = 'SUBMITTED<br>SUCCESSFULLY';
            
            let message = '';
            if (emailSent === true) {
                message = `
                    <div class="mb-4">
                        <span class="text-white font-bold block text-lg mb-1">Thank you for collaborating with Likith.</span>
                        <span class="text-emerald-400/80 text-[10px] font-mono uppercase tracking-[0.2em] block mb-4">Premium Confirmation Sent</span>
                    </div>
                    <p class="text-slate-400 text-sm leading-relaxed mb-4">
                        Your collaboration request has been received by Likith Naidu Anumakonda and is currently being processed within the <span class="text-white font-medium">SAKRA</span> execution ecosystem.
                    </p>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        If your email is reachable, we’ll contact you soon. We may also connect with you through your provided mobile number.
                    </p>
                `;
            } else if (emailSent === false) {
                message = `
                    <div class="mb-4">
                        <span class="text-white font-bold block text-lg mb-1">Request Stored Successfully.</span>
                        <span class="text-amber-400/80 text-[10px] font-mono uppercase tracking-[0.2em] block mb-4">Email Dispatch Interrupted</span>
                    </div>
                    <p class="text-slate-400 text-sm leading-relaxed mb-4">
                        Your request has been securely stored in the SAKRA database. Although the confirmation email could not be sent, Likith will still review your request manually.
                    </p>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        We will contact you through your email or mobile number once the review is complete.
                    </p>
                `;
            } else {
                message = `
                    <div class="mb-4">
                        <span class="text-white font-bold block text-lg mb-1">Request Received.</span>
                    </div>
                    <p class="text-slate-400 text-sm leading-relaxed mb-4">
                        Thank you for reaching out. Your collaboration request has been received by Likith Naidu Anumakonda.
                    </p>
                    <p class="text-slate-500 text-xs leading-relaxed">
                        We’ll contact you soon using your provided email or mobile number.
                    </p>
                `;
            }
            
            if (insertedId) {
                message += `<div class="mt-8 pt-6 border-t border-white/5">
                    <span class="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-mono block mb-1">Internal Reference</span>
                    <span class="text-[11px] text-slate-400 font-mono">REQ-ID: ${insertedId}</span>
                </div>`;
            }
            
            successDesc.innerHTML = message;
        }

        // Phase 1: Form Dissolve
        if (form) {
            form.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
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
            
        setTimeout(() => {
            // Phase 3: Rocket Arrival
            rocket.classList.add('reveal');
            
            setTimeout(() => {
                // Phase 4: Pre-Launch Ignition
                vapor.classList.add('active');
                rocket.classList.add('launching');
                
                setTimeout(() => {
                    // Phase 5: Cinematic Launch
                    rocket.classList.add('launch');
                    
                    setTimeout(() => {
                        // Phase 6: Delivery Confirmation
                        content.classList.add('visible');
                        rocket.style.display = 'none'; // Clear stage for message
                        if (window.lucide) lucide.createIcons();
                        
                        // NOTE: No redirect. Success state persists on collab.html.
                    }, 600);
                }, 600);
            }, 500);
        }, 300);
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
