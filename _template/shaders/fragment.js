module.exports = `
precision mediump float;
varying vec2 vUV;
varying float vNoise;

uniform vec3 uColor;
uniform vec3 uTranslate;
uniform float isBW;


float map(float value, float start, float end, float newStart, float newEnd) {
  float percent = (value - start) / (end - start);
  if (percent < 0.0) {
    percent = 0.0;
  }
  if (percent > 1.0) {
    percent = 1.0;
  }
  float newValue = newStart + (newEnd - newStart) * percent;
  return newValue;
} 

void main() {
  float range = 10.0;
  float r = map(uTranslate.x, -range, range, 0.0, 1.0);
  float g = map(uTranslate.y, -range, range, 0.0, 1.0);
  float b = map(uTranslate.z, -range, range, 0.0, 1.0);

  
  gl_FragColor = vec4(r, g, b, 1.0);
  
  
}`
