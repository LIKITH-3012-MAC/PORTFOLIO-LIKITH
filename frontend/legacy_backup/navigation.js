/**
 * Navigation & Source Tracking Utility
 * Standardizes URL generation and navigation across the platform.
 */

const VALID_SOURCES = ["nav", "hero", "agent", "footer", "form", "email", "problem", "direct", "collab"];

/**
 * Builds a production-grade URL with source tracking and hash support.
 * @param {string} page - The destination page (e.g., 'index.html', 'collab.html').
 * @param {Object} params - Query parameters.
 * @param {string} hash - Section anchor (e.g., '#about').
 * @returns {string} - The formatted URL.
 */
function buildUrl(page, params = {}, hash = "") {
  // Ensure we don't have double extensions or missing .html for local files
  let targetPage = page;
  if (targetPage && !targetPage.includes('.') && !targetPage.startsWith('#') && !targetPage.startsWith('http')) {
    targetPage = `${targetPage}.html`;
  }

  const query = new URLSearchParams();

  // Add parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  const cleanHash = hash ? String(hash).replace("#", "") : "";
  const hashString = cleanHash ? `#${encodeURIComponent(cleanHash)}` : "";

  return `${targetPage}${queryString ? `?${queryString}` : ""}${hashString}`;
}

/**
 * Executes navigation to a page with tracking.
 */
function navigateTo(page, params = {}, hash = "") {
  const url = buildUrl(page, params, hash);
  console.log(`[Navigation] Navigating to: ${url}`);
  window.location.href = url;
}

/**
 * Extracts and returns tracking information from the current URL.
 */
function getUrlTracking() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("source"),
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    ref: params.get("ref"),
    fbclid: params.get("fbclid"),
    gclid: params.get("gclid"),
    hash_section: window.location.hash ? window.location.hash.replace("#", "") : null,
    landing_page: window.location.pathname
  };
}

/**
 * Stores tracking data in sessionStorage on page load.
 */
function initializeTracking() {
  const tracking = getUrlTracking();
  const existingTracking = JSON.parse(sessionStorage.getItem("site_tracking") || "{}");

  // Only store if we have new meaningful data, don't overwrite with nulls
  const updatedTracking = { ...existingTracking };
  
  Object.entries(tracking).forEach(([key, value]) => {
    if (value) {
      updatedTracking[key] = value;
    }
  });

  if (Object.keys(updatedTracking).length > 0) {
    sessionStorage.setItem("site_tracking", JSON.stringify(updatedTracking));
    console.log("[Navigation] Tracking updated:", updatedTracking);
  }

  // Handle smooth scroll for hashes on load
  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "");
    sessionStorage.setItem("last_hash_section", hash);
    
    // Smooth scroll after a short delay to allow DOM/Lenis to settle
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: 0, duration: 1.5 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 800);
  }
}

// Automatically initialize on load
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeTracking);
} else {
  initializeTracking();
}

// Export for use in other scripts
window.Navigation = {
  buildUrl,
  navigateTo,
  getUrlTracking,
  initializeTracking
};
