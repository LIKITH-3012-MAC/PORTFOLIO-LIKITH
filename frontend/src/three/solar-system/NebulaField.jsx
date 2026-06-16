import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './materials/NebulaMaterial';

// Nebula billboards scattered at far distance to create depth atmosphere
export const NebulaField = ({ count = 4, spread = 50 }) => {
  const refs = useRef([]);
  const matRefs = useRef([]);

  const nebulaData = useMemo(() => {
    const colors1 = ['#1a1040', '#201845', '#0a1530', '#1c1340'];
    const colors2 = ['#4a2070', '#2a4080', '#603060', '#304870'];

    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const r = spread * 0.6 + Math.random() * spread * 0.4;
      const y = (Math.random() - 0.5) * spread * 0.3;

      return {
        position: new THREE.Vector3(
          Math.cos(angle) * r,
          y,
          Math.sin(angle) * r
        ),
        scale: 15 + Math.random() * 25,
        rotation: Math.random() * Math.PI * 2,
        color1: colors1[i % colors1.length],
        color2: colors2[i % colors2.length],
        opacity: 0.06 + Math.random() * 0.06
      };
    });
  }, [count, spread]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    matRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.uTime = t;
      }
    });

    // Billboard: always face camera
    refs.current.forEach((mesh) => {
      if (mesh) {
        mesh.lookAt(state.camera.position);
      }
    });
  });

  return (
    <group>
      {nebulaData.map((neb, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={neb.position}
          rotation={[0, neb.rotation, 0]}
        >
          <planeGeometry args={[neb.scale, neb.scale]} />
          <nebulaMaterial
            ref={(el) => { matRefs.current[i] = el; }}
            uColor1={new THREE.Color(neb.color1)}
            uColor2={new THREE.Color(neb.color2)}
            uOpacity={neb.opacity}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export default NebulaField;
