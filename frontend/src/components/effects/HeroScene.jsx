import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useResponsiveScene from '../../hooks/useResponsiveScene';
import useMousePosition from '../../hooks/useMousePosition';
import useReducedMotion from '../../hooks/useReducedMotion';

function ParticleSphere({ config, mouse, prefersReduced }) {
  const pointsRef = useRef();
  
  // Generate random particles coords procedurally
  const count = config.particleCount;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = THREE.MathUtils.randFloat(2.2, 4.6);
      
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Auto-spin if reduced motion is disabled
    if (!prefersReduced) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04 * config.speedMultiplier;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.015 * config.speedMultiplier;
    }

    // Interactive pointer movement on desktop
    if (config.interactive && mouse) {
      const targetX = (mouse.x / window.innerWidth - 0.5) * 0.6;
      const targetY = (mouse.y / window.innerHeight - 0.5) * 0.6;
      
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.03;
      pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.03}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function OrbitalRings({ config, prefersReduced }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current || prefersReduced) return;
    groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.015;
    groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.008;
  });

  return (
    <group ref={groupRef}>
      {/* Ambient glowing wireframe rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.6, 0.008, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent={true} opacity={0.12} wireframe={true} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[4.4, 0.005, 8, 80]} />
        <meshBasicMaterial color="#a855f7" transparent={true} opacity={0.08} wireframe={true} />
      </mesh>
    </group>
  );
}

export const HeroScene = () => {
  const config = useResponsiveScene();
  const mouse = useMousePosition();
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 55 }}
        dpr={config.dpr}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        {config.enableLighting && (
          <pointLight position={[12, 12, 12]} intensity={1.2} color="#fbbf24" />
        )}
        <ParticleSphere config={config} mouse={mouse} prefersReduced={prefersReduced} />
        {config.lines && <OrbitalRings config={config} prefersReduced={prefersReduced} />}
      </Canvas>
    </div>
  );
};

export default HeroScene;
