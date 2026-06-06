document.addEventListener('DOMContentLoaded', () => {
    // URL Tracking
    if (window.storeTrackingParams) {
        window.storeTrackingParams();
    }

    // Auto-scroll to hash on load
    const hash = window.location.hash;
    if (hash && hash !== '#') {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target && window.lenis) {
                window.lenis.scrollTo(target, { offset: 0, duration: 1.5 });
            }
        }, 500); 
    }

    // 0. Initialize Lenis Smooth Scroll (144Hz Optimized)
    const lenis = new Lenis({
        lerp: 0.03, // Ultra-floaty, buttery smooth feel tuned for high refresh rates
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        smoothTouch: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        syncTouch: true, // synchronize touch for high refresh rate screens
        syncTouchLerp: 0.075,
    });

    if (window.gsap) {
        // Sync with native monitor refresh rate (144Hz+)
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 1. Smooth Scroll for Anchor Links (Enhanced for Source Tracking)
    document.querySelectorAll('a').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Check if it's a local hash or a full path with a hash for the current page
        const isLocalHash = href.startsWith('#');
        const isCurrentPageHash = href.includes('#') && (href.startsWith(window.location.pathname) || href.startsWith('index.html'));

        if (isLocalHash || isCurrentPageHash) {
            anchor.addEventListener('click', function (e) {
                const url = new URL(this.href, window.location.origin);
                const targetId = url.hash;
                
                if (!targetId || targetId === '#') return;

                // Only prevent default if we are on the same page (ignoring query params)
                const isSamePage = url.pathname === window.location.pathname || 
                                   (url.pathname.endsWith('/') && window.location.pathname.endsWith('index.html')) ||
                                   (url.pathname.endsWith('index.html') && window.location.pathname.endsWith('/'));

                if (isSamePage) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        lenis.scrollTo(targetElement, {
                            offset: 0,
                            duration: 1.5,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });

                        // Update URL hash without jumping
                        window.history.pushState(null, null, this.href);

                        // Close mobile menu if open
                        const mobileMenu = document.getElementById('mobile-menu');
                        if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                            mobileMenu.classList.add('translate-x-full');
                        }
                    }
                }
            });
        }
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

    // 3. Sticky Navbar Transition (Floating Pill OS style)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('py-2', 'bg-slate-950/85', 'shadow-[0_16px_48px_rgba(0,0,0,0.7)]');
            navbar.classList.remove('py-3', 'bg-slate-950/40');
        } else {
            navbar.classList.remove('py-2', 'bg-slate-950/85', 'shadow-[0_16px_48px_rgba(0,0,0,0.7)]');
            navbar.classList.add('py-3', 'bg-slate-950/40');
        }
    });

    // 4. Mobile Navigation Overlay & Active State Matching
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobilePanel = document.getElementById('mobile-nav-panel');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const closeMenuBtn = document.getElementById('mobile-nav-close');

    function openMobileMenu() {
        if (!mobileOverlay || !mobilePanel || !mobileBackdrop) return;
        
        // Disable scroll
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop();

        mobileOverlay.classList.remove('hidden');
        mobileOverlay.classList.add('flex');

        // Reflow for transition
        void mobileOverlay.offsetWidth;

        mobileBackdrop.classList.add('opacity-100');
        mobileBackdrop.classList.remove('opacity-0');
        
        mobilePanel.classList.add('scale-100', 'opacity-100');
        mobilePanel.classList.remove('scale-95', 'opacity-0');
    }

    function closeMobileMenu() {
        if (!mobileOverlay || !mobilePanel || !mobileBackdrop) return;

        // Enable scroll
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();

        mobileBackdrop.classList.remove('opacity-100');
        mobileBackdrop.classList.add('opacity-0');
        
        mobilePanel.classList.remove('scale-100', 'opacity-100');
        mobilePanel.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            mobileOverlay.classList.remove('flex');
            mobileOverlay.classList.add('hidden');
        }, 300);
    }

    if (menuBtn && closeMenuBtn && mobileOverlay) {
        menuBtn.addEventListener('click', openMobileMenu);
        closeMenuBtn.addEventListener('click', closeMobileMenu);
        mobileBackdrop.addEventListener('click', closeMobileMenu);
        
        // Tap outside panel closes
        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });

        // Close on clicking links
        const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Active Navigation state detector
    function updateActiveNavState() {
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        
        let activeKey = 'index';
        
        if (pathname.includes('likith-git-profile.html')) {
            activeKey = 'git';
        } else if (pathname.includes('likith-youtube.html')) {
            activeKey = 'youtube';
        } else if (pathname.includes('collab.html')) {
            activeKey = 'collab';
        } else if (pathname.includes('index.html') || pathname.endsWith('/')) {
            if (hash === '#about') {
                activeKey = 'about';
            } else if (hash === '#experience') {
                activeKey = 'experience';
            } else if (hash === '#projects') {
                activeKey = 'projects';
            } else if (hash === '#founder') {
                activeKey = 'founder';
            } else {
                activeKey = 'index';
            }
        }
        
        document.querySelectorAll('.desktop-nav-link, .mobile-nav-item').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-nav-target="${activeKey}"]`).forEach(el => {
            el.classList.add('active');
        });
    }

    // Run active nav on load and hash change
    updateActiveNavState();
    window.addEventListener('hashchange', updateActiveNavState);

    // Scroll Spy for Home Page sections
    const spySections = document.querySelectorAll('section[id]');
    if (spySections.length > 0) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    let targetKey = id;
                    if (id === 'about') targetKey = 'about';
                    else if (id === 'experience') targetKey = 'experience';
                    else if (id === 'projects') targetKey = 'projects';
                    else if (id === 'founder') targetKey = 'founder';
                    else return;
                    
                    document.querySelectorAll('.desktop-nav-link, .mobile-nav-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    document.querySelectorAll(`[data-nav-target="${targetKey}"]`).forEach(el => {
                        el.classList.add('active');
                    });
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-25% 0px -55% 0px'
        });
        
        spySections.forEach(section => {
            spyObserver.observe(section);
        });
    }

    // Global Keyboard Listener inside DOMContentLoaded block for context scope
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if active
            if (mobileOverlay && !mobileOverlay.classList.contains('hidden')) {
                closeMobileMenu();
            }
            
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                const id = activeModal.getAttribute('id');
                if (id === 'performanceModal') {
                    closePerformance();
                } else {
                    closeModal(id);
                }
            }
        }
    });

    // 5. Current Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Expose lenis and mobile menu control to window
    window.lenis = lenis;
    window.closeMobileMenu = closeMobileMenu;
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
        if (window.lenis) window.lenis.stop();
    }
}

function closePerformance() {
    if (perfModal) {
        perfModal.classList.remove('active');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
    }
    if (perfFrame) {
        setTimeout(() => {
            perfFrame.src = "";
        }, 400);
    }
}

window.openPerformance = openPerformance;
window.closePerformance = closePerformance;

// 8. Generic Modal Open/Close
function openModal(id) {
    const modal = document.getElementById(id);
    const html = document.documentElement;
    const body = document.body;
    if(modal) {
        modal.classList.add('active');
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.height = '100vh';
        if (window.lenis) window.lenis.stop();
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    const html = document.documentElement;
    const body = document.body;
    if(modal) {
        modal.classList.remove('active');
        html.style.overflow = '';
        body.style.overflow = '';
        body.style.height = '';
        if (window.lenis) window.lenis.start();
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
