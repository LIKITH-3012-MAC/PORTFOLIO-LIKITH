import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RibbonShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uPrefersReduced;
    attribute float aProgress;
    varying float vProgress;
    varying float vOpacity;

    void main() {
      vProgress = aProgress;
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      vec3 pos = position;

      // GPU-driven serpentine drift movement
      pos.x += sin(activeTime * 0.6 + aProgress * 6.28) * 1.4;
      pos.y += cos(activeTime * 0.4 + aProgress * 12.56) * 0.9;
      pos.z += sin(activeTime * 0.3 + aProgress * 3.14) * 1.0;

      // Gentle fade near boundaries
      vOpacity = smoothstep(0.0, 0.15, aProgress) * smoothstep(1.0, 0.85, aProgress);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uPrefersReduced;
    uniform vec3 uColor;
    varying float vProgress;
    varying float vOpacity;

    void main() {
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;
      
      // Moving wave pulse down the fiber
      float wave = sin(vProgress * 16.0 - activeTime * 2.8) * 0.5 + 0.5;
      
      // Double frequency subtle sparkle
      float sparkle = sin(vProgress * 48.0 + activeTime * 4.0) * 0.5 + 0.5;
      
      float intensity = (0.4 + 0.55 * wave + 0.05 * sparkle) * vOpacity;
      
      gl_FragColor = vec4(uColor, intensity * 0.55);
    }
  `
};

export const EnergyRibbons = ({ uniforms }) => {
  const materialRef1 = useRef();
  const materialRef2 = useRef();

  const segmentCount = 150;

  // Geometry builder helper
  const buildRibbonGeometry = (points) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(segmentCount);
    
    const positions = new Float32Array(curvePoints.length * 3);
    const progress = new Float32Array(curvePoints.length);

    for (let i = 0; i < curvePoints.length; i++) {
      positions[i * 3] = curvePoints[i].x;
      positions[i * 3 + 1] = curvePoints[i].y;
      positions[i * 3 + 2] = curvePoints[i].z;
      progress[i] = i / (curvePoints.length - 1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1));
    return geometry;
  };

  // Define 2 distinct spline routes through 3D space
  const ribbonGeometries = useMemo(() => {
    const r1Points = [
      new THREE.Vector3(-18, 12, -22),
      new THREE.Vector3(-10, 4, -15),
      new THREE.Vector3(2, -2, -10),
      new THREE.Vector3(8, -8, -12),
      new THREE.Vector3(18, -12, -18)
    ];

    const r2Points = [
      new THREE.Vector3(18, 14, -20),
      new THREE.Vector3(8, 2, -12),
      new THREE.Vector3(-4, -4, -8),
      new THREE.Vector3(-10, -6, -14),
      new THREE.Vector3(-18, -10, -22)
    ];

    return [
      buildRibbonGeometry(r1Points),
      buildRibbonGeometry(r2Points)
    ];
  }, []);

  useFrame(() => {
    if (uniforms) {
      if (materialRef1.current) {
        materialRef1.current.uniforms.uTime.value = uniforms.uTime.value;
        materialRef1.current.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
      }
      if (materialRef2.current) {
        materialRef2.current.uniforms.uTime.value = uniforms.uTime.value;
        materialRef2.current.uniforms.uPrefersReduced.value = uniforms.uPrefersReduced.value;
      }
    }
  });

  return (
    <group>
      {/* Ribbon 1 - Icy neon blue */}
      <line geometry={ribbonGeometries[0]}>
        <shaderMaterial
          ref={materialRef1}
          vertexShader={RibbonShader.vertexShader}
          fragmentShader={RibbonShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uPrefersReduced: { value: 0.0 },
            uColor: { value: new THREE.Color('#00e5ff') }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Ribbon 2 - Deep violet amber core */}
      <line geometry={ribbonGeometries[1]}>
        <shaderMaterial
          ref={materialRef2}
          vertexShader={RibbonShader.vertexShader}
          fragmentShader={RibbonShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uPrefersReduced: { value: 0.0 },
            uColor: { value: new THREE.Color('#e040fb') }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
};

export default EnergyRibbons;
