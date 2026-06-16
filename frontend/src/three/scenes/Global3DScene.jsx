import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import useWebGLSupport from '../../hooks/useWebGLSupport';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useQuality } from '../../hooks/useAdaptive3DQuality';
import WebGLFallback from '../../components/effects/WebGLFallback';

import SceneLighting from '../lighting/SceneLighting';
import NeuralCore from '../objects/NeuralCore';
import OrbitalRing from '../objects/OrbitalRing';
import ParticleField from '../objects/ParticleField';
import HolographicGrid from '../objects/HolographicGrid';
import CameraRig from '../camera/CameraRig';
import ScrollCameraController from '../camera/ScrollCameraController';
import PerformanceMonitor from '../performance/PerformanceMonitor';

export function Global3DScene() {
  const hasWebGL = useWebGLSupport();
  const prefersReduced = useReducedMotion();
  const location = useLocation();
  const { quality, downgradeQuality } = useQuality();
  const [tabVisible, setTabVisible] = useState(true);

  // Monitor Page Visibility API to suspend draw calls when tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const isHome = location.pathname === '/' || location.pathname === '/index.html';

  if (!hasWebGL || quality.tier === 'low') {
    // Return CSS ambient grid fallback
    return <WebGLFallback />;
  }

  // Route-aware pausing and tab-visibility controls
  const loopMode = (tabVisible && isHome) ? 'always' : 'never';

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        dpr={quality.dpr}
        gl={{ alpha: true, antialias: true }}
        frameloop={loopMode}
      >
        <SceneLighting quality={quality} />
        
        {/* Persistent 3D Group. Its scale and positions are updated via scroll */}
        <group name="main-intelligence-group">
          <NeuralCore quality={quality} prefersReduced={prefersReduced} />
          <OrbitalRing quality={quality} prefersReduced={prefersReduced} />
          <ParticleField quality={quality} prefersReduced={prefersReduced} />
          <HolographicGrid quality={quality} prefersReduced={prefersReduced} />
        </group>

        <CameraRig quality={quality} />
        <ScrollCameraController quality={quality} />
        <PerformanceMonitor downgradeQuality={downgradeQuality} />
      </Canvas>
    </div>
  );
}

export default Global3DScene;
