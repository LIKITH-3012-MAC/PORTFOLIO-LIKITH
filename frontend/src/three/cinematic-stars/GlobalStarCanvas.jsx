import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import useWebGLSupport from '../../hooks/useWebGLSupport';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useQuality } from '../../hooks/useAdaptive3DQuality';
import StarFallback from './StarFallback';
import CinematicStarUniverse from './CinematicStarUniverse';
import SolarSystemScene from '../solar-system/SolarSystemScene';
import PerformanceMonitor from '../performance/PerformanceMonitor';

export const GlobalStarCanvas = ({ introActive, introTime, onIntroComplete }) => {
  const hasWebGL = useWebGLSupport();
  const prefersReduced = useReducedMotion();
  const location = useLocation();
  const { quality, downgradeQuality } = useQuality();
  const [tabVisible, setTabVisible] = useState(true);

  // Track visibility API to pause rendering when backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const isCanvasRoute = ['/', '/index.html', '/collab', '/git-profile', '/youtube', '/data', '/problem'].includes(location.pathname);

  // Return layered CSS fallback if WebGL is unsupported
  if (!hasWebGL) {
    return <StarFallback />;
  }

  // Suspend canvas loop if tab is hidden or user is on non-canvas route
  const loopMode = (tabVisible && isCanvasRoute) ? 'always' : 'never';

  return (
    <div className="cosmic-background">
      <Canvas
        shadows={quality.tier === 'desktop' || quality.tier === 'ultra'}
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        dpr={quality.dpr}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
        frameloop={loopMode}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        {/* 1. Cinematic Background Universe */}
        <CinematicStarUniverse 
          quality={quality} 
          prefersReduced={prefersReduced} 
          currentPath={location.pathname}
        />

        {/* 2. Interactive Solar System Elements */}
        <SolarSystemScene 
          quality={quality} 
          prefersReduced={prefersReduced} 
          introActive={introActive}
          introTime={introTime}
          onIntroComplete={onIntroComplete}
          currentPath={location.pathname}
        />

        <PerformanceMonitor downgradeQuality={downgradeQuality} />
      </Canvas>
    </div>
  );
};

export default GlobalStarCanvas;
