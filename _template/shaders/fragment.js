module.exports = `
precision mediump float;
varying vec2 vUV;

void main() {
  gl_FragColor = vec4(vUV, 1.0, 1.0);
}`
