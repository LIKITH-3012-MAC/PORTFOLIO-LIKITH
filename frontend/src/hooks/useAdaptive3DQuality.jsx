import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useDeviceTier from './useDeviceTier';
import useReducedMotion from './useReducedMotion';
import QUALITY_PRESETS from '../three/config/qualityPresets';

const QualityContext = createContext(null);

export const QualityProvider = ({ children }) => {
  const deviceTier = useDeviceTier();
  const prefersReduced = useReducedMotion();
  const [quality, setQuality] = useState(QUALITY_PRESETS.high);

  useEffect(() => {
    let initialTier = deviceTier;
    if (prefersReduced) {
      initialTier = 'low';
    } else if (deviceTier === 'high' && navigator.deviceMemory > 8 && navigator.hardwareConcurrency > 8) {
      // If we have great specs, promote to Ultra
      initialTier = 'ultra';
    }
    setQuality(QUALITY_PRESETS[initialTier] || QUALITY_PRESETS.low);
  }, [deviceTier, prefersReduced]);

  const downgradeQuality = useCallback(() => {
    setQuality((current) => {
      if (current.tier === 'ultra') {
        console.warn('[QualityEngine] Performance degradation detected. Downgrading to High Quality.');
        return QUALITY_PRESETS.high;
      }
      if (current.tier === 'high') {
        console.warn('[QualityEngine] Performance degradation detected. Downgrading to Medium Quality.');
        return QUALITY_PRESETS.medium;
      }
      if (current.tier === 'medium') {
        console.warn('[QualityEngine] Performance degradation detected. Downgrading to Low Quality.');
        return QUALITY_PRESETS.low;
      }
      return current;
    });
  }, []);

  return (
    <QualityContext.Provider value={{ quality, downgradeQuality }}>
      {children}
    </QualityContext.Provider>
  );
};

export const useQuality = () => {
  const context = useContext(QualityContext);
  if (!context) {
    throw new Error('useQuality must be used within a QualityProvider');
  }
  return context;
};

export default useQuality;
