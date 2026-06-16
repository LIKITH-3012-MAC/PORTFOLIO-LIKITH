import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import useWebGLSupport from '../../hooks/useWebGLSupport';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useQuality } from '../../hooks/useAdaptive3DQuality';
import CosmicFallback from './CosmicFallback';
import CosmicScene from './CosmicScene';
import PerformanceMonitor from '../performance/PerformanceMonitor';

export const CosmicCanvas = () => {
  const hasWebGL = useWebGLSupport();
  const prefersReduced = useReducedMotion();
  const location = useLocation();
  const { quality, downgradeQuality } = useQuality();
  const [tabVisible, setTabVisible] = useState(true);

  // Monitor Page Visibility API to suspend draw loops when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const isCanvasRoute = ['/', '/index.html', '/collab', '/git-profile', '/youtube', '/data', '/problem'].includes(location.pathname);

  // Render static/CSS fallback on low quality, low-tier, or when WebGL is unsupported
  if (!hasWebGL || quality.tier === 'low') {
    return <CosmicFallback />;
  }

  // Suspend canvas loop if tab is hidden or user is on non-canvas route (e.g. 404)
  const loopMode = (tabVisible && isCanvasRoute) ? 'always' : 'never';

  return (
    <div className="cosmic-background">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        dpr={quality.dpr}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={loopMode}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <CosmicScene quality={quality} prefersReduced={prefersReduced} />
        <PerformanceMonitor downgradeQuality={downgradeQuality} />
      </Canvas>
    </div>
  );
};

export default CosmicCanvas;
