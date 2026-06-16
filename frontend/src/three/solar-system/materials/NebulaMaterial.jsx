import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#1a1a40'),
    uColor2: new THREE.Color('#3d1c56'),
    uOpacity: 0.12,
    uScrollProgress: 0
  },
  // Vertex Shader
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader - Fractional Brownian Motion nebula clouds
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;
    uniform float uScrollProgress;
    varying vec2 vUv;

    // Hash and noise functions for FBM
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        val += amp * noise(p * freq);
        freq *= 2.1;
        amp *= 0.48;
      }
      return val;
    }

    void main() {
      vec2 uv = vUv;

      // Slow drift movement
      float t = uTime * 0.04;
      float n1 = fbm(uv * 2.8 + vec2(t, t * 0.7));
      float n2 = fbm(uv * 4.2 - vec2(t * 0.5, t * 1.1));

      float combined = n1 * 0.65 + n2 * 0.35;

      // Radial distance fade from center
      float dist = length(uv - 0.5) * 2.0;
      float radialFade = smoothstep(1.2, 0.3, dist);

      vec3 color = mix(uColor1, uColor2, combined);

      // Subtle brand-inspired amber accent
      color += vec3(0.95, 0.75, 0.15) * pow(combined, 3.5) * 0.12;

      float alpha = combined * radialFade * uOpacity;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ NebulaMaterial });
