import MOTION_TOKENS from './motionTokens';

export const staggerTimeline = (staggerVal = MOTION_TOKENS.staggers.default) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerVal
    }
  }
});

export const revealTimeline = (duration = MOTION_TOKENS.durations.default) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: MOTION_TOKENS.easings.cinematic
    }
  }
});

export default {
  staggerTimeline,
  revealTimeline
};
