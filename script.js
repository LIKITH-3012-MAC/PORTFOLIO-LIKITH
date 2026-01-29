// --- 1. SYSTEM BOOT SEQUENCE (Intro) ---
window.addEventListener('load', () => {
    const bootOverlay = document.getElementById('system-boot-overlay');
    const bootStatus = document.getElementById('boot-status');
    
    setTimeout(() => {
        bootStatus.textContent = "ACCESS GRANTED. WELCOME.";
        bootStatus.style.color = "#0f0"; // Green
        
        setTimeout(() => {
            bootOverlay.style.opacity = '0';
            bootOverlay.style.visibility = 'hidden';
            if (!localStorage.getItem('hasVisited')) {
                setTimeout(() => toggleAboutModal(), 500);
                localStorage.setItem('hasVisited', 'true');
            }
        }, 800);
    }, 2500);
});

// --- 2. CLOUD SQL SUBMIT LOGIC (Live Backend) ---
const form = document.getElementById('contact-form');

// ⚠️ THIS IS YOUR LIVE BACKEND URL
// It allows your HTML to talk to your Aiven Database securely via Render.
const CLOUD_API_URL = 'https://likith-portfolio-api.onrender.com/api/contact';

async function handleSubmit(event) {
    event.preventDefault(); // Stop page reload
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // 1. UI Loading State
    submitBtn.innerHTML = 'Transmitting to Cloud SQL...'; 
    submitBtn.disabled = true;

    // 2. Gather Data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 

    try {
        // 3. Send to your Node.js + MySQL Backend
        const response = await fetch(CLOUD_API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Success!
            form.reset(); 
            submitBtn.innerHTML = originalBtnText; 
            submitBtn.disabled = false;
            openSuccessModal(); // Trigger your rocket animation
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
form.addEventListener("submit", handleSubmit);

// --- 3. GALLERY LOGIC WITH SECURITY CHECK ---
const galleryModal = document.getElementById('gallery-modal');
const galleryIntro = document.getElementById('gallery-intro-sequence');
const securityModal = document.getElementById('security-modal');
let galleryLoaded = false;
let correctAnswer = 0;

window.openSecurityCheck = function() {
    // Generate Random Math Problem
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    
    document.getElementById('math-problem').textContent = `${num1} + ${num2} = ?`;
    document.getElementById('security-answer').value = ''; // Clear previous
    
    securityModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeSecurityCheck = function() {
    securityModal.classList.remove('active');
    document.body.style.overflow = '';
}

window.checkSecurityAnswer = function() {
    const userAnswer = parseInt(document.getElementById('security-answer').value);
    const inputField = document.getElementById('security-answer');
    
    if (userAnswer === correctAnswer) {
        // Correct!
        window.closeSecurityCheck();
        openGallery();
    } else {
        // Incorrect - Shake Animation
        inputField.classList.add('shake');
        inputField.style.borderColor = 'red';
        setTimeout(() => {
            inputField.classList.remove('shake');
            inputField.style.borderColor = '';
        }, 500);
    }
}

function openGallery() {
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show the "Pretending to load" intro for the gallery
    galleryIntro.style.display = 'flex';
    
    // Simulate Load Balancer / Decryption Time (1.5s)
    setTimeout(() => {
        galleryIntro.style.display = 'none';
        loadGalleryImages(); // Trigger the actual image load
    }, 1500);
}

window.closeGallery = function() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
}

// "Load Balancer" logic: Lazy load images only when needed
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
    if (aboutModal.classList.contains('active')) {
        aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        aboutModal.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
        if(sound) { sound.currentTime = 0; sound.play().catch(e => {}); }
    }
}

// --- 6. RUNTIME INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    function updateThemeToggleIcon(isDark) {
        themeToggle.innerHTML = isDark 
            ? '<i data-lucide="sun" class="w-3 h-3 inline mr-1"></i>Light' 
            : '<i data-lucide="moon" class="w-3 h-3 inline mr-1"></i>Theme';
        lucide.createIcons();
        
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
    
    // Mobile Menu
    const mobileMenu = document.getElementById('mobile-menu');
    window.toggleMobileMenu = function() {
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('pointer-events-none');
    }
    document.getElementById('mobile-menu-btn').addEventListener('click', window.toggleMobileMenu);
    document.getElementById('mobile-close').addEventListener('click', window.toggleMobileMenu);

    // Feature Modal
    const featureModal = document.getElementById('feature-modal');
    const fTitle = document.getElementById('feature-title');
    const fBody = document.getElementById('feature-body');
    const fLink = document.getElementById('feature-link');

    window.showFeatureInfo = (title, bodyText, linkUrl) => {
        fTitle.textContent = title;
        fBody.textContent = bodyText;
        fLink.href = linkUrl;
        featureModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    window.closeFeatureInfo = () => {
        featureModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Keydown Listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (aboutModal.classList.contains('active')) window.toggleAboutModal();
            if (featureModal.classList.contains('active')) window.closeFeatureInfo();
            if (document.getElementById('email-choice-modal').classList.contains('active')) window.closeEmailChoiceModal();
            if (document.getElementById('resume-modal').classList.contains('active')) window.closeResumeModal();
            if (document.getElementById('gallery-modal').classList.contains('active')) window.closeGallery();
            if (document.getElementById('security-modal').classList.contains('active')) window.closeSecurityCheck();
        }
        // Allow Enter key for Security Modal
        if (e.key === 'Enter' && document.getElementById('security-modal').classList.contains('active')) {
            window.checkSecurityAnswer();
        }
    });
});

// --- EMAIL CHOICE & RESUME MODALS ---
const emailChoiceModal = document.getElementById('email-choice-modal');
window.openEmailChoiceModal = function() { emailChoiceModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
window.closeEmailChoiceModal = function() { emailChoiceModal.classList.remove('active'); document.body.style.overflow = ''; }

const resumeModal = document.getElementById('resume-modal');
window.openResumeModal = function() { resumeModal.classList.add('active'); resumeModal.classList.remove('opacity-0', 'pointer-events-none'); document.body.style.overflow = 'hidden'; }
window.closeResumeModal = function() { resumeModal.classList.remove('active'); resumeModal.classList.add('opacity-0', 'pointer-events-none'); document.body.style.overflow = ''; }

// --- PARTICLE SYSTEM ---
const canvas = document.getElementById('about-particles');
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

function openSuccessModal() {
    const modal = document.getElementById('rocket-success-modal');
    const wrapper = document.getElementById('confetti-wrapper');
    const sound = document.getElementById('rocket-sound');
    modal.classList.add('active');
    if (sound) { sound.currentTime = 0; sound.play().catch(e=>{}); }
    setTimeout(() => { createConfetti(wrapper); }, 500); 
}

function closeSuccessModal() {
    const modal = document.getElementById('rocket-success-modal');
    const wrapper = document.getElementById('confetti-wrapper');
    modal.classList.remove('active');
    setTimeout(() => { wrapper.innerHTML = ''; }, 500);
}

function createConfetti(wrapper) {
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
