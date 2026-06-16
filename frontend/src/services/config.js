const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.protocol === 'file:'
);

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (
    isLocal ? "http://127.0.0.1:8000" : "https://portfolio-likith.onrender.com"
  ),
  SITE_URL: "https://likith-portfolio.online",
  TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAADkBJO3pDza4-pkc",
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

export default CONFIG;
