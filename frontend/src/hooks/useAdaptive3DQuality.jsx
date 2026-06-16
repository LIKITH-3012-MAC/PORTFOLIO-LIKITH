import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useDeviceTier from './useDeviceTier';
import useReducedMotion from './useReducedMotion';
import { SOLAR_QUALITY_PRESETS } from '../three/solar-system/solarConfig';

const QualityContext = createContext(null);

export const QualityProvider = ({ children }) => {
  const deviceTier = useDeviceTier();
  const prefersReduced = useReducedMotion();
  const [quality, setQuality] = useState(SOLAR_QUALITY_PRESETS.desktop);

  useEffect(() => {
    if (prefersReduced || deviceTier === 'low') {
      setQuality(SOLAR_QUALITY_PRESETS.low);
    } else if (deviceTier === 'medium') {
      setQuality(SOLAR_QUALITY_PRESETS.mobile);
    } else {
      setQuality(SOLAR_QUALITY_PRESETS.desktop);
    }
  }, [deviceTier, prefersReduced]);

  const downgradeQuality = useCallback(() => {
    setQuality((current) => {
      if (current.tier === 'desktop') {
        console.warn('[QualityEngine] Performance degradation detected. Downgrading to Mobile/Medium Quality.');
        return SOLAR_QUALITY_PRESETS.mobile;
      }
      if (current.tier === 'mobile') {
        console.warn('[QualityEngine] Performance degradation detected. Downgrading to Low Quality.');
        return SOLAR_QUALITY_PRESETS.low;
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
