<script>
    // ==========================================
    // 1. SUPABASE CONFIGURATION
    // ==========================================
    const SUPABASE_URL = 'https://ldmsrfbktjyojvhhdzgn.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_YFcdLF9gFyc47oUtIL958w_c36TifHw';

    // Initialize Client
    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ==========================================
    // 2. FORM SUBMISSION LOGIC
    // ==========================================
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page reload

            // A. Set Loading State
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Transmitting...";
            submitBtn.disabled = true;

            // B. Collect Data from Inputs
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };

            try {
                // C. Send to Supabase Cloud
                // Ensure your table name is 'contact_messages'
                const { data, error } = await _supabase
                    .from('contact_messages')
                    .insert([formData]);

                if (error) throw error;

                // D. SUCCESS: Reset UI
                form.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                // E. TRIGGER ROCKET EFFECT 🚀
                openSuccessModal(); 

            } catch (err) {
                console.error('Supabase Error:', err);
                alert("Transmission Failed: " + err.message);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // 3. ROCKET ANIMATION & SOUND EFFECTS
    // ==========================================
    function openSuccessModal() {
        const modal = document.getElementById('rocket-success-modal');
        const wrapper = document.getElementById('confetti-wrapper');
        const sound = document.getElementById('rocket-sound');

        // Show Modal
        if(modal) modal.classList.add('active');

        // Play Sound
        if (sound) {
            sound.currentTime = 0;
            // Note: Browsers may block audio if user hasn't interacted with page yet
            sound.play().catch(e => console.log("Audio play blocked:", e));
        }

        // Trigger Confetti
        if(wrapper) {
            setTimeout(() => {
                createConfetti(wrapper);
            }, 500); 
        }
    }

    function closeSuccessModal() {
        const modal = document.getElementById('rocket-success-modal');
        const wrapper = document.getElementById('confetti-wrapper');
        
        if(modal) modal.classList.remove('active');
        
        // Clean up confetti
        if(wrapper) {
            setTimeout(() => {
                wrapper.innerHTML = ''; 
            }, 500);
        }
    }

    function createConfetti(wrapper) {
        const colors = ['#FFD700', '#ff0000', '#2ecc71', '#3498db', '#f39c12', '#9b59b6'];
        const confettiCount = 60;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random Properties
            const bg = colors[Math.floor(Math.random() * colors.length)];
            const x = (Math.random() - 0.5) * 400; 
            const y = (Math.random() - 1) * 400; 
            const rotate = Math.random() * 360;
            const delay = Math.random() * 0.2;
            const duration = 0.8 + Math.random() * 0.8;

            // Apply Styles
            confetti.style.backgroundColor = bg;
            confetti.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
            confetti.style.transition = `all ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`;
            confetti.style.transitionDelay = `${delay}s`;

            wrapper.appendChild(confetti);

            // Animate
            requestAnimationFrame(() => {
                confetti.style.opacity = '1';
                confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotate + 720}deg) scale(0)`;
            });
        }
    }
</script>
