import React, { useEffect, useState } from 'react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalScroll = document.documentElement.scrollHeight - window.innerHeight;

    const handleResize = () => {
      totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (totalScroll > 0) {
            setProgress((window.scrollY / totalScroll) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[100] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-white shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-75 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};

export default ScrollProgress;
