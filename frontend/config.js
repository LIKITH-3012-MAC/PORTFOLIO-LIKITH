const CONFIG = {
    API_BASE_URL: "https://portfolio-likith.onrender.com",
    SITE_URL: "https://likith-portfolio.online",
    CONTACT: {
        PRIMARY_EMAIL: "likith.anumakonda@gmail.com",
        SECONDARY_EMAIL: "likith.naidu@icloud.com",
        PHONE: "+919440113763",
        GITHUB: "https://github.com/LIKITH-3012-MAC",
        LINKEDIN: "https://linkedin.com/in/likith-naidu-anumakonda-33a347327",
        INSTAGRAM: "https://www.instagram.com/likhith_anumakonda?igsh=MTgxZ3hrc3BtcHAzdg==",
        X: "https://x.com/Likithdob301206?t=4FzQYS1UgCKSQBgc99xspg&s=09"
    }
};

/**
 * Legacy support for scripts using window.APP_CONFIG
 */
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
    
    // Defer to Navigation utility if available
    // We keep these on window for backward compatibility with existing scripts
    if (window.Navigation) {
        window.buildUrl = window.Navigation.buildUrl;
        window.navigateTo = window.Navigation.navigateTo;
        
        window.getStoredTrackingPayload = function() {
            const stored = JSON.parse(sessionStorage.getItem("site_tracking") || "{}");
            return {
                source: stored.source || null,
                utm_source: stored.utm_source || null,
                utm_medium: stored.utm_medium || null,
                utm_campaign: stored.utm_campaign || null,
                utm_content: stored.utm_content || null,
                utm_term: stored.utm_term || null,
                referrer: stored.ref || document.referrer || null,
                landing_page: stored.landing_page || window.location.pathname,
                hash_section: stored.hash_section || null
            };
        };

        window.navigateToProblem = function(params = {}) {
            const tracking = window.Navigation.getUrlTracking();
            if (!params.source) {
                params.source = tracking.source || "problem";
            }
            window.Navigation.navigateTo("problem.html", params);
        };

        // Disable aggressive cleaning - preserve source and tracking in URL
        window.storeTrackingParams = () => {
            console.log("[Config] URL parameters preserved for tracking.");
        };
    }
}
