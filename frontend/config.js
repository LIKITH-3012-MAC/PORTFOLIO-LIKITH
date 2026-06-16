const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.protocol === 'file:'
);

const CONFIG = {
    API_BASE_URL: isLocal ? "http://127.0.0.1:8000" : "https://portfolio-likith.onrender.com",
    SITE_URL: "https://likith-portfolio.online",
    CONTACT: {
        PRIMARY_EMAIL: "likith.anumakonda@gmail.com",
        SECONDARY_EMAIL: "likith.naidu@icloud.com",
        PHONE: "+919440113763",
        GITHUB: "https://github.com/LIKITH-3012-MAC",
        LINKEDIN: "https://www.linkedin.com/in/likith-naidu-anumakonda/",
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
            const params = new URLSearchParams(window.location.search);
            const urlSource = params.get("source");
            const stored = JSON.parse(sessionStorage.getItem("site_tracking") || "{}");
            
            return {
                source: urlSource || stored.source || "form",
                utm_source: params.get("utm_source") || stored.utm_source || null,
                utm_medium: params.get("utm_medium") || stored.utm_medium || null,
                utm_campaign: params.get("utm_campaign") || stored.utm_campaign || null,
                utm_content: params.get("utm_content") || stored.utm_content || null,
                utm_term: params.get("utm_term") || stored.utm_term || null,
                referrer: stored.ref || document.referrer || null,
                landing_page: stored.landing_page || (window.location.pathname + window.location.search),
                hash_section: stored.hash_section || window.location.hash.replace('#', '') || null
            };
        };

        window.navigateToProblem = function(params = {}) {
            const tracking = window.getStoredTrackingPayload();
            if (!params.source) {
                params.source = tracking.source;
            }
            window.Navigation.navigateTo("problem.html", params);
        };

        // Disable aggressive cleaning - preserve source and tracking in URL
        window.storeTrackingParams = () => {
            console.log("[Config] URL parameters preserved for tracking.");
        };
    }
}
