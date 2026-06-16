import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop triggers scroll reset on page transition events.
 * Compatible with global Lenis instance or standard window.scrollTo.
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset window scroll position
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
