// ===========================================
// ☀️ EARLY MORNING MIST JS (SMOOTH PROTOCOLS)
// ===========================================

// --- CORE SYSTEM REFERENCES ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const themeToggle = document.getElementById('theme-toggle');
const heroSection = document.getElementById('about');

// --- MODAL REFERENCES ---
const featureModal = document.getElementById('feature-info-modal');
const moreInfoModal = document.getElementById('more-info-modal');
const morningRipple = document.getElementById('morning-ripple'); // 💡 New Ripple Element

// --- DATA LOGS ---
const moreInfoData = {
    github: {
        title: "GITHUB PROFILE",
        desc: "Review projects and contributions. Status: Clear.",
        link: "https://github.com/LIKITH-3012-MAC"
    },
    linkedin: {
        title: "NETWORK INTERFACE",
        desc: "Connect professionally and explore achievements.",
        link: "https://www.linkedin.com/in/likhith-naidu-anumakonda-33a347327/"
    },
    email: {
        title: "DIRECT SIGNAL INITIATION",
        desc: "Send an email for collaborations or queries.",
        link: "mailto:likith.anumakonda@gmail.com"
    },
    mobile: {
        title: "COMMUNICATION LINK",
        desc: "Establish a quick communication channel.",
        link: "tel:+919440113763"
    }
};

// ----------------------------------------------------
// 🚀 MODULE 1: MORNING RIPPLE & UI BEHAVIOR
// ----------------------------------------------------

// --- A. MORNING RIPPLE ACTIVATION ---
document.addEventListener('click', function(e) {
    if (!morningRipple) return;
    
    morningRipple.style.left = e.clientX + 'px';
    morningRipple.style.top = e.clientY + 'px';
    
    // Reset and trigger animation
    morningRipple.classList.remove('active');
    void morningRipple.offsetWidth; // Force reflow
    morningRipple.classList.add('active');
});

// --- NAVBAR & MOBILE MENU ---
window.addEventListener('scroll', () => {
    // Standard Navbar Shadow (simple scroll effect)
    if (window.scrollY > 50) navbar.classList.add('shadow-xl', 'bg-white/90');
    else navbar.classList.remove('shadow-xl', 'bg-white/90');
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('opacity-0');
    mobileMenu.classList.toggle('pointer-events-none');
    document.body.style.overflow = mobileMenu.classList.contains('opacity-0') ? '' : 'hidden';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    });
});

// --- THEME TOGGLE (Early Morning vs. Soft Night) ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    
    // Update body class for styling (Crucial for CSS variables)
    document.body.classList.toggle('light-mode', !isDark);
    
    // Contextual background update
    heroSection.style.backgroundImage = isDark
        ? "url('https://images.unsplash.com/photo-1518331649938-2396955d7f25?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" // Soft Night Image
        : "url('https://images.unsplash.com/photo-1549477022-d7b67035f299?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"; // Early Morning Image
});


// ----------------------------------------------------
// --- MODULE 2: MODAL PROTOCOLS ---
// ----------------------------------------------------

function openModal(modal) {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// --- FEATURE INFO MODAL (Project Details) ---
const featureClose = featureModal.querySelector('#close-feature');
const featureTitle = document.getElementById('feature-title');
const featureDesc = document.getElementById('feature-desc');
const featureLinkBtn = document.getElementById('feature-link-btn');

window.showFeatureInfo = function(title, desc, link) {
    featureTitle.innerText = title;
    featureDesc.innerText = desc;
    featureLinkBtn.onclick = () => window.open(link, '_blank');
    openModal(featureModal);
};

featureClose.addEventListener('click', () => closeModal(featureModal));


// --- MORE INFO MODAL (Contact Data) ---
const closeMoreInfo = moreInfoModal.querySelector('#close-more-info');

document.querySelectorAll('.more-info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.info;
        const data = moreInfoData[key];

        document.getElementById('more-info-title').innerText = data.title;
        document.getElementById('more-info-desc').innerText = data.desc;
        document.getElementById('more-info-link-btn').onclick = () => window.open(data.link, '_blank');

        openModal(moreInfoModal);
    });
});

closeMoreInfo.addEventListener('click', () => closeModal(moreInfoModal));


// ----------------------------------------------------
// --- MODULE 3: SYSTEM STABILITY & INITIALIZATION ---
// ----------------------------------------------------

// --- GLOBAL ESC KEY HANDLER ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(featureModal);
        closeModal(moreInfoModal);
    }
});

// --- MOBILE MENU RESIZE FIX ---
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
});

// --- ACCESSIBILITY: FOCUS TRAP ---
[featureModal, moreInfoModal].forEach(m => {
    m.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = m.querySelectorAll('a, button, textarea, input, select');
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
});

// --- INITIALIZATION PROTOCOL ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial hero background based on theme state
    const isDark = document.body.classList.contains('dark-mode');
    heroSection.style.backgroundImage = isDark
        ? "url('https://images.unsplash.com/photo-1518331649938-2396955d7f25?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        : "url('https://images.unsplash.com/photo-1549477022-d7b67035f299?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
});
// ===========================================
// ☀️ END OF EARLY MORNING MIST JS
// ===========================================
