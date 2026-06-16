import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NebulaShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0.35 },
    uColor1: { value: new THREE.Color('#fbbf24') }, // Amber brand accent
    uColor2: { value: new THREE.Color('#0b1a30') }, // Deep space navy
    uBgColor: { value: new THREE.Color('#030712') } // Root dark bg
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uBgColor;
    varying vec2 vUv;

    // Fast pseudo-random hash
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // 2D Value Noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    // Fractional Brownian Motion
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      
      // Center coordinates
      vec2 p = uv - 0.5;
      
      // Domain warping for fluid smoke feel
      vec2 q = vec2(fbm(p * 2.2 + vec2(uTime * 0.005, uTime * 0.003)),
                    fbm(p * 2.0 + vec2(uTime * -0.002, uTime * 0.006)));
                    
      vec2 r = vec2(fbm(p * 1.8 + q * 1.5 + vec2(uTime * 0.008)),
                    fbm(p * 1.8 + q * 1.2 + vec2(uTime * -0.005)));
                    
      float f = fbm(p * 1.5 + r * 1.8);
      
      // Shape gas clouds
      float nebulaMask = smoothstep(0.1, 0.9, f);
      
      // Interpolate colors based on fbm values
      vec3 finalGas = mix(uBgColor, uColor2, nebulaMask);
      finalGas = mix(finalGas, uColor1, smoothstep(0.4, 0.95, f * (1.0 + q.x * 0.4)));
      
      // Vignette to fade gas toward the edges
      float vignette = smoothstep(0.9, 0.2, length(p * 1.4));
      
      vec3 finalColor = mix(uBgColor, finalGas, vignette * uIntensity);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export const NebulaField = ({ quality, scrollProgress = 0 }) => {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Increment time uniform
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Smoothly update intensity based on active scroll section index/progress
    // Adjust overall opacity depending on screen index
    const targetIntensity = quality.tier === 'low' ? 0.0 : (quality.tier === 'mobile' ? 0.15 : 0.35);
    
    // We can also dynamic-shift uIntensity slightly to give a pulse effect
    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uIntensity.value,
      targetIntensity,
      0.05
    );
  });

  if (quality.tier === 'low') return null;

  return (
    <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={NebulaShader.vertexShader}
        fragmentShader={NebulaShader.fragmentShader}
        uniforms={NebulaShader.uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default NebulaField;
