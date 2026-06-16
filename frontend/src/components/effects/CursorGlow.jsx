import React from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import useDeviceTier from '../../hooks/useDeviceTier';

export const CursorGlow = () => {
  const mouse = useMousePosition();
  const tier = useDeviceTier();

  if (tier !== 'high') return null;

  return (
    <div
      className="fixed pointer-events-none w-[350px] h-[350px] rounded-full bg-amber-500/[0.03] blur-[100px] z-[1]"
      style={{
        left: `${mouse.x - 175}px`,
        top: `${mouse.y - 175}px`,
        transition: 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1), top 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    />
  );
};

export default CursorGlow;
