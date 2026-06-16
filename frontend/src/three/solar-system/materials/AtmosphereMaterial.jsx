import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const AtmosphereMaterial = shaderMaterial(
  {
    uAtmosphereColor: new THREE.Color('#60a5fa'),
    uSunPosition: new THREE.Vector3(0, 0, 0), // Sun position in world space
    uGlowPower: 5.0,
    uGlowCoefficient: 0.1
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      // Calculate world position
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uAtmosphereColor;
    uniform vec3 uSunPosition;
    uniform float uGlowPower;
    uniform float uGlowCoefficient;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      
      // Calculate light direction from Sun to this fragment
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);

      // Fresnel rim factor: brighter towards edges
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uGlowPower) * uGlowCoefficient;

      // Light factor: brighter on the sun-facing side, fades around terminator line
      // Using smoothstep to soften the day-night scattering boundary
      float dotNL = dot(normal, lightDir);
      float lightScatter = smoothstep(-0.4, 0.4, dotNL);

      // Combine Fresnel rim with light scattering
      float intensity = fresnel * lightScatter;

      // Soft edge transparency fade
      if (intensity < 0.001) discard;

      gl_FragColor = vec4(uAtmosphereColor, intensity);
    }
  `
);

extend({ AtmosphereMaterial });
