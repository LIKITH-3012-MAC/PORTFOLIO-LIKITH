import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ShootingStars = forwardRef(({ quality, prefersReduced }, ref) => {
  const lineGeomRef = useRef(null);
  const lineMatRef = useRef(null);

  const [activeStar, setActiveStar] = useState(null);

  // Function to spawn a shooting star
  const triggerShootingStar = () => {
    if (prefersReduced) return;

    // Pick random start position near top-left or top-right quadrant
    const startX = (Math.random() - 0.5) * 20;
    const startY = 6 + Math.random() * 6;
    const startZ = -6 - Math.random() * 8; // Middle depth

    // Direction pointing diagonally down
    const dirX = Math.random() > 0.5 ? 0.8 + Math.random() * 0.4 : -0.8 - Math.random() * 0.4;
    const dirY = -0.5 - Math.random() * 0.4;
    const dirZ = (Math.random() - 0.5) * 0.3;
    const dir = new THREE.Vector3(dirX, dirY, dirZ).normalize();

    const color = Math.random() > 0.4 ? new THREE.Color('#ffffff') : new THREE.Color('#93c5fd');

    setActiveStar({
      pos: new THREE.Vector3(startX, startY, startZ),
      dir,
      speed: 45 + Math.random() * 20, // 45-65 units per second
      length: 2.5 + Math.random() * 2.0,
      color,
      age: 0,
      maxAge: 0.3 + Math.random() * 0.15 // Lives 0.3 - 0.45 seconds
    });
  };

  // Expose spawn trigger to parent
  useImperativeHandle(ref, () => ({
    trigger: () => triggerShootingStar()
  }));

  // Periodic random spawner
  useEffect(() => {
    if (prefersReduced) return;

    const interval = setInterval(() => {
      // Spawn occasionally (e.g. 15% chance every 3.5s)
      if (Math.random() > 0.8) {
        triggerShootingStar();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [prefersReduced]);

  useFrame((state, delta) => {
    if (!activeStar) return;

    const dt = Math.min(delta, 0.1);
    
    // Update age
    activeStar.age += dt;
    if (activeStar.age >= activeStar.maxAge) {
      setActiveStar(null);
      return;
    }

    // Move head
    activeStar.pos.addScaledVector(activeStar.dir, activeStar.speed * dt);

    // Calculate head and tail coordinates
    const head = activeStar.pos;
    const tail = new THREE.Vector3().copy(head).addScaledVector(activeStar.dir, -activeStar.length);

    // Fade overall line opacity over age
    const fadeRatio = activeStar.age / activeStar.maxAge;
    const overallOpacity = 1.0 - fadeRatio;

    if (lineGeomRef.current) {
      const positions = new Float32Array([
        head.x, head.y, head.z,
        tail.x, tail.y, tail.z
      ]);
      lineGeomRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }

    if (lineMatRef.current) {
      lineMatRef.current.opacity = overallOpacity * 0.95;
    }
  });

  if (!activeStar) return null;

  // Vertex Colors to interpolate head (solid white) to tail (transparent blue/white)
  const colors = new Float32Array([
    1.0, 1.0, 1.0,  // Head (White)
    activeStar.color.r * 0.4, activeStar.color.g * 0.4, activeStar.color.b * 0.4  // Tail (Faint color)
  ]);

  return (
    <lineSegments>
      <bufferGeometry ref={lineGeomRef}>
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={lineMatRef}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        linewidth={1.5}
      />
    </lineSegments>
  );
});

export default ShootingStars;
