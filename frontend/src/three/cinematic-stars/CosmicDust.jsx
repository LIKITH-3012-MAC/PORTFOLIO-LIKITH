import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DustShader = {
  vertexShader: `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform float uPrefersReduced;
    uniform float uDustOpacityFactor;

    attribute float aSpeed;
    attribute float aPhase;
    attribute float aSize;
    attribute vec3 aColor;
    attribute vec3 aDriftDir;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      // Infinite box wrapping around the camera in a tight 24x24x24 volume
      vec3 boxSize = vec3(24.0, 24.0, 24.0);
      vec3 pos = position;
      
      // Apply slow drift motion in world coordinates
      pos += aDriftDir * activeTime * aSpeed * 0.45;
      
      // Wrap coordinates relative to camera position
      pos = pos - uCameraPosition;
      pos = mod(pos + boxSize * 0.5, boxSize) - boxSize * 0.5;
      pos = pos + uCameraPosition;

      // Pulse opacity slowly
      vOpacity = (0.35 + 0.65 * sin(activeTime * 0.4 + aPhase)) * uDustOpacityFactor;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Scale particle size dynamically with depth
      gl_PointSize = clamp(aSize * (220.0 / -mvPosition.z), 1.0, 7.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vOpacity;
    uniform float uMaxOpacity;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;
      
      // Soft dust particle blur profile
      float intensity = smoothstep(0.5, 0.05, dist);
      
      gl_FragColor = vec4(vColor, intensity * vOpacity * uMaxOpacity * 0.70);
    }
  `
};

export const CosmicDust = ({ quality, uniforms }) => {
  const materialRef = useRef();
  const count = quality.dustCount || 120;

  const dustData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const driftDirs = new Float32Array(count * 3);

    const dustColors = [
      new THREE.Color('#ffdfb5'), // Amber-gold
      new THREE.Color('#bde0ff'), // Ice-blue
      new THREE.Color('#ffffff'), // Soft white
      new THREE.Color('#ffd199')  // Warm gold
    ];

    // Generate dust positions in a 24-unit box
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24.0;

      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      speeds[i] = 0.15 + Math.random() * 0.35;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.15 + Math.random() * 0.25;

      // Slow random 3D drift direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      driftDirs[i * 3] = Math.sin(phi) * Math.cos(theta);
      driftDirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      driftDirs[i * 3 + 2] = Math.cos(phi);
    }

    return { positions, colors, speeds, phases, sizes, driftDirs };
  }, [count]);

  const dustOpacityFactor = useRef(1.0);

  useFrame((state) => {
    if (materialRef.current && uniforms) {
      const mat = materialRef.current;
      mat.uniforms.uTime.value = uniforms.uTime.value;
      mat.uniforms.uCameraPosition.value.copy(uniforms.uCameraPosition.value);
      mat.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;

      // Modulate opacity factor based on route (e.g. lower on /collab or /git-profile)
      const currentPath = state.scene.userData.currentPath || '/';
      let targetOpacity = 1.0;
      if (currentPath === '/git-profile' || currentPath === '/data') targetOpacity = 0.3;
      else if (currentPath === '/collab') targetOpacity = 0.4;
      else if (currentPath === '/problem') targetOpacity = 0.25;

      dustOpacityFactor.current += (targetOpacity - dustOpacityFactor.current) * 0.05;
      mat.uniforms.uDustOpacityFactor.value = dustOpacityFactor.current;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[dustData.colors, 3]} />
        <bufferAttribute attach="attributes-aSpeed" args={[dustData.speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[dustData.phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[dustData.sizes, 1]} />
        <bufferAttribute attach="attributes-aDriftDir" args={[dustData.driftDirs, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={DustShader.vertexShader}
        fragmentShader={DustShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uPrefersReduced: { value: 0.0 },
          uDustOpacityFactor: { value: 1.0 },
          uMaxOpacity: { value: 0.90 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default CosmicDust;
