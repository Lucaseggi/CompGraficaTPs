export const RippleShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'time': { value: 0 }
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
      float ripple = 0.03 * sin(30.0 * vUv.y + time * 10.0);
      vec2 uv = vUv + vec2(ripple, 0.0);

      vec4 color = texture2D(tDiffuse, uv);

      // Brightness & Saturation boost
      float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
      color.rgb = mix(vec3(gray), color.rgb * 1.2, 1.4);

      // Add noise
      float noise = rand(vUv * time) * 0.05;
      color.rgb += noise;

      gl_FragColor = color;
    }
  `
};
