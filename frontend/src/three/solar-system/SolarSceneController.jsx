import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_SECTION_METRICS } from './solarConfig';

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'founder', 'contact'];
const SECTION_KEYS = ['hero', 'about', 'experience', 'projects', 'skills', 'founder', 'contact'];

export const SolarSceneController = ({ quality }) => {
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
    const layout = isMobile ? SOLAR_SECTION_METRICS.mobile : SOLAR_SECTION_METRICS.desktop;

    // Build scroll intervals from DOM section offsets
    const offsets = [0];
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        offsets.push(el.offsetTop);
      } else {
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

    const currentKey = SECTION_KEYS[sectionIdx];
    const nextKey = SECTION_KEYS[Math.min(sectionIdx + 1, SECTION_KEYS.length - 1)];

    const currentConf = layout[currentKey];
    const nextConf = layout[nextKey];

    if (!currentConf || !nextConf) return;

    // Smoothed section interpolation
    const targetX = THREE.MathUtils.lerp(currentConf.pos[0], nextConf.pos[0], progress);
    const targetY = THREE.MathUtils.lerp(currentConf.pos[1], nextConf.pos[1], progress);
    const targetZ = THREE.MathUtils.lerp(currentConf.pos[2], nextConf.pos[2], progress);
    const targetScale = THREE.MathUtils.lerp(currentConf.scale, nextConf.scale, progress);
    const targetCamZ = THREE.MathUtils.lerp(currentConf.camZ, nextConf.camZ, progress);

    // Store scroll metrics in scene userData for components to reference
    state.scene.userData.sectionIdx = sectionIdx;
    state.scene.userData.progress = progress;
    state.scene.userData.scrollProgress = sectionIdx + progress;

    // Apply to the solar system group
    state.scene.traverse((child) => {
      if (child.isGroup && child.name === 'solar-system-group') {
        child.position.x += (targetX - child.position.x) * 0.06;
        child.position.y += (targetY - child.position.y) * 0.06;
        child.position.z += (targetZ - child.position.z) * 0.06;
        const s = child.scale.x + (targetScale - child.scale.x) * 0.06;
        child.scale.set(s, s, s);
      }
    });

    // Interpolate camera depth
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.06;
  });

  return null;
};

export default SolarSceneController;
