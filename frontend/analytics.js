(function() {
    // Advanced Visitor Tracking for Likith's Portfolio
    // Records essential visit details securely and privately.

    async function trackVisit() {
        try {
            // 1. Get or create an anonymous session ID
            let sessionId = localStorage.getItem('likith_visit_id');
            if (!sessionId) {
                sessionId = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                localStorage.setItem('likith_visit_id', sessionId);
            }

            // 2. Extract safe metadata
            const ua = navigator.userAgent;
            const platform = navigator.platform;
            
            // Simple OS detection
            let os = "Unknown";
            if (ua.indexOf("Win") != -1) os = "Windows";
            if (ua.indexOf("Mac") != -1) os = "MacOS";
            if (ua.indexOf("X11") != -1) os = "UNIX";
            if (ua.indexOf("Linux") != -1) os = "Linux";
            if (/Android/.test(ua)) os = "Android";
            if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

            // Device type detection
            let deviceType = "Desktop";
            if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
            if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

            // Browser detection
            let browser = "Other";
            if (ua.indexOf("Chrome") != -1) browser = "Chrome";
            else if (ua.indexOf("Firefox") != -1) browser = "Firefox";
            else if (ua.indexOf("Safari") != -1) browser = "Safari";
            else if (ua.indexOf("Edge") != -1) browser = "Edge";

            const data = {
                page_path: window.location.pathname || "/",
                os_name: os,
                device_type: deviceType,
                browser_name: browser,
                user_agent_summary: `${browser} on ${os} (${deviceType})`,
                referrer: document.referrer || "Direct",
                session_id: sessionId
            };

            // 3. Send to backend
            const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || "https://portfolio-likith.onrender.com";
            
            await fetch(`${API_BASE}/api/analytics/visit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

        } catch (error) {
            // Fail silently to not affect user experience
            console.warn('Analytics intake skipped.');
        }
    }

    // Trigger on load
    if (document.readyState === 'complete') {
        trackVisit();
    } else {
        window.addEventListener('load', trackVisit);
    }
})();
