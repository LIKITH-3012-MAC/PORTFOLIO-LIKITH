uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uFresnelBias;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  
  // Calculate Fresnel term
  float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(0.0, dot(normal, viewDir)), uFresnelPower);
  
  // Dynamic color mix based on normal height
  vec3 baseColor = mix(uColor1, uColor2, normal.y * 0.5 + 0.5);
  
  // Holographic laser sweep scanning stripe
  float scan = smoothstep(0.04, 0.0, abs(fract(vPosition.y * 0.35 - uTime * 0.22) - 0.5));
  vec3 scanGlow = vec3(scan) * uColor1 * 1.6;
  
  // Edge highlight glow + scanning sweep
  vec3 finalColor = baseColor + vec3(fresnel) * uColor1 + scanGlow;
  
  gl_FragColor = vec4(finalColor, 0.35 + fresnel * 0.65 + scan * 0.3);
}
