import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TrailShader = {
  vertexShader: `
    attribute float aSize;
    attribute float aOpacity;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      vColor = aColor;
      vOpacity = aOpacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Scale size relative to camera depth
      gl_PointSize = aSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
      // Soft circular points
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.0, dist);
      gl_FragColor = vec4(vColor, intensity * vOpacity);
    }
  `
};

export const CometSystem = ({ quality, prefersReduced }) => {
  const trailGeomRef = useRef(null);
  const trailShaderRef = useRef(null);
  
  const maxComets = quality.maxComets || 0;
  const segments = quality.cometTrailSegments || 20;

  // Local state for active comets
  const [comets, setComets] = useState([]);

  // Generate a random path off-screen to off-screen
  const generatePath = () => {
    // Generate curved path
    const isLeftToRight = Math.random() > 0.5;
    const startX = isLeftToRight ? -22 - Math.random() * 6 : 22 + Math.random() * 6;
    const endX = isLeftToRight ? 22 + Math.random() * 6 : -22 - Math.random() * 6;
    
    const startY = 8 + Math.random() * 8;
    const endY = -12 - Math.random() * 6;
    
    const startZ = -15 - Math.random() * 5;
    const endZ = -2 - Math.random() * 4;

    const start = new THREE.Vector3(startX, startY, startZ);
    const end = new THREE.Vector3(endX, endY, endZ);
    
    // Curved control points
    const ctrl1 = new THREE.Vector3(
      startX * 0.5 + (Math.random() - 0.5) * 10,
      startY * 0.4 + (Math.random() - 0.5) * 5,
      startZ * 0.7 + (Math.random() - 0.5) * 3
    );
    const ctrl2 = new THREE.Vector3(
      endX * 0.5 + (Math.random() - 0.5) * 10,
      endY * 0.4 + (Math.random() - 0.5) * 5,
      endZ * 0.7 + (Math.random() - 0.5) * 3
    );

    const curve = new THREE.CatmullRomCurve3([start, ctrl1, ctrl2, end]);
    const color = Math.random() > 0.4 ? new THREE.Color('#fbbf24') : new THREE.Color('#93c5fd'); // Amber or soft blue

    return {
      id: Math.random(),
      curve,
      t: 0,
      speed: 0.03 + Math.random() * 0.04, // Travels path in 15-30 seconds
      pos: start.clone(),
      prevPos: start.clone(),
      scale: 0.15 + Math.random() * 0.2,
      color,
      active: true
    };
  };

  // Manage comet spawning
  useEffect(() => {
    if (prefersReduced || maxComets === 0) {
      setComets([]);
      return;
    }

    // Set initial comets
    const initialComets = [];
    for (let i = 0; i < Math.min(maxComets, 1); i++) {
      initialComets.push(generatePath());
    }
    setComets(initialComets);

    // Dynamic interval to check for spawning
    const interval = setInterval(() => {
      setComets((curr) => {
        const active = curr.filter(c => c.active);
        if (active.length < maxComets && Math.random() > 0.6) {
          return [...active, generatePath()];
        }
        return active;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [maxComets, prefersReduced]);

  // Maintain list of trail particles
  const trailParticles = useRef([]);

  useFrame((state, delta) => {
    if (prefersReduced || maxComets === 0) return;

    const dt = Math.min(delta, 0.1); // Cap delta to prevent huge jumps

    // Update comets
    const updatedComets = comets.map((comet) => {
      if (!comet.active) return comet;

      const nextT = comet.t + comet.speed * dt;
      if (nextT >= 1.0) {
        comet.active = false;
        return comet;
      }

      comet.t = nextT;
      comet.prevPos.copy(comet.pos);
      comet.curve.getPointAt(nextT, comet.pos);

      // Spawn trail particles
      const travelDir = new THREE.Vector3().subVectors(comet.pos, comet.prevPos);
      const speedVal = travelDir.length();
      travelDir.normalize();

      // Spawn count relative to speed and quality
      const spawnCount = Math.max(1, Math.round(50 * speedVal));
      for (let i = 0; i < spawnCount; i++) {
        // Spawn slightly offset from current comet position
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * comet.scale * 0.4,
          (Math.random() - 0.5) * comet.scale * 0.4,
          (Math.random() - 0.5) * comet.scale * 0.4
        );
        const pPos = comet.pos.clone().add(offset);
        
        // Velocity: opposite direction of travel + random drift
        const pVel = travelDir.clone().multiplyScalar(-1.2)
          .add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6
          ));

        trailParticles.current.push({
          pos: pPos,
          vel: pVel,
          color: comet.color,
          size: comet.scale * (1.8 + Math.random() * 1.5),
          age: 0,
          maxAge: Math.random() * 1.2 + 0.6 // particles live 0.6 - 1.8 seconds
        });
      }

      return comet;
    }).filter(c => c.active);

    if (updatedComets.length !== comets.length) {
      setComets(updatedComets);
    }

    // Update trail particles
    trailParticles.current.forEach((p) => {
      p.pos.addScaledVector(p.vel, dt);
      p.age += dt;
    });

    // Filter dead particles
    trailParticles.current = trailParticles.current.filter(p => p.age < p.maxAge);

    // Populate trail buffer geometry
    const particleCount = trailParticles.current.length;
    const posArr = new Float32Array(particleCount * 3);
    const colArr = new Float32Array(particleCount * 3);
    const sizeArr = new Float32Array(particleCount);
    const opacityArr = new Float32Array(particleCount);

    trailParticles.current.forEach((p, idx) => {
      const lifeRatio = p.age / p.maxAge;
      
      // Position
      posArr[idx * 3] = p.pos.x;
      posArr[idx * 3 + 1] = p.pos.y;
      posArr[idx * 3 + 2] = p.pos.z;

      // Color
      colArr[idx * 3] = p.color.r;
      colArr[idx * 3 + 1] = p.color.g;
      colArr[idx * 3 + 2] = p.color.b;

      // Size tapers as particle ages
      sizeArr[idx] = p.size * (1.0 - lifeRatio * 0.85);

      // Opacity fades out smoothly
      opacityArr[idx] = 1.0 - lifeRatio;
    });

    if (trailGeomRef.current) {
      const geom = trailGeomRef.current;
      
      geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      geom.setAttribute('aColor', new THREE.BufferAttribute(colArr, 3));
      geom.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));
      geom.setAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
      
      geom.computeBoundingSphere();
    }
  });

  return (
    <group>
      {/* Comet Nucleus Render */}
      {comets.map((comet) => (
        <group key={comet.id} position={comet.pos}>
          {/* Glowing core */}
          <mesh>
            <sphereGeometry args={[comet.scale * 0.35, 12, 12]} />
            <meshBasicMaterial 
              color="#ffffff" 
              depthWrite={false} 
            />
          </mesh>
          {/* Soft outer coma glow */}
          <mesh>
            <sphereGeometry args={[comet.scale * 1.2, 16, 16]} />
            <meshBasicMaterial
              color={comet.color}
              transparent
              opacity={0.35}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Comet Trails Render */}
      <points>
        <bufferGeometry ref={trailGeomRef} />
        <shaderMaterial
          ref={trailShaderRef}
          vertexShader={TrailShader.vertexShader}
          fragmentShader={TrailShader.fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Immediate Visible Test Comet for Debugging */}
      <Comet
        start={[-8, 4, -6]}
        end={[8, -3, -8]}
        duration={6}
        debug
      />
    </group>
  );
};

// Independent Comet component for visual testing and specific path trajectories
export const Comet = ({ start, end, duration = 6, debug = false }) => {
  const trailGeomRef = useRef(null);

  const startVec = React.useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = React.useMemo(() => new THREE.Vector3(...end), [end]);
  const color = React.useMemo(() => new THREE.Color('#fbbf24'), []); // Amber test color

  const particles = useRef([]);
  const [position, setPosition] = useState(startVec.clone());

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();
    const t = (time % duration) / duration;

    // Linear interpolation
    const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, t);
    setPosition(currentPos);

    // Spawn trail particles
    const travelDir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
    const spawnCount = 2;
    for (let i = 0; i < spawnCount; i++) {
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08
      );
      const pPos = currentPos.clone().add(offset);
      const pVel = travelDir.clone().multiplyScalar(-1.5)
        .add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ));

      particles.current.push({
        pos: pPos,
        vel: pVel,
        color,
        size: 2.2 + Math.random() * 1.5,
        age: 0,
        maxAge: 0.8 + Math.random() * 0.6
      });
    }

    // Update particles
    particles.current.forEach((p) => {
      p.pos.addScaledVector(p.vel, dt);
      p.age += dt;
    });

    particles.current = particles.current.filter((p) => p.age < p.maxAge);

    // Populate geometry
    const particleCount = particles.current.length;
    const posArr = new Float32Array(particleCount * 3);
    const colArr = new Float32Array(particleCount * 3);
    const sizeArr = new Float32Array(particleCount);
    const opacityArr = new Float32Array(particleCount);

    particles.current.forEach((p, idx) => {
      const lifeRatio = p.age / p.maxAge;
      posArr[idx * 3] = p.pos.x;
      posArr[idx * 3 + 1] = p.pos.y;
      posArr[idx * 3 + 2] = p.pos.z;

      colArr[idx * 3] = p.color.r;
      colArr[idx * 3 + 1] = p.color.g;
      colArr[idx * 3 + 2] = p.color.b;

      sizeArr[idx] = p.size * (1.0 - lifeRatio * 0.85);
      opacityArr[idx] = 1.0 - lifeRatio;
    });

    if (trailGeomRef.current) {
      const geom = trailGeomRef.current;
      geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      geom.setAttribute('aColor', new THREE.BufferAttribute(colArr, 3));
      geom.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));
      geom.setAttribute('aOpacity', new THREE.BufferAttribute(opacityArr, 1));
      geom.computeBoundingSphere();
    }
  });

  return (
    <group>
      {/* Comet Nucleus */}
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#ffffff" depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Comet Trail */}
      <points>
        <bufferGeometry ref={trailGeomRef} />
        <shaderMaterial
          vertexShader={TrailShader.vertexShader}
          fragmentShader={TrailShader.fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default CometSystem;
