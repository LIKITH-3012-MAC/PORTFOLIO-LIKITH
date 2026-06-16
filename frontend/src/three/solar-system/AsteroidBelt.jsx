import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AsteroidBelt = ({
  innerRadius = 12,
  outerRadius = 14,
  count = 600,
  ySpread = 0.6,
  baseColor = '#888899'
}) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { matrices, rotSpeeds } = useMemo(() => {
    const m = [];
    const rs = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = innerRadius + Math.random() * (outerRadius - innerRadius);
      const y = (Math.random() - 0.5) * ySpread;

      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const sx = 0.015 + Math.random() * 0.045;
      const sy = sx * (0.5 + Math.random() * 1.0);
      const sz = sx * (0.5 + Math.random() * 1.0);

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      m.push(dummy.matrix.clone());

      rs.push({
        orbitSpeed: 0.008 + Math.random() * 0.015,
        tumble: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ),
        angle,
        dist,
        y
      });
    }

    return { matrices: m, rotSpeeds: rs };
  }, [count, innerRadius, outerRadius, ySpread]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);

    for (let i = 0; i < count; i++) {
      const r = rotSpeeds[i];
      r.angle += r.orbitSpeed * dt;

      dummy.position.set(
        Math.cos(r.angle) * r.dist,
        r.y,
        Math.sin(r.angle) * r.dist
      );

      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      dummy.position.set(
        Math.cos(r.angle) * r.dist,
        r.y,
        Math.sin(r.angle) * r.dist
      );

      // Tumble rotation
      dummy.rotation.x += r.tumble.x * dt;
      dummy.rotation.y += r.tumble.y * dt;
      dummy.rotation.z += r.tumble.z * dt;

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Set initial matrices
  useMemo(() => {
    if (meshRef.current) {
      matrices.forEach((mat, i) => {
        meshRef.current.setMatrixAt(i, mat);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={baseColor}
        roughness={0.85}
        metalness={0.3}
        flatShading
      />
    </instancedMesh>
  );
};

export default AsteroidBelt;
