import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useDeviceTier from '../../hooks/useDeviceTier';
import useReducedMotion from '../../hooks/useReducedMotion';

export const MagneticIcon = ({ children, className = '' }) => {
  const ref = useRef(null);
  const tier = useDeviceTier();
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 14, stiffness: 140 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current || tier === 'low' || prefersReduced) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Shift icons up to 40% of the distance from the pointer
    const targetX = (clientX - centerX) * 0.4;
    const targetY = (clientY - centerY) * 0.4;

    x.set(targetX);
    y.set(targetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      className={`inline-block select-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MagneticIcon;
