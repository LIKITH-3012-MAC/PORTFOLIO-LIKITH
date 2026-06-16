import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './materials/AtmosphereMaterial';
import './materials/RingMaterial';

// Atmosphere shell (Fresnel rim glow)
const PlanetAtmosphere = ({ radius, color, sunPosition }) => {
  const matRef = useRef();

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uSunPosition = sunPosition;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.08, 32, 32]} />
      <atmosphereMaterial
        ref={matRef}
        uAtmosphereColor={new THREE.Color(color)}
        uSunPosition={sunPosition}
        uGlowPower={4.5}
        uGlowCoefficient={0.35}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Independent cloud layer
const CloudLayer = ({ radius, speed }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius * 1.015, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.18}
        depthWrite={false}
        roughness={1}
      />
    </mesh>
  );
};

// Ring system (Saturn, Uranus, Neptune)
const PlanetRingSystem = ({ config, planetScale, sunPosition }) => {
  const matRef = useRef();

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uSunPosition = sunPosition;
    }
  });

  const outerR = planetScale * config.outerRadius;

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetScale * config.innerRadius, outerR, 64]} />
      <ringMaterial
        ref={matRef}
        uRingColor={new THREE.Color(config.color)}
        uOpacity={config.opacity}
        uInnerRadius={config.innerRadius}
        uOuterRadius={config.outerRadius}
        uSunPosition={sunPosition}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Moon system
const MoonSystem = ({ moons, parentScale, sunPosition }) => {
  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    moons.forEach((moon, i) => {
      const group = refs.current[i];
      if (!group) return;
      const angle = t * moon.orbitSpeed;
      const r = moon.orbitRadius * parentScale;
      group.position.x = Math.cos(angle) * r;
      group.position.z = Math.sin(angle) * r;
      group.children[0].rotation.y = t * (moon.rotationSpeed || 0.1);
    });
  });

  return (
    <group>
      {moons.map((moon, i) => (
        <group key={moon.name} ref={(el) => { refs.current[i] = el; }}>
          <mesh>
            <sphereGeometry args={[moon.scale, 16, 16]} />
            <meshStandardMaterial
              color={moon.color}
              roughness={moon.roughness || 0.8}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Planet = ({ id, config, quality, sunPosition = new THREE.Vector3(0, 0, 0) }) => {
  const groupRef = useRef();
  const meshRef = useRef();

  const orbitRadius = config.orbitRadius || 0;
  const orbitSpeed = config.orbitSpeed || 0;
  const rotationSpeed = config.rotationSpeed || 0;
  const tilt = config.tilt || 0;
  const scale = config.scale;

  // Planet surface material - use procedural color bands for gas giants
  const isGasGiant = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(id);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Orbital movement
    if (groupRef.current && orbitRadius > 0) {
      const angle = t * orbitSpeed;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    }

    // Self-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * rotationSpeed;
    }
  });

  const showAtmosphere = quality.atmosphereEnabled && config.atmosphereColor;
  const showRings = quality.ringsEnabled && config.rings;
  const showMoons = quality.moonsEnabled && config.moons && config.moons.length > 0;

  return (
    <group ref={groupRef}>
      {/* Axial tilt */}
      <group rotation={[tilt, 0, 0]}>
        {/* Planet body */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[scale, isGasGiant ? 48 : 32, isGasGiant ? 48 : 32]} />
          <meshStandardMaterial
            color={config.color}
            roughness={config.roughness || 0.5}
            metalness={0.05}
          />
        </mesh>

        {/* Cloud layer (Earth) */}
        {config.hasClouds && (
          <CloudLayer radius={scale} speed={config.cloudsSpeed || 0.04} />
        )}

        {/* Atmosphere glow */}
        {showAtmosphere && (
          <PlanetAtmosphere
            radius={scale}
            color={config.atmosphereColor}
            sunPosition={sunPosition}
          />
        )}

        {/* Ring system */}
        {showRings && (
          <PlanetRingSystem
            config={config.rings}
            planetScale={scale}
            sunPosition={sunPosition}
          />
        )}

        {/* Moons */}
        {showMoons && (
          <MoonSystem
            moons={config.moons}
            parentScale={scale * 2.5}
            sunPosition={sunPosition}
          />
        )}
      </group>
    </group>
  );
};

export default Planet;
