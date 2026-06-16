import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useDeviceTier from '../../hooks/useDeviceTier';
import useReducedMotion from '../../hooks/useReducedMotion';

export const MagneticButton = ({ children, className = '', onClick, type = 'button', disabled = false }) => {
  const ref = useRef(null);
  const tier = useDeviceTier();
  const prefersReduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs configuration
  const springConfig = { damping: 18, stiffness: 120, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current || tier === 'low' || prefersReduced) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Pull button up to 35% of the distance from center
    const targetX = (clientX - centerX) * 0.35;
    const targetY = (clientY - centerY) * 0.35;

    x.set(targetX);
    y.set(targetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      className={`relative select-none ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
