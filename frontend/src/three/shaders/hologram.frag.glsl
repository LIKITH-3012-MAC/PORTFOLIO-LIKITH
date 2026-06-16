uniform vec3 uColor;
uniform float uTime;
uniform float uSpeed;
uniform float uScanlines;
uniform float uGlow;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // Sinusoidal scanlines moving over time
  float scanline = sin(vUv.y * uScanlines - uTime * uSpeed) * 0.5 + 0.5;
  
  // Edge detection/fresnel simulation
  float edge = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
  edge = pow(edge, 2.5) * uGlow;
  
  // Combine alpha factors
  float alpha = (scanline * 0.3 + edge * 0.7) * 0.4;
  
  vec3 finalColor = uColor + vec3(scanline * 0.15);
  
  gl_FragColor = vec4(finalColor, alpha);
}
