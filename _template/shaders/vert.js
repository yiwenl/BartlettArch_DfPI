module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 color;

uniform float uTime;

varying vec3 vColor;

void main() {
  // create holder for position
  vec3 pos = aPosition; 

  // add the time to the 'x' only
  // pos.x += uTime;

  float movingRange = 0.5;
  pos.x += sin(uTime) * movingRange;
  pos.y += cos(uTime) * movingRange;
  // sin goes from -1 ~ 1

  gl_Position = vec4(pos, 1.0);
  vColor = color;
}`
