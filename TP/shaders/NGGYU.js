export const NGGYU = {
  uniforms: {
    'tDiffuse': { value: null },
    'offset': { value: 1.0 },
    'darkness': { value: 1.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;

    float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
    float shift = 0.01 * sin(time * 30.0);

    vec2 redUV = vUv + vec2(shift, 0.0);
    vec2 greenUV = vUv + vec2(-shift, 0.0);
    vec2 blueUV = vUv;

    vec3 color = vec3(
        texture2D(tDiffuse, redUV).r,
        texture2D(tDiffuse, greenUV).g,
        texture2D(tDiffuse, blueUV).b
    );

    // Glitch horizontal bars
    float glitchHeight = 0.02;
    float glitch = step(0.5, fract(vUv.y / glitchHeight + time * 10.0)) * 0.1;
    color += glitch;

    // Scanlines
    float scanline = 0.1 * sin(vUv.y * 800.0);
    color -= scanline;

    gl_FragColor = vec4(color, 1.0);
    }`
};
