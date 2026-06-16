export const PLANET_TEXTURES = {
  mercury: {
    color: "/textures/planets/mercury/mercury-color.jpg",
    bump: "/textures/planets/mercury/mercury-bump.jpg"
  },
  venus: {
    color: "/textures/planets/venus/venus-color.jpg",
    bump: "/textures/planets/venus/venus-bump.jpg"
  },
  earth: {
    color: "/textures/planets/earth/earth-color.jpg",
    bump: "/textures/planets/earth/earth-bump.jpg",
    clouds: "/textures/planets/earth/earth-clouds.jpg"
  },
  mars: {
    color: "/textures/planets/mars/mars-color.jpg",
    bump: "/textures/planets/mars/mars-bump.jpg"
  },
  jupiter: {
    color: "/textures/planets/jupiter/jupiter-color.jpg"
  },
  saturn: {
    color: "/textures/planets/saturn/saturn-color.jpg",
    ringColor: "/textures/planets/saturn/saturn-ring-color.jpg",
    ringPattern: "/textures/planets/saturn/saturn-ring-pattern.gif"
  },
  uranus: {
    color: "/textures/planets/uranus/uranus-color.jpg",
    ringColor: "/textures/planets/uranus/uranus-ring-color.jpg",
    ringPattern: "/textures/planets/uranus/uranus-ring-pattern.gif"
  },
  neptune: {
    color: "/textures/planets/neptune/neptune-color.jpg",
    ringColor: "/textures/planets/uranus/uranus-ring-color.jpg", // reuse Uranus as a fallback to avoid 404
    ringPattern: "/textures/planets/uranus/uranus-ring-pattern.gif" // reuse Uranus as a fallback to avoid 404
  },
  moon: {
    color: "/textures/planets/moon/moon-color.jpg"
  }
};

export default PLANET_TEXTURES;
