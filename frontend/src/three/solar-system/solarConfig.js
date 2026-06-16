export const SOLAR_QUALITY_PRESETS = {
  low: {
    tier: 'low',
    starCount: 395,
    starConfig: {
      distantStars: 300,
      midStars: 80,
      foregroundStars: 12,
      brightStars: 3,
      shootingStars: 1
    },
    asteroidCount: 60,
    maxComets: 1,
    cometsEnabled: true,
    shootingStarsEnabled: true,
    nebulaEnabled: false,
    atmosphereEnabled: false,
    ringsEnabled: true,
    moonsEnabled: false,
    postProcessing: false,
    dpr: 1.0,
    visiblePlanets: ['sun', 'earth', 'saturn']
  },
  mobile: {
    tier: 'mobile',
    starCount: 839,
    starConfig: {
      distantStars: 650,
      midStars: 160,
      foregroundStars: 24,
      brightStars: 5,
      shootingStars: 1
    },
    asteroidCount: 120,
    maxComets: 1,
    cometsEnabled: true,
    shootingStarsEnabled: true,
    nebulaEnabled: true,
    atmosphereEnabled: true,
    ringsEnabled: true,
    moonsEnabled: true,
    postProcessing: false,
    dpr: 1.0,
    visiblePlanets: ['sun', 'venus', 'earth', 'jupiter', 'saturn']
  },
  desktop: {
    tier: 'desktop',
    starCount: 2302,
    starConfig: {
      distantStars: 1800,
      midStars: 420,
      foregroundStars: 70,
      brightStars: 12,
      shootingStars: 2
    },
    asteroidCount: 450,
    maxComets: 2,
    cometsEnabled: true,
    shootingStarsEnabled: true,
    nebulaEnabled: true,
    atmosphereEnabled: true,
    ringsEnabled: true,
    moonsEnabled: true,
    postProcessing: true,
    dpr: 1.5,
    visiblePlanets: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  },
  ultra: {
    tier: 'ultra',
    starCount: 3628,
    starConfig: {
      distantStars: 2800,
      midStars: 700,
      foregroundStars: 110,
      brightStars: 18,
      shootingStars: 3
    },
    asteroidCount: 600,
    maxComets: 3,
    cometsEnabled: true,
    shootingStarsEnabled: true,
    nebulaEnabled: true,
    atmosphereEnabled: true,
    ringsEnabled: true,
    moonsEnabled: true,
    postProcessing: true,
    dpr: 1.5,
    visiblePlanets: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  }
};

