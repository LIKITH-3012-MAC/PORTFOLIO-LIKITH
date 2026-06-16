import React from 'react';
import { useFrame } from '@react-three/fiber';

export function CameraRig({ quality }) {
  useFrame((state) => {
    if (!quality.pointerInteraction) return;
    const { pointer } = state;
    
    // Dampened camera movement tracking mouse pointer
    state.camera.position.x += (pointer.x * 0.5 - state.camera.position.x) * 0.06;
    state.camera.position.y += (pointer.y * 0.3 - state.camera.position.y) * 0.06;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default CameraRig;
