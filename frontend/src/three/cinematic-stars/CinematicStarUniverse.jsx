import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import DistantStarField from './DistantStarField';
import MidStarField from './MidStarField';
import ForegroundStars from './ForegroundStars';
import FocalStars from './FocalStars';
import GalacticBand from './GalacticBand';
import NebulaField from './NebulaField';
import CosmicDust from './CosmicDust';
import ShootingStarSystem from './ShootingStarSystem';
import NeuralConstellations from './NeuralConstellations';
import EnergyRibbons from './EnergyRibbons';
import StarCameraRig from './StarCameraRig';
import StarSceneController from './StarSceneController';

export const CinematicStarUniverse = ({ quality, prefersReduced, currentPath }) => {
  const sharedUniforms = useRef({
    uTime: { value: 0 },
    uCameraPosition: { value: new THREE.Vector3() },
    uCameraVelocity: { value: new THREE.Vector3() },
    uCameraSpeed: { value: 0 },
    uCometPosition: { value: new THREE.Vector3(-999, -999, -999) },
    uCometRadius: { value: 6.0 },
    uRouteFactors: { value: new THREE.Vector4(0, 0, 0, 0) }, // x: stretch, y: flatten, z: grid, w: line
    uMaxOpacity: { value: 0.95 },
    uPrefersReduced: { value: prefersReduced ? 1.0 : 0.0 },
    uBoxSize: { value: new THREE.Vector3(60.0, 40.0, 40.0) }
  });

  const lastCamPos = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const camPos = state.camera.position;

    // Calculate camera velocity and speed
    const velocity = new THREE.Vector3().subVectors(camPos, lastCamPos.current);
    const speed = THREE.MathUtils.clamp(velocity.length() / Math.max(delta, 0.001), 0.0, 10.0);
    lastCamPos.current.copy(camPos);

    const u = sharedUniforms.current;
    u.uTime.value = elapsed;
    u.uCameraPosition.value.copy(camPos);
    u.uCameraVelocity.value.copy(velocity);

    const safeDelta = Math.min(delta, 0.05);
    const speedDamping = 1 - Math.exp(-6.3 * safeDelta);
    u.uCameraSpeed.value += (speed - u.uCameraSpeed.value) * speedDamping;

    // Proximity to active comet in scene userData
    const cometPos = state.scene.userData.cometPos;
    if (cometPos) {
      u.uCometPosition.value.copy(cometPos);
    } else {
      u.uCometPosition.value.set(-999, -999, -999);
    }

    // Route transitions targets mapping
    const path = currentPath || '/';
    const targets = {
      stretch: path === '/youtube' ? 1.0 : 0.0,
      flatten: path === '/collab' ? 1.0 : 0.0,
      grid: (path === '/git-profile' || path === '/data') ? 1.0 : 0.0,
      line: path === '/problem' ? 1.0 : 0.0
    };

    const cf = u.uRouteFactors.value;
    const routeDamping = 1 - Math.exp(-3.7 * safeDelta);
    cf.x += (targets.stretch - cf.x) * routeDamping;
    cf.y += (targets.flatten - cf.y) * routeDamping;
    cf.z += (targets.grid - cf.z) * routeDamping;
    cf.w += (targets.line - cf.w) * routeDamping;

    // Update prefers reduced motion uniform
    u.uPrefersReduced.value = prefersReduced ? 1.0 : 0.0;

    // Calculate dynamic aspect ratio box size
    const aspect = state.size.width / state.size.height;
    const boxX = 60.0 * Math.max(1.0, aspect * 0.7);
    u.uBoxSize.value.set(boxX, 40.0, 40.0);
  });

  return (
    <group>
      {/* 1. Environment Controllers */}
      <StarCameraRig quality={quality} prefersReduced={prefersReduced} />
      <StarSceneController quality={quality} currentPath={currentPath} />

      {/* 2. Star Layers (Deep background to Foreground) */}
      <DistantStarField quality={quality} uniforms={sharedUniforms.current} />
      <GalacticBand quality={quality} uniforms={sharedUniforms.current} />
      <MidStarField quality={quality} uniforms={sharedUniforms.current} />
      <ForegroundStars quality={quality} uniforms={sharedUniforms.current} />
      <FocalStars quality={quality} uniforms={sharedUniforms.current} />

      {/* 3. Deep Atmospheric & Space elements */}
      {quality.nebulaQuality !== 'low' && (
        <NebulaField quality={quality} uniforms={sharedUniforms.current} />
      )}
      <CosmicDust quality={quality} uniforms={sharedUniforms.current} />
      <ShootingStarSystem quality={quality} prefersReduced={prefersReduced} uniforms={sharedUniforms.current} />

      {/* 4. Interactive Constellation & Ribbon layers */}
      <NeuralConstellations quality={quality} prefersReduced={prefersReduced} uniforms={sharedUniforms.current} />
      <EnergyRibbons quality={quality} uniforms={sharedUniforms.current} />
    </group>
  );
};

export default CinematicStarUniverse;
