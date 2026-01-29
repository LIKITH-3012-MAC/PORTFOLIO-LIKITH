// --- 1. SYSTEM BOOT SEQUENCE (Intro) ---
window.addEventListener('load', () => {
    const bootOverlay = document.getElementById('system-boot-overlay');
    const bootStatus = document.getElementById('boot-status');
    
    setTimeout(() => {
        if(bootStatus) {
            bootStatus.textContent = "ACCESS GRANTED. WELCOME.";
            bootStatus.style.color = "#0f0"; // Green
        }
        
        setTimeout(() => {
            if(bootOverlay) {
                bootOverlay.style.opacity = '0';
                bootOverlay.style.visibility = 'hidden';
            }
            if (!localStorage.getItem('hasVisited')) {
                setTimeout(() => { if(window.toggleAboutModal) toggleAboutModal(); }, 500);
                localStorage.setItem('hasVisited', 'true');
            }
        }, 800);
    }, 2500);
});

// --- 2. CLOUD SQL SUBMIT LOGIC (Live Backend) ---
const form = document.getElementById('contact-form');
const CLOUD_API_URL = 'https://likith-portfolio-api.onrender.com/api/contact';

async function handleSubmit(event) {
    event.preventDefault(); 
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // 1. UI Loading State
    submitBtn.innerHTML = 'Transmitting...'; 
    submitBtn.disabled = true;

    // 2. Gather Data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 

    try {
        // 3. Send to Backend
        const response = await fetch(CLOUD_API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            form.reset(); 
            submitBtn.innerHTML = originalBtnText; 
            submitBtn.disabled = false;
            openSuccessModal(); 
        } else {
            throw new Error(result.error || 'Transmission Failed');
        }
    } catch (error) { 
        console.error(error);
        submitBtn.innerHTML = originalBtnText; 
        submitBtn.disabled = false; 
        alert("Error: Could not save to Cloud Database. Is the backend waking up?"); 
    }
}
if(form) form.addEventListener("submit", handleSubmit);

// --- 3. GALLERY LOGIC ---
const galleryModal = document.getElementById('gallery-modal');
const galleryIntro = document.getElementById('gallery-intro-sequence');
const securityModal = document.getElementById('security-modal');
let galleryLoaded = false;
let correctAnswer = 0;

window.openSecurityCheck = function() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    
    const problem = document.getElementById('math-problem');
    if(problem) problem.textContent = `${num1} + ${num2} = ?`;
    
    const answerInput = document.getElementById('security-answer');
    if(answerInput) answerInput.value = ''; 
    
    if(securityModal) {
        securityModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

window.closeSecurityCheck = function() {
    if(securityModal) securityModal.classList.remove('active');
    document.body.style.overflow = '';
}

window.checkSecurityAnswer = function() {
    const answerInput = document.getElementById('security-answer');
    const userAnswer = parseInt(answerInput.value);
    
    if (userAnswer === correctAnswer) {
        window.closeSecurityCheck();
        openGallery();
    } else {
        answerInput.classList.add('shake');
        answerInput.style.borderColor = 'red';
        setTimeout(() => {
            answerInput.classList.remove('shake');
            answerInput.style.borderColor = '';
        }, 500);
    }
}

function openGallery() {
    if(galleryModal) {
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if(galleryIntro) {
            galleryIntro.style.display = 'flex';
            setTimeout(() => {
                galleryIntro.style.display = 'none';
                loadGalleryImages(); 
            }, 1500);
        } else {
            loadGalleryImages();
        }
    }
}

window.closeGallery = function() {
    if(galleryModal) galleryModal.classList.remove('active');
    document.body.style.overflow = '';
}

function loadGalleryImages() {
    if (galleryLoaded) return; 
    const images = document.querySelectorAll('.lazy-image');
    images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) img.src = src;
    });
    galleryLoaded = true;
}

// --- 4. THEME & GENERAL JS ---
const body = document.body;
(function initializeTheme() {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (isDarkMode) body.classList.add('dark');
})();

// --- 5. ABOUT MODAL LOGIC ---
const aboutModal = document.getElementById('about-modal');
window.toggleAboutModal = function() {
    const sound = document.getElementById('about-sound');
    if (aboutModal && aboutModal.classList.contains('active')) {
        aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    } else if (aboutModal) {
        aboutModal.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
        if(sound) { sound.currentTime = 0; sound.play().catch(e => {}); }
    }
}

