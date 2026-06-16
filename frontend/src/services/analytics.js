import CONFIG from './config';

export async function trackVisit(pagePath = window.location.pathname) {
  try {
    // 1. Get or create an anonymous session ID
    let sessionId = localStorage.getItem('likith_visit_id');
    if (!sessionId) {
      sessionId = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('likith_visit_id', sessionId);
    }

    // 2. Extract safe metadata
    const ua = navigator.userAgent;
    
    // Simple OS detection
    let os = "Unknown";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "MacOS";
    else if (ua.indexOf("X11") !== -1) os = "UNIX";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

    // Device type detection
    let deviceType = "Desktop";
    if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
    else if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

    // Browser detection
    let browser = "Other";
    if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";
    else if (ua.indexOf("Edge") !== -1) browser = "Edge";

    const data = {
      page_path: pagePath || "/",
      os_name: os,
      device_type: deviceType,
      browser_name: browser,
      user_agent_summary: `${browser} on ${os} (${deviceType})`,
      referrer: document.referrer || "Direct",
      session_id: sessionId
    };

    await fetch(`${CONFIG.API_BASE_URL}/api/analytics/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics intake skipped.', error);
  }
}

export default { trackVisit };
