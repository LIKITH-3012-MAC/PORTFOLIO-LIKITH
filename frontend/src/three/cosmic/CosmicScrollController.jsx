import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COSMIC_SECTION_METRICS } from './cosmicConfig';

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'founder', 'contact'];

export const CosmicScrollController = ({ quality }) => {
  const scrollRef = useRef({
    currentScroll: 0,
    targetScroll: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.targetScroll = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const s = scrollRef.current;
    
    // Smooth scroll interpolation
    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.08;

    const isMobile = window.innerWidth <= 768;
    const layout = isMobile ? COSMIC_SECTION_METRICS.mobile : COSMIC_SECTION_METRICS.desktop;

    // Build scroll intervals dynamically
    const offsets = [0];
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        offsets.push(el.offsetTop);
      } else {
        // Fallback interval mapping if element is missing
        offsets.push(offsets[offsets.length - 1] + window.innerHeight);
      }
    });

    const scrollVal = s.currentScroll;
    let sectionIdx = 0;
    let progress = 0;

    for (let i = 0; i < offsets.length - 1; i++) {
      if (scrollVal >= offsets[i] && scrollVal <= offsets[i + 1]) {
        sectionIdx = i;
        const range = offsets[i + 1] - offsets[i];
        progress = range > 0 ? (scrollVal - offsets[i]) / range : 0;
        break;
      }
    }

    if (scrollVal > offsets[offsets.length - 1]) {
      sectionIdx = offsets.length - 2;
      progress = 1.0;
    }

    const keys = ['hero', 'about', 'experience', 'projects', 'skills', 'founder', 'contact'];
    const currentKey = keys[sectionIdx];
    const nextKey = keys[Math.min(sectionIdx + 1, keys.length - 1)];

    const currentConf = layout[currentKey];
    const nextConf = layout[nextKey];

    // Linear interpolation of scene coordinates
    const targetX = THREE.MathUtils.lerp(currentConf.pos[0], nextConf.pos[0], progress);
    const targetY = THREE.MathUtils.lerp(currentConf.pos[1], nextConf.pos[1], progress);
    const targetZ = THREE.MathUtils.lerp(currentConf.pos[2], nextConf.pos[2], progress);
    const targetScale = THREE.MathUtils.lerp(currentConf.scale, nextConf.scale, progress);
    const targetCamZ = THREE.MathUtils.lerp(currentConf.camZ, nextConf.camZ, progress);
    
    // Store scroll progress metrics in scene userData for adjacent components (NeuralCore, ParticleField)
    state.scene.userData.sectionIdx = sectionIdx;
    state.scene.userData.progress = progress;
    state.scene.userData.scrollProgress = sectionIdx + progress;

    // Apply interpolated vectors to the central intelligence object
    state.scene.traverse((child) => {
      if (child.isGroup && child.name === 'main-intelligence-group') {
        child.position.set(targetX, targetY, targetZ);
        child.scale.set(targetScale, targetScale, targetScale);
      }
    });

    // Interpolate camera viewport depth
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.08;
  });

  return null;
};

export default CosmicScrollController;
