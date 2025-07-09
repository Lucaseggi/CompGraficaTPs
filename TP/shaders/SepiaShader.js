export const SepiaShader = {
  uniforms: {
    'tDiffuse': { value: null }
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
      vec4 color = texture2D(tDiffuse, vUv);

      // Sepia
      float r = color.r;
      float g = color.g;
      float b = color.b;
      color.r = dot(vec3(r, g, b), vec3(0.393, 0.769, 0.189));
      color.g = dot(vec3(r, g, b), vec3(0.349, 0.686, 0.168));
      color.b = dot(vec3(r, g, b), vec3(0.272, 0.534, 0.131));

      // Film grain noise
      float grain = rand(vUv * time) * 0.1;
      color.rgb += grain;

      // Vignette
      float dist = distance(vUv, vec2(0.5));
      float vig = smoothstep(0.8, 1.0, dist);
      color.rgb *= 1.0 - vig;

      gl_FragColor = color;
    }
  `
};
