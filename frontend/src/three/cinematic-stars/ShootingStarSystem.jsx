import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ShootingStarSystem = ({ quality, prefersReduced, currentPath }) => {
  const lineRef = useRef();

  // Max active shooting stars based on quality
  const maxStars = useMemo(() => {
    if (quality.tier === 'low') return 1;
    if (quality.tier === 'mobile') return 1;
    if (quality.tier === 'desktop') return 2;
    return 3; // ultra
  }, [quality.tier]);

  // Track shooting stars state in a ref to avoid React re-renders at 60fps
  const starsState = useRef(
    Array.from({ length: maxStars }, () => ({
      active: false,
      progress: 0.0,
      speed: 0.0,
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      currentStart: new THREE.Vector3(),
      currentEnd: new THREE.Vector3(),
      color: new THREE.Color(),
      length: 0.0,
    }))
  );

  const lastPath = useRef(currentPath);

  // Buffer geometries to represent lines
  const vertices = useMemo(() => new Float32Array(maxStars * 2 * 3), [maxStars]);
  const colors = useMemo(() => new Float32Array(maxStars * 2 * 3), [maxStars]);

  const triggerStar = (star) => {
    star.active = true;
    star.progress = 0.0;
    star.speed = 1.6 + Math.random() * 1.8;
    star.length = 3.5 + Math.random() * 3.0;

    // Shooting stars flow diagonally from top-left to bottom-right
    const startX = -25.0 + Math.random() * 30.0;
    const startY = 12.0 + Math.random() * 10.0;
    const startZ = -15.0 - Math.random() * 15.0;

    star.start.set(startX, startY, startZ);
    
    // Direction vector
    const dir = new THREE.Vector3(1.0, -0.6, -0.25).normalize();
    const travelDistance = 30.0 + Math.random() * 20.0;
    
    star.end.copy(star.start).addScaledVector(dir, travelDistance);

    // Warm white / electric blue / golden-amber colors
    const starColors = ['#ffffff', '#bde0ff', '#ffe4c4'];
    star.color.set(starColors[Math.floor(Math.random() * starColors.length)]);
  };

  useFrame((state, delta) => {
    if (prefersReduced) return;

    // Trigger on route changes
    let routeChanged = false;
    if (currentPath !== lastPath.current) {
      routeChanged = true;
      lastPath.current = currentPath;
    }

    const elapsed = state.clock.getElapsedTime();
    const stars = starsState.current;

    for (let i = 0; i < maxStars; i++) {
      const star = stars[i];

      if (!star.active) {
        // Trigger randomly: small chance per frame (~1% chance per second per slot)
        // Or force-trigger on route changes
        const triggerChance = 0.21 * delta;
        if ((routeChanged && Math.random() < 0.8) || Math.random() < triggerChance) {
          triggerStar(star);
        }
      } else {
        // Update progress
        star.progress += delta * star.speed;
        if (star.progress >= 1.0) {
          star.active = false;
          // Hide vertices
          vertices[i * 6] = 0;
          vertices[i * 6 + 1] = 0;
          vertices[i * 6 + 2] = 0;
          vertices[i * 6 + 3] = 0;
          vertices[i * 6 + 4] = 0;
          vertices[i * 6 + 5] = 0;
          continue;
        }

        // Calculate leading head position
        const head = new THREE.Vector3().lerpVectors(star.start, star.end, star.progress);
        
        // Calculate trailing tail position
        const dir = new THREE.Vector3().subVectors(star.end, star.start).normalize();
        const tail = new THREE.Vector3().copy(head).addScaledVector(dir, -star.length);

        // Update vertex buffer positions
        vertices[i * 6] = tail.x;
        vertices[i * 6 + 1] = tail.y;
        vertices[i * 6 + 2] = tail.z;
        vertices[i * 6 + 3] = head.x;
        vertices[i * 6 + 4] = head.y;
        vertices[i * 6 + 5] = head.z;

        // Calculate opacity based on progress (fade in and out)
        const opacity = Math.sin(star.progress * Math.PI);
        const col = star.color;

        // Update vertex buffer colors and apply opacity via scale
        colors[i * 6] = col.r * opacity;
        colors[i * 6 + 1] = col.g * opacity;
        colors[i * 6 + 2] = col.b * opacity;
        colors[i * 6 + 3] = col.r * opacity;
        colors[i * 6 + 4] = col.g * opacity;
        colors[i * 6 + 5] = col.b * opacity;
      }
    }

    if (lineRef.current) {
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      lineRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[vertices, 3]} count={maxStars * 2} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={maxStars * 2} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        linewidth={1.5}
      />
    </lineSegments>
  );
};

export default ShootingStarSystem;
