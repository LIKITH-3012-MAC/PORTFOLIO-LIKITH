import React from 'react';
import { useFrame } from '@react-three/fiber';

export function CameraRig({ quality }) {
  useFrame((state, delta) => {
    if (!quality.pointerInteraction) return;
    const { pointer } = state;
    
    // Dampened camera movement tracking mouse pointer
    const safeDelta = Math.min(delta, 0.05);
    const damping = 1 - Math.exp(-3.7 * safeDelta);
    state.camera.position.x += (pointer.x * 0.5 - state.camera.position.x) * damping;
    state.camera.position.y += (pointer.y * 0.3 - state.camera.position.y) * damping;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default CameraRig;
