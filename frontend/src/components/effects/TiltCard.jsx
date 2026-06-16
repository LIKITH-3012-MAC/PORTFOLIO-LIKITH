import React, { useState, useRef } from 'react';
import useDeviceTier from '../../hooks/useDeviceTier';

export const TiltCard = ({ children, className = '' }) => {
  const tier = useDeviceTier();
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isHighTier = tier === 'high';

  const handleMouseMove = (e) => {
    if (!isHighTier || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    if (isHighTier) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isHighTier) {
      setIsHovered(false);
      setCoords({ x: 0, y: 0 });
    }
  };

  const cardStyle = {};
  if (isHighTier && isHovered && cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect();
    const rotateX = -((coords.y - rect.height / 2) / rect.height) * 8; // max 8 deg tilt
    const rotateY = ((coords.x - rect.width / 2) / rect.width) * 8;   // max 8 deg tilt
    
    cardStyle.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    cardStyle.transition = 'transform 0.1s ease-out';
  } else {
    cardStyle.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    cardStyle.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={cardStyle}
    >
      {/* Cursor spotlight follow */}
      {isHighTier && isHovered && (
        <div
          className="absolute pointer-events-none rounded-full w-[240px] h-[240px] bg-amber-500/10 blur-[80px]"
          style={{
            left: `${coords.x - 120}px`,
            top: `${coords.y - 120}px`,
            transition: 'left 0.1s ease-out, top 0.1s ease-out'
          }}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
