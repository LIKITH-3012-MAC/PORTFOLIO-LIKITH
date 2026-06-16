import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const StarShader = {
  uniforms: {
    uTime: { value: 0 },
    uMaxOpacity: { value: 1.0 },
    uStretch: { value: 0.0 },
    uFlatten: { value: 0.0 },
    uGrid: { value: 0.0 },
    uLine: { value: 0.0 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uStretch;
    uniform float uFlatten;
    uniform float uGrid;
    uniform float uLine;
    attribute float aTwinkleSpeed;
    attribute float aTwinklePhase;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      
      // Calculate twinkling factor on the GPU
      float twinkle = sin(uTime * aTwinkleSpeed + aTwinklePhase) * 0.45 + 0.55;
      vOpacity = twinkle;

      // Copy position to manipulate
      vec3 pos = position;

      // 1. YouTube Warp: Stretch stars along Z axis, speed up drift
      if (uStretch > 0.0) {
        pos.z += sin(pos.x + uTime * 4.0) * uStretch * 12.0;
      }

      // 2. Collab Flatten: Compress depth to a thin visual plane
      if (uFlatten > 0.0) {
        pos.z = mix(pos.z, -10.0, uFlatten);
      }

      // 3. Grid / Lines (Git/Data/Problem mode): Align stars to discrete points
      if (uGrid > 0.0) {
        float gridX = floor(pos.x / 4.0) * 4.0;
        float gridY = floor(pos.y / 3.0) * 3.0;
        pos.x = mix(pos.x, gridX, uGrid);
        pos.y = mix(pos.y, gridY, uGrid);
      }
      if (uLine > 0.0) {
        float lineY = floor(pos.y / 2.0) * 2.0;
        pos.y = mix(pos.y, lineY, uLine);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      float starSize = size;
      if (uStretch > 0.0) {
        starSize *= (1.0 + uStretch * 1.5);
      }
      
      gl_PointSize = starSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uMaxOpacity;
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      // Create a soft lens-like glow round star shape instead of square
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      // Smooth fade to edge
      float intensity = smoothstep(0.5, 0.0, dist);
      float alpha = intensity * vOpacity * uMaxOpacity;
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `
};

export const StarField = ({ quality, prefersReduced, routeFactors }) => {
  const distantRef = useRef(null);
  const midRef = useRef(null);
  const foreRef = useRef(null);

  // Read config settings
  const { starCount, foregroundStars, twinkleSpeedMult } = quality;

  // Distant stars count
  const distantCount = Math.round(starCount * 0.7);
  // Mid stars count
  const midCount = Math.round(starCount * 0.25);
  // Foreground stars count
  const foreCount = prefersReduced ? 0 : Math.round(foregroundStars);

  // Helper to generate star buffers
  const generateStars = (count, zMin, zMax, sizeMin, sizeMax, colorProb = 0.0) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const twinkleSpeeds = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    const sizes = new Float32Array(count);

    const colorAmber = new THREE.Color('#fbbf24');
    const colorWhite = new THREE.Color('#ffffff');
    const colorBlue = new THREE.Color('#60a5fa');

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 40;
      const z = Math.random() * (zMax - zMin) + zMin;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let color = colorWhite;
      const rand = Math.random();
      if (colorProb > 0.0) {
        if (rand < colorProb * 0.5) {
          color = colorAmber;
        } else if (rand < colorProb) {
          color = colorBlue;
        }
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      twinkleSpeeds[i] = (Math.random() * 2.0 + 0.5) * twinkleSpeedMult;
      twinklePhases[i] = Math.random() * Math.PI * 2.0;

      sizes[i] = Math.random() * (sizeMax - sizeMin) + sizeMin;
    }

    return { positions, colors, twinkleSpeeds, twinklePhases, sizes };
  };

  const distantData = useMemo(() => generateStars(distantCount, -35, -12, 0.04, 0.12, 0.1), [distantCount, twinkleSpeedMult]);
  const midData = useMemo(() => generateStars(midCount, -12, 4, 0.12, 0.28, 0.35), [midCount, twinkleSpeedMult]);
  const foreData = useMemo(() => generateStars(foreCount, 4, 12, 0.28, 0.55, 0.2), [foreCount, twinkleSpeedMult]);

  // Update time and transition factors on frame ticks
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const refs = [distantRef, midRef, foreRef];

    refs.forEach((ref) => {
      if (!ref.current) return;
      ref.current.uniforms.uTime.value = elapsed;
      if (routeFactors) {
        ref.current.uniforms.uStretch.value = routeFactors.stretch;
        ref.current.uniforms.uFlatten.value = routeFactors.flatten;
        ref.current.uniforms.uGrid.value = routeFactors.grid;
        ref.current.uniforms.uLine.value = routeFactors.line;
      }
    });
  });

  return (
    <group>
      {/* 1. Distant Star Layer */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[distantData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[distantData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-aTwinkleSpeed"
            args={[distantData.twinkleSpeeds, 1]}
          />
          <bufferAttribute
            attach="attributes-aTwinklePhase"
            args={[distantData.twinklePhases, 1]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[distantData.sizes, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={distantRef}
          vertexShader={StarShader.vertexShader}
          fragmentShader={StarShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uMaxOpacity: { value: 0.6 },
            uStretch: { value: 0 },
            uFlatten: { value: 0 },
            uGrid: { value: 0 },
            uLine: { value: 0 }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Mid-Depth Star Layer */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[midData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[midData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-aTwinkleSpeed"
            args={[midData.twinkleSpeeds, 1]}
          />
          <bufferAttribute
            attach="attributes-aTwinklePhase"
            args={[midData.twinklePhases, 1]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[midData.sizes, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={midRef}
          vertexShader={StarShader.vertexShader}
          fragmentShader={StarShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uMaxOpacity: { value: 0.95 },
            uStretch: { value: 0 },
            uFlatten: { value: 0 },
            uGrid: { value: 0 },
            uLine: { value: 0 }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Foreground Star Layer */}
      {foreCount > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[foreData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-aColor"
              args={[foreData.colors, 3]}
            />
            <bufferAttribute
              attach="attributes-aTwinkleSpeed"
              args={[foreData.twinkleSpeeds, 1]}
            />
            <bufferAttribute
              attach="attributes-aTwinklePhase"
              args={[foreData.twinklePhases, 1]}
            />
            <bufferAttribute
              attach="attributes-size"
              args={[foreData.sizes, 1]}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={foreRef}
            vertexShader={StarShader.vertexShader}
            fragmentShader={StarShader.fragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uMaxOpacity: { value: 1.0 },
              uStretch: { value: 0 },
              uFlatten: { value: 0 },
              uGrid: { value: 0 },
              uLine: { value: 0 }
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};

export default StarField;
