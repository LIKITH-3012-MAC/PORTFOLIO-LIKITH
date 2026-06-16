import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import NeuralShaderMaterial from '../materials/NeuralMaterial';

export function NeuralCore({ quality, prefersReduced }) {
  const innerRef = useRef();
  const outerRef = useRef();
  const materialRef = useRef();
  const pulseRef = useRef();
  const pointsRef = useRef();

  // 1. Generate internal energy particle coordinates on mount
  const internalData = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spawn inside a sphere of radius 1.1
      const r = Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2.0;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      phases[i] = Math.random() * Math.PI * 2.0;
      speeds[i] = Math.random() * 0.4 + 0.1;
    }
    return { positions, phases, speeds };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedCoeff = quality.animationSpeed || 1.0;
    
    // Read global scroll values from scene userData
    const sectionIdx = state.scene.userData.sectionIdx || 0;
    const progress = state.scene.userData.progress || 0;

    let noiseAmp = 0.16;
    let noiseFreq = 0.65;
    let colorMix = 0; 
    let shellOpacity = quality.tier === 'low' ? 0.05 : 0.12;
    let coreScale = 1.0;

    // Apply scroll-linked section morphing choreographies
    if (sectionIdx === 0) {
      shellOpacity = THREE.MathUtils.lerp(0.12, 0.22, progress);
      coreScale = THREE.MathUtils.lerp(1.0, 1.26, progress);
      noiseFreq = THREE.MathUtils.lerp(0.65, 0.85, progress);
    } else if (sectionIdx === 1) {
      shellOpacity = THREE.MathUtils.lerp(0.22, 0.06, progress);
      coreScale = THREE.MathUtils.lerp(1.26, 0.85, progress);
    } else if (sectionIdx === 2) {
      shellOpacity = 0.06;
      coreScale = 0.85;
    } else if (sectionIdx === 3) {
      coreScale = THREE.MathUtils.lerp(0.85, 1.15, progress);
    } else if (sectionIdx === 4) {
      coreScale = 1.15;
      noiseAmp = THREE.MathUtils.lerp(0.16, 0.38, progress);
      noiseFreq = THREE.MathUtils.lerp(0.65, 1.35, progress);
      colorMix = progress;
      shellOpacity = THREE.MathUtils.lerp(0.06, 0.25, progress);
    } else if (sectionIdx === 5) {
      coreScale = THREE.MathUtils.lerp(1.15, 0.5, progress);
      noiseAmp = THREE.MathUtils.lerp(0.38, 0.04, progress);
      shellOpacity = THREE.MathUtils.lerp(0.25, 0.02, progress);
    }

    // Interactive pointer deformation: distort shader on pointer hover (only on desktop Hero)
    if (quality.pointerInteraction && !prefersReduced && sectionIdx === 0) {
      const pointer = state.pointer;
      const pointerDist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
      if (pointerDist < 0.7) {
        const hoverFactor = (0.7 - pointerDist) * 0.25;
        noiseAmp += hoverFactor;
        coreScale += hoverFactor * 0.3;
      }
    }

    if (materialRef.current) {
      materialRef.current.uTime = time * (prefersReduced ? 0.12 : 0.45) * speedCoeff;
      materialRef.current.uNoiseAmplitude = noiseAmp;
      materialRef.current.uNoiseFrequency = noiseFreq;
      
      if (colorMix > 0) {
        materialRef.current.uColor1.lerpColors(new THREE.Color('#fbbf24'), new THREE.Color('#ffffff'), colorMix);
        materialRef.current.uColor2.lerpColors(new THREE.Color('#8b5cf6'), new THREE.Color('#f59e0b'), colorMix);
      } else {
        materialRef.current.uColor1.set('#fbbf24');
        materialRef.current.uColor2.set('#8b5cf6');
      }
    }

    // Rotation and scales
    if (innerRef.current && !prefersReduced) {
      const rotCoeff = sectionIdx === 4 ? 2.5 : 1.0; 
      innerRef.current.rotation.y = time * 0.08 * speedCoeff * rotCoeff;
      innerRef.current.rotation.x = time * 0.04 * speedCoeff * rotCoeff;
      innerRef.current.scale.set(coreScale, coreScale, coreScale);
    }

    if (outerRef.current && !prefersReduced) {
      outerRef.current.rotation.y = -time * 0.05 * speedCoeff;
      outerRef.current.rotation.z = time * 0.03 * speedCoeff;
      outerRef.current.scale.set(coreScale * 1.25, coreScale * 1.25, coreScale * 1.25);
    }

    if (outerRef.current && outerRef.current.material) {
      outerRef.current.material.opacity = shellOpacity;
    }

    // 2. Animate internal energy particles
    if (pointsRef.current && !prefersReduced) {
      const geom = pointsRef.current.geometry;
      const posAttr = geom.getAttribute('position');
      const arr = posAttr.array;
      const cycleTime = time * 0.6;
      
      for (let i = 0; i < 120; i++) {
        const i3 = i * 3;
        const phase = internalData.phases[i];
        const speed = internalData.speeds[i];
        
        arr[i3] += Math.sin(cycleTime * speed + phase) * 0.004;
        arr[i3 + 1] += Math.cos(cycleTime * speed + phase) * 0.004;
        
        // Constrain energy particles inside shell boundaries
        const pVec = new THREE.Vector3(arr[i3], arr[i3 + 1], arr[i3 + 2]);
        if (pVec.length() > 1.2) {
          pVec.normalize().multiplyScalar(1.0);
          arr[i3] = pVec.x;
          arr[i3 + 1] = pVec.y;
          arr[i3 + 2] = pVec.z;
        }
      }
      posAttr.needsUpdate = true;
      
      // Update global scale of internal energy points
      pointsRef.current.scale.set(coreScale, coreScale, coreScale);
      pointsRef.current.rotation.y = -time * 0.05 * speedCoeff;
    }

    // Expanding pulse ring animation (disabled on low quality)
    if (pulseRef.current && quality.tier !== 'low') {
      const cycle = 3.0;
      const t = (time * speedCoeff) % cycle;
      const progressPulse = t / cycle;
      const scaleVal = coreScale * (1.0 + progressPulse * 2.5);
      pulseRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      if (pulseRef.current.material) {
        pulseRef.current.material.opacity = (1.0 - progressPulse) * 0.22 * (sectionIdx === 4 ? 2.0 : 1.0);
      }
    }
  });

  const detail = quality.tier === 'low' ? 2 : quality.tier === 'medium' ? 3 : 4;

  return (
    <group>
      {/* Inner organic neural core with custom shader */}
      <mesh ref={innerRef} castShadow>
        <icosahedronGeometry args={[1.4, detail]} />
        <neuralShaderMaterial 
          ref={materialRef} 
          uColor1={new THREE.Color('#fbbf24')} 
          uColor2={new THREE.Color('#8b5cf6')} 
          uFresnelPower={2.5}
          uNoiseFrequency={0.65}
          uNoiseAmplitude={0.16}
          transparent
        />
      </mesh>

      {/* Internal energy particles */}
      {quality.tier !== 'low' && !prefersReduced && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[internalData.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial 
            color="#fbbf24" 
            size={0.065} 
            transparent 
            opacity={0.7} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Outer structural wireframe shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.72, quality.tier === 'low' ? 1 : 2]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          wireframe 
          transparent 
          opacity={quality.tier === 'low' ? 0.05 : 0.12} 
        />
      </mesh>

      {/* Expanding signal rings */}
      {quality.tier !== 'low' && (
        <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.44, 32]} />
          <meshBasicMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.2} 
            side={THREE.DoubleSide} 
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

export default NeuralCore;
