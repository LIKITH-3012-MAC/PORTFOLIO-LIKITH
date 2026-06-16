import { useState, useEffect } from 'react';
import useMediaQuery from './useMediaQuery';

export function useDeviceTier() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [tier, setTier] = useState('high');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for low-power parameters
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 8; // in GB

    // Device tier decision matrix
    if (isMobile || cores <= 4 || memory <= 4) {
      setTier('low');
    } else if (isTablet || cores <= 6 || memory <= 6) {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, [isMobile, isTablet]);

  return tier;
}

export default useDeviceTier;