export const PLANET_CONFIG = {
  sun: {
    name: 'Sun',
    scale: 1.8,
    color: '#ff7700',
    emissive: '#ffdd44'
  },
  mercury: {
    name: 'Mercury',
    scale: 0.18,
    orbitRadius: 3.2,
    orbitSpeed: 0.28,
    rotationSpeed: 0.05,
    tilt: 0.01,
    color: '#8e8d8a',
    roughness: 0.9
  },
  venus: {
    name: 'Venus',
    scale: 0.38,
    orbitRadius: 4.8,
    orbitSpeed: 0.16,
    rotationSpeed: -0.02, // retrograde
    tilt: 3.1, // upside down
    color: '#e3b448',
    atmosphereColor: '#ffbb44',
    roughness: 0.6
  },
  earth: {
    name: 'Earth',
    scale: 0.42,
    orbitRadius: 6.5,
    orbitSpeed: 0.10,
    rotationSpeed: 0.15,
    tilt: 0.41, // 23.5 degrees
    color: '#1a64a0',
    atmosphereColor: '#60a5fa',
    roughness: 0.4,
    hasClouds: true,
    cloudsSpeed: 0.04,
    moons: [
      {
        name: 'Moon',
        scale: 0.08,
        orbitRadius: 0.75,
        orbitSpeed: 0.60,
        rotationSpeed: 0.10,
        color: '#b0b5bc',
        roughness: 0.9
      }
    ]
  },
  mars: {
    name: 'Mars',
    scale: 0.26,
    orbitRadius: 8.4,
    orbitSpeed: 0.07,
    rotationSpeed: 0.12,
    tilt: 0.44,
    color: '#b44b22',
    atmosphereColor: '#b45b38',
    roughness: 0.8,
    moons: [
      { name: 'Phobos', scale: 0.04, orbitRadius: 0.42, orbitSpeed: 1.2, color: '#888888' },
      { name: 'Deimos', scale: 0.03, orbitRadius: 0.58, orbitSpeed: 0.8, color: '#777777' }
    ]
  },
  jupiter: {
    name: 'Jupiter',
    scale: 1.10,
    orbitRadius: 11.8,
    orbitSpeed: 0.04,
    rotationSpeed: 0.35, // fast rotation
    tilt: 0.05,
    color: '#d4a373',
    atmosphereColor: '#c39e78',
    roughness: 0.5,
    moons: [
      { name: 'Io', scale: 0.06, orbitRadius: 1.6, orbitSpeed: 0.5, color: '#e5c158' },
      { name: 'Europa', scale: 0.05, orbitRadius: 1.9, orbitSpeed: 0.35, color: '#c0d6df' },
      { name: 'Ganymede', scale: 0.08, orbitRadius: 2.3, orbitSpeed: 0.25, color: '#9a8c98' },
      { name: 'Callisto', scale: 0.07, orbitRadius: 2.8, orbitSpeed: 0.15, color: '#4a4e69' }
    ]
  },
  saturn: {
    name: 'Saturn',
    scale: 0.92,
    orbitRadius: 16.0,
    orbitSpeed: 0.025,
    rotationSpeed: 0.30,
    tilt: 0.47,
    color: '#e9c46a',
    atmosphereColor: '#d4a373',
    roughness: 0.5,
    rings: {
      innerRadius: 1.25,
      outerRadius: 2.8,
      color: '#c2a679',
      opacity: 0.65
    },
    moons: [
      { name: 'Titan', scale: 0.09, orbitRadius: 3.4, orbitSpeed: 0.20, color: '#ffb703' },
      { name: 'Rhea', scale: 0.04, orbitRadius: 3.8, orbitSpeed: 0.12, color: '#999999' }
    ]
  },
  uranus: {
    name: 'Uranus',
    scale: 0.62,
    orbitRadius: 20.2,
    orbitSpeed: 0.015,
    rotationSpeed: -0.22, // retrograde
    tilt: 1.71, // 98 degrees (almost flat)
    color: '#a8dadc',
    atmosphereColor: '#70d6ff',
    roughness: 0.4,
    rings: {
      innerRadius: 0.9,
      outerRadius: 1.4,
      color: '#5bc0be',
      opacity: 0.2
    }
  },
  neptune: {
    name: 'Neptune',
    scale: 0.60,
    orbitRadius: 24.5,
    orbitSpeed: 0.009,
    rotationSpeed: 0.25,
    tilt: 0.52,
    color: '#457b9d',
    atmosphereColor: '#3a86c8',
    roughness: 0.4,
    rings: {
      innerRadius: 0.85,
      outerRadius: 1.2,
      color: '#3a86c8',
      opacity: 0.15
    }
  }
};

export const SOLAR_SECTION_METRICS = {
  mobile: {
    hero:       { pos: [0, 0.4, 0],    scale: 0.60, camZ: 8.5 },
    about:      { pos: [-1.2, 0.1, 2.5], scale: 1.60, camZ: 6.0 }, // Earth Focus
    experience: { pos: [0, -0.3, -1.0],  scale: 0.65, camZ: 9.0 }, // Orbit overview
    projects:   { pos: [1.2, -0.2, 1.8], scale: 1.30, camZ: 7.0 }, // Saturn Focus
    skills:     { pos: [0, 0, -2.0],     scale: 0.80, camZ: 8.5 }, // Constellations transition
    founder:    { pos: [-1.5, 0.3, 3.2], scale: 1.80, camZ: 5.5 }, // Close Sun pan
    contact:    { pos: [0, 0, -4.0],     scale: 0.45, camZ: 10.0 }
  },
  desktop: {
    hero:       { pos: [1.8, 0, 0],    scale: 1.05, camZ: 6.8 },
    about:      { pos: [-2.0, 0.2, 2.8], scale: 1.85, camZ: 5.0 }, // Earth Focus
    experience: { pos: [0, -0.5, -2.0],  scale: 0.75, camZ: 8.0 }, // Orbit overview
    projects:   { pos: [2.5, -0.3, 1.9], scale: 1.55, camZ: 5.5 }, // Saturn Focus
    skills:     { pos: [0, 0, -2.5],     scale: 1.00, camZ: 7.2 }, // Constellations transition
    founder:    { pos: [-2.6, 0.4, 3.6], scale: 2.20, camZ: 4.8 }, // Close Sun pan
    contact:    { pos: [0, 0, -5.0],     scale: 0.50, camZ: 9.5 }
  }
};

export default { SOLAR_QUALITY_PRESETS, PLANET_CONFIG, SOLAR_SECTION_METRICS };
