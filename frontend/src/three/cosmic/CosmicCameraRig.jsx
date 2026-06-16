import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicCameraRig = ({ quality, prefersReduced }) => {
  useFrame((state) => {
    const { camera, pointer, clock } = state;
    
    let targetX = 0;
    let targetY = 0;

    if (prefersReduced) {
      // Static camera
      targetX = 0;
      targetY = 0;
    } else if (quality.tier === 'low' || quality.tier === 'mobile') {
      // Mobile / Touch devices: slow, smooth autonomous drift (Lissajous curves)
      const elapsed = clock.getElapsedTime();
      targetX = Math.sin(elapsed * 0.25) * 0.4;
      targetY = Math.cos(elapsed * 0.35) * 0.25;
    } else {
      // Desktop: Pointer parallax (interactive)
      targetX = pointer.x * 0.6;
      targetY = pointer.y * 0.45;
    }

    // Dampened camera movement interpolation
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    
    // Look at center scene subtly adjusted
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return null;
};

export default CosmicCameraRig;
