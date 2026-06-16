import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Multi-layer instanced star field with parallax depth and twinkling
export const StarField = ({ count = 2500, spread = 100, layers = 3 }) => {
  const pointsRefs = useRef([]);

  const layerData = useMemo(() => {
    return Array.from({ length: layers }).map((_, layerIdx) => {
      const layerCount = Math.floor(count / layers);
      const depth = (layerIdx + 1) / layers; // 0.33 -> 0.66 -> 1.0
      const layerSpread = spread * depth;

      const positions = new Float32Array(layerCount * 3);
      const colors = new Float32Array(layerCount * 3);
      const sizes = new Float32Array(layerCount);
      const twinklePhase = new Float32Array(layerCount);
      const twinkleSpeed = new Float32Array(layerCount);

      const starColors = [
        new THREE.Color('#ffffff'), // white
        new THREE.Color('#ffe4cc'), // warm
        new THREE.Color('#cce4ff'), // cool blue
        new THREE.Color('#ffffcc'), // yellow
        new THREE.Color('#ffd4ff'), // pink
      ];

      for (let i = 0; i < layerCount; i++) {
        // Distribute in a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = layerSpread * 0.5 + Math.random() * layerSpread * 0.5;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Random star color
        const c = starColors[Math.floor(Math.random() * starColors.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        // Size varies by layer — distant stars are smaller
        sizes[i] = (0.03 + Math.random() * 0.08) * (1 - depth * 0.3);

        twinklePhase[i] = Math.random() * Math.PI * 2;
        twinkleSpeed[i] = 0.3 + Math.random() * 1.5;
      }

      return {
        positions,
        colors,
        sizes,
        twinklePhase,
        twinkleSpeed,
        layerCount,
        drift: depth * 0.003  // Parallax drift speed
      };
    });
  }, [count, spread, layers]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    layerData.forEach((layer, li) => {
      const pts = pointsRefs.current[li];
      if (!pts) return;

      // Slow drift for parallax
      pts.rotation.y = t * layer.drift;
      pts.rotation.x = Math.sin(t * layer.drift * 0.5) * 0.02;

      // Twinkling via size modulation
      const sizeAttr = pts.geometry.attributes.size;
      if (sizeAttr) {
        for (let i = 0; i < layer.layerCount; i++) {
          const base = layer.sizes[i];
          const twinkle = Math.sin(t * layer.twinkleSpeed[i] + layer.twinklePhase[i]);
          sizeAttr.array[i] = base * (0.6 + twinkle * 0.4);
        }
        sizeAttr.needsUpdate = true;
      }
    });
  });

  return (
    <group>
      {layerData.map((layer, li) => (
        <points
          key={li}
          ref={(el) => { pointsRefs.current[li] = el; }}
          frustumCulled={false}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[layer.colors, 3]} />
            <bufferAttribute attach="attributes-size" args={[layer.sizes, 1]} />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            size={0.06}
            sizeAttenuation
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  );
};

export default StarField;
