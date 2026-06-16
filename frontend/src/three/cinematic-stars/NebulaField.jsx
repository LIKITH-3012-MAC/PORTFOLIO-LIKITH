import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NebulaShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform vec2 uNoiseOffset;
    uniform float uSpeed;
    uniform float uPrefersReduced;
    varying vec2 vUv;

    // Hash and value noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.2;
        amplitude *= 0.48;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      
      // Soft radial circular mask to fade edges
      float distFromCenter = length(uv - vec2(0.5));
      float mask = smoothstep(0.5, 0.0, distFromCenter);
      
      if (mask <= 0.0) discard;

      // Noise coordinates animation
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      vec2 noiseCoord = uv * 2.2 + uNoiseOffset + vec2(activeTime * uSpeed, activeTime * uSpeed * 0.4);
      
      // Compute detailed noise
      float n = fbm(noiseCoord);

      // Contrast and shape adjustment
      float alpha = pow(n * mask, 1.3) * uOpacity;

      // Color mapping with highlights
      vec3 finalColor = uColor;
      
      // Add a soft high-register glow highlight inside dense regions
      float highlight = smoothstep(0.55, 0.9, n);
      vec3 goldGlow = vec3(0.9, 0.72, 0.45); // Warm gold highlights
      finalColor = mix(finalColor, goldGlow, highlight * 0.4);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

const SingleNebulaCloud = ({ config, globalTime, prefersReduced }) => {
  const materialRef = useRef();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = globalTime.value;
      materialRef.current.uniforms.uPrefersReduced.value = prefersReduced ? 1.0 : 0.0;
    }
  });

  return (
    <mesh position={config.position}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={NebulaShader.vertexShader}
        fragmentShader={NebulaShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: config.color },
          uOpacity: { value: config.opacity },
          uNoiseOffset: { value: new THREE.Vector2(...config.noiseOffset) },
          uSpeed: { value: config.speed },
          uPrefersReduced: { value: 0.0 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const NebulaField = ({ quality, uniforms, prefersReduced }) => {
  const globalTime = uniforms ? uniforms.uTime : { value: 0 };

  const clouds = useMemo(() => {
    const isMedium = quality.nebulaQuality === 'medium';
    
    const allClouds = [
      {
        position: [-14, 5, -28],
        scale: [42, 28, 1],
        color: new THREE.Color('#2e1c4f'), // Slate purple
        noiseOffset: [0.15, 0.28],
        opacity: 0.40,
        speed: 0.007,
      },
      {
        position: [12, -4, -26],
        scale: [46, 32, 1],
        color: new THREE.Color('#142a4a'), // Icy space blue
        noiseOffset: [-0.35, 0.42],
        opacity: 0.45,
        speed: -0.005,
      },
      {
        position: [-2, -8, -30],
        scale: [50, 32, 1],
        color: new THREE.Color('#401828'), // Warm magenta haze
        noiseOffset: [0.65, -0.15],
        opacity: 0.32,
        speed: 0.004,
      },
      {
        position: [5, 7, -24],
        scale: [32, 24, 1],
        color: new THREE.Color('#50381b'), // Cosmic amber gold
        noiseOffset: [-0.45, -0.35],
        opacity: 0.25,
        speed: 0.009,
      }
    ];

    // Render fewer clouds on mobile/medium to preserve fillrate performance
    return isMedium ? [allClouds[0], allClouds[1]] : allClouds;
  }, [quality.nebulaQuality]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} scale={cloud.scale}>
          <SingleNebulaCloud
            config={cloud}
            globalTime={globalTime}
            prefersReduced={prefersReduced}
          />
        </group>
      ))}
    </group>
  );
};

export default NebulaField;
