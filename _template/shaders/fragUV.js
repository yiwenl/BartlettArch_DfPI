module.exports = `
precision mediump float;
varying vec2 vUV;


uniform sampler2D texture;

void main() {
  vec4 color = texture2D(texture, vUV);;

  gl_FragColor = color;
}`