// --- 6. RUNTIME INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if(window.lucide) lucide.createIcons();
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        function updateThemeToggleIcon(isDark) {
            themeToggle.innerHTML = isDark 
                ? '<i data-lucide="sun" class="w-3 h-3 inline mr-1"></i>Light' 
                : '<i data-lucide="moon" class="w-3 h-3 inline mr-1"></i>Theme';
            if(window.lucide) lucide.createIcons();
            
            const computedStyle = getComputedStyle(document.body);
            themeToggle.style.backgroundColor = computedStyle.getPropertyValue('--color-soft-button-bg');
            themeToggle.style.color = computedStyle.getPropertyValue('--color-soft-button-text');
            themeToggle.style.borderColor = computedStyle.getPropertyValue('--color-border');
        }
        updateThemeToggleIcon(body.classList.contains('dark'));

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeToggleIcon(isDark);
        });
    }
    
    // Mobile Menu
    const mobileMenu = document.getElementById('mobile-menu');
    window.toggleMobileMenu = function() {
        if(mobileMenu) {
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('pointer-events-none');
        }
    }
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if(mobileBtn) mobileBtn.addEventListener('click', window.toggleMobileMenu);
    
    const mobileClose = document.getElementById('mobile-close');
    if(mobileClose) mobileClose.addEventListener('click', window.toggleMobileMenu);

    // Feature Modal
    const featureModal = document.getElementById('feature-modal');
    const fTitle = document.getElementById('feature-title');
    const fBody = document.getElementById('feature-body');
    const fLink = document.getElementById('feature-link');

    window.showFeatureInfo = (title, bodyText, linkUrl) => {
        if(fTitle) fTitle.textContent = title;
        if(fBody) fBody.textContent = bodyText;
        if(fLink) fLink.href = linkUrl;
        if(featureModal) {
            featureModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    window.closeFeatureInfo = () => {
        if(featureModal) featureModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Keydown Listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (aboutModal && aboutModal.classList.contains('active')) window.toggleAboutModal();
            if (featureModal && featureModal.classList.contains('active')) window.closeFeatureInfo();
            if (document.getElementById('email-choice-modal')?.classList.contains('active')) window.closeEmailChoiceModal();
            if (document.getElementById('resume-modal')?.classList.contains('active')) window.closeResumeModal();
            if (document.getElementById('gallery-modal')?.classList.contains('active')) window.closeGallery();
            if (document.getElementById('security-modal')?.classList.contains('active')) window.closeSecurityCheck();
        }
        if (e.key === 'Enter' && document.getElementById('security-modal')?.classList.contains('active')) {
            window.checkSecurityAnswer();
        }
    });
});

// --- EMAIL & RESUME MODALS ---
const emailChoiceModal = document.getElementById('email-choice-modal');
window.openEmailChoiceModal = function() { if(emailChoiceModal) { emailChoiceModal.classList.add('active'); document.body.style.overflow = 'hidden'; }}
window.closeEmailChoiceModal = function() { if(emailChoiceModal) { emailChoiceModal.classList.remove('active'); document.body.style.overflow = ''; }}

const resumeModal = document.getElementById('resume-modal');
window.openResumeModal = function() { if(resumeModal) { resumeModal.classList.add('active'); resumeModal.classList.remove('opacity-0', 'pointer-events-none'); document.body.style.overflow = 'hidden'; }}
window.closeResumeModal = function() { if(resumeModal) { resumeModal.classList.remove('active'); resumeModal.classList.add('opacity-0', 'pointer-events-none'); document.body.style.overflow = ''; }}

// --- PARTICLE SYSTEM ---
const canvas = document.getElementById('about-particles');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = 'rgba(255, 215, 0, 0.2)';
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        }
        draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    function initParticles() { for (let i = 0; i < 50; i++) particles.push(new Particle()); }
    initParticles();
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

function openSuccessModal() {
    const modal = document.getElementById('rocket-success-modal');
    const wrapper = document.getElementById('confetti-wrapper');
    const sound = document.getElementById('rocket-sound');
    if(modal) modal.classList.add('active');
    if (sound) { sound.currentTime = 0; sound.play().catch(e=>{}); }
    if(wrapper) setTimeout(() => { createConfetti(wrapper); }, 500); 
}

function closeSuccessModal() {
    const modal = document.getElementById('rocket-success-modal');
    const wrapper = document.getElementById('confetti-wrapper');
    if(modal) modal.classList.remove('active');
    if(wrapper) setTimeout(() => { wrapper.innerHTML = ''; }, 500);
}

function createConfetti(wrapper) {
    if(!wrapper) return;
    const colors = ['#FFD700', '#ff0000', '#2ecc71', '#3498db', '#f39c12', '#9b59b6'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const x = (Math.random() - 0.5) * 400; const y = (Math.random() - 1) * 400;
        const rotate = Math.random() * 360; const delay = Math.random() * 0.2; const duration = 0.8 + Math.random() * 0.8;
        confetti.style.backgroundColor = bg;
        confetti.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
        confetti.style.transition = `all ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`;
        confetti.style.transitionDelay = `${delay}s`;
        wrapper.appendChild(confetti);
        requestAnimationFrame(() => {
            confetti.style.opacity = '1';
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotate + 720}deg) scale(0)`;
        });
    }
}

// ============================================
// ⚠️ NEW: PROMETHEUS CHAT LOGIC (ADDED HERE)
// ============================================

const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');

window.toggleChat = function() {
    if(chatWindow) {
        chatWindow.classList.toggle('hidden');
        chatWindow.classList.toggle('scale-100');
    }
    // Critical: Refresh icons when chat opens
    if(window.lucide) lucide.createIcons();
}

window.handleChat = async function(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    // 1. Add User Message
    appendMessage(msg, 'user');
    input.value = '';

    // 2. Show "Thinking..."
    const loadingId = appendMessage('Analyzing...', 'bot', true);

    try {
        // 3. Call Your Backend
        const res = await fetch('https://likith-portfolio-api.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();

        // 4. Remove loading & Show Reply
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        
        appendMessage(data.reply || "Error: Prometheus Offline", 'bot');

    } catch (err) {
        console.error(err);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        appendMessage("System Malfunction. Try again.", 'bot');
    }
}

function appendMessage(text, sender, isLoading = false) {
    if(!chatMessages) return;

    const div = document.createElement('div');
    const isUser = sender === 'user';
    const id = 'msg-' + Date.now();
    div.id = id;
    
    // Message Styling
    div.className = `p-2 rounded-lg max-w-[85%] text-xs ${
        isUser 
        ? 'bg-yellow-100 text-yellow-900 self-end rounded-tr-none ml-auto' 
        : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none self-start'
    }`;
    
    if(isLoading) div.classList.add('animate-pulse');
    
    // Formatting: Convert newlines to breaks for AI responses
    div.innerHTML = text.replace(/\n/g, '<br>');
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

// Final check to load icons for floating bar
if(window.lucide) lucide.createIcons();
