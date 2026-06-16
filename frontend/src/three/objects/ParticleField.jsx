import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField({ quality, prefersReduced }) {
  const pointsRef = useRef();
  const geomRef = useRef();
  const count = quality.particleCount || 300;

  // Initialize multiple coordinates systems on mount
  const { posSphere, posGrid, posClusters, posSpiral, velocities, phases } = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const grid = new Float32Array(count * 3);
    const clusters = new Float32Array(count * 3);
    const spiral = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    // 4 Cluster centers representing categories for skills constellation
    const centers = [
      new THREE.Vector3(-2.2, 1.8, 0.4),
      new THREE.Vector3(2.2, 1.8, -0.4),
      new THREE.Vector3(-2.2, -1.8, -0.4),
      new THREE.Vector3(2.2, -1.8, 0.4)
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 1. Sphere shell coordinate distribution
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = THREE.MathUtils.randFloat(2.6, 5.8);
      sphere[i3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i3 + 2] = r * Math.cos(phi);

      // 2. Timeline Grid distribution (along horizontal x axis)
      grid[i3] = ((i % 30) / 30 - 0.5) * 12.0; 
      grid[i3 + 1] = (Math.floor(i / 30) % 10) * 0.16 - 0.8; 
      grid[i3 + 2] = THREE.MathUtils.randFloat(-1.0, 1.0);

      // 3. Cluster constellations
      const center = centers[i % 4];
      const clusterOffset = new THREE.Vector3(
        THREE.MathUtils.randFloat(-0.8, 0.8),
        THREE.MathUtils.randFloat(-0.8, 0.8),
        THREE.MathUtils.randFloat(-0.8, 0.8)
      );
      clusters[i3] = center.x + clusterOffset.x;
      clusters[i3 + 1] = center.y + clusterOffset.y;
      clusters[i3 + 2] = center.z + clusterOffset.z;

      // 4. Spiral core cluster
      const spiralR = THREE.MathUtils.randFloat(1.0, 1.5);
      const spiralTheta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      spiral[i3] = spiralR * Math.cos(spiralTheta);
      spiral[i3 + 1] = spiralR * Math.sin(spiralTheta);
      spiral[i3 + 2] = THREE.MathUtils.randFloat(-0.5, 0.5);

      // Basic wave drift speed offsets
      vel[i3] = THREE.MathUtils.randFloat(-0.012, 0.012);
      vel[i3 + 1] = THREE.MathUtils.randFloat(-0.012, 0.012);
      vel[i3 + 2] = THREE.MathUtils.randFloat(-0.012, 0.012);

      ph[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
    }

    return { posSphere: sphere, posGrid: grid, posClusters: clusters, posSpiral: spiral, velocities: vel, phases: ph };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !geomRef.current) return;
    const time = state.clock.getElapsedTime();
    const speed = quality.animationSpeed || 1.0;

    // Read global scroll values from scene userData
    const sectionIdx = state.scene.userData.sectionIdx || 0;
    const progress = state.scene.userData.progress || 0;

    // Morph rotation speed depending on active sections
    if (!prefersReduced) {
      const rotCoeff = sectionIdx === 4 ? 3.0 : 1.0; 
      pointsRef.current.rotation.y = time * 0.015 * speed * rotCoeff;
      pointsRef.current.rotation.x = time * 0.005 * speed * rotCoeff;
    }

    const posAttr = geomRef.current.attributes.position;
    const arr = posAttr.array;

    const pointer = state.pointer;
    const viewport = state.viewport;

    // Project pointer to 3D coordinate on z=0 plane
    const mx = pointer.x * viewport.width * 0.5;
    const my = pointer.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Identify source & destination coordinates based on active section
      let sX = posSphere[i3];
      let sY = posSphere[i3 + 1];
      let sZ = posSphere[i3 + 2];

      let dX = posSphere[i3];
      let dY = posSphere[i3 + 1];
      let dZ = posSphere[i3 + 2];

      let pMix = progress;

      if (sectionIdx === 0) {
        // Hero -> About: stays spherical
        sX = posSphere[i3]; sY = posSphere[i3 + 1]; sZ = posSphere[i3 + 2];
        dX = posSphere[i3]; dY = posSphere[i3 + 1]; dZ = posSphere[i3 + 2];
        pMix = 0;
      } else if (sectionIdx === 1) {
        // About -> Experience: morphs from Sphere to Timeline Grid
        sX = posSphere[i3]; sY = posSphere[i3 + 1]; sZ = posSphere[i3 + 2];
        dX = posGrid[i3]; dY = posGrid[i3 + 1]; dZ = posGrid[i3 + 2];
      } else if (sectionIdx === 2) {
        // Experience -> Projects: remains Grid floor
        sX = posGrid[i3]; sY = posGrid[i3 + 1]; sZ = posGrid[i3 + 2];
        dX = posGrid[i3]; dY = posGrid[i3 + 1]; dZ = posGrid[i3 + 2];
        pMix = 0;
      } else if (sectionIdx === 3) {
        // Projects -> Skills: dissolves from Grid into Skill Clusters
        sX = posGrid[i3]; sY = posGrid[i3 + 1]; sZ = posGrid[i3 + 2];
        dX = posClusters[i3]; dY = posClusters[i3 + 1]; dZ = posClusters[i3 + 2];
      } else if (sectionIdx === 4) {
        // Skills -> Founder: clusters converge and spiral into the Core
        sX = posClusters[i3]; sY = posClusters[i3 + 1]; sZ = posClusters[i3 + 2];
        dX = posSpiral[i3]; dY = posSpiral[i3 + 1]; dZ = posSpiral[i3 + 2];
      } else if (sectionIdx === 5) {
        // Founder -> Contact: spiral breaks into a loose sphere mist
        sX = posSpiral[i3]; sY = posSpiral[i3 + 1]; sZ = posSpiral[i3 + 2];
        dX = posSphere[i3]; dY = posSphere[i3 + 1]; dZ = posSphere[i3 + 2];
      }

      // Linear interpolation between active morph coordinates
      const targetX = THREE.MathUtils.lerp(sX, dX, pMix);
      const targetY = THREE.MathUtils.lerp(sY, dY, pMix);
      const targetZ = THREE.MathUtils.lerp(sZ, dZ, pMix);

      // Add flow vector wave offsets
      let waveX = velocities[i3] * speed * 7.5;
      let waveY = velocities[i3 + 1] * speed * 7.5 + Math.sin(time * 0.4 + phase) * 0.08 * speed;
      let waveZ = velocities[i3 + 2] * speed * 7.5;

      // Dampen wave drift in grid/contact sections to keep structures clean
      if (sectionIdx === 1 || sectionIdx === 2 || sectionIdx === 5) {
        waveX *= 0.12;
        waveY *= 0.12;
        waveZ *= 0.12;
      }

      arr[i3] = targetX + waveX;
      arr[i3 + 1] = targetY + waveY;
      arr[i3 + 2] = targetZ + waveZ;

      // Pointer repulsion (only on desktop, disabled during timeline/contact stages)
      if (quality.pointerInteraction && !prefersReduced && sectionIdx !== 1 && sectionIdx !== 5) {
        const px = arr[i3];
        const py = arr[i3 + 1];
        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < 1.6) {
          const dist = Math.sqrt(distSq) || 0.001;
          const force = (1.6 - dist) * 0.016;
          arr[i3] += (dx / dist) * force;
          arr[i3 + 1] += (dy / dist) * force;
        }
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[posSphere, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={quality.tier === 'low' ? 0.035 : 0.024}
        sizeAttenuation={true}
        transparent={true}
        opacity={quality.tier === 'low' ? 0.35 : 0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default ParticleField;
