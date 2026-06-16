import React from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

export const WebGLFallback = () => {
  const prefersReduced = useReducedMotion();

  return (
    <div className="absolute inset-0 bg-transparent overflow-hidden pointer-events-none w-full h-full">
      {/* Pulse 1 */}
      <div 
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-amber-500/5 blur-[80px] md:blur-[140px]"
        style={{
          animation: prefersReduced ? 'none' : 'pulse 8s ease-in-out infinite alternate'
        }}
      />
      
      {/* Pulse 2 */}
      <div 
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-blue-500/5 blur-[100px] md:blur-[160px]"
        style={{
          animation: prefersReduced ? 'none' : 'pulse 12s ease-in-out infinite alternate-reverse'
        }}
      />
      
      {/* Fine point CSS Grid dots */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
};

export default WebGLFallback;
