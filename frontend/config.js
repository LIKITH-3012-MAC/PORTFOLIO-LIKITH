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

function navigateToProblem({ id, result, type, source }) {
    navigateTo("problem.html", { id, result, type, source });
}

if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
    window.buildUrl = buildUrl;
    window.navigateTo = navigateTo;
    window.navigateToProblem = navigateToProblem;
}
