import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

import NebulaField from './NebulaField';
import StarField from './StarField';
import CometSystem from './CometSystem';
import ShootingStars from './ShootingStars';
import CosmicDust from './CosmicDust';
import CosmicCameraRig from './CosmicCameraRig';
import CosmicScrollController from './CosmicScrollController';

// Import existing digital intelligence components
import NeuralCore from '../objects/NeuralCore';
import OrbitalRing from '../objects/OrbitalRing';
import ParticleField from '../objects/ParticleField';
import HolographicGrid from '../objects/HolographicGrid';
import NeuralGalaxy from '../objects/NeuralGalaxy';

export const CosmicScene = ({ quality, prefersReduced }) => {
  const location = useLocation();
  const shootingStarsRef = useRef(null);
  const { size, camera } = useThree();
  
  // Track scrollProgress locally to share with NebulaField and CosmicDust
  const [scrollProgress, setScrollProgress] = useState(0);

  // Print runtime diagnostics in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.table({
        webglSupported: true,
        width: size.width,
        height: size.height,
        deviceTier: quality.tier,
        starCount: quality.starCount,
        cometCount: quality.maxComets,
        reducedMotion: prefersReduced,
        cameraX: camera.position.x.toFixed(2),
        cameraY: camera.position.y.toFixed(2),
        cameraZ: camera.position.z.toFixed(2),
        sceneActive: true,
        animationStatus: 'running'
      });
    }
  }, [size.width, size.height, quality, prefersReduced, camera.position.x, camera.position.y, camera.position.z]);

  // Transition factors for route changes
  const factorsRef = useRef({
    stretch: 0,
    flatten: 0,
    grid: 0,
    line: 0
  });

  const [factors, setFactors] = useState({
    stretch: 0,
    flatten: 0,
    grid: 0,
    line: 0
  });

  // Trigger shooting star on route transition triggers
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      if (shootingStarsRef.current) {
        // Trigger a bright cinematic streak during screen/route changes
        shootingStarsRef.current.trigger();
      }
    }
  }, [location.pathname]);

  useFrame((state) => {
    const path = location.pathname;

    // Define target metrics for each route
    const targets = {
      stretch: path === '/youtube' ? 1.0 : 0.0,
      flatten: path === '/collab' ? 1.0 : 0.0,
      grid: (path === '/git-profile' || path === '/data') ? 1.0 : 0.0,
      line: path === '/problem' ? 1.0 : 0.0
    };

    // Smoothly ease route factors
    const f = factorsRef.current;
    const easeSpeed = 0.08;
    f.stretch += (targets.stretch - f.stretch) * easeSpeed;
    f.flatten += (targets.flatten - f.flatten) * easeSpeed;
    f.grid += (targets.grid - f.grid) * easeSpeed;
    f.line += (targets.line - f.line) * easeSpeed;

    // Trigger state update occasionally for visual bindings
    setFactors({
      stretch: f.stretch,
      flatten: f.flatten,
      grid: f.grid,
      line: f.line
    });

    // Capture active scroll index from scene userData
    if (state.scene.userData.scrollProgress !== undefined) {
      setScrollProgress(state.scene.userData.scrollProgress);
    }
  });

  // Hide or flatten components if routing is collab/flat
  const showDigitalCore = location.pathname === '/' || location.pathname === '/index.html';

  return (
    <group>
      {/* 1. Deep Space Shaders & Starfields (Global backdrop) */}
      <NebulaField quality={quality} scrollProgress={scrollProgress} />
      <StarField quality={quality} prefersReduced={prefersReduced} routeFactors={factors} />
      
      {/* 2. Drifting Space Elements */}
      <CometSystem quality={quality} prefersReduced={prefersReduced} />
      <ShootingStars ref={shootingStarsRef} quality={quality} prefersReduced={prefersReduced} />
      <CosmicDust quality={quality} scrollProgress={scrollProgress} />

      {/* 3. Interactive Neural Galaxy Constellations */}
      <NeuralGalaxy quality={quality} prefersReduced={prefersReduced} />

      {/* 4. Central Intelligence Group (Neural/Data Elements) */}
      {showDigitalCore && (
        <group name="main-intelligence-group">
          <NeuralCore quality={quality} prefersReduced={prefersReduced} />
          <OrbitalRing quality={quality} prefersReduced={prefersReduced} />
          <ParticleField quality={quality} prefersReduced={prefersReduced} />
          <HolographicGrid quality={quality} prefersReduced={prefersReduced} />
        </group>
      )}

      {/* 5. Cosmic Controllers */}
      <CosmicCameraRig quality={quality} prefersReduced={prefersReduced} />
      <CosmicScrollController quality={quality} />
    </group>
  );
};

export default CosmicScene;
