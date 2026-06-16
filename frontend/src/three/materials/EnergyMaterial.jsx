import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const EnergyShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#a855f7'), // Purple/violet default
    uPulseSpeed: 2.0,
    uOpacity: 0.5,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uPulseSpeed;
    uniform float uOpacity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float pulse = sin(uTime * uPulseSpeed + vPosition.y * 2.5) * 0.5 + 0.5;
      float fresnel = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fresnel = pow(fresnel, 3.0);
      vec3 finalColor = mix(uColor, vec3(1.0), pulse * 0.35);
      gl_FragColor = vec4(finalColor, (pulse * 0.15 + fresnel * 0.85) * uOpacity);
    }
  `
);

extend({ EnergyShaderMaterial });

export default EnergyShaderMaterial;
