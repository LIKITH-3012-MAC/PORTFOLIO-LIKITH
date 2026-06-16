import React from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

export const CosmicFallback = () => {
  const prefersReduced = useReducedMotion();

  // Generate 50 static random stars for fallback
  const fallbackStars = React.useMemo(() => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 4 + 2
      });
    }
    return stars;
  }, []);

  return (
    <div className="cosmic-background cosmic-fallback">
      {/* Background Nebulae Glow */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-500/[0.03] blur-[120px]"
        style={{
          animation: prefersReduced ? 'none' : 'float-nebula 25s ease-in-out infinite alternate'
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/[0.04] blur-[150px]"
        style={{
          animation: prefersReduced ? 'none' : 'float-nebula 35s ease-in-out infinite alternate-reverse'
        }}
      />

      {/* SVG Stars */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        {fallbackStars.map((star) => (
          <circle
            key={star.id}
            cx={star.left}
            cy={star.top}
            r={star.size}
            fill="#ffffff"
            opacity={star.opacity}
            style={{
              transformOrigin: `${star.left} ${star.top}`,
              animation: prefersReduced ? 'none' : `twinkle ${star.duration}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </svg>

      {/* Fine point CSS Grid dots */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default CosmicFallback;
