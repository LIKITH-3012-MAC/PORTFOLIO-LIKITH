import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MidShader = {
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
    attribute float aSize;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      // Twinkle calculation
      vOpacity = 0.70 + 0.30 * sin(activeTime * aTwinkleSpeed + aTwinklePhase);
      
      vec3 pos = position;

      // Wrap coordinates around camera position
      vec3 center = uCameraPosition * (1.0 - aParallaxFactor);
      pos = pos - center;
      pos = mod(pos + uBoxSize * 0.5, uBoxSize) - uBoxSize * 0.5;
      pos = pos + center;

      // YouTube stretch
      if (uRouteFactors.x > 0.0) {
        pos.z -= sin(pos.x * 0.4 + activeTime * 6.0) * uRouteFactors.x * 10.0;
      }
      
      // Collab flatten
      if (uRouteFactors.y > 0.0) {
        pos.z = mix(pos.z, -12.0, uRouteFactors.y);
      }

      // Git/Data Grid
      if (uRouteFactors.z > 0.0) {
        pos.x = mix(pos.x, floor(pos.x / 3.0) * 3.0, uRouteFactors.z);
        pos.y = mix(pos.y, floor(pos.y / 2.0) * 2.0, uRouteFactors.z);
      }

      // Problem Horizontal Lines
      if (uRouteFactors.w > 0.0) {
        pos.y = mix(pos.y, floor(pos.y / 1.5) * 1.5, uRouteFactors.w);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      float starSize = aSize;
      if (uRouteFactors.x > 0.0) {
        starSize *= (1.0 + uRouteFactors.x * 2.0);
      }

      gl_PointSize = clamp(starSize * (350.0 / -mvPosition.z), 1.0, 10.0);
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
      float intensity = smoothstep(0.5, 0.0, length(center));
      gl_FragColor = vec4(vColor, intensity * vOpacity * uMaxOpacity);
    }
  `
};

export const MidStarField = ({ quality, uniforms }) => {
  const materialRef = useRef();
  const count = quality.midStars || 420;

  const starData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkleSpeeds = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    const parallaxFactors = new Float32Array(count);

    const starColors = [
      new THREE.Color('#cce4ff'), // cool blue
      new THREE.Color('#eaf4ff'), // pale blue
      new THREE.Color('#ffffff'), // neutral white
      new THREE.Color('#fff4e8'), // warm white
      new THREE.Color('#fffae6'), // soft yellow
      new THREE.Color('#b0d2ff')  // pale blue
    ];

    const boxX = 60.0;
    const boxY = 40.0;
    const boxZ = 16.0;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * boxX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boxY;
      positions[i * 3 + 2] = -12 + Math.random() * boxZ;

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.14 + Math.random() * 0.14;
      twinkleSpeeds[i] = 0.6 + Math.random() * 1.8;
      twinklePhases[i] = Math.random() * Math.PI * 2;
      parallaxFactors[i] = 0.12;
    }

    return { positions, colors, sizes, twinkleSpeeds, twinklePhases, parallaxFactors };
  }, [count]);

  useFrame(() => {
    if (materialRef.current && uniforms) {
      const mat = materialRef.current;
      mat.uniforms.uTime.value = uniforms.uTime.value;
      mat.uniforms.uCameraPosition.value.copy(uniforms.uCameraPosition.value);
      mat.uniforms.uRouteFactors.value.copy(uniforms.uRouteFactors.value);
      mat.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
      mat.uniforms.uBoxSize.value.copy(uniforms.uBoxSize.value);
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starData.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[starData.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[starData.sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[starData.twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[starData.twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aParallaxFactor" args={[starData.parallaxFactors, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={MidShader.vertexShader}
        fragmentShader={MidShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uRouteFactors: { value: new THREE.Vector4() },
          uMaxOpacity: { value: 0.95 },
          uPrefersReduced: { value: 0.0 },
          uBoxSize: { value: new THREE.Vector3(60, 40, 40) }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default MidStarField;
