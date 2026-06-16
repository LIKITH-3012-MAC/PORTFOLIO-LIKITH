import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const CometIonTailMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#38bdf8'), // light blue ion color
    uOpacity: 1.0
  },
  // Vertex Shader
  `
    attribute float aSize;
    attribute float aOpacity;
    varying float vOpacity;

    void main() {
      vOpacity = aOpacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vOpacity;

    void main() {
      // Create soft circular glowing point
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      float intensity = smoothstep(0.5, 0.0, dist);
      gl_FragColor = vec4(uColor, intensity * vOpacity * uOpacity);
    }
  `
);

extend({ CometIonTailMaterial });
