document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                    mobileMenu.classList.add('translate-x-full');
                }
            }
        });
    });

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Sticky Navbar Blur Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/50', 'backdrop-blur-md', 'border-b', 'border-white/10');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-black/50', 'backdrop-blur-md', 'border-b', 'border-white/10');
            navbar.classList.add('bg-transparent');
        }
    });

    // 4. Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && closeMenuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    // 5. Current Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// 6. Performance Modal (YouTube)
const perfModal = document.getElementById('performanceModal');
const perfFrame = document.getElementById('pianoFrame');

function openPerformance() {
    if (perfFrame) {
        perfFrame.src = "https://www.youtube.com/embed/GZNg2oT_8BU?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1";
    }
    if (perfModal) {
        perfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePerformance() {
    if (perfModal) {
        perfModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (perfFrame) {
        setTimeout(() => {
            perfFrame.src = "";
        }, 400);
    }
}

window.openPerformance = openPerformance;
window.closePerformance = closePerformance;

// 8. Generic Modal Open/Close (for future contact/resume modals if needed)
function openModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.openModal = openModal;
window.closeModal = closeModal;
