import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const RingMaterial = shaderMaterial(
  {
    uRingColor: new THREE.Color('#c2a679'),
    uOpacity: 0.65,
    uInnerRadius: 1.25,
    uOuterRadius: 2.8,
    uSunPosition: new THREE.Vector3(0, 0, 0),
    uTime: 0
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uRingColor;
    uniform float uOpacity;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    uniform vec3 uSunPosition;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    // Simple hash for procedural ring bands
    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      // Calculate distance from ring center (using UV space: 0.5,0.5 is center)
      vec2 centeredUv = vUv - 0.5;
      float dist = length(centeredUv) * 2.0; // normalize to [0, 1]

      // Map UV distance to ring radius
      float ringPos = mix(uInnerRadius, uOuterRadius, dist);

      // Discard pixels outside the ring bounds
      if (dist < 0.01 || dist > 0.99) discard;

      // Generate procedural ring band pattern
      float bandNoise = hash(floor(ringPos * 25.0)) * 0.4 + 0.6;

      // Cassini division gap (a dark gap at ~60% of ring width)
      float gapCenter = 0.58;
      float gapWidth = 0.03;
      float gap = smoothstep(gapCenter - gapWidth, gapCenter, dist)
                - smoothstep(gapCenter, gapCenter + gapWidth, dist);
      bandNoise *= (1.0 - gap * 0.8);

      // Additional thin gaps
      float gap2 = smoothstep(0.30, 0.32, dist) - smoothstep(0.32, 0.34, dist);
      float gap3 = smoothstep(0.78, 0.80, dist) - smoothstep(0.80, 0.82, dist);
      bandNoise *= (1.0 - gap2 * 0.5) * (1.0 - gap3 * 0.4);

      // Directional lighting from sun
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);
      float dotNL = dot(normalize(vNormal), lightDir);
      float lightFactor = smoothstep(-0.2, 0.6, dotNL) * 0.6 + 0.4;

      // Edge fade for smooth ring borders
      float edgeFade = smoothstep(0.0, 0.08, dist) * smoothstep(1.0, 0.92, dist);

      vec3 color = uRingColor * bandNoise * lightFactor;
      float alpha = uOpacity * edgeFade * bandNoise;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ RingMaterial });
