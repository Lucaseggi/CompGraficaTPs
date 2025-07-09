import * as THREE from 'three';

export const DitherShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;

    float bayerDither4x4(vec2 position) {
      int x = int(mod(position.x, 4.0));
      int y = int(mod(position.y, 4.0));

      int index = x + y * 4;

      float[16] bayer = float[16](
         0.0,  8.0,  2.0, 10.0,
        12.0,  4.0, 14.0,  6.0,
         3.0, 11.0,  1.0,  9.0,
        15.0,  7.0, 13.0,  5.0
      );

      return bayer[index] / 16.0;
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      vec2 pixelPos = gl_FragCoord.xy;
      float threshold = bayerDither4x4(pixelPos);

      color.rgb = floor(color.rgb + threshold);

      gl_FragColor = color;
    }
  `
};