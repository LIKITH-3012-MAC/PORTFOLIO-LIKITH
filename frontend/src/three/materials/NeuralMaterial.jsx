import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/neural.vert.glsl?raw';
import fragmentShader from '../shaders/neural.frag.glsl?raw';

const NeuralShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#fbbf24'), // amber
    uColor2: new THREE.Color('#8b5cf6'), // violet
    uFresnelBias: 0.05,
    uFresnelScale: 1.2,
    uFresnelPower: 2.5,
    uNoiseFrequency: 0.6,
    uNoiseAmplitude: 0.18,
  },
  vertexShader,
  fragmentShader
);

// Extend so it is usable in JSX as <neuralShaderMaterial />
extend({ NeuralShaderMaterial });

export default NeuralShaderMaterial;
