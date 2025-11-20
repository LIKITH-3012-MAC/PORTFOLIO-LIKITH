// 1. Navbar Scroll Behavior
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Add 'scrolled' class after scrolling 50px down
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    // Set current year for the footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuContent = document.getElementById('mobile-menu-content') || mobileMenu;
    
    // Clone desktop links into mobile menu
    const desktopLinks = document.querySelector('.hidden.md\\:flex');
    if (mobileMenu && desktopLinks) {
        mobileMenuContent.innerHTML = `
            <button id="close-menu-btn" class="absolute top-6 right-6 text-slate-800 hover:text-morning-gold">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <div class="flex flex-col space-y-6 text-center">
                ${desktopLinks.innerHTML}
            </div>
        `;
        mobileMenuContent.querySelectorAll('a').forEach(link => {
            link.classList.remove('nav-link', 'text-xs', 'font-mono');
            link.classList.add('text-xl', 'py-4', 'w-full', 'block');
            link.addEventListener('click', () => {
                closeMobileMenu();
                document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Reinitialize Lucide icons for the new content (the 'x' icon)
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    const openMobileMenu = () => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        document.getElementById('close-menu-btn')?.addEventListener('click', closeMobileMenu);
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    };

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    
});

// 2. Global Modal Variables and Functions
const infoModal = document.getElementById('more-info-modal');
const featureModal = document.getElementById('feature-info-modal');

/**
 * Universal function to close any modal.
 * @param {HTMLElement} modal - The modal element to close.
 */
const closeModal = (modal) => {
    modal.classList.add('opacity-0', 'pointer-events-none');
};


/**
 * Global function to open the specific project/achievement modal.
 * This needs to be defined globally as it's called from the HTML onclick attributes.
 * @param {string} title - The title of the project.
 * @param {string} description - The description/metrics.
 * @param {string} link - The external link (e.g., LinkedIn/GitHub).
 */
window.showFeatureInfo = (title, description, link) => {
    
    // --- DIRECT REDIRECTION FOR AI TOOL PROMETHEUS (AS REQUESTED) ---
    if (title.includes('Prometheus')) {
        const prometheusLink = 'https://www.linkedin.com/posts/likhith-naidu-anumakonda-33a347327_heres-my-own-ai-tool-prometheus-working-activity-7366461485377617920-UpNK?utm_source=share&utm_medium=member_android&rcm=ACoAAFJ0SR4B07s_UcD08YSRW3iIQCJcKF1he1o';
        window.open(prometheusLink, '_blank');
        return; // Stop execution here and skip modal
    }
    // --- END DIRECT REDIRECTION ---

    let modalContent;

    // --- GENERIC MODAL CONTENT (for all other projects) ---
    modalContent = `
        <div class="section-card p-8 rounded-xl max-w-xl w-11/12 shadow-soft-glow relative">
            <button onclick="closeModal(featureModal)" class="absolute top-4 right-4 text-slate-800 hover:text-morning-gold"><i data-lucide="x-circle" class="w-8 h-8"></i></button>
            <h3 class="text-3xl soft-title mb-4">${title}</h3>
            <p class="text-slate-700 mb-6">${description}</p>
            <a href="${link}" target="_blank" class="button-soft !block text-center">VIEW LINKEDIN POST</a>
        </div>
    `;


    featureModal.innerHTML = modalContent;
    featureModal.classList.remove('opacity-0', 'pointer-events-none');
    
    // Reinitialize Lucide icons for the new content (the 'x-circle' icon)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};


// 3. Contact Bar Functionality (POPULATED WITH YOUR DATA)
document.querySelectorAll('.more-info-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const infoType = e.currentTarget.getAttribute('data-info');
        let content = '';

        // Define content based on data-info attribute
        switch (infoType) {
            case 'github':
                content = `
                    <p class="text-lg">Access the code repository via GitHub.</p>
                    <a href="https://github.com/LIKITH-3012-MAC" target="_blank" class="button-soft !block text-center mt-4">VIEW GITHUB REPOSITORY</a>
                `;
                break;
            case 'linkedin':
                content = `
                    <p class="text-lg">Connect to view my professional network and endorsements.</p>
                    <a href="https://www.linkedin.com/in/likhith-naidu-anumakonda-33a347327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" class="button-soft !block text-center mt-4">LINKEDIN PROFILE</a>
                `;
                break;
            case 'email':
                content = `
                    <p class="text-lg">Direct Signal Contact (Choose Preferred Client):</p>
                    <a href="mailto:likith.naidu@icloud.com" class="button-soft !block text-center mt-4 mb-2">Apple Mail: likith.naidu@icloud.com</a>
                    <a href="mailto:likith.anumakonda@gmail.com" class="button-soft !block text-center">Google Mail: likith.anumakonda@gmail.com</a>
                `;
                break;
            case 'mobile':
                content = `
                    <p class="text-lg">Communication Link (Available after 10:00 AM IST):</p>
                    <span class="text-2xl font-bold text-morning-gold">+91 94401 13763</span>
                    <a href="tel:+919440113763" class="button-soft !block text-center mt-4">CALL LINK</a>
                `;
                break;
        }

        // Populate and show the contact bar modal
        infoModal.innerHTML = `
            <div class="section-card p-8 rounded-xl max-w-sm w-11/12 text-center shadow-soft-glow relative">
                <button onclick="closeModal(infoModal)" class="absolute top-4 right-4 text-slate-800 hover:text-morning-gold"><i data-lucide="x-circle" class="w-8 h-8"></i></button>
                <div class="mb-4 text-glow" data-text="${infoType.toUpperCase()}">${infoType.toUpperCase()}</div>
                ${content}
            </div>
        `;
        infoModal.classList.remove('opacity-0', 'pointer-events-none');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
});


// 4. Dark/Light Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Optional: Save preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}


// 5. Morning Ripple Click Effect
document.addEventListener('click', (e) => {
    const ripple = document.getElementById('morning-ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    // Reset and start animation
    ripple.classList.remove('active');
    void ripple.offsetWidth; // Trigger reflow
    ripple.classList.add('active');
});
