import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function PerformanceMonitor({ downgradeQuality }) {
  const perfRef = useRef({
    frames: 0,
    lastTime: 0,
    lowFpsStreak: 0
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 1000;
    const p = perfRef.current;

    if (p.lastTime === 0) {
      p.lastTime = time;
      return;
    }

    p.frames++;

    // Sample every 1000 milliseconds
    if (time > p.lastTime + 1000) {
      const elapsed = time - p.lastTime;
      const fps = Math.round((p.frames * 1000) / elapsed);

      if (fps < 38) {
        p.lowFpsStreak++;
        // Trigger downgrade if low frame rates persist for 3 samples (3 seconds)
        if (p.lowFpsStreak >= 3) {
          downgradeQuality();
          p.lowFpsStreak = 0;
        }
      } else {
        p.lowFpsStreak = Math.max(0, p.lowFpsStreak - 1);
      }

      p.frames = 0;
      p.lastTime = time;
    }
  });

  return null;
}

export default PerformanceMonitor;
