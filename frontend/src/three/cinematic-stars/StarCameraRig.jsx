import React from 'react';
import { useFrame } from '@react-three/fiber';

export const StarCameraRig = ({ quality, prefersReduced }) => {
  useFrame((state, delta) => {
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
    const safeDelta = Math.min(delta, 0.05);
    const damping = 1 - Math.exp(-3.0 * safeDelta);
    state.camera.position.x += (targetX - state.camera.position.x) * damping;
    state.camera.position.y += (targetY - state.camera.position.y) * damping;

    // Ensure camera up vector is always vertical when not in intro
    if (state.camera.up.x !== 0 || state.camera.up.y !== 1 || state.camera.up.z !== 0) {
      state.camera.up.set(0, 1, 0);
    }

    // Keep camera aligned to target center
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

export default StarCameraRig;
