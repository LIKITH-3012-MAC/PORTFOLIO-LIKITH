import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SceneLighting({ quality }) {
  const spotlightRef = useRef();

  useFrame((state) => {
    // Spotlight follows pointer on high-performance configurations
    if (spotlightRef.current && quality.pointerInteraction) {
      const pointer = state.pointer;
      const viewport = state.viewport;
      
      const mx = pointer.x * viewport.width * 0.4;
      const my = pointer.y * viewport.height * 0.4;
      
      spotlightRef.current.position.x += (mx - spotlightRef.current.position.x) * 0.08;
      spotlightRef.current.position.y += (my - spotlightRef.current.position.y) * 0.08;
    }
  });

  return (
    <group>
      {/* Ambient background illumination */}
      <ambientLight intensity={quality.tier === 'low' ? 0.7 : 0.25} />

      {/* Key spotlight casting soft shadows */}
      <directionalLight 
        position={[4, 7, 5]} 
        intensity={quality.tier === 'low' ? 0.6 : 1.2} 
        color="#ffffff" 
        castShadow={quality.enableShadows}
        shadow-mapSize={[1024, 1024]}
      />

      {/* Pointer tracker highlighting */}
      {quality.tier !== 'low' && (
        <pointLight 
          ref={spotlightRef}
          position={[0, 0, 3.5]} 
          intensity={1.8} 
          distance={7} 
          color="#fbbf24" // amber
        />
      )}

      {/* Cinematic rim color fill */}
      {quality.tier !== 'low' && (
        <directionalLight 
          position={[-6, -4, -3]} 
          intensity={0.7} 
          color="#8b5cf6" // violet
        />
      )}
    </group>
  );
}

export default SceneLighting;
