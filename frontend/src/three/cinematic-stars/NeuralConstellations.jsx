import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMotionFlow } from '../../motion/MotionProvider';

export const NeuralConstellations = ({ quality, prefersReduced }) => {
  const { activeSection, currentPath } = useMotionFlow();

  const nodeCount = 15;
  
  // Custom geodesic connectivity topology
  const edges = useMemo(() => [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
    [10, 11], [11, 12], [12, 13], [13, 14], [14, 10],
    [5, 7], [6, 8], [8, 10], [10, 12], [12, 14]
  ], []);

  // Define target shapes for each scroll section
  const sectionShapes = useMemo(() => {
    const shapes = {};

    // 1. HERO - Spherical Cluster
    shapes.hero = Array.from({ length: nodeCount }, (_, i) => {
      const theta = (i / nodeCount) * Math.PI * 2;
      const phi = Math.acos((i / 7.5) - 1.0);
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * 3.5 + 2.5,
        Math.sin(phi) * Math.sin(theta) * 3.5,
        Math.cos(phi) * 3.5 - 2.0
      );
    });

    // 2. ABOUT - Shield Silhouette
    shapes.about = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r = 3.0 + 1.0 * Math.sin(angle * 3);
      return new THREE.Vector3(
        r * Math.cos(angle) - 3.5,
        r * Math.sin(angle) + 1.0,
        -1.0
      );
    });

    // 3. EXPERIENCE - Zigzag Timeline
    shapes.experience = Array.from({ length: nodeCount }, (_, i) => {
      const t = i / (nodeCount - 1);
      return new THREE.Vector3(
        (t - 0.5) * 12.0,
        Math.sin(t * Math.PI * 3.5) * 2.2 - 1.0,
        -3.0
      );
    });

    // 4. PROJECTS - Circular Web
    shapes.projects = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      const dist = (i % 2 === 0) ? 4.5 : 2.2;
      return new THREE.Vector3(
        dist * Math.cos(angle) + 3.0,
        dist * Math.sin(angle) - 0.5,
        -1.5
      );
    });

    // 5. SKILLS - Neural Tree / Starburst
    shapes.skills = Array.from({ length: nodeCount }, (_, i) => {
      if (i === 0) return new THREE.Vector3(0, 0, -2); // center
      const branch = (i - 1) % 4; // 4 main branches
      const depth = Math.floor((i - 1) / 4) + 1;
      const angle = (branch / 4) * Math.PI * 2 + depth * 0.15;
      const len = depth * 2.2;
      return new THREE.Vector3(
        len * Math.cos(angle),
        len * Math.sin(angle),
        -2.0 - depth * 0.5
      );
    });

    // 6. FOUNDER - Wave Ripple
    shapes.founder = Array.from({ length: nodeCount }, (_, i) => {
      const x = ((i / (nodeCount - 1)) - 0.5) * 10.0;
      return new THREE.Vector3(
        x - 4.0,
        Math.cos(x * 0.8) * 2.0 + 1.0,
        0.5
      );
    });

    // 7. CONTACT - Converging Envelope / Pyramid
    shapes.contact = Array.from({ length: nodeCount }, (_, i) => {
      const t = i / (nodeCount - 1);
      return new THREE.Vector3(
        (t - 0.5) * 6.0,
        (1.0 - t) * -3.0 + 1.0,
        -4.0 + t * 4.0
      );
    });

    return shapes;
  }, []);

  // Node runtime state (ref-based to bypass React re-renders)
  const currentPositions = useRef(
    Array.from({ length: nodeCount }, () => new THREE.Vector3())
  );
  
  // Set initial coordinates
  useEffect(() => {
    const initial = sectionShapes.hero;
    for (let i = 0; i < nodeCount; i++) {
      currentPositions.current[i].copy(initial[i]);
    }
  }, [sectionShapes]);

  // Data signal pulses
  const pulseCount = 4;
  const pulses = useRef(
    Array.from({ length: pulseCount }, () => ({
      edge: 0,
      progress: Math.random(),
      speed: 0.8 + Math.random() * 0.8,
      forward: Math.random() > 0.5
    }))
  );

  const nodesGeomRef = useRef();
  const linesGeomRef = useRef();
  const pulsesGeomRef = useRef();
  const opacityRef = useRef(1.0);

  // Buffer geometries arrays
  const linePositions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges]);
  const nodePositionsArray = useMemo(() => new Float32Array(nodeCount * 3), []);
  const pulsePositionsArray = useMemo(() => new Float32Array(pulseCount * 3), []);

  useFrame((state, delta) => {
    // Determine active target layout
    const targetSection = activeSection || 'hero';
    const targets = sectionShapes[targetSection] || sectionShapes.hero;
    
    // Lerp speeds: slow down if prefersReduced is true
    const lerpSpeed = prefersReduced ? 1.0 : 4.2;
    const currentPos = currentPositions.current;

    const safeDelta = Math.min(delta, 0.05);
    const nodeSmoothing = 1 - Math.exp(-lerpSpeed * safeDelta);

    // 1. Lerp node positions
    for (let i = 0; i < nodeCount; i++) {
      currentPos[i].lerp(targets[i], nodeSmoothing);
      nodePositionsArray[i * 3] = currentPos[i].x;
      nodePositionsArray[i * 3 + 1] = currentPos[i].y;
      nodePositionsArray[i * 3 + 2] = currentPos[i].z;
    }

    // 2. Connect the edges (lines)
    for (let i = 0; i < edges.length; i++) {
      const [startIdx, endIdx] = edges[i];
      const start = currentPos[startIdx];
      const end = currentPos[endIdx];

      linePositions[i * 6] = start.x;
      linePositions[i * 6 + 1] = start.y;
      linePositions[i * 6 + 2] = start.z;
      
      linePositions[i * 6 + 3] = end.x;
      linePositions[i * 6 + 4] = end.y;
      linePositions[i * 6 + 5] = end.z;
    }

    // 3. Update pulses
    const pulseArray = pulses.current;
    for (let i = 0; i < pulseCount; i++) {
      const p = pulseArray[i];
      const edge = edges[p.edge];
      const n1 = currentPos[edge[0]];
      const n2 = currentPos[edge[1]];

      if (!prefersReduced) {
        p.progress += delta * p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0.0;
          // Route to a connected edge starting from the destination node
          const destNode = p.forward ? edge[1] : edge[0];
          const connected = edges.reduce((acc, ed, idx) => {
            if (ed[0] === destNode || ed[1] === destNode) acc.push(idx);
            return acc;
          }, []);
          p.edge = connected[Math.floor(Math.random() * connected.length)];
          p.forward = edges[p.edge][0] === destNode;
          p.speed = 0.8 + Math.random() * 0.8;
        }
      }

      const lerpFactor = p.forward ? p.progress : 1.0 - p.progress;
      const pulsePos = new THREE.Vector3().lerpVectors(n1, n2, lerpFactor);
      
      pulsePositionsArray[i * 3] = pulsePos.x;
      pulsePositionsArray[i * 3 + 1] = pulsePos.y;
      pulsePositionsArray[i * 3 + 2] = pulsePos.z;
    }

    // Update geometry attributes
    if (nodesGeomRef.current) nodesGeomRef.current.attributes.position.needsUpdate = true;
    if (linesGeomRef.current) linesGeomRef.current.attributes.position.needsUpdate = true;
    if (pulsesGeomRef.current) pulsesGeomRef.current.attributes.position.needsUpdate = true;

    // Transition opacity based on route factors (fade out completely on subpages)
    const isSubpage = currentPath && currentPath !== '/' && currentPath !== '/index.html';
    const targetOpacity = isSubpage ? 0.0 : 0.85;
    const opacitySmoothing = 1 - Math.exp(-5.0 * safeDelta);
    opacityRef.current += (targetOpacity - opacityRef.current) * opacitySmoothing;
  });

  return (
    <group visible={opacityRef.current > 0.01}>
      {/* 1. Constellation Nodes */}
      <points>
        <bufferGeometry ref={nodesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[nodePositionsArray, 3]} count={nodeCount} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffb74d" // Golden amber nodes
          size={0.16}
          sizeAttenuation={true}
          transparent
          opacity={opacityRef.current * 0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Constellation Connection Lines */}
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={edges.length * 2} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#2196f3" // Cosmic blue connections
          transparent
          opacity={opacityRef.current * 0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Traveling Signal Pulses */}
      <points>
        <bufferGeometry ref={pulsesGeomRef}>
          <bufferAttribute attach="attributes-position" args={[pulsePositionsArray, 3]} count={pulseCount} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff" // White bright pulses
          size={0.25}
          sizeAttenuation={true}
          transparent
          opacity={opacityRef.current}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default NeuralConstellations;
