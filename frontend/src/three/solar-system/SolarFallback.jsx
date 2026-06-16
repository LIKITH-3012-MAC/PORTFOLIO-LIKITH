import React from 'react';

// CSS-only fallback for devices that can't run WebGL
export const SolarFallback = () => {
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
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(30, 15, 60, 0.6) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(10, 30, 70, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 150, 50, 0.05) 0%, transparent 30%),
          linear-gradient(180deg, #060612 0%, #0a0a1a 40%, #08081a 100%)
        `
      }}
    >
      {/* CSS stars */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            borderRadius: '50%',
            background: '#ffffff',
            opacity: 0.3 + Math.random() * 0.5,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `solar-fallback-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
      <style>{`
        @keyframes solar-fallback-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default SolarFallback;
