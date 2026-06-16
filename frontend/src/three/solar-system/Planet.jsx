import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { usePlanetTextures } from './textures/usePlanetTextures';
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
      <sphereGeometry args={[radius * 1.025, 64, 64]} />
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

// Independent cloud layer (Earth)
const CloudLayer = ({ radius, speed, texture }) => {
  const ref = useRef();
  const matRef = useRef();
  const transitionProgress = useRef(0);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
    if (matRef.current && texture) {
      if (transitionProgress.current < 1) {
        transitionProgress.current = Math.min(1, transitionProgress.current + delta * 1.5);
        matRef.current.opacity = THREE.MathUtils.lerp(0.18, 0.65, transitionProgress.current);
      }
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius * 1.012, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#ffffff"
        map={texture || null}
        alphaMap={texture || null}
        transparent
        opacity={texture ? 0.65 : 0.18}
        depthWrite={false}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
};

// Ring system (Saturn, Uranus, Neptune)
const PlanetRingSystem = ({ config, planetScale, textures, quality }) => {
  const innerR = planetScale * config.innerRadius;
  const outerR = planetScale * config.outerRadius;

  const ringColorMap = textures?.ringColor || null;
  const ringAlphaMap = textures?.ringPattern || null;

  // Re-generate UV coordinates radially for concentric texture mapping
  const ringGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(innerR, outerR, 64);
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const u = (dist - innerR) / (outerR - innerR);
      uvs.setXY(i, u, 0.5);
    }

    geo.attributes.uv.needsUpdate = true;
    return geo;
  }, [innerR, outerR]);

  return (
    <mesh 
      geometry={ringGeometry} 
      rotation={[Math.PI / 2, 0, 0]}
      castShadow={quality?.tier === 'desktop'}
      receiveShadow={quality?.tier === 'desktop'}
    >
      {ringColorMap && ringAlphaMap ? (
        <meshStandardMaterial
          map={ringColorMap}
          alphaMap={ringAlphaMap}
          transparent
          opacity={config.opacity || 0.9}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.8}
          metalness={0.0}
        />
      ) : (
        <meshStandardMaterial
          color={config.color}
          transparent
          opacity={config.opacity || 0.65}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.8}
          metalness={0.0}
        />
      )}
    </mesh>
  );
};

// Moon system
const MoonSystem = ({ moons, parentScale, sunPosition, quality }) => {
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
          <mesh 
            castShadow={quality.tier === 'desktop'} 
            receiveShadow={quality.tier === 'desktop'}
          >
            <sphereGeometry args={[moon.scale, 16, 16]} />
            <meshStandardMaterial
              color={moon.color}
              roughness={moon.roughness || 0.8}
              metalness={0.0}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Planet = ({ id, config, quality, sunPosition = new THREE.Vector3(0, 0, 0), introActive, introTime }) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const matRef = useRef();
  const transitionProgress = useRef(0);

  const orbitRadius = config.orbitRadius || 0;
  const orbitSpeed = config.orbitSpeed || 0;
  const rotationSpeed = config.rotationSpeed || 0;
  const tilt = config.tilt || 0;
  const scale = config.scale;

  // Asynchronously load planetary textures
  const { textures, loading, fallback } = usePlanetTextures(id);

  // Compute sphere segments based on device capabilities and visual focus
  const segments = useMemo(() => {
    if (quality.tier !== 'desktop') return 32;
    if (['earth', 'saturn'].includes(id)) return 96; // focused
    if (['jupiter', 'mars', 'venus'].includes(id)) return 64; // semi-focused
    return 48; // standard
  }, [id, quality.tier]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Orbital movement
    if (groupRef.current && orbitRadius > 0) {
      if (introActive && id === 'saturn') {
        const saturnAngle = Math.PI * 0.28;
        groupRef.current.position.x = Math.cos(saturnAngle) * orbitRadius;
        groupRef.current.position.z = Math.sin(saturnAngle) * orbitRadius;
      } else {
        const angle = t * orbitSpeed;
        groupRef.current.position.x = Math.cos(angle) * orbitRadius;
        groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      }
    }

    // Self-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * rotationSpeed;
    }

    // Smooth material transition on texture load
    if (matRef.current) {
      if (textures) {
        if (transitionProgress.current < 1) {
          transitionProgress.current = Math.min(1, transitionProgress.current + delta * 1.5);
          const fallbackColor = new THREE.Color(config.color || fallback.color);
          const targetColor = new THREE.Color('#ffffff');
          matRef.current.color.copy(fallbackColor).lerp(targetColor, transitionProgress.current);
        }
      } else {
        matRef.current.color.set(config.color || fallback.color);
      }
    }
  });

  const showAtmosphere = quality.atmosphereEnabled && config.atmosphereColor;
  const showRings = quality.ringsEnabled && config.rings;
  const showMoons = quality.moonsEnabled && config.moons && config.moons.length > 0;

  // Check for developer debugging parameter ?debug=planets
  const isDebug = useMemo(() => {
    return typeof window !== 'undefined' && window.location.search.includes('debug=planets');
  }, []);

  return (
    <group ref={groupRef}>
      {/* Floating Developer Debug Overlay */}
      {isDebug && (
        <Html distanceFactor={15}>
          <div style={{
            background: 'rgba(5, 7, 13, 0.95)',
            color: '#38bdf8',
            padding: '8px 12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '9px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            pointerEvents: 'none',
            lineHeight: '1.4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transform: 'translate(-50%, -120%)'
          }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px', paddingBottom: '2px' }}>
              {config.name} ({id})
            </div>
            <div>PBR Material: {textures ? '✓ Active' : 'Fallback'}</div>
            <div>Color Map: {textures?.color ? '✓ Loaded' : '✗ None'}</div>
            <div>Bump Map: {textures?.bump ? '✓ Loaded' : '✗ None'}</div>
            <div>Roughness: {config.roughness || fallback.roughness}</div>
            <div>Metalness: 0.0</div>
            <div>Orbit Radius: {orbitRadius.toFixed(1)}</div>
            <div>Shadows: {quality.tier === 'desktop' ? 'ON' : 'OFF'}</div>
          </div>
        </Html>
      )}

      {/* Axial tilt */}
      <group rotation={[tilt, 0, 0]}>
        {/* Planet body */}
        <mesh 
          ref={meshRef}
          castShadow={quality.tier === 'desktop'}
          receiveShadow={quality.tier === 'desktop'}
        >
          <sphereGeometry args={[scale, segments, segments]} />
          <meshStandardMaterial
            ref={matRef}
            map={textures?.color || null}
            bumpMap={textures?.bump || null}
            bumpScale={0.015}
            color={config.color || fallback.color}
            roughness={config.roughness || fallback.roughness}
            metalness={0.0}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Cloud layer (Earth) */}
        {config.hasClouds && (
          <CloudLayer 
            radius={scale} 
            speed={config.cloudsSpeed || 0.04} 
            texture={textures?.clouds || null}
          />
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
            textures={textures}
            quality={quality}
          />
        )}

        {/* Moons */}
        {showMoons && (
          <MoonSystem
            moons={config.moons}
            parentScale={scale * 2.5}
            sunPosition={sunPosition}
            quality={quality}
          />
        )}
      </group>
    </group>
  );
};

export default Planet;
