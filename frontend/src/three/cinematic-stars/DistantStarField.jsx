import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DistantShader = {
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

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      // Twinkle calculation
      vOpacity = 0.55 + 0.45 * sin(activeTime * aTwinkleSpeed + aTwinklePhase);
      
      vec3 pos = position;

      // Wrap coordinates around camera position
      vec3 center = uCameraPosition * (1.0 - aParallaxFactor);
      pos = pos - center;
      pos = mod(pos + uBoxSize * 0.5, uBoxSize) - uBoxSize * 0.5;
      pos = pos + center;

      // YouTube stretch
      if (uRouteFactors.x > 0.0) {
        pos.z -= sin(pos.x * 0.4 + activeTime * 6.0) * uRouteFactors.x * 8.0;
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
      gl_PointSize = clamp(0.09 * (350.0 / -mvPosition.z), 0.8, 4.0);
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
      float intensity = smoothstep(0.5, 0.15, length(center));
      gl_FragColor = vec4(vColor, intensity * vOpacity * uMaxOpacity);
    }
  `
};

export const DistantStarField = ({ quality, uniforms }) => {
  const materialRef = useRef();
  const count = quality.distantStars || 1800;

  const starData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const twinkleSpeeds = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    const parallaxFactors = new Float32Array(count);

    const starColors = [
      new THREE.Color('#cce4ff'), // cool
      new THREE.Color('#ffffff'), // neutral
      new THREE.Color('#f8f9fa'), // off-white
      new THREE.Color('#fff4e8')  // warm
    ];

    const boxX = 60.0;
    const boxY = 40.0;
    const boxZ = 20.0;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * boxX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boxY;
      positions[i * 3 + 2] = -35 + Math.random() * boxZ;

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      twinkleSpeeds[i] = 0.5 + Math.random() * 1.5;
      twinklePhases[i] = Math.random() * Math.PI * 2;
      parallaxFactors[i] = 0.012;
    }

    return { positions, colors, twinkleSpeeds, twinklePhases, parallaxFactors };
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
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[starData.twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[starData.twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aParallaxFactor" args={[starData.parallaxFactors, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={DistantShader.vertexShader}
        fragmentShader={DistantShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uRouteFactors: { value: new THREE.Vector4() },
          uMaxOpacity: { value: 0.90 },
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

export default DistantStarField;
