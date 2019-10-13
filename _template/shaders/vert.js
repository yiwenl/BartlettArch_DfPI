module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec2 vUV;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
  vUV = aUV;
}`
