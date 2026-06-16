import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import HologramShaderMaterial from '../materials/HologramMaterial';

export function HolographicGrid({ quality, prefersReduced }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  // Render floor grids only on medium and above tiers
  if (quality.tier === 'low') return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
      <planeGeometry args={[16, 16, 1, 1]} />
      <hologramShaderMaterial 
        ref={materialRef} 
        uColor={new THREE.Color('#3b82f6')} 
        uSpeed={0.6}
        uScanlines={30.0}
        uGlow={0.8}
        transparent
      />
    </mesh>
  );
}

export default HolographicGrid;
