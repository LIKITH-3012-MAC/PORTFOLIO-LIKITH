import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FocalShader = {
  vertexShader: `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform vec4 uRouteFactors;
    uniform float uPrefersReduced;
    uniform vec3 uBoxSize;
    uniform vec3 uCometPosition;
    uniform float uCometRadius;

    attribute float aTwinkleSpeed;
    attribute float aTwinklePhase;
    attribute float aParallaxFactor;
    attribute vec3 aColor;
    attribute float aScale;

    varying vec3 vColor;
    varying float vOpacity;
    varying float vCometGlow;

    void main() {
      vColor = aColor;
      
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      // Twinkle calculation
      vOpacity = 0.80 + 0.20 * sin(activeTime * aTwinkleSpeed + aTwinklePhase);
      
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

      // Grid
      if (uRouteFactors.z > 0.0) {
        pos.x = mix(pos.x, floor(pos.x / 3.0) * 3.0, uRouteFactors.z);
        pos.y = mix(pos.y, floor(pos.y / 2.0) * 2.0, uRouteFactors.z);
      }

      // Code lines
      if (uRouteFactors.w > 0.0) {
        pos.y = mix(pos.y, floor(pos.y / 1.5) * 1.5, uRouteFactors.w);
      }

      // Calculate proximity to active comet
      float distToComet = distance(pos, uCometPosition);
      float cometGlow = 0.0;
      if (distToComet < uCometRadius) {
        cometGlow = 1.0 - (distToComet / uCometRadius);
        cometGlow = pow(cometGlow, 2.0) * 0.5; // up to 50% glow boost
      }
      vCometGlow = cometGlow;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Render size (focal stars are large, showing beautiful flares)
      gl_PointSize = clamp(aScale * (400.0 / -mvPosition.z), 16.0, 64.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vOpacity;
    varying float vCometGlow;
    uniform float uMaxOpacity;

    void main() {
      // Center coordinates around (0.0, 0.0), from -0.5 to 0.5
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      // 1. Core and Halo
      float core = smoothstep(0.08, 0.0, dist) * 1.5;
      float halo = smoothstep(0.4, 0.0, dist) * 0.3;

      // 2. Horizontal/Vertical Spikes (diffraction)
      float hSpike = smoothstep(0.015, 0.0, abs(center.y)) * smoothstep(0.5, 0.0, abs(center.x)) * 0.95;
      float vSpike = smoothstep(0.015, 0.0, abs(center.x)) * smoothstep(0.5, 0.0, abs(center.y)) * 0.95;

      // 3. Diagonal Spikes (diffraction rotated 45 degrees)
      vec2 rot = vec2(center.x * 0.7071 - center.y * 0.7071, center.x * 0.7071 + center.y * 0.7071);
      float d1Spike = smoothstep(0.012, 0.0, abs(rot.y)) * smoothstep(0.35, 0.0, abs(rot.x)) * 0.5;
      float d2Spike = smoothstep(0.012, 0.0, abs(rot.x)) * smoothstep(0.35, 0.0, abs(rot.y)) * 0.5;

      float baseIntensity = core + halo + hSpike + vSpike + d1Spike + d2Spike;
      float totalOpacity = baseIntensity * (vOpacity + vCometGlow) * uMaxOpacity;

      gl_FragColor = vec4(vColor, clamp(totalOpacity, 0.0, 1.0));
    }
  `
};

export const FocalStars = ({ quality, uniforms }) => {
  const materialRef = useRef();
  const count = quality.focalStars || 12;

  const starData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const twinkleSpeeds = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    const parallaxFactors = new Float32Array(count);

    // Warm golden/amber and brilliant blue/white tones for cinematic realism
    const focalColors = [
      new THREE.Color('#ffe2b3'), // warm gold
      new THREE.Color('#e0f0ff'), // icy blue
      new THREE.Color('#ffffff'), // pure white
      new THREE.Color('#ffd199')  // rich amber
    ];

    const boxX = 50.0;
    const boxY = 30.0;
    const boxZ = 15.0;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * boxX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boxY;
      positions[i * 3 + 2] = -15 + Math.random() * boxZ;

      const color = focalColors[Math.floor(Math.random() * focalColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = 1.0 + Math.random() * 0.8;
      twinkleSpeeds[i] = 0.2 + Math.random() * 0.5; // slow twinkling for premium feel
      twinklePhases[i] = Math.random() * Math.PI * 2;
      parallaxFactors[i] = 0.06; // slight parallax
    }

    return { positions, colors, scales, twinkleSpeeds, twinklePhases, parallaxFactors };
  }, [count]);

  useFrame(() => {
    if (materialRef.current && uniforms) {
      const mat = materialRef.current;
      mat.uniforms.uTime.value = uniforms.uTime.value;
      mat.uniforms.uCameraPosition.value.copy(uniforms.uCameraPosition.value);
      mat.uniforms.uRouteFactors.value.copy(uniforms.uRouteFactors.value);
      mat.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
      mat.uniforms.uBoxSize.value.copy(uniforms.uBoxSize.value);
      mat.uniforms.uCometPosition.value.copy(uniforms.uCometPosition.value);
      mat.uniforms.uCometRadius.value = uniforms.uCometRadius.value;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starData.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[starData.colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[starData.scales, 1]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[starData.twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[starData.twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aParallaxFactor" args={[starData.parallaxFactors, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={FocalShader.vertexShader}
        fragmentShader={FocalShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uRouteFactors: { value: new THREE.Vector4() },
          uMaxOpacity: { value: 0.95 },
          uPrefersReduced: { value: 0.0 },
          uBoxSize: { value: new THREE.Vector3(60, 40, 40) },
          uCometPosition: { value: new THREE.Vector3(-999, -999, -999) },
          uCometRadius: { value: 6.0 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default FocalStars;
