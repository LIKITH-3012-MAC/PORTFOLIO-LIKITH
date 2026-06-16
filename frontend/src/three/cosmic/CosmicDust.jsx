import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicDust = ({ quality, scrollProgress = 0 }) => {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  
  const count = quality.dustCount || 0;

  // Memoize positions and drift dynamics
  const dustData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const dynamics = []; // Store custom frequency, amplitude, and phases

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5; // Drift around camera/mid depth

      dynamics.push({
        freqX: Math.random() * 0.1 + 0.05,
        freqY: Math.random() * 0.1 + 0.05,
        ampX: Math.random() * 0.4 + 0.1,
        ampY: Math.random() * 0.4 + 0.1,
        phaseX: Math.random() * Math.PI * 2.0,
        phaseY: Math.random() * Math.PI * 2.0,
        baseX: positions[i * 3],
        baseY: positions[i * 3 + 1]
      });
    }

    return { positions, dynamics };
  }, [count]);

  useFrame((state) => {
    if (count === 0 || !pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position');

    // Smoothly drift each dust particle
    for (let i = 0; i < count; i++) {
      const dyn = dustData.dynamics[i];
      const newX = dyn.baseX + Math.sin(time * dyn.freqX + dyn.phaseX) * dyn.ampX;
      const newY = dyn.baseY + Math.cos(time * dyn.freqY + dyn.phaseY) * dyn.ampY;

      posAttr.setXY(i, newX, newY);
    }
    posAttr.needsUpdate = true;

    // React to scroll index: fade dust out in contact (section 6) & experience (section 2)
    // Map scrollProgress [0-6] to target opacity
    // Hero: 0.8, Contact: 0.1, others: 0.45
    let targetOpacity = 0.45;
    if (scrollProgress < 0.5) {
      targetOpacity = THREE.MathUtils.lerp(0.45, 0.8, 1.0 - scrollProgress * 2);
    } else if (scrollProgress > 5.2) {
      targetOpacity = THREE.MathUtils.lerp(0.45, 0.1, (scrollProgress - 5.2) / 0.8);
    }

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        0.05
      );
    }
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[dustData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default CosmicDust;
