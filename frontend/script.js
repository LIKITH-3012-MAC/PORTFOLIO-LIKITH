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

    // 0. Initialize Lenis Smooth Scroll (Optimized for snappiness & high refresh rate monitors)
    const lenis = new Lenis({
        lerp: 0.08, // Increased from 0.03 for much quicker, snappier reaction while remaining buttery smooth
        duration: 1.2, // Decreased from 1.5 for a more active responsive feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Set to false to preserve native inertial touch scrolling on mobile devices, preventing stutters
        wheelMultiplier: 1.05, // Subtle boost to speed
        touchMultiplier: 1.5,
    });

    // Select elements for 3D parallax effects
    const heroSection = document.querySelector('section.min-h-screen');
    const heroLeft = document.querySelector('section.min-h-screen .animate-fade-in');
    const heroRight = document.querySelector('section.min-h-screen .order-first, section.min-h-screen .order-last');
    
    const cube1 = document.querySelector('.cube-1');
    const cube2 = document.querySelector('.cube-2');
    const orb1 = document.querySelector('.orb-amber');
    const orb2 = document.querySelector('.orb-blue');
    const orb3 = document.querySelector('.orb-purple');
    const grid = document.querySelector('.cyber-grid');

    let heroMouseX = 0, heroMouseY = 0;
    let heroTargetX = 0, heroTargetY = 0;
    let scrollY = window.scrollY;
    let gridOffset = 0;

    // Track scroll using Lenis smooth scroll callback for temporal synchronization
    lenis.on('scroll', (e) => {
        scrollY = e.scroll;
    });

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            const rect = heroSection.getBoundingClientRect();
            heroTargetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            heroTargetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroTargetX = 0;
            heroTargetY = 0;
        });
    }

    let lastScrollY = -1;
    let lastHeroMouseX = -1;
    let lastHeroMouseY = -1;
    let lastGridOffset = -1;

    // Unified Ticker Loop (Synced with monitor refresh rate 144Hz+ to prevent judder)
    function animateFrame(time) {
        // Tick Lenis smooth scroll first on every frame
        lenis.raf(time);

        // Increment background grid Y offset
        gridOffset += 0.35;
        if (gridOffset >= 60) {
            gridOffset -= 60;
        }

        // Interpolate mouse coordinates
        let heroParallaxActive = false;
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const prevX = heroMouseX;
            const prevY = heroMouseY;
            
            heroMouseX += (heroTargetX - heroMouseX) * 0.08;
            heroMouseY += (heroTargetY - heroMouseY) * 0.08;
            
            if (Math.abs(heroMouseX - prevX) > 0.001 || Math.abs(heroMouseY - prevY) > 0.001) {
                heroParallaxActive = true;
            }
        }

        // Check if render parameters changed
        const scrollChanged = Math.abs(scrollY - lastScrollY) > 0.05;
        const gridChanged = Math.abs(gridOffset - lastGridOffset) > 0.05;

        if (scrollChanged || heroParallaxActive || gridChanged) {
            // Hero parallax
            if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                if (heroLeft) heroLeft.style.transform = `translate3d(${heroMouseX * 12}px, ${heroMouseY * 12}px, 0)`;
                if (heroRight) heroRight.style.transform = `translate3d(${heroMouseX * -25}px, ${heroMouseY * -25}px, 0)`;
            } else {
                if (heroLeft && heroLeft.style.transform) heroLeft.style.transform = '';
                if (heroRight && heroRight.style.transform) heroRight.style.transform = '';
            }

            // Background objects parallax
            if (window.innerWidth >= 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                if (cube1) cube1.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
                if (cube2) cube2.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
                if (orb1) orb1.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
                if (orb2) orb2.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
                if (orb3) orb3.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
                
                if (grid) {
                    const finalGridY = (scrollY * 0.2) + gridOffset;
                    grid.style.transform = `perspective(600px) rotateX(75deg) translateZ(-150px) translate3d(${heroMouseX * -15}px, ${finalGridY}px, 0)`;
                }
            } else {
                if (cube1 && cube1.style.transform) cube1.style.transform = '';
                if (cube2 && cube2.style.transform) cube2.style.transform = '';
                if (orb1 && orb1.style.transform) orb1.style.transform = '';
                if (orb2 && orb2.style.transform) orb2.style.transform = '';
                if (orb3 && orb3.style.transform) orb3.style.transform = '';
                if (grid && grid.style.transform) grid.style.transform = '';
            }

            lastScrollY = scrollY;
            lastHeroMouseX = heroMouseX;
            lastHeroMouseY = heroMouseY;
            lastGridOffset = gridOffset;
        }

        requestAnimationFrame(animateFrame);
    }
    requestAnimationFrame(animateFrame);

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

    // Check if we need to open the founder message on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === 'message') {
        setTimeout(() => {
            if (typeof window.openFounderMessage === 'function') {
                window.openFounderMessage();
            }
        }, 600);
    }

    // ═══════════════════════════════════════════════════
    // 10. PREMIUM 3D CARD TILT & MOUSE PARALLAX EFFECTS
    // ═══════════════════════════════════════════════════
    
    // Tag static cards on page load for the 3D tilt effect
    const staticCards = document.querySelectorAll(
        '#projects .glass-panel, #experience .glass-panel, #skills .glass-panel, #founder .glass-panel, .glass-panel.rounded-3xl, .glass-panel.rounded-2xl'
    );
    staticCards.forEach(card => {
        // Exclude elements that shouldn't tilt (like AI agent panel, modals, navigation)
        if (
            card.closest('#ai-agent-panel') || 
            card.closest('.modal-content') || 
            card.id === 'ai-agent-panel' || 
            card.closest('nav')
        ) {
            return;
        }
        card.classList.add('tilt-card');
    });

    // Event Delegation for Card 3D Tilt (highly performant and supports dynamically added elements)
    let activeCard = null;

    document.addEventListener('mousemove', (e) => {
        // Safe check for mobile or reduced motion preferences
        if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const card = e.target.closest('.tilt-card, .repo-card, .short-card');
        
        if (!card) {
            if (activeCard) {
                resetCard(activeCard);
                activeCard = null;
            }
            return;
        }

        if (card !== activeCard) {
            if (activeCard) {
                resetCard(activeCard);
            }
            activeCard = card;
            activeCard.classList.add('tilt-active');
            activeCard.classList.add('tilt-moving');
        }
        
        tiltCard(e, activeCard);
    });

    document.addEventListener('mouseleave', () => {
        if (activeCard) {
            resetCard(activeCard);
            activeCard = null;
        }
    });

    function tiltCard(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max tilt range
        const maxTilt = 8;
        const rotateX = ((centerY - y) / centerY) * maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        
        // Update glare coordinates
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        card.style.setProperty('--glare-x', `${pctX}%`);
        card.style.setProperty('--glare-y', `${pctY}%`);
        card.style.setProperty('--glare-opacity', '0.12');
    }

    function resetCard(card) {
        card.classList.remove('tilt-active');
        card.classList.remove('tilt-moving');
        card.style.transform = '';
        card.style.setProperty('--glare-opacity', '0');
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

// 9. Founder Message Redirect Helper for secondary pages
function openFounderMessage() {
    window.location.href = "index.html?open=message";
}
window.openFounderMessage = openFounderMessage;
