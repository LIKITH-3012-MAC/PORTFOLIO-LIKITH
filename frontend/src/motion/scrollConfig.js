export const SCROLL_CONFIG = {
  sections: ['hero', 'about', 'experience', 'projects', 'skills', 'founder', 'contact'],
  thresholds: {
    hero: 0.0,
    about: 0.15,
    experience: 0.35,
    projects: 0.55,
    skills: 0.72,
    founder: 0.86,
    contact: 1.0
  },
  lerpFactor: 0.08,
  touchLerpFactor: 0.15
};

export default SCROLL_CONFIG;
