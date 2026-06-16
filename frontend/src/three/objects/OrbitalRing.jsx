import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OrbitalRing({ quality, prefersReduced }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current || prefersReduced) return;
    const time = state.clock.getElapsedTime();
    const speed = quality.animationSpeed || 1.0;
    
    groupRef.current.rotation.z = time * 0.018 * speed;
    groupRef.current.rotation.x = time * 0.012 * speed;
  });

  return (
    <group ref={groupRef}>
      {/* Primary torus wireframe ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.012, 16, 100]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={quality.tier === 'low' ? 0.04 : 0.14} 
          wireframe 
        />
      </mesh>

      {/* Secondary diagonal energy ring */}
      {quality.tier !== 'low' && (
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[4.2, 0.006, 8, 80]} />
          <meshBasicMaterial 
            color="#a855f7" 
            transparent 
            opacity={quality.tier === 'medium' ? 0.05 : 0.08} 
            wireframe 
          />
        </mesh>
      )}
    </group>
  );
}

export default OrbitalRing;
