import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SolarCameraRig = ({ quality, prefersReduced }) => {
  useFrame((state) => {
    const { camera, pointer, clock } = state;

    let targetX = 0;
    let targetY = 0;

    if (prefersReduced) {
      // Static camera for reduced motion
      targetX = 0;
      targetY = 0;
    } else if (quality.tier === 'low' || quality.tier === 'mobile') {
      // Mobile: gentle autonomous Lissajous drift
      const elapsed = clock.getElapsedTime();
      targetX = Math.sin(elapsed * 0.18) * 0.35;
      targetY = Math.cos(elapsed * 0.28) * 0.22;
    } else {
      // Desktop: pointer parallax
      targetX = pointer.x * 0.55;
      targetY = pointer.y * 0.4;
    }

    // Dampened camera XY movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Always look at the scene center (the sun)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return null;
};

export default SolarCameraRig;
