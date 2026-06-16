import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './materials/CometIonTailMaterial';
import './materials/CometDustTailMaterial';

// Comet tail particles
const CometTail = ({ type = 'ion', count = 80, color, material: MatTag }) => {
  const ref = useRef();

  const { positions, sizes, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      sz[i] = 0.01 + Math.random() * (type === 'ion' ? 0.02 : 0.04);
      op[i] = Math.random();
    }

    return { positions: pos, sizes: sz, opacities: op };
  }, [count, type]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[opacities, 1]} />
      </bufferGeometry>
      {MatTag}
    </points>
  );
};

// Individual comet with nucleus, coma, and dual tails
const Comet = ({ seed = 0, speed = 1, orbitRadius = 18 }) => {
  const groupRef = useRef();
  const nucleusRef = useRef();
  const ionTailRef = useRef();
  const dustTailRef = useRef();

  const params = useMemo(() => {
    const eccentricity = 0.6 + seed * 0.2;
    const inclination = (seed - 0.5) * Math.PI * 0.3;
    const semiMajor = orbitRadius;
    const semiMinor = semiMajor * Math.sqrt(1 - eccentricity * eccentricity);
    const period = speed * (0.7 + seed * 0.6);

    return { eccentricity, inclination, semiMajor, semiMinor, period };
  }, [seed, speed, orbitRadius]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * params.period * 0.08;
    const { semiMajor, semiMinor, inclination } = params;

    // Elliptical orbit
    const x = Math.cos(t + seed * Math.PI * 2) * semiMajor;
    const z = Math.sin(t + seed * Math.PI * 2) * semiMinor;
    const y = Math.sin(t + seed * Math.PI * 2) * Math.sin(inclination) * semiMajor * 0.3;

    groupRef.current.position.set(x, y, z);

    // Set comet position in scene userData so stars can react to it
    if (seed === 0) {
      state.scene.userData.cometPos = groupRef.current.position.clone();
    }

    // Tail direction: always points away from origin (sun)
    const sunDir = groupRef.current.position.clone().normalize();

    // Ion tail - straight, pointing away from sun
    if (ionTailRef.current) {
      const ionDir = sunDir.clone().multiplyScalar(1.5);
      ionTailRef.current.position.copy(ionDir);

      // Spread ion tail particles along the anti-sun direction
      const posArr = ionTailRef.current.children[0]?.geometry?.attributes?.position?.array;
      if (posArr) {
        const cnt = posArr.length / 3;
        for (let i = 0; i < cnt; i++) {
          posArr[i * 3] = sunDir.x * (i / cnt) * 2.0 + (Math.random() - 0.5) * 0.08;
          posArr[i * 3 + 1] = sunDir.y * (i / cnt) * 2.0 + (Math.random() - 0.5) * 0.08;
          posArr[i * 3 + 2] = sunDir.z * (i / cnt) * 2.0 + (Math.random() - 0.5) * 0.08;
        }
        ionTailRef.current.children[0].geometry.attributes.position.needsUpdate = true;
      }
    }

    // Dust tail - curved, lags behind
    if (dustTailRef.current) {
      const velocity = new THREE.Vector3(
        -Math.sin(t + seed * Math.PI * 2) * params.period * 0.08,
        0,
        Math.cos(t + seed * Math.PI * 2) * params.period * 0.08
      ).normalize();

      const dustDir = sunDir.clone().add(velocity.multiplyScalar(-0.5)).normalize();

      const posArr = dustTailRef.current.children[0]?.geometry?.attributes?.position?.array;
      if (posArr) {
        const cnt = posArr.length / 3;
        for (let i = 0; i < cnt; i++) {
          const spread = (i / cnt);
          posArr[i * 3] = dustDir.x * spread * 1.8 + (Math.random() - 0.5) * 0.15 * spread;
          posArr[i * 3 + 1] = dustDir.y * spread * 1.8 + (Math.random() - 0.5) * 0.15 * spread;
          posArr[i * 3 + 2] = dustDir.z * spread * 1.8 + (Math.random() - 0.5) * 0.15 * spread;
        }
        dustTailRef.current.children[0].geometry.attributes.position.needsUpdate = true;
      }
    }

    // Nucleus tumble
    if (nucleusRef.current) {
      nucleusRef.current.rotation.x += 0.01;
      nucleusRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nucleus - irregular rocky body */}
      <mesh ref={nucleusRef}>
        <dodecahedronGeometry args={[0.06, 1]} />
        <meshStandardMaterial
          color="#444444"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Coma glow */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ion tail (blue, straight) */}
      <group ref={ionTailRef}>
        <CometTail
          type="ion"
          count={60}
          material={
            <cometIonTailMaterial
              uColor={new THREE.Color('#4488ff')}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          }
        />
      </group>

      {/* Dust tail (warm, curved) */}
      <group ref={dustTailRef}>
        <CometTail
          type="dust"
          count={50}
          material={
            <cometDustTailMaterial
              uColor={new THREE.Color('#ffbb44')}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          }
        />
      </group>
    </group>
  );
};

export const CometSystem = ({ quality }) => {
  const cometCount = quality.tier === 'desktop' || quality.tier === 'ultra' ? 3 : quality.tier === 'tablet' || quality.tier === 'mobile' ? 2 : 1;

  return (
    <group>
      {/* Comets */}
      {Array.from({ length: cometCount }).map((_, i) => (
        <Comet
          key={`comet-${i}`}
          seed={i / cometCount}
          speed={0.6 + i * 0.3}
          orbitRadius={16 + i * 6}
        />
      ))}
    </group>
  );
};

export default CometSystem;
