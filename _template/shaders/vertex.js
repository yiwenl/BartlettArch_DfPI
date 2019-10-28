module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;
attribute vec3 aTranslate;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uTranslate;

varying vec2 vUV;
varying float vNoise;



void main() {
  vec3 pos = aPosition * 0.1;
  pos += aTranslate;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vUV = aUV;
}`
