document.addEventListener('DOMContentLoaded', () => {
    const collabForm = document.getElementById('collab-form');
    if (!collabForm) return;

    // --- GEOGRAPHY CASCADING LOGIC ---
    const GEOGRAPHY_DATA = {
        "India": {
            "Andhra Pradesh": {
                "Anantapur": ["Anantapur", "Dharmavaram", "Guntakal", "Hindupur", "Kadiri", "Tadipatri"],
                "Chittoor": ["Chittoor", "Kuppam", "Madanapalle", "Palamaner", "Punganur", "Tirupati"],
                "East Godavari": ["Kakinada", "Rajamahendravaram", "Amalapuram", "Mandapeta", "Peddapuram"],
                "Guntur": ["Guntur", "Narasaraopet", "Tenali", "Bapatla", "Ponnur"],
                "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada", "Nuzvid"],
                "Visakhapatnam": ["Visakhapatnam", "Anakapalle", "Bheemunipatnam", "Gajuwaka"],
                "West Godavari": ["Eluru", "Bhimavaram", "Palakollu", "Tadepalligudem"]
            },
            "Telangana": {
                "Hyderabad": ["Hyderabad", "Secunderabad", "Charminar", "Kukatpally", "Gachibowli"],
                "Warangal": ["Warangal", "Hanamkonda", "Kazipet", "Jangaon"],
                "Nizamabad": ["Nizamabad", "Armoor", "Bodhan", "Kamareddy"],
                "Rangareddy": ["Cyberabad", "Manikonda", "Miyapur", "Serilingampally"]
            },
            "Karnataka": {
                "Bangalore": ["Bangalore Urban", "Bangalore Rural", "Whitefield", "Electronic City", "Indiranagar"],
                "Mysore": ["Mysore", "Hunsur", "Nanjangud", "T.Narasipura"]
            },
            "Bihar": {
                "Patna": ["Patna", "Danapur", "Khagaul", "Phulwari Sharif"],
                "Gaya": ["Gaya", "Bodh Gaya", "Sherghati", "Tekari"]
            }
        },
        "USA": {
            "California": {
                "Los Angeles": ["Downtown", "Santa Monica", "Beverly Hills", "Pasadena"],
                "San Francisco": ["SoMa", "Mission", "Financial District", "Haight-Ashbury"],
                "Santa Clara": ["San Jose", "Palo Alto", "Mountain View", "Cupertino"]
            },
            "New York": {
                "New York City": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"],
                "Erie": ["Buffalo", "Lackawanna", "Tonawanda"]
            }
        },
        "Other": { "Global": { "International": ["Other Region"] } }
    };

    const countrySelect = document.getElementById('country-select');
    const stateSelect = document.getElementById('state-select');
    const districtSelect = document.getElementById('district-select');
    const mandalSelect = document.getElementById('mandal-select');
    const villageSelect = document.getElementById('village-select');

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
        
        // Reset children
        districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
        districtSelect.disabled = true;
        mandalSelect.disabled = true;
        villageSelect.disabled = true;
    });

    stateSelect.addEventListener('change', () => {
        const districts = GEOGRAPHY_DATA[countrySelect.value][stateSelect.value];
        districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
        districtSelect.disabled = false;
        districtSelect.classList.remove('opacity-50');

        Object.keys(districts).forEach(dist => {
            const option = document.createElement('option');
            option.value = dist;
            option.textContent = dist;
            districtSelect.appendChild(option);
        });
    });

    districtSelect.addEventListener('change', () => {
        const mandals = GEOGRAPHY_DATA[countrySelect.value][stateSelect.value][districtSelect.value];
        mandalSelect.innerHTML = '<option value="" disabled selected>Select Mandal / Sub-Region</option>';
        mandalSelect.disabled = false;
        mandalSelect.classList.remove('opacity-50');

        mandals.forEach(mandal => {
            const option = document.createElement('option');
            option.value = mandal;
            option.textContent = mandal;
            mandalSelect.appendChild(option);
        });
    });

    mandalSelect.addEventListener('change', () => {
        // Mocking the final level for demo purposes
        const selectedMandal = mandalSelect.value;
        villageSelect.innerHTML = '<option value="" disabled selected>Select Area</option>';
        villageSelect.disabled = false;
        villageSelect.classList.remove('opacity-50');

        const options = [`${selectedMandal} Main`, `${selectedMandal} North`, `${selectedMandal} South`, "Other Zone"];
        options.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            villageSelect.appendChild(option);
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
            district: data.district || null,
            mandal_or_subregion: data.mandal_or_subregion || null,
            village_or_town: data.village_or_town || null,
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
                            if (window.lucide) lucide.createIcons();
                        }, 1000);
                    }, 1000);
                }, 1200);
            }, 800);
        }, 800);
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
