export const ROUTE_STATES = {
  '/': { stretch: 0, flatten: 0, grid: 0, line: 0, dustOpacity: 1.0, nebulaOpacity: 1.0 },
  '/index.html': { stretch: 0, flatten: 0, grid: 0, line: 0, dustOpacity: 1.0, nebulaOpacity: 1.0 },
  '/collab': { stretch: 0, flatten: 1.0, grid: 0, line: 0, dustOpacity: 0.3, nebulaOpacity: 0.5 },
  '/git-profile': { stretch: 0, grid: 1.0, flatten: 0, line: 0, dustOpacity: 0.2, nebulaOpacity: 0.3 },
  '/youtube': { stretch: 1.0, flatten: 0, grid: 0, line: 0, dustOpacity: 0.8, nebulaOpacity: 0.7 },
  '/data': { stretch: 0, grid: 1.0, flatten: 0, line: 0, dustOpacity: 0.4, nebulaOpacity: 0.4 },
  '/problem': { stretch: 0, line: 1.0, flatten: 0, grid: 0, dustOpacity: 0.3, nebulaOpacity: 0.3 },
};

export const SECTION_METRICS = {
  mobile: {
    hero: { pos: [0, 0.4, 0], scale: 0.60, camZ: 8.5, nebulaIntensity: 0.3, dustIntensity: 0.8, focalStarIntensity: 1.0 },
    about: { pos: [-1.2, 0.1, 2.5], scale: 1.60, camZ: 6.0, nebulaIntensity: 0.15, dustIntensity: 0.4, focalStarIntensity: 0.6 },
    experience: { pos: [0, -0.3, -1.0], scale: 0.65, camZ: 9.0, nebulaIntensity: 0.12, dustIntensity: 0.3, focalStarIntensity: 0.4 },
    projects: { pos: [1.2, -0.2, 1.8], scale: 1.30, camZ: 7.0, nebulaIntensity: 0.2, dustIntensity: 0.5, focalStarIntensity: 0.8 },
    skills: { pos: [0, 0, -2.0], scale: 0.80, camZ: 8.5, nebulaIntensity: 0.25, dustIntensity: 0.6, focalStarIntensity: 0.7 },
    founder: { pos: [-1.5, 0.3, 3.2], scale: 1.80, camZ: 5.5, nebulaIntensity: 0.3, dustIntensity: 0.8, focalStarIntensity: 1.0 },
    contact: { pos: [0, 0, -4.0], scale: 0.45, camZ: 10.0, nebulaIntensity: 0.1, dustIntensity: 0.2, focalStarIntensity: 0.3 },
  },
  desktop: {
    hero: { pos: [1.8, 0, 0], scale: 1.05, camZ: 6.8, nebulaIntensity: 0.35, dustIntensity: 1.0, focalStarIntensity: 1.0 },
    about: { pos: [-2.0, 0.2, 2.8], scale: 1.85, camZ: 5.0, nebulaIntensity: 0.2, dustIntensity: 0.5, focalStarIntensity: 0.6 },
    experience: { pos: [0, -0.5, -2.0], scale: 0.75, camZ: 8.0, nebulaIntensity: 0.15, dustIntensity: 0.3, focalStarIntensity: 0.4 },
    projects: { pos: [2.5, -0.3, 1.9], scale: 1.55, camZ: 5.5, nebulaIntensity: 0.25, dustIntensity: 0.6, focalStarIntensity: 0.8 },
    skills: { pos: [0, 0, -2.5], scale: 1.00, camZ: 7.2, nebulaIntensity: 0.3, dustIntensity: 0.7, focalStarIntensity: 0.7 },
    founder: { pos: [-2.6, 0.4, 3.6], scale: 2.20, camZ: 4.8, nebulaIntensity: 0.35, dustIntensity: 0.9, focalStarIntensity: 1.0 },
    contact: { pos: [0, 0, -5.0], scale: 0.50, camZ: 9.5, nebulaIntensity: 0.15, dustIntensity: 0.3, focalStarIntensity: 0.3 },
  }
};

export default { ROUTE_STATES, SECTION_METRICS };
