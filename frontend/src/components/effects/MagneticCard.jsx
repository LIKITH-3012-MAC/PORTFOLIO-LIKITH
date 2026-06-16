import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useDeviceTier from '../../hooks/useDeviceTier';
import useReducedMotion from '../../hooks/useReducedMotion';

export const MagneticCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const tier = useDeviceTier();
  const prefersReduced = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Position springs (Magnetic pull)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 22, stiffness: 90 });
  const springY = useSpring(y, { damping: 22, stiffness: 90 });

  // Spotlight positioning
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [showSpotlight, setShowSpotlight] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current || tier === 'low' || prefersReduced) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Magnetic translation offset (pull card up to 10% toward cursor)
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const pullX = (clientX - centerX) * 0.1;
    const pullY = (clientY - centerY) * 0.1;
    x.set(pullX);
    y.set(pullY);

    // 3D perspective rotation (max 6 degrees tilt)
    const relX = clientX - left;
    const relY = clientY - top;
    const rotX = ((relY - height / 2) / (height / 2)) * -6;
    const rotY = ((relX - width / 2) / (width / 2)) * 6;
    setRotateX(rotX);
    setRotateY(rotY);

    // Spotlight glow positioning
    setSpotlightPos({ x: relX, y: relY });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setRotateX(0);
    setRotateY(0);
    setShowSpotlight(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowSpotlight(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic spotlight hover overlay */}
      {showSpotlight && tier !== 'low' && (
        <div
          className="absolute pointer-events-none rounded-full w-[240px] h-[240px] bg-amber-500/[0.04] blur-[50px]"
          style={{
            left: `${spotlightPos.x - 120}px`,
            top: `${spotlightPos.y - 120}px`,
          }}
        />
      )}
      <div style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default MagneticCard;
