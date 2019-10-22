module.exports = `
#define NUM_OCTAVES 5


precision mediump float;
varying vec3 vColor;
varying vec2 vUV;
varying float vYPosition;

uniform float uTime;
uniform vec3 uTranslate;

const float PI = 3.141592653;


void main() {
  vec3 finalColor = uTranslate / 5.0 * .5 + .5;

  gl_FragColor = vec4(finalColor, 1.0);


  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 yellow = vec3(1.0, 1.0, 0.0);

  float tmp = clamp(vYPosition, 0.0, 1.0);

  finalColor = mix(red, yellow, tmp);

  gl_FragColor = vec4(finalColor, 1.0);
}`
