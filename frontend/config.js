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

// Global Navigation Helpers
function buildUrl(page, params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, value);
        }
    });

    const queryString = query.toString();
    return queryString ? `${page}?${queryString}` : page;
}

function navigateTo(page, params = {}) {
    window.location.href = buildUrl(page, params);
}

function navigateToProblem(params = {}) {
    navigateTo("problem.html", params);
}

// URL Tracking & Parameter Intelligence
function parseTrackingParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content"),
        utm_term: params.get("utm_term"),
        fbclid: params.get("fbclid"),
        gclid: params.get("gclid"),
        source: params.get("source"),
        ref: params.get("ref"),
        campaign: params.get("campaign"),
        id: params.get("id"),
        result: params.get("result"),
        type: params.get("type")
    };
}

function storeTrackingParams() {
    const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 
        'utm_term', 'fbclid', 'gclid', 'source', 'ref', 'campaign'
    ];
    
    const params = new URLSearchParams(window.location.search);
    let hasTracking = false;
    
    trackingParams.forEach(param => {
        const val = params.get(param);
        if (val) {
            sessionStorage.setItem(`visitor_${param}`, val);
            hasTracking = true;
        }
    });

    if (hasTracking && !sessionStorage.getItem('visitor_landing_page')) {
        sessionStorage.setItem('visitor_landing_page', window.location.pathname || 'index.html');
        sessionStorage.setItem('visitor_referrer', document.referrer || '');
    }

    // Clean tracking params visually without breaking state params
    cleanURLVisually(params);
}

function cleanURLVisually(params) {
    const essentialParams = [
        'id', 'result', 'type', 'code', 'state', 'reason', 
        'fullname', 'phone', 'country', 'district', 'mandal', 'village',
        'collaboration_type', 'purpose', 'organization', 'timeline', 'email', 
        'budget_range', 'preferred_contact_method'
    ];
    const newQuery = new URLSearchParams();
    let keepQuery = false;

    for (const [key, value] of params.entries()) {
        if (essentialParams.includes(key)) {
            newQuery.set(key, value);
            keepQuery = true;
        }
    }

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + (keepQuery ? '?' + newQuery.toString() : '');
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
    window.buildUrl = buildUrl;
    window.navigateTo = navigateTo;
    window.navigateToProblem = navigateToProblem;
    window.parseTrackingParams = parseTrackingParams;
    window.storeTrackingParams = storeTrackingParams;
}
