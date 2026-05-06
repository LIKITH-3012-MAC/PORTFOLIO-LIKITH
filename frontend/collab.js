document.addEventListener('DOMContentLoaded', () => {
    const collabForm = document.getElementById('collab-form');
    if (!collabForm) return;

    // --- GEOGRAPHY CASCADING LOGIC ---
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

    // --- FORM SUBMISSION LOGIC ---
    collabForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        const formData = new FormData(collabForm);
        const data = Object.fromEntries(formData.entries());

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
            preferred_contact_method: data.preferred_contact_method || null
        };

        // Premium Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span class="tracking-widest uppercase text-xs font-bold">Initiating Transmission...</span>
            </div>
        `;

        try {
            const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/api/collab`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('System Refusal');

            const result = await response.json();

            if (result.success) {
                triggerCinematicSuccess();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Transmission Error:', error);
            showPremiumError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    function triggerCinematicSuccess() {
        const stage = document.getElementById('cinematic-success');
        const rocket = document.getElementById('rocket-unit');
        const vapor = document.getElementById('rocket-vapor');
        const content = document.getElementById('success-content');
        const form = document.getElementById('collab-form');

        // Phase 1: Form Dissolve
        form.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        form.style.opacity = '0';
        form.style.filter = 'blur(10px)';
        form.style.transform = 'scale(0.95)';
        
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
                <span class="text-[10px] uppercase font-bold tracking-widest">Transmission Failed: ${message || 'System Error'}</span>
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
