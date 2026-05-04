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

        // Processing State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Transmitting Data...</span>
            </div>
        `;

        try {
            const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/api/collab`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('API Rejection');

            const result = await response.json();

            if (result.success) {
                // Success State Transition
                document.getElementById('success-state').classList.remove('hidden');
                collabForm.classList.add('opacity-0', 'pointer-events-none');
                if (window.lucide) lucide.createIcons();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            window.location.href = 'problem.html';
        }
    });
});
