import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../../three/solar-system/materials/CometIonTailMaterial';
import '../../three/solar-system/materials/CometDustTailMaterial';

// Calculate comet position at any time t
export const getCometPosition = (t) => {
  if (t < 0.8) {
    // 1. Deep space approach
    const progress = t / 0.8;
    const start = new THREE.Vector3(32, 8, 22);
    const end = new THREE.Vector3(16.5, 4.0, 15.0);
    return new THREE.Vector3().lerpVectors(start, end, progress);
  } else if (t < 1.2) {
    // 2. Saturn approach
    const progress = (t - 0.8) / 0.4;
    const start = new THREE.Vector3(16.5, 4.0, 15.0);
    const end = new THREE.Vector3(12.5, 2.0, 14.0);
    return new THREE.Vector3().lerpVectors(start, end, progress);
  } else if (t < 1.75) {
    // 3. Saturn slingshot (curves around Saturn at (10.2, 0, 12.3))
    const progress = (t - 1.2) / 0.55;
    const start = new THREE.Vector3(12.5, 2.0, 14.0);
    const control = new THREE.Vector3(7.5, -0.5, 12.0); // Gravity-assist pull point
    const end = new THREE.Vector3(4.0, -1.0, 5.0);

    const p = new THREE.Vector3();
    p.x = (1 - progress) * (1 - progress) * start.x + 2 * (1 - progress) * progress * control.x + progress * progress * end.x;
    p.y = (1 - progress) * (1 - progress) * start.y + 2 * (1 - progress) * progress * control.y + progress * progress * end.y;
    p.z = (1 - progress) * (1 - progress) * start.z + 2 * (1 - progress) * progress * control.z + progress * progress * end.z;
    return p;
  } else if (t < 2.15) {
    // 4. Sun dive
    const progress = (t - 1.75) / 0.4;
    const start = new THREE.Vector3(4.0, -1.0, 5.0);
    const end = new THREE.Vector3(0.0, 0.2, 3.5);
    return new THREE.Vector3().lerpVectors(start, end, progress);
  } else if (t < 2.55) {
    // 5. Time dilation deceleration / Drift
    const progress = (t - 2.15) / 0.4;
    const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const start = new THREE.Vector3(0.0, 0.2, 3.5);
    const end = new THREE.Vector3(0.0, 0.2, 3.0);
    return new THREE.Vector3().lerpVectors(start, end, ease);
  } else {
    // 6. Title formation lock
    return new THREE.Vector3(0.0, 0.2, 3.0);
  }
};

const CometTail = ({ type = 'ion', count = 120, material: MatTag }) => {
  const ref = useRef();

  const { positions, sizes, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      sz[i] = 0.02 + Math.random() * (type === 'ion' ? 0.03 : 0.06);
      op[i] = Math.random();
    }

    return { positions: pos, sizes: sz, opacities: op };
  }, [count, type]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[opacities, 1]} />
      </bufferGeometry>
      {MatTag}
    </points>
  );
};

