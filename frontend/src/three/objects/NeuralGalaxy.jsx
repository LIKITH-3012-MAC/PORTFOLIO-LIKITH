import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GALAXY_NODES = [
  // Section 1: Academic / About
  new THREE.Vector3(-4.0, 2.0, -1.0),
  new THREE.Vector3(-2.5, 3.2, -1.5),
  new THREE.Vector3(-1.0, 2.2, -1.2),

  // Section 2: Experience / Timeline
  new THREE.Vector3(-3.0, -1.5, -2.0),
  new THREE.Vector3(0.0, -2.2, -1.5),
  new THREE.Vector3(3.0, -1.5, -2.0),

  // Section 3: Projects (Floating Panels)
  new THREE.Vector3(-2.8, 1.2, 0.5),
  new THREE.Vector3(2.8, 1.2, -0.5),
  new THREE.Vector3(-2.8, -1.2, -0.5),
  new THREE.Vector3(2.8, -1.2, 0.5),

  // Section 4: Skills Constellation
  new THREE.Vector3(-2.2, 1.8, 0.4),
  new THREE.Vector3(2.2, 1.8, -0.4),
  new THREE.Vector3(-2.2, -1.8, -0.4),
  new THREE.Vector3(2.2, -1.8, 0.4)
];

const GALAXY_LINES = [
  // Academic connections (0-2)
  [0, 1], [1, 2], [2, 0],
  // Timeline connections (3-4)
  [3, 4], [4, 5],
  // Project connections (5-8)
  [6, 7], [7, 9], [9, 8], [8, 6],
  // Skills connections (9-13)
  [10, 11], [11, 13], [13, 12], [12, 10], [10, 13]
];

// Map line index to section visibility
const getLineSection = (lineIdx) => {
  if (lineIdx <= 2) return 1; // About
  if (lineIdx <= 4) return 2; // Experience
  if (lineIdx <= 8) return 3; // Projects
  return 4; // Skills
};

const GalaxyLineShader = {
  uniforms: {
    uColor: { value: new THREE.Color('#3b82f6') }
  },
  vertexShader: `
    attribute float aOpacity;
    varying float vOpacity;
    void main() {
      vOpacity = aOpacity;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vOpacity;
    void main() {
      gl_FragColor = vec4(uColor, vOpacity);
    }
  `
};

