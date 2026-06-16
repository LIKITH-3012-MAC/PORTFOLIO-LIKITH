import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './materials/SunMaterial';

// Solar corona ring meshes
const SolarCorona = ({ scale }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {/* Inner corona glow */}
      <mesh>
        <sphereGeometry args={[scale * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Mid corona */}
      <mesh>
        <sphereGeometry args={[scale * 1.35, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer corona */}
      <mesh>
        <sphereGeometry args={[scale * 1.6, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc66"
          transparent
          opacity={0.025}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Simple solar flare arc using a tube along a Bézier curve
const SolarFlare = ({ scale, seed }) => {
  const ref = useRef();
  const matRef = useRef();

  const { curve } = useMemo(() => {
    const angle = seed * Math.PI * 2;
    const r = scale;
    const sx = Math.cos(angle) * r;
    const sy = Math.sin(angle) * r;
    const ex = Math.cos(angle + 0.3) * r;
    const ey = Math.sin(angle + 0.3) * r;
    const cx = Math.cos(angle + 0.15) * r * 1.6;
    const cy = Math.sin(angle + 0.15) * r * 1.6;

    const c = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(sx, sy, 0),
      new THREE.Vector3(cx, cy, 0),
      new THREE.Vector3(ex, ey, 0)
    );
    return { curve: c };
  }, [scale, seed]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1 + seed * 10) * 0.05;
    }
    if (matRef.current) {
      // Pulse opacity
      const t = state.clock.getElapsedTime();
      const pulse = Math.sin(t * 0.3 + seed * 20) * 0.5 + 0.5;
      matRef.current.opacity = pulse * 0.18;
    }
  });

  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 16, scale * 0.02, 6, false]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ff6600"
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Radial solar wind particles
const SolarWind = ({ scale, count = 120 }) => {
  const ref = useRef();

  const { positions, velocities, sizes, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    const sz = new Float32Array(count);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start on the sun's surface, random direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = scale * 1.05;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      vel.push(new THREE.Vector3(
        pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]
      ).normalize().multiplyScalar(0.8 + Math.random() * 0.5));

      sz[i] = 0.02 + Math.random() * 0.03;
      op[i] = Math.random();
    }

    return { positions: pos, velocities: vel, sizes: sz, opacities: op };
  }, [count, scale]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array;
    const dt = Math.min(delta, 0.1);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      posArr[idx] += velocities[i].x * dt;
      posArr[idx + 1] += velocities[i].y * dt;
      posArr[idx + 2] += velocities[i].z * dt;

      // Reset particles that drift too far
      const dist = Math.sqrt(posArr[idx] ** 2 + posArr[idx + 1] ** 2 + posArr[idx + 2] ** 2);
      if (dist > scale * 4.5) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = scale * 1.05;
        posArr[idx] = r * Math.sin(phi) * Math.cos(theta);
        posArr[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArr[idx + 2] = r * Math.cos(phi);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffaa44"
        size={0.04}
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

export const Sun = ({ config, quality }) => {
  const meshRef = useRef();
  const matRef = useRef();

  const scale = config.scale;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
    if (matRef.current) {
      matRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  const flareSeeds = useMemo(() => [0.1, 0.35, 0.62, 0.88], []);

  return (
    <group>
      {/* Sun surface sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[scale, 48, 48]} />
        <sunMaterial ref={matRef} />
      </mesh>

      {/* Central PointLight illuminating all planets */}
      <pointLight
        color="#ffeecc"
        intensity={40.0}
        distance={150.0}
        decay={1.1}
        castShadow={quality.tier === 'desktop'}
        shadow-mapSize-width={quality.tier === 'desktop' ? 1024 : 0}
        shadow-mapSize-height={quality.tier === 'desktop' ? 1024 : 0}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-bias={-0.0005}
      />

      {/* Corona layers */}
      <SolarCorona scale={scale} />

      {/* Solar flare arcs */}
      {flareSeeds.map((seed) => (
        <SolarFlare key={seed} scale={scale} seed={seed} />
      ))}

      {/* Solar wind particles */}
      {quality.tier !== 'low' && (
        <SolarWind scale={scale} count={quality.tier === 'desktop' ? 140 : 80} />
      )}
    </group>
  );
};

export default Sun;
