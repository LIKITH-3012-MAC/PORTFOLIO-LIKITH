import React from 'react';

// Upgraded multi-layered cinematic CSS fallback background
export const SolarFallback = () => {
  // Generate random stats for star populations
  const layers = [
    { count: 120, size: 1, color: '#eaf4ff', minDelay: 0, maxDelay: 5, minDuration: 4, maxDuration: 8, opacity: 0.45 },
    { count: 45, size: 2, color: '#ffffff', minDelay: 0, maxDelay: 6, minDuration: 6, maxDuration: 10, opacity: 0.75 },
    { count: 12, size: 3.5, color: '#fff5e6', minDelay: 0, maxDelay: 8, minDuration: 8, maxDuration: 14, opacity: 0.95, glow: true }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.16) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.04) 0%, transparent 35%),
          linear-gradient(135deg, #03050c 0%, #060918 50%, #03050a 100%)
        `
      }}
    >
      {/* Galactic diagonal cloud overlay */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.01) 40%, transparent 70%)',
          transform: 'rotate(-25deg)',
          pointerEvents: 'none'
        }}
      />

      {/* Procedural multi-layer stars */}
      {layers.map((layer, lIdx) => 
        Array.from({ length: layer.count }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = layer.minDelay + Math.random() * (layer.maxDelay - layer.minDelay);
          const duration = layer.minDuration + Math.random() * (layer.maxDuration - layer.minDuration);
          const shadow = layer.glow ? `0 0 8px ${layer.color}, 0 0 15px rgba(255, 255, 255, 0.6)` : 'none';

          return (
            <div
              key={`${lIdx}-${i}`}
              style={{
                position: 'absolute',
                width: `${layer.size}px`,
                height: `${layer.size}px`,
                borderRadius: '50%',
                background: layer.color,
                boxShadow: shadow,
                opacity: layer.opacity * (0.3 + Math.random() * 0.7),
                top: `${top}%`,
                left: `${left}%`,
                animation: `solar-fallback-twinkle-${lIdx} ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                transform: 'translateZ(0)'
              }}
            />
          );
        })
      )}

      {/* Shooting star falling randomly (CSS-based) */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={`css-shooting-${i}`}
          className={`css-shooting-star-${i}`}
          style={{
            position: 'absolute',
            width: '120px',
            height: '1.5px',
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%)',
            top: `${10 + Math.random() * 30}%`,
            left: `${10 + Math.random() * 60}%`,
            opacity: 0,
            transform: 'rotate(-35deg) translate3d(0, 0, 0)',
            animation: `solar-fallback-shooting ${12 + i * 8}s linear infinite`,
            animationDelay: `${4 + i * 6}s`,
            transformOrigin: 'left center',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Global CSS animations keyframes */}
      <style>{`
        @keyframes solar-fallback-twinkle-0 {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.50; }
        }
        @keyframes solar-fallback-twinkle-1 {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.85; }
        }
        @keyframes solar-fallback-twinkle-2 {
          0%, 100% { opacity: 0.45; transform: scale(0.9) translateZ(0); }
          50% { opacity: 1.0; transform: scale(1.15) translateZ(0); }
        }
        @keyframes solar-fallback-shooting {
          0% { opacity: 0; transform: rotate(-30deg) translate3d(0, 0, 0); }
          2% { opacity: 0.8; transform: rotate(-30deg) translate3d(250px, 150px, 0); }
          4%, 100% { opacity: 0; transform: rotate(-30deg) translate3d(300px, 180px, 0); }
        }
      `}</style>
    </div>
  );
};

export default SolarFallback;
