export const QUALITY_PRESETS = {
  low: {
    tier: 'low',
    dpr: 1.0,
    particleCount: 150,
    enableLighting: false,
    enableShadows: false,
    postProcessing: false,
    pointerInteraction: false,
    shaderComplexity: 'low',
    animationSpeed: 0.5,
  },
  medium: {
    tier: 'medium',
    dpr: 1.2,
    particleCount: 350,
    enableLighting: true,
    enableShadows: false,
    postProcessing: false,
    pointerInteraction: true,
    shaderComplexity: 'medium',
    animationSpeed: 0.8,
  },
  high: {
    tier: 'high',
    dpr: 1.5,
    particleCount: 800,
    enableLighting: true,
    enableShadows: true,
    postProcessing: true,
    pointerInteraction: true,
    shaderComplexity: 'high',
    animationSpeed: 1.0,
  },
  ultra: {
    tier: 'ultra',
    dpr: 2.0,
    particleCount: 1500,
    enableLighting: true,
    enableShadows: true,
    postProcessing: true,
    pointerInteraction: true,
    shaderComplexity: 'high',
    animationSpeed: 1.2,
  }
};

export default QUALITY_PRESETS;