export const IntroComet = ({ introTime }) => {
  const groupRef = useRef();
  const nucleusRef = useRef();
  const comaRef = useRef();
  const ionTailRef = useRef();
  const dustTailRef = useRef();
  const waveRef = useRef();
  const debrisRef = useRef();

  // Debris particles shedding from nucleus
  const debrisCount = 40;
  const { debrisPositions, debrisSpeeds } = useMemo(() => {
    const pos = new Float32Array(debrisCount * 3);
    const spd = new Float32Array(debrisCount * 3);
    for (let i = 0; i < debrisCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      spd[i * 3] = (Math.random() - 0.5) * 0.5;
      spd[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return { debrisPositions: pos, debrisSpeeds: spd };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = introTime.current;

    // Active sequence: 0.0s to 2.55s (dissolution)
    if (t > 2.7) {
      groupRef.current.position.set(999, 999, 999);
      return;
    }

    const currentPos = getCometPosition(t);
    groupRef.current.position.copy(currentPos);

    // Calculate velocity tangent using finite differences
    const nextPos = getCometPosition(t + 0.01);
    const tangent = new THREE.Vector3().subVectors(nextPos, currentPos).normalize();
    const tailDir = tangent.clone().multiplyScalar(-1);

    // Sun direction (Sun is at (0, 0, 0))
    const toSun = new THREE.Vector3().copy(currentPos).normalize();
    
    // Ion tail points directly away from the Sun (repelled by solar wind)
    const ionDir = toSun.clone();

    // Dust tail points opposite to velocity but is slightly deflected by solar wind
    const dustDir = tailDir.clone().lerp(toSun, 0.2).normalize();

    // Fade materials as comet dissolves (t = 2.15 to 2.55)
    let cometOpacity = 1.0;
    if (t > 2.15) {
      cometOpacity = Math.max(0.0, 1.0 - (t - 2.15) / 0.4);
    }

    if (nucleusRef.current) {
      nucleusRef.current.rotation.x += 0.04;
      nucleusRef.current.rotation.y += 0.025;
      nucleusRef.current.material.opacity = cometOpacity * 0.95;
    }

    if (comaRef.current) {
      comaRef.current.material.opacity = cometOpacity * 0.35;
    }

    // Ion tail rendering
    if (ionTailRef.current) {
      const posArr = ionTailRef.current.children[0]?.geometry?.attributes?.position?.array;
      const mat = ionTailRef.current.children[0]?.material;
      if (posArr) {
        const cnt = posArr.length / 3;
        for (let i = 0; i < cnt; i++) {
          const factor = i / cnt;
          // Scale tail length depending on velocity/time
          const length = 2.5 * (1.0 + Math.sin(t * 2.0) * 0.15);
          posArr[i * 3] = ionDir.x * factor * length + (Math.random() - 0.5) * 0.06;
          posArr[i * 3 + 1] = ionDir.y * factor * length + (Math.random() - 0.5) * 0.06;
          posArr[i * 3 + 2] = ionDir.z * factor * length + (Math.random() - 0.5) * 0.06;
        }
        ionTailRef.current.children[0].geometry.attributes.position.needsUpdate = true;
      }
      if (mat) {
        mat.opacity = cometOpacity * 0.8;
      }
    }

    // Dust tail rendering
    if (dustTailRef.current) {
      const posArr = dustTailRef.current.children[0]?.geometry?.attributes?.position?.array;
      const mat = dustTailRef.current.children[0]?.material;
      if (posArr) {
        const cnt = posArr.length / 3;
        for (let i = 0; i < cnt; i++) {
          const factor = i / cnt;
          const length = 2.0;
          // Add a slight curve to the dust tail
          const curveOffset = Math.sin(factor * Math.PI * 0.5) * 0.25;
          posArr[i * 3] = dustDir.x * factor * length + (Math.random() - 0.5) * 0.12 * factor;
          posArr[i * 3 + 1] = dustDir.y * factor * length + (Math.random() - 0.5) * 0.12 * factor + curveOffset;
          posArr[i * 3 + 2] = dustDir.z * factor * length + (Math.random() - 0.5) * 0.12 * factor;
        }
        dustTailRef.current.children[0].geometry.attributes.position.needsUpdate = true;
      }
      if (mat) {
        mat.opacity = cometOpacity * 0.7;
      }
    }

    // Shedding debris fragments
    if (debrisRef.current) {
      const posArr = debrisRef.current.geometry.attributes.position.array;
      if (posArr) {
        for (let i = 0; i < debrisCount; i++) {
          posArr[i * 3] += debrisSpeeds[i * 3] * delta;
          posArr[i * 3 + 1] += debrisSpeeds[i * 3 + 1] * delta;
          posArr[i * 3 + 2] += debrisSpeeds[i * 3 + 2] * delta;

          // Recycle debris that travels too far
          const distSq = posArr[i * 3] * posArr[i * 3] + posArr[i * 3 + 1] * posArr[i * 3 + 1] + posArr[i * 3 + 2] * posArr[i * 3 + 2];
          if (distSq > 1.2 || t > 2.15) {
            posArr[i * 3] = (Math.random() - 0.5) * 0.1;
            posArr[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
          }
        }
        debrisRef.current.geometry.attributes.position.needsUpdate = true;
      }
      debrisRef.current.material.opacity = cometOpacity * 0.6;
    }

    // Time-dilation Spherical Energy Wave (t = 2.15 to 2.55)
    if (waveRef.current) {
      if (t >= 2.15 && t <= 2.55) {
        const waveProgress = (t - 2.15) / 0.4;
        const waveScale = waveProgress * 8.0;
        waveRef.current.scale.set(waveScale, waveScale, waveScale);
        waveRef.current.material.opacity = Math.max(0.0, 0.45 * (1.0 - waveProgress));
      } else {
        waveRef.current.scale.set(0, 0, 0);
        waveRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Irregular Rocky Nucleus */}
      <mesh ref={nucleusRef} castShadow>
        <dodecahedronGeometry args={[0.07, 1]} />
        <meshStandardMaterial
          color="#222225"
          roughness={0.9}
          metalness={0.1}
          flatShading
          transparent
        />
      </mesh>

      {/* Coma Glow */}
      <mesh ref={comaRef}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ion Tail (blue, straight) */}
      <group ref={ionTailRef}>
        <CometTail
          type="ion"
          count={100}
          material={
            <cometIonTailMaterial
              uColor={new THREE.Color('#3b82f6')}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          }
        />
      </group>

      {/* Dust Tail (warm, curved) */}
      <group ref={dustTailRef}>
        <CometTail
          type="dust"
          count={80}
          material={
            <cometDustTailMaterial
              uColor={new THREE.Color('#f59e0b')}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          }
        />
      </group>

      {/* Debris Particles */}
      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[debrisPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f59e0b"
          size={0.015}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Time-dilation energy wave ring */}
      <mesh ref={waveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.4, 64]} />
        <meshBasicMaterial
          color="#d97706"
          transparent
          opacity={0.0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default IntroComet;
