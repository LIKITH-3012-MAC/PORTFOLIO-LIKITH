import { useState, useEffect } from 'react';

export function useWebGLSupport() {
  const [support, setSupport] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const hasSupport = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setSupport(hasSupport);
    } catch (e) {
      setSupport(false);
    }
  }, []);

  return support;
}

export default useWebGLSupport;
