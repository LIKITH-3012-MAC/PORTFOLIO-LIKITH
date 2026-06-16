import React from 'react';
import { useFrame } from '@react-three/fiber';

export const StarCameraRig = ({ quality, prefersReduced }) => {
  useFrame((state) => {
    // 1. Gentle procedural camera drift (disabled in reduced-motion)
    const elapsed = state.clock.getElapsedTime();
    let driftX = 0;
    let driftY = 0;

    if (!prefersReduced) {
      driftX = Math.sin(elapsed * 0.25) * 0.35;
      driftY = Math.cos(elapsed * 0.2) * 0.22;
    }

    // 2. Restrained pointer parallax (disabled on touch devices and reduced motion)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    let targetX = driftX;
    let targetY = driftY;

    if (!prefersReduced && !isTouchDevice && quality.tier !== 'low') {
      const pointer = state.pointer;
      targetX += pointer.x * 1.6;
      targetY += pointer.y * 0.9;
    }

    // Smooth dampening
    const ease = 0.05;
    state.camera.position.x += (targetX - state.camera.position.x) * ease;
    state.camera.position.y += (targetY - state.camera.position.y) * ease;

    // Keep camera aligned to target center
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

export default StarCameraRig;
