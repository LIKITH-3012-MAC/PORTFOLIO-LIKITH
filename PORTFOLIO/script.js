// ===========================================
// CYBERPUNK PORTFOLIO JS (FIXED & OPTIMIZED)
// Author: Likith Naidu
// ===========================================

// --- NAVBAR SCROLL & MOBILE MENU ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('shadow-lg');
    else navbar.classList.remove('shadow-lg');
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

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const heroSection = document.getElementById('about');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    heroSection.style.backgroundImage = document.body.classList.contains('light-mode') 
        ? "url(' https://i.ibb.co/4ZH4SWSw.png')" 
        : "url('https://img.freepik.com/free-photo/3d-render-grunge-dark-interior-with-light-from-side-windows_1048-13351.jpg')";
});

// --- FEATURE INFO MODAL ---
const featureModal = document.getElementById('feature-info-modal');
const featureTitle = document.getElementById('feature-title');
const featureDesc = document.getElementById('feature-desc');
const featureLinkBtn = document.getElementById('feature-link-btn');
const featureClose = document.getElementById('close-feature');

function showFeatureInfo(title, desc, link) {
    featureTitle.innerText = title;
    featureDesc.innerText = desc;
    featureLinkBtn.onclick = () => window.open(link, '_blank');

    featureModal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
}

featureClose.addEventListener('click', () => {
    featureModal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
});

// --- MORE INFO MODAL (Dynamic) ---
const moreInfoModal = document.getElementById('more-info-modal');
const closeMoreInfo = moreInfoModal.querySelector('#close-more-info');

const moreInfoData = {
    github: {
        title: "GitHub Profile",
        desc: "Check out my projects, repos, and contributions on GitHub.",
        link: "https://github.com/LIKITH-3012-MAC"
    },
    linkedin: {
        title: "LinkedIn Profile",
        desc: "Connect with me professionally and see my achievements.",
        link: "https://www.linkedin.com/in/likhith-naidu-anumakonda-33a347327/"
    },
    email: {
        title: "Email Me",
        desc: "Send me an email for collaborations or queries.",
        link: "mailto:likith.anumakonda@gmail.com"
    },
    mobile: {
        title: "Call Me",
        desc: "Reach out to me on my mobile for quick communication.",
        link: "tel:+919440113763"
    }
};

// ALL dynamic more-info buttons
document.querySelectorAll('.more-info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.info;
        const data = moreInfoData[key];

        document.getElementById('more-info-title').innerText = data.title;
        document.getElementById('more-info-desc').innerText = data.desc;
        document.getElementById('more-info-link-btn').onclick = () => window.open(data.link, '_blank');

        // Show modal
        moreInfoModal.classList.remove('opacity-0', 'pointer-events-none');
        moreInfoModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeMoreInfo.addEventListener('click', () => {
    moreInfoModal.classList.add('opacity-0', 'pointer-events-none');
    moreInfoModal.classList.remove('show');
    document.body.style.overflow = '';
});

// --- GLOBAL ESC KEY HANDLER ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        
        // Feature modal
        if (!featureModal.classList.contains('opacity-0')) {
            featureModal.classList.add('opacity-0', 'pointer-events-none');
        }

        // More Info modal
        if (moreInfoModal.classList.contains('show')) {
            moreInfoModal.classList.add('opacity-0', 'pointer-events-none');
            moreInfoModal.classList.remove('show');
        }

        document.body.style.overflow = '';
    }
});

// --- MOBILE MENU RESIZE FIX ---
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
});

// --- ACCESSIBILITY: FOCUS TRAP FOR MODALS ---
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

// --- MODAL TRANSITION EFFECTS ---
[featureModal, moreInfoModal].forEach(m => {
    m.classList.add('transition-opacity', 'duration-300');
});

// --- Set initial hero background on load ---
document.addEventListener('DOMContentLoaded', () => {
    heroSection.style.backgroundImage = document.body.classList.contains('light-mode') 
        ? "url('https://i.ibb.co/4ZH4SWSw.png')" 
        : "url('https://img.freepik.com/free-photo/3d-render-grunge-dark-interior-with-light-from-side-windows_1048-13351.jpg')";
});
