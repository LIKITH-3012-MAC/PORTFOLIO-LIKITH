export const COSMIC_QUALITY_PRESETS = {
  low: {
    tier: 'low',
    starCount: 350,
    foregroundStars: 20,
    dustCount: 30,
    maxComets: 1,
    cometTrailSegments: 10,
    nebula: false,
    twinkleSpeedMult: 0.5,
    postProcessing: false,
    dpr: 1.0
  },
  mobile: {
    tier: 'mobile',
    starCount: 700,
    foregroundStars: 40,
    dustCount: 80,
    maxComets: 1,
    cometTrailSegments: 18,
    nebula: true,
    twinkleSpeedMult: 1.0,
    postProcessing: false,
    dpr: 1.0
  },
  medium: {
    tier: 'medium',
    starCount: 1200,
    foregroundStars: 80,
    dustCount: 150,
    maxComets: 2,
    cometTrailSegments: 30,
    nebula: true,
    twinkleSpeedMult: 1.2,
    postProcessing: false,
    dpr: 1.25
  },
  high: {
    tier: 'high',
    starCount: 2200,
    foregroundStars: 150,
    dustCount: 280,
    maxComets: 3,
    cometTrailSegments: 48,
    nebula: true,
    twinkleSpeedMult: 1.5,
    postProcessing: true,
    dpr: 1.5
  }
};

export const COSMIC_SECTION_METRICS = {
  mobile: {
    hero: { pos: [0, 0.6, 0], scale: 0.65, camZ: 7.5, nebulaIntensity: 0.25, cometFrequency: 0.8 },
    about: { pos: [0, 0.2, 0], scale: 0.55, camZ: 7.0, nebulaIntensity: 0.18, cometFrequency: 0.4 },
    experience: { pos: [0, 0.1, -0.5], scale: 0.45, camZ: 8.0, nebulaIntensity: 0.15, cometFrequency: 0.2 },
    projects: { pos: [0, -0.2, 0], scale: 0.5, camZ: 7.2, nebulaIntensity: 0.20, cometFrequency: 0.5 },
    skills: { pos: [0, 0, 0], scale: 0.55, camZ: 7.5, nebulaIntensity: 0.22, cometFrequency: 0.4 },
    founder: { pos: [0, 0.2, -0.5], scale: 0.5, camZ: 8.0, nebulaIntensity: 0.25, cometFrequency: 0.6 },
    contact: { pos: [0, 0, -1.2], scale: 0.4, camZ: 9.0, nebulaIntensity: 0.12, cometFrequency: 0.1 }
  },
  desktop: {
    hero: { pos: [1.8, 0, 0], scale: 1.1, camZ: 5.5, nebulaIntensity: 0.35, cometFrequency: 1.0 },
    about: { pos: [0, -0.2, 0], scale: 0.9, camZ: 4.5, nebulaIntensity: 0.20, cometFrequency: 0.5 },
    experience: { pos: [-1.8, 0.3, 0], scale: 0.82, camZ: 5.8, nebulaIntensity: 0.15, cometFrequency: 0.2 },
    projects: { pos: [0, -0.4, 0], scale: 1.0, camZ: 5.0, nebulaIntensity: 0.25, cometFrequency: 0.6 },
    skills: { pos: [0, 0, 0], scale: 1.15, camZ: 5.2, nebulaIntensity: 0.30, cometFrequency: 0.5 },
    founder: { pos: [1.6, 0.2, 0], scale: 1.0, camZ: 5.5, nebulaIntensity: 0.35, cometFrequency: 0.8 },
    contact: { pos: [0, 0, -2.0], scale: 0.6, camZ: 7.8, nebulaIntensity: 0.15, cometFrequency: 0.15 }
  }
};

export default { COSMIC_QUALITY_PRESETS, COSMIC_SECTION_METRICS };
