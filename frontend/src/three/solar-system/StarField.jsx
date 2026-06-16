import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const StarShader = {
  uniforms: {
    uTime: { value: 0 },
    uCameraPosition: { value: new THREE.Vector3() },
    uCameraVelocity: { value: new THREE.Vector3() },
    uCameraSpeed: { value: 0.0 },
    uCometPosition: { value: new THREE.Vector3(-999, -999, -999) },
    uCometRadius: { value: 6.0 },
    uRouteFactors: { value: new THREE.Vector4(0, 0, 0, 0) }, // x: stretch, y: flatten, z: grid, w: line
    uMaxOpacity: { value: 1.0 },
    uPrefersReduced: { value: 0.0 },
    uBoxSize: { value: new THREE.Vector3(60.0, 40.0, 40.0) }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform vec3 uCameraVelocity;
    uniform float uCameraSpeed;
    uniform vec3 uCometPosition;
    uniform float uCometRadius;
    uniform vec4 uRouteFactors; // x: stretch (youtube), y: flatten (collab), z: grid (git/data), w: line (problem)
    uniform float uPrefersReduced;
    uniform vec3 uBoxSize;

    attribute float size;
    attribute float aLayerIdx;
    attribute float aTwinkleSpeed;
    attribute float aTwinklePhase;
    attribute float aParallaxFactor;
    attribute vec3 aColor;

    varying vec3 vColor;
    varying float vOpacity;
    varying float vLayerIdx;

    void main() {
      vColor = aColor;
      vLayerIdx = aLayerIdx;

      // Disable animations if reduced motion is requested
      float activeTime = uPrefersReduced > 0.5 ? 0.0 : uTime;

      // Twinkle logic
      float baseOpacity = 0.65;
      float amplitude = 0.35;
      if (aLayerIdx == 0.0) { // Distant micro-stars
        baseOpacity = 0.55;
        amplitude = 0.45;
      } else if (aLayerIdx == 1.0) { // Mid depth
        baseOpacity = 0.70;
        amplitude = 0.30;
      } else if (aLayerIdx == 2.0) { // Foreground
        baseOpacity = 0.85;
        amplitude = 0.15;
      } else if (aLayerIdx == 3.0) { // Hero
        baseOpacity = 0.90;
        amplitude = 0.10;
      }

      float twinkle = baseOpacity + amplitude * sin(activeTime * aTwinkleSpeed + aTwinklePhase);
      vOpacity = twinkle;

      // Copy position to wrap it
      vec3 pos = position;

      // Deep space infinite wrap centered on the camera (parallax integrated)
      vec3 center = uCameraPosition * (1.0 - aParallaxFactor);
      pos = pos - center;
      pos = mod(pos + uBoxSize * 0.5, uBoxSize) - uBoxSize * 0.5;
      pos = pos + center;

      // Proximity to comet brightness reaction
      float distToComet = distance(pos, uCometPosition);
      if (distToComet < uCometRadius) {
        float influence = 1.0 - (distToComet / uCometRadius);
        vOpacity += influence * 0.5; // Glow up to 50% brighter near comet
      }

      // Morphing transformations based on routes
      // 1. YouTube warp (stretch along Z-axis/velocity vector)
      if (uRouteFactors.x > 0.0) {
        pos.z -= sin(pos.x * 0.4 + activeTime * 6.0) * uRouteFactors.x * 12.0;
      }

      // 2. Collab flatten (compress into 2D plane)
      if (uRouteFactors.y > 0.0) {
        pos.z = mix(pos.z, -12.0, uRouteFactors.y);
      }

      // 3. Grid alignment (Git profile / Data console)
      if (uRouteFactors.z > 0.0) {
        float gridX = floor(pos.x / 3.0) * 3.0;
        float gridY = floor(pos.y / 2.0) * 2.0;
        pos.x = mix(pos.x, gridX, uRouteFactors.z);
        pos.y = mix(pos.y, gridY, uRouteFactors.z);
      }

      // 4. Line alignment (Problem page)
      if (uRouteFactors.w > 0.0) {
        float lineY = floor(pos.y / 1.5) * 1.5;
        pos.y = mix(pos.y, lineY, uRouteFactors.w);
      }

      // Motion Streaks: stretch along camera movement direction
      if (uPrefersReduced < 0.5 && uCameraSpeed > 0.05) {
        vec3 velDir = vec3(0.0, 0.0, -1.0);
        if (length(uCameraVelocity) > 0.001) {
          velDir = normalize(uCameraVelocity);
        }
        
        float streakMult = 1.0;
        if (aLayerIdx == 0.0) streakMult = 0.25;
        else if (aLayerIdx == 1.0) streakMult = 0.6;
        else if (aLayerIdx == 2.0) streakMult = 1.6;
        else if (aLayerIdx == 3.0) streakMult = 2.2;

        pos += velDir * dot(pos - uCameraPosition, velDir) * uCameraSpeed * 0.16 * streakMult;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      float starSize = size;
      // Size boost for warp stretch
      if (uRouteFactors.x > 0.0) {
        starSize *= (1.0 + uRouteFactors.x * 3.0);
      }

      // Size attenuation
      float sizeAtt = 350.0 / -mvPosition.z;
      gl_PointSize = clamp(starSize * sizeAtt, 1.0, 28.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uMaxOpacity;
    varying vec3 vColor;
    varying float vOpacity;
    varying float vLayerIdx;

    void main() {
      // Shape point into radial gradient
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      float intensity = 0.0;

      if (vLayerIdx == 0.0) {
        // Distant micro-stars: sharp pinpricks
        intensity = smoothstep(0.5, 0.15, dist);
      } else if (vLayerIdx == 1.0) {
        // Mid depth: normal soft circle
        intensity = smoothstep(0.5, 0.0, dist);
      } else if (vLayerIdx == 2.0) {
        // Foreground: bright core + soft halo
        float core = smoothstep(0.12, 0.0, dist) * 0.75;
        float halo = smoothstep(0.5, 0.0, dist) * 0.25;
        intensity = core + halo;
      } else if (vLayerIdx == 3.0) {
        // Hero: bright core, soft halo, and custom diffraction flares
        float core = smoothstep(0.10, 0.0, dist) * 0.85;
        float halo = smoothstep(0.5, 0.0, dist) * 0.15;

        // Flare cross spikes
        float spikeX = smoothstep(0.025, 0.0, abs(center.x)) * smoothstep(0.5, 0.0, abs(center.y)) * 0.40;
        float spikeY = smoothstep(0.025, 0.0, abs(center.y)) * smoothstep(0.5, 0.0, abs(center.x)) * 0.40;

        // Diagonal flares (fainter)
        float d1 = abs(center.x - center.y);
        float d2 = abs(center.x + center.y);
        float spikeD1 = smoothstep(0.02, 0.0, d1) * smoothstep(0.35, 0.0, dist) * 0.18;
        float spikeD2 = smoothstep(0.02, 0.0, d2) * smoothstep(0.35, 0.0, dist) * 0.18;

        intensity = core + halo + spikeX + spikeY + spikeD1 + spikeD2;
      }

      float alpha = clamp(intensity * vOpacity * uMaxOpacity, 0.0, 1.0);
      gl_FragColor = vec4(vColor, alpha);
    }
  `
};

export const StarField = ({ quality, prefersReduced, currentPath }) => {
  const geomRef = useRef(null);
  const materialRef = useRef(null);
  const lastCamPos = useRef(new THREE.Vector3());

  // Quality settings
  const { starConfig } = quality;
  const config = starConfig || {
    distantStars: 1800,
    midStars: 420,
    foregroundStars: 70,
    brightStars: 12
  };

  const totalCount = config.distantStars + config.midStars + config.foregroundStars + config.brightStars;

  // Generate buffer attributes for all layers
  const starData = useMemo(() => {
    const positions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const sizes = new Float32Array(totalCount);
    const layerIdxs = new Float32Array(totalCount);
    const twinkleSpeeds = new Float32Array(totalCount);
    const twinklePhases = new Float32Array(totalCount);
    const parallaxFactors = new Float32Array(totalCount);

    const starColors = [
      new THREE.Color('#cce4ff'), // cool blue-white
      new THREE.Color('#eaf4ff'), // pale blue-white
      new THREE.Color('#ffffff'), // neutral white
      new THREE.Color('#f8f9fa'), // off-white
      new THREE.Color('#fff4e8'), // warm white
      new THREE.Color('#fffae6'), // soft pale yellow
      new THREE.Color('#ffdcb3'), // rare subtle orange
      new THREE.Color('#b0d2ff')  // very rare pale blue
    ];

    let cursor = 0;

    const ranges = [
      { count: config.distantStars, layer: 0, zMin: -35, zMax: -12, sizeMin: 0.06, sizeMax: 0.14, parallax: 0.015 },
      { count: config.midStars, layer: 1, zMin: -12, zMax: 4, sizeMin: 0.14, sizeMax: 0.28, parallax: 0.12 },
      { count: config.foregroundStars, layer: 2, zMin: 4, zMax: 12, sizeMin: 0.28, sizeMax: 0.52, parallax: 0.45 },
      { count: config.brightStars, layer: 3, zMin: 2, zMax: 10, sizeMin: 0.55, sizeMax: 0.90, parallax: 0.75 }
    ];

    const boxX = 60.0;
    const boxY = 40.0;

    ranges.forEach((range) => {
      for (let i = 0; i < range.count; i++) {
        // Uniform or Milky-Way-style diagonal distribution
        let x = (Math.random() - 0.5) * boxX;
        let z = Math.random() * (range.zMax - range.zMin) + range.zMin;
        let y;

        // 65% of distant micro-stars cluster along a diagonal galactic band
        if (range.layer === 0 && Math.random() < 0.65) {
          const bandCenter = x * 0.45 + z * 0.18;
          const spread = 4.5 + Math.random() * 6.5;
          y = bandCenter + (Math.random() - 0.5) * spread;
        } else {
          y = (Math.random() - 0.5) * boxY;
        }

        const idx = cursor + i;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Realistic color weighting
        let color = starColors[2]; // neutral white default
        const rand = Math.random();
        if (rand < 0.55) {
          color = starColors[Math.floor(Math.random() * 4)]; // white variants
        } else if (rand < 0.82) {
          color = starColors[4] || starColors[5]; // warm white/yellow
        } else if (rand < 0.97) {
          color = starColors[0] || starColors[7]; // cool blue-white
        } else {
          color = starColors[6]; // rare orange
        }

        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;

        // Individual size, layer index, parallax factor
        sizes[idx] = Math.random() * (range.sizeMax - range.sizeMin) + range.sizeMin;
        layerIdxs[idx] = range.layer;
        parallaxFactors[idx] = range.parallax;

        // Twinkle speed and phase
        twinkleSpeeds[idx] = (0.4 + Math.random() * 2.0);
        twinklePhases[idx] = Math.random() * Math.PI * 2;
      }
      cursor += range.count;
    });

    return { positions, colors, sizes, layerIdxs, twinkleSpeeds, twinklePhases, parallaxFactors };
  }, [config.distantStars, config.midStars, config.foregroundStars, config.brightStars, totalCount]);

  // Update uniforms in render loop
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const camPos = state.camera.position;

    // Calculate camera velocity
    const velocity = new THREE.Vector3().subVectors(camPos, lastCamPos.current);
    const speed = THREE.MathUtils.clamp(velocity.length() / 0.016, 0.0, 10.0); // estimate speed normalized
    
    lastCamPos.current.copy(camPos);

    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      uniforms.uTime.value = elapsed;
      uniforms.uCameraPosition.value.copy(camPos);
      uniforms.uCameraVelocity.value.copy(velocity);
      uniforms.uCameraSpeed.value += (speed - uniforms.uCameraSpeed.value) * 0.1; // lerp speed

      // Update comet position from scene userData
      const cometPos = state.scene.userData.cometPos;
      if (cometPos) {
        uniforms.uCometPosition.value.copy(cometPos);
      } else {
        uniforms.uCometPosition.value.set(-999, -999, -999);
      }

      // Route transition morph targets
      const path = currentPath || '/';
      const targets = {
        stretch: path === '/youtube' ? 1.0 : 0.0,
        flatten: path === '/collab' ? 1.0 : 0.0,
        grid: (path === '/git-profile' || path === '/data') ? 1.0 : 0.0,
        line: path === '/problem' ? 1.0 : 0.0
      };

      // Ease current route factors smoothly
      const currentFactors = uniforms.uRouteFactors.value;
      const easeSpeed = 0.06;
      currentFactors.x += (targets.stretch - currentFactors.x) * easeSpeed;
      currentFactors.y += (targets.flatten - currentFactors.y) * easeSpeed;
      currentFactors.z += (targets.grid - currentFactors.z) * easeSpeed;
      currentFactors.w += (targets.line - currentFactors.w) * easeSpeed;

      // Update prefersReduced
      uniforms.uPrefersReduced.value = prefersReduced ? 1.0 : 0.0;

      // Dynamic aspect ratio calculation for ultrawide screens
      const aspect = state.size.width / state.size.height;
      const boxX = 60.0 * Math.max(1.0, aspect * 0.7);
      uniforms.uBoxSize.value.set(boxX, 40.0, 40.0);
    }
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[starData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[starData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[starData.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aLayerIdx"
          args={[starData.layerIdxs, 1]}
        />
        <bufferAttribute
          attach="attributes-aTwinkleSpeed"
          args={[starData.twinkleSpeeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aTwinklePhase"
          args={[starData.twinklePhases, 1]}
        />
        <bufferAttribute
          attach="attributes-aParallaxFactor"
          args={[starData.parallaxFactors, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={StarShader.vertexShader}
        fragmentShader={StarShader.fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uCameraVelocity: { value: new THREE.Vector3() },
          uCameraSpeed: { value: 0.0 },
          uCometPosition: { value: new THREE.Vector3(-999, -999, -999) },
          uCometRadius: { value: 6.0 },
          uRouteFactors: { value: new THREE.Vector4(0, 0, 0, 0) },
          uMaxOpacity: { value: 0.95 },
          uPrefersReduced: { value: 0.0 },
          uBoxSize: { value: new THREE.Vector3(60.0, 40.0, 40.0) }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default StarField;
