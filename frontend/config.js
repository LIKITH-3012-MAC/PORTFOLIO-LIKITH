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
function buildUrl(page, params = {}, hash = "") {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, value);
        }
    });

    const queryString = query.toString();
    const url = queryString ? `${page}?${queryString}` : page;
    return hash ? `${url}#${hash.replace('#', '')}` : url;
}

function navigateTo(page, params = {}, hash = "") {
    window.location.href = buildUrl(page, params, hash);
}

function navigateToProblem(params = {}) {
    // Preserve current source in problem redirect if not explicitly provided
    if (!params.source) {
        params.source = getStoredSource() || "form";
    }
    navigateTo("problem.html", params);
}

// URL Tracking & Parameter Intelligence
function parseTrackingParams() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash ? window.location.hash.replace('#', '') : null;
    
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
        type: params.get("type"),
        token: params.get("token"),
        hash: hash
    };
}

function storeTrackingParams() {
    const trackingKeys = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 
        'utm_term', 'fbclid', 'gclid', 'source', 'ref', 'campaign'
    ];
    
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash ? window.location.hash.replace('#', '') : null;
    let hasTracking = false;
    
    trackingKeys.forEach(key => {
        const val = params.get(key);
        if (val) {
            sessionStorage.setItem(`visitor_${key}`, val);
            hasTracking = true;
        }
    });

    if (hash) {
        sessionStorage.setItem('visitor_hash_section', hash);
        hasTracking = true;
    }

    if (hasTracking || !sessionStorage.getItem('visitor_landing_page')) {
        if (!sessionStorage.getItem('visitor_landing_page')) {
            sessionStorage.setItem('visitor_landing_page', window.location.pathname || 'index.html');
        }
        if (!sessionStorage.getItem('visitor_referrer')) {
            sessionStorage.setItem('visitor_referrer', document.referrer || '');
        }
    }

    // Clean tracking params visually without breaking essential app state
    cleanURLVisually(params);
}

function getStoredSource() {
    return sessionStorage.getItem('visitor_source') || 
           sessionStorage.getItem('visitor_utm_source') || 
           sessionStorage.getItem('visitor_hash_section') || 
           null;
}

function getStoredTrackingPayload() {
    return {
        source: sessionStorage.getItem('visitor_source'),
        utm_source: sessionStorage.getItem('visitor_utm_source'),
        utm_medium: sessionStorage.getItem('visitor_utm_medium'),
        utm_campaign: sessionStorage.getItem('visitor_utm_campaign'),
        utm_content: sessionStorage.getItem('visitor_utm_content'),
        utm_term: sessionStorage.getItem('visitor_utm_term'),
        referrer: sessionStorage.getItem('visitor_referrer'),
        landing_page: sessionStorage.getItem('visitor_landing_page'),
        hash_section: sessionStorage.getItem('visitor_hash_section')
    };
}

function cleanURLVisually(params) {
    const essentialParams = [
        'id', 'result', 'type', 'token', 'code', 'state', 'reason', 
        'fullname', 'phone', 'country', 'state', 'collaboration_type', 'purpose'
    ];
    const newQuery = new URLSearchParams();
    let keepQuery = false;

    for (const [key, value] of params.entries()) {
        if (essentialParams.includes(key)) {
            newQuery.set(key, value);
            keepQuery = true;
        }
    }

    const currentHash = window.location.hash;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + 
                   (keepQuery ? '?' + newQuery.toString() : '') + 
                   currentHash;
                   
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
    window.buildUrl = buildUrl;
    window.navigateTo = navigateTo;
    window.navigateToProblem = navigateToProblem;
    window.parseTrackingParams = parseTrackingParams;
    window.storeTrackingParams = storeTrackingParams;
    window.getStoredSource = getStoredSource;
    window.getStoredTrackingPayload = getStoredTrackingPayload;
}
