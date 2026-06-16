import { useEffect } from 'react';

/**
 * Hook to lock scrolling on document.body.
 * Respects and integrates with global Lenis scrolling if initialized on window.lenis.
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      if (window.lenis) {
        window.lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isLocked]);
}

export default useBodyScrollLock;
