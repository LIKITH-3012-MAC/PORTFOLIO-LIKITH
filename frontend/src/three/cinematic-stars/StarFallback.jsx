import React, { useMemo } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

export const StarFallback = () => {
  const prefersReduced = useReducedMotion();

  // Generate deterministic random properties for CSS stars
  const stars = useMemo(() => {
    const starTypes = [
      { size: 1, color: '#e0f2fe', count: 50, twinkle: 'twinkle-slow' }, // small blue-white
      { size: 2, color: '#ffffff', count: 20, twinkle: 'twinkle-mid' },  // mid white
      { size: 3, color: '#fef3c7', count: 6, twinkle: 'twinkle-fast' }   // large warm gold
    ];

    const list = [];
    let id = 0;

    starTypes.forEach((type) => {
      for (let i = 0; i < type.count; i++) {
        list.push({
          id: id++,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: type.size,
          color: type.color,
          twinkle: type.twinkle,
          delay: Math.random() * 5
        });
      }
    });

    return list;
  }, []);

  return (
    <div className="absolute inset-0 bg-[#04060c] overflow-hidden pointer-events-none w-full h-full">
      {/* 1. Deep Space Cosmic Nebula Gradients */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle at 35% 30%, rgba(30, 48, 110, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 65% 70%, rgba(76, 29, 142, 0.20) 0%, transparent 65%),
            radial-gradient(circle at 50% 50%, rgba(135, 75, 20, 0.08) 0%, transparent 70%)
          `
        }}
      />

      {/* 2. Embedded Inline Styling for Twinkle and Shooting Keyframes */}
      <style>{`
        @keyframes twinkle-slow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }
        @keyframes twinkle-mid {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.95; }
        }
        @keyframes twinkle-fast {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1.0; }
        }
        @keyframes cssShootingStar {
          0% {
            transform: translate3d(-100px, -100px, 0) rotate(-35deg);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          8% {
            transform: translate3d(500px, 320px, 0) rotate(-35deg);
            opacity: 0;
          }
          100% {
            transform: translate3d(500px, 320px, 0) rotate(-35deg);
            opacity: 0;
          }
        }
        .twinkle-slow { animation: twinkle-slow 5s ease-in-out infinite; }
        .twinkle-mid { animation: twinkle-mid 3.5s ease-in-out infinite; }
        .twinkle-fast { animation: twinkle-fast 2.2s ease-in-out infinite; }
        .css-shooting-star {
          position: absolute;
          width: 90px;
          height: 1.5px;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%);
          transform: rotate(-35deg);
          pointer-events: none;
          opacity: 0;
        }
      `}</style>

      {/* 3. Shooting Stars Layer */}
      {!prefersReduced && (
        <>
          <div 
            className="css-shooting-star"
            style={{
              top: '12%',
              left: '20%',
              animation: 'cssShootingStar 12s linear infinite',
              animationDelay: '1.5s'
            }}
          />
          <div 
            className="css-shooting-star"
            style={{
              top: '40%',
              left: '45%',
              animation: 'cssShootingStar 18s linear infinite',
              animationDelay: '6.0s'
            }}
          />
        </>
      )}

      {/* 4. Fine Static Grid Layer */}
      <div 
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* 5. Twinkling Stars Layers */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${prefersReduced ? '' : star.twinkle}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: star.size === 3 ? `0 0 4px ${star.color}` : 'none',
            animationDelay: prefersReduced ? '0s' : `${star.delay}s`,
            opacity: prefersReduced ? 0.7 : undefined
          }}
        />
      ))}
    </div>
  );
};

export default StarFallback;
