import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/hologram.vert.glsl?raw';
import fragmentShader from '../shaders/hologram.frag.glsl?raw';

const HologramShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#3b82f6'),
    uSpeed: 1.5,
    uScanlines: 40.0,
    uGlow: 1.2,
  },
  vertexShader,
  fragmentShader
);

// Extend so it is usable in JSX as <hologramShaderMaterial />
extend({ HologramShaderMaterial });

export default HologramShaderMaterial;
