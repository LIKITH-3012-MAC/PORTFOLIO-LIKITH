import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HazeShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uMaxOpacity;
    uniform float uPrefersReduced;
    varying vec2 vUv;

    // Pseudo-random noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // 2D Value Noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    // Fractal Brownian Motion (FBM)
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv - vec2(0.5);
      
      // Let diagonal line be defined by a normal vector (creating a diagonal band)
      vec2 n = normalize(vec2(1.0, 0.58));
      float dist = dot(uv, n);

      // Create a smooth diagonal falloff
      float band = exp(-dist * dist * 9.0);

      // Add noise details to represent interstellar dust lanes
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      vec2 noiseUv = uv * 3.5 + vec2(activeTime * 0.005, -activeTime * 0.003);
      float nValue = fbm(noiseUv);

      // Create empty gaps/lanes in the band (absorption)
      float dustLane = smoothstep(0.1, 0.9, fbm(uv * 6.5 - vec2(activeTime * 0.008)));
      float intensity = band * (0.35 + 0.65 * nValue) * (1.0 - dustLane * 0.5);

      // Premium slate-blue, deep violet, and warm amber color palette
      vec3 colorViolet = vec3(0.06, 0.015, 0.12);
      vec3 colorBlue = vec3(0.01, 0.04, 0.10);
      vec3 colorAmber = vec3(0.15, 0.08, 0.02);

      vec3 finalColor = mix(colorBlue, colorViolet, uv.x + 0.5);
      finalColor = mix(finalColor, colorAmber, nValue * 0.35);

      gl_FragColor = vec4(finalColor, intensity * uMaxOpacity * 0.45);
    }
  `
};

const BandStarsShader = {
  vertexShader: `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform vec4 uRouteFactors;
    uniform float uPrefersReduced;
    uniform vec3 uBoxSize;

    attribute float aTwinkleSpeed;
    attribute float aTwinklePhase;
    attribute float aParallaxFactor;
    attribute vec3 aColor;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      vOpacity = 0.5 + 0.5 * sin(activeTime * aTwinkleSpeed + aTwinklePhase);
      
      vec3 pos = position;

      // Wrap coordinates around camera position
      vec3 center = uCameraPosition * (1.0 - aParallaxFactor);
      pos = pos - center;
      pos = mod(pos + uBoxSize * 0.5, uBoxSize) - uBoxSize * 0.5;
      pos = pos + center;

      // Route-aware transitions
      if (uRouteFactors.x > 0.0) {
        pos.z -= sin(pos.x * 0.4 + activeTime * 6.0) * uRouteFactors.x * 8.0;
      }
      if (uRouteFactors.y > 0.0) {
        pos.z = mix(pos.z, -12.0, uRouteFactors.y);
      }
      if (uRouteFactors.z > 0.0) {
        pos.x = mix(pos.x, floor(pos.x / 3.0) * 3.0, uRouteFactors.z);
        pos.y = mix(pos.y, floor(pos.y / 2.0) * 2.0, uRouteFactors.z);
      }
      if (uRouteFactors.w > 0.0) {
        pos.y = mix(pos.y, floor(pos.y / 1.5) * 1.5, uRouteFactors.w);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = clamp(0.12 * (350.0 / -mvPosition.z), 0.7, 3.2);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vOpacity;
    uniform float uMaxOpacity;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      if (length(center) > 0.5) discard;
      float intensity = smoothstep(0.5, 0.15, length(center));
      gl_FragColor = vec4(vColor, intensity * vOpacity * uMaxOpacity * 0.85);
    }
  `
};

export const GalacticBand = ({ quality, uniforms }) => {
  const hazeMaterialRef = useRef();
  const starsMaterialRef = useRef();

  // Scale point count based on graphics quality
  const count = useMemo(() => {
    if (quality.tier === 'low') return 300;
    if (quality.tier === 'mobile') return 600;
    if (quality.tier === 'desktop') return 1200;
    return 1800; // ultra
  }, [quality.tier]);

  const starData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const twinkleSpeeds = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    const parallaxFactors = new Float32Array(count);

    // Warm yellowish, white, and icy blue tones for galactic core stars
    const bandColors = [
      new THREE.Color('#ffe9d4'), // warm cream
      new THREE.Color('#ffffff'), // white
      new THREE.Color('#eef5ff'), // ice white
      new THREE.Color('#ffdfb5'), // orange-amber
    ];

    const boxX = 60.0;
    const boxY = 40.0;
    const boxZ = 20.0;

    // Angle of diagonal band (slope = 0.58, approx 30 degrees)
    const slope = 0.58;

    for (let i = 0; i < count; i++) {
      // Generate x coordinates across the box
      const x = (Math.random() - 0.5) * boxX;
      
      // Cluster y coordinates close to y = x * slope
      // Using standard distribution approximation to concentrate around center line
      const scatter = (Math.random() + Math.random() + Math.random() - 1.5) * 5.0; // concentrated Gaussian scatter
      const y = x * slope + scatter;

      // Restrict to box height bounds
      positions[i * 3] = x;
      positions[i * 3 + 1] = THREE.MathUtils.clamp(y, -boxY * 0.5, boxY * 0.5);
      positions[i * 3 + 2] = -32 + Math.random() * boxZ;

      const color = bandColors[Math.floor(Math.random() * bandColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      twinkleSpeeds[i] = 0.4 + Math.random() * 1.2;
      twinklePhases[i] = Math.random() * Math.PI * 2;
      parallaxFactors[i] = 0.012; // deep distance
    }

    return { positions, colors, twinkleSpeeds, twinklePhases, parallaxFactors };
  }, [count]);

  useFrame(() => {
    if (hazeMaterialRef.current && uniforms) {
      hazeMaterialRef.current.uniforms.uTime.value = uniforms.uTime.value;
      hazeMaterialRef.current.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
    }
    if (starsMaterialRef.current && uniforms) {
      const mat = starsMaterialRef.current;
      mat.uniforms.uTime.value = uniforms.uTime.value;
      mat.uniforms.uCameraPosition.value.copy(uniforms.uCameraPosition.value);
      mat.uniforms.uRouteFactors.value.copy(uniforms.uRouteFactors.value);
      mat.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
      mat.uniforms.uBoxSize.value.copy(uniforms.uBoxSize.value);
    }
  });

  return (
    <group>
      {/* 1. Diagonal Dust Lane Glow Plane */}
      {quality.tier !== 'low' && (
        <mesh position={[0, 0, -38]}>
          <planeGeometry args={[130, 80]} />
          <shaderMaterial
            ref={hazeMaterialRef}
            vertexShader={HazeShader.vertexShader}
            fragmentShader={HazeShader.fragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uMaxOpacity: { value: 0.90 },
              uPrefersReduced: { value: 0.0 }
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 2. Concentrated Diagonal Band Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starData.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[starData.colors, 3]} />
          <bufferAttribute attach="attributes-aTwinkleSpeed" args={[starData.twinkleSpeeds, 1]} />
          <bufferAttribute attach="attributes-aTwinklePhase" args={[starData.twinklePhases, 1]} />
          <bufferAttribute attach="attributes-aParallaxFactor" args={[starData.parallaxFactors, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={starsMaterialRef}
          vertexShader={BandStarsShader.vertexShader}
          fragmentShader={BandStarsShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uCameraPosition: { value: new THREE.Vector3() },
            uRouteFactors: { value: new THREE.Vector4() },
            uMaxOpacity: { value: 0.90 },
            uPrefersReduced: { value: 0.0 },
            uBoxSize: { value: new THREE.Vector3(60, 40, 40) }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default GalacticBand;
