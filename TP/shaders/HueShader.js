export const HueShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'hue': { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float hue;
    varying vec2 vUv;

    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0., -1./3., 2./3., -1.);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6. * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp( abs(mod(c.x * 6. + vec3(0.,4.,2.), 6.) - 3.) - 1., 0., 1.);
      rgb = rgb * rgb * (3. - 2. * rgb);
      return c.z * mix(vec3(1.), rgb, c.y);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec3 hsv = rgb2hsv(color.rgb);
      hsv.x += hue; // rotate hue
      hsv.x = fract(hsv.x);
      color.rgb = hsv2rgb(hsv);
      // boost saturation
      color.rgb = mix(vec3(dot(color.rgb, vec3(0.3))), color.rgb, 1.3);
      gl_FragColor = color;
    }
  `
};