export const NeuralGalaxy = ({ quality, prefersReduced }) => {
  const lineGeomRef = useRef(null);
  const pulseGeomRef = useRef(null);
  const lineShaderRef = useRef(null);

  // Initialize line positions
  const lineVertices = useMemo(() => {
    const vertices = new Float32Array(GALAXY_LINES.length * 2 * 3);
    GALAXY_LINES.forEach(([startIdx, endIdx], idx) => {
      const start = GALAXY_NODES[startIdx];
      const end = GALAXY_NODES[endIdx];
      
      vertices[idx * 6] = start.x;
      vertices[idx * 6 + 1] = start.y;
      vertices[idx * 6 + 2] = start.z;
      
      vertices[idx * 6 + 3] = end.x;
      vertices[idx * 6 + 4] = end.y;
      vertices[idx * 6 + 5] = end.z;
    });
    return vertices;
  }, []);

  // Track opacities state for smooth interpolation
  const lineOpacities = useRef(new Float32Array(GALAXY_LINES.length * 2));

  // Initialize moving pulses
  const pulseData = useRef([
    { lineIdx: 0, progress: 0.0, speed: 0.6 },
    { lineIdx: 3, progress: 0.3, speed: 0.8 },
    { lineIdx: 6, progress: 0.5, speed: 0.5 },
    { lineIdx: 9, progress: 0.1, speed: 0.75 },
    { lineIdx: 12, progress: 0.7, speed: 0.9 }
  ]);

  useFrame((state, delta) => {
    if (quality.tier === 'low') return;

    const dt = Math.min(delta, 0.1);
    
    // Read global scroll values
    const sectionIdx = state.scene.userData.sectionIdx || 0;
    const progress = state.scene.userData.progress || 0;

    // 1. Update line opacities dynamically based on active section
    const currentOpacities = lineOpacities.current;
    GALAXY_LINES.forEach((_, idx) => {
      const lineSec = getLineSection(idx);
      
      // Determine target opacity
      let target = 0.04; // Very faint ambient glow
      if (sectionIdx === lineSec) {
        target = THREE.MathUtils.lerp(0.04, 0.85, 1.0 - progress * 0.4);
      } else if (sectionIdx + 1 === lineSec) {
        target = THREE.MathUtils.lerp(0.04, 0.85, progress);
      }

      // Smooth interpolation
      currentOpacities[idx * 2] = THREE.MathUtils.lerp(currentOpacities[idx * 2], target, 0.06);
      currentOpacities[idx * 2 + 1] = THREE.MathUtils.lerp(currentOpacities[idx * 2 + 1], target, 0.06);
    });

    if (lineGeomRef.current) {
      lineGeomRef.current.setAttribute('aOpacity', new THREE.BufferAttribute(currentOpacities, 1));
    }

    // 2. Update and drift signal pulses
    const pulsePositions = new Float32Array(pulseData.current.length * 3);
    const pulseAlphas = new Float32Array(pulseData.current.length);

    pulseData.current.forEach((pulse, idx) => {
      pulse.progress += pulse.speed * dt;
      
      if (pulse.progress >= 1.0) {
        pulse.progress = 0.0;
        // Select a new random line matching current or adjacent section
        const candidates = GALAXY_LINES.map((_, i) => i).filter((i) => {
          const sec = getLineSection(i);
          return Math.abs(sec - sectionIdx) <= 1;
        });
        if (candidates.length > 0) {
          pulse.lineIdx = candidates[Math.floor(Math.random() * candidates.length)];
        }
      }

      const line = GALAXY_LINES[pulse.lineIdx];
      const start = GALAXY_NODES[line[0]];
      const end = GALAXY_NODES[line[1]];

      // Linear interpolation along connected nodes
      const currentPos = new THREE.Vector3().lerpVectors(start, end, pulse.progress);
      pulsePositions[idx * 3] = currentPos.x;
      pulsePositions[idx * 3 + 1] = currentPos.y;
      pulsePositions[idx * 3 + 2] = currentPos.z;

      // Pulse alpha matches active line opacity
      const lineOpacity = currentOpacities[pulse.lineIdx * 2];
      pulseAlphas[idx] = lineOpacity > 0.08 ? lineOpacity * 1.5 : 0.0;
    });

    if (pulseGeomRef.current) {
      pulseGeomRef.current.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
      pulseGeomRef.current.setAttribute('aAlpha', new THREE.BufferAttribute(pulseAlphas, 1));
    }
  });

  if (quality.tier === 'low') return null;

  return (
    <group>
      {/* 1. Constellation Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(GALAXY_NODES.flatMap(n => [n.x, n.y, n.z])), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#3b82f6"
          size={0.12}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Constellation Lines */}
      <lineSegments>
        <bufferGeometry ref={lineGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[lineVertices, 3]}
          />
          <bufferAttribute
            attach="attributes-aOpacity"
            args={[lineOpacities.current, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={lineShaderRef}
          vertexShader={GalaxyLineShader.vertexShader}
          fragmentShader={GalaxyLineShader.fragmentShader}
          uniforms={GalaxyLineShader.uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Signal Pulses */}
      {!prefersReduced && (
        <points>
          <bufferGeometry ref={pulseGeomRef} />
          <shaderMaterial
            vertexShader={`
              attribute float aAlpha;
              varying float vAlpha;
              void main() {
                vAlpha = aAlpha;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 0.28 * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
              }
            `}
            fragmentShader={`
              varying float vAlpha;
              void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                if (length(center) > 0.5) discard;
                float intensity = smoothstep(0.5, 0.0, length(center));
                gl_FragColor = vec4(0.98, 0.75, 0.14, intensity * vAlpha); // Pulsing gold
              }
            `}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};

export default NeuralGalaxy;
