import useDeviceTier from './useDeviceTier';

export function useResponsiveScene() {
  const tier = useDeviceTier();

  const configs = {
    low: {
      particleCount: 80,
      dpr: 1.0,
      enableLighting: false,
      enablePostProcessing: false,
      speedMultiplier: 0.4,
      lines: false,
      interactive: false
    },
    medium: {
      particleCount: 200,
      dpr: 1.2,
      enableLighting: true,
      enablePostProcessing: false,
      speedMultiplier: 0.7,
      lines: true,
      interactive: false
    },
    high: {
      particleCount: 450,
      dpr: 1.5,
      enableLighting: true,
      enablePostProcessing: true,
      speedMultiplier: 1.0,
      lines: true,
      interactive: true
    }
  };

  return configs[tier] || configs.high;
}

export default useResponsiveScene;
