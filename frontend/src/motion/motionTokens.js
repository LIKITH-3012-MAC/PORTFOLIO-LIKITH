export const MOTION_TOKENS = {
  easings: {
    cinematic: [0.22, 1, 0.36, 1], // easeOutQuart
    slowInOut: [0.76, 0, 0.24, 1], // easeInOutQuart
    magnetic: [0.25, 1, 0.5, 1], // smooth dampening
  },
  durations: {
    fast: 0.35,
    default: 0.65,
    slow: 1.25,
    transition: 0.8
  },
  staggers: {
    fast: 0.05,
    default: 0.1,
    slow: 0.2
  }
};

export default MOTION_TOKENS;
