import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_SECTION_METRICS } from '../../three/solar-system/solarConfig';
import { getCometPosition } from './IntroComet';

export const IntroSceneController = ({ introActive, introTime, onIntroComplete }) => {
  const lookTargetRef = useRef(new THREE.Vector3(32, 8, 22));

  useFrame((state, delta) => {
    if (!introActive) return;

    // Advance intro timer
    introTime.current += delta;
    const t = introTime.current;

    const isMobile = window.innerWidth <= 768;
    const layout = isMobile ? SOLAR_SECTION_METRICS.mobile : SOLAR_SECTION_METRICS.desktop;
    const heroConf = layout.hero;

    let targetCamPos = new THREE.Vector3();
    let targetLookTarget = new THREE.Vector3();
    let targetGroupPos = new THREE.Vector3();
    let targetGroupScale = 1.0;
    let bankAngle = 0.0;

    const cometPos = getCometPosition(t);
    const saturnPos = new THREE.Vector3(10.2, 0.0, 12.3);
    const sunPos = new THREE.Vector3(0.0, 0.0, 0.0);

    if (t < 0.35) {
      // 1. Deep Space Ignition (0.00s - 0.35s)
      const progress = t / 0.35;
      targetCamPos.set(32, 10, 26).lerp(new THREE.Vector3(29, 8.5, 22), progress);
      targetLookTarget.copy(cometPos);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 0.55;
    } else if (t < 0.9) {
      // 2. Comet Lock-on & Catch Up (0.35s - 0.90s)
      const progress = (t - 0.35) / 0.55;
      
      // Close foreground sweep at t = 0.6
      let sweepCam;
      if (progress < 0.45) {
        const p = progress / 0.45;
        sweepCam = new THREE.Vector3(29, 8.5, 22).lerp(new THREE.Vector3(24.5, 5.0, 10.0), p);
      } else {
        const p = (progress - 0.45) / 0.55;
        sweepCam = new THREE.Vector3(24.5, 5.0, 10.0).lerp(new THREE.Vector3(13.5, 5.2, 18.2), p);
      }
      targetCamPos.copy(sweepCam);
      targetLookTarget.copy(cometPos);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 0.55 + progress * 0.45; // Grow from 0.55 to 1.0
    } else if (t < 1.2) {
      // 3. Saturn Entry Approach (0.90s - 1.20s)
      const progress = (t - 0.9) / 0.3;
      targetCamPos.copy(cometPos).add(new THREE.Vector3(-3.0, 1.2, 3.2));
      targetLookTarget.copy(cometPos);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else if (t < 1.75) {
      // 4. Saturn Slingshot Curve (1.20s - 1.75s)
      const progress = (t - 1.2) / 0.55;
      
      // Camera path orbiting around Saturn as comet curves
      const startCam = new THREE.Vector3(15.5, 3.2, 17.2);
      const midCam = new THREE.Vector3(9.5, 2.5, 14.5);
      const endCam = new THREE.Vector3(5.5, 0.2, 7.5);
      
      if (progress < 0.5) {
        const p = progress / 0.5;
        targetCamPos.lerpVectors(startCam, midCam, p);
      } else {
        const p = (progress - 0.5) / 0.5;
        targetCamPos.lerpVectors(midCam, endCam, p);
      }

      // Blend look-at target to frame both comet and Saturn bulk
      const blend = Math.sin(progress * Math.PI);
      targetLookTarget.lerpVectors(cometPos, saturnPos, blend * 0.38);
      
      // Bank camera to simulate flight roll
      bankAngle = -Math.sin(progress * Math.PI) * 0.16;
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else if (t < 2.15) {
      // 5. Sun Dive & Energy Accumulation (1.75s - 2.15s)
      const progress = (t - 1.75) / 0.4;
      targetCamPos.lerpVectors(new THREE.Vector3(5.5, 0.2, 7.5), new THREE.Vector3(0.0, 1.5, 8.5), progress);
      
      // Blend look-at target from comet to Sun
      targetLookTarget.lerpVectors(cometPos, sunPos, progress * 0.5);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else if (t < 2.55) {
      // 6. Time Dilation Hero Deceleration & Shockwave (2.15s - 2.55s)
      const progress = (t - 2.15) / 0.4;
      const ease = 1 - Math.pow(1 - progress, 3);
      targetCamPos.lerpVectors(new THREE.Vector3(0.0, 1.5, 8.5), new THREE.Vector3(0.0, 0.4, 6.2), ease);
      targetLookTarget.set(0.0, 0.2, 3.0);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else if (t < 3.15) {
      // 7. Title Formation (2.55s - 3.15s)
      const progress = (t - 2.55) / 0.6;
      targetCamPos.set(0.0, 0.4 - progress * 0.2, 6.2 - progress * 0.4);
      targetLookTarget.set(0.0, 0.2, 3.0);
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else if (t < 3.55) {
      // 8. Title Portal Gateway Dive (3.15s - 3.55s)
      const progress = (t - 3.15) / 0.4;
      const ease = progress * progress; // Accelerate through portal
      targetCamPos.set(0.0, 0.2, 5.8).lerp(new THREE.Vector3(0.0, 0.0, 2.5), ease);
      targetLookTarget.set(0.0, 0.0, -10.0); // look straight forward
      
      targetGroupPos.set(0, 0, 0);
      targetGroupScale = 1.0;
    } else {
      // 9. Hero Handoff (3.55s - 4.00s)
      const progress = Math.min(1.0, (t - 3.55) / 0.45);
      const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic

      // Transition camera to hero configurations
      targetCamPos.set(0.0, 0.0, 2.5).lerp(new THREE.Vector3(0, 0, heroConf.camZ), ease);
      targetLookTarget.set(0.0, 0.0, -10.0).lerp(new THREE.Vector3(0, 0, 0), ease);

      // Transition solar system group coordinates to hero
      const endGrp = new THREE.Vector3(heroConf.pos[0], heroConf.pos[1], heroConf.pos[2]);
      targetGroupPos.set(0, 0, 0).lerp(endGrp, ease);
      targetGroupScale = THREE.MathUtils.lerp(1.0, heroConf.scale, ease);

      if (t >= 4.0) {
        onIntroComplete();
      }
    }

    // Apply camera banking roll
    if (Math.abs(bankAngle) > 0.001) {
      state.camera.up.set(Math.sin(bankAngle), Math.cos(bankAngle), 0);
    } else {
      state.camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.08);
    }

    // Update lookTarget and direct camera
    lookTargetRef.current.lerp(targetLookTarget, 0.08);
    state.camera.position.lerp(targetCamPos, 0.08);
    state.camera.lookAt(lookTargetRef.current);

    // Apply group position and scale
    state.scene.traverse((child) => {
      if (child.isGroup && child.name === 'solar-system-group') {
        child.position.lerp(targetGroupPos, 0.08);
        const s = THREE.MathUtils.lerp(child.scale.x, targetGroupScale, 0.08);
        child.scale.set(s, s, s);
      }
    });
  });

  return null;
};

export default IntroSceneController;
