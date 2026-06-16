export const CAMERA_CONFIG = {
  mobile: {
    hero: { pos: [0, 0.6, 0], scale: 0.65, camZ: 7.5 },
    about: { pos: [0, 0.2, 0], scale: 0.55, camZ: 7.0 },
    experience: { pos: [0, 0.1, -0.5], scale: 0.45, camZ: 8.0 },
    projects: { pos: [0, -0.2, 0], scale: 0.5, camZ: 7.2 },
    skills: { pos: [0, 0, 0], scale: 0.55, camZ: 7.5 },
    founder: { pos: [0, 0.2, -0.5], scale: 0.5, camZ: 8.0 },
    contact: { pos: [0, 0, -1.2], scale: 0.4, camZ: 9.0 }
  },
  desktop: {
    hero: { pos: [1.8, 0, 0], scale: 1.1, camZ: 5.5 },
    about: { pos: [0, -0.2, 0], scale: 0.9, camZ: 4.5 },
    experience: { pos: [-1.8, 0.3, 0], scale: 0.82, camZ: 5.8 },
    projects: { pos: [0, -0.4, 0], scale: 1.0, camZ: 5.0 },
    skills: { pos: [0, 0, 0], scale: 1.15, camZ: 5.2 },
    founder: { pos: [1.6, 0.2, 0], scale: 1.0, camZ: 5.5 },
    contact: { pos: [0, 0, -2.0], scale: 0.6, camZ: 7.8 }
  }
};

export default CAMERA_CONFIG;
